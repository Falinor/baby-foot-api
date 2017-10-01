import { find, findOne, save, vertex } from '../../components/model';

export const getTeams = (playedStore) => async (matchHandle) =>
  playedStore.inEdges(matchHandle);

export const createTeam = (teamStore) => async (data) =>
  teamStore.save(data)
    .then(res => res.vertex);

export const linkTeamsToMatch = (playedStore) => async (data, from, to) =>
  playedStore.save(data, from, to);

export { find, findOne, save, vertex };
export default (stores) => ({
  find: find(stores.matchStore),
  findOne: findOne(stores.matchStore),
  save: save(stores.matchStore),
  vertex: vertex(stores.matchStore),
  createTeam: createTeam(stores.teamStore),
  getTeams: getTeams(stores.playedStore),
  linkTeamsToMatch: linkTeamsToMatch(stores.playedStore)
});
