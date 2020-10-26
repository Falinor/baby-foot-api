import { date, name, random } from 'faker'
import { Factory } from 'rosie'
import { v4 as uuid } from 'uuid'

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
  teams: () =>
    teamFactory.buildList(2, {
      points: random.number({ min: 0, max: 10 })
    }),
  playedAt: () => date.recent().toJSON(),
  createdAt: () => new Date().toJSON(),
  updatedAt: () => new Date().toJSON()
})
