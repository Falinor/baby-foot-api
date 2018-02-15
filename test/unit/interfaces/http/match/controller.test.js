import test from 'ava';
import sinon from 'sinon';

import createController from '../../../../../src/interfaces/http/match/controller';

test('Should create a match controller', async (t) => {
  const findMatches = sinon.stub();
  const controller = createController({ findMatches });
  t.is(typeof controller, 'object');
  t.is(typeof controller.index, 'function');
});
