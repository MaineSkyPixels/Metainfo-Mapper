# Metainfo Plotter

Secure web-hosted viewer for plotting drone imagery metadata while keeping every photo on the client device.

## Highlights

- **Dark-first UI** – switch between dark and light themes with a single click.
- **Browser-only workflow** – EXIF parsing and KML generation happen entirely in the user's browser, so no media is uploaded.
- **Instant previews** – Load hundreds of JPGs and visualise metadata immediately, even when you stay offline.
- **Mission storytelling** – Build sessions, visualise paths, surface GPS gaps, and export shareable KML in seconds.
- **Created in Maine** – Open-source project by a professional drone pilot focused on privacy-first field tools.

## Prerequisites

- Node.js v18 or newer
- (Optional) MBTiles datasets in `mbt/` if you want local base maps
- JPG/JPEG images containing GPS EXIF metadata

## Installation & Launch

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the browser bundle whenever `src/` changes:
   ```bash
   npm run build:client
   ```
3. (Optional) Development workflow:
   ```bash
   npm run watch:client   # rebuilds client bundle on change
   npm run dev            # restarts Express via nodemon
   ```
4. (Optional) Configure streaming basemaps by exporting environment variables before launch (a browser-side token field is also available on the landing page):
   - `MAPBOX_ACCESS_TOKEN` for your Mapbox token scoped to the chosen styles.
   - `MAPBOX_STYLE` to override the default `mapbox/satellite-streets-v12` hybrid layer.
   - `MAPBOX_MIN_ZOOM` and `MAPBOX_MAX_ZOOM` when you need a different zoom window.
5. Start the hardened server:
   ```bash
   npm start
   ```
6. Open `http://localhost:3030` (or your configured host/port).

## Usage

1. Name your mission and click **Start New Session**.
2. Drag-and-drop JPGs or choose a folder; EXIF is parsed locally.
3. Inspect markers, paths, and GPS gaps directly on the map.
4. Export the session as KML or download the error log for documentation.
5. Click **Open in Google My Maps** to download the latest KML and launch My Maps, then choose "Create a new map" → "Import" and select the downloaded file.
6. Load previous KML sessions to continue work.

### Token Help

- Need a Mapbox access token? Open `mapbox-token-help.html` (linked under the Basemap Token panel) for a step‑by‑step guide to creating a free Mapbox account and generating a token.

## Basemap Behaviour

- Local MBTiles remain the default layer for offline resilience and are reinstated automatically if Mapbox tiles fail to load.
- Supplying `MAPBOX_ACCESS_TOKEN` (or pasting a token into the new **Basemap Token** panel on the landing page) enables Mapbox's hybrid satellite tiles; the browser stores manual tokens locally and overrides the server value until cleared.
- When Mapbox is active the map view is clamped to the flight area with roughly a 2,000 ft buffer and zoom levels 15-18 to balance coverage with tile usage.

### UI Notes

- The “What it does” panel is shown as a small map overlay on the left for readability.
- The intro panel appears on first load and hides automatically when a session starts or data is loaded.
- The Basemap Token panel lives beneath Progress in the sidebar to reduce accidental requests.

## Cloudflare Pages Deployment

- The `Cloudflare/` directory contains the production-ready static bundle (copied from `public/` after running `npm run build:client`). It includes `index.html`, `css/`, `js/`, and `lib/` assets required for Pages hosting.
- Server-side code (`server.js`, `node_modules/`, `src/`, batch installers, MBTiles) is not required on Cloudflare Pages. Only deploy the contents of `Cloudflare/`.
- To refresh on-demand:
  - `npm run build:client`
  - `npm run sync:cloudflare` (or run `update-cloudflare.ps1` / `update-cloudflare.bat`)
  - Optionally commit/push from the `Cloudflare/` repo if you’re using a separate Pages repo.
- Initial Pages setup: point your Pages project to the `Cloudflare` folder (no build command).

### Update & Sync (On-demand)

- Build the client: `npm run build:client`
- Sync static bundle: `npm run sync:cloudflare`
- If using a separate Pages repo: `cd Cloudflare && git add -A && git commit -m "Sync bundle" && git push`

## Easter Eggs (Optional)

- Add `?frak=yeah` to the URL for a small BSG-themed console message and a subtle amber pulse.
- Add `?chevron=7` to the URL for a Stargate nod and cyan pulse.
- Add `?signature=on` to embed a one‑line DRADIS signature comment inside exported KML (no data exfiltration; local only).


## Directory Layout

```
Web/
├── CHANGELOG.md    # Release notes for the web build
├── public/         # Static assets served by Express (includes built bundle)
├── src/            # Client-side source code bundled with esbuild
├── mbt/            # MBTiles datasets (read-only)
├── server.js       # Hardened Express host for static + tile requests
├── package.json    # Scripts, dependencies, and build tasks
└── dependencies.txt# Minimal runtime requirements
```

## Security Posture

- Only `/tiles` and `/health` endpoints are exposed; there are no upload routes, and everything else happens client-side.
- All media parsing stays in your browser; after the page loads it continues to work offline until you close the tab.
- Cross-origin requests are blocked by default—host behind HTTPS and authentication in production.
- KML/HTML exports escape user-provided text to prevent injection.

## Notes

- Large batches rely on browser memory; split uploads if your hardware is constrained.
- Consider self-hosting Leaflet/JSZip/exifr bundles for completely offline environments.
- Regenerate the client bundle with `npm run build:client` before redeploying.

