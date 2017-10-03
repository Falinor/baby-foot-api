import test from 'ava';
import sinon from 'sinon';

import createModel, { find, getMatches, getPlayers, vertex } from './model';

test('Should export default model functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof vertex, 'function');
  t.is(typeof getMatches, 'function');
  t.is(typeof getPlayers, 'function');
});

test('Should create a model instance', async t => {
  const model = createModel({});
  t.is(typeof model, 'object');
  t.is(typeof model.find, 'function');
  t.is(typeof model.vertex, 'function');
  t.is(typeof model.getMatches, 'function');
  t.is(typeof model.getPlayers, 'function');
});

test('Should get the matches that a team played', async t => {
  const createdAt = new Date();
  const playedStore = {
    outEdges: sinon.stub().resolves([
      { _from: '1234', _to: '5678' }
    ])
  };
  const matchStore = {
    vertex: sinon.stub().resolves({
      vertex: {
        red: { points: 10 }, blue: { points: 6 }, createdAt
      }
    })
  };
  const model = createModel({
    playedStore,
    matchStore
  });
  const matches = await model.getMatches('1234');
  t.true(Array.isArray(matches));
  t.deepEqual(matches[0], {
    red: { points: 10 },
    blue: { points: 6 },
    createdAt
  });
});
