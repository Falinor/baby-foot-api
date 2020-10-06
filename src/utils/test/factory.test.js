import { matchFactory, teamFactory } from '../factory'

describe('Unit | Utils | Factory', () => {
  it('should generate a fake match', () => {
    const match = matchFactory.build()
    expect(match).toMatchObject({
      red: {
        points: expect.any(Number),
        players: expect.any(Array)
      },
      blue: {
        points: expect.any(Number),
        players: expect.any(Array)
      },
      playedAt: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })
})
