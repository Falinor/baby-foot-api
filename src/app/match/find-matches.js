import { UseCase } from '../use-case'

export class FindMatchesUseCase extends UseCase {
  constructor({ matchRepository }) {
    super()
    this.matchRepository = matchRepository
  }

  async execute({ onSuccess }) {
    const matches = await this.matchRepository.find()
    return onSuccess(matches)
  }
}
