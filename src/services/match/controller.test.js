import test from 'ava';
import sinon from 'sinon';

import createController, { create, find, get } from './controller';
import * as model from './model';

test.beforeEach('Create stubs', async t => {
  const res = {};
  res.json = sinon.stub().returns(res);
  res.status = sinon.stub().returns(res);
  t.context = {
    res
  };
});

test('Should create a controller instance', async t => {
  const controller = createController({});
  t.is(typeof controller, 'object');
  t.truthy(controller.create);
  t.truthy(controller.find);
  t.truthy(controller.get);
  t.truthy(controller.teams);
});

test('Should create a match', async t => {
  const match = {
    createdAt: new Date().toJSON(),
    red: {
      points: 10
    },
    blue: {
      points: 7
    }
  };
  const req = { body: {} };
  const res = t.context.res;
  const model = {
    save: sinon.stub().returns(
      Promise.resolve({ data: 42 })
    )
  };
  // Execute function
  await create(model)(req, res, () => {});
  t.true(model.save.calledOnce);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(201));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly({ data: 42 }));
});

test('Should find matches', async t => {
  const res = t.context.res;
  const model = {
    find: sinon.stub().returns(
      Promise.resolve({ data: 42 })
    )
  };
  await find(model)({}, res, () => {});
  t.true(model.find.calledOnce);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly({ data: 42 }));
});

test('Should find a match', async t => {
  const model = {
    vertex: sinon.stub().returns(
      Promise.resolve({ data: 42 })
    )
  };
  const req = {
    params: { id: 42 }
  };
  const res = t.context.res;
  await get(model)(req, res, () => {});
  t.true(model.vertex.calledOnce);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly({ data: 42 }));
});

test('Should fail to find a match', async t => {
  const model = {
    vertex: sinon.stub().returns(
      Promise.reject()
    )
  };
});

test.todo('Should find the teams associated with a match');

test.todo('Should find the red team associated with a match');

test.todo('Should find the blue team associated with a match');
