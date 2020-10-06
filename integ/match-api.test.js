import { map as mapAsync } from 'async'
import request from 'supertest'

import container from '../src/container'
import { createDatabase } from '../src/core/arangodb'
import { matchFactory } from '../src/utils'
import { cleanUpDatabase, createTestServer } from './utils'

describe('Integration | API | Matches', () => {
  const app = createTestServer()

  beforeEach(async () => {
    const db = createDatabase()
    await cleanUpDatabase(db)
  })

  describe('GET /v1/matches', () => {
    let matches

    beforeEach(async () => {
      matches = matchFactory.buildList(3)
      const matchRepository = container.resolve('matchRepository')
      const db = container.resolve('db')
      const players = matches.map((match) => [
        ...match.red.players,
        ...match.blue.players
      ])
      await db.collection('players').saveAll(players)
      await mapAsync(matches, async (match) => matchRepository.save(match))
    })

    test('200 OK', async () => {
      const { body, status, type } = await request(app).get('/v1/matches')
      expect(status).toBe(200)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual(matches)
    })
  })

  describe('POST /v1/matches', () => {
    let match

    beforeEach(async () => {
      match = {
        red: {
          points: 10,
          players: ['p1', 'p2']
        },
        blue: {
          points: 6,
          players: ['p3', 'p4']
        }
      }
      const players = [
        ...match.red.players,
        ...match.blue.players
      ].map((id) => ({ id }))
      const playerRepository = container.resolve('playerRepository')
      await mapAsync(players, async (player) => playerRepository.save(player))
    })

    test('201 Created', async () => {
      const { body, status, type } = await request(app)
        .post('/v1/matches')
        .send(match)
        .set('Content-Type', 'application/json')
      expect(status).toBe(201)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual({
        ...match,
        id: expect.any(String),
        red: {
          ...match.red,
          id: expect.any(String)
        },
        blue: {
          ...match.blue,
          id: expect.any(String)
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    test('400 Bad request', async () => {
      const match = matchFactory.build({
        red: {
          points: -1
        }
      })
      const { body, status } = await request(app)
        .post('/v1/matches')
        .send(match)
        .set('Content-Type', 'application/json')
      expect(status).toBe(400)
      expect(body).toStrictEqual({
        message: expect.any(String),
        name: 'ValidationError'
      })
    })
  })
})
