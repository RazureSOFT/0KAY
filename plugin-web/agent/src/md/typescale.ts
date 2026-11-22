/**
 * MD3 typography roles, as class names and as a typed union.
 *
 * MD3 names type by role, not size: a `label-small` chip and a `body-medium`
 * paragraph may land on the same pixel size and still be different roles,
 * because they carry different weight, tracking and line-height. The app used to
 * express hierarchy by picking a font size (10 of them) and a weight (6 of them,
 * including 650, which is not a real weight in Segoe UI Variable and therefore
 * rendered as something else), which is why nothing looked like a hierarchy.
 *
 * The CSS classes live in theme.css next to the tokens; this file is the
 * vocabulary so components do not spell class names as strings in six places.
 */

/** The six roles this app uses, out of MD3's fifteen. */
export type TypeRole =
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small'

const ROLE_CLASS: Record<TypeRole, string> = {
  'title-large': 'md-type-title-large',
  'title-medium': 'md-type-title-medium',
  'title-small': 'md-type-title-small',
  'body-large': 'md-type-body-large',
  'body-medium': 'md-type-body-medium',
  'body-small': 'md-type-body-small',
  'label-large': 'md-type-label-large',
  'label-medium': 'md-type-label-medium',
  'label-small': 'md-type-label-small',
}

/** Class list for one or more roles. Later roles win, as in CSS. */
export function typeClass(...roles: TypeRole[]): string {
  return roles.map((role) => ROLE_CLASS[role]).join(' ')
}

/** A `style` object that applies a role's font shorthand. */
export function typeStyle(role: TypeRole): Record<string, string> {
  return { font: `var(--md-type-${role}-font)`, letterSpacing: `var(--md-type-${role}-tracking)` }
}

/**
 * Role per UI element, in one place.
 *
 * Keeping this table means a later tweak ("session titles should be one step
 * smaller") is a one-line change instead of a search for every place a size was
 * hardcoded. It also documents the intent: if a component needs a role that is
 * not here, that is a signal to discuss the hierarchy rather than to invent a
 * thirteenth font size.
 */
export const ROLE = {
  /** Page/view title, e.g. "Agent". */
  pageTitle: 'title-large',
  /** Panel and section headings. */
  sectionTitle: 'title-medium',
  /** Primary conversation text, file content. */
  body: 'body-large',
  /** Secondary conversation text, list rows, dense prose. */
  bodyDense: 'body-medium',
  /** Button labels, tab labels, field labels. */
  label: 'label-large',
  /** Chips, badges, metadata, timestamps. */
  labelDense: 'label-small',
} as const satisfies Record<string, TypeRole>