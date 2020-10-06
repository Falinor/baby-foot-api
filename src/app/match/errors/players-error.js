import ExtendableError from 'es6-error'

export class PlayersError extends ExtendableError {
  constructor(match, message = 'A player cannot play in both teams') {
    super(message)
    this.details = { match }
  }
}
