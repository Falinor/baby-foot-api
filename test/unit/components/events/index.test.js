import test from 'ava';

import events, {
  ERROR,
  SUCCESS,
  VALIDATION_ERROR,
} from '../../../../src/components/events';

test('Should export a default object', async (t) => {
  t.is(typeof events, 'object');
});

test('Should export an ERROR event with the "error" value', async (t) => {
  t.is(SUCCESS, 'success');
  t.is(VALIDATION_ERROR, 'validation-error');
  t.is(ERROR, 'error');
});
