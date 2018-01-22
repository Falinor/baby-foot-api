import test from 'ava';

import createContainer from '../../../src/container';

test('Should create a container', async (t) => {
  const container = createContainer();
  t.is(typeof container, 'object');
  t.is(typeof container.registrations, 'object');
  t.is(typeof container.registrations.playerController, 'object');
});

test('Should inject a GetPlayer use case', async (t) => {
  const container = createContainer();
  const getPlayerUseCase = container.resolve('getPlayerUseCase');
  t.is(typeof getPlayerUseCase, 'object');
});

test('Should inject a player repository', async (t) => {
  const container = createContainer();
  const playerRepository = container.resolve('playerRepository');
  t.is(typeof playerRepository, 'object');
});

test('Should inject a player controller', async (t) => {
  const container = createContainer();
  const playerCtrl = container.resolve('playerController');
  t.is(typeof playerCtrl, 'object');
});
