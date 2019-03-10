import test from 'ava';
import { stub } from 'sinon';

import createAddMatchUseCase from '../../../src/app/match/create-match';

test.beforeEach(t => {
  const matchRepository = {
    create: stub(),
  };
  t.context = {
    matchRepository,
    useCase: createAddMatchUseCase({
      matchRepository,
    }),
  };
});

test('Given a match repository, when I create a CreateMatchUseCase, it should create a new instance', async t => {
  t.plan(1);
  // Given
  const { matchRepository, useCase } = t.context;
  // Then
  useCase.on(useCase.outputs.SUCCESS, () => {
    t.true(matchRepository.create.calledOnce);
  });
  // When
  await useCase.execute();
});
