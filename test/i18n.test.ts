import { describe, it, expect } from 'vitest'
import { AREAS, t } from '../src/lib/i18n/index.svelte'
import { S } from '../src/lib/state.svelte'
import { GROUPS } from '../src/lib/core/data'
import { SORTS } from '../src/lib/core/engine'

const vars = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

describe('i18n dictionaries', () => {
  for (const [name, a] of Object.entries(AREAS)) {
    it(`${name}: pt-BR has exactly the English keys`, () => {
      expect(Object.keys(a.pt).sort()).toEqual(Object.keys(a.en).sort())
    })
    it(`${name}: placeholders match`, () => {
      for (const k of Object.keys(a.en)) expect(vars(a.pt[k] ?? ''), k).toEqual(vars(a.en[k]))
    })
    it(`${name}: keys are namespaced`, () => {
      if (name === 'common') return
      for (const k of Object.keys(a.en)) expect(k.startsWith(name + '.'), k).toBe(true)
    })
  }
  it('no key is defined by two areas', () => {
    const seen = new Map<string, string>()
    for (const [name, a] of Object.entries(AREAS))
      for (const k of Object.keys(a.en)) {
        expect(seen.get(k), `${k} in ${name} and ${seen.get(k)}`).toBeUndefined()
        seen.set(k, name)
      }
  })
  it('every category and sort option has a label', () => {
    for (const g of GROUPS) expect(AREAS.common.en[`group.${g}`], g).toBeTruthy()
    for (const [id] of SORTS) expect(AREAS.common.en[`sort.${id}`], id).toBeTruthy()
  })
  it('t() switches language, fills vars and picks plural forms', () => {
    S.lang = 'en'
    expect(t('group.Potions')).toBe('Potions')
    S.lang = 'pt-BR'
    expect(t('group.Potions')).toBe('Poções')
    expect(t('no.such.key')).toBe('no.such.key')
    S.lang = 'en'
  })
})
