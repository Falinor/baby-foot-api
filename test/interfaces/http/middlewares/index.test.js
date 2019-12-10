import test from 'ava'
import sinon from 'sinon'

import {
  contentType,
  errorHandler
} from '../../../../src/interfaces/http/middlewares/index'

test.beforeEach('Create context', t => {
  const next = sinon.stub()
  t.context = {
    next
  }
})

test('Should handle errors and log them', async t => {
  const { next } = t.context
  const err = new Error('My custom error message')
  next.rejects(err)
  const logger = {
    error: sinon.spy()
  }
  const middleware = errorHandler(logger)
  await middleware(null, next)
  t.true(next.calledOnce)
  t.true(logger.error.calledOnce)
  t.true(logger.error.calledWithExactly(err))
})
