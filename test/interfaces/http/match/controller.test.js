import test from 'ava'
import EventEmitter from 'events'
import sinon from 'sinon'

import { inputMatch, matches } from '../../../data'
import controller from '../../../../src/interfaces/http/match/controller'

test.beforeEach('Create context', t => {
  t.context = {
    ctx: {
      state: {
        container: {
          cradle: {}
        }
      },
      set: sinon.spy(),
      throw: sinon.spy()
    }
  }
})

test('Should create a match controller', t => {
  t.is(typeof controller, 'object')
  t.is(typeof controller.index, 'function')
  t.is(typeof controller.create, 'function')
})

// index
test('Should set status and body on success', async t => {
  const { ctx } = t.context
  const findMatches = new EventEmitter()
  ctx.state.container.cradle.findMatches = findMatches
  findMatches.outputs = { SUCCESS: 'success' }
  findMatches.execute = sinon.stub().callsFake(() => {
    findMatches.emit(findMatches.outputs.SUCCESS, matches)
  })
  await controller.index(ctx)
  t.is(ctx.status, 200)
  t.deepEqual(ctx.body, matches)
})

// index
test('Should throw 500 Internal Server Error on error', async t => {
  const { ctx } = t.context
  const err = new Error('Internal Server Error')
  const findMatches = new EventEmitter()
  ctx.state.container.cradle.findMatches = findMatches
  findMatches.outputs = { ERROR: 'error' }
  findMatches.execute = sinon.stub().callsFake(() => {
    findMatches.emit(findMatches.outputs.ERROR, err)
  })
  await controller.index(ctx)
  t.true(ctx.throw.calledOnce)
  t.true(ctx.throw.calledWithExactly(500, 'Internal Server Error'))
})

// create
test('Should set status to 201 and return the newly created match in the Location header', async t => {
  const { ctx } = t.context
  const match = Object.assign({}, inputMatch, { id: 42 })
  const createMatch = new EventEmitter()
  ctx.state.container.cradle = {
    createMatch,
    config: {
      url: {
        host: 'https://api.example.com',
        port: 443,
        prefix: 'api/v1'
      }
    }
  }
  createMatch.outputs = { SUCCESS: 'success' }
  createMatch.execute = sinon.stub().callsFake(() => {
    createMatch.emit(createMatch.outputs.SUCCESS, match)
  })
  await controller.create(ctx)
  t.is(ctx.status, 201)
})
