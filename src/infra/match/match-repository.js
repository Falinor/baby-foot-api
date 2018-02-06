export const toEntity = matchDBO => ({
  // eslint-disable-next-line
  id: matchDBO._id,
  red: matchDBO.red,
  blue: matchDBO.blue,
});

export const toDBO = matchEntity => matchEntity;

const create = store =>
  async (match) => {
    // TODO: validate input data
    // Transform entity into DB object
    const matchDBO = toDBO(match);
    return store.insertOne(matchDBO);
  };

export default store => ({
  toEntity,
  toDBO,
  create: create(store),
});
