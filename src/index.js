import http from 'http';

import router from './services';
import config from './config/index';
import express from './components/express'
import arango from './components/arango';

const db = arango();

// Connect to databaseName
arango()
  .then(db => {
    const graph = db.graph(config.db.graphName);
    const routes = router({ db, graph });
    const app = express(routes);
    const server = http.createServer(app);
    server.listen(config.port, config.ip, () => {
      console.log('Express server listening on ' +
        `http://${config.ip}:${config.port}, in ${config.env}
      `);
    });
  })
  .catch(console.error);