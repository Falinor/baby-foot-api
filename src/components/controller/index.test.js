import test from 'ava';
import sinon from 'sinon';

import createController from './index';

test.beforeEach('Create a response stub', async t => {
  const req = {
    params: { _id: '42' },
    query: { limit: 10 },
    body: { data: 42 }
  };
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  const next = sinon.stub().returns({});
  t.context = { req, res, next };
});

test('Should create a controller instance', async t => {
  const controller = createController();
  t.truthy(controller);
  t.truthy(controller.find);
});

test('Should create an entity', async t => {
  const model = {
    save: sinon.stub().returns(
      Promise.resolve({ data: 42 })
    )
  };
  const controller = createController(model);
  const { req, res, next } = t.context;
  await controller.create(req, res, next);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(201));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly({ data: 42 }));
  t.true(next.notCalled);
});

test('Should fail to create an entity', async t => {
  const model = {
    save: sinon.stub().returns(
      Promise.reject(new Error('Could not create entity'))
    )
  };
  const controller = createController(model);
  const { req, res, next } = t.context;
  await controller.create(req, res, next);
  t.true(next.calledOnce);
});

test('Should find all entities and call res.status and res.json', async t => {
  const model = {
    find: sinon.stub().returns(
      Promise.resolve({
        all: () => []
      })
    )
  };
  const controller = createController(model);
  const { req, res, next } = t.context;
  // Call the actual function
  await controller.find(req, res, next);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly([]));
  t.true(next.notCalled);
});

test('Should find one entity and call res.status and res.json', async t => {
  const model = {
    findOne: sinon.stub().returns(
      Promise.resolve({})
    )
  };
  const controller = createController(model);
  const { req, res, next } = t.context;
  await controller.findOne(req, res, next);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly({}));
  t.true(next.notCalled);
});

test('Should get a get', async t => {
  const model = {
    vertex: sinon.stub().returns(
      Promise.resolve({})
    )
  };
  const controller = createController(model);
  const { req, res, next } = t.context;
  await controller.get(req, res, next);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly({}));
  t.true(next.notCalled);
});
