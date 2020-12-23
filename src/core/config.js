import convict from 'convict'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

// Load full config
const configuration = convict({
  arangodb: {
    name: {
      env: 'ARANGODB_NAME',
      format: String,
      default: '_system'
    },
    url: {
      env: 'ARANGODB_URL',
      format: String,
      default: 'http://localhost:8529'
    }
  },
  battlemythe: {
    api: {
      env: 'BATTLEMYTHE_API',
      format: String,
      default: 'https://dev.battlemythe.net/api/anniv/2020'
    },
    username: {
      env: 'BATTLEMYTHE_API_USERNAME',
      format: String,
      default: ''
    },
    password: {
      env: 'BATTLEMYTHE_API_PASSWORD',
      format: String,
      default: ''
    }
  },
  env: {
    env: 'NODE_ENV',
    format: ['production', 'development', 'test'],
    default: 'development'
  },
  feature: {
    ranking: {
      format: Boolean,
      default: false,
      env: 'FEATURE_RANKING'
    }
  },
  host: {
    format: 'url',
    default: 'http://localhost'
  },
  log: {
    level: {
      env: 'LOG_LEVEL',
      format: ['error', 'warn', 'info', 'debug', 'trace'],
      default: 'debug'
    }
  },
  maxPoints: {
    env: 'MAX_POINTS',
    format: Number,
    default: 10
  },
  name: {
    doc: 'The application name',
    env: 'APP_NAME',
    format: String,
    default: 'Baby-foot API'
  },
  port: {
    format: 'port',
    default: 9000
  },
  redis: {
    env: 'REDIS_URI',
    format: String,
    default: 'redis://localhost:6379'
  },
  server: {
    env: 'SERVER',
    format: String,
    default: 'ws://localhost:4000'
  }
})

configuration.validate({
  allowed: 'strict'
})

export const config = configuration.get()
