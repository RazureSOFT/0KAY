/**
 * 串行队列测试：确保同一时刻只有一个任务在跑，且前一个失败不会卡住后面。
 *
 * 背景：DeepSeek 不允许并发朗读会话（实测 4 并发有 2 个被 1006 断掉），
 * 合成请求必须从这里排队。
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createSerialQueue } from '../src/serial.mjs';

const tick = (ms) => new Promise((r) => setTimeout(r, ms));

test('并发入队也只有一个在跑', async () => {
  const enqueue = createSerialQueue();
  let active = 0;
  let maxActive = 0;
  const run = (i) =>
    enqueue(async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await tick(15);
      active--;
      return i;
    });

  const results = await Promise.all([0, 1, 2, 3, 4].map(run));
  assert.equal(maxActive, 1, '同时最多只能有一个任务在跑');
  assert.deepEqual(results, [0, 1, 2, 3, 4], '结果按入队顺序返回');
});

test('前一个失败不会卡住后面的', async () => {
  const enqueue = createSerialQueue();
  const order = [];
  enqueue(async () => {
    order.push('a-start');
    throw new Error('boom');
  }).catch(() => order.push('a-fail'));
  await enqueue(async () => order.push('b'));
  await enqueue(async () => order.push('c'));
  assert.deepEqual(order, ['a-start', 'a-fail', 'b', 'c']);
});

test('enqueue 返回的就是任务本身的 promise', async () => {
  const enqueue = createSerialQueue();
  const value = await enqueue(async () => 42);
  assert.equal(value, 42);
  await assert.rejects(() => enqueue(async () => { throw new Error('nope'); }), /nope/);
});
