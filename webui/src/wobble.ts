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
 * A short loop to go with the wobble.
 *
 * Synthesised rather than shipped as a file: the soundtrack is a joke, it has to
 * be the same on every install, and a megabyte of audio in the bundle for a
 * hidden effect is a bad trade. Two voices, a walking bass and a bright arpeggio,
 * in the key the effect's bounce suggests.
 */
export class WobbleTune {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private timer: number | undefined
  private step = 0
  private playing = false

  /** Semitone offsets, -1 for a rest. */
  private readonly lead = [0, 4, 7, 12, 7, 4, 0, -1, 2, 5, 9, 14, 9, 5, 2, -1]
  private readonly bass = [-12, -12, -5, -5, -8, -8, -10, -10]

  private readonly stepMs = 150
  private readonly root = 261.63 // C4

  start(): void {
    if (this.playing) return
    const Ctor = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined
    if (!Ctor) return
    try {
      this.context = this.context || new Ctor()
      this.master = this.context.createGain()
      this.master.gain.value = 0.16
      this.master.connect(this.context.destination)
      void this.context.resume()
      this.playing = true
      this.step = 0
      this.tick()
      this.timer = window.setInterval(() => this.tick(), this.stepMs)
    } catch {
      // A browser that refuses an AudioContext (no gesture, no device) simply
      // gets no music; the wobble still works.
    }
  }

  private frequency(semitone: number): number {
    return this.root * Math.pow(2, semitone / 12)
  }

  private tick(): void {
    if (!this.context || !this.master) return
    const lead = this.lead[this.step % this.lead.length]
    const bass = this.bass[this.step % this.bass.length]
    if (lead >= 0) this.blip(this.frequency(lead + 12), 'triangle', 0.09)
    if (this.step % 2 === 0) this.blip(this.frequency(bass), 'sine', 0.16)
    this.step += 1
  }

  private blip(freq: number, type: OscillatorType, level: number): void {
    const context = this.context!
    const master = this.master!
    const osc = context.createOscillator()
    const gain = context.createGain()
    const now = context.currentTime
    osc.type = type
    osc.frequency.value = freq
    // A short pluck: quick attack, exponential decay. Anything with a sustained
    // level turns a joke into a drone.
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(level, now + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
    osc.connect(gain)
    gain.connect(master)
    osc.start(now)
    osc.stop(now + 0.24)
  }

  stop(): void {
    this.playing = false
    if (this.timer) window.clearInterval(this.timer)
    this.timer = undefined
    try {
      this.master?.disconnect()
      void this.context?.close()
    } catch {
    }
    this.master = null
    this.context = null
  }

  get running(): boolean {
    return this.playing
  }
}
