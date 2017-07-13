import test from 'ava';
import sinon from 'sinon';

import * as model from './vertex';

test('Should return a createModel instance', async t => {
  t.truthy(model.vertex);
  t.truthy(model.save);
});

test('Should return a vertex', async t => {
  const store = {
    vertex: sinon.stub().returns(
      Promise.resolve({ vertex: 42 })
    )
  };
  const vertex = model.vertex(store);
  const result = await vertex('handle');
  t.true(store.vertex.calledOnce);
  t.true(store.vertex.calledWithExactly('handle'));
  t.is(result, 42);
});

test('Should save an entity', async t => {
  const store = {
    save: sinon.stub().returns(
      Promise.resolve({ vertex: 42 })
    )
  };
  const save = model.save(store);
  const result = await save('data', 'fromId', 'toId');
  t.true(store.save.calledOnce);
  t.true(store.save.calledWithExactly('data', 'fromId', 'toId'));
  t.is(result, 42);
});