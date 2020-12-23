import Elo from 'arpad'
import { filter as filterAsync, map as mapAsync } from 'async'
import { defaultsDeep, maxBy, mean, minBy } from 'lodash'
import { v4 as uuid } from 'uuid'

import { config, hasDuplicate, logger } from '../../core'
import { UseCase } from '../use-case'
import { GameNotOverError, PlayersError, PlayersNotFoundError } from './errors'
import { MatchStatus } from './match-status'

export class UpdateMatchUseCase extends UseCase {
  constructor({
    enableRanking,
    maxPoints,
    matchRepository,
    teamRepository,
    playerRepository,
    babyfootAttractionRepository
  }) {
    super()
    this.enableRanking = enableRanking
    this.maxPoints = maxPoints
    this.matchRepository = matchRepository
    this.teamRepository = teamRepository
    this.playerRepository = playerRepository
    this.babyfootAttractionRepository = babyfootAttractionRepository
  }

  async execute({
    id,
    payload,
    onMaxPointsError,
    onPlayersError,
    onPlayersNotFound,
    onCreate,
    onUpdate
  }) {
    if (payload.teams.every((team) => team.points >= config.maxPoints)) {
      const error = new GameNotOverError(
        payload,
        'Both teams cannot win at the same time'
      )
      return onMaxPointsError(error)
    }

    const players = payload.teams.flatMap((team) => team.players)
    if (hasDuplicate(players)) {
      const error = new PlayersError(payload)
      return onPlayersError(error)
    }

    // Check players' existence
    const missingPlayers = await filterAsync(players, async (playerId) => {
      const player = await this.playerRepository.get(playerId)
      return player === null
    })
    if (missingPlayers?.length) {
      const error = new PlayersNotFoundError(...missingPlayers)
      return onPlayersNotFound(error)
    }

    // Find or create teams
    const teams = await mapAsync(payload.teams, async (team) => {
      const foundTeam = await this.teamRepository.findOne(team)
      return foundTeam
        ? foundTeam
        : await this.teamRepository.create({
            ...team,
            players: team.players.map((player) => ({ id: player })),
            wins: 0,
            losses: 0,
            rank: 1000,
            id: uuid()
          })
    })

    const isOver = payload.teams.some((team) => team.points === this.maxPoints)
    const exists = await this.matchRepository.exists(id)
    const now = new Date()
    const match = exists
      ? await this.matchRepository.update(id, {
          status: isOver ? MatchStatus.OVER : MatchStatus.PLAYING,
          teams: defaultsDeep(teams, payload.teams),
          updatedAt: new Date()
        })
      : await this.matchRepository.create({
          id: uuid(),
          status: isOver ? MatchStatus.OVER : MatchStatus.PLAYING,
          teams: defaultsDeep(teams, payload.teams),
          createdAt: now,
          updatedAt: now
        })

    if (this.enableRanking && isOver) {
      const ucsf = {
        default: 32,
        2100: 24,
        2400: 16
      }
      const min = 100
      const max = 10000

      const winner = maxBy(match.teams, 'points')
      const loser = minBy(match.teams, 'points')
      const elo = new Elo(ucsf, min, max)
      logger.debug('Winner and loser', winner, loser)

      const winnerNewRanks = winner.players.map((p) =>
        elo.newRatingIfWon(p.rank ?? 1000, mean(ranks(loser)))
      )
      const loserNewRanks = loser.players.map((p) =>
        elo.newRatingIfLost(p.rank ?? 1000, mean(ranks(winner)))
      )
      logger.debug('New ranks', winnerNewRanks, loserNewRanks)

      // Save new ranks
      await Promise.all([
        ...winner.players.map((p, i) =>
          this.playerRepository.update(p.id, {
            wins: (p.wins ?? 0) + 1,
            rank: winnerNewRanks[i]
          })
        ),
        ...loser.players.map((p, i) =>
          this.playerRepository.update(p.id, {
            losses: (p.losses ?? 0) + 1,
            rank: loserNewRanks[i]
          })
        ),
        this.teamRepository.update(winner.id, {
          wins: (winner.wins ?? 0) + 1,
          rank: mean(winnerNewRanks)
        }),
        this.teamRepository.update(loser.id, {
          losses: (loser.losses ?? 0) + 1,
          rank: mean(loserNewRanks)
        })
      ])

      await this.babyfootAttractionRepository.end({
        winnerNewRanks,
        loserNewRanks,
        winner,
        loser
      })
    }

    return exists ? onUpdate(match) : onCreate(match)
  }
}

const ranks = (team) => team.players.map((p) => p.rank ?? 1000)
