<!-- Renders a translated sentence with inline parts: each `{name}` token in `text` is replaced by
     `parts[name]` (a snippet from the caller, e.g. a Link or <strong>). Everything else is plain text,
     so dictionary content is never treated as HTML. Unknown tokens are shown as written. -->
<script lang="ts">
  import type { Snippet } from 'svelte'

  let { text, parts = {} }: { text: string; parts?: Record<string, Snippet> } = $props()

  // split() with a capture group: even indexes are text, odd indexes are token names
  const chunks = $derived(text.split(/\{(\w+)\}/g))
</script>

{#each chunks as c, i (i)}{#if i % 2 === 0}{c}{:else if parts[c]}{@render parts[c]()}{:else}{`{${c}}`}{/if}{/each}
