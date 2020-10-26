import { aql } from 'arangojs'
import { map as asyncMap } from 'async'
import { orderBy } from 'lodash'

import { cleanUpDatabase } from '../../../../integ/utils'
import { createContainer } from '../../../container'
import { playerFactory, teamFactory } from '../../../utils'
import { toDatabase as toPlayerDatabase } from '../../player/arango-repository'
import {
  createTeamArangoRepository,
  toDatabase as toTeamDatabase
} from '../arango-repository'

describe('Integration | Repository | PlayerArango', () => {
  let container
  let db
  let teamRepository

  beforeEach(async () => {
    container = createContainer()
    db = container.resolve('db')
    await cleanUpDatabase(db)
    teamRepository = createTeamArangoRepository({ db })
  })

  describe('#findOne', () => {
    const players = orderBy(playerFactory.buildList(2), ['rank', 'desc'])

    beforeEach(async () => {
      const playerRepository = container.resolve('playerRepository')
      await asyncMap(players, async (player) => playerRepository.create(player))
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
        await teamRepository.create({
          ...team,
          players: players.map((player) => player.id)
        })
      })

      it('returns the team', async () => {
        const actual = await teamRepository.findOne({
          players: players.map((player) => player.id)
        })
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
      const actual = await teamRepository.create({
        ...team,
        players: team.players.map((player) => player.id)
      })
      expect(actual).toStrictEqual(team)
    })

    it('links team and players together', async () => {
      const actualTeam = await teamRepository.create({
        ...team,
        players: team.players.map((player) => player.id)
      })
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

  describe('#update', () => {
    const team = teamFactory.build({
      wins: 0,
      losses: 0,
      rank: 1000
    })

    beforeEach(async () => {
      await db.collection('teams').save(toTeamDatabase(team))
    })

    it('updates the team', async () => {
      await teamRepository.update(team.id, {
        wins: 1,
        losses: 1,
        rank: 1020
      })
      const actual = await teamRepository.get(team.id)
      expect(actual).toMatchObject({
        wins: 1,
        losses: 1,
        rank: 1020
      })
    })
  })
})
