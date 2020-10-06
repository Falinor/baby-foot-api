import ExtendableError from 'es6-error'

export class GameNotOverError extends ExtendableError {
  constructor(match, message = 'None of the teams has won yet') {
    super(message)
    this.details = { match }
  }
}
