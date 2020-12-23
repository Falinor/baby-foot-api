import { matchFactory } from '../../../../utils'
import { createMatchController } from '../controller'

const createUseCaseStub = () => ({ execute: jest.fn() })

describe('Unit | Controller | Match', () => {
  let ctx
  let controller
  let createMatch
  let findMatches

  beforeAll(() => {
    ctx = {}
    createMatch = createUseCaseStub()
    findMatches = createUseCaseStub()
    controller = createMatchController({
      createMatchUseCase: createMatch,
      findMatchesUseCase: findMatches
    })
  })

  describe('#index', () => {
    const matches = matchFactory.buildList(2)

    beforeEach(async () => {
      findMatches.execute.mockImplementation(async ({ onSuccess }) => {
        return onSuccess(matches)
      })
      await controller.index(ctx)
    })

    it('should set the response status to 200 OK', () => {
      expect(ctx.status).toBe(200)
    })

    it('should set the response body to the returned matches', () => {
      expect(ctx.body).toStrictEqual(matches)
    })
  })

  describe('#create', () => {
    const match = matchFactory.build()

    beforeAll(() => {
      ctx.request = {}
      ctx.set = jest.fn()
    })

    describe('onSuccess', () => {
      beforeEach(async () => {
        createMatch.execute.mockImplementation(({ onSuccess }) => {
          return onSuccess(match)
        })
        await controller.create(ctx)
      })

      it('should set the response status to 201 Created', () => {
        expect(ctx.status).toBe(201)
      })

      it('should set the response body to the created match', () => {
        expect(ctx.body).toStrictEqual(match)
      })

      it('should set the location', () => {
        expect(ctx.set).toHaveBeenCalledWith(
          'Location',
          `/v1/matches/${match.id}`
        )
      })
    })

    describe('onMaxPointsError', () => {
      beforeEach(async () => {
        createMatch.execute.mockImplementation(({ onMaxPointsError }) => {
          return onMaxPointsError('MaxPointsError')
        })
        await controller.create(ctx)
      })

      it('should set the response status to 422 Unprocessable entity', () => {
        expect(ctx.status).toBe(422)
      })

      it('should set the response body to an error', () => {
        expect(ctx.body).toBe('MaxPointsError')
      })
    })

    describe('onPlayersError', () => {
      beforeEach(async () => {
        createMatch.execute.mockImplementation(({ onPlayersError }) => {
          return onPlayersError('PlayersError')
        })
        await controller.create(ctx)
      })

      it('should set the response status to 422 Unprocessable entity', () => {
        expect(ctx.status).toBe(422)
      })

      it('should set the response body to an error', () => {
        expect(ctx.body).toBe('PlayersError')
      })
    })

    describe('onPlayersNotFound', () => {
      beforeEach(async () => {
        createMatch.execute.mockImplementation(({ onPlayersNotFound }) => {
          return onPlayersNotFound('Not found')
        })
        await controller.create(ctx)
      })

      it('should set the response status to 404 Not found', () => {
        expect(ctx.status).toBe(404)
      })

      it('should set the response body to an error', () => {
        expect(ctx.body).toBe('Not found')
      })
    })
  })
})
