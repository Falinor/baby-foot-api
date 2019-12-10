import test from 'ava'
import request from 'supertest'

import { createMatch, createTestServer } from './utils'

test.beforeEach('Create context', async t => {
  // Add a scoped container
  // app.use(scopePerRequest(container));
  const app = createTestServer()
  t.context = {
    app: app.callback()
  }
})

test.serial('GET /matches -> 200 OK', async t => {
  // Given
  const { app } = t.context
  const sampleMatches = await Promise.all([
    createMatch(),
    createMatch(),
    createMatch()
  ])
  // When
  const res = await request(app).get('/v1/matches')
  // Then
  t.is(typeof res, 'object')
  t.is(res.status, 200)
  t.is(res.type, 'application/json')
  const matches = res.body
  // Check array type and size
  t.true(Array.isArray(matches))
  t.is(matches.length, sampleMatches.length)
})

test.serial('POST /matches -> 201 Created', async t => {
  // Given
  const { app } = t.context
  // When
  const res = await request(app)
    .post('/v1/matches')
    .send({
      red: {
        points: 10,
        players: ['ABC', 'DEF']
      },
      blue: {
        points: 6,
        players: ['GHI', 'KLM']
      }
    })
    .set('Content-Type', 'application/json')
  // Then
  t.is(typeof res, 'object')
  t.is(res.status, 201)
  t.is(typeof res.headers.location, 'string')
  // The header 'Location' should be something like `https://.../matches/{id}
  t.regex(res.headers.location, /\/matches\/[a-g0-9-]+$/)
})
