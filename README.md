# Metainfo Mapper

A privacy-first, client-side web application for visualizing drone imagery GPS metadata while keeping every photo on the client device. Built by Maine Sky Pixels LLC for drone pilots and aerial photographers.

## Highlights

- **Dark-first UI** – switch between dark and light themes with a single click.
- **Browser-only workflow** – EXIF parsing and KML generation happen entirely in the user's browser, so no media is uploaded.
- **Instant previews** – Load hundreds of JPGs and visualise metadata immediately, even when you stay offline.
- **Mission storytelling** – Build sessions, visualise paths, surface GPS gaps, and export shareable KML in seconds.
- **Blank canvas default** – Images are plotted on a clean canvas with georeferenced positioning by default.
- **Optional Mapbox integration** – Add satellite imagery backgrounds with a free Mapbox token (completely optional).
- **Community support** – Join our Discord server for help, feedback, and feature requests.
- **Created in Maine** – Open-source project by a professional drone pilot focused on privacy-first field tools.

## Prerequisites

- JPG/JPEG images containing GPS EXIF metadata

## Installation & Launch


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

- The application displays images on a blank canvas by default, with georeferenced positioning.
- Supplying `MAPBOX_ACCESS_TOKEN` (or pasting a token into the **Basemap Token (Optional)** panel on the landing page) enables Mapbox's hybrid satellite tiles; the browser stores manual tokens locally and overrides the server value until cleared.
- When Mapbox is active the map view is clamped to the flight area with roughly a 2,000 ft buffer and zoom levels 15-18 to balance coverage with tile usage.
- **Privacy Note**: Mapbox tokens are never uploaded to our server and are only passed directly to Mapbox's API from your browser.

### UI Notes

- The “What it does” panel is shown as a small map overlay on the left for readability.
- The intro panel appears on first load and hides automatically when a session starts or data is loaded.
- The Basemap Token panel lives beneath Progress in the sidebar to reduce accidental requests.

```

## Security Posture

- No uploads, no server processing. All EXIF parsing and KML generation run in your browser.
- Tokens are stored in your browser's localStorage and are not sent to the server.
- KML/HTML exports escape user‑provided text to prevent injection.
- Mapbox tokens are only passed directly to Mapbox's API from your browser - never through our servers.

## Community & Support

- **Discord Server**: Join our community at [https://discord.gg/RX5aa2nwFd](https://discord.gg/RX5aa2nwFd) for help, feedback, and feature requests.
- **About Page**: Visit the comprehensive about page for detailed project information and technical specifications.
- **GitHub**: Source code and issue tracking at [https://github.com/MaineSkyPixels/Metainfo-Mapper](https://github.com/MaineSkyPixels/Metainfo-Mapper)

## Development Status

⚠️ **Active Development**: This project is still in active development and bugs may occur. We're continuously improving the tool based on user feedback and adding new features.

## Notes

- Large batches rely on browser memory; split uploads if your hardware is constrained.
- Consider self-hosting Leaflet/JSZip/exifr bundles for completely offline environments.
- Version tracking: Current version #100725a (MMDDYY + update letter format)
- Regenerate the client bundle with `npm run build:client` before redeploying.

