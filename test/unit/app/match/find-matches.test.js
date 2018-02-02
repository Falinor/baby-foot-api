import test from 'ava';
import sinon from 'sinon';

import { matches } from '../../../data';

import createFindMatchesUseCase from '../../../../src/app/match/find-matches';

test('Should create a FindMatches use case', async (t) => {
  const matchRepository = {};
  const findMatchUseCase = createFindMatchesUseCase(matchRepository);
  t.is(typeof findMatchUseCase, 'object');
  t.is(typeof findMatchUseCase.execute, 'function');
  t.is(typeof findMatchUseCase.on, 'function');
  t.is(typeof findMatchUseCase.outputs, 'object');
  t.is(typeof findMatchUseCase.outputs.SUCCESS, 'string');
  t.is(typeof findMatchUseCase.outputs.ERROR, 'string');
  t.is(matchRepository, findMatchUseCase.matchRepository);
});

test('Should find matches and emit a success event', async (t) => {
  t.plan(2);
  const matchRepository = {
    find: sinon.stub().resolves(matches),
  };
  const findMatchUseCase = createFindMatchesUseCase(matchRepository);
  findMatchUseCase.on(findMatchUseCase.outputs.SUCCESS, (actual) => {
    t.true(Array.isArray(actual));
    t.is(actual.length, 2);
  });
  await findMatchUseCase.execute();
});

test('Should fail to find matches and emit an error event', async (t) => {
  t.plan(2);
  const matchRepository = {
    find: sinon.stub().rejects(new Error('My error')),
  };
  const findMatchUseCase = createFindMatchesUseCase(matchRepository);
  findMatchUseCase.on(findMatchUseCase.outputs.ERROR, (err) => {
    t.is(typeof err, 'object');
    t.is(err.message, 'My error');
  });
  await findMatchUseCase.execute();
});
