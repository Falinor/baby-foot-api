import { find, findOne, save, vertex } from '../../components/model';

export const getTeams = (playedStore) => async (matchHandle) =>
  playedStore.inEdges(matchHandle);

export const createTeam = (teamStore) => async (data) =>
  teamStore.save(data)
    .then(res => res.vertex);

export const linkTeamsToMatch = (playedStore) => async (data, from, to) =>
  playedStore.save(data, from, to);

export { find, findOne, save, vertex };
export default (matchStore, playedStore, teamStore) => ({
  find: find(matchStore),
  findOne: findOne(matchStore),
  save: save(matchStore),
  vertex: vertex(matchStore),
  createTeam: createTeam(teamStore),
  getTeams: getTeams(playedStore),
  linkTeamsToMatch: linkTeamsToMatch(playedStore)
});
