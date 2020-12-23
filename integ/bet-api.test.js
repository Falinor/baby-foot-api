import { map as mapAsync } from 'async'
import request from 'supertest'
import { v4 as uuid } from 'uuid'
import { BetAgainst, BetStatus } from '../src/app'

import container from '../src/container'
import { betFactory, matchFactory } from '../src/utils'
import createTestServer, { cleanUpDatabase } from './utils'

describe('Integration | API | Bets', () => {
  const app = createTestServer()

  beforeEach(async () => {
    const db = container.resolve('db')
    await cleanUpDatabase(db)
  })

  describe('GET /v1/bets', () => {
    const match = matchFactory.build()
    let bets

    beforeEach(async () => {
      bets = betFactory.buildList(3, { match })
      // Create match
      const teams = match.teams
      // Create players
      const playerRepository = container.resolve('playerRepository')
      const players = teams.flatMap((team) => team.players)
      await mapAsync(players, async (player) => playerRepository.create(player))
      // Create teams
      const teamRepository = container.resolve('teamRepository')
      await mapAsync(teams, async (team) => teamRepository.create(team))
      // Create matches
      const matchRepository = container.resolve('matchRepository')
      await matchRepository.create(match)
      // Create bets
      const betRepository = container.resolve('betRepository')
      await mapAsync(bets, async (bet) => betRepository.create(bet))
      // Create bettor and takers
      const bettorRepository = container.resolve('bettorRepository')
      await mapAsync(bets, async (bet) => bettorRepository.create(bet.bettor))
      const takers = bets.flatMap((bet) => bet.takers)
      await mapAsync(takers, async (taker) => bettorRepository.create(taker))
    })

    test('200 OK', async () => {
      const { body, status, type } = await request(app).get('/v1/bets')
      expect(status).toBe(200)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual(bets)
    })

    test('?match={id} => 200 OK', async () => {
      const { body, status, type } = await request(app)
        .get('/v1/bets')
        .query({ match: match.id })
      expect(status).toBe(200)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual(bets)
    })
  })

  describe('POST /v1/bets', () => {
    const bet = betFactory.build()

    beforeEach(async () => {
      const teams = bet.match.teams
      // Create players
      const playerRepository = container.resolve('playerRepository')
      const players = teams.flatMap((team) => team.players)
      await mapAsync(players, async (player) => playerRepository.create(player))
      // Create teams
      const teamRepository = container.resolve('teamRepository')
      await mapAsync(teams, async (team) => teamRepository.create(team))
      // Create match
      const matchRepository = container.resolve('matchRepository')
      await matchRepository.create(bet.match)
      // Create bet
      const betRepository = container.resolve('betRepository')
      await betRepository.create(bet)
      // Create bettor and takers
      const bettorRepository = container.resolve('bettorRepository')
      await bettorRepository.create(bet.bettor)
      await mapAsync(bet.takers, async (taker) =>
        bettorRepository.create(taker)
      )
    })

    test('201 Created', async () => {
      const { body, status, type } = await request(app).post('/v1/bets').send({
        match: bet.match.id,
        bettor: bet.bettor.id,
        event: bet.event,
        team: bet.team,
        points: bet.points,
        sip: bet.sip,
        against: bet.against
      })
      expect(status).toBe(201)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual({
        id: expect.any(String),
        takers: [],
        status: BetStatus.ONGOING,
        bettor: bet.bettor.id,
        match: bet.match.id,
        event: bet.event,
        team: bet.team,
        points: bet.points,
        sip: bet.sip,
        against: bet.against
      })
    })

    test('404 Match not found', async () => {
      const missingMatch = uuid()
      const { body, status, type } = await request(app).post('/v1/bets').send({
        // The field to test
        match: missingMatch,
        bettor: bet.bettor.id,
        event: bet.event,
        team: bet.team,
        points: bet.points,
        sip: bet.sip,
        against: bet.against
      })
      expect(status).toBe(404)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual({
        name: 'NotFoundError',
        message: `The match ${missingMatch} was not found`
      })
    })
  })
})
