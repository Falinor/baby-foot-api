import { createVertex } from '../../services/arango/vertex';

export const TEAM_COLLECTION = 'teams';

const Team = createVertex(TEAM_COLLECTION);
export default Team;
