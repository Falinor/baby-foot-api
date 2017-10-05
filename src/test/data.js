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
  { createdAt: new Date() },
  { createdAt: new Date() }
];

/**
 *
 * @type {Array<object>}
 */
export const players = [
  { _key: 'abc', trigram: 'ABC' },
  { _key: 'def', trigram: 'DEF' },
  { _key: 'ghi', trigram: 'GHI' },
  { _key: 'jkl', trigram: 'JKL' }
];

export default { matches, teams, players };
