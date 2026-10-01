/**
 * history_messages 形状测试。
 *
 * 2026-10 起服务端把正文从消息顶层的 content/text 挪进了 fragments[]，
 * 这里用一份真实的响应片段钉住解析：模型那条必须能被 pickMessage 认出来，
 * 否则 putText 会一直等、最后超时（表现就是「发到 DeepSeek 就没反应」）。
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { messageText, pickMessage, messageIdOf } from '../src/deepseek/session.mjs';

const USER = {
  message_id: 1,
  parent_id: null,
  role: 'USER',
  fragments: [
    {
      id: 1,
      type: 'REQUEST',
      content: '请把下面这段文字原样输出一遍，不要翻译、不要总结、不要解释、不要加引号或任何前后缀，一个字都不要改：\n\n你好，世界。这是一段测试。',
    },
  ],
};

const ASSISTANT = {
  message_id: 2,
  parent_id: 1,
  role: 'ASSISTANT',
  fragments: [{ id: 2, type: 'RESPONSE', content: '你好，世界。这是一段测试。', references: [], stage_id: 1 }],
};

test('从 fragments[].content 取正文（RESPONSE）', () => {
  assert.equal(messageText(ASSISTANT), '你好，世界。这是一段测试。');
});

test('从 fragments[].content 取正文（REQUEST）', () => {
  assert.match(messageText(USER), /你好，世界。这是一段测试。/);
});

test('优先正文片段，跳过思考/搜索片段', () => {
  const withThink = {
    role: 'ASSISTANT',
    fragments: [
      { type: 'THINK', content: '让我想一想……' },
      { type: 'SEARCH', content: '一些搜索结果' },
      { type: 'RESPONSE', content: '真正的回答' },
    ],
  };
  assert.equal(messageText(withThink), '真正的回答');
});

test('多个 RESPONSE 片段按顺序拼接（断点续写）', () => {
  const multi = {
    role: 'ASSISTANT',
    fragments: [
      { type: 'RESPONSE', content: '前半段，' },
      { type: 'RESPONSE', content: '后半段。' },
    ],
  };
  assert.equal(messageText(multi), '前半段，后半段。');
});

test('旧形状（顶层 content / text）仍然认', () => {
  assert.equal(messageText({ role: 'ASSISTANT', content: '老格式' }), '老格式');
  assert.equal(messageText({ role: 'ASSISTANT', text: '老格式2' }), '老格式2');
  assert.equal(messageText({}), '');
});

test('pickMessage 在有 fragments 的会话里挑出模型那条，不把提示语当回复', () => {
  const prompt = USER.fragments[0].content;
  const picked = pickMessage([USER, ASSISTANT], { prompt });
  assert.ok(picked, '应该挑到模型回复');
  assert.equal(messageIdOf(picked), 2);
  assert.equal(messageText(picked), '你好，世界。这是一段测试。');
});
