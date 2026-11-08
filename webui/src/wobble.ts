/**
 * The wobble.
 *
 * A hidden gesture on the About page: tap the app icon ten times and the whole
 * interface starts breathing — every element scaled on two axes by sine waves a
 * quarter-period apart, 25% deep, 500ms a cycle. The two phases are what make it
 * look like it is swaying rather than pulsing uniformly.
 *
 * The formula and the timings come from a Plants vs Zombies mod that does this
 * to the game's widgets; the effect is the same idea applied to a web page.
 */

const TAPS_REQUIRED = 10
/** How long a tap run is remembered, in ms. Ten taps spread over a minute are not a gesture. */
const TAP_WINDOW = 1500
const PERIOD_MS = 500
const AMPLITUDE = 0.25

export interface Wobble {
  /** Stop the animation and put the page back. */
  stop(): void
  readonly running: boolean
}

let active: Wobble | null = null

/** The two axis scales for a moment in time. Pure, so it can be checked. */
export function scalesAt(nowMs: number): { x: number; y: number } {
  const theta1 = ((nowMs % PERIOD_MS) / PERIOD_MS) * Math.PI * 2
  const theta2 = (((nowMs + PERIOD_MS / 2) % PERIOD_MS) / PERIOD_MS) * Math.PI * 2
  return {
    x: 1 + Math.sin(theta1) * AMPLITUDE,
    y: 1 + Math.sin(theta2) * AMPLITUDE,
  }
}

/**
 * Start the wobble.
 *
 * One transform on the root element rather than a class on every node: the whole
 * interface already shares a coordinate space, so scaling the container scales
 * all of it consistently and costs one style write per frame. `transform-origin`
 * is the centre so it grows from the middle instead of the corner.
 *
 * Stops on its own when the user asks, when the tab is hidden for a while, or
 * when they press Escape — an effect with no obvious way out is a bug.
 */
export function startWobble(doc: Document = document): Wobble {
  if (active?.running) return active

  const root = doc.documentElement
  root.classList.add('okay-wobble')

  let frame = 0
  let stopped = false
  const startedAt = performance.now()

  const tick = () => {
    if (stopped) return
    const { x, y } = scalesAt(performance.now() - startedAt)
    root.style.setProperty('--okay-wobble-x', x.toFixed(4))
    root.style.setProperty('--okay-wobble-y', y.toFixed(4))
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)

  const stop = () => {
    if (stopped) return
    stopped = true
    cancelAnimationFrame(frame)
    root.classList.remove('okay-wobble')
    root.style.removeProperty('--okay-wobble-x')
    root.style.removeProperty('--okay-wobble-y')
    doc.removeEventListener('keydown', onKey)
    active = null
  }
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') stop()
  }
  doc.addEventListener('keydown', onKey)

  active = {
    stop,
    get running() { return !stopped },
  }
  return active
}

export function wobbleRunning(): boolean {
  return !!active?.running
}

/**
 * Count taps on an element and fire once the count is reached.
 *
 * Returns a disposer. The count resets after a pause, so clicking the icon twice
 * a day for a week is not a gesture — the whole point of a hidden trigger is
 * that you have to mean it.
 */
export function installTapTrigger(
  target: HTMLElement,
  onTrigger: () => void,
  required = TAPS_REQUIRED,
  windowMs = TAP_WINDOW,
): () => void {
  let count = 0
  let lastAt = 0
  let timer: number | undefined

  const onClick = () => {
    const now = Date.now()
    if (now - lastAt > windowMs) count = 0
    lastAt = now
    count += 1
    if (timer) window.clearTimeout(timer)
    // Visible only in the last stretch: a progress bar for a secret is not a
    // secret. Two taps left is when a small nudge is welcome.
    if (required - count <= 2 && count < required) {
      target.dataset.secretHint = String(required - count)
    } else {
      delete target.dataset.secretHint
    }
    timer = window.setTimeout(() => {
      count = 0
      delete target.dataset.secretHint
    }, windowMs)
    if (count >= required) {
      count = 0
      delete target.dataset.secretHint
      onTrigger()
    }
  }

  target.addEventListener('click', onClick)
  return () => {
    target.removeEventListener('click', onClick)
    if (timer) window.clearTimeout(timer)
  }
}

/**
 * The music that plays with the wobble.
 *
 * An `<audio>` element rather than the Web Audio synthesiser this started as:
 * the track is a fixed file, and streaming it lets the browser handle buffering
 * and range requests instead of loading seven megabytes into memory first.
 *
 * `okayWobbleTune` is set by whoever ships the sound; with it unset the effect
 * still runs, silently, which is the right failure for a joke.
 */
export class WobbleTune {
  private element: HTMLAudioElement | null = null
  private failed = false

  constructor(private readonly source: string) { }

  start(): void {
    if (this.failed) return
    if (!this.element) {
      const audio = new Audio()
      audio.loop = true
      audio.preload = 'none'
      // The volume is deliberately low: this is an easter egg, not a soundtrack.
      audio.volume = 0.35
      audio.addEventListener('error', () => {
        // A blocked or unreachable URL must not take the effect down with it.
        this.failed = true
        this.element = null
      }, { once: true })
      audio.src = this.source
      this.element = audio
    }
    // A rejected play() is the autoplay policy refusing a programmatic start;
    // the tap that triggered this counts as a gesture, so it should not happen,
    // but a promise rejection here would surface as an unhandled error.
    void this.element.play().catch(() => { })
  }

  stop(): void {
    if (!this.element) return
    try {
      this.element.pause()
      this.element.currentTime = 0
    } catch {
    }
  }

  get running(): boolean {
    return !!this.element && !this.element.paused
  }
}

/**
 * The track, served from the app itself.
 *
 * Downloaded rather than hot-linked: the effect is a joke, and a joke that
 * depends on a third-party host staying up (and on the Content-Security-Policy
 * opening an exception for it) is a broken joke. It sits in `public/sfx`, so it
 * is served from the same origin as everything else and works offline.
 */
export const WOBBLE_TRACK = '/sfx/wobble.mp3'
