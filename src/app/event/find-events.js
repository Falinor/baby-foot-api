import { UseCase } from '../use-case'

export class FindEventsUseCase extends UseCase {
  constructor() {
    super()
  }

  async execute({ onSuccess }) {
    // TODO
    return onSuccess()
  }
}
