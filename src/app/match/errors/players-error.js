import ExtendableError from 'es6-error';

class PlayersError extends ExtendableError {
  constructor(match, message = 'A player cannot appear in both teams') {
    super(message);
    this.details = { match };
  }
}

export default PlayersError;
