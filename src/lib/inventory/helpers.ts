// Small pure helpers for the inventory tab (ported from the original page's render code).
import { I, nm, type Recipe } from '../core/data'

/** One row of "what can I make" (engine scanCan). */
export interface CanItem {
  k: string
  /** how many you can make, capped at 50 */
  mx: number
  /** crafts needed, counting intermediate items */
  n: number
  r: Recipe
  val: number
  /** value of the ingredients it uses */
  used: number
  kinds: number
  rar: number
}

export const plural = (n: number, one: string, many = one + 's') => (n === 1 ? one : many)

/** the item's effect lines, minus requirements, cut to n characters */
export function descLine(k: string, n: number) {
  const d = I[k] && I[k].d
  if (!d || !d.e) return ''
  const t = d.e.filter((x) => !/^(Requires|Costs|Range|Damage is based)/.test(x)).join(' · ')
  return t.length > n ? t.slice(0, n - 1) + '…' : t
}

/** Badge tone per rarity (engine RN: common / uncommon / rare) */
export const RAR_TONE = ['neutral', 'neutral', 'info', 'caution'] as const

const HAY = new Map<string, string>()
/** lower-case text the craftable search matches against: name, ingredients and effect */
export function haystack(x: CanItem) {
  const id = x.k + ':' + x.r.i
  let h = HAY.get(id)
  if (h == null) {
    h = (nm(x.k) + ' ' + x.r.in.map((e) => e.o.map(nm).join(' ')).join(' ') + ' ' + descLine(x.k, 400)).toLowerCase()
    HAY.set(id, h)
  }
  return h
}
/** blocked rows only match on name and effect, like the original */
export const blockedHaystack = (k: string) => (nm(k) + ' ' + descLine(k, 400)).toLowerCase()

/** hand a blob to the browser as a download */
export function download(data: BlobPart, fname: string, type = 'application/octet-stream') {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([data], { type }))
  a.download = fname
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000)
}

export const errText = (e: unknown): string => (e instanceof Error ? e.message : String(e))

/** a signed change shown next to an item (Delta.svelte) */
export interface Change {
  n: number
  /** suffix after the number, e.g. "new" */
  note?: string
  title?: string
}
