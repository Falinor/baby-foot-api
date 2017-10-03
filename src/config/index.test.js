import test from 'ava';

import config from './index';

test('Should return the config object', async t => {
  t.truthy(config.env);
  t.truthy(config.root);
  t.truthy(config.port);
  t.truthy(config.ip);
  t.truthy(config.db);
  t.is(typeof config.db, 'object');
});
