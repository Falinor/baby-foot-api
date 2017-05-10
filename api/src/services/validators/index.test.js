import test from 'ava';

import {
  minArrayLengthValidator,
  maxArrayLengthValidator
} from './index';

test('minArrayLengthValidator OK', async (t) => {
  const minFun = minArrayLengthValidator(1);
  const actual = await minFun([42, 443, 1337]);
  const expected = true;
  t.is(actual, expected);
});

test('minArrayLengthValidator KO', async (t) => {
  const minFun = minArrayLengthValidator(2);
  const actual = await minFun([42]);
  const expected = false;
  t.is(actual, expected);
});

test('maxArrayLengthValidator OK', async (t) => {
  const maxFun = maxArrayLengthValidator(2);
  const actual = await maxFun([42, 1337]);
  const expected = true;
  t.is(actual, expected);
});

test('maxArrayLengthValidator KO', async (t) => {
  const maxFun = maxArrayLengthValidator(2);
  const actual = await maxFun([42, 1337, 80]);
  const expected = false;
  t.is(actual, expected);
});
