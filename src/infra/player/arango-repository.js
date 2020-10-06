const get = (graph) => async (id) => {
  const playerCollection = graph.vertexCollection('players')
  const player = await playerCollection.vertex({ _key: id }, { graceful: true })
  return player ? fromDatabase(player) : null
}

const save = (graph) => async (player) => {
  const playerCollection = graph.vertexCollection('players')
  await playerCollection.save(toDatabase(player))
  return player
}

export const fromDatabase = (playerEntity) => ({
  id: playerEntity._key
})

export const toDatabase = (player) => ({
  _key: player.id
})

export function createPlayerArangoRepository({ db }) {
  const graph = db.graph('baby-foot-graph')
  return {
    get: get(graph),
    save: save(graph)
  }
}
