import test from 'ava';
import EventEmitter from 'events';
import sinon from 'sinon';

import { matches } from '../../../../data';
import controller from '../../../../../src/interfaces/http/match/controller';

test.beforeEach('Create context', (t) => {
  t.context = {
    ctx: {
      state: {
        container: {
          cradle: {},
        },
      },
    },
  };
});

test('Should create a match controller', (t) => {
  t.is(typeof controller, 'object');
  t.is(typeof controller.index, 'function');
});

test('Should set status and body on success', async (t) => {
  const { ctx } = t.context;
  const findMatches = new EventEmitter();
  ctx.state.container.cradle.findMatches = findMatches;
  findMatches.outputs = { SUCCESS: 'success' };
  findMatches.execute = sinon.stub().callsFake(() => {
    findMatches.emit(findMatches.outputs.SUCCESS, matches);
  });
  await controller.index(ctx);
  t.is(ctx.status, 200);
  t.deepEqual(ctx.body, matches);
});

test.todo('Should throw 500 Internal Server Error on error');
