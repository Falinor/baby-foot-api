import { aql } from 'arangojs'

import { cleanUpDatabase } from '../../../../integ/utils'
import { createDatabase } from '../../../core/arangodb'
import { matchFactory } from '../../../utils'
import { toDatabase as toTeamDatabase } from '../../team/arango-repository'
import { createMatchArangoRepository } from '../arango-repository'

describe('Integration | Repository | MatchArango', () => {
  let db
  let matchRepository

  beforeEach(async () => {
    db = createDatabase()
    await cleanUpDatabase(db)
    matchRepository = createMatchArangoRepository({ db })
  })

  describe('#save', () => {
    const match = matchFactory.build()

    beforeEach(async () => {
      // Create teams
      const teamEntities = [match.red, match.blue].map(toTeamDatabase)
      await db.collection('teams').saveAll(teamEntities)
    })

    it('saves the match', async () => {
      const actual = await matchRepository.save(match)
      expect(actual).toStrictEqual({
        id: match.id,
        playedAt: match.playedAt,
        createdAt: match.createdAt,
        updatedAt: match.updatedAt
      })
    })

    it('links match and teams together', async () => {
      const actualMatch = await matchRepository.save(match)
      const id = `matches/${actualMatch.id}`
      const edges = await db
        .query(
          aql`
        WITH teams, matches
        FOR v, e, p
          IN
          INBOUND ${id}
          GRAPH 'baby-foot-graph'
          RETURN v
      `
        )
        .then((cursor) => cursor.all())
      expect(edges).toHaveLength(2)
    })
  })
})
