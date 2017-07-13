/* eslint-disable no-unused-vars */
import { join } from 'path';

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
};

export const config = {
  env: process.env.NODE_ENV || 'development',
  root: join(__dirname, '..', '..'),
  port: process.env.PORT || 9000,
  ip: process.env.IP || '0.0.0.0',
  // masterKey: requireProcessEnv('MASTER_KEY'),
  logLevel: process.env.LOG_LEVEL || 'debug',
  db: {
    url: process.env.DB_URL || 'http://localhost:8529',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    databaseName: process.env.DB_NAME || 'BabyFootDB',
    graphName: process.env.DB_GRAPH_NAME || 'BabyFootGraph',
    retryConnection: true
  }
};

export default config;
