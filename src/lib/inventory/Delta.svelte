<!-- One item with how much of it goes down or up: icon, name, −n / +n. -->
<script lang="ts">
  import { nm } from '../core/data'
  import ItemIcon from '../components/ItemIcon.svelte'
  import type { Change } from './helpers'

  interface Props {
    k: string
    changes: Change[]
  }
  let { k, changes }: Props = $props()
</script>

<span class="qi">
  <ItemIcon {k} size={20} />
  <span>{nm(k)}</span>
  {#each changes as c, i (i)}
    <b class={c.n < 0 ? 'dn' : 'up'} title={c.title}>{c.n < 0 ? '−' : '+'}{Math.abs(c.n)}{c.note ? ' ' + c.note : ''}</b>
  {/each}
</span>

<style lang="scss">
  .qi {
    font-size: var(--ss-ui-md);
    display: inline-flex;
    align-items: center;
    gap: var(--ss-gap-xs);
  }
  b {
    font: 700 var(--ss-ui-md) var(--ss-font-mono);
  }
  .dn {
    color: var(--ss-red);
  }
  .up {
    color: var(--ss-primary);
  }
</style>
