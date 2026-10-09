// Game data: items and recipes from the original page (Steam guide 1137514488, Fextralife).
import items from '../data/items.json'
import recipes from '../data/recipes.json'

export interface ItemDetails {
  /** meta rows, e.g. [["Type","Container"]] */
  m?: [string, string][]
  /** effect lines */
  e?: string[]
  /** wiki page name */
  w?: string
  [key: string]: unknown
}
export interface Item {
  /** display name */
  n: string
  /** atlas index, -1 when there is no icon */
  i: number
  /** base value */
  v?: number
  /** value source */
  vs?: string
  /** tool or station */
  t?: number | boolean
  d?: ItemDetails
}
export interface Slot {
  /** options that fill this slot */
  o: string[]
  q: number
  /** tool: not used up */
  t?: number | boolean
}
export interface Recipe {
  out: [string, number][]
  in: Slot[]
  /** category group */
  g: string
  /** guide section */
  s: string
  /** stations */
  st?: string[]
  /** gift bag mod: kit | herb */
  m?: 'kit' | 'herb'
  /** enchant (applied to an existing item) */
  b?: number | boolean
  /** index into R */
  i: number
}

export const I = items as unknown as Record<string, Item>
export const R = recipes as unknown as Recipe[]
R.forEach((r, i) => (r.i = i))

/** recipes that produce / use each item */
export const makes: Record<string, Recipe[]> = {}
export const uses: Record<string, Recipe[]> = {}
R.forEach((r) => {
  r.out.forEach(([k]) => (makes[k] = makes[k] || []).push(r))
  const s = new Set<string>()
  r.in.forEach((e) => e.o.forEach((k) => s.add(k)))
  ;(r.st || []).forEach((k) => s.add(k))
  s.forEach((k) => (uses[k] = uses[k] || []).push(r))
})

/** icon atlas: 25 x 25 cells */
export const COLS = 25
export const nm = (k: string) => (I[k] ? I[k].n : k)
export const GROUPS = ['All', 'Potions', 'Skillbooks', 'Scrolls', 'Runes', 'Arrows', 'Grenades', 'Food & drink', 'Weapons', 'Armour', 'Enchants', 'Items & furniture']

export const nkey = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '')
let NAMEMAP: Record<string, string> | null = null
/** normalised name or id → item key */
export function nameMap() {
  if (NAMEMAP) return NAMEMAP
  NAMEMAP = {}
  for (const k in I) {
    NAMEMAP[k] = k
    NAMEMAP[nkey(I[k].n)] = k
  }
  return NAMEMAP
}

const byName = (a: string, b: string) => nm(a).localeCompare(nm(b))
/** everything you can own (enchant-only results excluded) */
export const allItems = Object.keys(I)
  .filter((k) => !((makes[k] || []).length && (makes[k] || []).every((r) => r.b)))
  .sort(byName)
/** everything with at least one recipe */
export const craftable = Object.keys(I).filter((k) => makes[k]).sort(byName)
