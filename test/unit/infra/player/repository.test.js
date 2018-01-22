import test from 'ava';
import sinon from 'sinon';

import createRepository from '../../../../src/infra/player/repository';

test('Should create a player repository', async (t) => {
  const repo = createRepository();
  t.is(typeof repo, 'object');
  t.is(typeof repo.find, 'function');
  t.is(typeof repo.findById, 'function');
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
