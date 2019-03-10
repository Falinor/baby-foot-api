import test from 'ava';

import { createContainer } from '../../src/core';

test('Should create a container', t => {
  const container = createContainer();
  t.truthy(container);
});

// Define the macro
const isRegistered = (t, dependency) => {
  const container = createContainer();
  const dep = container.resolve(dependency);
  t.truthy(dep);
};

// Generate its title
isRegistered.title = (givenTitle, dependency) =>
  `Given a DI container, when I resolve ${dependency}, then it should be defined`;

// The actual dependencies to test
const dependencies = ['config', 'logger'];

dependencies.map(dep => test(isRegistered, dep));
