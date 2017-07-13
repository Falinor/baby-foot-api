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
  t.context = {
    req,
    res
  };
});

test('Should create a controller instance', async t => {
  const controller = createController();
  t.truthy(controller);
  t.truthy(controller.find);
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
  const res = t.context.res;
  // Call the actual function
  await controller.find({}, res, () => {});
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly([]));
});

test('Should find one entity and call res.status and res.json', async t => {
  const model = {
    findOne: sinon.stub().returns(
      Promise.resolve({})
    )
  };
  const controller = createController(model);
  const res = t.context.res;
  await controller.findOne({}, res, () => {});
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly({}));
});

test('Should get a vertex', async t => {
  const model = {
    vertex: sinon.stub().returns(
      Promise.resolve({})
    )
  };
  const controller = createController(model);
  const { req, res } = t.context;
  await controller.vertex(req, res, () => {});
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly({}));
});

test('Should save an entity', async t => {
  const model = {
    save: sinon.stub().returns(
      Promise.resolve({})
    )
  };
  const controller = createController(model);
  const { req, res } = t.context;
  await controller.save(req, res, () => {});
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
  t.true(res.json.calledWithExactly({}));
});
