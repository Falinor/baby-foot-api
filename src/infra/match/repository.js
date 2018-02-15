export const toEntity = matchDBO => ({
  // eslint-disable-next-line
  id: matchDBO._id,
  red: matchDBO.red,
  blue: matchDBO.blue,
});

export const toDBO = matchEntity => matchEntity;

const find = matchStore =>
  async () => matchStore.find().toArray();

const create = matchStore =>
  async (match) => {
    // TODO: validate input data
    // Transform entity into DB object
    const matchDBO = toDBO(match);
    return matchStore.insertOne(matchDBO);
  };

export default matchStore => ({
  toEntity,
  toDBO,
  create: create(matchStore),
  find: find(matchStore),
});
