// App state. Persisted to localStorage under the original page's key so plans carry over.
import { I } from './core/data'

export const SKEY = 'dos2craft:v1'

export type Lang = 'en' | 'pt-BR'
export type Tab = 'inv' | 'plan' | 'rec' | 'notes' | 'config'
export interface Target {
  k: string
  q: number
}
export interface Persisted {
  targets: Target[]
  /** item key → count you own */
  stock: Record<string, number>
  /** item key → chosen recipe index */
  rc: Record<string, number>
  /** "recipe:slot" → chosen option index */
  oc: Record<string, number>
  /** item keys not expanded in the tree */
  col: Record<string, 1>
  mods: { kit: boolean; herb: boolean }
  tab: Tab
  zoom: number
  theme: '' | 'dark' | 'light'
  /** dssoca size axis: chrome density */
  size: 'sm' | 'md' | 'lg'
  /** UI language; item and recipe data stay in English */
  lang: Lang
  /** inventory scan options: deep = intermediate crafts, tools = stations nearby, hand = assume hand tools */
  iv: { deep: number; tools: number; hand: number }
  /** item key → the player's own base value; only items they changed are stored */
  values: Record<string, number>
  /** stock as read from the loaded save */
  base?: Record<string, number> | null
  /** unsaved edits stashed when another save was loaded */
  stash?: Record<string, number> | null
  saveName?: string
  /** item keys the loaded save has a copy of somewhere */
  creatable?: string[]
}

const fresh = (): Persisted => ({
  targets: [{ k: 'giantflameruneofpower', q: 1 }],
  stock: {},
  rc: {},
  oc: {},
  col: {},
  mods: { kit: false, herb: false },
  tab: 'inv',
  zoom: 0.75,
  theme: '',
  size: 'sm',
  iv: { deep: 1, tools: 1, hand: 1 },
  values: {},
  lang: typeof navigator !== 'undefined' && /^pt\b/i.test(navigator.language) ? 'pt-BR' : 'en',
})

function load(): Persisted {
  const S = fresh()
  try {
    const s = JSON.parse(localStorage.getItem(SKEY) || 'null')
    if (s && Array.isArray(s.targets)) {
      Object.assign(S, s)
      S.targets = S.targets.filter((t) => I[t.k])
      S.iv = { ...fresh().iv, ...(s.iv || {}) }
      S.values = Object.fromEntries(
        Object.entries((s.values || {}) as Record<string, unknown>).filter(([k, v]) => I[k] && Number.isFinite(v) && (v as number) > 0),
      ) as Record<string, number>
    }
  } catch {
    /* private window or blocked storage */
  }
  return S
}

export const S: Persisted = $state(load())

export function save() {
  try {
    localStorage.setItem(SKEY, JSON.stringify($state.snapshot(S)))
  } catch {
    /* ignore */
  }
}

/** wipe plan and stock; settings (theme, size, language, scan options, item values) are kept */
export function resetAll() {
  const { theme, size, lang, iv, values } = S
  Object.assign(S, fresh(), { targets: [], tab: 'notes', theme, size, lang, iv, values, base: null, stash: null, saveName: '', creatable: undefined })
  save()
}

/** inventory scan options (persisted as S.iv; the engine reads them as IV) */
export const IV = S.iv

export interface QueueEntry {
  k: string
  n: number
}
/** craft queue on the inventory tab (not persisted, like the original) */
export const Q: QueueEntry[] = $state([])

/** the loaded .lsv bytes, kept in memory only */
export const SAVE: { file: { name: string; u8: Uint8Array } | null } = $state({ file: null })
