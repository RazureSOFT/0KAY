import { describe, expect, it } from 'vitest'
import { canSend, composerMode, composerPlaceholder, deliveredIds, queuedRows, steerReply } from './composerMode'

/**
 * One input box, two jobs.
 *
 * While a run is in flight the box is an amendment to the run; when nothing is
 * running it is the next message. The bug was that these were two stacked rows —
 * a "say something while it works" line above the textarea — so the box had two
 * personalities and the user had to know which one to use. This pins the rule
 * that replaced them: the mode follows the run, and the placeholder names the
 * consequence.
 */
describe('composer mode', () => {
  it('steers while a run is in flight', () => {
    expect(composerMode(true)).toBe('steer')
  })

  it('starts the next turn when nothing is running', () => {
    expect(composerMode(false)).toBe('idle')
  })

  it('says the amendment lands after the current step, not that the agent is busy', () => {
    const placeholder = composerPlaceholder('steer', { idle: 'Message the agent…', steer: 'after the current step', closed: 'restore' })
    expect(placeholder).toBe('after the current step')
  })

  it('falls back to the idle placeholder once the run ends', () => {
    expect(composerPlaceholder('idle', { idle: 'Message the agent…', steer: 'after the current step', closed: 'restore' })).toBe('Message the agent…')
  })

  it('shows the restore copy instead of either mode in an archived conversation', () => {
    expect(composerPlaceholder('steer', { idle: 'a', steer: 'b', closed: 'restore', archived: true })).toBe('restore')
  })
})

describe('send gating', () => {
  const open = { busy: false, archived: false, attachments: 0 }

  it('will not steer an empty line', () => {
    expect(canSend('steer', '   ', open)).toBe(false)
  })

  it('steers text', () => {
    expect(canSend('steer', 'also update the docs', open)).toBe(true)
  })

  it('refuses both kinds while a request of its own is in flight', () => {
    expect(canSend('idle', 'hello', { ...open, busy: true })).toBe(false)
  })

  it('lets an attachment alone start a turn', () => {
    expect(canSend('idle', '', { ...open, attachments: 1 })).toBe(true)
  })

  it('refuses to send into an archived conversation', () => {
    expect(canSend('idle', 'hello', { ...open, archived: true })).toBe(false)
  })
})

describe('the queue strip', () => {
  it('puts the withdrawable entries first and numbers the rest separately', () => {
    const rows = queuedRows(
      [{ id: 'steer_1', text: 'also the docs' }],
      ['next one', 'next two'],
    )
    expect(rows.map((row) => `${row.kind}:${row.n}`)).toEqual(['steer:', 'next:1', 'next:2'])
  })

  it('gives every row a key that survives a removal', () => {
    const rows = queuedRows([{ id: 'steer_1', text: 'a' }, { id: 'steer_2', text: 'b' }], [])
    expect(rows.map((row) => row.key)).toEqual(['steer:steer_1', 'steer:steer_2'])
  })

  it('keeps the steering id so the row can be withdrawn', () => {
    expect(queuedRows([{ id: 'steer_9', text: 'a' }], [])[0].id).toBe('steer_9')
  })

  it('reports which entries the agent has since delivered', () => {
    expect(deliveredIds(
      [{ id: 'a', text: '1' }, { id: 'b', text: '2' }],
      [{ id: 'b', text: '2' }],
    )).toEqual(['a'])
  })

  it('reports nothing when the drain took everything', () => {
    expect(deliveredIds([{ id: 'a', text: '1' }], [])).toEqual(['a'])
  })
})

// The status read and the write used to disagree about what `pending` is. The
// strip is refreshed from the status read, so a numeric `pending` there silently
// erased every row a moment after it appeared.
describe('steer reply shapes', () => {
  const entry = { id: 'steer_1', text: 'also the docs' }

  it('reads the current shape, where pending is the list', () => {
    const reply = steerReply(JSON.stringify({ pending: [entry], queued: 1, ok: true }))
    expect(reply.pending).toEqual([entry])
    expect(reply.queued).toBe(1)
  })

  it('falls back to `list` when an older executor returns a count in pending', () => {
    const reply = steerReply(JSON.stringify({ pending: 1, queued: 1, list: [entry], active: ['t1'] }))
    expect(reply.pending).toEqual([entry])
    expect(reply.queued).toBe(1)
  })

  it('never invents entries from a count alone', () => {
    const reply = steerReply(JSON.stringify({ pending: 0 }))
    expect(reply.pending).toEqual([])
    expect(reply.queued).toBe(0)
  })

  it('survives a non-JSON reply', () => {
    expect(steerReply('not json').pending).toEqual([])
  })

  it('keeps the id of a just-created instruction', () => {
    expect(steerReply(JSON.stringify({ queued: 1, id: 'steer_7', pending: [entry] })).id).toBe('steer_7')
  })
})