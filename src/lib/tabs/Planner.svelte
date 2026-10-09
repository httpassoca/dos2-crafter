<!-- Planner tab: pick targets, see the full crafting tree and what to gather. -->
<script lang="ts">
  import Picker from '../planner/Picker.svelte'
  import Targets from '../planner/Targets.svelte'
  import Tree from '../planner/Tree.svelte'
  import PlanPanel from '../planner/PlanPanel.svelte'
  import { t } from '../i18n/index.svelte'
</script>

<div class="plan">
  <div class="bar">
    <Picker />
    <Targets />
  </div>
  <div class="work">
    <Tree />
    <aside class="side" aria-label={t('planner.side')}>
      <PlanPanel />
    </aside>
  </div>
</div>

<style lang="scss">
  .plan {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .bar {
    display: flex;
    gap: var(--ss-gap);
    align-items: center;
    flex-wrap: wrap;
    padding: var(--ss-gap) var(--ss-main-px);
    border-bottom: 1px solid var(--ss-line);
    flex: none;
    /* the picker's dropdown overlays the tree */
    position: relative;
    z-index: 10;
  }
  .work {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 400px;
    > :global(.stage) {
      border-right: 1px solid var(--ss-line);
    }
  }
  .side {
    min-height: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: var(--ss-gap);
    padding: var(--ss-gap);
  }
  @media (max-width: 900px) {
    .plan {
      overflow: auto;
    }
    .bar {
      padding: var(--ss-gap);
    }
    .work {
      display: block;
      flex: none;
      > :global(.stage) {
        height: 62vh;
        border-right: 0;
        border-bottom: 1px solid var(--ss-line);
      }
    }
    .side {
      overflow: visible;
    }
  }
</style>
