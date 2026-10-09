// Detects "something was just added to the plan" so the tree can fit and centre itself, like the
// original page's addTarget() did. Module state, so it survives the planner tab unmounting.
import { S, type Target } from '../state.svelte'

const snap = (ts: Target[]) => Object.fromEntries(ts.map((t) => [t.k, t.q]))

let seen: Record<string, number> = snap(S.targets)
let skip = false

/** Call before a quantity edit made in the planner itself, so it doesn't refit the tree. */
export function localEdit() {
  skip = true
}

/** True when a target was added (or its count went up) since the last call. */
export function grew(ts: Target[]): boolean {
  const prev = seen
  seen = snap(ts)
  if (skip) {
    skip = false
    return false
  }
  return ts.some((t) => !(t.k in prev) || t.q > prev[t.k])
}
