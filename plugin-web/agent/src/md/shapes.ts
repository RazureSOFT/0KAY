/**
 * The Material 3 shape library subset needed by the loading indicator, expressed as
 * polar radius functions.
 *
 * The M3 Expressive loading indicator is not a spinner. It is "a looping shape morph
 * sequence composed of seven unique Material 3 shapes", per the specification, and
 * the androidx implementation names them exactly (LoadingIndicatorDefaults
 * .IndeterminateIndicatorPolygons):
 *
 *   SoftBurst → Cookie9Sided → Pentagon → Pill → Sunny → Cookie4Sided → Oval
 *
 * Each shape in the real library is a `RoundedPolygon` — a polygon whose corners are
 * rounded by arcs, normalized into a unit box. Morphing between two of them means
 * interpolating the two outlines.
 *
 * **Why polar radius rather than path data.** Morphing real `d` strings needs the two
 * paths to have identical command structure, which rounded polygons of different
 * vertex counts do not. A `RoundedPolygon` is star-shaped about its centre, though,
 * so every shape here can be described as a single function r(θ) and sampled at the
 * same fixed angles. Interpolation then becomes a pairwise lerp of radii — exact,
 * cheap, and free of the "same number of segments" constraint. The cost is that very
 * sharp concave detail would be lost; none of these seven shapes has any.
 *
 * Corner rounding: the polygon functions below return an exact regular polygon.
 * `roundCorners` then applies a small windowed average over the samples, which is a
 * cheap approximation of arc-rounded corners. It is applied with a radius expressed
 * in samples, so the rounding is proportional to the outline rather than to the
 * point count.
 */

/** How many radii each shape is sampled to. Shared by every shape so lerp is trivial. */
export const SAMPLES = 240

/** Material's seven shapes for the indeterminate loading indicator, in order. */
export const MORPH_SEQUENCE = [
  'softBurst',
  'cookie9',
  'pentagon',
  'pill',
  'sunny',
  'cookie4',
  'oval',
] as const

export type ShapeName = (typeof MORPH_SEQUENCE)[number]

const TAU = Math.PI * 2

/** Exact radius of a regular n-gon at angle theta, circumradius 1. */
function polygonRadius(sides: number, theta: number): number {
  const step = TAU / sides
  // Fold theta into the first segment, then solve the triangle to the edge.
  const folded = ((theta % step) + step) % step
  return Math.cos(Math.PI / sides) / Math.cos(folded - step / 2)
}

/**
 * Ellipse radius at theta for semi-axes a and b.
 *
 * The polar form of an ellipse is r = ab / sqrt((b·cosθ)² + (a·sinθ)²). Using the
 * exact form rather than a scaled circle matters: a "pill" is an ellipse with a 2:1
 * axis ratio, and a scaled circle would read as a circle.
 */
function ellipseRadius(a: number, b: number, theta: number): number {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return (a * b) / Math.sqrt((b * c) ** 2 + (a * s) ** 2)
}

/**
 * A "cookie" edge: a polygon whose sides bulge outward and whose corners pinch inward,
 * which is what Material's cookie shapes look like.
 *
 * Implemented as the geometric mean of a polygon and its inscribed circle, modulated by
 * a deliberate inward pinch at the vertices. The mean is what keeps the bulge subtle —
 * a plain sine would read as a flower rather than as a cookie.
 */
function cookieRadius(sides: number, bulge: number, theta: number): number {
  const step = TAU / sides
  const folded = ((theta % step) + step) % step
  const atVertex = Math.pow(Math.cos((folded / step) * Math.PI), 2)
  // 1 at the vertex, 0 at the middle of a side.
  return 1 + bulge * (1 - atVertex) - bulge * 0.45 * atVertex
}

/**
 * A soft burst: broad rounded points rather than spikes.
 *
 * Material's SoftBurst is a star whose points are wide and whose valleys are shallow.
 * `cos^2`-shaped lobes give exactly that: the derivative is zero at both the tip and
 * the valley, so no corner forms and the outline never reads as a spike.
 */
function softBurstRadius(points: number, depth: number, theta: number): number {
  const lobe = 0.5 + 0.5 * Math.cos(points * theta)
  return 1 - depth + depth * 2 * lobe * lobe
}

/** A sunny shape: many even points with wide rounded tips. */
function sunnyRadius(points: number, depth: number, theta: number): number {
  return 1 - depth / 2 + (depth / 2) * Math.cos(points * theta)
}

/** Raw (unrounded) radius for a shape at an angle. */
function radiusAt(name: ShapeName, theta: number): number {
  switch (name) {
    case 'softBurst':
      return softBurstRadius(8, 0.13, theta)
    case 'cookie9':
      return cookieRadius(9, 0.075, theta)
    case 'pentagon':
      return polygonRadius(5, theta) * 0.98
    case 'pill':
      // A capsule: an ellipse with a 2:1 ratio, rotated so the long axis is vertical.
      return ellipseRadius(0.52, 1.0, theta)
    case 'sunny':
      return sunnyRadius(14, 0.14, theta)
    case 'cookie4':
      return cookieRadius(4, 0.10, theta)
    case 'oval':
      return ellipseRadius(0.74, 1.0, theta)
    default:
      return 1
  }
}

/**
 * Round the corners by averaging over a window.
 *
 * A regular polygon's vertex is a discontinuity in the derivative of r(θ); the
 * window average removes it, which is what makes the outline look arc-rounded. The
 * window is circular so the seam at θ=0 is smoothed like any other point.
 */
function roundCorners(values: number[], window: number): number[] {
  if (window < 2) return values
  const n = values.length
  const half = Math.floor(window / 2)
  const out = new Array<number>(n)
  for (let i = 0; i < n; i += 1) {
    let sum = 0
    for (let k = -half; k <= half; k += 1) sum += values[(i + k + n) % n]
    out[i] = sum / window
  }
  return out
}

/** Per-shape corner rounding, in samples of the 240-point ring. */
const ROUNDING: Record<ShapeName, number> = {
  softBurst: 3,
  cookie9: 3,
  pentagon: 9,
  pill: 3,
  sunny: 3,
  cookie4: 5,
  oval: 2,
}

/** Shape caches: sampling is pure, so each shape is computed once. */
const cache = new Map<ShapeName, Float32Array>()

/**
 * Sample a shape into `SAMPLES` radii, normalized so the largest radius is 1.
 *
 * Normalizing per shape is what keeps the morph from pulsing: without it, a pentagon
 * (circumradius 1) would appear larger than its inscribed neighbours, and the
 * indicator would visibly grow and shrink between shapes.
 */
export function sampleShape(name: ShapeName): Float32Array {
  const hit = cache.get(name)
  if (hit) return hit

  const raw: number[] = []
  for (let i = 0; i < SAMPLES; i += 1) {
    const theta = (i / SAMPLES) * TAU
    raw.push(radiusAt(name, theta))
  }
  const rounded = roundCorners(raw, ROUNDING[name])
  const peak = Math.max(...rounded)
  const out = new Float32Array(SAMPLES)
  for (let i = 0; i < SAMPLES; i += 1) out[i] = rounded[i] / peak
  cache.set(name, out)
  return out
}

/** Linear interpolation between two sampled outlines. */
export function lerpShape(a: Float32Array, b: Float32Array, t: number, out?: Float32Array): Float32Array {
  const result = out || new Float32Array(a.length)
  for (let i = 0; i < a.length; i += 1) result[i] = a[i] + (b[i] - a[i]) * t
  return result
}

/**
 * Build an SVG path for a sampled outline.
 *
 * Sized against the smaller of the two box dimensions so the shape stays inside its
 * container whatever the aspect ratio, and centred in it. Points are joined with
 * straight segments: at 240 samples the segments are under a pixel, so a curve would
 * add commands without adding smoothness.
 */
export function pathFromRadii(radii: Float32Array, size: number, inset = 0): string {
  const centre = size / 2
  const scale = centre - inset
  const parts: string[] = []
  for (let i = 0; i < radii.length; i += 1) {
    const theta = (i / radii.length) * TAU
    const r = radii[i] * scale
    // -π/2 puts sample 0 at the top, which makes the rotation direction readable.
    const x = centre + r * Math.cos(theta - Math.PI / 2)
    const y = centre + r * Math.sin(theta - Math.PI / 2)
    parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
  }
  parts.push('Z')
  return parts.join('')
}

/**
 * The spring used by the loading indicator's morph.
 *
 * androidx uses `spring(dampingRatio = 0.6, stiffness = 200, visibilityThreshold = 0.1)`.
 * The normalised shape of a damped oscillator depends only on the damping ratio, so
 * this is the same curve as the app's `--md-spring-bounce` (damping 0.6); only the
 * settle time differs, and the visibility threshold is what shortens it here.
 *
 * Returns eased progress for a linear t in [0,1] over the morph interval.
 */
const ZETA = 0.6
const STIFFNESS = 200
const VISIBILITY = 0.1
const OMEGA_N = Math.sqrt(STIFFNESS)
const OMEGA_D = OMEGA_N * Math.sqrt(1 - ZETA * ZETA)
/** Settle time for the given visibility threshold, in seconds. */
const SETTLE = -Math.log(VISIBILITY) / (ZETA * OMEGA_N)

/** Spring progress at normalised time t. */
export function morphEase(t: number): number {
  if (t >= 1) return 1
  const time = t * SETTLE
  const envelope = Math.exp(-ZETA * OMEGA_N * time)
  return 1 - envelope * (Math.cos(OMEGA_D * time) + ((ZETA * OMEGA_N) / OMEGA_D) * Math.sin(OMEGA_D * time))
}

/** Morph interval from the spec, in milliseconds. */
export const MORPH_INTERVAL_MS = 650

/** One full rotation of the whole indicator, in milliseconds. */
export const GLOBAL_ROTATION_MS = 4666