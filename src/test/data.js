/**
 * Matches to be imported.
 * @type {Array<object>} An array of matches.
 */
export const matches = [
  { red: { points: 10 }, blue: { points: 7 }, createdAt: new Date() },
  { red: { points: 6 }, blue: { points: 10 }, createdAt: new Date() }
];

/**
 * Teams to be imported.
 * @type {Array<object>}
 */
export const teams = [
  {},
  {}
];

/**
 *
 * @type {Array<object>}
 */
export const players = [
  { trigram: 'ABC' },
  { trigram: 'DEF' },
  { trigram: 'GHI' },
  { trigram: 'JKL' }
];

export default { matches, teams, players };
