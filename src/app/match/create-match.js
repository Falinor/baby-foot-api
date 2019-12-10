import GameNotOverError from './errors/game-not-over-error'
import PlayersError from './errors/players-error'

export const MAX_POINTS = 10

export class CreateMatchUseCase {
  constructor({ saveMatch }) {
    this.saveMatch = saveMatch
  }

  async execute({ match, onMaxPointsError, onPlayersError, onSuccess }) {
    if (match.red.points < MAX_POINTS && match.blue.points < MAX_POINTS) {
      const error = new GameNotOverError(match)
      return onMaxPointsError(error)
    }

    if (match.red.points >= MAX_POINTS && match.blue.points >= MAX_POINTS) {
      const error = new GameNotOverError(
        match,
        'Both teams cannot win at the same time'
      )
      return onMaxPointsError(error)
    }

    if (
      match.red.players.some(redPlayer =>
        match.blue.players.includes(redPlayer)
      )
    ) {
      const error = new PlayersError(match)
      return onPlayersError(error)
    }

    const resultMatch = await this.saveMatch(match)
    return onSuccess(resultMatch)
  }
}

export default CreateMatchUseCase
