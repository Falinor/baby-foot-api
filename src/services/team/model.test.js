import test from 'ava';
import sinon from 'sinon';

import createModel, {
  find,
  findMatches,
  findPlayers,
  save,
  vertex
} from './model';

test('Should export default model functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof findMatches, 'function');
  t.is(typeof findPlayers, 'function');
  t.is(typeof save, 'function');
  t.is(typeof vertex, 'function');
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
  t.is(typeof model.findMatches, 'function');
  t.is(typeof model.findPlayers, 'function');
  t.is(typeof model.vertex, 'function');
  t.is(typeof model.save, 'function');
});

test('Should find the matches that a team played', async t => {
  const stub = {
    query: sinon.stub().resolves({
      all: sinon.stub().resolves(['match1', 'match2'])
    })
  };
  // Call the function `findMatches` with the db stub and a fake team ID
  const matches = await findMatches(stub)(123);
  t.true(Array.isArray(matches));
  t.deepEqual(matches, ['match1', 'match2']);
});

test('Should find the members of a team', async t => {
  const stub = {
    query: sinon.stub().resolves({
      all: sinon.stub().resolves(['player1', 'player2'])
    })
  };
  const players = await findPlayers(stub)(123);
  t.true(Array.isArray(players));
  t.deepEqual(players, ['player1', 'player2']);
});
