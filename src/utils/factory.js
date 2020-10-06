import { date, random } from 'faker'
import { Factory } from 'rosie'
import { v4 as uuid } from 'uuid'

export const playerFactory = new Factory().attrs({
  id: () => uuid(),
  createdAt: () => new Date(),
  updatedAt: () => new Date()
})

export const teamFactory = new Factory().attrs({
  id: () => uuid(),
  players: () => playerFactory.buildList(2),
  createdAt: () => new Date(),
  updatedAt: () => new Date()
})

export const matchFactory = new Factory().attrs({
  id: () => uuid(),
  red: () => ({
    ...teamFactory.build(),
    points: random.number({ min: 0, max: 10 })
  }),
  blue: () => ({
    ...teamFactory.build(),
    points: random.number({ min: 0, max: 10 })
  }),
  playedAt: () => date.recent(),
  createdAt: () => new Date(),
  updatedAt: () => new Date()
})
