const { db } = require('../db')

const GRAPH = 'baby-foot-graph'

module.exports.up = async () => {
  const graph = db.graph(GRAPH)
  const graphExists = await graph.exists()
  if (!graphExists) {
    await db.createGraph(GRAPH, [
      {
        collection: 'played',
        from: 'teams',
        to: 'matches'
      },
      {
        collection: 'members',
        from: 'players',
        to: 'teams'
      }
    ])
  }
}

module.exports.down = async () => {
  const graph = db.graph(GRAPH)
  await graph.drop()
  await Promise.all([
    db.collection('played').drop(),
    db.collection('members').drop()
  ])
}
