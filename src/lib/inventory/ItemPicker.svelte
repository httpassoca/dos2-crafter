<!-- "Add an item you own": a combobox over every ownable item. -->
<script lang="ts">
  import { Input } from 'dssoca'
  import { allItems, nm } from '../core/data'
  import { kind } from '../core/engine'
  import ItemIcon from '../components/ItemIcon.svelte'
  import { t, kindLabel } from '../i18n/index.svelte'

  interface Props {
    onpick: (k: string) => void
  }
  let { onpick }: Props = $props()

  const uid = $props.id()
  let q = $state('')
  let open = $state(false)
  let hl = $state(0)

  const found = $derived.by(() => {
    const s = q.trim().toLowerCase(),
      toks = s.split(/\s+/).filter(Boolean)
    let f = allItems.filter((k) => {
      const n = nm(k).toLowerCase()
      return toks.every((t) => n.includes(t))
    })
    if (s)
      f = f.sort(
        (a, b) =>
          +nm(b).toLowerCase().startsWith(s) - +nm(a).toLowerCase().startsWith(s) || nm(a).length - nm(b).length,
      )
    return f.slice(0, 50)
  })
  const cur = $derived(Math.min(hl, Math.max(found.length - 1, 0)))

  $effect(() => {
    if (open) document.getElementById(`${uid}-o${cur}`)?.scrollIntoView({ block: 'nearest' })
  })

  function pick(k: string) {
    q = ''
    open = false
    hl = 0
    onpick(k)
  }
  function onkeydown(ev: KeyboardEvent) {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault()
      open = true
      hl = Math.max(0, Math.min(found.length - 1, cur + (ev.key === 'ArrowDown' ? 1 : -1)))
    } else if (ev.key === 'Enter' && open && found[cur]) {
      ev.preventDefault()
      pick(found[cur])
    } else if (ev.key === 'Escape' && open) {
      ev.stopPropagation()
      open = false
    }
  }
  function onfocusout(ev: FocusEvent) {
    const to = ev.relatedTarget as Node | null
    if (!to || !(ev.currentTarget as HTMLElement).contains(to)) open = false
  }
</script>

<div class="picker" {onfocusout}>
  <Input
    bind:value={q}
    placeholder={t('inventory.pick.placeholder')}
    autocomplete="off"
    aria-label={t('inventory.pick.placeholder')}
    role="combobox"
    aria-expanded={open}
    aria-controls="{uid}-list"
    aria-autocomplete="list"
    aria-activedescendant={open && found.length ? `${uid}-o${cur}` : undefined}
    onfocus={() => (open = true)}
    onclick={() => (open = true)}
    oninput={() => {
      open = true
      hl = 0
    }}
    {onkeydown}
  >
    {#snippet prefix()}+{/snippet}
  </Input>
  {#if open}
    <div class="drop" id="{uid}-list" role="listbox" aria-label={t('inventory.pick.list')}>
      {#each found as k, i (k)}
        <button
          type="button"
          id="{uid}-o{i}"
          role="option"
          aria-selected={i === cur}
          class:hl={i === cur}
          tabindex="-1"
          onmousedown={(e) => e.preventDefault()}
          onmousemove={() => (hl = i)}
          onclick={() => pick(k)}
        >
          <ItemIcon {k} size={24} />
          <span class="nm">{nm(k)}</span>
          <span class="g">{kindLabel(kind(k))}</span>
        </button>
      {:else}
        <div class="none">{t('inventory.pick.none', { q: q.trim() })}</div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .picker {
    position: relative;
  }
  .drop {
    position: absolute;
    z-index: 20;
    top: calc(100% + var(--ss-s-1));
    left: 0;
    right: 0;
    max-height: min(360px, 50vh);
    overflow: auto;
    background: var(--ss-bg-elev);
    border: 1px solid var(--ss-line-strong);
    box-shadow: var(--ss-shadow-pop);
    padding: var(--ss-menu-pad);
  }
  button {
    display: flex;
    align-items: center;
    gap: var(--ss-menu-item-gap);
    width: 100%;
    padding: var(--ss-menu-item-py) var(--ss-menu-item-px);
    border: 0;
    background: transparent;
    color: var(--ss-fg);
    font: inherit;
    font-size: var(--ss-ui-md);
    text-align: left;
    cursor: pointer;
    &.hl {
      background: var(--ss-primary-soft);
    }
  }
  .nm {
    flex: 1;
    min-width: 0;
  }
  .g {
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-sm);
  }
  .none {
    padding: var(--ss-menu-item-py) var(--ss-menu-item-px);
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-md);
  }
</style>
