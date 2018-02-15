import test from 'ava';

import match from '../../../../../src/interfaces/http/match';

test.failing('Should create match routes', async (t) => {
  t.is(typeof match, 'object');
});
