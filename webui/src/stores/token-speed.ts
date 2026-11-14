// Tokens per second, for the line under the composer.
//
// Two numbers already arrive from the backend and neither is enough on its
// own. `completion_tokens` is the count for the turn, but a count with no time
// is a size, not a speed. The stream itself carries the timing, but only while
// it is running. This module keeps both and decides what the line can honestly
// say at each moment.
//
// The distinction that matters: a rate measured while text is still arriving is
// an *estimate* (the model may be about to emit a long tool call, or stop), and
// a rate computed from a settled turn is a fact. The line says which one it is
// rather than presenting a guess with the same confidence as a measurement.

export interface TokenRate {
  /** Text that has arrived, in characters. Streamed text has no token count yet. */
  chars: number
  /** Tokens the provider reported for the finished turn, if it did. */
  completionTokens?: number
  /** When the request left, ms since epoch. */
  startedAt: number
  /** When it settled (or now, while streaming), ms since epoch. */
  endedAt: number
}

/**
 * Characters per token, for turning a partial character count into a partial
 * token count.
 *
 * ~4 is the usual rule for English, and it is wrong for Chinese (closer to 1
 * per character). Rather than pick one and be confidently wrong in one
 * language, the estimate is deliberately marked as one — see `isEstimate` —
 * and this constant only sets the order of magnitude.
 */
export const CHARS_PER_TOKEN = 3

export interface TokenSpeed {
  /** Tokens per second, or null when there is not yet enough to say anything. */
  perSecond: number | null
  /** Tokens in the turn: reported when the provider said so, estimated otherwise. */
  tokens: number | null
  /** True when the number is derived from characters and elapsed streaming time. */
  estimated: boolean
}

export function tokenSpeed(rate: TokenRate): TokenSpeed {
  const elapsedMs = rate.endedAt - rate.startedAt

  // A rate needs a real span. Three things make the quotient meaningless
  // rather than merely noisy: no time at all, a clock that went backwards
  // (system sleep, a mocked timer), and a provider that reported zero tokens.
  if (elapsedMs <= 0) return { perSecond: null, tokens: rate.completionTokens ?? null, estimated: false }

  const seconds = elapsedMs / 1000
  const reported = rate.completionTokens

  if (typeof reported === 'number' && reported > 0) {
    return { perSecond: round(reported / seconds), tokens: reported, estimated: false }
  }

  // Nothing reported yet: estimate from characters so a long stream shows a
  // live rate, flagged as an estimate so the line can say so.
  if (rate.chars > 0) {
    const tokens = Math.round(rate.chars / CHARS_PER_TOKEN)
    if (tokens <= 0) return { perSecond: null, tokens: null, estimated: true }
    return { perSecond: round(tokens / seconds), tokens, estimated: true }
  }

  return { perSecond: null, tokens: null, estimated: false }
}

function round(value: number): number {
  // One decimal is the useful precision: "38.4 tok/s" reads as a measurement,
  // "38.4137" reads as false confidence.
  return Math.round(value * 10) / 10
}

/** Format for the line under the composer. */
export function formatSpeed(speed: TokenSpeed): string {
  if (speed.perSecond === null || speed.tokens === null) return ''
  const approximate = speed.estimated ? '~' : ''
  return `${approximate}${speed.perSecond} tok/s · ${approximate}${speed.tokens} tok`
}
