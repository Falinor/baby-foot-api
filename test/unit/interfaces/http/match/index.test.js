import test from 'ava';

import match from '../../../../../src/interfaces/http/match';

test.failing('Should create match routes', async (t) => {
  console.log(match);
  t.is(typeof match, 'object');
});
