import { MATCH_COLLECTION } from '../../match/model';
import { TEAM_COLLECTION } from '../../team/model';
import { createEdge } from '../../../services/arango/edge';

const LOST_COLLECTION = 'lost';
const Lost = createEdge(LOST_COLLECTION, TEAM_COLLECTION, MATCH_COLLECTION);
export default Lost;
