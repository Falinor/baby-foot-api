import test from 'ava';
import request from 'supertest';
import uuid from 'uuid';

import arango from '../../components/arango';
import express from '../../components/express';
import router from './index';

test.beforeEach('Create an API', async t => {
  const db = await arango();
  const databaseName = `database-team-${uuid()}`;
  const graph = await db.init({
    databaseName,
    graphName: `graph-match-${uuid()}`
  });
  // Create team store
  const teamStoreName = `team-${uuid()}`;
  const teamStore = graph.vertexCollection(teamStoreName);
  await graph.addVertexCollection(teamStoreName);
  // Create a team record
  const { vertex } = await teamStore.save({});
  // Create routes
  const routes = router(teamStore);
  // Create context
  t.context = {
    api: express(routes),
    teamStore,
    db,
    graph,
    databaseName,
    team: vertex
  };
});

test.afterEach.always('Clean up the database', async t => {
  await t.context.graph.drop(true);
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
  t.is(res.body.length, 1);
  const [team] = res.body;
  t.is(typeof team._key, 'string');
  t.is(typeof team._id, 'string');
  t.is(typeof team._rev, 'string');
});

test('GET /teams/:id - 200 OK', async t => {
  const res = await request(t.context.api)
    .get(`/teams/${t.context.team._key}`)
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
