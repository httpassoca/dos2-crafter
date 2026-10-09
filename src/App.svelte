<script lang="ts">
  import { Topbar, BottomNav, Menu, Switch, Button, Toaster, SearchPalette, ShortcutsHelp, Tooltip, applyDesignConfig, shortcut } from 'dssoca'
  import type { SearchPaletteItem } from 'dssoca'
  import { I, R, allItems, craftable, nm, makes } from './lib/core/data'
  import { S, type Tab } from './lib/state.svelte'
  import { t, LANGS } from './lib/i18n/index.svelte'
  import { ui, openItem, addTarget } from './lib/ui.svelte'
  import { MediaQuery } from 'svelte/reactivity'
  import ItemIcon from './lib/components/ItemIcon.svelte'
  import ItemDrawer from './lib/components/ItemDrawer.svelte'
  import Inventory from './lib/tabs/Inventory.svelte'
  import Planner from './lib/tabs/Planner.svelte'
  import Recipes from './lib/tabs/Recipes.svelte'
  import Notes from './lib/tabs/Notes.svelte'

  const TABS = $derived([
    { id: 'inv', label: t('app.tab.inv') },
    { id: 'plan', label: t('app.tab.plan') },
    { id: 'rec', label: t('app.tab.rec') },
    { id: 'notes', label: t('app.tab.notes') },
  ])

  // below 1280px the mod switches drop their visible labels (tooltip + accessible name stay)
  const narrow = new MediaQuery('max-width: 1279px')
  // bigger chrome needs the room: md/lg (and narrow screens) drop the stat segments, lg also compacts the mods
  const compactMods = $derived(narrow.current || S.size === 'lg')
  const stats = $derived(
    (S.size || 'sm') === 'sm' && !narrow.current
      ? [
          { key: t('app.stat.recipes'), value: String(R.length) },
          { key: t('app.stat.items'), value: String(Object.keys(I).length) },
        ]
      : [],
  )
  // When the header cannot fit its tab strip, the tabs move to a BottomNav. dssoca's Topbar
  // hides its strip at 520px; with the mods and size controls this header needs more room,
  // and more again as the size axis grows.
  const fitsTabs = {
    sm: new MediaQuery('min-width: 761px'),
    md: new MediaQuery('min-width: 901px'),
    lg: new MediaQuery('min-width: 1181px'),
  }
  const phone = $derived(!fitsTabs[S.size || 'sm'].current)
  const ICONS = { inv: 'briefcase', plan: 'target', rec: 'book', notes: 'note' } as const
  const NAV = $derived(TABS.map((x) => ({ ...x, icon: ICONS[x.id as keyof typeof ICONS] })))

  // theme: '' follows dssoca's default (dark)
  $effect(() => {
    applyDesignConfig({ theme: S.theme || 'dark', sizeVariant: S.size || 'sm' })
  })

  const sizeItems = $derived(
    (['sm', 'md', 'lg'] as const).map((id) => ({ id, label: t(`app.size.${id}`), selected: (S.size || 'sm') === id })),
  )
  const langItems = $derived(LANGS.map((l) => ({ id: l.id, label: l.label, selected: S.lang === l.id })))
  const setLang = (id: string) => (S.lang = id as typeof S.lang)
  const langShort = $derived(LANGS.find((l) => l.id === S.lang)?.short ?? 'EN')
  $effect(() => {
    document.documentElement.lang = S.lang
  })
  const setSize = (id: string) => (S.size = id as typeof S.size)

  const goTab = (t: Tab) => () => (S.tab = t)
  const toggleTheme = () => (S.theme = (S.theme || 'dark') === 'dark' ? 'light' : 'dark')

  // ⌘K: jump to any item
  interface Hit extends SearchPaletteItem {
    k: string
  }
  const paletteKeys = allItems.concat(craftable.filter((k) => !allItems.includes(k)))
  const paletteItems: Hit[] = $derived(
    paletteKeys.map((k) => ({
      id: k,
      k,
      label: nm(k),
      group: makes[k] ? t('app.palette.craftable') : t('app.palette.material'),
      keywords: [k],
    })),
  )
</script>

<svelte:head>
  <title>dos2 crafter</title>
</svelte:head>

<div
  class="shell"
  class:phone
  {@attach shortcut(() => ({
    id: 'app:theme',
    label: t('app.sc.theme'),
    keys: 't',
    group: t('app.sc.groupView'),
    onPress: toggleTheme,
  }))}
  {@attach shortcut(() => ({ id: 'app:tab-inv', label: t('app.sc.inv'), keys: '1', group: t('app.sc.groupTabs'), onPress: goTab('inv') }))}
  {@attach shortcut(() => ({ id: 'app:tab-plan', label: t('app.sc.plan'), keys: '2', group: t('app.sc.groupTabs'), onPress: goTab('plan') }))}
  {@attach shortcut(() => ({ id: 'app:tab-rec', label: t('app.sc.rec'), keys: '3', group: t('app.sc.groupTabs'), onPress: goTab('rec') }))}
  {@attach shortcut(() => ({ id: 'app:tab-notes', label: t('app.sc.notes'), keys: '4', group: t('app.sc.groupTabs'), onPress: goTab('notes') }))}
>
  <Topbar
    tabs={phone ? [] : TABS}
    active={S.tab}
    onTab={(id) => (S.tab = id as Tab)}
    onCommand={() => (ui.palette = true)}
    {stats}
    services={false}
    clock={false}
    skipTarget="#main"
    ariaLabel={t('app.sections')}
  >
    {#snippet brand()}
      <span class="mark" aria-hidden="true"></span><span class="nm" class:sr={phone}>dos2 crafter</span>
    {/snippet}
    {#snippet userMenu()}
      <div class="mods" role="group" aria-label={t('app.mods')}>
        <Tooltip placement="bottom" text={t('app.mods.kitTip')}>
          <Switch label={t('mod.kit')} labelHidden={compactMods} checked={S.mods.kit} onchange={(v) => (S.mods.kit = v)} />
        </Tooltip>
        <Tooltip placement="bottom" text={t('app.mods.herbTip')}>
          <Switch label={t('mod.herb')} labelHidden={compactMods} checked={S.mods.herb} onchange={(v) => (S.mods.herb = v)} />
        </Tooltip>
      </div>
      <Menu items={langItems} onSelect={setLang} align="end" label={t('app.lang')}>
        <span aria-hidden="true">{langShort}</span><span class="sr">{t('app.lang')}</span>
      </Menu>
      <Menu items={sizeItems} onSelect={setSize} align="end" label={t('app.size')}>
        {#if phone}<span aria-hidden="true">Aa</span><span class="sr">{t('app.size')}</span>{:else}{t('app.size')}{/if}
      </Menu>
      <Button variant="ghost" iconOnly label={t('app.theme')} onclick={toggleTheme}>◐</Button>
    {/snippet}
  </Topbar>

  <main id="main" class="view" class:phone>
    {#if S.tab === 'inv'}
      <Inventory />
    {:else if S.tab === 'plan'}
      <Planner />
    {:else if S.tab === 'rec'}
      <Recipes />
    {:else}
      <Notes />
    {/if}
  </main>
  {#if phone}
    <BottomNav items={[...NAV]} active={S.tab} onSelect={(id) => (S.tab = id as Tab)} ariaLabel={t('app.sections')} />
  {/if}
</div>

<SearchPalette
  bind:open={ui.palette}
  items={paletteItems}
  placeholder={t('app.palette.placeholder')}
  aria-label={t('app.palette.label')}
  emptyText={t('app.palette.empty')}
  footerText={t('app.palette.footer')}
  shortcut={false}
  onselect={(h) => openItem(h.k)}
>
  {#snippet item(h, { active })}
    <span class="hit" class:active>
      <ItemIcon k={h.k} size={20} />
      <span>{h.label}</span>
      <span class="g">{h.group}</span>
    </span>
  {/snippet}
</SearchPalette>

<ItemDrawer />
<ShortcutsHelp title={t('app.shortcutsTitle')} />
<Toaster position="bottom-right" />

<style lang="scss">
  .shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }
  .view {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  // phones: the header wraps instead of clipping its controls at the larger sizes
  .shell.phone :global(.ss-topbar) {
    flex-wrap: wrap;
  }
  .view.phone {
    padding-bottom: calc(max(var(--ss-bottom-nav-h, var(--ss-shell-top-h)), 44px) + env(safe-area-inset-bottom, 0px));
  }
  .mark {
    width: 10px;
    height: 10px;
    background: var(--ss-primary);
  }
  .nm {
    font-family: var(--ss-font-display);
    font-size: var(--ss-ui-lg);
    color: var(--ss-fg);
  }
  .mods {
    display: flex;
    align-items: center;
    gap: var(--ss-gap);
    padding: 0 var(--ss-gap);
  }
  .hit {
    display: flex;
    align-items: center;
    gap: var(--ss-gap-sm);
    width: 100%;
  }
  .hit .g {
    margin-left: auto;
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-sm);
  }
</style>
