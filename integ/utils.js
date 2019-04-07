import defaultsDeep from 'lodash.defaultsdeep';

import createContainer from '../src/container';
import { createServer } from '../src/interfaces/http/server';

const container = createContainer();

function createRouters(resources = []) {
  const allowed = ['match'];
  return resources
    .filter(resource => allowed.includes(resource))
    .map(resource => {
      const router = `${resource}Router`;
      return container.resolve(router);
    });
}

/**
 * @param {TestServerOptions} opts
 *
 * @example
 * createTestServer();
 *
 * createTestServer({
 *   resources: ['match']
 * });
 */
export function createTestServer(opts = {}) {
  defaultsDeep(opts, {
    resources: ['match'],
  });
  const { resources } = opts;
  const routers = createRouters(resources);
  return createServer({
    routers,
    versionPrefix: '/v1',
  });
}

export async function createMatch(match = {}) {
  const repo = container.resolve('matchRepository');
  const finalMatch = defaultsDeep(match, {
    red: {
      points: 10,
      players: ['ABC', 'DEF'],
    },
    blue: {
      points: 6,
      players: ['GHI', 'KLM'],
    },
    playedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return repo.create(finalMatch);
}

export default createTestServer;
