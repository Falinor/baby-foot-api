import test from 'ava';

import createConfig from '../../../src/config/index';

test('Should return the config object', async (t) => {
  const config = createConfig({
    DB_URL: 'mydb',
  });
  t.is(typeof config, 'object');
  t.is(typeof config.appName, 'string');
  t.is(typeof config.host, 'string');
  t.is(typeof config.env, 'string');
  t.is(typeof config.port, 'number');
  t.is(typeof config.db, 'object');
  t.is(typeof config.db.url, 'string');
  t.is(typeof config.db.retryConnection, 'boolean');
});
