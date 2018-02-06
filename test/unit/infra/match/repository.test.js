import test from 'ava';
import sinon from 'sinon';

import createMatchRepository from '../../../../src/infra/match/match-repository';
import { inputMatch } from '../../../data';

test('Should create a match repository', async (t) => {
  const store = {};
  const matchRepository = createMatchRepository(store);
  t.is(typeof matchRepository, 'object');
  t.is(typeof matchRepository.toEntity, 'function');
  t.is(typeof matchRepository.toDBO, 'function');
  t.is(typeof matchRepository.create, 'function');
});

test('Should create a match', async (t) => {
  const insertOne = sinon.stub().resolves(inputMatch);
  const matchRepository = createMatchRepository({ insertOne });
  await matchRepository.create(inputMatch);
  t.true(insertOne.calledOnce);
  t.true(insertOne.calledWithExactly(inputMatch));
});
