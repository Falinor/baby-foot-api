import test from 'ava';

import createApp from '../../../../src/interfaces/http/app';

test('Should create an application', async (t) => {
  const app = createApp();
  t.is(typeof app, 'object');
});
