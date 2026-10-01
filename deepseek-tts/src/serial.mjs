/**
 * 串行队列：把并发调用排成一条线依次执行。
 *
 * DeepSeek 的朗读会话不支持并发 —— 实测同时发 4 个合成请求，有 2 个被服务端
 * 1006 断掉、零帧（ticket 是会话级的一次性票，抢同一个账号的朗读通道）。
 * 所以所有合成请求都从这里过一道，保证同一时刻只有一个在跑。
 */
export function createSerialQueue() {
  let tail = Promise.resolve();
  return function enqueue(fn) {
    const run = tail.then(fn, fn);
    // 前一个失败也不能卡住后面的；这里只关心它结束没结束。
    tail = run.then(
      () => {},
      () => {},
    );
    return run;
  };
}
