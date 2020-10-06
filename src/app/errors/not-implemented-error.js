import ExtendableError from 'es6-error'

export class NotImplementedError extends ExtendableError {
  constructor(message = 'Not implemented') {
    super(message)
  }
}
