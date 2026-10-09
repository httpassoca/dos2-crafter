// Localise the English sentences core code returns (importText, importSave, the save writer).
// core/ is pinned by golden tests, so its messages stay English there; each shape is matched here
// and rebuilt from the dictionary. Anything that does not match is shown as is.
import { t } from '../i18n/index.svelte'

type Rule = [RegExp, (m: RegExpMatchArray) => string]

function run(rules: Rule[], s: string): string {
  for (const [re, fn] of rules) {
    const m = s.match(re)
    if (m) return fn(m)
  }
  return s
}

const k = (key: string) => () => t(`inventory.msg.${key}`)

/** importText(): "Imported N items. Not recognised: a, b and 3 more." / JSON error */
const IMPORT: Rule[] = [
  [/^That looks like JSON but could not be read\. Check for a missing bracket or comma\.$/, k('json')],
  [
    /^Imported (\d+) items?\.(?: Not recognised: ([\s\S]*?)(?: and (\d+) more)?\.)?$/,
    (m) => {
      const head = t('inventory.msg.imported', { n: +m[1] })
      if (m[2] == null) return head
      const tail = m[3]
        ? t('inventory.msg.notRecMore', { list: m[2], m: m[3] })
        : t('inventory.msg.notRec', { list: m[2] })
      return head + ' ' + tail
    },
  ],
]

/** importSave(): the summary after reading a save */
const SAVE: Rule[] = [
  [/^No party members were found in this save\.$/, k('noParty')],
  [
    /^Read (\d+) party members? and (\d+) item stacks\. (\d+) kinds of item match the guide and are now your inventory\. (\d+) other kinds were skipped \(gear, quest items and things no recipe uses\)\. Hand tools are now counted only if you carry them\.$/,
    (m) => t('inventory.msg.read', { n: +m[1], stacks: m[2], kinds: m[3], skip: m[4] }),
  ],
]

/** reasons in res.warn from saveApply / deleteItem / cloneItem */
const WHY: Rule[] = [
  [/^it is referenced by (.+)$/, (m) => t('inventory.msg.referenced', { ref: m[1] })],
  [/^it is a container$/, k('container')],
]
const WARN: Rule[] = [
  [/^kept 1 (\S+) because (.+)$/, (m) => t('inventory.msg.kept', { stats: m[1], why: run(WHY, m[2]) })],
  [/^could not remove (\d+)$/, (m) => t('inventory.msg.notRemoved', { n: m[1] })],
  [/^no copy of this item anywhere in the save to create it from$/, k('noCopy')],
  [/^the character has no other items to copy the layout from$/, k('noLayout')],
  [/^could not find a free item id$/, k('noId')],
]

/** errors thrown while reading a save or by prepareWrite / buildWrite */
const ERR: Rule[] = [
  [/^no save is loaded$/, k('noSave')],
  [/^no (.+) inside this save \(found: (.*)\)$/, (m) => t('inventory.msg.noFileFound', { file: m[1], list: m[2] })],
  [/^no (\S+) inside this save$/, (m) => t('inventory.msg.noFile', { file: m[1] })],
  [
    /^the rebuilt save did not read back as expected: (.*)$/,
    (m) =>
      t('inventory.msg.readBack', {
        list: m[1].replace(/\((\d+) instead of (\d+)\)/g, (_, a, b) => t('inventory.msg.insteadOf', { a, b })),
      }),
  ],
  [/^no party members found$/, k('noPartyFound')],
  [/^only Definitive Edition saves \(package v13\) can be written$/, k('onlyDE')],
  [/^package version (\d+) cannot be written$/, (m) => t('inventory.msg.pkgWrite', { v: m[1] })],
  [/^package version (\d+) is not a Divinity: Original Sin 2 save$/, (m) => t('inventory.msg.pkgNotDos2', { v: m[1] })],
  [/^this is not a save package$/, k('notPkg')],
  [/^not an LSF file$/, k('notLsf')],
  [/^LSF version (\d+) cannot be written$/, (m) => t('inventory.msg.lsfWrite', { v: m[1] })],
  [/^LSF version (\d+) is not supported$/, (m) => t('inventory.msg.lsfRead', { v: m[1] })],
  [/^this save uses a node layout the writer does not support$/, k('layout')],
  [/^this save is missing a section the writer needs$/, k('section')],
  [/^item list and item creators do not line up$/, k('lineUp')],
  [/^this file has no Characters or Items section$/, k('noSections')],
]

/** A message from importText() or importSave(). */
export const importMsg = (s: string) => run([...SAVE, ...IMPORT], s)
/** A reason from the writer's res.warn. */
export const warnMsg = (s: string) => run(WARN, s)
/** An error message (lower-case clause, no final full stop) from reading or writing a save. */
export const errMsg = (s: string) => run(ERR, s)
