import { describe, expect, test } from 'vitest'
import { latestPlan, parsePlan } from './plan-card'

const record = (over: Record<string, unknown> = {}) =>
  JSON.stringify({ title: 'Add the /ide route', markdown: '# Problem\n\nNo IDE.\n\n1. Add the route', steps: 3, ...over })

describe('parsePlan', () => {
  test('reads a plan written by the agent', () => {
    const plan = parsePlan(record())
    expect(plan).toEqual({ title: 'Add the /ide route', markdown: '# Problem\n\nNo IDE.\n\n1. Add the route', steps: 3 })
  })

  test('keeps a demo page when there is one', () => {
    const plan = parsePlan(record({ demo_html: '<!doctype html><p>hi</p>' }))
    expect(plan?.demoHtml).toBe('<!doctype html><p>hi</p>')
  })

  test('omits the demo rather than storing an empty string', () => {
    expect(parsePlan(record({ demo_html: '' }))?.demoHtml).toBeUndefined()
  })

  test('a malformed record is no plan, not a crash', () => {
    expect(parsePlan('{not json')).toBeNull()
    expect(parsePlan('')).toBeNull()
    expect(parsePlan(undefined)).toBeNull()
  })

  test('a JSON value that is not an object is refused', () => {
    expect(parsePlan('"just a string"')).toBeNull()
    expect(parsePlan('42')).toBeNull()
    expect(parsePlan('null')).toBeNull()
  })

  test('a plan with no body is refused — an empty card would build nothing', () => {
    expect(parsePlan(JSON.stringify({ title: 'x', markdown: '   ' }))).toBeNull()
    expect(parsePlan(JSON.stringify({ title: 'x' }))).toBeNull()
  })

  test('a missing title falls back to an empty string, not "undefined"', () => {
    expect(parsePlan(JSON.stringify({ markdown: '# Something' }))?.title).toBe('')
  })

  test('a non-numeric step count becomes 0 instead of NaN', () => {
    expect(parsePlan(record({ steps: 'many' }))?.steps).toBe(0)
    expect(parsePlan(JSON.stringify({ markdown: '# x' }))?.steps).toBe(0)
  })
})

describe('latestPlan', () => {
  test('picks the newest plan in the conversation', () => {
    const rows = [
      { plan: record({ title: 'old' }) },
      { result: 'no plan here' },
      { plan: record({ title: 'new' }) },
    ]
    expect(latestPlan(rows)?.title).toBe('new')
  })

  test('skips rows with no plan and rows with a broken one', () => {
    const rows = [{ plan: record({ title: 'good' }) }, { plan: '{broken' }, {}]
    expect(latestPlan(rows)?.title).toBe('good')
  })

  test('a conversation with no plan has none', () => {
    expect(latestPlan([])).toBeNull()
    expect(latestPlan([{ result: 'done' }, { plan: '' }])).toBeNull()
  })
})
