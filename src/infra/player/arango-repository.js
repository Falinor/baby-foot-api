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

const update = (graph) => async (player) => {
  const playerCollection = graph.vertexCollection('players')
  await playerCollection.update(player.id, toDatabase(player))
}

export const fromDatabase = (playerEntity) => ({
  id: playerEntity._key,
  wins: playerEntity.wins,
  losses: playerEntity.losses,
  rank: playerEntity.rank,
  createdAt: playerEntity.createdAt,
  updatedAt: playerEntity.updatedAt
})

export const toDatabase = (player) => ({
  _key: player.id,
  wins: player.wins,
  losses: player.losses,
  rank: player.rank,
  createdAt: player.createdAt,
  updatedAt: player.updatedAt
})

export function createPlayerArangoRepository({ db }) {
  const graph = db.graph('baby-foot-graph')
  return {
    get: get(graph),
    create: create(graph),
    update: update(graph)
  }
}
