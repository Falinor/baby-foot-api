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
});

test('Should resolve a CreateMatch use case', async (t) => {
  const createMatchUseCase = container.resolve('createMatch');
  t.is(typeof createMatchUseCase, 'object');
});

test('Should resolve a FindMatches use case', async (t) => {
  const findMatchesUseCase = container.resolve('findMatches');
  t.is(typeof findMatchesUseCase, 'object');
});

test('Should resolve a GetPlayer use case', async (t) => {
  const getPlayerUseCase = container.resolve('getPlayer');
  t.is(typeof getPlayerUseCase, 'object');
});

test('Should resolve a player repository', async (t) => {
  const playerRepository = container.resolve('playerRepository');
  t.is(typeof playerRepository, 'object');
});
