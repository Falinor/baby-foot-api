import test from 'ava';
import sinon from 'sinon';

import createController, { find, findOne } from './controller';

const req = {
  params: { trigram: 'ABC' }
};
const res = {};
res.status = sinon.stub().returns(res);
res.json = sinon.stub().returns(res);
const next = sinon.stub();

test('Should export default controller functions', async t => {
  t.is(typeof find, 'function');
  t.is(typeof findOne, 'function');
});

test('Should create a controller instance', async t => {
  const controller = createController({});
  t.is(typeof controller, 'object');
  t.is(typeof controller.find, 'function');
  t.is(typeof controller.findOne, 'function');
});

test('Should find a player by trigram', async t => {
  const model = {
    findOne: sinon.stub().returns(Promise.resolve({
      trigram: 'ABC'
    }))
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
