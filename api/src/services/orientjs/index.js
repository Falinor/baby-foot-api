import { ODatabase } from 'orientjs';

import config from '../../config';

const db = new ODatabase(config.db);

export default db;
// TODO: close database and server connections
