import convict from 'convict'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Load full config
const configuration = convict({
  name: {
    doc: 'The application name',
    format: String,
    default: 'Baby-foot API',
    env: 'APP_NAME'
  },
  env: {
    format: ['production', 'development', 'test'],
    default: 'production',
    env: 'NODE_ENV'
  },
  host: {
    format: 'url',
    default: 'http://localhost'
  },
  port: {
    format: 'port',
    default: 9000
  },
  log: {
    level: {
      format: ['error', 'warn', 'info', 'debug', 'trace'],
      default: 'debug',
      env: 'LOG_LEVEL',
      arg: 'log-level'
    }
  },
  arangodb: {
    name: {
      format: String,
      default: '_system',
      env: 'ARANGODB_NAME'
    }
  }
})

configuration.validate({
  allowed: 'strict'
})

export const config = configuration.get()
