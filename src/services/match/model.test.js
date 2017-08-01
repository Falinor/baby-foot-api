import test from 'ava';
import sinon from 'sinon';

import createModel, {
  find,
  findOne,
  vertex,
  save,
  getTeams
} from './model';

test('Should export default model functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof findOne, 'function');
  t.is(typeof vertex, 'function');
  t.is(typeof save, 'function');
  t.is(typeof getTeams, 'function');
});

test('Should create a createModel instance', async t => {
  const model = createModel({}, {});
  t.is(typeof model.find, 'function');
  t.is(typeof model.findOne, 'function');
  t.is(typeof model.save, 'function');
  t.is(typeof model.vertex, 'function');
  t.is(typeof model.getTeams, 'function');
});

test('Should find teams associated with a match', async t => {
  const playedStore = {
    inEdges: sinon.stub().returns(
      Promise.resolve([
        { _id: '42', color: 'red' },
        { _id: '43', color: 'blue' }
      ])
    )
  };
  const model = createModel({}, playedStore);
  const teams = await model.getTeams('1234');
  t.true(Array.isArray(teams));
  t.is(teams.length, 2);
});
