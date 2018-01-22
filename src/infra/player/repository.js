export const find = playerStore =>
  async (search = {}) => playerStore.find(search);

export const findById = playerStore =>
  async id => playerStore.findOne({ _id: id });

export default store => ({
  find: find(store),
  findById: findById(store),
});
