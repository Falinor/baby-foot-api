import { PLAYER_COLLECTION } from '../../player/model';
import { TEAM_COLLECTION } from '../../team/model';
import { createEdge } from '../../../services/arango/edge';

const IN_COLLECTION = 'in';
const In = createEdge(IN_COLLECTION, PLAYER_COLLECTION, TEAM_COLLECTION);
export default In;
