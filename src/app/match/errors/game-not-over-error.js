import ExtendableError from 'es6-error'

export default class GameNotOverError extends ExtendableError {
  constructor(match, message = 'None of the teams has won yet') {
    super(message)
    this.details = { match }
  }
}
