/**
 * @module A repository implementation for MongoDB.
 */

export const toEntity = playerDBO => ({
  // eslint-disable-next-line
  id: playerDBO._id,
});

export const toDBO = playerEntity => ({
  _id: playerEntity.id,
});

export const create = playerStore => async player => {
  const playerDBO = toDBO(player);
  return playerStore.insertOne(playerDBO);
};

export const find = playerStore => async (search = {}) => {
  const players = await playerStore.find(search).toArray();
  const promises = players.map(async player => toEntity(player));
  return Promise.all(promises);
};

export const findById = playerStore => async id => {
  const player = playerStore.findOne({ _id: id });
  return toEntity(player);
};

export default playerStore => ({
  toDBO,
  toEntity,
  create: create(playerStore),
  find: find(playerStore),
  findById: findById(playerStore),
});
