export const inputMatch = {
  red: {
    points: 10,
    players: ['ABC', 'DEF'],
  },
  blue: {
    points: 6,
    players: ['GHI', 'JKL'],
  },
};

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

/**
 * Teams to be imported.
 * @type {Array<object>}
 */
export const teams = [
  { createdAt: new Date() },
  { createdAt: new Date() },
];

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

export default { inputMatch, matches, teams, players };
