/**
 * Matches to be imported.
 * @type {Array<object>} An array of matches.
 */
export const matches = [
  {
    red: {
      points: 10,
      players: ['ABC', 'DEF'],
    },
    blue: {
      points: 7,
      players: ['GHI', 'JKL'],
    },
    createdAt: new Date(),
  },
  {
    red: {
      points: 6,
      players: ['ABC', 'DEF'],
    },
    blue: {
      points: 10,
      players: ['GHI', 'JKL'],
    },
    createdAt: new Date(),
  },
];

export const [inputMatch] = matches;

/**
 * Teams to be imported.
 * @type {Array<object>}
 */
export const teams = [
  { createdAt: new Date() },
  { createdAt: new Date() },
];

export const [inputTeam] = teams;

/**
 *
 * @type {Array<object>}
 */
export const players = [
  { id: 'ABC' },
  { id: 'DEF' },
  { id: 'GHI' },
  { id: 'JKL' },
];

export const DBOPlayers = [
  { _id: 'ABC' },
  { _id: 'DEF' },
  { _id: 'GHI' },
  { _id: 'JKL' },
];

export const [inputPlayer] = players;

export default {
  inputMatch,
  inputPlayer,
  inputTeam,
  matches,
  teams,
  players,
};
