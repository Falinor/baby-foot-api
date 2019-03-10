import test from 'ava';
import sinon from 'sinon';

import createGetPlayerUseCase from '../../../src/app/player/get-player';

test('Should create a GetPlayer use case', async t => {
  const repo = {};
  const getPlayerUseCase = createGetPlayerUseCase(repo);
  t.is(typeof getPlayerUseCase, 'object');
  t.is(typeof getPlayerUseCase.execute, 'function');
  t.is(typeof getPlayerUseCase.on, 'function');
  t.is(typeof getPlayerUseCase.outputs, 'object');
  t.deepEqual(getPlayerUseCase.outputs, { SUCCESS: 'success', ERROR: 'error' });
  t.is(repo, getPlayerUseCase.playerRepository);
});

test('Should get a player and emit a success event', async t => {
  const expected = {
    id: 'ABC', // trigram
  };
  const repo = {
    findById: sinon.stub().resolves(expected),
  };
  const getPlayerUseCase = createGetPlayerUseCase(repo);
  getPlayerUseCase.on(getPlayerUseCase.outputs.SUCCESS, player => {
    t.is(player, expected);
  });
  await getPlayerUseCase.execute('ABC');
});

test('Should get a player and emit an error event', async t => {
  const repo = {
    findById: sinon.stub().throws(),
  };
  const getPlayerUseCase = createGetPlayerUseCase(repo);
  getPlayerUseCase.on(getPlayerUseCase.outputs.ERROR, err => {
    t.is(typeof err, 'object');
    t.is(typeof err.name, 'string');
    t.is(typeof err.message, 'string');
  });
  await getPlayerUseCase.execute('ABC');
});
