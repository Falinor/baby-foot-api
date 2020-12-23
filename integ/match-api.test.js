import { aql } from 'arangojs'
import { map as mapAsync } from 'async'
import { orderBy } from 'lodash'
import request from 'supertest'

import { MatchStatus } from '../src/app'
import container from '../src/container'
import {
  betFactory,
  eventFactory,
  matchFactory,
  playerFactory,
  teamFactory
} from '../src/utils'
import { cleanUpDatabase, createTestServer } from './utils'

describe('Integration | API | Matches', () => {
  const app = createTestServer()

  beforeEach(async () => {
    const db = container.resolve('db')
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
      matches.forEach((match) => {
        match.teams.forEach((team) => {
          team.players = orderBy(team.players, ['rank'], ['desc'])
        })
        match.teams = orderBy(match.teams, ['rank'], ['desc'])
      })
      expect(body).toStrictEqual(matches)
    })
  })

  describe('POST /v1/matches', () => {
    let teams

    beforeEach(async () => {
      teams = teamFactory.buildList(2)
      // Create players
      const players = teams.flatMap((team) => team.players)
      const playerRepository = container.resolve('playerRepository')
      await mapAsync(players, async (player) => playerRepository.create(player))
      // Create teams
      const teamRepository = container.resolve('teamRepository')
      await mapAsync(teams, async (team) => teamRepository.create(team))
    })

    test('201 Created - The match is over', async () => {
      const { body, status, type } = await request(app)
        .post('/v1/matches')
        .send({
          teams: [
            {
              points: 10,
              color: 'black',
              name: 'Batman',
              players: teams[0].players.map((player) => player.id)
            },
            {
              points: 6,
              color: 'purple',
              name: 'Joker',
              players: teams[1].players.map((player) => player.id)
            }
          ]
        })
        .set('Content-Type', 'application/json')
      expect(status).toBe(201)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual({
        id: expect.any(String),
        status: MatchStatus.OVER,
        teams: orderBy(
          [
            {
              ...teams[0],
              id: expect.any(String),
              color: 'black',
              name: 'Batman',
              points: 10,
              players: orderBy(teams[0].players, ['rank'], ['desc'])
            },
            {
              ...teams[1],
              id: expect.any(String),
              color: 'purple',
              name: 'Joker',
              points: 6,
              players: orderBy(teams[1].players, ['rank'], ['desc'])
            }
          ],
          ['rank'],
          ['desc']
        ),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    test('201 Created - The match is ongoing', async () => {
      const { body, status, type } = await request(app)
        .post('/v1/matches')
        .send({
          teams: [
            {
              color: 'black',
              name: 'Batman',
              points: 0,
              players: teams[0].players.map((player) => player.id)
            },
            {
              color: 'purple',
              name: 'Joker',
              points: 0,
              players: teams[1].players.map((player) => player.id)
            }
          ]
        })
        .set('Content-Type', 'application/json')
      expect(status).toBe(201)
      expect(type).toBe('application/json')
      expect(body).toStrictEqual({
        id: expect.any(String),
        status: MatchStatus.PLAYING,
        teams: orderBy(
          [
            {
              ...teams[0],
              id: expect.any(String),
              color: 'black',
              name: 'Batman',
              points: 0,
              players: orderBy(teams[0].players, ['rank'], ['desc'])
            },
            {
              ...teams[1],
              id: expect.any(String),
              color: 'purple',
              name: 'Joker',
              points: 0,
              players: orderBy(teams[1].players, ['rank'], ['desc'])
            }
          ],
          ['rank'],
          ['desc']
        ),
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

  describe('PUT /v1/matches/:id', () => {
    let players

    beforeEach(async () => {
      // Create players
      players = orderBy(playerFactory.buildList(4), ['rank'], ['desc'])
      const playerRepository = container.resolve('playerRepository')
      await mapAsync(players, async (player) => playerRepository.create(player))
    })

    describe('The match exists', () => {
      let match

      beforeEach(async () => {
        match = matchFactory.build({
          teams: [
            teamFactory.build({
              points: 9,
              color: 'black',
              name: 'Batman'
            }),
            teamFactory.build({
              points: 0,
              color: 'purple',
              name: 'Joker'
            })
          ]
        })
        // Save players
        const players = match.teams.flatMap((team) => team.players)
        const playerRepository = container.resolve('playerRepository')
        await mapAsync(players, async (player) =>
          playerRepository.create(player)
        )
        // Save teams
        const teams = match.teams
        const teamRepository = container.resolve('teamRepository')
        await mapAsync(teams, async (team) => teamRepository.create(team))
        // Save match
        const matchRepository = container.resolve('matchRepository')
        await matchRepository.create(match)
      })

      test('200 OK', async () => {
        const { body, status, type } = await request(app)
          .put(`/v1/matches/${match.id}`)
          .send({
            teams: [
              {
                color: 'black',
                name: 'Batman',
                points: 10,
                players: match.teams[0].players.map((player) => player.id)
              },
              {
                color: 'purple',
                name: 'Joker',
                points: 0,
                players: match.teams[1].players.map((player) => player.id)
              }
            ]
          })
          .set('Content-Type', 'application/json')
        expect(status).toBe(200)
        expect(type).toBe('application/json')
        expect(body).toStrictEqual({
          id: expect.any(String),
          status: MatchStatus.OVER,
          teams: orderBy(
            [
              {
                ...match.teams[0],
                id: expect.any(String),
                color: 'black',
                name: 'Batman',
                points: 10,
                players: orderBy(match.teams[0].players, ['rank'], ['desc'])
              },
              {
                ...match.teams[1],
                id: expect.any(String),
                color: 'purple',
                name: 'Joker',
                points: 0,
                players: orderBy(match.teams[1].players, ['rank'], ['desc'])
              }
            ],
            ['rank'],
            ['desc']
          ),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      })
    })

    describe.skip('The match does not exists', () => {
      test('201 Created', async () => {
        // TODO
      })
    })
  })

  describe('DELETE /v1/matches/:id', () => {
    let match
    let response

    beforeEach(async () => {
      match = matchFactory.build()
      const teams = match.teams
      // Save players
      const playerRepository = container.resolve('playerRepository')
      const players = teams.flatMap((team) => team.players)
      await mapAsync(players, async (player) => playerRepository.create(player))
      // Save teams
      const teamRepository = container.resolve('teamRepository')
      await mapAsync(teams, async (team) => teamRepository.create(team))
      // Save matches
      const matchRepository = container.resolve('matchRepository')
      await matchRepository.create(match)
      // Save bets
      const betRepository = container.resolve('betRepository')
      const bets = betFactory.buildList(3, { match })
      await mapAsync(bets, async (bet) => betRepository.create(bet))
      // Save events
      const eventRepository = container.resolve('eventRepository')
      const events = eventFactory.buildList(4, { match })
      await mapAsync(events, async (event) => eventRepository.create(event))

      response = await request(app).delete(`/v1/matches/${match.id}`)
    })

    it('204 No content', async () => {
      expect(response.status).toBe(204)
    })

    it('should remove the match', async () => {
      const matchCollection = container.resolve('db').collection('matches')
      const actual = await matchCollection.document(
        { _key: match.id },
        { graceful: true }
      )
      expect(actual).toBeNull()
    })

    it('should remove links between the match and its teams', async () => {
      const db = container.resolve('db')
      const id = `matches/${match.id}`
      const cursor = await db.query(aql`
        FOR p IN played
          FILTER p._to == ${id}
          RETURN p
      `)
      const played = await cursor.all()
      expect(played).toHaveLength(0)
    })

    it('should remove related bets', async () => {
      const db = container.resolve('db')
      const cursor = await db.query(aql`
        FOR b IN bets
          FILTER b.match == ${match.id}
          RETURN b
      `)
      const bets = await cursor.all()
      expect(bets).toHaveLength(0)
    })

    it('should remove related events', async () => {
      const db = container.resolve('db')
      const cursor = await db.query(aql`
        FOR e IN events
          FILTER e.match == ${match.id}
          RETURN e
      `)
      const events = await cursor.all()
      expect(events).toHaveLength(0)
    })
  })
})
