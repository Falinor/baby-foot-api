import test from 'ava';
import sinon from 'sinon';

import createRepository, {
  toDBO,
  toEntity,
} from '../../../../src/infra/player/repository';
import { inputPlayer } from '../../../data';

test('Should create a player repository', (t) => {
  const repo = createRepository();
  t.is(typeof repo, 'object');
  t.is(typeof repo.create, 'function');
  t.is(typeof repo.find, 'function');
  t.is(typeof repo.findById, 'function');
});

test('Should convert an entity to a DBO', (t) => {
  const playerEntity = {
    id: 42,
  };
  const playerDBO = toDBO(playerEntity);
  t.deepEqual(playerDBO, {
    _id: playerEntity.id,
  });
});

test('Should convert a DBO to an entity', (t) => {
  const playerDBO = {
    _id: 1337,
  };
  const playerEntity = toEntity(playerDBO);
  t.deepEqual(playerEntity, {
    id: 1337,
  });
});

test('Should create a player', async (t) => {
  const insertOne = sinon.stub().resolves(inputPlayer);
  const repo = createRepository({ insertOne });
  await repo.create(inputPlayer);
  t.true(insertOne.calledOnce);
  t.true(insertOne.calledWithExactly(inputPlayer));
});

test('Should find players', async (t) => {
  const find = sinon.stub().resolves();
  const repo = createRepository({ find });
  await repo.find();
  t.true(find.calledOnce);
  t.true(find.calledWithExactly({}));
});

test('Should find a player by ID', async (t) => {
  const findOne = sinon.stub().resolves();
  const repo = createRepository({ findOne });
  await repo.findById(42);
  t.true(findOne.calledOnce);
  t.true(findOne.calledWithExactly({ _id: 42 }));
});
