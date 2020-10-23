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
          FOR team IN INBOUND match played
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
              RETURN MERGE(team, { players })
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
      color: team.color
    })
  )
  return get(db)(match.id)
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
              RETURN MERGE(team, { players, points: played.points })
      )
      RETURN MERGE(match, { teams })
    `
    )
    .then((cursor) => cursor.all())
  console.log('Match', match.teams)
  return match ? fromDatabase(match) : null
}

export const fromDatabase = (matchEntity) => ({
  id: matchEntity._key,
  teams: matchEntity.teams.map(teamFromDatabase),
  playedAt: matchEntity.playedAt,
  createdAt: matchEntity.createdAt,
  updatedAt: matchEntity.updatedAt
})

export const toDatabase = (match) => ({
  _key: match.id,
  playedAt: match.playedAt,
  createdAt: match.createdAt,
  updatedAt: match.updatedAt
})

export function createMatchArangoRepository({ db }) {
  return {
    find: find(db),
    create: create(db),
    get: get(db)
  }
}
