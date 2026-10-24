export interface EmotionLike {
  valence: number
  irritation: number
}

export type EmotionMood = 'happy' | 'sad' | 'irritated' | 'neutral'

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
