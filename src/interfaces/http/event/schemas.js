import { Joi } from 'koa-joi-router'

import { BetTeam, EventType } from '../../../app'

const betTeamSchema = Joi.string().valid(...Object.values(BetTeam))

const create = {
  type: 'json',
  body: Joi.object({
    match: Joi.string(),
    type: Joi.string().valid(...Object.values(EventType)),
    team: betTeamSchema.optional()
  }).options({
    presence: 'required',
    stripUnknown: true
  })
}

const schemas = {
  create
}

export default schemas
