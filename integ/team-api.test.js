import { map as mapAsync } from 'async'
import request from 'supertest'
import container from '../src/container'

import { createDatabase } from '../src/core/arangodb'
import { teamFactory } from '../src/utils'
import createTestServer, { cleanUpDatabase } from './utils'

describe('Integration | API | Teams', () => {
  const app = createTestServer()

  beforeEach(async () => {
    const db = createDatabase()
    await cleanUpDatabase(db)
  })

  describe('GET /v1/teams', () => {
    let teams

    beforeEach(async () => {
      teams = teamFactory.buildList(3)
      // Save players
      const playerRepository = container.resolve('playerRepository')
      const players = teams.flatMap((team) => team.players)
      await mapAsync(players, async (player) => playerRepository.create(player))
      // Save teams
      const teamRepository = container.resolve('teamRepository')
      await mapAsync(teams, async (team) => teamRepository.create(team))
    })

    test('200 OK', async () => {
      const { body, status, type } = await request(app).get('/v1/teams')
      expect(status).toBe(200)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual(teams)
    })
  })
})
