import test from 'ava';

import createPlayerRouter from '../../../../src/interfaces/http/player/index';

test.beforeEach('Create context', t => {
  const index = () => {};
  const show = () => {};
  t.context = {
    router: createPlayerRouter({ index, show }),
  };
});

test('Should create player routes', t => {
  const { router } = t.context;
  t.is(typeof router, 'object');
  t.is(router.opts.prefix, '/players');
});
