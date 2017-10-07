import test from 'ava';
import sinon from 'sinon';

import createModel, {
  find,
  findOne,
  vertex,
  save
} from './model';

test('Should export default model functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof findOne, 'function');
  t.is(typeof vertex, 'function');
  t.is(typeof save, 'function');
});

test('Should create a createModel instance', async t => {
  const stub = {
    graph: sinon.stub().returns({
      vertexCollection: sinon.stub()
    })
  };
  const model = createModel(stub);
  t.is(typeof model.find, 'function');
  t.is(typeof model.findOne, 'function');
  t.is(typeof model.save, 'function');
  t.is(typeof model.vertex, 'function');
});
