import test from 'ava';
import request from 'supertest';

import arango from '../../components/arango';
import express from '../../components/express';
import router from './index';
import seed from '../../test/utils';

let db;
let graph;

test.before('Connect to database', async () => {
  db = await arango();
  graph = await db.init();
});

test.beforeEach('Create an API', async t => {
  // Seed database
  const { playerStore } = await seed(graph);
  // Create routes
  const routes = router(db);
  // Set context
  t.context = {
    api: express(routes),
    playerStore
  };
});

test.afterEach.always('Clean up the database', async () => {
  await db.truncate();
});

test.serial('GET /players - 200 OK', async t => {
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

test.serial('GET /players/:trigram - 200 OK', async t => {
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

/**
 * Should work even if the player's trigram is upper case.
 */
test.serial('GET /players/:trigram - 200 OK', async t => {
  // Fetch a random player
  const player = await t.context.playerStore.any();
  const res = await request(t.context.api)
    .get(`/players/${player.trigram.toUpperCase()}`)
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

test.serial('GET /players/:trigram - 404 Not found', async t => {
  const res = await request(t.context.api)
    .get('/players/xyz')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 404);
});

test.serial('GET /players/:trigram/teams - 200 OK', async t => {
  // Fetch a random player
  const player = await t.context.playerStore.any();
  const res = await request(t.context.api)
    .get(`/players/${player.trigram}/teams`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length > 0);
});

test.serial('GET /players/:trigram/matches - 200 OK', async t => {
  // Fetch a random player
  const players = await t.context.playerStore.any();
  const res = await request(t.context.api)
    .get(`/players/${player.trigram}/matches`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length > 0);
});

test.todo('GET /players/:trigram/wins/count - 200 OK');

test.todo('GET /players/:trigram/losses/count - 200 OK');
