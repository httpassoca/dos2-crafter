// UI strings for the notes area. Keys are namespaced "notes.*"; `pt` must mirror `en`.
// `{name}` tokens in body text are inline parts (links, bold, code, badges) rendered by Rich.svelte.
import type { Area } from './index.svelte'

export const notes: Area = {
  en: {
    'notes.title': 'Notes on the data',
    'notes.lead': 'Open source on {github}. Issues and fixes to recipes or item ids are welcome there.',

    'notes.source.title': 'Where this comes from',
    'notes.source.body':
      'Every recipe is taken from the Steam guide {steam}. Duplicate rows that the guide repeats across sections are merged, and the rune templates are expanded into one recipe per rune type. Icons are game art collected from the Fextralife wiki. A small number of items had no icon there, so they borrow a similar one or show initials.',
    'notes.source.steam': 'Complete crafting tables (700+ positions) for DOS:II',
    'notes.source.english': '',

    'notes.mods.title': 'Gift bag mods',
    'notes.mods.tagged':
      'Recipes tagged {kit} or {herb} only exist in the Definitive Edition with that mod from the Song of Nature gift bag switched on (load a save, open the menu, choose Larian modifications).',
    'notes.mods.achievements': 'Turning these mods on disables achievements.',
    'notes.mods.ignored': 'The planner ignores mod recipes until you switch the mod on in the top bar.',

    'notes.count.title': 'How the planner counts',
    'notes.count.tools':
      'Tools and stations (hammer, mortar and pestle, oven, anvil and so on) are not used up, so they are listed once.',
    'notes.count.extra':
      'When a craft makes more than you need, the extra is reused by other branches before anything new is crafted.',
    'notes.count.stock':
      'Anything you enter as in stock is taken off the totals first, including half-finished items such as pixie dust.',
    'notes.count.scan':
      "To scan a save: in the inventory tab, load the .lsv file from {path}. The file is unpacked in your browser and is not uploaded anywhere. A globals.lsf or globals.lsx extracted with LSLib works too. It reads every party member's bags, including items inside containers. The game's internal item ids are matched to the guide's names by a hand-made table; ids it does not know are listed after the import.",
    'notes.count.path':
      'Documents\\Larian Studios\\Divinity Original Sin 2 Definitive Edition\\PlayerProfiles\\(profile)\\Savegames\\Story\\(save)',
    'notes.count.values':
      "Effects, item details and values come from each item's page on the {fextralife}. Where the wiki gives no value, the base value from the {craftingDivinity} list is used. Where neither has one, a value marked ≈ is estimated as the cheapest sum of the item's ingredients. For scrolls and skillbooks the description is the skill's. Real shop prices also scale with item level and bartering, so use these to compare items, not as gold amounts.",
    'notes.count.fextralife': 'Fextralife wiki',
    'notes.count.rarity':
      'Rarity is my own grouping: an item is as rare as its hardest-to-find ingredient (source orbs, alien essences and rune frames are rare; high quality essences, distinctive herbs and skillbooks are uncommon). Difficulty is the number of crafts needed, counting intermediate items.',
    'notes.count.inventory':
      'The inventory tab lists everything you can make from what you entered, in one craft or through intermediate crafts. A specific item covers a generic slot there: a bottle of water counts as water, a fire essence as any fire essence, a knife as a cutting tool.',
    'notes.count.buttons':
      'Slots that accept several items show an “or” button on the node. Items with several recipes show a ⇄ button. The − button stops expanding an item so you can treat it as bought or looted.',

    'notes.tips.title': 'Tips from the guide',
    'notes.tips.container':
      'Using a bottle, cup or mug of water, oil, beer or wine in a recipe gives the empty container back.',
    'notes.tips.leather': 'Leather scraps for a leather cover must go into the combine slots one by one, not as a stack.',
    'notes.tips.runes':
      "Runes go in through Manage runes on the item's right-click menu. Extracting a rune destroys nothing.",
    'notes.tips.artefacts':
      'Some eternal artefacts are flagged as miscellaneous and cannot be used for crafting, even though they look identical.',
    'notes.tips.seedling':
      'For herb gardens, a seedling is an empty or clay-filled bucket plus a plant. Only buckets of the armour type work.',
    'notes.tips.quests':
      "Quest and puzzle crafts are mostly left out, and some skillbook and scroll names are the game's internal ones.",

    'notes.write.title': 'Writing back to your save',
    'notes.write.how':
      'Load a {lsv} save in the inventory tab, craft on the page, then use {writeButton}. You get a .zip with the edited save inside.',
    'notes.write.writeButton': 'Write changes to save',
    'notes.write.counts':
      'Counts of stacks you already carry are changed in place. A stack you use up completely is removed, along with every reference the save keeps to it. If anything else in the save points at that item, such as a hotbar slot, one is left behind instead and you are told.',
    'notes.write.copy':
      'An item kind you do not carry yet is created by copying another item of the same kind found anywhere in the save, including the level files with trader and world loot. If the save has no copy of it, that item cannot be added.',
    'notes.write.gameOnly':
      "That is what the {gameOnly} tag means in the inventory tab: you can make the item, but the loaded save holds no item of that kind to copy, so the page cannot write it into the save. If you craft it here and then write the save, its ingredients are removed and the item is not added, and the write dialog warns you first. Craft it in the game instead, or turn on {onlySave} to hide those rows. An item stops being game only once a copy of it exists anywhere in that playthrough's save: in your bags, with a trader or lying in the world.",
    'notes.write.gameOnlyBadge': 'game only',
    'notes.write.onlySave': 'only what my save can take',
    'notes.write.verify':
      'The page reads the rebuilt save back before offering it, and refuses if the counts do not come out as planned. It has not been tested in the game itself, so always keep a copy of your save folder.',

    'notes.reset': 'Reset plan and stock',
    'notes.cleared': 'Plan and stock cleared',
    'notes.confirm.title': 'Reset plan and stock?',
    'notes.confirm.body':
      "This empties your plan, your stock, your chosen recipes and the loaded save's counts, and switches the gift bag mods off. The theme is kept. It cannot be undone.",
    'notes.confirm.ok': 'Reset everything',
  },
  pt: {
    'notes.title': 'Notas sobre os dados',
    'notes.lead':
      'Código aberto no {github}. Issues e correções de receitas ou ids de itens são bem-vindas por lá.',

    'notes.source.title': 'De onde vêm os dados',
    'notes.source.body':
      'Todas as receitas vêm do guia da Steam {steam}. Linhas que o guia repete em várias seções foram unificadas, e os modelos de runa foram expandidos em uma receita por tipo de runa. Os ícones são artes do jogo coletadas na wiki da Fextralife. Alguns poucos itens não tinham ícone lá, então usam um parecido ou mostram as iniciais.',
    'notes.source.steam': 'Complete crafting tables (700+ positions) for DOS:II',
    'notes.source.english':
      'Os nomes, efeitos e descrições dos itens aparecem em inglês porque vêm dessas fontes em inglês.',

    'notes.mods.title': 'Mods da gift bag',
    'notes.mods.tagged':
      'Receitas marcadas com {kit} ou {herb} só existem na Definitive Edition com esse mod da gift bag Song of Nature ativado (carregue um save, abra o menu e escolha Larian modifications).',
    'notes.mods.achievements': 'Ativar esses mods desativa as conquistas.',
    'notes.mods.ignored': 'O planejador ignora as receitas de mods até você ativar o mod na barra superior.',

    'notes.count.title': 'Como o planejador conta',
    'notes.count.tools':
      'Ferramentas e estações (martelo, pilão, forno, bigorna etc.) não são consumidas, então aparecem uma vez só.',
    'notes.count.extra':
      'Quando uma criação rende mais do que você precisa, o excedente é reaproveitado por outros ramos antes de criar qualquer coisa nova.',
    'notes.count.stock':
      'Tudo o que você informa como em estoque é descontado dos totais primeiro, incluindo itens intermediários como pixie dust.',
    'notes.count.scan':
      'Para ler um save: na aba de inventário, carregue o arquivo .lsv de {path}. O arquivo é descompactado no seu navegador e não é enviado para lugar nenhum. Um globals.lsf ou globals.lsx extraído com o LSLib também funciona. São lidas as bolsas de todos os membros do grupo, incluindo itens dentro de recipientes. Os ids internos dos itens do jogo são associados aos nomes do guia por uma tabela feita à mão; ids que ela não conhece são listados após a importação.',
    'notes.count.path':
      'Documents\\Larian Studios\\Divinity Original Sin 2 Definitive Edition\\PlayerProfiles\\(perfil)\\Savegames\\Story\\(save)',
    'notes.count.values':
      'Efeitos, detalhes e valores dos itens vêm da página de cada item na {fextralife}. Quando a wiki não informa um valor, é usado o valor base da lista do {craftingDivinity}. Quando nenhuma das duas tem, um valor marcado com ≈ é estimado como a soma mais barata dos ingredientes do item. Para pergaminhos e livros de habilidade, a descrição é a da habilidade. Os preços reais nas lojas também variam com o nível do item e a barganha, então use esses valores para comparar itens, não como quantias de ouro.',
    'notes.count.fextralife': 'wiki da Fextralife',
    'notes.count.rarity':
      'A raridade é um agrupamento meu: um item é tão raro quanto seu ingrediente mais difícil de achar (source orbs, essências alienígenas e moldes de runa são raros; essências de alta qualidade, ervas específicas e livros de habilidade são incomuns). A dificuldade é o número de criações necessárias, contando os itens intermediários.',
    'notes.count.inventory':
      'A aba de inventário lista tudo o que você pode fazer com o que informou, em uma criação só ou por meio de criações intermediárias. Lá, um item específico preenche um espaço genérico: uma garrafa de água conta como água, uma essência de fogo como qualquer essência de fogo, uma faca como ferramenta de corte.',
    'notes.count.buttons':
      'Espaços que aceitam vários itens mostram um botão “ou” no nó. Itens com várias receitas mostram um botão ⇄. O botão − para de expandir um item, para você tratá-lo como comprado ou saqueado.',

    'notes.tips.title': 'Dicas do guia',
    'notes.tips.container':
      'Usar uma garrafa, copo ou caneca de água, óleo, cerveja ou vinho em uma receita devolve o recipiente vazio.',
    'notes.tips.leather':
      'Os retalhos de couro para uma capa de couro precisam ir nos espaços de combinação um por um, não em pilha.',
    'notes.tips.runes':
      'As runas são colocadas pela opção Manage runes no menu de clique direito do item. Extrair uma runa não destrói nada.',
    'notes.tips.artefacts':
      'Alguns artefatos eternos são marcados como diversos e não podem ser usados para criar, mesmo parecendo idênticos.',
    'notes.tips.seedling':
      'Nos Herb Gardens, uma muda é um balde vazio ou com argila mais uma planta. Só funcionam baldes do tipo armadura.',
    'notes.tips.quests':
      'Criações de missões e quebra-cabeças ficaram quase todas de fora, e alguns nomes de livros de habilidade e pergaminhos são os nomes internos do jogo.',

    'notes.write.title': 'Gravando de volta no seu save',
    'notes.write.how':
      'Carregue um save {lsv} na aba de inventário, crie os itens na página e depois use {writeButton}. Você recebe um .zip com o save editado dentro.',
    'notes.write.writeButton': 'Gravar alterações no save',
    'notes.write.counts':
      'As quantidades das pilhas que você já carrega são alteradas no lugar. Uma pilha que você gasta por completo é removida, junto com todas as referências que o save guarda dela. Se algo mais no save aponta para esse item, como um espaço da barra de atalhos, uma unidade é deixada no lugar e você é avisado.',
    'notes.write.copy':
      'Um tipo de item que você ainda não carrega é criado copiando outro item do mesmo tipo encontrado em qualquer parte do save, incluindo os arquivos de nível com o saque de comerciantes e do mundo. Se o save não tiver nenhuma cópia dele, esse item não pode ser adicionado.',
    'notes.write.gameOnly':
      'É isso que a etiqueta {gameOnly} significa na aba de inventário: você pode fazer o item, mas o save carregado não tem nenhum item desse tipo para copiar, então a página não consegue gravá-lo no save. Se você criá-lo aqui e depois gravar o save, os ingredientes são removidos e o item não é adicionado, e a janela de gravação avisa antes. Crie-o no jogo, ou ative {onlySave} para esconder essas linhas. Um item deixa de ser só do jogo assim que existir uma cópia dele em qualquer lugar do save dessa campanha: nas suas bolsas, com um comerciante ou largado no mundo.',
    'notes.write.gameOnlyBadge': 'só no jogo',
    'notes.write.onlySave': 'só o que meu save aceita',
    'notes.write.verify':
      'A página relê o save reconstruído antes de oferecê-lo e se recusa a entregá-lo se as quantidades não saírem como planejado. Isso não foi testado no próprio jogo, então sempre guarde uma cópia da pasta do seu save.',

    'notes.reset': 'Zerar plano e estoque',
    'notes.cleared': 'Plano e estoque zerados',
    'notes.confirm.title': 'Zerar plano e estoque?',
    'notes.confirm.body':
      'Isso esvazia seu plano, seu estoque, as receitas escolhidas e as quantidades do save carregado, e desativa os mods da gift bag. O tema é mantido. Não dá para desfazer.',
    'notes.confirm.ok': 'Zerar tudo',
  },
}
