import { UseCase } from '../use-case'

export class FindBetsUseCase extends UseCase {
  constructor({ betRepository }) {
    super()
    this.betRepository = betRepository
  }

  async execute({ where, onSuccess }) {
    const bets = await this.betRepository.find({
      where
    })
    return onSuccess(bets)
  }
}
