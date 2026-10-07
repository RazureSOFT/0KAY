/**
 * Types for scripts/i18n.mjs.
 *
 * The sync test (src/i18n-strings.test.ts) imports the parser from the script so
 * there is exactly one implementation of the XML format. TypeScript needs this
 * declaration to type that relative import of a .mjs file.
 */

/** Parse a strings.xml into a flat `{ 'dotted.name': 'value' }` map. */
export function parseStringsXml(text: string): Record<string, string>

/** Render a flat map as a strings.xml, keys sorted for stable diffs. */
export function renderStringsXml(flat: Record<string, string>): string

/** `{ 'a.b': 1 }` -> `{ a: { b: 1 } }`, ready for vue-i18n. */
export function nest(flat: Record<string, string>): Record<string, unknown>

/** `{ a: { b: 1 } }` -> `{ 'a.b': 1 }`. */
export function flatten(value: unknown, prefix?: string, out?: Record<string, string>): Record<string, string>
