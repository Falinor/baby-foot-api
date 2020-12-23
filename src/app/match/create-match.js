import { filter as filterAsync, map as mapAsync } from 'async'
import { defaultsDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { config, hasDuplicate } from '../../core'
import { UseCase } from '../use-case'
import { GameNotOverError, PlayersError, PlayersNotFoundError } from './errors'
import { MatchStatus } from './match-status'

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
    if (match.teams.every((team) => team.points >= config.maxPoints)) {
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
            players: team.players.map((player) => ({ id: player })),
            wins: 0,
            losses: 0,
            rank: 1000,
            id: uuid()
          })
    })

    const now = new Date()
    const isOver = match.teams.some((team) => team.points === config.maxPoints)
    const resultMatch = await this.matchRepository.create({
      id: uuid(),
      status: isOver ? MatchStatus.OVER : MatchStatus.PLAYING,
      teams: defaultsDeep(teams, match.teams),
      createdAt: now,
      updatedAt: now
    })
    if (config.feature.ranking && isOver) {
      this.rankingService.updateRanks(resultMatch)
    }
    return onSuccess(resultMatch)
  }
}

export default CreateMatchUseCase
