import test from 'ava';
import sinon from 'sinon';

import createRouter from './index';

test.serial('Should create a router instance', async t => {
  const graph = {
    vertexCollection: sinon.stub(),
    edgeCollection: sinon.stub()
  };
  const router = createRouter(graph);
  t.truthy(router);
});
