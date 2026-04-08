# Community in Bloom

An interactive map of Singapore's [Community in Bloom (CIB)](https://www.nparks.gov.sg/gardening/community-in-bloom) gardens, built with Leaflet and Vite.

![Singapore community gardens on an interactive map](https://img.shields.io/badge/data-data.gov.sg-red)

## Features

- Browse all NParks Community in Bloom garden locations on a map
- Search gardens by name
- Detects your location (if permitted) and sorts gardens by proximity
- Get directions to any garden via Google Maps

## Running locally

```bash
bun install
bun run dev
```

Then open `http://localhost:5173`.

## Deployment

This is a static site. Build with:

```bash
bun run build   # outputs to dist/
```

Deploy the `dist/` folder to any static host. Recommended: **Cloudflare Pages** (connect your GitHub repo, set build command to `bun run build`, output directory to `dist`).

> **Note:** In dev, garden data is fetched via a Vite proxy to work around a CORS restriction on the S3 download URL. In production, a Cloudflare Pages Function (`functions/geojson.js`) proxies both the poll and S3 fetch server-side, so no CORS issue.

## Data

Garden data is fetched at runtime from Singapore's open data platform:

- **API:** `data.gov.sg` — dataset `d_f91a8b057cfb2bebf2e531ad8061e1c1`
- No API key required
- Data is not bundled — always reflects the latest published dataset

## Tech stack

- [Leaflet.js](https://leafletjs.com) — interactive map
- [OpenStreetMap](https://www.openstreetmap.org) — map tiles
- [Vite](https://vite.dev) — dev server and bundler
- [Bun](https://bun.sh) — package manager
