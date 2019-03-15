import convict from 'convict';
import dotenv from 'dotenv';

export function createConfig(validate = true) {
  // Load environment variables from .env file
  dotenv.config();
  // Load full config
  const config = convict({
    name: {
      doc: 'The application name',
      format: String,
      default: 'Baby-foot API',
      env: 'APP_NAME',
    },
    env: {
      format: ['production', 'development', 'test'],
      default: 'production',
      env: 'NODE_ENV',
    },
    url: {
      host: {
        format: 'url',
        default: 'http://localhost',
      },
      port: {
        format: 'port',
        default: 9000,
      },
    },
    log: {
      level: {
        format: ['error', 'warn', 'info', 'debug', 'trace'],
        default: 'warn',
        env: 'LOG_LEVEL',
        arg: 'log-level',
      },
    },
    db: {
      url: {
        format: 'url',
        default: 'mongodb://localhost:27017',
        env: 'DB_URL',
      },
      name: {
        format: String,
        default: 'baby-foot',
        env: 'DB_NAME',
      },
    },
  });
  if (validate) {
    config.validate({
      allowed: 'strict',
    });
  }
  return {
    get: name => config.get(name),
  };
}

export default createConfig;
