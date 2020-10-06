import { filter as filterAsync, map as mapAsync } from 'async'
import { merge } from 'lodash'
import { v4 as uuid } from 'uuid'

import { UseCase } from '../use-case'
import { GameNotOverError, PlayersNotFoundError, PlayersError } from './errors'

export const MAX_POINTS = 10

export class CreateMatchUseCase extends UseCase {
  constructor({ matchRepository, teamRepository, playerRepository }) {
    super()
    this.matchRepository = matchRepository
    this.teamRepository = teamRepository
    this.playerRepository = playerRepository
  }

  async execute({
    match,
    onMaxPointsError,
    onPlayersError,
    onPlayersNotFound,
    onSuccess
  }) {
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
      match.red.players.some((redPlayer) =>
        match.blue.players.includes(redPlayer)
      )
    ) {
      const error = new PlayersError(match)
      return onPlayersError(error)
    }

    // Check players' existence
    const playerIds = [...match.red.players, ...match.blue.players]
    const missingPlayers = await filterAsync(playerIds, async (playerId) => {
      const player = await this.playerRepository.get(playerId)
      return player === null
    })
    if (missingPlayers?.length) {
      const error = new PlayersNotFoundError(...missingPlayers)
      return onPlayersNotFound(error)
    }

    // Find or create teams
    const [red, blue] = await mapAsync(
      [match.red, match.blue],
      async (team) => {
        return (
          (await this.teamRepository.findOne(team)) ??
          (await this.teamRepository.save({
            ...team,
            id: uuid()
          }))
        )
      }
    )

    const now = new Date()
    const resultMatch = await this.matchRepository.save(
      merge({ id: uuid(), createdAt: now, updatedAt: now }, match, {
        red,
        blue
      })
    )
    return onSuccess(resultMatch)
  }
}

export default CreateMatchUseCase
