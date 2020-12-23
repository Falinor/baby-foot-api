import { map as mapAsync } from 'async'
import request from 'supertest'
import { BetEvent, BetStatus, BetTeam } from '../src/app'

import container from '../src/container'
import { betFactory } from '../src/utils'
import createTestServer, { cleanUpDatabase } from './utils'

describe('Integration | API | Events', () => {
  const app = createTestServer()

  beforeEach(async () => {
    const db = container.resolve('db')
    await cleanUpDatabase(db)
  })

  describe('POST /v1/events', () => {
    const bet = betFactory.build({
      team: BetTeam.BATMAN,
      event: BetEvent.GOAL_SCORED
    })
    let response

    beforeEach(async () => {
      // Create players
      const players = bet.match.teams.flatMap((team) => team.players)
      const playerRepository = container.resolve('playerRepository')
      await mapAsync(players, async (player) => playerRepository.create(player))
      // Create teams
      const teams = bet.match.teams
      const teamRepository = container.resolve('teamRepository')
      await mapAsync(teams, async (team) => teamRepository.create(team))
      // Create match
      const matchRepository = container.resolve('matchRepository')
      await matchRepository.create(bet.match)
      // Create bettor and takers
      const bettorRepository = container.resolve('bettorRepository')
      await mapAsync([bet.bettor, ...bet.takers], async (user) =>
        bettorRepository.create(user)
      )
      // Create bet
      const betRepository = container.resolve('betRepository')
      await betRepository.create(bet)

      // When
      response = await request(app).post('/v1/events').send({
        type: bet.event,
        match: bet.match.id,
        team: bet.team
      })
    })

    test('201 Created ', async () => {
      const { body, status, type } = response
      expect(status).toBe(201)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual({
        id: expect.any(String),
        type: bet.event,
        match: bet.match.id,
        team: bet.team,
        createdAt: expect.any(String)
      })
    })

    test('The bet status has been updated', async () => {
      const betRepository = container.resolve('betRepository')
      const actual = await betRepository.get(bet.id)
      expect(actual.status).toBe(BetStatus.SUCCEEDED)
    })

    test('The bettor earned points', async () => {
      const betRepository = container.resolve('betRepository')
      const actual = await betRepository.get(bet.id)
      expect(actual.bettor.points).toBe(bet.bettor.points + bet.points)
    })
  })
})
