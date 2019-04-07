import test from 'ava';

import createContainer from '../src/container';

test.beforeEach(t => {
  t.context = {
    container: createContainer(),
  };
});

// A macro that verifies whether a dependency is registered.
const resolveSuccessfully = (t, dependency) => {
  const { container } = t.context;
  const resolved = container.resolve(dependency);
  t.truthy(resolved);
};

resolveSuccessfully.title = (providedTitle = '', dependency) =>
  providedTitle || `It should resolve ${dependency}`;

['validateInput', 'matchRepository', 'matchController', 'matchRouter'].map(
  dep => test(resolveSuccessfully, dep),
);
