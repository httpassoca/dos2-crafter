// App state. Persisted to localStorage under the original page's key so plans carry over.
import { I } from './core/data'

export const SKEY = 'dos2craft:v1'

export type Tab = 'inv' | 'plan' | 'rec' | 'notes'
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
})

function load(): Persisted {
  const S = fresh()
  try {
    const s = JSON.parse(localStorage.getItem(SKEY) || 'null')
    if (s && Array.isArray(s.targets)) {
      Object.assign(S, s)
      S.targets = S.targets.filter((t) => I[t.k])
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

/** wipe plan and stock, keep theme and size */
export function resetAll() {
  const { theme, size } = S
  Object.assign(S, fresh(), { targets: [], tab: 'notes', theme, size, base: null, stash: null, saveName: '', creatable: undefined })
  save()
}

/** inventory scan options: deep = intermediate crafts, tools = stations nearby, hand = assume hand tools */
export const IV = $state({ deep: 1, tools: 1, hand: 1 })

export interface QueueEntry {
  k: string
  n: number
}
/** craft queue on the inventory tab (not persisted, like the original) */
export const Q: QueueEntry[] = $state([])

/** the loaded .lsv bytes, kept in memory only */
export const SAVE: { file: { name: string; u8: Uint8Array } | null } = $state({ file: null })
