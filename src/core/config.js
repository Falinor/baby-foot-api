import convict from 'convict'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

// Load full config
const configuration = convict({
  name: {
    doc: 'The application name',
    format: String,
    default: 'Baby-foot API',
    env: 'APP_NAME'
  },
  maxPoints: {
    format: Number,
    default: 10,
    env: 'MAX_POINTS'
  },
  env: {
    format: ['production', 'development', 'test'],
    default: 'development',
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
      env: 'ARANGODB_NAME',
      default: '_system'
    },
    url: {
      format: String,
      env: 'ARANGODB_URL',
      default: 'http://localhost:8529'
    }
  },
  redis: {
    env: 'REDIS_URI',
    format: String,
    default: 'redis://localhost:6379'
  },
  battlemytheAPI: {
    host: {
      format: String,
      env: 'BATTLEMYTHE_API_HOST',
      default: 'https://dev.battlemythe.net/api/anniv/2020'
    },
    username: {
      format: String,
      env: 'BATTLEMYTHE_API_USERID',
      default: ''
    },
    password: {
      format: String,
      env: 'BATTLEMYTHE_API_PASSWORD',
      default: ''
    }
  }
})

configuration.validate({
  allowed: 'strict'
})

export const config = configuration.get()
