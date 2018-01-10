export const find = (playerStore) =>
  async (search, options = {}) => {};

export const findById = (playerStore) =>
  async (id) => {
    return playerStore.findOne({ _id: id });
  };

export default store => ({
  find: find(store),
  findById: findById(store),
});
