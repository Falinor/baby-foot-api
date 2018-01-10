import test from 'ava';
import sinon from 'sinon';

import createGetPlayer from '../../../../src/app/player/get-player';

test('Should create a getPlayer use case', async (t) => {
  const repo = {};
  const getPlayer = createGetPlayer(repo);
  t.is(typeof getPlayer, 'object');
  t.is(typeof getPlayer.execute, 'function');
  t.is(typeof getPlayer.on, 'function');
  t.is(repo, getPlayer.playerRepository);
});

test('Should execute the use case and emit a success event', async (t) => {
  const expected = {
    id: 'ABC', // trigram
  };
  const repo = {
    findById: sinon.stub().resolves(expected),
  };
  const getPlayer = createGetPlayer(repo);
  getPlayer.on('success', (player) => {
    t.is(player, expected);
  });
  await getPlayer.execute('ABC');
});

test('Should execute the use case and emit an error event', async (t) => {
  const repo = {
    findById: sinon.stub().throws(),
  };
  const getPlayer = createGetPlayer(repo);
  getPlayer.on('error', (err) => {
    t.is(typeof err, 'object');
    t.is(typeof err.name, 'string');
    t.is(typeof err.message, 'string');
  });
  await getPlayer.execute('ABC');
});

/*

*/
