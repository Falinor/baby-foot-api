import test from 'ava';
import sinon from 'sinon';

import createPlayerRouter from '../../../../../src/interfaces/http/player';

test.beforeEach('Create context', async (t) => {
  const show = sinon.spy();
  t.context = {
    show,
    router: createPlayerRouter({ show }),
  };
});

test('Should create player routes', async (t) => {
  const { router, show } = t.context;
  console.log(router);
  t.is(typeof router, 'object');
  t.is(router.opts.prefix, '/players');
});
