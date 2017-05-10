import test from 'ava';

import { Match } from '.';

test.afterEach('Clean database', async (t) => {
  return Match.remove({});
});

test('Create a match with valid parameters', async (t) => {
  const match = await Match.create({
    red: {
      points: 10,
      trigrams: ['GUE', 'RED']
    },
    blue: {
      points: 0,
      trigrams: ['ABC', 'DEF']
    }
  });
  console.log(match);
  t.fail();
});

test.todo('Find a match');

test.todo('Find a match by id');

test.todo('Update a match');

test.todo('Delete a match');
