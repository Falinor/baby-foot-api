import { aql } from 'arangojs'
import { map as asyncMap } from 'async'
import { orderBy } from 'lodash'

import { cleanUpDatabase } from '../../../../integ/utils'
import { createDatabase } from '../../../core/arangodb'
import { playerFactory, teamFactory } from '../../../utils'
import { toDatabase as toPlayerDatabase } from '../../player/arango-repository'
import {
  createTeamArangoRepository,
  toDatabase as toTeamDatabase
} from '../arango-repository'

describe('Integration | Repository | PlayerArango', () => {
  let db
  let teamRepository

  beforeEach(async () => {
    db = createDatabase()
    await cleanUpDatabase(db)
    teamRepository = createTeamArangoRepository({ db })
  })

  describe('#findOne', () => {
    const players = playerFactory.buildList(2)

    beforeEach(async () => {
      const playerEntities = orderBy(players.map(toPlayerDatabase), [
        'rank',
        'desc'
      ])
      await db.collection('players').saveAll(playerEntities)
    })

    describe('The team does not exist', () => {
      it('returns null', async () => {
        const actual = await teamRepository.findOne({
          players: players.map((p) => p.id)
        })
        expect(actual).toBeNull()
      })
    })

    describe('The team exists', () => {
      const team = teamFactory.build({ players })

      beforeEach(async () => {
        await db.collection('teams').save(toTeamDatabase(team))
        const memberCollection = db
          .graph('baby-foot-graph')
          .edgeCollection('members')
        await asyncMap(players, async (player) =>
          memberCollection.save({
            _from: `players/${player.id}`,
            _to: `teams/${team.id}`
          })
        )
      })

      it('returns the team', async () => {
        const actual = await teamRepository.findOne({
          players
        })
        console.log(actual)
        expect(actual).toStrictEqual(team)
      })
    })
  })

  describe('#create', () => {
    const team = teamFactory.build()

    beforeEach(async () => {
      const playerEntities = team.players.map(toPlayerDatabase)
      await db.collection('players').saveAll(playerEntities)
    })

    it('saves the team', async () => {
      const actual = await teamRepository.save(team)
      expect(actual).toStrictEqual(team)
    })

    it('links team and players together', async () => {
      const actualTeam = await teamRepository.save(team)
      const id = `teams/${actualTeam.id}`
      const edges = await db
        .query(
          aql`
        WITH players, teams
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
