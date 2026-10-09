import { describe, it, expect, afterEach } from 'vitest'
import { S } from '../src/lib/state.svelte'
import { importMsg, warnMsg, errMsg } from '../src/lib/inventory/messages'

// [English from core, expected pt-BR]
const IMPORT: [string, string][] = [
  [
    'That looks like JSON but could not be read. Check for a missing bracket or comma.',
    'Isso parece JSON, mas não pôde ser lido. Verifique se falta um colchete ou uma vírgula.',
  ],
  ['Imported 1 item.', '1 item importado.'],
  ['Imported 3 items.', '3 itens importados.'],
  // pt-BR plural rules put 0 in "one"
  ['Imported 0 items. Not recognised: Foo, Bar baz.', '0 itens importados. Não reconhecidos: Foo, Bar baz.'],
  [
    'Imported 2 items. Not recognised: a, b, c, d, e, f, g, h, i, j, k, l and 4 more.',
    '2 itens importados. Não reconhecidos: a, b, c, d, e, f, g, h, i, j, k, l e mais 4.',
  ],
  ['No party members were found in this save.', 'Nenhum membro do grupo foi encontrado neste save.'],
  [
    'Read 1 party member and 40 item stacks. 12 kinds of item match the guide and are now your inventory. 7 other kinds were skipped (gear, quest items and things no recipe uses). Hand tools are now counted only if you carry them.',
    'Lido 1 membro do grupo e 40 pilhas de itens. 12 tipos de item correspondem ao guia e agora são o seu inventário. 7 outros tipos foram ignorados (equipamento, itens de missão e coisas que nenhuma receita usa). Ferramentas de mão agora só contam se você as carregar.',
  ],
  [
    'Read 4 party members and 300 item stacks. 80 kinds of item match the guide and are now your inventory. 9 other kinds were skipped (gear, quest items and things no recipe uses). Hand tools are now counted only if you carry them.',
    'Lidos 4 membros do grupo e 300 pilhas de itens. 80 tipos de item correspondem ao guia e agora são o seu inventário. 9 outros tipos foram ignorados (equipamento, itens de missão e coisas que nenhuma receita usa). Ferramentas de mão agora só contam se você as carregar.',
  ],
]

const WARN: [string, string][] = [
  [
    'kept 1 CON_Potion_A because it is referenced by Skill.Item',
    'mantido 1 CON_Potion_A porque ele é referenciado por Skill.Item',
  ],
  ['kept 1 LOOT_Bag because it is a container', 'mantido 1 LOOT_Bag porque ele é um contêiner'],
  ['could not remove 3', 'não foi possível remover 3'],
  [
    'no copy of this item anywhere in the save to create it from',
    'não há nenhuma cópia deste item no save para criá-lo a partir dela',
  ],
  [
    'the character has no other items to copy the layout from',
    'o personagem não tem outros itens dos quais copiar o layout',
  ],
  ['could not find a free item id', 'não foi possível encontrar um id de item livre'],
]

const ERR: [string, string][] = [
  ['no save is loaded', 'nenhum save está carregado'],
  ['no globals.lsf inside this save', 'não há globals.lsf dentro deste save'],
  [
    'no globals.lsf inside this save (found: meta.lsf, a b.lsf)',
    'não há globals.lsf dentro deste save (encontrados: meta.lsf, a b.lsf)',
  ],
  [
    'the rebuilt save did not read back as expected: Bone (2 instead of 3), Fire Arrow (0 instead of 1)',
    'o save remontado não foi relido como esperado: Bone (2 em vez de 3), Fire Arrow (0 em vez de 1)',
  ],
  ['no party members found', 'nenhum membro do grupo encontrado'],
  [
    'only Definitive Edition saves (package v13) can be written',
    'só saves da Definitive Edition (pacote v13) podem ser gravados',
  ],
  ['package version 10 cannot be written', 'a versão de pacote 10 não pode ser gravada'],
  [
    'package version 9 is not a Divinity: Original Sin 2 save',
    'a versão de pacote 9 não é um save de Divinity: Original Sin 2',
  ],
  ['this is not a save package', 'isto não é um pacote de save'],
  ['not an LSF file', 'não é um arquivo LSF'],
  ['LSF version 5 cannot be written', 'a versão de LSF 5 não pode ser gravada'],
  ['LSF version 8 is not supported', 'a versão de LSF 8 não é suportada'],
  [
    'this save uses a node layout the writer does not support',
    'este save usa um layout de nós que o gravador não suporta',
  ],
  ['this save is missing a section the writer needs', 'falta neste save uma seção de que o gravador precisa'],
  ['item list and item creators do not line up', 'a lista de itens e os criadores de itens não batem'],
  ['this file has no Characters or Items section', 'este arquivo não tem seção Characters ou Items'],
]

const CASES: [string, (s: string) => string, [string, string][]][] = [
  ['importMsg', importMsg, IMPORT],
  ['warnMsg', warnMsg, WARN],
  ['errMsg', errMsg, ERR],
]

afterEach(() => {
  S.lang = 'en'
})

describe('inventory core messages', () => {
  for (const [name, fn, cases] of CASES) {
    it(`${name}: English comes back unchanged`, () => {
      S.lang = 'en'
      for (const [en] of cases) expect(fn(en)).toBe(en)
    })
    it(`${name}: pt-BR`, () => {
      S.lang = 'pt-BR'
      for (const [en, pt] of cases) expect(fn(en), en).toBe(pt)
    })
    it(`${name}: unknown messages fall back to the English`, () => {
      S.lang = 'pt-BR'
      expect(fn('lz4 bad match')).toBe('lz4 bad match')
    })
  }
})
