import { find, vertex } from '../../components/model';

export { find, vertex } from '../../components/model';

export default (teamStore) => ({
  find: find(teamStore),
  vertex: vertex(teamStore)
});
