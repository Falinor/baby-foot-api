import test from 'ava';

import createModel, { find, findOne } from './model';

test('Should export default model functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof findOne, 'function');
});

test('Should create a model instance', async t => {
  const model = createModel({});
  t.is(typeof model, 'object');
  t.is(typeof model.find, 'function');
  t.is(typeof model.findOne, 'function');
});
