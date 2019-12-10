/**
 * @module A repository implementation for MongoDB.
 */

export const fromInfra = playerDBO => ({
  // eslint-disable-next-line
  id: playerDBO._id
})

export const toInfra = playerEntity => ({
  _id: playerEntity.id
})

export const create = playerStore => async player => {
  const infraMatch = toInfra(player)
  await playerStore.insertOne(infraMatch)
}

export const find = playerStore => async (search = {}) => {
  const players = await playerStore.find(search).toArray()
  return players.map(player => fromInfra(player))
}

export const getById = playerStore => async id => {
  const player = playerStore.findOne({ _id: id })
  return fromInfra(player)
}

export const createPlayerRepository = playerStore => ({
  fromInfra,
  toInfra,
  find: find(playerStore),
  getById: getById(playerStore),
  create: create(playerStore)
})
