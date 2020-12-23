import { map as mapAsync } from 'async'
import { v4 as uuid } from 'uuid'
import { logger } from '../../core'

import { BetAgainst, BetStatus } from '../bet'
import { UseCase } from '../use-case'
import { EventType } from './event-type'

export class CreateEventUseCase extends UseCase {
  constructor({
    betRepository,
    bettorRepository,
    eventRepository,
    matchRepository,
    babybetAttractionRepository
  }) {
    super()
    this.betRepository = betRepository
    this.bettorRepository = bettorRepository
    this.eventRepository = eventRepository
    this.matchRepository = matchRepository
    this.babybetAttractionRepository = babybetAttractionRepository
  }

  async execute({ event, onNotFound, onSuccess }) {
    logger.debug(event)

    const match = await this.matchRepository.get(event.match)
    if (!match) {
      return onNotFound(`The match ${event.match} was not found`)
    }

    const created = await this.eventRepository.create({
      ...event,
      id: uuid(),
      createdAt: new Date().toJSON()
    })

    switch (event.type) {
      case EventType.GOAL_SCORED:
        await this.onGoalScored(event)
        break
      case EventType.MATCH_WON:
        await this.onMatchWon(event)
        break
      default:
        break
    }

    return onSuccess(created)
  }

  async onGoalScored(event) {
    const bets = await this.betRepository.find({
      where: {
        event: event.type,
        match: event.match,
        status: BetStatus.ONGOING
      }
    })
    return mapAsync(bets, async (bet) => {
      console.log(bet.team, event.team)
      const isSuccessful = bet.team === event.team
      logger.debug(
        'onGoalScored',
        `bet.team: ${bet.team}`,
        `event.team: ${event.team}`,
        `isSuccessful: ${isSuccessful}`
      )
      const [bettorOp, takersOp] = isSuccessful
        ? [sum, diffOrZero]
        : [diffOrZero, sum]

      // TODO: rendre symétrique le gain/perte de points
      await this.betRepository.update(bet.id, {
        status: isSuccessful ? BetStatus.SUCCEEDED : BetStatus.FAILED
      })

      // C CRADO
      let bettor = await this.bettorRepository.get(bet.bettor.id)
      await this.bettorRepository.update(bet.bettor.id, {
        points: bettorOp(bettor.points, bet.points)
      })
      await this.babybetAttractionRepository.update(bet.bettor.id, {
        points: bettorOp(bettor.points, bet.points)
      })

      // CRADO++
      let taker2
      for (let taker of bet.takers) {
        taker2 = await this.bettorRepository.get(taker.id)
        await this.bettorRepository.update(taker.id, {
          points: takersOp(taker2.points, bet.points)
        })
        await this.babybetAttractionRepository.update(taker.id, {
          points: takersOp(taker2.points, bet.points)
        })
      }
    })
  }

  async onMatchWon(event) {
    const bets = await this.betRepository.find({
      where: {
        event: event.type,
        match: event.match,
        status: BetStatus.ONGOING
      }
    })

    const otherBets = bets
      .filter((bet) => bet.takers.length === 0)
      .map((bet) => bet.id)
    await this.betRepository.updateAll(otherBets, {
      status: BetStatus.CANCELLED
    })

    // Only update bets that have takers
    const takenBets = bets.filter((bet) => bet.takers.length > 0)
    return mapAsync(takenBets, async (bet) => {
      const isSuccessful = bet.team === event.team
      logger.debug(
        'onGoalScored',
        `bet.team: ${bet.team}`,
        `event.team: ${event.team}`,
        `isSuccessful: ${isSuccessful}`
      )
      const [bettorOp, takersOp] = isSuccessful
        ? [sum, diffOrZero]
        : [diffOrZero, sum]

      // TODO: rendre symétrique le gain/perte de points
      const updates = await Promise.all([
        this.betRepository.update(bet.id, {
          status: isSuccessful ? BetStatus.SUCCEEDED : BetStatus.FAILED
        }),
        this.bettorRepository.update(bet.bettor.id, {
          points: bettorOp(bet.bettor.points, bet.points)
        }),
        this.babybetAttractionRepository.update(bet.bettor.id, {
          points: bettorOp(bet.bettor.points, bet.points)
        })
      ])

      // Update takers' ranks if the bet was against other players
      if (bet.against === BetAgainst.PLAYERS) {
        bet.takers.forEach(async (taker) => {
          let taker2 = await this.bettorRepository.get(taker.id)
          const promise = await this.bettorRepository.update(taker2.id, {
            points: takersOp(taker2.points, bet.points)
          })
          const promise2 = await this.babybetAttractionRepository.update(taker2.id, {
            points: takersOp(taker2.points, bet.points)
          })
          updates.push(promise, promise2)
        })
      }
      return updates
    })
  }
}

const sum = (...args) => args.reduce((a, b) => a + b, 0)
const diffOrZero = (...args) => {
  const n = args.reduce((a, b) => (a === 0 ? b : a - b), 0)
  return n >= 0 ? n : 0
}
