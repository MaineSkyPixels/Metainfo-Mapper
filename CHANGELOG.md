# Changelog

## 1.4.2 - 2025-09-30
- Added Mapbox streaming support with MBTiles fallback exposed via `/map-config`.
- Basemap Token panel (browser-side) with localStorage persistence; token help page at `mapbox-token-help.html`.
- Constrained Mapbox requests to flight bounds with ~2,000 ft buffer and zoom levels 15–18.
- Repositioned “What it does” into a left map overlay; removed the large “Ready to visualise” overlay; improved dark/light map background.
- Fixed theme toggle to bind once during startup.
- Added About/Ownership card with contact and GitHub link; refined small typography.
- Introduced Cloudflare/ static bundle and on-demand sync scripts: `update-cloudflare.ps1` / `update-cloudflare.bat` and `npm run sync:cloudflare`.
- Optional easter eggs: URL flags (`?frak=yeah`, `?chevron=7`, `?signature=on`) with small CSS pulses and opt-in KML signature comment.

## 1.4.1 - 2025-09-30
- Removed the New England map clamp; the canvas now pans across the entire MBTiles coverage.
- Clarified privacy messaging to state the app remains 100% offline once loaded.
- Documented the dark-first/light theme toggle in the README.

## 1.4.0 - 2025-09-30
- Rebranded the interface to *Metainfo Plotter* with refreshed copy highlighting the Maine-based, client-side nature of the project.
- Added a first-run privacy notice modal to reassure pilots that no images or visitor data are ever uploaded or logged.
- Introduced new sidebar and map styling with welcome messaging and feature highlights for a more polished landing experience.
- Introduced a dark-first theme with a light/dark toggle and persistent preference storage.
- Condensed the hero overlay into a compact badge once a session begins.

## 1.3.1 - 2025-09-30
- Removed the KMZ export option; KML remains the primary download format.
- Updated the My Maps button to download the latest KML automatically before opening Google My Maps.

## 1.3.0 - 2025-09-30
- Added an **Open in Google My Maps** action and guidance text after generating KML files.
- Reset KML state when imagery changes and prebuild exports for loaded sessions to keep downloads/My Maps in sync.

## 1.2.1 - 2025-09-30
- Adjusted exported KML placemarks to emit blank `<name>` elements while keeping filenames in descriptions for better viewer compatibility.

## 1.2.0 - 2025-09-30
- Hardened Express backend: removed upload endpoints, added Helmet + rate limiting, and scoped routes to static assets, `/tiles`, and `/health` only.
- Rebased MBTiles loader to close handles safely and validate tile requests before serving.
- Migrated EXIF parsing to the browser; all image handling now stays client-side with progress feedback and improved error reporting.
- Escaped all KML/HTML output to prevent markup injection and clarified client messaging about local-only processing.
- Introduced esbuild bundling pipeline (`src/app.js` → `public/js/app.js`) with build/watch scripts.
- Refreshed README guidance covering secure deployment, development workflow, and SPA architecture.


