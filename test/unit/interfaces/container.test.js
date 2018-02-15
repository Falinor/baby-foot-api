import test from 'ava';
import { asValue } from 'awilix';

import createContainer from '../../../src/container';

// Create a one-time container
const container = createContainer({
  appName: 'test',
  log: {
    level: 'info',
  },
});

// Create a fake store to register in the container
const fakeStore = {};

// Register fake stores
container
  .register('matchStore', asValue(fakeStore))
  .register('teamStore', asValue(fakeStore))
  .register('playerStore', asValue(fakeStore));

test('Should create a container', async (t) => {
  t.is(typeof container, 'object');
  t.is(typeof container.registrations, 'object');
});

test('Should resolve a config object', async (t) => {
  const config = container.resolve('config');
  t.is(typeof config, 'object');
});

test('Should resolve an app object', async (t) => {
  const app = container.resolve('app');
  t.is(typeof app, 'object');
});

test('Should resolve a logger object', async (t) => {
  const logger = container.resolve('logger');
  t.is(typeof logger, 'object');
});

// Match use cases
test('Should resolve a CreateMatch use case', async (t) => {
  const createMatchUseCase = container.resolve('createMatch');
  t.is(typeof createMatchUseCase, 'object');
});

test('Should resolve a FindMatches use case', async (t) => {
  const findMatchesUseCase = container.resolve('findMatches');
  t.is(typeof findMatchesUseCase, 'object');
  t.is(typeof findMatchesUseCase.execute, 'function');
});

// Player use cases
test('Should resolve a GetPlayer use case', async (t) => {
  const getPlayerUseCase = container.resolve('getPlayer');
  t.is(typeof getPlayerUseCase, 'object');
  t.is(typeof getPlayerUseCase.execute, 'function');
});

// Repositories
test('Should resolve a match repository', async (t) => {
  const matchRepository = container.resolve('matchRepository');
  t.is(typeof matchRepository, 'object');
  t.is(typeof matchRepository.find, 'function');
  t.is(typeof matchRepository.create, 'function');
});

test('Should resolve a player repository', async (t) => {
  const playerRepository = container.resolve('playerRepository');
  t.is(typeof playerRepository, 'object');
});

test('Should resolve a match controller', async (t) => {
  const matchController = container.resolve('matchController');
  t.is(typeof matchController, 'object');
});

test('Should resolve a match router', async (t) => {
  const matchRouter = container.resolve('matchRouter');
  t.is(typeof matchRouter, 'object');
});
