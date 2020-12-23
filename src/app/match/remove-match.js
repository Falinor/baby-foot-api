import { UseCase } from '../use-case'

export class RemoveMatchUseCase extends UseCase {
  constructor({ matchRepository, betRepository, eventRepository }) {
    super()
    this.matchRepository = matchRepository
    this.betRepository = betRepository
    this.eventRepository = eventRepository
  }

  async execute({ id, onSuccess }) {
    await this.matchRepository.remove(id)
    await this.betRepository.removeAll({ match: id })
    await this.eventRepository.removeAll({ match: id })
    return onSuccess()
  }
}
