import http from 'http';

import router from './services';
import config from './config/index';
import arango from './components/arango';
import express from './components/express'
import logger from './components/logger';

const types = {
  vertex: 'vertex',
  edge: 'edge'
};

// Connect to databaseName
arango()
  .then(db => db.init())
  .then(async graph => {
    // TODO: init collections
    await Promise.all([
      createCollection(graph, 'matches', types.vertex),
      createCollection(graph, 'teams', types.vertex),
      createCollection(graph, 'players', types.vertex),
      createCollection(graph, 'played', types.edge, ['teams'], ['matches'])
    ]);
    return graph;
  })
  .then(graph => {
    const routes = router(graph);
    const app = express(routes);
    const server = http.createServer(app);
    server.listen(config.port, config.ip, () => {
      console.log('Express server listening on ' +
        `http://${config.ip}:${config.port}, in ${config.env}
      `);
    });
  })
  .catch(console.error);

const createCollection = async (graph, name, type, from = null, to = null) => {
  let promise;
  if (type === types.vertex) {
    promise = graph.addVertexCollection(name);
  } else {
    promise = graph.addEdgeDefinition({
      collection: name,
      from,
      to
    });
  }
  return promise.catch(err => logger.info(err));
};
