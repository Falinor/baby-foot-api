import { NotImplementedError } from './errors'

export class UseCase {
  async execute() {
    throw new NotImplementedError()
  }
}
