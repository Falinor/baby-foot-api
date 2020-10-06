import createMatchController from '../controller'

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
    controller = createMatchController({ createMatch, findMatches })
  })

  describe('#index', () => {
    const matches = [
      {
        id: 'match uuid',
        red: {
          id: 'red uuid',
          players: ['ABC', 'DEF'],
          points: 10
        },
        blue: {
          id: 'blue uuid',
          players: ['GHI', 'KLM'],
          points: 0
        }
      }
    ]

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
    const match = {
      id: 'match uuid',
      red: {
        id: 'red uuid',
        players: ['ABC', 'DEF'],
        points: 10
      },
      blue: {
        id: 'blue uuid',
        players: ['GHI', 'KLM'],
        points: 0
      }
    }

    beforeEach(async () => {
      createMatch.execute.mockImplementation(async ({ onSuccess }) => {
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
  })
})
