import uuid from 'uuid';

/**
 * Matches to be imported.
 * @type {Array<object>} An array of matches.
 */
export const matches = [
  { red: { points: 10 }, blue: { points: 7 }, createdAt: new Date() },
  { red: { points: 6 }, blue: { points: 10 }, createdAt: new Date() },
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

/**
 * Seed the database with test data.
 * @param graph {"arangojs".Graph} The graph to be filled.
 * @return {Promise.<{matchStore: object, teamStore: object, playerStore: object, playedStore: object, memberStore: object}>} A promise
 * resolving to an object containing the brand new collections.
 */
export const seed = async (graph) => {
  // Create match store
  const matchStoreName = `match-${uuid()}`;
  const matchStore = await createVertexStore(graph, matchStoreName);
  // Create team store
  const teamStoreName = `team-${uuid()}`;
  const teamStore = await createVertexStore(graph, teamStoreName);
  // Create player store
  const playerStoreName = `player-${uuid()}`;
  const playerStore = await createVertexStore(graph, playerStoreName);
  // Create played store which contains edges from team to match
  const playedStore = await createEdgeStore(
    graph,
    `played-${uuid()}`,
    [teamStoreName],
    [matchStoreName]
  );
  // Create member store which contains edges from player to team
  const memberStore = await createEdgeStore(
    graph,
    `member-${uuid()}`,
    [playerStoreName],
    [teamStoreName]
  );
  // Seed the stores
  await Promise.all([
    matchStore.import(matches),
    teamStore.import(teams),
    playerStore.import(players)
  ], { waitForSyc: true });
  const dbMatches = await matchStore.list();
  const dbTeams = await teamStore.list();
  const dbPlayers = await playerStore.list();
  // Create edges between teams and matches
  await playedStore.import([
    { color: 'red', _from: dbTeams[0], _to: dbMatches[0] },
    { color: 'blue', _from: dbTeams[1], _to: dbMatches[0] },
    { color: 'red', _from: dbTeams[0], _to: dbMatches[1] },
    { color: 'blue', _from: dbTeams[1], _to: dbMatches[1] }
  ], { waitForSyc: true });
  // Create edges between players and teams
  await memberStore.import([
    { _from: dbPlayers[0], _to: dbTeams[0] },
    { _from: dbPlayers[1], _to: dbTeams[0] },
    { _from: dbPlayers[2], _to: dbTeams[1] },
    { _from: dbPlayers[3], _to: dbTeams[1] }
  ], { waitForSyc: true });
  // Return all the collections
  return { matchStore, teamStore, playerStore, playedStore, memberStore };
};

/**
 * Create a vertex store and add it to the graph, given its name.
 * @param graph {object} The graph to which the collection should be added.
 * @param name {string} The name of the collection.
 * @return {Promise<"arangojs".GraphVertexCollection>} A promise resolving
 * to the brand new collection.
 */
const createVertexStore = async (graph, name) => {
  await graph.addVertexCollection(name);
  return graph.vertexCollection(name);
};

/**
 * Create an edge store and add it to the graph, given its name, the source
 * vertex collection and the destination vertex collection.
 * @param graph {"arangojs".Graph} The graph to which the collection should be
 * added.
 * @param name {string} The name of the collection.
 * @param from {"arangojs".GraphVertexCollection} The source collection.
 * @param to {"arangojs".GraphVertexCollection} The destination collection.
 * @return {"arangojs".GraphEdgeCollection>} A promise resolving to the
 * brand new collection.
 */
const createEdgeStore = async (graph, name, from, to) => {
  await graph.addEdgeDefinition({
    collection: name,
    from,
    to
  });
  return graph.edgeCollection(name);
};

export default seed;
