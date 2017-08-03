import test from 'ava';
import request from 'supertest';
import uuid from 'uuid';

import arango from '../../components/arango';
import express from '../../components/express';
import router from './index';
import seed from '../../test/utils';

test.beforeEach('Create an API', async t => {
  const db = await arango();
  const databaseName = `database-team-${uuid()}`;
  const graph = await db.init({
    databaseName,
    graphName: `graph-match-${uuid()}`
  });
  const { teamStore } = await seed(graph);
  // Create routes
  const routes = router(teamStore);
  // Create context
  t.context = {
    api: express(routes),
    teamStore,
    db,
    graph,
    databaseName
  };
});

test.afterEach.always('Clean up the database', async t => {
  t.context.db.useDatabase('_system');
  await t.context.db.dropDatabase(t.context.databaseName);
});

test('Should create an API', async t => {
  const routes = router({});
  t.is(typeof routes, 'function');
});

test('GET /teams - 200 OK', async t => {
  const res = await request(t.context.api)
    .get('/teams')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length >= 0);
  res.body.forEach(team => {
    t.is(typeof team._key, 'string');
    t.is(typeof team._id, 'string');
    t.is(typeof team._rev, 'string');
  });
});

test('GET /teams/:id - 200 OK', async t => {
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

test('GET /teams/:id - 404 Not found', async t => {
  const res = await request(t.context.api)
    .get('/teams/1234')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 404);
});

test('GET /teams/:id/matches - 200 OK', async t => {
  // Fetch a random team
  const team = await t.context.teamStore.any();
  const res = await request(t.context.api)
    .get(`/teams/${team._key}/matches`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length >= 0);
  console.log(res.body);
});

test.todo('GET /teams/:id/matches - 404 Not found');
