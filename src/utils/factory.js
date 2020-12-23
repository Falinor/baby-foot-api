import { date, internet, name, random } from 'faker'
import { Factory } from 'rosie'
import { v4 as uuid } from 'uuid'

import { BetAgainst, BetEvent, BetStatus, BetTeam, EventType } from '../app'

export const bettorFactory = new Factory().attrs({
  id: () => uuid(),
  nickname: () => internet.userName(),
  points: () => random.number(200)
})

export const betFactory = new Factory().attrs({
  id: () => uuid(),
  bettor: () => bettorFactory.build(),
  match: () => matchFactory.build(),
  takers: () => bettorFactory.buildList(2),
  event: () => random.arrayElement(Object.values(BetEvent)),
  team: () => random.arrayElement(Object.values(BetTeam)),
  points: () => random.number(50),
  sip: () => random.number(3),
  against: () => random.arrayElement(Object.values(BetAgainst)),
  status: () => random.arrayElement(Object.values(BetStatus)),
  createdAt: () => date.past().toJSON()
})

export const eventFactory = new Factory().attrs({
  id: () => uuid(),
  type: () => random.arrayElement(Object.values(EventType)),
  match: () => random.uuid(),
  team: () => random.arrayElement(Object.values(BetTeam)),
  createdAt: () => new Date().toJSON()
})

export const playerFactory = new Factory().attrs({
  id: () => uuid(),
  nickname: () => name.findName(),
  rank: () => random.number({ min: 100, max: 10000 }),
  wins: () => random.number(10),
  losses: () => random.number(10),
  createdAt: () => new Date().toJSON(),
  updatedAt: () => new Date().toJSON()
})

export const teamFactory = new Factory().attrs({
  id: () => uuid(),
  players: () => playerFactory.buildList(2),
  rank: () => random.number({ min: 100, max: 10000 }),
  wins: () => random.number(10),
  losses: () => random.number(10),
  createdAt: () => new Date().toJSON(),
  updatedAt: () => new Date().toJSON()
})

export const matchFactory = new Factory().attrs({
  id: () => uuid(),
  teams: () => [
    teamFactory.build({
      points: random.number({ min: 0, max: 10 }),
      color: 'black',
      name: 'Batman'
    }),
    teamFactory.build({
      points: random.number({ min: 0, max: 10 }),
      color: 'purple',
      name: 'Joker'
    })
  ],
  playedAt: () => date.recent().toJSON(),
  createdAt: () => new Date().toJSON(),
  updatedAt: () => new Date().toJSON()
})
