import { Joi } from 'koa-joi-router'

const teamSchema = Joi.object({
  points: Joi.number().integer().min(0),
  players: Joi.array().items(Joi.string()).min(1).max(2).unique()
})

const customJoi = Joi.extend((joi) => ({
  base: joi.array(),
  name: 'stringArray',
  coerce: (value, state, options) => (value?.split ? value.split(',') : value)
}))

const index = {
  query: Joi.object({
    id: customJoi.stringArray().items(Joi.string()).single()
  }).options({
    stripUnknown: true
  })
}

const schemas = {
  index
}

export default schemas
