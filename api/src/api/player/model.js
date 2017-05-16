import { createVertex } from '../../services/arango/vertex';

export const PLAYER_COLLECTION = 'players';

const Player = createVertex(PLAYER_COLLECTION);
export default Player;
