import test from 'ava';
import sinon from 'sinon';

import createAddMatchUseCase from '../../../../src/app/match/create-match';
import { inputMatch } from '../../../data';

test('Should create an AddMatch use case', async (t) => {
  const matchRepository = {};
  const teamRepository = {};
  const playerRepository = {};
  const addMatchUseCase = createAddMatchUseCase(
    matchRepository,
    teamRepository,
    playerRepository,
  );
  t.is(typeof addMatchUseCase, 'object');
  t.is(typeof addMatchUseCase.execute, 'function');
  t.is(typeof addMatchUseCase.on, 'function');
  t.is(typeof addMatchUseCase.outputs, 'object');
  t.deepEqual(addMatchUseCase.outputs, {SUCCESS: 'success', ERROR: 'error'});
  t.is(matchRepository, addMatchUseCase.matchRepository);
  t.is(teamRepository, addMatchUseCase.teamRepository);
  t.is(playerRepository, addMatchUseCase.playerRepository);
});

test('Should create a match and emit a success event', async (t) => {
  const playerRepository = {
    create: sinon.stub()
      .onFirstCall().resolves(1)
      .onSecondCall().resolves(2)
      .onThirdCall().resolves(3)
      // Index starts at 0
      .onCall(3).resolves(4),
  };
  const teamRepository = {
    create: sinon.stub()
      .onFirstCall().resolves(5)
      .onSecondCall().resolves(6),
  };
  const matchRepository = {
    create: sinon.stub().resolves(7),
  };
  const addMatchUseCase = createAddMatchUseCase(
    matchRepository,
    teamRepository,
    playerRepository,
  );
  addMatchUseCase.on(addMatchUseCase.outputs.SUCCESS, (id) => {
    t.is(id, 7);
  });
  await addMatchUseCase.execute(inputMatch);
  t.is(playerRepository.create.callCount, 4);
  t.true(teamRepository.create.calledTwice);
  t.true(matchRepository.create.calledOnce);
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
