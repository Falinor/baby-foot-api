import { aql } from 'arangojs'
import { map as asyncMap } from 'async'
import { logger } from '../../core'

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
  logger.debug(`Finding team by players ${players.join(', ')}`)
  const playerIds = players.map((player) => `players/${player}`)
  const [team] = await db
    .query(
      aql`
        FOR team IN INTERSECTION(
          (FOR team, member IN OUTBOUND ${playerIds[0]} members
            OPTIONS { bfs: true, uniqueVertices: 'global' }
            RETURN team
          ),
          (FOR team, member IN OUTBOUND ${playerIds[1]} members
            OPTIONS { bfs: true, uniqueVertices: 'global' }
            RETURN team
          )
        )
        RETURN MERGE(team, { players: [DOCUMENT(${playerIds[0]}), DOCUMENT(${playerIds[1]})] })
    `
    )
    .then((cursor) => cursor.all())

  if (team) {
    logger.debug(`Found team ${team._key} for players ${players.join(', ')}`)
    return fromDatabase(team)
  }
  return null
}

const create = (db) => async (team) => {
  const graph = db.graph('baby-foot-graph')
  await graph.vertexCollection('teams').save(toDatabase(team))
  await asyncMap(team.players, async (player) =>
    graph.edgeCollection('members').save({
      _from: `players/${player.id}`,
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

const update = (db) => async (id, team) => {
  const graph = db.graph('baby-foot-graph')
  await graph.vertexCollection('teams').update(id, toDatabase(team))
}

export const fromDatabase = (teamEntity) => ({
  id: teamEntity._key,
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
    get: get(db),
    create: create(db),
    update: update(db)
  }
}
