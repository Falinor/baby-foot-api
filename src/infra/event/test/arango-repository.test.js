import { map as mapAsync } from 'async'

import { cleanUpDatabase } from '../../../../integ/utils'
import { createDatabase } from '../../../core'
import { eventFactory } from '../../../utils'
import { createEventArangoRepository } from '../arango-repository'

describe('Integration | Repository | EventArango', () => {
  let db
  let eventRepository

  beforeAll(() => {
    db = createDatabase()
    eventRepository = createEventArangoRepository({ db })
  })

  beforeEach(async () => {
    await cleanUpDatabase(db)
  })

  describe('#find', () => {
    const events = eventFactory.buildList(3)

    beforeEach(async () => {
      await mapAsync(events, async (event) => eventRepository.create(event))
    })

    it('returns events', async () => {
      const actual = await eventRepository.find()
      expect(actual).toStrictEqual(events)
    })
  })

  describe('#create', () => {
    it('inserts an event into the database', async () => {
      const event = eventFactory.build()
      const actual = await eventRepository.create(event)
      expect(actual).toStrictEqual(event)
    })
  })
})
