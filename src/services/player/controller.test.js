import test from 'ava';
import sinon from 'sinon';

import createController, {
  find,
  findOne,
  findTeams,
  findMatches
} from './controller';

test.beforeEach('Create request, response and next', async t => {
  const req = {
    params: { trigram: 'ABC' }
  };
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  const next = sinon.stub();
  t.context = {
    req,
    res,
    next
  };
});

test('Should export default controller functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof findOne, 'function');
  t.is(typeof findTeams, 'function');
  t.is(typeof findMatches, 'function');
});

test('Should create a controller instance', async t => {
  const controller = createController({});
  t.is(typeof controller, 'object');
  t.is(typeof controller.find, 'function');
  t.is(typeof controller.findOne, 'function');
  t.is(typeof controller.findTeams, 'function');
  t.is(typeof controller.findMatches, 'function');
});

test('Should find a player by trigram', async t => {
  const { req, res, next } = t.context;
  const model = {
    findOne: sinon.stub().resolves({
      trigram: 'ABC'
    })
  };
  const controller = createController(model);
  await controller.findOne(req, res, next);
  t.true(model.findOne.calledOnce);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly({
    trigram: 'ABC'
  }));
});

test('Should find a player\'s teams', async t => {
  const { req, res, next } = t.context;
  const teams = [
    { createdAt: new Date() },
    { createdAt: new Date() }
  ];
  const model = {
    findTeams: sinon.stub().resolves(teams)
  };
  const controller = createController(model);
  await controller.findTeams(req, res, next);
  t.true(model.findTeams.calledOnce);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly(teams));
});

test('Should find a player\'s matches', async t => {
  const { req, res, next } = t.context;
  const matches = [
    {
      red: { points: 10 },
      blue: { points: 6 },
      createdAt: new Date()
    }
  ];
  const model = {
    findMatches: sinon.stub().resolves(matches)
  };
  const controller = createController(model);
  await controller.findMatches(req, res, next);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly(matches));
});
