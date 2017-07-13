import test from 'ava';

import createRouter from './index';

test('Should create a router instance', async t => {
  const arango = {
    graph: {
      vertexCollection: (name) => {},
      edgeCollection: (name) => {}
    }
  };
  const router = createRouter(arango);
  t.truthy(router);
});
