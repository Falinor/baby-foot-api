/**
 * @module A repository implementation for MongoDB.
 */

export const find = playerStore =>
  async (search = {}) => playerStore.find(search);

export const findById = playerStore =>
  async id => playerStore.findOne({ _id: id });

export default playerStore => ({
  find: find(playerStore),
  findById: findById(playerStore),
});
