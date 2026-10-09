<!-- An item you can click to open its details: icon, name and an optional count. -->
<script lang="ts">
  import { nm } from '../core/data'
  import { openItem } from '../ui.svelte'
  import ItemIcon from '../components/ItemIcon.svelte'

  interface Props {
    k: string
    /** count shown as ×q when above 1 */
    q?: number
    /** a tool or station (not used up) */
    tool?: boolean
    /** larger icon and stronger name, for the main item of a row */
    main?: boolean
  }
  let { k, q = 0, tool = false, main = false }: Props = $props()
</script>

<button type="button" class="chip" class:tool class:main onclick={() => openItem(k)}>
  <ItemIcon {k} size={main ? 24 : 20} />
  <span class="nm">{nm(k)}</span>
  {#if q > 1}<span class="x">×{q}</span>{/if}
</button>

<style lang="scss">
  .chip {
    display: inline-flex;
    align-items: center;
    gap: var(--ss-gap-xs);
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: var(--ss-ui-md);
    text-align: left;
    cursor: pointer;
    &:hover .nm {
      color: var(--ss-primary);
    }
    &:focus-visible {
      outline: 2px solid var(--ss-primary);
      outline-offset: 2px;
    }
  }
  .tool {
    color: var(--ss-cyan);
  }
  .main {
    font-size: var(--ss-ui-lg);
    .nm {
      color: var(--ss-fg);
      font-weight: 500;
    }
  }
  .x {
    color: var(--ss-fg-faint);
    font-variant-numeric: tabular-nums;
  }
</style>
