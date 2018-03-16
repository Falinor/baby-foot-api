import test from 'ava';
import { EventEmitter } from 'events';
import Http from 'http-status';
import sinon from 'sinon';

import { players } from '../../../../data';
import createPlayerController, {
  index,
  show,
} from '../../../../../src/interfaces/http/player/controller';

test('Should create a player controller', (t) => {
  const useCases = {
    getPlayerUseCase: sinon.spy(),
  };
  const controller = createPlayerController(useCases);
  t.is(typeof controller, 'object');
  t.is(typeof controller.index, 'function');
  t.is(typeof controller.show, 'function');
});

test('Should find players', async (t) => {
  // Given
  const findPlayersUseCase = new EventEmitter();
  findPlayersUseCase.outputs = {
    SUCCESS: 'success',
    ERROR: 'error',
  };
  findPlayersUseCase.execute = sinon.stub().callsFake(() => {
    findPlayersUseCase.emit(findPlayersUseCase.outputs.SUCCESS, players);
  });
  const ctx = {};
  // When
  const findPlayers = index(findPlayersUseCase);
  await findPlayers(ctx);
  // Then
  t.is(ctx.status, Http.OK);
  t.is(ctx.body, players);
});

test('Should show a player\'s details', async (t) => {
  const getPlayerUseCase = new EventEmitter();
  getPlayerUseCase.outputs = {
    SUCCESS: 'success',
    ERROR: 'error',
  };
  getPlayerUseCase.execute = sinon.stub().callsFake(() => {
    getPlayerUseCase.emit(getPlayerUseCase.outputs.SUCCESS, 42);
  });
  const ctx = { params: { id: 1337 } };
  // Build the controller function
  const getPlayer = show(getPlayerUseCase);
  // Call the actual one with a context
  await getPlayer(ctx);
  t.is(ctx.status, Http.OK);
  t.is(ctx.body, 42);
});

test('Should throw an error on failure', async (t) => {
  const getPlayerUseCase = new EventEmitter();
  getPlayerUseCase.outputs = {
    SUCCESS: 'success',
    ERROR: 'error',
  };
  getPlayerUseCase.execute = sinon.stub().callsFake(async () => {
    const err = new Error();
    getPlayerUseCase.emit(getPlayerUseCase.outputs.ERROR, err);
  });
  const ctx = { params: { id: 42 } };
  const getPlayer = show(getPlayerUseCase);
  const error = await t.throws(getPlayer(ctx));
  t.is(typeof error, 'object');
  t.true(error instanceof Error);
});
