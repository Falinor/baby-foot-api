import test from 'ava';
import sinon from 'sinon';

import createAddMatchUseCase from '../../../../src/app/match/create-match';
import { inputMatch } from '../../../data';

test('Should create an AddMatch use case', async (t) => {
  const repos = {
    matchRepository: {},
    teamRepository: {},
    playerRepository: {},
  };
  const addMatchUseCase = createAddMatchUseCase(repos);
  t.is(typeof addMatchUseCase, 'object');
  t.is(typeof addMatchUseCase.execute, 'function');
  t.is(typeof addMatchUseCase.on, 'function');
  t.is(typeof addMatchUseCase.outputs, 'object');
  t.deepEqual(addMatchUseCase.outputs, { SUCCESS: 'success', ERROR: 'error' });
  t.is(repos.matchRepository, addMatchUseCase.matchRepository);
  t.is(repos.teamRepository, addMatchUseCase.teamRepository);
  t.is(repos.playerRepository, addMatchUseCase.playerRepository);
});

test('Should create a match and emit a success event', async (t) => {
  const repos = {
    playerRepository: {
      insertMany: sinon.stub().resolves(),
    },
    teamRepository: {
      insertMany: sinon.stub().resolves(),
    },
    matchRepository: {
      insertOne: sinon.stub().resolves(),
    },
  };
  const addMatchUseCase = createAddMatchUseCase(repos);
  addMatchUseCase.on(addMatchUseCase.outputs.SUCCESS, (id) => {
    t.is(typeof id, 'string');
  });
  await addMatchUseCase.execute(inputMatch);
  t.true(repos.playerRepository.insertMany.calledTwice);
  t.true(repos.teamRepository.insertMany.calledOnce);
  t.true(repos.matchRepository.insertOne.calledOnce);
});

test.todo('Should fail to create a match and emit an error event');
