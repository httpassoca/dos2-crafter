// Shared reactive views over the engine, plus UI actions every tab uses.
import { I, R } from './core/data'
import { costs, compute, recipesFor, recipeFor } from './core/engine'
import { S, save } from './state.svelte'

let gen = 0
// costs() fills the engine's value / rarity / best-recipe tables. They depend on which mods are on.
const values = $derived.by(() => {
  void S.mods.kit
  void S.mods.herb
  costs()
  return { v: ++gen }
})

const plan = $derived.by(() => {
  void values.v
  return compute()
})

/**
 * Read `P.values` before calling price / ptxt / RAR / VAL / best / recipeFor so the caller
 * re-runs when the tables change. `P.plan` is the current target plan (gather/used/crafts/tools/left).
 */
export const P = {
  get values() {
    return values
  },
  get plan() {
    return plan
  },
}

export const ui = $state({
  /** item open in the detail drawer */
  item: null as string | null,
  /** command palette open */
  palette: false,
})

export function openItem(k: string) {
  if (I[k]) ui.item = k
}
export function closeItem() {
  ui.item = null
}

/** Add one of k to the plan, optionally pinning recipe index ri. */
export function addTarget(k: string, ri?: number) {
  if (ri != null) S.rc[k] = ri
  delete S.col[k]
  const t = S.targets.find((t) => t.k === k)
  if (t) t.q += ri != null ? 0 : 1
  else S.targets.push({ k, q: 1 })
  S.tab = 'plan'
  save()
}

/** Plan the recipe's main output, switching its mod on if needed. */
export function planRecipe(ri: number) {
  const r = R[ri]
  if (r.m && !S.mods[r.m]) S.mods[r.m] = true
  addTarget(r.out[0][0], r.i)
}

/** Use recipe ri for item k everywhere. */
export function useRecipe(k: string, ri: number) {
  const r = R[ri]
  if (r.m && !S.mods[r.m]) S.mods[r.m] = true
  S.rc[k] = ri
  save()
}

/** Cycle to the next recipe for k. */
export function cycleRecipe(k: string) {
  const rs = recipesFor(k),
    c = recipeFor(k)
  S.rc[k] = rs[(rs.indexOf(c!) + 1) % rs.length].i
  save()
}

export function setStock(k: string, n: number) {
  const v = Math.max(0, Math.floor(+n || 0))
  if (v) S.stock[k] = v
  else delete S.stock[k]
  save()
}

// Persist on any change to persisted state.
$effect.root(() => {
  $effect(() => {
    JSON.stringify(S)
    save()
  })
})
