const toEntity = (matchDBO) => {
  // TODO
  return matchDBO;
};

const toDBO = (matchEntity) => {
  // TODO
  return matchEntity;
};

const create = store =>
  async (match) => {
    // TODO
    // Transform entity into DB object
    const matchDBO = toDBO(match);
    return store.insertOne(matchDBO);
  };

export default store => ({
  toEntity,
  toDBO,
  create: create(store),
});
