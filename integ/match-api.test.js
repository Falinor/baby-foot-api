import { map as mapAsync } from 'async'
import { orderBy } from 'lodash'
import request from 'supertest'

import container from '../src/container'
import { createDatabase } from '../src/core/arangodb'
import { matchFactory, playerFactory } from '../src/utils'
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
      const teams = matches.flatMap((match) => match.teams)
      // Save players
      const playerRepository = container.resolve('playerRepository')
      const players = teams.flatMap((team) => team.players)
      await mapAsync(players, async (player) => playerRepository.create(player))
      // Save teams
      const teamRepository = container.resolve('teamRepository')
      await mapAsync(teams, async (team) => teamRepository.create(team))
      // Save matches
      const matchRepository = container.resolve('matchRepository')
      await mapAsync(matches, async (match) => matchRepository.create(match))
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
    let players

    beforeEach(async () => {
      players = orderBy(playerFactory.buildList(4), ['rank', 'desc'])
      const playerRepository = container.resolve('playerRepository')
      await mapAsync(players, async (player) => playerRepository.create(player))
      match = {
        teams: [
          {
            color: 'black',
            points: 10,
            players: players.slice(0, 2).map((player) => player.id)
          },
          {
            color: 'purple',
            points: 6,
            players: players.slice(2, 4).map((player) => player.id)
          }
        ]
      }
    })

    test('201 Created', async () => {
      const { body, status, type } = await request(app)
        .post('/v1/matches')
        .send(match)
        .set('Content-Type', 'application/json')
      expect(status).toBe(201)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual({
        id: expect.any(String),
        teams: [
          {
            id: expect.any(String),
            wins: 0,
            losses: 0,
            rank: 1000,
            players: players.slice(0, 2)
          },
          {
            id: expect.any(String),
            wins: 0,
            losses: 0,
            rank: 1000,
            players: players.slice(2, 4)
          }
        ],
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
