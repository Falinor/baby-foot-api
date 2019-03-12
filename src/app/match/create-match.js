import EventEmitter from 'events';

import MaxPointsError from './errors/max-points-error';
import PlayersError from './errors/players-error';

export const MAX_POINTS = 10;

class CreateMatchUseCase extends EventEmitter {
  constructor({ matchRepository }) {
    super();
    this.matchRepository = matchRepository;
    this.outputs = {
      SUCCESS: 'success',
      MAX_POINTS_ERROR: 'max-points-error',
      PLAYERS_ERROR: 'players-error',
      ERROR: 'error',
    };
  }

  async execute(match) {
    try {
      if (match.red.points < MAX_POINTS && match.blue.points < MAX_POINTS) {
        this.emit(this.outputs.MAX_POINTS_ERROR, new MaxPointsError(match));
        return;
      }

      if (match.red.points >= MAX_POINTS && match.blue.points >= MAX_POINTS) {
        this.emit(
          this.outputs.MAX_POINTS_ERROR,
          new MaxPointsError(match, 'Both teams cannot win at the same time'),
        );
        return;
      }

      if (
        match.red.players.some(redPlayer =>
          match.blue.players.includes(redPlayer),
        )
      ) {
        this.emit(this.outputs.PLAYERS_ERROR, new PlayersError(match));
        return;
      }

      const resultMatch = await this.matchRepository.create(match);
      this.emit(this.outputs.SUCCESS, resultMatch);
    } catch (err) {
      this.emit(this.outputs.ERROR, err);
    }
  }
}

export default opts => new CreateMatchUseCase(opts);
