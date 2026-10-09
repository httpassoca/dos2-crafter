<!-- What you are crafting: one chip per target with its quantity, plus "Clear plan". -->
<script lang="ts">
  import { Button, NumberField } from 'dssoca'
  import { nm } from '../core/data'
  import { S } from '../state.svelte'
  import { openItem } from '../ui.svelte'
  import ItemIcon from '../components/ItemIcon.svelte'
  import { localEdit } from './track'

  function setQ(i: number, v: number | null) {
    const t = S.targets[i]
    if (!t || v == null || Number.isNaN(v)) return
    const q = Math.max(1, Math.floor(v))
    if (q === t.q) return
    localEdit()
    t.q = q
  }
</script>

{#if S.targets.length}
  <ul class="targets" aria-label="Items to craft">
    {#each S.targets as t, i (t.k)}
      <li class="tgt">
        <button type="button" class="it" onclick={() => openItem(t.k)} title="Show {nm(t.k)}">
          <ItemIcon k={t.k} size={24} />
          <span class="nm">{nm(t.k)}</span>
        </button>
        <div class="q">
          <NumberField
            size="sm"
            min={1}
            bind:value={() => t.q, (v) => setQ(i, v)}
            aria-label="Quantity of {nm(t.k)}"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          label="Remove {nm(t.k)} from the plan"
          onclick={() => S.targets.splice(i, 1)}>✕</Button
        >
      </li>
    {/each}
    <li><Button variant="ghost" size="sm" onclick={() => (S.targets = [])}>Clear plan</Button></li>
  </ul>
{/if}

<style lang="scss">
  .targets {
    display: flex;
    gap: var(--ss-gap-sm);
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    min-width: 0;
  }
  .tgt {
    display: inline-flex;
    align-items: center;
    gap: var(--ss-gap-xs);
    border: 1px solid var(--ss-line-strong);
    background: var(--ss-bg-elev);
    padding: 0 0 0 var(--ss-gap-xs);
    max-width: 100%;
  }
  .it {
    display: inline-flex;
    align-items: center;
    gap: var(--ss-gap-xs);
    min-width: 0;
    background: transparent;
    border: 0;
    padding: 0;
    color: var(--ss-fg);
    font-size: var(--ss-ui-md);
    cursor: pointer;
    &:hover .nm {
      color: var(--ss-primary);
    }
  }
  .nm {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .q {
    width: calc(var(--ss-s-16) + var(--ss-s-10));
    flex: none;
  }
</style>
