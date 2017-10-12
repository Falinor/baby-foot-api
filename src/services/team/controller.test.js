import test from 'ava';
import sinon from 'sinon';

import createController, { create, find, get, findMatches } from './controller';

test.beforeEach('Create the context', async t => {
  const req = { params: { id: '1234' } };
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  const next = sinon.stub();
  t.context = { req, res, next };
});

test('Should export default controller functions', async t => {
  t.is(typeof create, 'function');
  t.is(typeof find, 'function');
  t.is(typeof findMatches, 'function');
  t.is(typeof get, 'function');
});

test('Should create a controller instance', async t => {
  const controller = createController({});
  t.is(typeof controller.create, 'function');
  t.is(typeof controller.find, 'function');
  t.is(typeof controller.findMatches, 'function');
  t.is(typeof controller.get, 'function');
});

test('Should find the matches that a team played', async t => {
  const { req, res, next } = t.context;
  const model = {
    findMatches: sinon.stub().resolves([])
  };
  const controller = createController(model);
  await controller.findMatches(req, res, next);
  t.true(model.findMatches.calledOnce);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
});

test('Should find the players belonging to a team', async t => {
  const { req, res, next } = t.context;
  const model = {
    findPlayers: sinon.stub().resolves([])
  };
  const controller = createController(model);
  await controller.findPlayers(req, res, next);
  t.true(model.findPlayers.calledOnce);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
});
