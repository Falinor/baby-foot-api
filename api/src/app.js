import http from 'http'
import config from './config';
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'

const app = express(api);
const server = http.createServer(app);

mongoose.connect(config.mongo.uri);

setImmediate(() => {
  server.listen(config.port, config.ip, () => {
    console.log(`Express server listening on http://${config.ip}:${config.port},
    in ${config.env}
    `);
  });
});

export default app;
