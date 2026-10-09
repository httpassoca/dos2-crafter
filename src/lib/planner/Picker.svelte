<!-- Combobox: add a craftable item to the plan. Token match on the name, starts-with first, max 50. -->
<script lang="ts">
  import { Input, shortcut } from 'dssoca'
  import { craftable, nm } from '../core/data'
  import { kind } from '../core/engine'
  import { addTarget } from '../ui.svelte'
  import ItemIcon from '../components/ItemIcon.svelte'

  const uid = $props.id()
  const listId = `${uid}-list`
  const optId = (i: number) => `${uid}-opt-${i}`

  let q = $state('')
  let open = $state(false)
  let hl = $state(0)
  let listEl = $state<HTMLElement>()
  let rootEl = $state<HTMLElement>()

  const found = $derived.by(() => {
    const s = q.trim().toLowerCase(),
      toks = s.split(/\s+/).filter(Boolean)
    const f = craftable.filter((k) => {
      const n = nm(k).toLowerCase()
      return toks.every((t) => n.includes(t))
    })
    if (s)
      f.sort(
        (a, b) =>
          +nm(b).toLowerCase().startsWith(s) - +nm(a).toLowerCase().startsWith(s) || nm(a).length - nm(b).length,
      )
    return f.slice(0, 50)
  })
  const cur = $derived(Math.min(hl, Math.max(found.length - 1, 0)))

  function add(k: string) {
    q = ''
    open = false
    hl = 0
    addTarget(k)
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      open = true
      hl = Math.max(0, Math.min(found.length - 1, cur + (e.key === 'ArrowDown' ? 1 : -1)))
      queueMicrotask(() => listEl?.querySelector('.hl')?.scrollIntoView({ block: 'nearest' }))
    } else if (e.key === 'Enter' && open && found[cur]) {
      e.preventDefault()
      add(found[cur])
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      open = false
    }
  }
</script>

<div
  class="picker"
  bind:this={rootEl}
  onfocusout={(e) => {
    if (!rootEl?.contains(e.relatedTarget as Node | null)) open = false
  }}
  {@attach shortcut(() => ({
    id: 'plan:add',
    label: 'Add an item to craft',
    keys: '/',
    group: 'Planner',
    onPress: () => rootEl?.querySelector('input')?.focus(),
  }))}
>
  <Input
    bind:value={() => q, (v) => ((q = v), (hl = 0), (open = true))}
    placeholder="Add an item to craft, e.g. fire arrow"
    autocomplete="off"
    aria-label="Item to craft"
    role="combobox"
    aria-autocomplete="list"
    aria-expanded={open}
    aria-controls={listId}
    aria-activedescendant={open && found.length ? optId(cur) : undefined}
    onfocus={() => (open = true)}
    onclick={() => (open = true)}
    {onkeydown}
  >
    {#snippet prefix()}+{/snippet}
  </Input>
  <div class="drop" class:on={open} id={listId} role="listbox" aria-label="Craftable items" bind:this={listEl}>
    {#each found as k, i (k)}
      <!-- mousedown keeps focus in the input; the keyboard path is the input's arrows + Enter -->
      <div
        class="opt"
        class:hl={i === cur}
        id={optId(i)}
        role="option"
        aria-selected={i === cur}
        tabindex="-1"
        onmousedown={(e) => e.preventDefault()}
        onmousemove={() => (hl = i)}
        onclick={() => add(k)}
        onkeydown={(e) => e.key === 'Enter' && add(k)}
      >
        <ItemIcon {k} size={24} />
        <span class="n">{nm(k)}</span>
        <span class="g">{kind(k)}</span>
      </div>
    {:else}
      <div class="empty">Nothing craftable matches “{q.trim()}”.</div>
    {/each}
  </div>
</div>

<style lang="scss">
  .picker {
    position: relative;
    flex: 1 1 280px;
    max-width: 460px;
    min-width: 0;
  }
  .drop {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + var(--ss-gap-xs));
    z-index: 30;
    background: var(--ss-bg-elev);
    border: 1px solid var(--ss-line-strong);
    box-shadow: var(--ss-shadow-pop);
    max-height: min(60vh, 420px);
    overflow: auto;
    display: none;
    &.on {
      display: block;
    }
  }
  .opt {
    display: flex;
    align-items: center;
    gap: var(--ss-gap-sm);
    padding: var(--ss-gap-xs) var(--ss-row-px);
    border-bottom: 1px solid var(--ss-line);
    cursor: pointer;
    color: var(--ss-fg);
    font-size: var(--ss-ui-md);
    &.hl {
      background: var(--ss-primary-soft);
    }
  }
  .n {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .g {
    margin-left: auto;
    flex: none;
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-xs);
  }
  .empty {
    padding: var(--ss-s-3);
    color: var(--ss-fg-faint);
  }
</style>
