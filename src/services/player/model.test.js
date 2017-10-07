import test from 'ava';
import sinon from 'sinon';

import createModel, { find, findOne, findTeams } from './model';

test('Should export default model functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof findOne, 'function');
  t.is(typeof findTeams, 'function');
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
  t.is(typeof model.findOne, 'function');
  t.is(typeof model.findTeams, 'function');
});

test('Should find a player\'s team', async t => {
  const stub = {
    query: sinon.stub().resolves({
      all: sinon.stub().resolves([1, 2])
    })
  };
  const teams = await findTeams(stub)(123);
  t.true(stub.query.calledOnce);
  t.true(Array.isArray(teams));
  t.deepEqual(teams, [1, 2]);
});
