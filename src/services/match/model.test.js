import test from 'ava';

import createModel from './model';

test('Should create a createModel instance', async t => {
  const model = createModel({});
  t.is(typeof model.find, 'function');
  t.is(typeof model.findOne, 'function');
  t.is(typeof model.save, 'function');
  t.is(typeof model.vertex, 'function');
});
