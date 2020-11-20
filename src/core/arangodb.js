import { Database } from 'arangojs'

import { config } from './config'

export function createDatabase() {
  return new Database({
    url: config.arangodb.url,
    databaseName: config.arangodb.name
  })
}
