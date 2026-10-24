export interface MediaChoice {
  voice?: boolean
  selfie?: string
  call?: boolean
}

export const MEDIA_MARKER_RE = /\[\[\s*(voice|call)\s*\]\]|\[\[\s*selfie\s*:\s*([^\]]*?)\s*\]\]/gi

export const MEDIA_MARKER_STRIP_RE = /\[\[\s*(?:voice|call)\s*\]\]|\[\[\s*selfie\s*:[^\]]*?\]\]/gi

// tags the character hides in its own sentence. strip them before the bubble
// renders, or the user reads "[[selfie:x]]" and thinks the model broke.
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
  // trailing whitespace only: the tag is usually glued to the last word,
  // and trimming the whole string eats a deliberate pause.
  const cleaned = source.replace(MEDIA_MARKER_STRIP_RE, '').replace(/\s+$/, '')
  return { media, cleaned }
}
