import test from 'ava';
import request from 'supertest';
import uuid from 'uuid';

import arango from '../../components/arango';
import express from '../../components/express';
import router from './index';
import seed from '../../test/utils';

test.beforeEach('Create an API', async t => {
  const db = await arango();
  const databaseName = `database-player-${uuid()}`;
  const graph = await db.init({
    databaseName,
    graphName: `graph-player-${uuid()}`
  });
  // Seed database
  const { playerStore } = await seed(graph);
  // Create routes
  const routes = router(playerStore);
  // Set context
  t.context = {
    api: express(routes),
    playerStore,
    db,
    graph,
    databaseName
  };
});

test.afterEach.always('Clean up the database', async t => {
  t.context.db.useDatabase('_system');
  await t.context.db.dropDatabase(t.context.databaseName);
});

test('GET /players - 200 OK', async t => {
  const res = await request(t.context.api)
    .get('/players')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length > 0);
  res.body.forEach(player => {
    t.is(typeof player._key, 'string');
    t.is(typeof player._id, 'string');
    t.is(typeof player._rev, 'string');
    t.is(typeof player.trigram, 'string');
    t.regex(player.trigram, /^[A-Z]{3}$/);
  });
});

test('GET /players/:trigram - 200 OK', async t => {
  // Fetch a random player
  const player = await t.context.playerStore.any();
  const res = await request(t.context.api)
    .get(`/players/${player.trigram}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.is(typeof res.body._key, 'string');
  t.is(typeof res.body._id, 'string');
  t.is(typeof res.body._rev, 'string');
  t.is(typeof res.body.trigram, 'string');
  t.regex(res.body.trigram, /^[A-Z]{3}$/);
});

test('GET /players/:trigram - 404 Not found', async t => {
  const res = await request(t.context.api)
    .get('/players/xyz')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 404);
});

test.todo('GET /players/:trigram/teams - 200 OK');

test.todo('GET /players/:trigram/wins/count - 200 OK');

test.todo('GET /players/:trigram/losses/count - 200 OK');
