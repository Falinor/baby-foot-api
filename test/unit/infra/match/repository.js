import test from 'ava';

import createMatchRepository from '../../../../src/infra/match/match-repository';

test('Should create a match repository', async (t) => {
  const store = {};
  const matchRepository = createMatchRepository(store);
  t.is(typeof matchRepository, 'object');
  t.is(typeof matchRepository.toEntity, 'function');
  t.is(typeof matchRepository.toDBO, 'function');
  t.is(typeof matchRepository.create, 'function');
});
