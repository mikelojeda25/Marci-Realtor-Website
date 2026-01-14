# Copilot instructions — marci-metzger

Purpose: help AI coding agents become productive quickly in this repository.

High-level architecture
- Static site built with Vite (ESM). Entry points:
  - `index.html` (root HTML shell)
  - `src/index.js` (DOM behaviour, vanilla JS)
  - `src/main.ts` + `src/counter.ts` (small TypeScript module examples)
- Assets live under `src/assets/*` (gallery images) and `public/`.
- Styling primarily via Tailwind; Vite uses `@tailwindcss/vite` plugin (see `vite.config.ts`).

Important workflows / commands
- Dev: `npm run dev` — starts Vite dev server (hot reload).
- Build: `npm run build` — runs `tsc` (type-check only) then `vite build`.
  - Note: `tsconfig.json` has `noEmit: true`, so `tsc` is used for type-checking only.
- Preview: `npm run preview` — preview production build.

Project-specific patterns & gotchas
- Mixed JS and TS: the site mixes `src/index.js` (plain JS) with `src/*.ts`. Keep that split — do not blindly convert all JS files to TS without updating imports and build expectations.
- Explicit TS extension in imports: code uses `import './counter.ts'` in `src/main.ts` — follow existing import styles.
- ESM + `type: "module"`: package.json sets module mode; use ESM imports/exports.
- DOM-first structure: heavy reliance on ID/class selectors in `src/index.js` and markup in `index.html`. Changing IDs or structure will likely break interactions (menu, gallery, scroll effects).
- Images referenced by relative paths (e.g. `./src/assets/Gallery/1.webp`) — keep paths consistent with Vite's asset handling.

Integration points
- Tailwind plugin: `vite.config.ts` registers `@tailwindcss/vite`. Tailwind config may be absent; updating styles may require adding `tailwind.config.js`.
- TypeScript typing: `tsconfig.json` includes `types: ["vite/client"]`. Type-checking is enforced during build.

Where to look for examples
- `index.html` — overall page structure and the markup that JS manipulates.
- `src/index.js` — canonical patterns for DOM manipulation, event listeners, IntersectionObserver usage, gallery logic.
- `src/main.ts` and `src/counter.ts` — example TypeScript usage and Vite import style.
- `vite.config.ts` and `package.json` — dev/build scripts and plugins.

How to make safe changes
- If changing markup that JS uses, update corresponding selectors in `src/index.js` and test the dev server.
- Preserve ESM import style and the explicit `.ts` extension where present.
- Use `npm run dev` for iterative work; run `npm run build` to verify type-checking + production bundle.

If you edit or add pages/components
- Keep logic in `src/index.js` for global DOM code. For non-global modules, add new files under `src/` and import them from `src/main.ts` or `index.js` depending on TS/JS choice.
- Prefer small, focused modules (see `src/counter.ts`) and avoid heavy frameworks — this repo is framework-free.

Quick checklist for PRs
- Run `npm run dev` and manually verify interactive features (menu, gallery, navbar behavior).
- Run `npm run build` to catch TypeScript errors (type-check step).
- Ensure image paths and Tailwind classes remain valid.

Questions / uncertain areas to ask the repo owner
- Is Tailwind configured via an external `tailwind.config.js` we should add or modify?
- Are you open to converting `src/index.js` to TypeScript, or should we keep JS-only interactions?

---
If anything above is unclear or you want this expanded (examples, code snippets, or automation for checks), tell me which area to deepen.
