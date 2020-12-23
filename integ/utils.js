import { map as asyncMap } from 'async'

import { createServer } from '../src/interfaces/http'

export async function cleanUpDatabase(db) {
  const collections = await db.collections()
  await asyncMap(collections, async (collection) => collection.truncate())
}

/**
 * @example
 * createTestServer();
 */
export function createTestServer() {
  return createServer().httpServer
}

export default createTestServer
