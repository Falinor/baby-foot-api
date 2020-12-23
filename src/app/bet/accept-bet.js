import { UseCase } from '../use-case'

export class AcceptBetUseCase extends UseCase {
  constructor({ betRepository, bettorRepository }) {
    super()
    this.betRepository = betRepository
    this.bettorRepository = bettorRepository
  }

  async execute({ betId, takerId, onNotFound, onSuccess }) {
    const bet = await this.betRepository.get(betId)
    if (!bet) {
      return onNotFound(`The bet ${betId} was not found`)
    }

    const taker = await this.bettorRepository.get(takerId)
    if (!taker) {
      return onNotFound(`The user ${takerId} was not found`)
    }

    const newBet = {
      ...bet,
      takers: [...bet.takers.map((taker) => taker.id), takerId]
    }
    await this.betRepository.update(bet.id, { takers: newBet.takers })
    return onSuccess(newBet)
  }
}
