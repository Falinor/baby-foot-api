import test from 'ava';
import sinon from 'sinon';

import createController, { find, get, getMatches } from './controller';

const req = { params: { id: '1234' } };
const res = {};
res.status = sinon.stub().returns(res);
res.json = sinon.stub().returns(res);
const next = sinon.stub();

test('Should export default controller functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof get, 'function');
  t.is(typeof getMatches, 'function');
});

test('Should create a controller instance', async t => {
  const controller = createController({});
  t.is(typeof controller.find, 'function');
  t.is(typeof controller.get, 'function');
  t.is(typeof controller.getMatches, 'function');
});

test('Should get the matched that a team played', async t => {
  const model = {
    vertex: sinon.stub().resolves({
      _id: '1234'
    }),
    getMatches: sinon.stub().resolves([
      { red: { points: 10 }, blue: { points: 6 }, createdAt: new Date() }
    ])
  };
  const controller = createController(model);
  await controller.getMatches(req, res, next);
  t.true(model.getMatches.calledOnce);
  t.true(res.status.calledOnce);
  t.true(res.status.calledWithExactly(200));
  t.true(res.json.calledOnce);
});
