# dos2 crafter

Crafting planner for **Divinity: Original Sin 2 — Definitive Edition**, built with Svelte 5 and the
[dssoca](https://www.npmjs.com/package/dssoca) design system.

- **inventory** — enter what you carry, import a list, or load a `.lsv` save (read in your browser,
  never uploaded). See everything you can craft, queue crafts, and write the result back to a copy
  of the save.
- **planner** — pick items to craft and get the full ingredient tree down to raw materials, with totals.
- **recipes** — all 772 recipes, searchable and filterable, including gift bag mod recipes.
- **notes** — where the data comes from and how the planner counts.

Recipes come from the Steam guide *Complete crafting tables (700+ positions) for DOS:II*; icons,
effects and values from the Fextralife wiki. Writing saves is experimental: always back up your
save folder first.

## Develop

```sh
pnpm install
pnpm dev      # local dev server
pnpm check    # svelte-check
pnpm test     # Vitest; save tests run only when fixtures/*.lsv exist (gitignored)
pnpm build    # static build in dist/
```

`legacy/original.html` is the original single-file page; golden tests pin the ported core to it.
