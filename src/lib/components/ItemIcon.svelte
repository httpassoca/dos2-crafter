<!-- Game icon from the atlas (public/atlas.webp, 25 x 25 cells), or initials when there is none. -->
<script lang="ts">
  import { I, COLS } from '../core/data'

  interface Props {
    k: string
    /** px */
    size?: number
  }
  let { k, size = 32 }: Props = $props()

  const it = $derived(I[k])
  const initials = $derived.by(() => {
    const w = (it ? it.n : k)
      .replace(/[^A-Za-z ]/g, '')
      .split(' ')
      .filter(Boolean)
    return (w[0] || '?')[0] + (w[1] ? w[1][0] : '')
  })
</script>

{#if !it || it.i < 0}
  <i class="ic none" style:--s="{size}px" aria-hidden="true">{initials}</i>
{:else}
  <i class="ic atlas" style:--s="{size}px" style:--x={it.i % COLS} style:--y={(it.i / COLS) | 0} aria-hidden="true"></i>
{/if}

<style lang="scss">
  .ic {
    width: var(--s);
    height: var(--s);
    flex: none;
    display: inline-block;
    position: relative;
  }
  .atlas {
    background-image: url('/atlas.webp');
    background-repeat: no-repeat;
    background-size: calc(var(--s) * 25) calc(var(--s) * 25);
    background-position: calc(var(--x) * var(--s) * -1) calc(var(--y) * var(--s) * -1);
  }
  .none {
    background: var(--ss-badge-neutral-bg);
    border: 1px solid var(--ss-line);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font: 500 calc(var(--s) * 0.34) / 1 var(--ss-font-mono);
    color: var(--ss-fg-faint);
    text-transform: uppercase;
  }
</style>
