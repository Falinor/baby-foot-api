import test from 'ava';

import { init } from '../../services/arango';
import { teamCollection } from './model';

let Team;

test.before('Create Team collection', async () => {
  await init();
  Team = await teamCollection();
});

test.after.always('Clean up', async () => {
  return Team.drop();
});

test('Team.getOrSave() - this team already exists', async (t) => {
  await Team.save({ players: ['FHI', 'LCI'] });
  const players = ['FHI', 'LCI'];
  const team = await Team.getOrSave({ players });
  t.is(typeof team, 'object');
  t.true(Array.isArray(team.players));
  t.deepEqual(team.players, players);
});

test('Team.getOrSave() - order does not matter', async (t) => {
  await Team.save({ players: ['ABC', 'DEF'] });
  const players = ['DEF', 'ABC'];
  const team = await Team.getOrSave({ players });
  t.is(typeof team, 'object');
  t.true(Array.isArray(team.players));
  t.is(team.players[0], 'ABC');
  t.is(team.players[1], 'DEF');
});

test('Team.getOrSave() - create a new team', async (t) => {
  const players = ['GUE', 'RED'];
  const team = await Team.getOrSave({ players });
  t.is(typeof team, 'object');
  t.is(typeof team._id, 'string');
  t.is(typeof team._key, 'string');
  t.is(typeof team._rev, 'string');
});
