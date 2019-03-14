import test from 'ava';
import Joi from 'joi';

import matchSchemas from '../../../../src/interfaces/http/match/schemas';

test('Given a valid match, when I validate, it should pass', t => {
  // Given
  const match = {
    red: { points: 10, players: ['ABC', 'DEF'] },
    blue: { points: 6, players: ['GHI', 'JKL'] },
  };
  // When
  const { error, value } = Joi.validate(match, matchSchemas.create.body);
  // Then
  t.falsy(error);
  t.deepEqual(value, match);
});

test('Given a valid 1v1 match, when I validate, it should pass', t => {
  // Given
  const match = {
    red: { points: 10, players: ['ABC'] },
    blue: { points: 6, players: ['GHI'] },
  };
  // When
  const { error, value } = Joi.validate(match, matchSchemas.create.body);
  // Then
  t.falsy(error);
  t.deepEqual(value, match);
});

test('Given a valid match with unknown keys, when I validate, it should pass and strip unknown keys', t => {
  // Given
  const match = {
    red: { points: 10, players: ['ABC', 'DEF'] },
    blue: { points: 6, players: ['GHI', 'JKL'], unknown: 'to strip' },
    green: { points: -1, players: 'toto' },
  };
  // When
  const { error, value } = Joi.validate(match, matchSchemas.create.body);
  // Then
  t.falsy(error);
  t.deepEqual(value, {
    red: { points: 10, players: ['ABC', 'DEF'] },
    blue: { points: 6, players: ['GHI', 'JKL'] },
  });
});

test('Given only one team, when I validate, it should fail', t => {
  // Given
  const match = {
    red: { points: 10, players: ['ABC', 'DEF'] },
  };
  // When
  const { error } = Joi.validate(match, matchSchemas.create.body);
  // Then
  t.truthy(error);
});

test('Given a team has less than 0 points, when I validate, it should fail', t => {
  // Given
  const match = {
    red: { points: 10, players: ['ABC', 'DEF'] },
    blue: { points: -1, players: ['GHI', 'JKL'] },
  };
  // When
  const { error } = Joi.validate(match, matchSchemas.create.body);
  // Then
  t.truthy(error);
});

test('Given a team has no player, when I validate, it should fail', t => {
  // Given
  const match = {
    red: { points: 10, players: [] },
    blue: { points: 6, players: ['GHI', 'JKL'] },
  };
  // When
  const { error } = Joi.validate(match, matchSchemas.create.body);
  // Then
  t.truthy(error);
});

test('Given a team has more than 2 players, when I validate, it should fail', t => {
  // Given
  const match = {
    red: { points: 10, players: ['ABC', 'DEF', 'XYZ'] },
    blue: { points: 6, players: ['GHI', 'JKL'] },
  };
  // When
  const { error } = Joi.validate(match, matchSchemas.create.body);
  // Then
  t.truthy(error);
});

test('Given a team has duplicate players, when I validate, it should fail', t => {
  // Given
  const match = {
    red: { points: 10, players: ['ABC', 'ABC'] },
    blue: { points: 6, players: ['GHI', 'JKL'] },
  };
  // When
  const { error } = Joi.validate(match, matchSchemas.create.body);
  // Then
  t.truthy(error);
});
