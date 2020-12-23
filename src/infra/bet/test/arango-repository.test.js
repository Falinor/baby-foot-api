import { map as mapAsync } from 'async'
import { cleanUpDatabase } from '../../../../integ/utils'

import { BetEvent, BetStatus } from '../../../app'
import { createContainer } from '../../../container'
import { betFactory } from '../../../utils'
import { toDatabase } from '../arango-repository'

describe('Integration | Repository | Bet', () => {
  let db
  let betRepository

  beforeAll(() => {
    const container = createContainer()
    db = container.resolve('db')
    betRepository = container.resolve('betRepository')
  })

  beforeEach(async () => {
    await cleanUpDatabase(db)
  })

  describe('#find', () => {
    const bets = [
      betFactory.build({
        event: BetEvent.GOAL_SCORED,
        status: BetStatus.CANCELLED
      }),
      betFactory.build({
        event: BetEvent.MATCH_WON,
        status: BetStatus.ONGOING
      }),
      betFactory.build({
        event: BetEvent.MATCH_WON,
        status: BetStatus.ONGOING
      })
    ]

    beforeEach(async () => {
      const betCollection = db.collection('bets')
      await mapAsync(bets, async (bet) => betCollection.save(toDatabase(bet)))
    })

    it('should return bets', async () => {
      const actual = await betRepository.find()
      expect(actual).toHaveLength(bets.length)
    })

    it('should return bets by event', async () => {
      const actual = await betRepository.find({
        where: {
          event: BetEvent.GOAL_SCORED
        }
      })
      const expected = bets.filter((bet) => bet.event === BetEvent.GOAL_SCORED)
        .length
      expect(actual).toHaveLength(expected)
    })

    it('should return bets by status', async () => {
      const actual = await betRepository.find({
        where: {
          status: BetStatus.ONGOING
        }
      })
      const expected = bets.filter((bet) => bet.status === BetStatus.ONGOING)
        .length
      expect(actual).toHaveLength(expected)
    })
  })
})
