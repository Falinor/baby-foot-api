import test from 'ava';

import { Match } from './model';

test.afterEach('Clean database', async (t) => {
  return Match.drop();
});

test.todo('Create a match with valid parameters');

test.todo('Create a match if it does not exist');

test.todo('Find a match');

test.todo('Find a match by id');

test.todo('Update a match');

test.todo('Delete a match');
