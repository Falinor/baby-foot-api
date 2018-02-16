import test from 'ava';
import sinon from 'sinon';

import createPlayerRouter from '../../../../../src/interfaces/http/player';

test.beforeEach('Create context', (t) => {
  const show = sinon.spy();
  t.context = {
    show,
    router: createPlayerRouter({ show }),
  };
});

test('Should create player routes', (t) => {
  const { router } = t.context;
  t.is(typeof router, 'object');
  t.is(router.opts.prefix, '/players');
});
