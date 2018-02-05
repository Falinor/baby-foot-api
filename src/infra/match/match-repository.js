const toEntity = async (matchDBO) => {
  // TODO
};

const toDBO = async (matchEntity) => {
  // TODO
};

const create = store =>
  async (match) => {
    // TODO
  };

export default store => ({
  toEntity,
  toDBO,
  create: create(store),
});
