<!-- Icon + name that opens the item drawer (legacy itm / chip). -->
<script lang="ts">
  import { nm } from '../core/data'
  import { openItem } from '../ui.svelte'
  import ItemIcon from '../components/ItemIcon.svelte'

  interface Props {
    k: string
    /** shown as ×q when above `min` */
    q?: number
    min?: number
    /** px */
    size?: number
    /** tool or station tint */
    tool?: boolean
    /** compact inline chip (smaller, no ellipsis) */
    chip?: boolean
  }
  let { k, q = 0, min = 0, size = 24, tool = false, chip = false }: Props = $props()
</script>

<button type="button" class="itm" class:tool class:chip onclick={() => openItem(k)}>
  <ItemIcon {k} {size} />
  <span class="nm">{nm(k)}</span>
  {#if q > min}<span class="x">×{q}</span>{/if}
</button>

<style lang="scss">
  .itm {
    display: inline-flex;
    align-items: center;
    gap: var(--ss-gap-xs);
    background: transparent;
    border: 0;
    padding: 0;
    min-width: 0;
    text-align: left;
    color: inherit;
    font: inherit;
    cursor: pointer;
    &:hover .nm {
      color: var(--ss-primary);
    }
    &:not(.chip) {
      flex: 1;
      .nm {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--ss-fg);
      }
    }
    &.tool {
      color: var(--ss-cyan);
    }
  }
  .x {
    color: var(--ss-fg-faint);
    font-variant-numeric: tabular-nums;
  }
</style>
