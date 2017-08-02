import test from 'ava';
import request from 'supertest';
import uuid from 'uuid';

import arango from '../../components/arango';
import express from '../../components/express';
import router from './index';

// let db;
// let graph;
const match = {
  red: { points: 10 },
  blue: { points: 7 },
  createdAt: new Date()
};
const teams = {
  red: {},
  blue: {}
};
const players = [
  { trigram: 'ABC' },
  { trigram: 'DEF' },
  { trigram: 'GHI' },
  { trigram: 'JKL' }
];

test.beforeEach('Create an API', async t => {
  const db = await arango();
  const databaseName = `database-match-${uuid()}`;
  const graph = await db.init({
    databaseName,
    graphName: `graph-match-${uuid()}`
  });
  // Create match store
  const matchStoreName = `match-${uuid()}`;
  const matchStore = graph.vertexCollection(matchStoreName);
  await graph.addVertexCollection(matchStoreName);
  // Create team store
  const teamStoreName = `team-${uuid()}`;
  const teamStore = graph.vertexCollection(teamStoreName);
  await graph.addVertexCollection(teamStoreName);
  // Create "played" edge store
  const playedStoreName = `played-${uuid()}`;
  const playedStore = graph.edgeCollection(playedStoreName);
  await graph.addEdgeDefinition({
    collection: playedStoreName,
    from: [teamStoreName],
    to: [matchStoreName]
  })
  const routes = router(matchStore, playedStore, teamStore);
  t.context = {
    api: express(routes),
    matchStore,
    teamStore,
    playedStore,
    db,
    graph,
    databaseName
  };
});

test.afterEach.always('Clean up the database', async t => {
  await t.context.graph.drop(true);
  t.context.db.useDatabase('_system');
  await t.context.db.dropDatabase(t.context.databaseName);
});

test('GET /matches - 200 OK', async t => {
  const saved = await t.context.matchStore.save(match);
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

test('GET /matches/:id - 200 OK', async t => {
  // Create a match
  const saved = await t.context.matchStore.save(match);
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

test('GET /matches/:id - 404 Not found', async t => {
  const res = await request(t.context.api)
    .get('/matches/1234')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 404);
});

test('GET /matches/:id/teams - 200 OK', async t => {
  // Create a match
  const savedMatch = await t.context.matchStore.save(match);
  t.is(savedMatch.error, false);
  t.is(savedMatch.code, 202);
  t.is(typeof savedMatch.vertex, 'object');
  // Create teams associated with a match
  const [redTeam, blueTeam] = await Promise.all([
    t.context.teamStore.save(teams.red),
    t.context.teamStore.save(teams.blue)
  ])
  // Create edges
  await Promise.all([
    t.context.playedStore.save(
      { color: 'red' },
      redTeam.vertex._id,
      savedMatch.vertex._id
    ),
    t.context.playedStore.save(
      { color: 'blue' },
      blueTeam.vertex._id,
      savedMatch.vertex._id
    )
  ]);
  const res = await request(t.context.api)
    .get(`/matches/${savedMatch.vertex._key}/teams`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
  t.is(res.body.length, 2);
  res.body.forEach(team => {
    t.is(typeof team, 'object');
    t.is(typeof team._id, 'string');
    t.is(typeof team._key, 'string');
    t.is(typeof team._rev, 'string');
    t.is(typeof team._from, 'string');
    t.is(typeof team._to, 'string');
  });
});

test('GET /matches/:id/teams - 404 Not found', async t => {
  const res = await request(t.context.api)
    .get(`/matches/1234/teams`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 404);
});

test('POST /matches/:id/teams - 201 Created', async t => {
  // Create a match
  const savedMatch = await t.context.matchStore.save(match);
  t.is(savedMatch.error, false);
  t.is(savedMatch.code, 202);
  t.is(typeof savedMatch.vertex, 'object');
  // Send request to the API
  const res = await request(t.context.api)
    .post(`/matches/${savedMatch.vertex._key}/teams`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');
  t.is(typeof res, 'object');
  t.is(res.status, 201);
  t.true(Array.isArray(res.body));
  t.is(res.body.length, 2);
  res.body.forEach(team => {
    t.is(typeof team, 'object');
    t.is(typeof team._id, 'string');
    t.is(typeof team._key, 'string');
    t.is(typeof team._rev, 'string');
  });
});

test.todo('GET /matches/:id/red - 200 OK');

test.todo('GET /matches/:id/red - 404 Not found');

test.todo('POST /matches/:id/red - 201 Created');

test.todo('POST /matches/:id/red - 400 Bad request');
