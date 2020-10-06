import { aql } from 'arangojs'
import { map as asyncMap } from 'async'

const findOne = (db) => async (where) => {
  const players = where.players.map((p) => `players/${p}`)
  const [team] = await db
    .query(
      aql`
    FOR edge IN members
      FOR team IN teams
        FILTER edge._to == team._id
        AND edge._from IN ${players}
        LIMIT 1
        RETURN team
  `
    )
    .then((cursor) => cursor.all())
  return team ? fromDatabase(team) : null
}

const save = (db) => async (team) => {
  const graph = db.graph('baby-foot-graph')
  await graph.vertexCollection('teams').save(toDatabase(team))
  await asyncMap(team.players, async (player) =>
    graph.edgeCollection('members').save({
      _from: `players/${player}`,
      _to: `teams/${team.id}`
    })
  )
  return team
}

export const fromDatabase = (teamEntity) => ({
  id: teamEntity._key
})

export const toDatabase = (team) => ({
  _key: team.id
})

export function createTeamArangoRepository({ db }) {
  return {
    findOne: findOne(db),
    save: save(db)
  }
}
