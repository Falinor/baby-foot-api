import { find, vertex } from '../../components/model';

export const getMatches = (playedStore, matchStore) => async (teamHandle) =>
  // Retrieve outgoing edges
  playedStore.outEdges(teamHandle)
    .then(edges => {
      // Get matches to which edges point
      const promises = edges.map(edge => matchStore.vertex(edge._to));
      return Promise.all(promises);
    })
    // Get the vertex field from the response (bug from arangojs driver).
    // See #354
    .then(responses => responses.map(res => res.vertex));

export const getPlayers = () => async (teamHandle) =>
  console.log('getPlayers');

export { find, vertex } from '../../components/model';

export default (stores) => ({
  find: find(stores.teamStore),
  getMatches: getMatches(stores.playedStore, stores.matchStore),
  vertex: vertex(stores.teamStore)
});
