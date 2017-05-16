import { MATCH_COLLECTION } from '../../match/model';
import { TEAM_COLLECTION } from '../../team/model';
import { createEdge } from '../../../services/arango/edge';

const WON_COLLECTION = 'won';
const Won = createEdge(WON_COLLECTION, TEAM_COLLECTION, MATCH_COLLECTION);
export default Won;
