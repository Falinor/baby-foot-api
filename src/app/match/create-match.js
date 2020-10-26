import { filter as filterAsync, map as mapAsync } from 'async'
import { merge } from 'lodash'
import { v4 as uuid } from 'uuid'

import { hasDuplicate } from '../../core'
import { UseCase } from '../use-case'
import { GameNotOverError, PlayersError, PlayersNotFoundError } from './errors'

export const MAX_POINTS = 10

export class CreateMatchUseCase extends UseCase {
  constructor({
    matchRepository,
    teamRepository,
    playerRepository,
    rankingService
  }) {
    super()
    this.matchRepository = matchRepository
    this.teamRepository = teamRepository
    this.playerRepository = playerRepository
    this.rankingService = rankingService
  }

  async execute({
    match,
    onMaxPointsError,
    onPlayersError,
    onPlayersNotFound,
    onSuccess
  }) {
    if (match.teams.every((team) => team.points < MAX_POINTS)) {
      const error = new GameNotOverError(match)
      return onMaxPointsError(error)
    }

    if (match.teams.every((team) => team.points >= MAX_POINTS)) {
      const error = new GameNotOverError(
        match,
        'Both teams cannot win at the same time'
      )
      return onMaxPointsError(error)
    }

    const players = match.teams.flatMap((team) => team.players)
    if (hasDuplicate(players)) {
      const error = new PlayersError(match)
      return onPlayersError(error)
    }

    // Check players' existence
    const missingPlayers = await filterAsync(players, async (playerId) => {
      const player = await this.playerRepository.get(playerId)
      return player === null
    })
    if (missingPlayers?.length) {
      const error = new PlayersNotFoundError(...missingPlayers)
      return onPlayersNotFound(error)
    }

    // Find or create teams
    const teams = await mapAsync(match.teams, async (team) => {
      const foundTeam = await this.teamRepository.findOne(team)
      return foundTeam
        ? foundTeam
        : await this.teamRepository.create({
            ...team,
            wins: 0,
            losses: 0,
            rank: 1000,
            id: uuid()
          })
    })

    const now = new Date()
    const resultMatch = await this.matchRepository.create(
      merge(
        {
          id: uuid(),
          createdAt: now,
          updatedAt: now
        },
        match,
        { teams }
      )
    )
    this.rankingService.updateRanks(resultMatch)
    return onSuccess(resultMatch)
  }
}

export default CreateMatchUseCase
