import { map as asyncMap } from 'async'

import container from '../src/container'
import { createServer } from '../src/interfaces/http'

function createRouters(resources = []) {
  const allowed = ['match']
  return resources
    .filter((resource) => allowed.includes(resource))
    .map((resource) => {
      const router = `${resource}Router`
      return container.resolve(router)
    })
}

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
