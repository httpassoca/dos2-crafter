// Shared helpers for the golden tests: put both implementations in the same state and normalise outputs.
import { S, IV } from '../src/lib/state.svelte'
import type { Legacy } from './legacy'

export interface Scenario {
  targets?: { k: string; q: number }[]
  stock?: Record<string, number>
  rc?: Record<string, number>
  oc?: Record<string, number>
  col?: Record<string, 1>
  mods?: { kit: boolean; herb: boolean }
  base?: Record<string, number> | null
  creatable?: string[]
}

const clone = <T>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)))

/** apply the same plan state to the legacy S and the new $state S */
export function setBoth(L: Legacy, sc: Scenario) {
  const v = { targets: [], stock: {}, rc: {}, oc: {}, col: {}, mods: { kit: false, herb: false }, base: null, creatable: undefined, ...sc }
  for (const k of ['targets', 'stock', 'rc', 'oc', 'col', 'mods', 'base', 'creatable'] as const) {
    L.S[k] = clone(v[k])
    ;(S as unknown as Record<string, unknown>)[k] = clone(v[k])
  }
}

export function setIV(L: Legacy, iv: { deep: number; tools: number; hand: number }) {
  L.IV = { ...iv }
  Object.assign(IV, iv)
}

/** deterministic PRNG */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const byKey = (a: [unknown, unknown], b: [unknown, unknown]) => (String(a[0]) < String(b[0]) ? -1 : String(a[0]) > String(b[0]) ? 1 : 0)

/** compute() result with Maps / Sets turned into sorted arrays */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normCompute(c: any) {
  return {
    gather: [...c.gather.entries()].sort(byKey),
    crafts: [...c.crafts.entries()].sort(byKey),
    tools: [...c.tools].sort(),
    used: Object.entries(c.used).sort(byKey),
    left: Object.entries(c.left).sort(byKey),
  }
}

/** build() result with node references replaced by indices and recipes by their index */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normBuild(T: any) {
  const idx = new Map(T.nodes.map((n: unknown, i: number) => [n, i]))
  return {
    w: T.w,
    h: T.h,
    roots: T.roots.map((n: unknown) => idx.get(n)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes: T.nodes.map((n: any) => {
      const o: Record<string, unknown> = {}
      for (const k of Object.keys(n).sort()) {
        const v = n[k]
        o[k] = k === 'parent' ? (v ? idx.get(v) : null) : k === 'ch' ? v.map((c: unknown) => idx.get(c)) : k === 'r' ? v.i : v
      }
      return o
    }),
  }
}

/** scanCan() rows with the recipe replaced by its index */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normCan = (rows: any[]) => rows.map((x) => ({ ...x, r: x.r.i }))

/** a plain copy of a (possibly $state-proxied) object */
export const plain = <T>(v: T): T => clone(v)
