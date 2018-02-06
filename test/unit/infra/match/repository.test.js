import test from 'ava';
import sinon from 'sinon';

import createMatchRepository, {
  toDBO,
  toEntity,
} from '../../../../src/infra/match/match-repository';
import { inputMatch } from '../../../data';

test('Should convert an entity to a database object', async (t) => {
  const matchDBO = {
    _id: 42,
    red: {
      points: 10,
      players: ['ABC', 'DEF'],
    },
    blue: {
      points: 6,
      players: ['GHI', 'JKL'],
    },
  };
  const matchEntity = toEntity(matchDBO);
  t.is(typeof matchEntity, 'object');
  t.deepEqual(matchEntity, {
    id: 42,
    red: {
      points: 10,
      players: ['ABC', 'DEF'],
    },
    blue: {
      points: 6,
      players: ['GHI', 'JKL'],
    },
  });
});

test('Should convert a database object to an entity', async (t) => {
  const matchEntity = {
    red: {
      points: 10,
      players: ['ABC', 'DEF'],
    },
    blue: {
      points: 6,
      players: ['GHI', 'JKL'],
    },
  };
  const matchDBO = toDBO(matchEntity);
  t.is(typeof matchDBO, 'object');
  t.deepEqual(matchDBO, {
    red: {
      points: 10,
      players: ['ABC', 'DEF'],
    },
    blue: {
      points: 6,
      players: ['GHI', 'JKL'],
    },
  });
});

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
