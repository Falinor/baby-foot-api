import { aql } from 'arangojs'
import { map as asyncMap } from 'async'

import { fromDatabase as playerFromDatabase } from '../player'

const find = (db) => async ({ where }) => {
  const cursor = await db.query(
    aql`
      FOR team IN teams
        LET players = (
          FOR player IN INBOUND team members
          OPTIONS {
            bfs: true,
            uniqueVertices: 'global'
          }
          RETURN player
        )
        SORT team.rank DESC
        RETURN MERGE(team, { players })
    `
  )
  return cursor.map(fromDatabase)
}

const findOne = (db) => async ({ players }) => {
  const [team] = await db
    .query(
      aql`
      LET team = FIRST(
        FOR member IN members
        FILTER member._from IN ${players}
        RETURN DISTINCT(member._to)
      )
      LET players = (
        FOR player IN players
        FILTER player._id IN ${players}
        RETURN player
      )
      RETURN MERGE(DOCUMENT(team), { players })
  `
    )
    .then((cursor) => cursor.all())
  return team ? fromDatabase(team) : null
}

const create = (db) => async (team) => {
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

const get = (db) => async (id) => {
  const teamId = `teams/${id}`
  const [team] = await db
    .query(
      aql`
      LET team = DOCUMENT(${teamId})
      LET players = (
        FOR player IN INBOUND team members
          OPTIONS {
            bfs: true,
            uniqueVertices: 'global'
          }
          RETURN player
      )
      RETURN MERGE(team, { players })
    `
    )
    .then((cursor) => cursor.all())
  return team ? fromDatabase(team) : null
}

const update = (db) => async (team) => {
  const graph = db.graph('baby-foot-graph')
  await graph.vertexCollection('teams').update(team.id, toDatabase(team))
  return team
}

export const fromDatabase = (teamEntity) => ({
  id: teamEntity._key,
  points: teamEntity.points,
  wins: teamEntity.wins,
  losses: teamEntity.losses,
  rank: teamEntity.rank,
  players: teamEntity.players.map(playerFromDatabase),
  createdAt: teamEntity.createdAt,
  updatedAt: teamEntity.updatedAt
})

export const toDatabase = (team) => ({
  _key: team.id,
  wins: team.wins,
  losses: team.losses,
  rank: team.rank,
  createdAt: team.createdAt,
  updatedAt: team.updatedAt
})

export function createTeamArangoRepository({ db }) {
  return {
    find: find(db),
    findOne: findOne(db),
    create: create(db),
    update: update(db)
  }
}
