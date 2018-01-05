import test from 'ava';

import config from '../src/config/index';

import arango from '../src/components/arango/index';
import seed from './utils';

test.serial('Should seed the database', async (t) => {
  const db = await arango();
  const graph = await db.init();
  // Actually seed the database
  await seed(graph);
  // Test the number of collections
  const collections = await db.listCollections(true);
  t.is(collections.length, 5);
  // Clean up
  db.useDatabase('_system');
  await db.dropDatabase(config.databaseName);
});
