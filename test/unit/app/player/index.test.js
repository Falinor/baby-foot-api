import test from 'ava';

import useCases, {
  createGetPlayerUseCase,
} from '../../../../src/app/player/index';

test('Should export an object containing player use-cases', async (t) => {
  t.is(typeof useCases, 'object');
  t.is(typeof useCases.createGetPlayerUseCase, 'function');
});

test('Should export individual use-cases', async (t) => {
  t.is(typeof createGetPlayerUseCase, 'function');
});
