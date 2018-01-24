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
      create: sinon.stub()
        .onFirstCall().resolves(1)
        .onSecondCall().resolves(2)
        .onThirdCall().resolves(3)
        // Index starts at 0
        .onCall(3).resolves(4),
    },
    teamRepository: {
      create: sinon.stub()
        .onFirstCall().resolves(5)
        .onSecondCall().resolves(6),
    },
    matchRepository: {
      create: sinon.stub().resolves(7),
    },
  };
  const addMatchUseCase = createAddMatchUseCase(repos);
  addMatchUseCase.on(addMatchUseCase.outputs.SUCCESS, (id) => {
    t.is(id, 7);
  });
  await addMatchUseCase.execute(inputMatch);
  t.is(repos.playerRepository.create.callCount, 4);
  t.true(repos.teamRepository.create.calledTwice);
  t.true(repos.matchRepository.create.calledOnce);
});

test('Should fail to create a match and emit an error event', async (t) => {
  const repos = {
    matchRepository: null,
    teamRepository: null,
    playerRepository: {
      create: sinon.stub().throws(),
    },
  };
  const addMatchUseCase = createAddMatchUseCase(repos);
  addMatchUseCase.on(addMatchUseCase.outputs.ERROR, (err) => {
    t.is(typeof err, 'object');
    t.is(typeof err.name, 'string');
    t.is(typeof err.message, 'string');
  });
  await t.notThrows(addMatchUseCase.execute(inputMatch));
});
