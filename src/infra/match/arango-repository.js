import { aql } from 'arangojs'

const find = (db) => async (where = {}) => {
  const limit = where.limit ?? 10
  const page = where.page ?? 1
  const offset = limit * (page - 1)
  // LIMIT ${offset} ${limit}
  const cursor = await db.query(aql`
    FOR match IN matches
    RETURN match
  `)
  const matches = await cursor.all()
  return matches.map(fromDatabase)
}

const save = (db) => async (match) => {
  const graph = db.graph('baby-foot-graph')
  await graph.vertexCollection('matches').save(toDatabase(match))
  // TODO: transform match.red and match.blue to match.teams
  await Promise.all([
    graph.edgeCollection('played').save({
      _from: `teams/${match.red.id}`,
      _to: `matches/${match.id}`,
      points: match.red.points,
      color: 'red'
    }),
    graph.edgeCollection('played').save({
      _from: `teams/${match.blue.id}`,
      _to: `matches/${match.id}`,
      points: match.blue.points,
      color: 'blue'
    })
  ])
  return match
}

export const fromDatabase = (matchEntity) => ({
  id: matchEntity._key,
  playedAt: new Date(matchEntity.playedAt),
  createdAt: new Date(matchEntity.createdAt),
  updatedAt: new Date(matchEntity.updatedAt)
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
    save: save(db)
  }
}
