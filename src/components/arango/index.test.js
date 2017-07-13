import test from 'ava';
import uuid from 'uuid';

import arango from './index';

test('Should create a database instance', async t => {
  const db = await arango();
  t.is(typeof db, 'object');
  t.truthy(db.useDatabase);
  t.truthy(db.graph);
  // etc.
});

test('Should init a test database', async t => {
  // Init
  const db = await arango();
  const databaseName = `database-${uuid()}`;
  const graphName = `graph-${uuid()}`;
  const { graph } = await db.init({
    databaseName,
    graphName
  });
  // Test
  const dbInfo = await db.get();
  t.is(typeof dbInfo, 'object');
  t.is(typeof dbInfo.name, 'string');
  t.is(dbInfo.isSystem, false);
  const graphInfo = await graph.get();
  t.is(typeof graphInfo, 'object');
  t.is(typeof graphInfo.name, 'string');
  // Clean up
  await graph.drop();
  db.useDatabase('_system');
  await db.dropDatabase(databaseName)
});
