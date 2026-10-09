// Tiny i18n: per-area dictionaries, reactive on S.lang, English fallback.
// Item and recipe names, effects and descriptions are game data and stay in English.
import { S, type Lang } from '../state.svelte'
import { common } from './common'
import { app } from './app'
import { planner } from './planner'
import { inventory } from './inventory'
import { recipes } from './recipes'
import { notes } from './notes'

export type { Lang }
export type Dict = Record<string, string>
/** One area's strings: `en` is the source of truth, `pt` must have the same keys. */
export interface Area {
  en: Dict
  pt: Dict
}

export const AREAS: Record<string, Area> = { common, app, planner, inventory, recipes, notes }

const EN: Dict = Object.assign({}, ...Object.values(AREAS).map((a) => a.en))
const PT: Dict = Object.assign({}, ...Object.values(AREAS).map((a) => a.pt))

export const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'pt-BR', label: 'Português (Brasil)', short: 'PT' },
]

const plurals: Record<Lang, Intl.PluralRules> = {
  en: new Intl.PluralRules('en'),
  'pt-BR': new Intl.PluralRules('pt-BR'),
}

/**
 * Translate `key`, filling `{name}` placeholders from `vars`.
 * With a numeric `vars.n`, `key_one` / `key_other` are tried first (Intl plural rules).
 */
export function t(key: string, vars?: Record<string, string | number>): string {
  const lang: Lang = S.lang === 'pt-BR' ? 'pt-BR' : 'en'
  const dict = lang === 'pt-BR' ? PT : EN
  let k = key
  if (vars && typeof vars.n === 'number') {
    const pk = `${key}_${plurals[lang].select(vars.n)}`
    if (pk in dict || pk in EN) k = pk
    else if (`${key}_other` in dict || `${key}_other` in EN) k = `${key}_other`
  }
  let s = dict[k] ?? EN[k]
  if (s == null) {
    if (import.meta.env.DEV) console.warn(`[i18n] missing key "${k}"`)
    return key
  }
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, v) => (v in vars ? String(vars[v]) : m))
  return s
}

/** Current language, for Intl APIs and <html lang>. */
export const lang = () => (S.lang === 'pt-BR' ? 'pt-BR' : 'en')

/** Category label for a recipe group id (GROUPS), e.g. 'Food & drink'. */
export const groupLabel = (g: string) => t(`group.${g}`)
/** Rarity label for RAR value 1..3. */
export const rarityLabel = (r: number) => t(`rarity.${r}`)
/** Label for engine kind(k): 'tool or station' | 'raw material' | 'enchant' | lowercase group. */
export function kindLabel(kind: string) {
  if (kind === 'tool or station') return t('kind.tool')
  if (kind === 'raw material') return t('kind.raw')
  if (kind === 'enchant') return t('kind.enchant')
  const g = Object.keys(GROUP_KEYS).find((x) => x.toLowerCase() === kind)
  return g ? groupLabel(g).toLowerCase() : kind
}
const GROUP_KEYS = Object.fromEntries(
  Object.keys(common.en)
    .filter((k) => k.startsWith('group.'))
    .map((k) => [k.slice(6), 1]),
)
/** Sort option label for engine SORTS ids. */
export const sortLabel = (id: string) => t(`sort.${id}`)
