const requireProcessEnv = (env, name) => {
  if (!env[name]) {
    throw new Error(`You must set the ${name} environment variable`);
  }
  return env[name];
};

export default (environment = process.env) => ({
  appName: environment.APP_NAME || 'Baby-foot API',
  env: environment.NODE_ENV || 'development',
  port: environment.PORT || 9000,
  log: {
    level: environment.LOG_LEVEL || 'debug',
  },
  db: {
    url: requireProcessEnv(environment, 'DB_URL'),
    retryConnection: !!environment.DB_RETRY_CONNECTION || true,
  },
});
