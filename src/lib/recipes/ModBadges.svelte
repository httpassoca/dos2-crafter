<!-- Gift bag mod and enchant tags for a recipe (legacy badge()). -->
<script lang="ts">
  import { Badge, Tooltip } from 'dssoca'
  import type { Recipe } from '../core/data'

  let { r }: { r: Recipe } = $props()
</script>

{#if r.m === 'kit'}
  <Tooltip text="Needs the Crafter's Kit gift bag mod">
    <Badge tone="caution">crafter's kit</Badge>
  </Tooltip>
{:else if r.m === 'herb'}
  <Tooltip text="Needs the Herb Gardens gift bag mod">
    <Badge tone="positive">herb gardens</Badge>
  </Tooltip>
{/if}
{#if r.b}<Badge tone="info">enchant</Badge>{/if}
