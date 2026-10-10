import { describe, it, expect } from 'vitest'
import { I, R, craftable } from '../src/lib/core/data'
import { price, ptxt } from '../src/lib/core/engine'
import { S } from '../src/lib/state.svelte'
import { P } from '../src/lib/ui.svelte'
import { ORIGINAL, valueSource } from '../src/lib/values'

const refresh = () => void P.values.v

describe('player item values', () => {
  const known = Object.keys(I).find((k) => I[k].v && I[k].vs === 'f')!
  const estimated = craftable.find((k) => !I[k].v)!

  it('an override replaces a shipped value, and clearing it restores the original', () => {
    S.values = {}
    refresh()
    const before = price(known)
    expect(before).toBe(ORIGINAL[known].v)
    S.values[known] = before + 777
    refresh()
    expect(price(known)).toBe(before + 777)
    expect(valueSource(known)).toBe('user')
    delete S.values[known]
    refresh()
    expect(price(known)).toBe(before)
    expect(valueSource(known)).toBe('fextra')
  })

  it('an estimated item becomes a real value (no ≈) when set', () => {
    S.values = {}
    refresh()
    expect(String(ptxt(estimated))).toMatch(/^≈|^\?$/)
    S.values[estimated] = 1234
    refresh()
    expect(ptxt(estimated)).toBe('1234')
    S.values = {}
    refresh()
    expect(valueSource(estimated)).toBe('est')
  })

  it('overriding an ingredient changes the estimate of what it makes', () => {
    S.values = {}
    refresh()
    // a single-recipe, unvalued result whose ingredients all have one known-valued option
    const r = R.find(
      (r) =>
        !r.m && !r.b && r.out.length === 1 && !I[r.out[0][0]].v &&
        R.filter((x) => x.out.some(([o]) => o === r.out[0][0])).length === 1 &&
        r.in.every((e) => e.t || (e.o.length === 1 && I[e.o[0]].v)),
    )!
    const k = r.out[0][0]
    const ing = r.in.find((e) => !e.t)!.o[0]
    const base = price(k)
    expect(base).toBeGreaterThan(0)
    S.values = { [ing]: (ORIGINAL[ing].v || 1) + 1000 }
    refresh()
    expect(price(k)).toBeGreaterThan(base)
    S.values = {}
    refresh()
    expect(price(k)).toBe(base)
  })
})
