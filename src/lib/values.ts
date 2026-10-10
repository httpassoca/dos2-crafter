// Player-set item values. The engine reads base values from I[k].v (and the value source from
// I[k].vs), so overrides are written into the item data before each valuation, with the
// shipped values kept here to restore them. Overrides mark the source as 'u' (yours).
import { I } from './core/data'

/** shipped value and source per item, before any override */
export const ORIGINAL: Record<string, { v?: number; vs?: string }> = Object.fromEntries(
  Object.keys(I).map((k) => [k, { v: I[k].v, vs: I[k].vs }]),
)

/** Write `overrides` into I (and restore every other item). */
export function applyOverrides(overrides: Record<string, number>) {
  for (const k in I) {
    const o = overrides[k]
    if (o > 0) {
      I[k].v = o
      I[k].vs = 'u'
    } else {
      I[k].v = ORIGINAL[k].v
      I[k].vs = ORIGINAL[k].vs
    }
  }
}

export type ValueSource = 'user' | 'fextra' | 'list' | 'est'
/** where an item's value comes from: yours, Fextralife, the Crafting Divinity list, or estimated */
export function valueSource(k: string): ValueSource {
  const it = I[k]
  if (it.vs === 'u') return 'user'
  if (!it.v) return 'est'
  return it.vs === 'f' ? 'fextra' : 'list'
}
