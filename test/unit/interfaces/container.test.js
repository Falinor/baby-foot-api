import test from 'ava';

import createContainer from '../../../src/container';

// Create a one-time container
const container = createContainer({
  appName: 'test',
  log: {
    level: 'info',
  },
});

test('Should create a container', async (t) => {
  t.is(typeof container, 'object');
  t.is(typeof container.registrations, 'object');
  t.is(typeof container.registrations.playerController, 'object');
});

test('Should resolve a GetPlayer use case', async (t) => {
  const getPlayerUseCase = container.resolve('getPlayerUseCase');
  t.is(typeof getPlayerUseCase, 'object');
});

test('Should resolve a player repository', async (t) => {
  const playerRepository = container.resolve('playerRepository');
  t.is(typeof playerRepository, 'object');
});

test('Should resolve a player controller', async (t) => {
  const playerCtrl = container.resolve('playerController');
  t.is(typeof playerCtrl, 'object');
});
