import { Joi } from 'koa-joi-router'

const teamSchema = Joi.object({
  points: Joi.number().integer().min(0),
  players: Joi.array().items(Joi.string()).min(1).max(2).unique()
})

const create = {
  type: 'json',
  body: Joi.object({
    red: teamSchema,
    blue: teamSchema
  }).options({
    presence: 'required',
    stripUnknown: true
  })
}

const schemas = {
  create
}

export default schemas
