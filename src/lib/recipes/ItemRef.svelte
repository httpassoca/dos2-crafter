<!-- An item as a button: icon, name, optional quantity. Opens the item drawer. -->
<script lang="ts">
  import { nm } from '../core/data'
  import { openItem } from '../ui.svelte'
  import ItemIcon from '../components/ItemIcon.svelte'

  interface Props {
    k: string
    /** quantity, shown when above 1 */
    q?: number
    /** a tool or station: not used up */
    tool?: boolean
    /** recipe result: larger icon, stronger name */
    out?: boolean
  }
  let { k, q = 1, tool = false, out = false }: Props = $props()
</script>

<button type="button" class="ref" class:tool class:out onclick={() => openItem(k)}>
  <ItemIcon {k} size={out ? 32 : 20} />
  <span class="nm">{nm(k)}</span>
  {#if q > 1}<span class="x">×{q}</span>{/if}
</button>

<style lang="scss">
  .ref {
    display: inline-flex;
    align-items: center;
    gap: var(--ss-gap-xs);
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .ref:focus-visible {
    outline: 2px solid var(--ss-primary);
    outline-offset: 2px;
  }
  .out {
    gap: var(--ss-gap-sm);
  }
  .out .nm {
    color: var(--ss-fg);
    font-weight: 500;
  }
  .ref:hover .nm {
    color: var(--ss-primary);
  }
  .tool .nm {
    color: var(--ss-cyan);
  }
  .x {
    color: var(--ss-fg-faint);
    font-variant-numeric: tabular-nums;
  }
</style>
