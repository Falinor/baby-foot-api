import test from 'ava';

import express from './index';

test('Should create an express app', async t => {
  const routes = () => (req, res, next) => ({});
  const app = express(routes());
  t.truthy(app);
  t.truthy(app.use);
});
