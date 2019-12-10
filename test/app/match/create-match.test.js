import test from 'ava'
import { stub } from 'sinon'

import createAddMatchUseCase, {
  MAX_POINTS
} from '../../../src/app/match/create-match'
import GameNotOverError from '../../../src/app/match/errors/game-not-over-error'
import PlayersError from '../../../src/app/match/errors/players-error'

test.beforeEach(t => {
  const matchRepository = {
    create: stub()
  }
  const match = {
    red: {
      points: 10,
      players: ['ABC', 'DEF']
    },
    blue: {
      points: 6,
      players: ['GHI', 'JKL']
    }
  }
  t.context = {
    match,
    matchRepository,
    useCase: createAddMatchUseCase({
      matchRepository
    })
  }
})

test('When I create a CreateMatchUseCase, it should create an instance', t => {
  t.plan(1)
  // Given
  const { useCase } = t.context
  // When
  t.is(typeof useCase, 'object')
})

test('Given a good match, when I execute a CreateMatchUseCase, it should emit a SUCCESS event', async t => {
  t.plan(1)
  // Given
  const { match, matchRepository, useCase } = t.context
  // Then
  useCase.on(useCase.outputs.SUCCESS, () => {
    t.true(matchRepository.create.calledOnce)
  })
  // When
  await useCase.execute(match)
})

test('Given match repository throws an error, when I execute a CreateMatchUseCase, it should emit an ERROR event', async t => {
  t.plan(1)
  // Given
  const { match, matchRepository, useCase } = t.context
  matchRepository.create.throws('RepositoryError')
  // Then
  useCase.on(useCase.outputs.ERROR, err => {
    t.is(err.name, 'RepositoryError')
  })
  // When
  await useCase.execute(match)
})

test('Given no team reached MAX points, when I execute a CreateMatchUseCase, it should emit an error event', async t => {
  t.plan(1)
  // Given
  const { useCase } = t.context
  const match = {
    red: { points: 4, players: ['ABC', 'DEF'] },
    blue: { points: 3, players: ['GHI', 'JKL'] }
  }
  // Then
  useCase.on(useCase.outputs.MAX_POINTS_ERROR, err => {
    t.true(err instanceof GameNotOverError)
  })
  // When
  await useCase.execute(match)
})

test('Given both teams reached MAX points, when I execute a CreateMatchUseCase, it should emit an error event', async t => {
  t.plan(1)
  // Given
  const { useCase } = t.context
  const match = {
    red: { points: MAX_POINTS, players: ['ABC', 'DEF'] },
    blue: { points: MAX_POINTS, players: ['GHI', 'KLM'] }
  }
  // Then
  useCase.on(useCase.outputs.MAX_POINTS_ERROR, err => {
    t.true(err instanceof GameNotOverError)
  })
  // When
  await useCase.execute(match)
})

test('Given teams with a player in common, when I execute a CreateMatchUseCase, it should emit an error event', async t => {
  t.plan(1)
  // Given
  const { useCase } = t.context
  const match = {
    red: { points: MAX_POINTS, players: ['ABC', 'DEF'] },
    blue: { points: 0, players: ['ABC', 'GHI'] }
  }
  // Then
  useCase.on(useCase.outputs.PLAYERS_ERROR, err => {
    t.true(err instanceof PlayersError)
  })
  // When
  await useCase.execute(match)
})
