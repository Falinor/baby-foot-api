import test from 'ava';
import request from 'supertest';

import createApp from '../../src/interfaces/http/app';
import routes from '../../src/interfaces/http/player';

test.beforeEach('Create context', async (t) => {
  t.context = {
    app: createApp(console, routes),
  };
});

test('GET /players -> 200 OK', async (t) => {
  const { app } = t.context;
  const res = await request(app)
    .get('/');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  const players = res.body;
  t.true(Array.isArray(players));
  t.true(players.length <= 10);
  const promises = players.map(async (player) => {
    t.is(typeof player, 'object');
    t.is(typeof player.id, 'string');
  });
  return Promise.all(promises);
});
