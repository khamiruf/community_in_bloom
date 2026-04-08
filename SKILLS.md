# SKILLS.md — Frontend Best Practices

Guidelines for building and maintaining this project. Follow these conventions when adding features or modifying code.

## CSS

- **External stylesheets only** — no inline `<style>` blocks. Import CSS via JS (`import './style.css'`) so Vite can process it.
- **CSS custom properties** for all design tokens (colors, spacing, typography). Define them in `:root` and reference with `var(--token)`.
- **Mobile-first media queries** — write base styles for small screens, then layer on `@media (min-width: ...)` for larger breakpoints.
- **BEM-lite naming** — use flat, descriptive class names (`.garden-item`, `.sidebar-header`). Avoid deep nesting. Prefer `.block-element` over `.block__element--modifier` unless disambiguation is needed.
- **No `!important`** — fix specificity issues by restructuring selectors instead.

## HTML

- **Semantic elements** — use `<aside>`, `<main>`, `<header>`, `<nav>`, `<section>`, `<article>` where appropriate instead of generic `<div>`.
- **Accessibility** — include `aria-label` on icon-only buttons, ensure all interactive elements are keyboard-focusable, maintain logical tab order.
- **Focus states** — every interactive element must have a visible `:focus` or `:focus-visible` style. Use `--gold` for focus rings.

## JavaScript

- **Vanilla JS with ES modules** — no frameworks. Use `import`/`export` for code organization.
- **Cache DOM refs** — query elements once at the top of the module and reuse references. Avoid repeated `document.querySelector` calls in loops or event handlers.
- **`escapeHtml()` for user-facing text** — always escape strings from external data before inserting into the DOM via `innerHTML`.
- **`const` by default** — use `let` only when reassignment is necessary. Never use `var`.
- **Early returns** — prefer guard clauses over deeply nested conditionals.

## Tooling

- **Bun** — package manager and JS runtime. Use `bun install`, `bun add`, `bun run <script>`.
- **Vite** — dev server with HMR and production bundler. Run with `bun run dev` / `bun run build`.
- **No frameworks** — keep the app vanilla. Add libraries only when they provide significant value (e.g., Leaflet for maps).
- **CDN for large external libs** — keep Leaflet and Google Fonts on CDN to avoid bundling them.

## Design System

### Palette (Botanical)

| Token | Value | Usage |
|-------|-------|-------|
| `--forest` | `#1a3a2a` | Primary dark green — headers, buttons |
| `--forest-light` | `#2a5a3a` | Hover states, accents |
| `--cream` | `#f5f0e8` | Page & sidebar backgrounds |
| `--cream-dark` | `#e8e0d0` | Borders, subtle dividers |
| `--gold` | `#c8a84b` | Focus rings, highlights |
| `--gold-light` | `#d4b96a` | Secondary accent |
| `--text` | `#2c2c2c` | Body text |
| `--text-muted` | `#6b6b6b` | Secondary text, counters |

### Typography

- **Headings:** Playfair Display (serif), weights 500/700
- **Body:** DM Sans (sans-serif), weights 400/500/600
- Load via Google Fonts CDN

### Spacing

- Use multiples of 4px for padding/margins (4, 8, 12, 16, 20, 24, 32...)
- Border radius: 6px (small elements), 8px (cards, inputs), 10px (popups)
