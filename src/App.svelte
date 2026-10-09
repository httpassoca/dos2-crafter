<script lang="ts">
  import { Topbar, Switch, Button, Toaster, SearchPalette, ShortcutsHelp, Tooltip, applyDesignConfig, shortcut } from 'dssoca'
  import type { SearchPaletteItem } from 'dssoca'
  import { I, R, allItems, craftable, nm, makes } from './lib/core/data'
  import { S, type Tab } from './lib/state.svelte'
  import { ui, openItem, addTarget } from './lib/ui.svelte'
  import ItemIcon from './lib/components/ItemIcon.svelte'
  import ItemDrawer from './lib/components/ItemDrawer.svelte'
  import Inventory from './lib/tabs/Inventory.svelte'
  import Planner from './lib/tabs/Planner.svelte'
  import Recipes from './lib/tabs/Recipes.svelte'
  import Notes from './lib/tabs/Notes.svelte'

  const TABS = [
    { id: 'inv', label: 'inventory' },
    { id: 'plan', label: 'planner' },
    { id: 'rec', label: 'recipes' },
    { id: 'notes', label: 'notes' },
  ]

  // theme: '' follows dssoca's default (dark)
  $effect(() => {
    applyDesignConfig({ theme: S.theme || 'dark', sizeVariant: 'sm' })
  })
  const toggleTheme = () => (S.theme = (S.theme || 'dark') === 'dark' ? 'light' : 'dark')

  // ⌘K: jump to any item
  interface Hit extends SearchPaletteItem {
    k: string
  }
  const paletteItems: Hit[] = allItems
    .concat(craftable.filter((k) => !allItems.includes(k)))
    .map((k) => ({
      id: k,
      k,
      label: nm(k),
      group: makes[k] ? 'craftable' : 'material',
      keywords: [k],
    }))
</script>

<svelte:head>
  <title>dos2 crafter</title>
</svelte:head>

<div
  class="shell"
  {@attach shortcut(() => ({
    id: 'app:theme',
    label: 'Switch light / dark',
    keys: 'shift+t',
    group: 'View',
    onPress: toggleTheme,
  }))}
>
  <Topbar
    tabs={TABS}
    active={S.tab}
    onTab={(t) => (S.tab = t as Tab)}
    onCommand={() => (ui.palette = true)}
    stats={[
      { key: 'recipes', value: String(R.length) },
      { key: 'items', value: String(Object.keys(I).length) },
    ]}
    services={false}
    clock={false}
    skipTarget="#main"
    ariaLabel="Sections"
  >
    {#snippet brand()}
      <span class="mark" aria-hidden="true"></span><span class="nm">dos2 crafter</span>
    {/snippet}
    {#snippet userMenu()}
      <div class="mods" role="group" aria-label="Gift bag mods">
        <Tooltip text="Crafter's Kit gift bag. Its recipes are only planned when on.">
          <Switch label="crafter's kit" checked={S.mods.kit} onchange={(v) => (S.mods.kit = v)} />
        </Tooltip>
        <Tooltip text="Herb Gardens gift bag. Its recipes are only planned when on.">
          <Switch label="herb gardens" checked={S.mods.herb} onchange={(v) => (S.mods.herb = v)} />
        </Tooltip>
      </div>
      <Button variant="ghost" iconOnly label="Switch between dark and light" onclick={toggleTheme}>◐</Button>
    {/snippet}
  </Topbar>

  <main id="main" class="view">
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
</div>

<SearchPalette
  bind:open={ui.palette}
  items={paletteItems}
  placeholder="Find an item…"
  aria-label="Find an item"
  emptyText="No item matches"
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
<ShortcutsHelp />
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
