import test from 'ava';

import createApp from '../../../src/interfaces/http/server';

test('Should create an application', t => {
  const errorHandler = () => {};
  const app = createApp(errorHandler);
  t.is(typeof app, 'object');
});
