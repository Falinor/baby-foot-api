import test from 'ava'

import { createConfig } from '../../src/core/config'

test('Should create config', t => {
  const config = createConfig(false)
  t.truthy(config)
})
