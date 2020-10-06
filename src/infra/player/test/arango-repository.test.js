import { cleanUpDatabase } from '../../../../integ/utils'
import { createDatabase } from '../../../core/arangodb'
import { playerFactory } from '../../../utils'
import { createPlayerArangoRepository, toDatabase } from '../arango-repository'

describe('Integration | Repository | PlayerArango', () => {
  let db
  let playerRepository

  beforeEach(async () => {
    db = createDatabase()
    await cleanUpDatabase(db)
    playerRepository = createPlayerArangoRepository({ db })
  })

  describe('#get', () => {
    const player = playerFactory.build()

    beforeEach(async () => {
      const graph = db.graph('baby-foot-graph')
      const playerCollection = graph.vertexCollection('players')
      await playerCollection.save(toDatabase(player))
    })

    describe('The player does not exist', () => {
      it('returns null', async () => {
        const actual = await playerRepository.get('somemissingid')
        expect(actual).toBeNull()
      })
    })

    describe('The player exists', () => {
      it('returns it', async () => {
        const actual = await playerRepository.get(player.id)
        expect(actual).toMatchObject(player)
      })
    })
  })
})
