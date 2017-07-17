import test from 'ava';
import request from 'supertest';
import uuid from 'uuid';

import arango from '../../components/arango';
import express from '../../components/express';
import router from './index';

let db;
let graph;
let match;

test.before('Create a match instance', async () => {
  match = {
    red: { points: 10 },
    blue: { points: 7 },
    createdAt: new Date()
  };
  db = await arango();
  graph = await db.init({
    databaseName: 'database-match-test',
    graphName: 'graph-match-index'
  });
});

test.beforeEach('Create an API', async t => {
  const storeName = `match-${uuid()}`;
  const store = graph.vertexCollection(storeName);
  await store.create();
  await graph.addVertexCollection(storeName);
  const routes = router(store);
  t.context = {
    api: express(routes),
    store
  };
});

test.afterEach.always('Drop the collection', async t => {
  await t.context.store.drop();
});

test.after.always('Clean up the database', async () => {
  await graph.drop(true);
  db.useDatabase('_system');
  await db.dropDatabase('database-match-test');
});

test('POST /matches - 201 Created', async t => {
  const res = await request(t.context.api)
    .post('/matches')
    .send(match)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 201);
  t.is(typeof res.body, 'object');
  t.is(typeof res.body._id, 'string');
  t.is(typeof res.body._key, 'string');
  t.is(typeof res.body.createdAt, 'string');
  t.deepEqual(res.body.red, match.red);
  t.deepEqual(res.body.blue, match.blue);
});

test.todo('POST /matches - 400 Bad request');

test('GET /matches - 200 OK', async t => {
  const saved = await t.context.store.save(match);
  t.is(saved.error, false);
  t.is(saved.code, 202);
  t.is(typeof saved.vertex, 'object');
  const res = await request(t.context.api)
    .get('/matches')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.true(res.body.length >= 0);
});

test('GET /matches/:id - 200 OK', async t => {
  const saved = await t.context.store.save(match);
  t.is(saved.error, false);
  t.is(saved.code, 202);
  t.is(typeof saved.vertex, 'object');
  const res = await request(t.context.api)
    .get(`/matches/${saved.vertex._key}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.is(typeof res.body, 'object');
  t.is(typeof res.body._id, 'string');
  t.is(typeof res.body._key, 'string');
  t.is(typeof res.body._rev, 'string');
  t.is(typeof res.body.red, 'object');
  t.is(typeof res.body.red.points, 'number');
  t.is(typeof res.body.blue, 'object');
  t.is(typeof res.body.blue.points, 'number');
  t.is(typeof res.body.createdAt, 'string');
});

test.todo('GET /matches/:id - 400 Bad request');

test.todo('GET /matches/:id - 404 Not found');
