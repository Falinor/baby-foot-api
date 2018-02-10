import test from 'ava';
import request from 'supertest';

import createApp from '../../src/interfaces/http/app';
import routes from '../../src/interfaces/http/match';

test.beforeEach('Create context', (t) => {
  t.context = {
    app: createApp(console, routes),
  };
});

test('GET /matches -> 200 OK', async (t) => {
  const { app } = t.context;
  const res = await request(app)
    .get('/');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  const matches = res.body;
  t.true(Array.isArray(matches));
  // Check default limit
  t.true(matches.length <= 10);
  const promises = matches.map(async (match) => {
    t.is(typeof match.id, 'string');
    // Red team
    t.is(typeof match.red, 'object');
    t.true(Array.isArray(match.red.players));
    t.is(match.red.players.length, 2);
    await Promise.all(match.red.players.map(async (player) => {
      t.is(typeof player, 'object');
      t.is(typeof player.id, 'string');
    }));
    // Blue team
    t.is(typeof match.blue, 'object');
    t.true(Array.isArray(match.blue.players));
    t.is(match.blue.players.length, 2);
    await Promise.all(match.blue.players.map(async (player) => {
      t.is(typeof player, 'object');
      t.is(typeof player.id, 'string');
    }));
  });
  return Promise.all(promises);
});

test('POST /matches -> 201 Created', async (t) => {
  const { app } = t.context;
  const res = await request(app)
    .post('/')
    .send({
      red: {
        points: 10,
        players: ['ABC', 'DEF'],
      },
      blue: {
        points: 6,
        players: ['GHI', 'JKL'],
      },
    })
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 201);
  t.is(typeof res.headers.Location, 'string');
  // The header 'Location' should be something like `https://.../matches/{id}
  t.regex(res.headers.Location, /\/matches\/[a-g0-9]+$/);
});
