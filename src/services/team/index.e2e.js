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
  const { teamStore } = await seed(graph);
  // Create routes
  const routes = router(db);
  // Create context
  t.context = {
    api: express(routes),
    teamStore
  };
});

test.afterEach.always('Clean up the database', async () => {
  await db.truncate();
});

test.serial('Should create an API', async t => {
  const routes = router(db);
  t.is(typeof routes, 'function');
});

test.serial('GET /teams - 200 OK', async t => {
  const res = await request(t.context.api)
    .get('/teams')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length > 0);
  res.body.forEach(team => {
    t.is(typeof team._key, 'string');
    t.is(typeof team._id, 'string');
    t.is(typeof team._rev, 'string');
  });
});

test.serial('GET /teams/:id - 200 OK', async t => {
  // Fetch a random team
  const team = await t.context.teamStore.any();
  const res = await request(t.context.api)
    .get(`/teams/${team._key}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.is(typeof res.body._key, 'string');
  t.is(typeof res.body._id, 'string');
  t.is(typeof res.body._rev, 'string');
});

test.serial('GET /teams/:id - 404 Not found', async t => {
  const res = await request(t.context.api)
    .get('/teams/1234')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 404);
});

test.serial('GET /teams/:id/matches - 200 OK', async t => {
  // Fetch a random team
  const team = await teamStore.any();
  const res = await request(t.context.api)
    .get(`/teams/${team._key}/matches`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length > 0);
  res.body.forEach(match => {
    t.is(typeof match._id, 'string');
    t.is(typeof match._key, 'string');
    t.is(typeof match._rev, 'string');
    t.is(typeof match.red, 'object');
    t.is(typeof match.blue, 'object');
    t.is(typeof match.red.points, 'number');
    t.is(typeof match.blue.points, 'number');
  });
});

test.todo('GET /teams/:id/matches - 404 Not found');
