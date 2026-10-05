/**
 * Single source of truth for turning raw emotion axes into a mood key/colour.
 *
 * Both the status store and the message bubbles render the same emotion, so the
 * thresholds and palette must not drift apart. Labels are resolved with the
 * host i18n (`emotion.<mood>`), never hardcoded here.
 */
export interface EmotionLike {
  valence: number
  irritation: number
}

export type EmotionMood = 'happy' | 'sad' | 'irritated' | 'neutral'

/** Map the raw valence/irritation axes onto a mood key. */
export function emotionMoodOf(emotion: EmotionLike): EmotionMood {
  if (emotion.irritation > 0.7) return 'irritated'
  if (emotion.valence > 0.5) return 'happy'
  if (emotion.valence < -0.3) return 'sad'
  return 'neutral'
}

const MOOD_COLOR: Record<EmotionMood, string> = {
  happy: '#107c10',
  sad: '#0078d4',
  irritated: '#d13438',
  neutral: '#8a8886',
}

export function emotionMoodColor(mood: EmotionMood): string {
  return MOOD_COLOR[mood]
}
