export const fromInfra = infraMatch => ({
  // eslint-disable-next-line
  id: infraMatch._id,
  red: infraMatch.red,
  blue: infraMatch.blue,
});

export const toInfra = match => ({
  _id: match.id,
  red: match.red,
  blue: match.blue,
});

const find = matchStore => async () => {
  const matches = await matchStore.find().toArray();
  return matches.map(match => fromInfra(match));
};

const create = matchStore => async match => {
  const infraMatch = toInfra(match);
  await matchStore.insertOne(infraMatch);
};

export const createMatchRepository = matchStore => ({
  fromInfra,
  toInfra,
  find: find(matchStore),
  create: create(matchStore),
});
