// eslint-disable-next-line
const requireProcessEnv = (env, name) => {
  if (!env[name]) {
    throw new Error(`You must set the ${name} environment variable`);
  }
  return env[name];
};

export default (environment = process.env) => ({
  appName: environment.APP_NAME || 'Baby-foot API',
  env: environment.NODE_ENV || 'development',
  host: environment.HOST || 'http://localhost',
  port: environment.PORT || 9000,
  log: {
    level: environment.LOG_LEVEL || 'debug',
  },
  db: {
    url: environment.DB_URL || 'mongodb://localhost:27017',
    name: environment.DB_NAME || 'baby-foot',
    retryConnection: !!environment.DB_RETRY_CONNECTION || true,
  },
});
