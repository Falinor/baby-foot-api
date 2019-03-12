import ExtendableError from 'es6-error';

class MaxPointsError extends ExtendableError {
  constructor(match, message = 'None of the teams has won yet') {
    super(message);
    this.details = { match };
  }
}

export default MaxPointsError;
