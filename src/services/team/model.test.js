import test from 'ava';
import sinon from 'sinon';

import createModel, { find, getPlayers, vertex } from './model';

test('Should export default model functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof vertex, 'function');
  t.is(typeof getPlayers, 'function');
});

test('Should create a model instance', async t => {
  const stub = {
    graph: sinon.stub().returns({
      vertexCollection: sinon.stub()
    })
  };
  const model = createModel(stub);
  t.is(typeof model, 'object');
  t.is(typeof model.find, 'function');
  t.is(typeof model.vertex, 'function');
  t.is(typeof model.getPlayers, 'function');
});
