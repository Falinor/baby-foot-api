import test from 'ava';

import player from '../../../../../src/interfaces/http/player';

test('Should create player routes', async (t) => {
  t.is(typeof player, 'object');
});
