import test from 'ava';

import config from '../../../src/config/index';

test('Should return the config object', async (t) => {
  t.truthy(config.env);
  t.truthy(config.root);
  t.truthy(config.port);
  t.truthy(config.ip);
  t.truthy(config.db);
  t.is(typeof config.db, 'object');
  t.is(typeof config.db.url, 'string');
  t.is(typeof config.db.databaseName, 'string');
  t.is(typeof config.db.graphName, 'string');
  t.is(typeof config.db.retryConnection, 'boolean');
  t.is(typeof config.db.collections, 'object');
  t.is(typeof config.db.collections.matches, 'string');
  t.is(typeof config.db.collections.teams, 'string');
  t.is(typeof config.db.collections.players, 'string');
  t.is(typeof config.db.collections.played, 'string');
  t.is(typeof config.db.collections.member, 'string');
});
