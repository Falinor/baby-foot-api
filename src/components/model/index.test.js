import test from 'ava';
import sinon from 'sinon';

import * as model from './index';

test('Should have methods', async (t) => {
  t.is(typeof model.find, 'function');
  t.is(typeof model.findOne, 'function');
  t.is(typeof model.vertex, 'function');
  t.is(typeof model.save, 'function');
});

test('Should find an entity by example', async (t) => {
  const store = {
    byExample: sinon.stub().returns(Promise.resolve({
      all: () => {},
    })),
  };
  const find = model.find(store);
  await find('example', 'opts');
  t.true(store.byExample.calledOnce);
  t.true(store.byExample.calledWithExactly('example', 'opts'));
});

test('Should find one entity by example', async (t) => {
  const store = {
    firstExample: sinon.stub(),
  };
  const findOne = model.findOne(store);
  await findOne('example');
  t.true(store.firstExample.calledOnce);
  t.true(store.firstExample.calledWithExactly('example'));
});
