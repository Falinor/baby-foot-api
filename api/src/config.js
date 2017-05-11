/* eslint-disable no-unused-vars */
import { join } from 'path';

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
};

const config = {
  env: process.env.NODE_ENV || 'development',
  root: join(__dirname, '..'),
  port: process.env.PORT || 9000,
  ip: process.env.IP || '0.0.0.0',
  // masterKey: requireProcessEnv('MASTER_KEY'),
  db: {
    name: process.env.DB_NAME || 'BabyFootDB',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 2424,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
};

export default config;
