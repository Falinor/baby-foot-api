import { Joi } from 'koa-joi-router'
import { BetAgainst, BetEvent, BetTeam } from '../../../app'

const eventSchema = Joi.string().valid(...Object.values(BetEvent))
const teamSchema = Joi.string().valid(...Object.values(BetTeam))

const index = {
  query: Joi.object({
    match: Joi.string().uuid()
  }).options({
    stripUnknown: true
  })
}

const create = {
  type: 'json',
  body: Joi.object({
    bettor: Joi.string(),
    match: Joi.string().uuid(),
    event: eventSchema,
    team: teamSchema,
    points: Joi.number().integer().min(0).max(100),
    against: Joi.string().valid(...Object.values(BetAgainst)),
    sip: Joi.number().integer().min(0).max(3).default(0),
    loserScore: Joi.number().integer().min(0).max(9).optional()
  }).options({
    presence: 'required',
    stripUnknown: true
  })
}

const acceptBet = {
  type: 'json',
  body: Joi.object({
    taker: Joi.string()
  })
}

const schemas = {
  index,
  create,
  acceptBet
}

export default schemas
