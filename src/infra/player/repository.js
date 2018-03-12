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

export const create = playerStore =>
  async player => playerStore.insertOne(player);

export const find = playerStore =>
  async (search = {}) => playerStore.find(search);

export const findById = playerStore =>
  async id => playerStore.findOne({ _id: id });

export default playerStore => ({
  toDBO,
  toEntity,
  create: create(playerStore),
  find: find(playerStore),
  findById: findById(playerStore),
});
