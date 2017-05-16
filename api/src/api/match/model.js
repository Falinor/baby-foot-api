import { createVertex } from '../../services/arango/vertex';

export const MATCH_COLLECTION = 'matches';

const Match = createVertex(MATCH_COLLECTION);
export default Match;
