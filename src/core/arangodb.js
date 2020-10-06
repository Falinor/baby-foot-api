import { Database } from 'arangojs'

import { config } from './config'

export function createDatabase() {
  return new Database({
    databaseName: config.arangodb.name
  })
}
