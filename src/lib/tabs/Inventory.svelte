<!-- Inventory tab: what you have on the left, what you can make from it on the right. -->
<script lang="ts">
  import { untrack } from 'svelte'
  import { S } from '../state.svelte'
  import SaveCard from '../inventory/SaveCard.svelte'
  import StockList from '../inventory/StockList.svelte'
  import ImportCard from '../inventory/ImportCard.svelte'
  import CraftList from '../inventory/CraftList.svelte'
  import { C, pruneQueue } from '../inventory/inv.svelte'

  // queued items the stock can no longer cover drop out of the queue, like the original
  $effect(() => {
    const bad = C.scan.bad
    if (bad.length) untrack(() => pruneQueue(bad))
  })
</script>

<div class="inv">
  <div class="invcol">
    {#if S.base}<SaveCard />{/if}
    <StockList />
    <ImportCard />
  </div>
  <CraftList />
</div>

<style lang="scss">
  .inv {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 400px minmax(0, 1fr);
  }
  .invcol {
    min-height: 0;
    overflow: auto;
    padding: var(--ss-gap);
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap);
    border-right: 1px solid var(--ss-line);
  }
  // phones and narrow windows: one column, the whole tab scrolls
  @media (max-width: 900px) {
    .inv {
      display: block;
      overflow: auto;
    }
    .invcol {
      overflow: visible;
      border-right: 0;
    }
  }
</style>
