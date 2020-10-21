import { v4 as uuid } from 'uuid'
import { playerFactory } from '../../../utils'

import { CreateMatchUseCase, MAX_POINTS } from '../create-match'
import { GameNotOverError, PlayersNotFoundError, PlayersError } from '../errors'

describe('Unit | Use case | CreateMatch', () => {
  let useCase
  let matchRepository
  let teamRepository
  let playerRepository

  beforeEach(() => {
    matchRepository = {
      create: jest.fn(async (match) => ({
        ...match,
        id: uuid()
      }))
    }
    teamRepository = {
      findOne: jest.fn(async ({ players }) => ({
        ...players,
        id: uuid()
      }))
    }
    playerRepository = {
      get: jest.fn(async (id) => playerFactory.build({ id }))
    }
    useCase = new CreateMatchUseCase({ matchRepository, playerRepository })
  })

  describe('#execute', () => {
    let onMaxPointsError
    let onPlayersError
    let onPlayersNotFound
    let onSuccess

    beforeEach(() => {
      onMaxPointsError = jest.fn()
      onPlayersError = jest.fn()
      onPlayersNotFound = jest.fn()
      onSuccess = jest.fn()
    })

    const executeUseCase = async (match) =>
      useCase.execute({
        match,
        onMaxPointsError,
        onPlayersError,
        onPlayersNotFound,
        onSuccess
      })

    describe('No team has won yet', () => {
      it('calls "onMaxPointsError"', async () => {
        await executeUseCase({
          red: {
            points: MAX_POINTS - 1,
            players: ['ABC', 'DEF']
          },
          blue: {
            points: 0,
            players: ['GHI', 'JKL']
          }
        })
        expect(onMaxPointsError).toHaveBeenCalledWith(new GameNotOverError())
      })
    })

    describe('Both teams cannot win at the same time', () => {
      it('calls "onMaxPointsError"', async () => {
        const match = {
          red: {
            points: MAX_POINTS + 1,
            players: ['ABC', 'DEF']
          },
          blue: {
            points: MAX_POINTS,
            players: ['GHI', 'JKL']
          }
        }
        await executeUseCase(match)
        expect(onMaxPointsError).toHaveBeenCalledWith(
          new GameNotOverError(match, 'Both teams cannot win at the same time')
        )
      })
    })

    describe('A player cannot appear in both teams', () => {
      it('calls "onPlayersError"', async () => {
        await executeUseCase({
          red: {
            points: MAX_POINTS,
            players: ['ABC', 'DEF']
          },
          blue: {
            points: 0,
            players: ['GHI', 'ABC']
          }
        })
        expect(onPlayersError).toHaveBeenCalledWith(new PlayersError())
      })
    })

    describe('A player does not exist', () => {
      it('calls "onPlayersNotFound"', async () => {
        playerRepository.get.mockResolvedValueOnce(null)
        await executeUseCase({
          red: {
            points: MAX_POINTS,
            players: ['ABC', 'DEF']
          },
          blue: {
            points: 0,
            players: ['GHI', 'KLM']
          }
        })
        expect(onPlayersNotFound).toHaveBeenCalledWith(
          new PlayersNotFoundError('ABC')
        )
      })
    })

    describe('Both teams exist', () => {
      const team = {
        players: ['ABC', 'DEF']
      }

      beforeEach(async () => {
        teamRepository.findOne.mockResolvedValue({
          ...team,
          id: uuid()
        })
      })

      it('creates the team', () => {
        expect(teamRepository.findOne).toHaveBeenCalledWith(team)
      })
    })

    describe('Everything is fine', () => {
      const match = {
        red: {
          points: MAX_POINTS,
          players: ['ABC', 'DEF']
        },
        blue: {
          points: MAX_POINTS - 1,
          players: ['GHI', 'JKL']
        }
      }

      beforeEach(async () => {
        await executeUseCase(match)
      })

      it('saves the match', () => {
        expect(matchRepository.create).toHaveBeenCalledWith({
          ...match,
          id: expect.any(String)
        })
      })

      it('calls "onSuccess"', () => {
        expect(onSuccess).toHaveBeenCalledWith({
          ...match,
          id: expect.any(String)
        })
      })
    })
  })
})
