import http from 'http';

import api from './api';
import config from './config';
import express from './services/express'
import { init } from './services/arango';

const app = express(api);
const server = http.createServer(app);

// Connect to database
init()
  .then(() => {
    server.listen(config.port, config.ip, () => {
      console.log('Express server listening on ' +
        `http://${config.ip}:${config.port}, in ${config.env}
      `);
    });
  })
  .catch(console.error);

export default app;
