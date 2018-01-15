import test from 'ava';

import useCases, {
  getPlayerUseCase,
} from '../../../../src/app/player/index';

test('Should export an object containing player use-cases', async (t) => {
  t.is(typeof useCases, 'object');
  t.is(typeof useCases.getPlayerUseCase, 'function');
});

test('Should export individual use-cases', async (t) => {
  t.is(typeof getPlayerUseCase, 'function');
});
