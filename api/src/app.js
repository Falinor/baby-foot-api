import { createServer } from 'http';

import api from './api';
import config from './config';
import express from './services/express'
import db from './services/orientjs';

const app = express(api);
const server = createServer(app);

// Connect to database
db.open();

setImmediate(() => {
  server.listen(config.port, config.ip, () => {
    console.log(`Express server listening on http://${config.ip}:${config.port},
    in ${config.env}
    `);
  });
});

// Clean up before exiting
process.on('exit', () => {
  db.close();
  process.exit(0);
});

export default app;
