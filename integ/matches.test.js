import test from 'ava';
import request from 'supertest';

import { createMatch, createTestServer } from './utils';

test.beforeEach('Create context', async t => {
  // Add a scoped container
  // app.use(scopePerRequest(container));
  const app = createTestServer();
  t.context = {
    app: app.callback(),
  };
});

test.serial('GET /matches -> 200 OK', async t => {
  const { app } = t.context;
  await createMatch();
  await createMatch();
  const res = await request(app).get('/matches');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.is(res.type, 'application/json');
  const matches = res.body;
  t.true(Array.isArray(matches));
  // Check default limit
  t.true(matches.length <= 10);
  const promises = matches.map(async match => {
    t.is(typeof match.id, 'string');
    // Red team
    t.is(typeof match.red, 'object');
    t.true(Array.isArray(match.red.players));
    t.is(match.red.players.length, 2);
    await Promise.all(
      match.red.players.map(async player => {
        t.is(typeof player, 'object');
        t.is(typeof player.id, 'string');
      }),
    );
    // Blue team
    t.is(typeof match.blue, 'object');
    t.true(Array.isArray(match.blue.players));
    t.is(match.blue.players.length, 2);
    await Promise.all(
      match.blue.players.map(async player => {
        t.is(typeof player, 'object');
        t.is(typeof player.id, 'string');
      }),
    );
  });
  return Promise.all(promises);
});

test.serial.only('POST /matches -> 201 Created', async t => {
  const { app } = t.context;
  const res = await request(app)
    .post('/v1/matches')
    .send({
      red: {
        points: 10,
        players: ['ABC', 'DEF'],
      },
      blue: {
        points: 6,
        players: ['GHI', 'KLM'],
      },
    })
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 201);
  t.is(typeof res.headers.location, 'string');
  // The header 'Location' should be something like `https://.../matches/{id}
  t.regex(res.headers.location, /\/matches\/[a-g0-9-]+$/);
});
