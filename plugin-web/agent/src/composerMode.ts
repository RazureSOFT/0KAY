/**
 * What the user types while the agent is already working.
 *
 * Two different things share one input box:
 *
 *   - the message that starts the next turn, which waits in this tab until the
 *     current run ends (`queuedMessages`), and
 *   - the amendment to the run in flight, which goes to the agent now and is
 *     applied at its next tool boundary (`steer`).
 *
 * They were two separate rows above the textarea, so the box looked like it had
 * two personalities: one line said "queued, the agent will pick this up" and the
 * other silently did something else. The rule that makes it one control is the
 * one below — while a run is in flight, what you type is an amendment; when
 * nothing is running, it is the next message. The label in the box says which.
 *
 * The queue the agent holds is the source of truth for the second kind. This
 * module only decides what a send means; the list itself comes back from the
 * executor after every call, because another window or the drain may have moved
 * it since this tab last looked.
 */

import type { SteerEntry, SteerReply } from './store';

/** Where a send would land right now. */
export type ComposerMode = 'idle' | 'steer';

export function composerMode(running: boolean): ComposerMode {
  return running ? 'steer' : 'idle';
}

/**
 * The placeholder the box should show.
 *
 * It has to name the consequence, not just the state: "the agent is busy" leaves
 * the reader guessing whether their text is refused, queued, or inserted mid
 * turn. "Applies after the current step" is the whole contract in one clause.
 */
export function composerPlaceholder(mode: ComposerMode, strings: {
  idle: string;
  steer: string;
  closed: string;
  archived?: boolean;
}): string {
  if (strings.archived) return strings.closed;
  return mode === 'steer' ? strings.steer : strings.idle;
}

/**
 * Whether the send button should do anything.
 *
 * A steer needs text only. The idle path also needs somewhere to put it: a
 * conversation that is archived takes neither.
 */
export function canSend(mode: ComposerMode, text: string, options: { busy: boolean; archived: boolean; attachments: number }): boolean {
  if (options.busy || options.archived) return false;
  if (!text.trim() && !options.attachments) return false;
  return mode !== 'steer' || !!text.trim();
}

/**
 * What the strip above the box lists.
 *
 * Steering entries come first because they are the ones with a deadline: they
 * are delivered at the next tool boundary, so they are the only ones where
 * "remove" still means something. Messages waiting for the next turn are second
 * and are numbered, because their order is their meaning.
 */
export interface QueuedRow {
  key: string;
  kind: 'steer' | 'next';
  /** 1-based position within its own kind, or empty for a steering entry. */
  n: string;
  text: string;
  /** Present for a steering entry, so it can be withdrawn. */
  id?: string;
}

export function queuedRows(steer: SteerEntry[], next: string[]): QueuedRow[] {
  const rows: QueuedRow[] = [];
  for (const entry of steer) {
    rows.push({ key: `steer:${entry.id}`, kind: 'steer', n: '', text: entry.text, id: entry.id });
  }
  next.forEach((text, index) => {
    rows.push({ key: `next:${index}`, kind: 'next', n: String(index + 1), text });
  });
  return rows;
}

/** Entries the executor no longer holds, so the strip can stop claiming them. */
export function deliveredIds(before: SteerEntry[], after: SteerEntry[]): string[] {
  const live = new Set(after.map((entry) => entry.id));
  return before.filter((entry) => !live.has(entry.id)).map((entry) => entry.id);
}

/**
 * One shape for every steer reply.
 *
 * An older executor answers a status read with `pending` as a *count* and the
 * entries in `list`; current ones put the array straight in `pending`. Reading
 * only `pending` therefore turned a visible strip into `[]` on the next poll,
 * a second after the instruction had been accepted. Accept both shapes, and
 * keep the count separate so callers that display a number still get one.
 */
export function steerReply(body: string): SteerReply {
  let raw: Record<string, any> = {};
  try { raw = JSON.parse(body); } catch { return { queued: 0, pending: [] }; }
  const pending: SteerEntry[] = Array.isArray(raw.pending)
    ? raw.pending
    : (Array.isArray(raw.list) ? raw.list : []);
  return {
    queued: typeof raw.queued === 'number' ? raw.queued : pending.length,
    pending,
    id: raw.id,
    removed: raw.removed,
    reason: raw.reason,
  };
}