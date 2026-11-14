// Attachment references in a prompt.
//
// An attachment used to be invisible once it was sent: the bubble showed a
// thumbnail, the model got the bytes, and the text said nothing about either.
// A reference makes the link explicit and addressable — the prompt names the
// attachment, the UI turns that name into a chip with a preview on hover, and
// the transcript can be read back without the images.
//
// Grammar (chosen to survive a round trip through markdown and a shell):
//
//   @image#1:QQ_1794607548806.png   an uploaded image, by index and file name
//   @file#2:report.pdf              an uploaded file, by index and file name
//   @//file/path/to/thing.ts        a path that already exists on the machine
//
// The index is 1-based and refers to the order the attachment appears in the
// message, so two files with the same name stay distinguishable. The name is
// kept because a person reading the raw text cannot resolve "#1".

export type RefKind = 'image' | 'file' | 'path'

export interface AttachmentRef {
  kind: RefKind
  /** 1-based position among the message's attachments; 0 for an on-disk path. */
  index: number
  /** File name for uploads, path for `@//file/` references. */
  target: string
  /** The exact text that was matched, so a caller can rewrite it in place. */
  raw: string
}

// Uploaded attachment: `@image#1:name.png` / `@file#2:notes.txt`.
// The name is greedy up to whitespace so a path-like upload keeps its slashes,
// and the whole thing is anchored to a boundary so `a@b.com` is not a mention.
const UPLOAD_RE = /(^|[\s([<{])@(image|file)#(\d+):([^\s)\]}>,;]+)/g

// On-disk path: `@//file/relative/or/absolute/path`.
// Trailing punctuation is excluded so `see @//file/a.ts.` does not swallow the
// sentence's full stop.
const PATH_RE = /(^|[\s([<{])@\/\/file\/([^\s)\]}>,;]+)/g

function trimTrailingPunctuation(value: string): string {
  // A file name legitimately ends with these only when quoted, which the
  // grammar does not offer, so stripping is the behaviour people expect.
  return value.replace(/[.,;:!?]+$/, '')
}

export function parseRefs(text: string): AttachmentRef[] {
  const source = text || ''
  if (!source.includes('@')) return []
  const found: Array<AttachmentRef & { at: number }> = []

  UPLOAD_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = UPLOAD_RE.exec(source))) {
    const target = trimTrailingPunctuation(match[4])
    // The index is 1-based; `#0` names nothing, so it is not a reference.
    if (!target || Number(match[3]) < 1) continue
    found.push({
      kind: match[2] === 'image' ? 'image' : 'file',
      index: Number(match[3]),
      target,
      raw: `@${match[2]}#${match[3]}:${target}`,
      at: match.index + match[1].length,
    })
  }

  PATH_RE.lastIndex = 0
  while ((match = PATH_RE.exec(source))) {
    const target = trimTrailingPunctuation(match[2])
    if (!target) continue
    found.push({
      kind: 'path',
      index: 0,
      target,
      raw: `@//file/${target}`,
      at: match.index + match[1].length,
    })
  }

  return found.sort((a, b) => a.at - b.at).map(({ at: _at, ...rest }) => rest)
}

/**
 * Resolve each reference against the message's attachments.
 *
 * `images` and `files` are the arrays the composer already keeps, so index N
 * means the Nth entry of the matching array. A reference that resolves to
 * nothing is reported as unresolved rather than dropped: the UI needs to say
 * "this names a file that is not attached" instead of silently rendering the
 * raw text as if it were intended.
 */
export function resolveRefs(
  refs: AttachmentRef[],
  images: string[],
  files: Array<{ name: string; url: string }>,
): Array<AttachmentRef & { url?: string; resolved: boolean }> {
  return refs.map((ref) => {
    if (ref.kind === 'path') return { ...ref, resolved: true }
    const pool = ref.kind === 'image' ? images : files
    const entry = ref.index >= 1 && ref.index <= pool.length ? pool[ref.index - 1] : undefined
    if (entry === undefined) return { ...ref, resolved: false }
    const url = typeof entry === 'string' ? entry : entry.url
    return { ...ref, url, resolved: true }
  })
}

/** The next index to hand out for a kind, given what is already attached. */
export function nextIndex(pool: string[] | Array<unknown>): number {
  return pool.length + 1
}

/** Build the text the composer inserts when an attachment is added. */
export function refFor(kind: 'image' | 'file', index: number, name: string): string {
  return `@${kind}#${index}:${name}`
}

/**
 * The body sent to the model.
 *
 * The references stay in the text — they are what tells the model the
 * attachment exists and what it is called — but unresolved ones are annotated
 * so a stale reference cannot be mistaken for a real attachment.
 */
export function refsForModel(text: string, images: string[], files: Array<{ name: string; url: string }>): string {
  const refs = resolveRefs(parseRefs(text), images, files)
  const unresolved = refs.filter((ref) => !ref.resolved)
  if (!unresolved.length) return text
  const note = unresolved.map((ref) => ref.raw).join(', ')
  return `${text}\n\n(Note: ${note} ${unresolved.length === 1 ? 'does' : 'do'} not match an attachment in this message.)`
}
