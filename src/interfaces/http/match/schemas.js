import { Joi } from 'koa-joi-router'

const teamSchema = Joi.object({
  points: Joi.number().integer().min(0),
  color: Joi.string().valid('black', 'purple'),
  name: Joi.string().valid('Batman', 'Joker'),
  players: Joi.array().items(Joi.string()).min(1).max(2).unique()
})

const create = {
  type: 'json',
  body: Joi.object({
    teams: Joi.array().items(teamSchema).length(2)
  }).options({
    presence: 'required',
    stripUnknown: true
  })
}

const update = {
  type: 'json',
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object({
    teams: Joi.array().items(teamSchema).length(2)
  }).options({
    presence: 'required',
    stripUnknown: true
  })
}

const remove = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  })
}

const schemas = {
  create,
  update,
  remove
}

export default schemas
