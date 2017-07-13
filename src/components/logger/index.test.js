import test from 'ava';

import logger from './index';

test('Should create a logger instance', async t => {
  t.truthy(logger);
});
