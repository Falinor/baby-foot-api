import logger from '../components/logger';
import config from '../config';
import data from './data';

const collections = config.db.collections;

/**
 * Seed the database with test data.
 * @param graph {"arangojs".Graph} The graph to be filled.
 * @return {Promise.<{matchStore: object, teamStore: object, playerStore: object, playedStore: object, memberStore: object}>} A promise
 * resolving to an object containing the brand new collections.
 */
export const seed = async (graph) => {
  const matchStore = await createVertexStore(graph, collections.matches);
  const teamStore = await createVertexStore(graph, collections.teams);
  const playerStore = await createVertexStore(graph, collections.players);
  const playedStore = await createEdgeStore(
    graph,
    collections.played,
    [collections.teams],
    [collections.matches]
  );
  // Create member store which contains edges from player to team
  const memberStore = await createEdgeStore(
    graph,
    collections.member,
    [collections.players],
    [collections.teams]
  );
  // Seed the stores
  await Promise.all([
    matchStore.import(data.matches),
    teamStore.import(data.teams),
    playerStore.import(data.players)
  ]);
  const dbMatches = await matchStore.list();
  const dbTeams = await teamStore.list();
  const dbPlayers = await playerStore.list();
  // Create edges between teams and matches
  await playedStore.import([
    { color: 'red', _from: dbTeams[0], _to: dbMatches[0] },
    { color: 'blue', _from: dbTeams[1], _to: dbMatches[0] },
    { color: 'red', _from: dbTeams[0], _to: dbMatches[1] },
    { color: 'blue', _from: dbTeams[1], _to: dbMatches[1] }
  ], { waitForSync: true });
  // Create edges between players and teams
  await memberStore.import([
    { _from: dbPlayers[0], _to: dbTeams[0] },
    { _from: dbPlayers[1], _to: dbTeams[0] },
    { _from: dbPlayers[2], _to: dbTeams[1] },
    { _from: dbPlayers[3], _to: dbTeams[1] }
  ], { waitForSync: true });
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
const createVertexStore = async (graph, name) =>
  graph.addVertexCollection(name)
    .catch(() => logger.info(`Vertex collection ${name} exists. Skipping.`))
    .then(() => graph.vertexCollection(name));

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
const createEdgeStore = async (graph, name, from, to) =>
  graph.addEdgeDefinition({
    collection: name,
    from,
    to
  })
    .catch(() => logger.info(`Edge collection ${name} exists. Skipping.`))
    .then(() => graph.edgeCollection(name));

export default seed;
