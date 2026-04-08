# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Community in Bloom** is a web app that displays Singapore's NParks Community in Bloom (CIB) garden locations on an interactive Leaflet map. Built with vanilla JS, bundled with Vite, managed with Bun.

## Running

```bash
bun install          # install dependencies
bun run dev          # start Vite dev server with HMR
bun run build        # production build to dist/
bun run preview      # preview production build
```

There is no test suite.

## File Structure

```
index.html           # entry point (Vite serves this at root)
src/
  style.css          # all CSS
  main.js            # all JS (ES module, imports style.css)
package.json         # Bun/Vite config and scripts
CLAUDE.md            # this file
SKILLS.md            # frontend best practices and conventions
```

## Data Source

Garden data comes from Singapore's open data API (data.gov.sg) in two steps:

1. **Poll for download URL:** `GET https://api-open.data.gov.sg/v1/public/api/datasets/d_f91a8b057cfb2bebf2e531ad8061e1c1/poll-download`
2. **Fetch GeoJSON** from the URL returned in `response.data.url`

Each GeoJSON Feature has `GARDEN_NAME`, `LATITUDE`, `LONGITUDE` in properties. The API supports CORS — no proxy needed.

## Tech Stack

- **Vite** — dev server with HMR + production bundler
- **Bun** — package manager and JS runtime
- **Leaflet.js** (CDN) with OpenStreetMap tiles — no API key required
- **Google Fonts** — Playfair Display (headings) + DM Sans (body)
- Vanilla JS with ES modules, no framework

## Architecture

The app uses a simple imperative pattern in `src/main.js`:

- **Map setup** — Leaflet map centered on Singapore (`[1.3521, 103.8198]`)
- **Custom markers** — `L.divIcon` with inline SVG (green teardrop shape)
- **State** — `gardens[]` array holds all loaded features; `filtered[]` is the current visible subset
- **`render()`** — the core function that syncs the sidebar list and map markers with the current search query
- **`loadGardens()`** — async function that fetches data, creates markers, sorts alphabetically, fits map bounds, then calls `render()`

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--forest` | `#1a3a2a` | Primary dark green |
| `--cream` | `#f5f0e8` | Backgrounds |
| `--gold` | `#c8a84b` | Accent / focus states |

## Layout

- **Desktop:** Fixed left sidebar (380px) with search + scrollable garden list; map fills remaining space
- **Mobile (<=768px):** Sidebar slides in as an overlay with a hamburger toggle and backdrop

## Conventions

See `SKILLS.md` for frontend best practices covering CSS, HTML, JS, tooling, and design system guidelines.
