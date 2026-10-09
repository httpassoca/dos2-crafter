// Golden tests: src/lib/core/engine.ts must behave exactly like the legacy page's planner and inventory engine.
import { describe, it, expect, beforeAll } from 'vitest'
import * as ET from '../src/lib/core/engine'
import { I, R, makes, allItems, craftable } from '../src/lib/core/data'
import { S } from '../src/lib/state.svelte'
import { loadLegacy, type Legacy } from './legacy'
import { setBoth, setIV, rng, normCompute, normBuild, normCan, plain, type Scenario } from './helpers'

// core/ is untyped (@ts-nocheck) legacy code: use it loosely typed, like the legacy harness
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const E: any = ET
let L: Legacy
beforeAll(() => {
  L = loadLegacy()
})

const MODS = [
  { kit: false, herb: false },
  { kit: true, herb: false },
  { kit: false, herb: true },
  { kit: true, herb: true },
]

// Targets picked from the data, never hand-listed: alternate recipes, multi-option slots, mod recipes, multi-output.
const multiRecipe = () => craftable.filter((k) => makes[k].length > 1)
const multiOption = () => craftable.filter((k) => makes[k].some((r) => r.in.some((e) => e.o.length > 1)))
const modMade = () => craftable.filter((k) => makes[k].some((r) => r.m))
const multiOut = () => craftable.filter((k) => makes[k].some((r) => r.out.length > 1 || r.out[0][1] > 1))
const every = <T>(a: T[], n: number) => a.filter((_, i) => i % n === 0)

function scenarios(): [string, Scenario][] {
  const rnd = rng(42)
  const pick = <T>(a: T[]) => a[Math.floor(rnd() * a.length)]
  const mr = multiRecipe(), mo = multiOption(), mm = modMade(), mx = multiOut()
  // second recipe choice for every multi-recipe item, option index 1 / out-of-range (wraps) for multi-option slots
  const rc: Record<string, number> = {}
  for (const k of mr) rc[k] = makes[k][1].i
  const oc: Record<string, number> = {}
  for (const r of R) r.in.forEach((e, si) => { if (e.o.length > 1) oc[r.i + ':' + si] = r.i % 2 ? 1 : e.o.length + 1 })
  const stock: Record<string, number> = {}
  for (let i = 0; i < 60; i++) stock[pick(allItems)] = 1 + Math.floor(rnd() * 12)
  const col: Record<string, 1> = {}
  for (const k of every(craftable, 9)) col[k] = 1
  const T = (ks: string[], q = 1) => ks.map((k, i) => ({ k, q: q + (i % 4) }))
  return [
    ['default target', { targets: [{ k: 'giantflameruneofpower', q: 1 }] }],
    ['alternate recipes, mods off', { targets: T(every(mr, 3).slice(0, 25)) }],
    ['alternate recipes chosen (rc), mods on', { targets: T(every(mr, 2).slice(0, 25)), rc, mods: MODS[3] }],
    ['multi-option slots chosen (oc)', { targets: T(every(mo, 4).slice(0, 25), 2), oc }],
    ['mod recipes, kit only', { targets: T(mm.slice(0, 20)), mods: MODS[1] }],
    ['mod recipes, herb only', { targets: T(mm.slice(-20)), mods: MODS[2] }],
    ['multi-output recipes with stock', { targets: T(every(mx, 3).slice(0, 25), 3), stock }],
    ['collapsed nodes (col) + stock + rc + oc', { targets: T(every(craftable, 17), 2), stock, col, rc, oc, mods: MODS[3] }],
    ['many targets (node cap)', { targets: T(every(craftable, 3), 5), mods: MODS[3] }],
    ['no targets', { targets: [] }],
  ]
}

describe('valuation: VAL / RAR / cost / best after costs()', () => {
  for (const mods of MODS) {
    it(`mods ${JSON.stringify(mods)}`, () => {
      setBoth(L, { mods })
      L.costs()
      E.costs()
      expect(E.VAL).toEqual(L.VAL)
      expect(E.RAR).toEqual(L.RAR)
      expect(E.cost).toEqual(L.cost)
      expect(E.best).toEqual(L.best)
      // per-item helpers that read them
      for (const k in I) {
        expect(E.price(k)).toBe(L.price(k))
        expect(E.ptxt(k)).toBe(L.ptxt(k))
        expect(E.kind(k)).toBe(L.kind(k))
        expect(E.baseRar(k)).toBe(L.baseRar(k))
        expect(E.recipesFor(k).map((r: { i: number }) => r.i)).toEqual(L.recipesFor(k).map((r: { i: number }) => r.i))
        expect(E.recipeFor(k)?.i).toBe(L.recipeFor(k)?.i)
      }
    })
  }
})

describe('plan: compute() and build()', () => {
  for (const [name, sc] of scenarios()) {
    it(name, () => {
      setBoth(L, sc)
      L.costs()
      E.costs()
      const c = normCompute(E.compute())
      expect(c).toEqual(normCompute(L.compute()))
      const T = normBuild(E.build())
      expect(T).toEqual(normBuild(L.build()))
      // not vacuous
      if (sc.targets?.length) expect(c.crafts.length + c.gather.length).toBeGreaterThan(0)
      expect(T.nodes.length).toBeGreaterThanOrEqual(sc.targets?.length || 0)
      // optFor for every slot of every recipe under these choices
      for (const r of R) r.in.forEach((_, si) => expect(E.optFor(r, si)).toBe(L.optFor(r, si)))
    })
  }

  it('every craftable item alone, mods on, with stock', () => {
    const rnd = rng(7)
    const stock: Record<string, number> = {}
    for (let i = 0; i < 80; i++) stock[allItems[Math.floor(rnd() * allItems.length)]] = 1 + Math.floor(rnd() * 5)
    for (const mods of [MODS[0], MODS[3]]) {
      setBoth(L, { mods, stock })
      L.costs()
      E.costs()
      for (const k of craftable) {
        L.S.targets = [{ k, q: 3 }]
        S.targets = [{ k, q: 3 }]
        expect(normCompute(E.compute()), k).toEqual(normCompute(L.compute()))
        expect(normBuild(E.build()), k).toEqual(normBuild(L.build()))
      }
    }
  })
})

describe('inventory: scanCan / sat / evalQueue', () => {
  const IVS = [
    { deep: 1, tools: 1, hand: 1 },
    { deep: 0, tools: 1, hand: 1 },
    { deep: 1, tools: 0, hand: 0 },
  ]
  function stocks(): [string, Record<string, number>][] {
    const out: [string, Record<string, number>][] = []
    for (const [seed, n, max] of [[1, 25, 4], [2, 70, 15], [3, 150, 30]]) {
      const rnd = rng(seed), s: Record<string, number> = {}
      for (let i = 0; i < n; i++) s[allItems[Math.floor(rnd() * allItems.length)]] = 1 + Math.floor(rnd() * max)
      out.push([`random stock #${seed} (${n} draws)`, s])
    }
    out.push(['empty stock', {}])
    out.push(['only unknown keys', { notanitem: 3 }])
    return out
  }

  for (const [name, stock] of stocks()) {
    for (const iv of IVS) {
      it(`${name}, IV ${JSON.stringify(iv)}`, () => {
        setBoth(L, { mods: MODS[3], stock })
        setIV(L, iv)
        L.costs()
        E.costs()
        const a = normCan(E.scanCan(stock)), b = normCan(L.scanCan(stock))
        expect(a).toEqual(b)
        if (Object.keys(stock).length > 50 && iv.deep) expect(a.length).toBeGreaterThan(0)

        // a queue made from what can be made, plus one thing that cannot
        const Q = a.slice(0, 6).map((x, i) => ({ k: x.k, n: 1 + (i % Math.max(1, x.mx)) }))
        Q.push({ k: 'giantflameruneofpower', n: 9 })
        L.Q = plain(Q)
        const nq = E.evalQueue(stock, plain(Q)), lq = L.evalQueue(stock)
        const nQ = (r: typeof nq) => ({ st: r.st, steps: r.steps.map((s: { q: { k: string }; crafts: number }) => [s.q.k, s.crafts]), bad: r.bad.map((q: { k: string }) => q.k) })
        expect(nQ(nq)).toEqual(nQ(lq))
        // evalQueue restores IV.deep
        expect(E.stockDiff(stock, nq.st)).toEqual(L.stockDiff(stock, lq.st))
      })
    }
  }

  it('sat / take / avail on single items', () => {
    const rnd = rng(9), stock: Record<string, number> = {}
    for (let i = 0; i < 120; i++) stock[allItems[Math.floor(rnd() * allItems.length)]] = 1 + Math.floor(rnd() * 9)
    setBoth(L, { mods: MODS[3], stock })
    setIV(L, { deep: 1, tools: 1, hand: 1 })
    L.costs()
    E.costs()
    for (const k of every(craftable, 5)) {
      const a = E.sat(k, 2, stock, [], 0, 1), b = L.sat(k, 2, stock, [], 0, 1)
      expect(a && { ...a, r: a.r.i }, k).toEqual(b && { ...b, r: b.r.i })
    }
    for (const k of Object.keys(E.SUBS)) {
      expect(E.take(stock, k, 3)).toEqual(L.take(stock, k, 3))
      expect(E.avail(stock, k)).toBe(L.avail(stock, k))
    }
    expect(E.SUBS).toEqual(L.SUBS)
  })
})

describe('importText', () => {
  const ks = every(allItems, 37)
  const texts: [string, string][] = [
    ['count first', ks.slice(0, 6).map((k, i) => `${i + 2} x ${I[k].n}`).join('\n')],
    ['count last, mixed separators', ks.slice(6, 14).map((k, i) => `${I[k].n}${[' x', ':', ';', ',', '\t', ' - ', ' ', '×'][i]} ${i + 1}`).join('\n')],
    ['bare names, plurals, ids, junk', [...ks.slice(14, 18).map((k) => I[k].n + 's'), ...ks.slice(18, 20), 'Not A Real Thing', '', '  ', 'Water 4'].join('\n')],
    ['JSON object', JSON.stringify(Object.fromEntries(ks.slice(0, 5).map((k, i) => [I[k].n, i + 1])))],
    ['JSON array', JSON.stringify([...ks.slice(5, 9).map((k, i) => ({ name: I[k].n, count: i + 2 })), [I[ks[9]].n, 3], { item: ks[10] }, { name: 'zzz' }])],
    ['bad JSON', '{"a": 1,'],
    ['many unknown', Array.from({ length: 20 }, (_, i) => 'nothing' + i).join('\n')],
    ['zero and negative', `0 ${I[ks[0]].n}\n${I[ks[1]].n} 0`],
  ]
  for (const [name, t] of texts) {
    it(name, () => {
      setBoth(L, { stock: { [ks[3]]: 7 } })
      const msg = E.importText(t)
      expect(msg).toBe(L.importText(t))
      expect(plain(S.stock)).toEqual(L.S.stock)
    })
  }
})

describe('pending / notInSave', () => {
  it('match legacy', () => {
    const base = Object.fromEntries(every(allItems, 50).map((k, i) => [k, i + 1]))
    const stock = { ...base, [allItems[1]]: 4 }
    delete stock[Object.keys(base)[0]]
    const creatable = every(allItems, 3)
    setBoth(L, { base, stock, creatable })
    expect(E.pending()).toEqual(L.pending())
    for (const k of allItems) expect(E.notInSave(k)).toBe(L.notInSave(k))
  })
})
