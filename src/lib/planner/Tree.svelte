<!-- The crafting tree: engine build() layout drawn as positioned nodes + SVG connectors.
     Zoom (buttons, ctrl/⌘+wheel, shortcuts), mouse-drag pan, fit and centre the root. -->
<script lang="ts">
  import { onMount } from 'svelte'
  import { Button, EmptyState, Tooltip, shortcut } from 'dssoca'
  import { I, nm } from '../core/data'
  import { build, recipesFor, NW, NH, CW } from '../core/engine'
  import { S } from '../state.svelte'
  import { P, ui, openItem, addTarget, cycleRecipe } from '../ui.svelte'
  import ItemIcon from '../components/ItemIcon.svelte'
  import type { Tree, TreeNode } from './types'
  import { grew } from './track'
  import { t } from '../i18n/index.svelte'

  const EXAMPLES = ['giantflameruneofpower', 'cursedfirestormgrenade', 'hugehealingpotion', 'staticcloudarrow', 'fireballskillbook', 'pizza'].filter(
    (k) => I[k],
  )

  const T: Tree = $derived.by(() => {
    void P.values.v
    return build() as Tree
  })
  const gather = $derived(P.plan.gather as Map<string, number>)

  /** canvas position of a node (top-left) */
  const px = (n: TreeNode) => 20 + n.depth * CW
  const py = (n: TreeNode) => 10 + n.y

  interface View {
    n: TreeNode
    x: number
    y: number
    miss: number
    cls: string
    q: number | null
    txt: string
    label: string
    edge: string | null
    edgeCls: string
    /** recipe index shown on the ⇄ control, 1-based */
    ri: number
  }

  const views: View[] = $derived.by(() =>
    T.nodes.map((n) => {
      const miss = gather.get(n.k) || 0,
        x = px(n),
        y = py(n),
        mc = miss ? 'miss' : 'ok'
      let cls: string = n.kind,
        q: number | null = n.q,
        txt = '',
        ri = 0
      if (n.kind === 'craft') {
        txt = n.n !== n.q || n.out! > 1 ? t('planner.node.craftN', { n: n.n!, m: n.out! * n.n! }) : t('planner.node.craft')
        if (n.nr! > 1) ri = recipesFor(n.k).indexOf(n.r!) + 1
      } else if (n.kind === 'raw') {
        cls += ' ' + mc
        txt = miss ? t('planner.node.gather') : t('planner.node.inStock')
      } else if (n.kind === 'tool') {
        q = null
        txt = n.station ? t('planner.node.station') : t('planner.node.tool')
      } else if (n.kind === 'held') {
        cls += ' raw ' + mc
        txt = t('planner.node.held')
      } else {
        cls = 'held raw ' + mc
        txt = t('planner.node.cycle')
      }
      let edge: string | null = null
      if (n.parent) {
        const x1 = px(n.parent) + NW,
          y1 = py(n.parent) + NH / 2,
          y2 = y + NH / 2,
          mx = x1 + (x - x1) / 2
        edge = `M${x1} ${y1}H${mx}V${y2}H${x}`
      }
      const edgeCls = n.kind === 'tool' ? 'tool' : n.kind !== 'craft' ? mc : ''
      return { n, x, y, miss, cls, q, txt, label: n.label || nm(n.k), edge, edgeCls, ri }
    }),
  )

  // ---- zoom / pan ----
  let sc = $state<HTMLElement>()
  const clampZ = (z: number) => Math.min(1.6, Math.max(0.3, +z.toFixed(2)))
  const zoomBy = (d: number) => (S.zoom = clampZ(S.zoom + d))

  function fit(min: number) {
    if (!sc) return
    S.zoom = Math.min(1, Math.max(min, +Math.min(sc.clientWidth / (T.w || 1), sc.clientHeight / (T.h || 1)).toFixed(2)))
  }
  function centerRoot() {
    if (!sc) return
    const ry = T.roots.length ? py(T.roots[0]) + NH / 2 : 0
    sc.scrollLeft = 0
    sc.scrollTop = Math.max(0, ry * S.zoom - sc.clientHeight / 2)
  }
  /** wait for the sizer to take the new zoom before scrolling */
  const centerSoon = () => requestAnimationFrame(centerRoot)

  // Fit + centre when something was added to the plan (legacy addTarget), centre on first show.
  let mounted = false
  $effect(() => {
    const ts = S.targets.map((x) => ({ k: x.k, q: x.q }))
    if (grew(ts)) {
      fit(0.6)
      centerSoon()
    } else if (!mounted) centerSoon()
    mounted = true
  })

  let drag: { x: number; y: number; l: number; t: number } | null = null
  let dragging = $state(false)
  function down(e: PointerEvent) {
    if (!sc || e.pointerType !== 'mouse' || e.button !== 0 || (e.target as Element).closest('.node')) return
    drag = { x: e.clientX, y: e.clientY, l: sc.scrollLeft, t: sc.scrollTop }
    dragging = true
    sc.setPointerCapture(e.pointerId)
  }
  function move(e: PointerEvent) {
    if (!drag || !sc) return
    sc.scrollLeft = drag.l - (e.clientX - drag.x)
    sc.scrollTop = drag.t - (e.clientY - drag.y)
  }
  function up() {
    drag = null
    dragging = false
  }

  onMount(() => {
    const wheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      zoomBy(e.deltaY < 0 ? 0.1 : -0.1)
    }
    sc!.addEventListener('wheel', wheel, { passive: false })
    return () => sc?.removeEventListener('wheel', wheel)
  })

  const toggleCol = (k: string) => {
    if (S.col[k]) delete S.col[k]
    else S.col[k] = 1
  }
  const nextOpt = (n: TreeNode) => (S.oc[n.ok!] = (n.oi! + 1) % n.on!)
</script>

<div
  class="stage"
  {@attach shortcut(() => ({
    id: 'plan:zoom-in',
    label: t('planner.sc.zoomIn'),
    keys: '=, +',
    group: t('planner.group'),
    onPress: () => zoomBy(0.1),
  }))}
  {@attach shortcut(() => ({
    id: 'plan:zoom-out',
    label: t('planner.sc.zoomOut'),
    keys: '-',
    group: t('planner.group'),
    onPress: () => zoomBy(-0.1),
  }))}
  {@attach shortcut(() => ({
    id: 'plan:fit',
    label: t('planner.fit'),
    keys: '0',
    group: t('planner.group'),
    onPress: () => {
      fit(0.3)
      centerSoon()
    },
  }))}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -- mouse-only drag-to-pan; scrolling covers keyboard/touch -->
  <div
    class="scroller"
    class:drag={dragging}
    bind:this={sc}
    onpointerdown={down}
    onpointermove={move}
    onpointerup={up}
    onpointercancel={up}
  >
    {#if S.targets.length}
      <div class="sizer" style:width="{T.w * S.zoom}px" style:height="{T.h * S.zoom}px">
        <div
          class="canvas"
          role="group"
          aria-label={t('planner.tree')}
          style:width="{T.w}px"
          style:height="{T.h}px"
          style:transform="scale({S.zoom})"
          style:--nw="{NW}px"
          style:--nh="{NH}px"
        >
          <svg width={T.w} height={T.h} aria-hidden="true">
            {#each views as v, i (i)}
              {#if v.edge}<path class="edge {v.edgeCls}" d={v.edge} />{/if}
            {/each}
          </svg>
          {#each views as v, i (i)}
            <div
              class="node {v.cls}"
              class:root={v.n.root}
              class:sel={v.n.k === ui.item}
              style:left="{v.x}px"
              style:top="{v.y}px"
            >
              <button type="button" class="main" onclick={() => openItem(v.n.k)}>
                <ItemIcon k={v.n.k} size={40} />
                <span class="tx">
                  <span class="nm">{v.label}</span>
                  <span class="q">{#if v.q != null}<b>×{v.q}</b>{" "}{/if}{v.txt}</span>
                </span>
              </button>
              {#if v.n.ok || v.n.kind === 'craft' || v.n.kind === 'held'}
                <div class="ctl">
                  {#if v.n.ok}
                    <button
                      type="button"
                      title={t('planner.opt.title', { n: v.n.on! })}
                      aria-label={t('planner.opt.aria', { name: v.label, i: v.n.oi! + 1, n: v.n.on! })}
                      onclick={() => nextOpt(v.n)}>{t('planner.opt.or', { i: v.n.oi! + 1, n: v.n.on! })}</button
                    >
                  {/if}
                  {#if v.n.kind === 'craft'}
                    {#if v.ri}
                      <button
                        type="button"
                        title={t('planner.recipe.title')}
                        aria-label={t('planner.recipe.aria', { name: v.label, i: v.ri, n: v.n.nr! })}
                        onclick={() => cycleRecipe(v.n.k)}>⇄ {v.ri}/{v.n.nr}</button
                      >
                    {/if}
                    <button
                      type="button"
                      title={t('planner.stop.title')}
                      aria-label={t('planner.stop.aria', { name: v.label })}
                      onclick={() => toggleCol(v.n.k)}>−</button
                    >
                  {:else if v.n.kind === 'held'}
                    <button
                      type="button"
                      title={t('planner.expand.title')}
                      aria-label={t('planner.expand.aria', { name: v.label })}
                      onclick={() => toggleCol(v.n.k)}>+</button
                    >
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  {#if !S.targets.length}
    <div class="empty">
      <EmptyState
        title={t('planner.empty.title')}
        message={t('planner.empty.message')}
      >
        {#snippet action()}
          <div class="ex">
            {#each EXAMPLES as k (k)}
              <Button size="sm" onclick={() => addTarget(k)}>
                {#snippet leading()}<ItemIcon {k} size={20} />{/snippet}
                {nm(k)}
              </Button>
            {/each}
          </div>
        {/snippet}
      </EmptyState>
    </div>
  {:else}
    <div class="legend" aria-hidden="true">
      <span><i class="craft"></i>{t('planner.legend.craft')}</span>
      <span><i class="miss"></i>{t('planner.legend.miss')}</span>
      <span><i class="ok"></i>{t('planner.legend.ok')}</span>
      <span><i class="tool"></i>{t('planner.legend.tool')}</span>
      <span><i class="held"></i>{t('planner.legend.held')}</span>
    </div>
    <div class="zoom" role="group" aria-label={t('planner.zoom')}>
      <Button size="sm" variant="ghost" iconOnly label={t('planner.zoomOut')} onclick={() => zoomBy(-0.1)}>−</Button>
      <Tooltip text={t('planner.fit')}>
        <Button
          size="sm"
          variant="ghost"
          aria-label={t('planner.fit.aria', { pct: Math.round(S.zoom * 100) })}
          onclick={() => {
            fit(0.3)
            centerSoon()
          }}>{Math.round(S.zoom * 100)}%</Button
        >
      </Tooltip>
      <Button size="sm" variant="ghost" iconOnly label={t('planner.zoomIn')} onclick={() => zoomBy(0.1)}>+</Button>
    </div>
  {/if}
</div>

<style lang="scss">
  .stage {
    position: relative;
    min-width: 0;
    min-height: 0;
    background-color: var(--ss-bg);
    background-image:
      linear-gradient(color-mix(in srgb, var(--ss-line) 14%, transparent) 1px, transparent 1px),
      linear-gradient(90deg, color-mix(in srgb, var(--ss-line) 14%, transparent) 1px, transparent 1px);
    background-size: var(--ss-s-10) var(--ss-s-10);
    background-position: -1px -1px;
  }
  .scroller {
    position: absolute;
    inset: 0;
    overflow: auto;
    cursor: grab;
    touch-action: pan-x pan-y;
    &.drag {
      cursor: grabbing;
      user-select: none;
    }
  }
  .canvas {
    position: relative;
    transform-origin: 0 0;
  }
  svg {
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
    pointer-events: none;
  }
  .edge {
    fill: none;
    stroke: var(--ss-line-strong);
    stroke-width: 1.5;
    &.tool {
      stroke-dasharray: 3 4;
      stroke: var(--ss-cyan);
      opacity: 0.55;
    }
    &.miss {
      stroke: var(--ss-red);
      opacity: 0.7;
    }
    &.ok {
      stroke: var(--ss-primary);
      opacity: 0.55;
    }
  }

  /* graph nodes: world coordinates, scaled as a whole by the canvas */
  .node {
    position: absolute;
    width: var(--nw);
    height: var(--nh);
    display: flex;
    align-items: center;
    background: var(--ss-bg-elev);
    border: 1px solid var(--ss-line-strong);
    border-left: 3px solid var(--ss-fg-faint);
    transition: background var(--ss-dur-fast) var(--ss-ease);
    &:hover {
      background: var(--ss-bg-elev-hover);
    }
    &.sel {
      box-shadow: 0 0 0 2px var(--ss-primary);
    }
    &.craft {
      border-left-color: var(--ss-blue);
    }
    &.raw.ok {
      border-left-color: var(--ss-primary);
    }
    &.raw.miss {
      border-left-color: var(--ss-red);
      .q b {
        color: var(--ss-red);
      }
    }
    &.held {
      border-left-color: var(--ss-yellow);
    }
    &.tool {
      border-style: dashed;
      border-left-style: solid;
      border-left-color: var(--ss-cyan);
      background: var(--ss-bg);
    }
    &.root {
      border-left-color: var(--ss-primary);
      background: var(--ss-bg-elev);
      .nm {
        color: var(--ss-fg-shine);
      }
    }
  }
  .main {
    flex: 1;
    min-width: 0;
    align-self: stretch;
    display: flex;
    align-items: center;
    gap: var(--ss-gap-sm);
    padding: 0 var(--ss-gap-xs) 0 var(--ss-gap-sm);
    background: transparent;
    border: 0;
    color: inherit;
    text-align: left;
    cursor: pointer;
    &:focus-visible {
      outline: 2px solid var(--ss-primary);
      outline-offset: 1px;
    }
  }
  .tx {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .nm {
    font-size: var(--ss-ui-md);
    line-height: 1.15;
    color: var(--ss-fg);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .q {
    font: 500 var(--ss-ui-xs)/1.2 var(--ss-font-mono);
    color: var(--ss-fg-faint);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    b {
      color: var(--ss-fg);
      font-weight: 700;
      font-size: var(--ss-ui-md);
    }
  }
  .ctl {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-self: stretch;
    justify-content: center;
    padding-right: var(--ss-gap-xs);
    button {
      background: var(--ss-bg);
      border: 1px solid var(--ss-line);
      color: var(--ss-fg-muted);
      font: 500 var(--ss-ui-xs)/1 var(--ss-font-mono);
      padding: 3px var(--ss-gap-xs);
      min-width: var(--ss-s-8);
      white-space: nowrap;
      cursor: pointer;
      &:hover,
      &:focus-visible {
        color: var(--ss-fg);
        border-color: var(--ss-primary);
        outline: none;
      }
    }
  }

  .empty {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    padding: var(--ss-gap);
  }
  .ex {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ss-gap-sm);
    justify-content: center;
    max-width: 560px;
  }
  .legend {
    position: absolute;
    left: var(--ss-s-3);
    bottom: var(--ss-s-3);
    z-index: 5;
    display: flex;
    gap: var(--ss-gap-sm);
    flex-wrap: wrap;
    font-size: var(--ss-ui-xs);
    color: var(--ss-fg-faint);
    background: var(--ss-bg);
    border: 1px solid var(--ss-line);
    padding: var(--ss-gap-xs) var(--ss-gap-sm);
    max-width: calc(100% - 150px);
    i {
      display: inline-block;
      width: var(--ss-s-2);
      height: var(--ss-s-2);
      margin-right: var(--ss-gap-xs);
      &.craft {
        background: var(--ss-blue);
      }
      &.miss {
        background: var(--ss-red);
      }
      &.ok {
        background: var(--ss-primary);
      }
      &.tool {
        background: var(--ss-cyan);
      }
      &.held {
        background: var(--ss-yellow);
      }
    }
  }
  .zoom {
    position: absolute;
    right: var(--ss-s-3);
    bottom: var(--ss-s-3);
    z-index: 5;
    display: flex;
    align-items: center;
    background: var(--ss-bg-elev);
    border: 1px solid var(--ss-line-strong);
  }
  @media (max-width: 900px) {
    .legend {
      display: none;
    }
  }
</style>
