import { aql } from 'arangojs'

const find = (db) => async ({ where }) => {
  const filterPlayers = where.id
    ? aql`FILTER player._key IN ${where.id}`
    : aql``
  const cursor = await db.query(
    aql`
      FOR player IN players
        ${filterPlayers}
        SORT player.rank DESC
        RETURN player
    `
  )
  return cursor.map(fromDatabase)
}

const get = (graph) => async (id) => {
  const playerCollection = graph.vertexCollection('players')
  const player = await playerCollection.vertex({ _key: id }, { graceful: true })
  return player ? fromDatabase(player) : null
}

const create = (graph) => async (player) => {
  const playerCollection = graph.vertexCollection('players')
  await playerCollection.save(toDatabase(player))
  return player
}

const update = (graph) => async (id, player) => {
  const playerCollection = graph.vertexCollection('players')
  await playerCollection.update(id, toDatabase(player))
}

export const fromDatabase = (playerEntity) => ({
  id: playerEntity._key,
  email: playerEntity.email,
  nickname: playerEntity.nickname,
  wins: playerEntity.wins,
  losses: playerEntity.losses,
  rank: playerEntity.rank,
  createdAt: playerEntity.createdAt,
  updatedAt: playerEntity.updatedAt
})

export const toDatabase = (player) => ({
  _key: player.id,
  email: player.email,
  nickname: player.nickname,
  wins: player.wins,
  losses: player.losses,
  rank: player.rank,
  createdAt: player.createdAt,
  updatedAt: player.updatedAt
})

export function createPlayerArangoRepository({ db }) {
  const graph = db.graph('baby-foot-graph')
  return {
    find: find(db),
    get: get(graph),
    create: create(graph),
    update: update(graph)
  }
}
