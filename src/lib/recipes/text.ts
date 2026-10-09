// Recipe text helpers shared by the recipes tab and the item drawer (legacy descLine / secName / search).
import { I, nm, type Recipe } from '../core/data'

/** A recipe as stored: some rows carry a guide note. */
export type NotedRecipe = Recipe & { n?: string }

/** One-line effect summary of item k, at most n characters. */
export function descLine(k: string, n: number): string {
  const d = I[k] && I[k].d
  if (!d || !d.e) return ''
  const t = d.e.filter((x) => !/^(Requires|Costs|Range|Damage is based)/.test(x)).join(' · ')
  return t.length > n ? t.slice(0, n - 1) + '…' : t
}

/** Guide section name as a readable heading. */
export function secName(s: string): string {
  s = s.toLowerCase().replace(/ - /, ' / ').replace(/"/g, '')
  return s[0].toUpperCase() + s.slice(1)
}

const HAY = new Map<number, string>()
/** Lower-cased searchable text: results, ingredients, stations, note and the result's effects. */
function haystack(r: NotedRecipe): string {
  let t = HAY.get(r.i)
  if (t == null) {
    t = (
      r.out.map((o) => nm(o[0])).join(' ') +
      ' ' +
      r.in.map((e) => e.o.map(nm).join(' ')).join(' ') +
      ' ' +
      (r.st || []).map(nm).join(' ') +
      ' ' +
      (r.n || '') +
      ' ' +
      descLine(r.out[0][0], 400)
    ).toLowerCase()
    HAY.set(r.i, t)
  }
  return t
}

export type ModFilter = 'all' | 'base' | 'kit' | 'herb'

export function tokens(q: string): string[] {
  return q.toLowerCase().split(/\s+/).filter(Boolean)
}

/** Legacy renderRecipes match(). */
export function matches(r: NotedRecipe, g: string, m: ModFilter, toks: string[]): boolean {
  if (g !== 'All' && r.g !== g) return false
  if (m === 'base' && r.m) return false
  if (m === 'kit' && r.m !== 'kit') return false
  if (m === 'herb' && r.m !== 'herb') return false
  if (!toks.length) return true
  const t = haystack(r)
  return toks.every((x) => t.includes(x))
}
