import test from 'ava';
import uuid from 'uuid';

import arango from '../components/arango';
import seed from './utils';

test('Should seed the database', async t => {
  const db = await arango();
  const databaseName = `database-team-${uuid()}`;
  const graph = await db.init({
    databaseName,
    graphName: `graph-match-${uuid()}`
  });
  // Actually seed the database
  await seed(graph);
  // Test the number of collections
  const collections = await db.listCollections(true);
  t.is(collections.length, 5);
  // Clean up
  db.useDatabase('_system');
  await db.dropDatabase(databaseName);
});
