import { aql } from 'arangojs'
import { map as mapAsync } from 'async'

import { fromDatabase as teamFromDatabase } from '../team'

const find = (db) => async (where = {}) => {
  const limit = where.limit ?? 10
  const page = where.page ?? 1
  const offset = limit * (page - 1)
  // LIMIT ${offset} ${limit}
  const cursor = await db.query(aql`
    FOR match IN matches
      LET teams = (
          FOR team, pl IN INBOUND match played
              OPTIONS {
                bfs: true,
                uniqueVertices: 'global'
              }
              LET players = (
                  FOR player IN INBOUND team members
                      OPTIONS {
                          bfs: true,
                          uniqueVertices: 'global'
                      }
                      RETURN player
              )
              RETURN MERGE(team, { players }, pl)
      )
      RETURN MERGE(match, { teams })
  `)
  return cursor.map(fromDatabase)
}

const create = (db) => async (match) => {
  const graph = db.graph('baby-foot-graph')
  await graph.vertexCollection('matches').save(toDatabase(match))
  await mapAsync(match.teams, async (team) =>
    graph.edgeCollection('played').save({
      _from: `teams/${team.id}`,
      _to: `matches/${match.id}`,
      points: team.points,
      color: team.color,
      name: team.name
    })
  )
  return get(db)(match.id)
}

const update = (db) => async (id, match) => {
  const graph = db.graph('baby-foot-graph')
  await graph
    .vertexCollection('matches')
    .update({ _key: id }, toDatabase(match))

  const matchId = `matches/${id}`
  await mapAsync(match.teams, async (team) => {
    const teamId = `teams/${team.id}`
    return db.query(aql`
      FOR p IN played
        FILTER p._from == ${teamId}
        FILTER p._to == ${matchId}
        UPDATE p WITH {
          points: ${team.points},
          color: ${team.color},
          name: ${team.name}
        } IN played
    `)
  })
  return get(db)(id)
}

const get = (db) => async (id) => {
  const matchId = `matches/${id}`
  const [match] = await db
    .query(
      aql`
      LET match = DOCUMENT(${matchId})
      LET teams = (
          FOR team, played IN INBOUND match played
              OPTIONS {
                bfs: true,
                uniqueVertices: 'global'
              }
              LET players = (
                  FOR player IN INBOUND team members
                      OPTIONS {
                          bfs: true,
                          uniqueVertices: 'global'
                      }
                      SORT player.rank DESC
                      RETURN player
              )
              SORT team.rank DESC
              RETURN MERGE(played, team, { players })
      )
      RETURN MERGE(match, { teams })
    `
    )
    .then((cursor) => cursor.all())
  return match ? fromDatabase(match) : null
}

const exists = (db) => async (id) => {
  const matchCollection = db.collection('matches')
  return matchCollection.documentExists({ _key: id })
}

const remove = (db) => async (id) => {
  const graph = db.graph('baby-foot-graph')
  await graph.vertexCollection('matches').remove({ _key: id })
}

export const fromDatabase = (matchEntity) => ({
  id: matchEntity._key,
  status: matchEntity.status,
  teams: matchEntity.teams.map((team) => ({
    ...teamFromDatabase(team),
    points: team.points,
    color: team.color,
    name: team.name
  })),
  createdAt: matchEntity.createdAt,
  updatedAt: matchEntity.updatedAt
})

export const toDatabase = (match) => ({
  _key: match.id,
  status: match.status,
  createdAt: match.createdAt,
  updatedAt: match.updatedAt
})

export function createMatchArangoRepository({ db }) {
  return {
    find: find(db),
    create: create(db),
    update: update(db),
    get: get(db),
    exists: exists(db),
    remove: remove(db)
  }
}
