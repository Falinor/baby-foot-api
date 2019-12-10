import uuid from 'uuid'

import { CreateMatchUseCase, MAX_POINTS } from '../create-match'
import GameNotOverError from '../errors/game-not-over-error'
import PlayersError from '../errors/players-error'

describe('Unit | Use case | CreateMatch', () => {
  let useCase

  beforeEach(() => {
    useCase = new CreateMatchUseCase({
      saveMatch: jest.fn(async match => ({
        ...match,
        id: uuid()
      }))
    })
  })

  describe('#constructor', () => {
    it('exists', () => {
      expect(useCase).toBeDefined()
    })

    it('has a function "execute"', () => {
      expect(useCase.execute).toBeDefined()
    })
  })

  describe('#execute', () => {
    let onMaxPointsError
    let onPlayersError
    let onSuccess

    beforeEach(() => {
      onMaxPointsError = jest.fn()
      onPlayersError = jest.fn()
      onSuccess = jest.fn()
    })

    describe('No team has won yet', () => {
      it('calls "onMaxPointsError"', async () => {
        await useCase.execute({
          match: {
            red: {
              points: MAX_POINTS - 1,
              players: ['ABC', 'DEF']
            },
            blue: {
              points: 0,
              players: ['GHI', 'JKL']
            }
          },
          onMaxPointsError,
          onPlayersError,
          onSuccess
        })
        expect(onMaxPointsError).toHaveBeenCalledWith(new GameNotOverError())
      })
    })

    describe('Both teams cannot win at the same time', () => {
      it('calls onMaxPointsError', async () => {
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
        await useCase.execute({
          match,
          onMaxPointsError,
          onPlayersError,
          onSuccess
        })
        expect(onMaxPointsError).toHaveBeenCalledWith(
          new GameNotOverError(match, 'Both teams cannot win at the same time')
        )
      })
    })

    describe('A player cannot appear in both teams', () => {
      it('calls "onPlayersError"', async () => {
        await useCase.execute({
          match: {
            red: {
              points: MAX_POINTS,
              players: ['ABC', 'DEF']
            },
            blue: {
              points: 0,
              players: ['GHI', 'ABC']
            }
          },
          onMaxPointsError,
          onPlayersError,
          onSuccess
        })
        expect(onPlayersError).toHaveBeenCalledWith(new PlayersError())
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
        await useCase.execute({
          match,
          onMaxPointsError,
          onPlayersError,
          onSuccess
        })
      })

      it('saves the match', async () => {
        expect(useCase.saveMatch).toHaveBeenCalledWith(match)
      })

      it('calls "onSuccess"', async () => {
        expect(onSuccess).toHaveBeenCalledWith({
          ...match,
          id: expect.any(String)
        })
      })
    })
  })
})
