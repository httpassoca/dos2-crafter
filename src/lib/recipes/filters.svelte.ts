// Recipes tab filters. Module state so they survive tab switches, like the original page.
import type { ModFilter } from './text'

export const F = $state({
  /** category group */
  g: 'All',
  /** search text (already debounced) */
  q: '',
  /** game version */
  m: 'all' as ModFilter,
  /** 1-based page */
  page: 1,
})

export function resetFilters() {
  F.g = 'All'
  F.q = ''
  F.m = 'all'
  F.page = 1
}
