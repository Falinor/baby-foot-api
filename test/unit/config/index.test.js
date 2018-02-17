import test from 'ava';

import createConfig from '../../../src/config/index';

test('Should return a config object', (t) => {
  const config = createConfig({});
  t.is(typeof config, 'object');
  t.deepEqual(config, {
    appName: 'Baby-foot API',
    env: 'development',
    host: 'http://localhost',
    port: 9000,
    log: {
      level: 'debug',
    },
    db: {
      url: 'mongodb://localhost:27017',
      name: 'baby-foot',
      retryConnection: true,
    },
  });
});

test('Should return a completely customized config object', (t) => {
  const opts = {
    APP_NAME: 'myCoolAppName',
    NODE_ENV: 'myCoolEnv',
    HOST: 'myCoolHost',
    PORT: '8000',
    LOG_LEVEL: 'myLogLevel',
    DB_URL: 'myDBURL',
    DB_NAME: 'myDBName',
    DB_RETRY_CONNECTION: 'true',
  };
  const config = createConfig(opts);
  t.deepEqual(config, {
    appName: 'myCoolAppName',
    env: 'myCoolEnv',
    host: 'myCoolHost',
    port: 8000,
    log: {
      level: 'myLogLevel',
    },
    db: {
      url: 'myDBURL',
      name: 'myDBName',
      retryConnection: true,
    },
  });
});
