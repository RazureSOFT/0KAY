/**
 * Media tags the character can attach to a reply.
 *
 * LIFE's OUTPUT stage is told it may end a sentence with `[[voice]]`,
 * `[[selfie:在咖啡馆，刚洗完头]]` or `[[call]]`. They are parsed out of the
 * visible text exactly like the Live2D `[[motion:…]]` tags — the user never sees
 * them — and turned into structured data the chat store acts on.
 *
 * Kept out of the store so it can be unit-tested without pinia, and so the
 * LIFE-side tag names (life/src/life/media.py) have one obvious counterpart.
 */

export interface MediaChoice {
  voice?: boolean
  selfie?: string
  call?: boolean
}

/** `[[voice]]` / `[[call]]` / `[[selfie:…]]`, case-insensitive, whitespace tolerant. */
export const MEDIA_MARKER_RE = /\[\[\s*(voice|call)\s*\]\]|\[\[\s*selfie\s*:\s*([^\]]*?)\s*\]\]/gi

/** The same three, for stripping them out of the rendered text. */
export const MEDIA_MARKER_STRIP_RE = /\[\[\s*(?:voice|call)\s*\]\]|\[\[\s*selfie\s*:[^\]]*?\]\]/gi

/**
 * Read the media tags out of `text`.
 *
 * Later tags win over earlier ones for the same kind (a re-run that changes its
 * mind about the scene description should not keep the first prompt), and a
 * `[[selfie:]]` with an empty description is ignored rather than sent to the
 * image backend as "draw nothing".
 */
export function parseMedia(text: string): { media: MediaChoice; cleaned: string } {
  const source = text || ''
  const media: MediaChoice = {}
  if (!source.includes('[[')) return { media, cleaned: source }
  MEDIA_MARKER_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = MEDIA_MARKER_RE.exec(source))) {
    if (match[1] === 'voice') media.voice = true
    else if (match[1] === 'call') media.call = true
    else if (match[2] !== undefined && match[2].trim()) media.selfie = match[2].trim()
  }
  const cleaned = source.replace(MEDIA_MARKER_STRIP_RE, '').replace(/\s+$/, '')
  return { media, cleaned }
}
