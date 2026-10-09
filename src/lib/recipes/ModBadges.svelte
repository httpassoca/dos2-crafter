<!-- Gift bag mod and enchant tags for a recipe (legacy badge()). -->
<script lang="ts">
  import { Badge, Tooltip } from 'dssoca'
  import type { Recipe } from '../core/data'
  import { t, kindLabel } from '../i18n/index.svelte'

  let { r }: { r: Recipe } = $props()
</script>

{#if r.m === 'kit'}
  <Tooltip text={t('mod.kit.tip')}>
    <Badge tone="caution">{t('mod.kit')}</Badge>
  </Tooltip>
{:else if r.m === 'herb'}
  <Tooltip text={t('mod.herb.tip')}>
    <Badge tone="positive">{t('mod.herb')}</Badge>
  </Tooltip>
{/if}
{#if r.b}<Badge tone="info">{kindLabel('enchant')}</Badge>{/if}
