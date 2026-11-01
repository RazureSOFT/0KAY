/**
 * Letting the model drive her face.
 *
 * The reply is plain text, so the only way for "her" to decide on an expression is
 * a directive inside that text: `[[expr:smile]]`, `[[motion:tap_body]]`,
 * `[[mood:happy]]`. The directives are stripped before the text is shown, so the
 * user never sees the plumbing.
 *
 * Keeping the protocol this small is deliberate. Anything richer (blend weights,
 * per-part params) would need the model to know Live2D internals, and a wrong name
 * would silently do nothing — a bare name either exists in the model or does not.
 */

export type Live2DCommand =
  | { kind: 'expression'; name: string }
  | { kind: 'motion'; group: string; index?: number }
  | { kind: 'mood'; name: string }

/** `[[expr:smile]]`, `[[motion:tapBody]]`, `[[motion:tapBody:0]]`, `[[mood:happy]]` */
const DIRECTIVE = /\[\[\s*(expr|expression|motion|mood)\s*:\s*([^\]:\s]+)(?:\s*:\s*(\d{1,3}))?\s*\]\]/gi

export function parseLive2DDirectives(text: string): { text: string; commands: Live2DCommand[] } {
  const commands: Live2DCommand[] = []
  const cleaned = String(text || '').replace(DIRECTIVE, (_match, kind: string, name: string, index?: string) => {
    const key = kind.toLowerCase()
    if (key === 'motion') {
      commands.push({ kind: 'motion', group: name, ...(index ? { index: Number(index) } : {}) })
    } else if (key === 'mood') {
      commands.push({ kind: 'mood', name })
    } else {
      commands.push({ kind: 'expression', name })
    }
    return ''
  })
  return { text: cleaned.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim(), commands }
}

type Live2DHandle = {
  expression?: (name?: string) => void
  motion?: (group?: string, index?: number) => void
  speak?: (text: string) => void
}

function handle(): Live2DHandle | null {
  if (typeof window === 'undefined') return null
  return (window as unknown as { __0KAY_LIVE2D__?: Live2DHandle }).__0KAY_LIVE2D__ || null
}

/**
 * Apply the directives that came out of a reply.
 *
 * Failures are swallowed on purpose: a model without that expression should look
 * neutral, not break the conversation.
 */
export function applyLive2DCommands(commands: Live2DCommand[]): void {
  const api = handle()
  for (const command of commands) {
    try {
      if (command.kind === 'expression') api?.expression?.(command.name)
      else if (command.kind === 'motion') api?.motion?.(command.group, command.index)
      else if (command.kind === 'mood' && typeof window !== 'undefined') {
        // Mood drives the accent colour and the CSS-var mood elsewhere in the UI;
        // announce it rather than poking at another store from here.
        window.dispatchEvent(new CustomEvent('0kay:mood', { detail: { mood: command.name } }))
      }
    } catch { /* a missing expression is not an error worth surfacing */ }
  }
}

/** Strip the directives, then perform them. Returns the text meant for the user. */
export function driveLive2DFromReply(text: string): string {
  const { text: cleaned, commands } = parseLive2DDirectives(text)
  if (commands.length) applyLive2DCommands(commands)
  return cleaned
}

/**
 * What the user sees when they poke her.
 *
 * Short and physical: the point of the tap is that it is not a question, so the
 * reply should be a reaction rather than an answer.
 */
export const POKE_PROMPT =
  'The user just poked your cheek. React in one or two short sentences, and add one expression directive.'
