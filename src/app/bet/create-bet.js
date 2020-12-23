import { v4 as uuid } from 'uuid'

import { UseCase } from '../use-case'
import { validate } from './bet'
import { BetStatus } from './bet-status'

export class CreateBetUseCase extends UseCase {
  constructor({ betRepository, bettorRepository, matchRepository }) {
    super()
    this.betRepository = betRepository
    this.bettorRepository = bettorRepository
    this.matchRepository = matchRepository
  }

  async execute({ bet, onNotFound, onErrors, onSuccess }) {
    const match = await this.matchRepository.get(bet.match)
    if (!match) {
      return onNotFound(`The match ${bet.match} was not found`)
    }

    const bettor = await this.bettorRepository.get(bet.bettor)
    if (!bettor) {
      return onNotFound(`The bettor ${bet.bettor} was not found`)
    }

    const errors = validate(bet)
    if (errors?.length) {
      return onErrors(errors)
    }

    const created = await this.betRepository.create({
      ...bet,
      match,
      bettor,
      id: uuid(),
      takers: [],
      status: BetStatus.ONGOING,
      createdAt: new Date().toJSON()
    })
    return onSuccess(created)
  }
}
