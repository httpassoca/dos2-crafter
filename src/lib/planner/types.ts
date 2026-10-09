import type { Recipe } from '../core/data'

/** A node of the engine's `build()` tree (engine.ts is untyped legacy code). */
export interface TreeNode {
  k: string
  q: number
  depth: number
  /** layout row centre, before the canvas offset */
  y: number
  parent: TreeNode | null
  ch: TreeNode[]
  kind: 'craft' | 'raw' | 'held' | 'cycle' | 'tool'
  root?: 1
  /** number of enabled recipes */
  nr?: number
  r?: Recipe
  /** output per craft */
  out?: number
  /** crafts needed */
  n?: number
  /** "or" option slot key "recipe:slot", option count, current index */
  ok?: string
  on?: number
  oi?: number
  /** station label (all stations joined) */
  label?: string
  station?: 1
}

export interface Tree {
  nodes: TreeNode[]
  roots: TreeNode[]
  w: number
  h: number
}
