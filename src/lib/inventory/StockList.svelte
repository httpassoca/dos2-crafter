<!-- "What you have": add items, set counts, remove them. -->
<script lang="ts">
  import { tick } from 'svelte'
  import { Card, NumberField, Button } from 'dssoca'
  import { I, nm } from '../core/data'
  import { S } from '../state.svelte'
  import { setStock } from '../ui.svelte'
  import ItemChip from './ItemChip.svelte'
  import ItemPicker from './ItemPicker.svelte'
  import { addStock, removeStock } from './inv.svelte'
  import { t } from '../i18n/index.svelte'

  const keys = $derived(
    Object.keys(S.stock)
      .filter((k) => I[k])
      .sort((a, b) => nm(a).localeCompare(nm(b))),
  )

  async function add(k: string) {
    addStock(k)
    await tick()
    const el = document.getElementById('iv-' + k) as HTMLInputElement | null
    if (el) {
      el.focus()
      el.select()
    }
  }
</script>

<Card title={t('inventory.stock.title')} meta={t('inventory.stock.count', { n: keys.length })}>
  <div class="pick"><ItemPicker onpick={add} /></div>
  <div class="rows">
    {#each keys as k (k)}
      <div class="row">
        <ItemChip {k} main />
        <div class="num">
          <NumberField
            id="iv-{k}"
            min={0}
            aria-label={t('inventory.stock.howMany', { name: nm(k) })}
            bind:value={() => S.stock[k] ?? null, (v) => v != null && setStock(k, v)}
          />
        </div>
        <Button variant="ghost" iconOnly label={t('inventory.stock.remove', { name: nm(k) })} onclick={() => removeStock(k)}>✕</Button>
      </div>
    {:else}
      <p class="empty">{t('inventory.stock.empty')}</p>
    {/each}
  </div>
</Card>

<style lang="scss">
  .pick {
    margin-bottom: var(--ss-gap-sm);
  }
  .rows {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: var(--ss-gap-sm);
    padding: var(--ss-s-1) 0;
    border-bottom: 1px solid var(--ss-line);
    &:last-child {
      border-bottom: 0;
    }
  }
  .num {
    width: calc(var(--ss-input-font) * 8);
  }
  .empty {
    margin: 0;
    color: var(--ss-fg-faint);
    font-size: var(--ss-ui-md);
  }
</style>
