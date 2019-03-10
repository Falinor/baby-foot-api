import test from 'ava';
import sinon from 'sinon';

import createRepository, {
  toDBO,
  toEntity,
} from '../../../src/infra/player/mongodb-repository';
import { DBOPlayers, inputPlayer } from '../../data';

test('Should create a player repository', t => {
  const repo = createRepository();
  t.is(typeof repo, 'object');
  t.is(typeof repo.create, 'function');
  t.is(typeof repo.find, 'function');
  t.is(typeof repo.findById, 'function');
});

test('Should convert an entity to a DBO', t => {
  const playerEntity = {
    id: 42,
  };
  const playerDBO = toDBO(playerEntity);
  t.deepEqual(playerDBO, {
    _id: playerEntity.id,
  });
});

test('Should convert a DBO to an entity', t => {
  const playerDBO = {
    _id: 1337,
  };
  const playerEntity = toEntity(playerDBO);
  t.deepEqual(playerEntity, {
    id: 1337,
  });
});

test('Should create a player', async t => {
  const insertOne = sinon.stub().resolves(inputPlayer);
  const repo = createRepository({ insertOne });
  await repo.create(inputPlayer);
  t.true(
    insertOne.calledOnceWithExactly({
      _id: inputPlayer.id,
    }),
  );
});

test('Should find players', async t => {
  const playerStore = {
    find: sinon.stub().returnsThis(),
    toArray: sinon.stub().resolves(DBOPlayers),
  };
  const repo = createRepository(playerStore);
  const actual = await repo.find();
  t.is(actual.length, DBOPlayers.length);
});

test('Should find a player by ID', async t => {
  const findOne = sinon.stub().resolves();
  const repo = createRepository({ findOne });
  await repo.findById(42);
  t.true(findOne.calledOnceWithExactly({ _id: 42 }));
});
