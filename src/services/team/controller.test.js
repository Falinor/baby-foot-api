import test from 'ava';

import createController, { find, get } from './controller';

test('Should export default controller functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof get, 'function');
});

test('Should create a controller instance', async t => {
  const controller = createController({});
  t.is(typeof controller.find, 'function');
  t.is(typeof controller.get, 'function');
});
