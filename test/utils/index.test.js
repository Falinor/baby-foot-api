import test from 'ava';
import sinon from 'sinon';

import { scopePerRequest } from '../../src/utils/index';

test('Should attach a scoped container to an object', async t => {
  const container = {
    createScope: sinon.stub().returns({}),
  };
  const ctx = {
    state: {},
  };
  const next = sinon.stub().resolves();
  t.is(ctx.state.container, undefined);
  const middleware = scopePerRequest(container);
  await middleware(ctx, next);
  t.is(typeof ctx.state.container, 'object');
  t.true(container.createScope.calledOnce);
  t.true(next.calledOnce);
});
