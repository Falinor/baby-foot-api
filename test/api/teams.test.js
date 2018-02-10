import test from 'ava';
import request from 'supertest';

import createApp from '../../src/interfaces/http/app';
// TODO: change player for team
import routes from '../../src/interfaces/http/player';

test.beforeEach('Create context', async (t) => {
  t.context = {
    app: createApp(console, routes),
  };
});

test('GET /teams -> 200 OK', async (t) => {
  const { app } = t.context;
  const res = await request(app)
    .get('/');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  const teams = res.body;
  t.true(Array.isArray(teams));
  // Check default limit
  t.true(teams.length <= 10);
  const promises = teams.map(async (team) => {
    t.is(typeof team, 'object');
    t.is(typeof team.id, 'string');
    t.true(Array.isArray(team.players));
    t.is(team.players.length, 2);
    return Promise.all(team.players.map(async (player) => {
      t.is(typeof player, 'object');
      t.is(typeof player.id, 'string');
    }));
  });
  return Promise.all(promises);
});
