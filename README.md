### License

This project is licensed under the **PolyForm Noncommercial License 1.0.0**.  
You are free to use and modify the code for personal, educational, or
non-commercial projects.  

**Commercial use, resale, or hosting this app behind a paywall requires
explicit written permission from Maine Sky Pixels LLC.**

➡️ See the [LICENSE](./LICENSE) file for details.


# Metainfo Mapper

A privacy-first, client-side web application for visualizing drone imagery GPS metadata while keeping every photo on the client device. Built by Maine Sky Pixels LLC for drone pilots and aerial photographers.

## Highlights

- **Dark-first UI** – switch between dark and light themes with a single click.
- **Browser-only workflow** – EXIF parsing and KML generation happen entirely in the user's browser, so no media is uploaded.
- **Instant previews** – Load thousands of images (JPG, TIFF, PNG, RAW) and visualise metadata immediately, even when you stay offline.
- **Mission storytelling** – Build sessions, visualise paths, surface GPS gaps, and export shareable KML in seconds.
- **RTK Analysis** – Optional Real-Time Kinematic GPS analysis with color-coded markers, detailed statistics, and comprehensive reporting.
- **Blank canvas default** – Images are plotted on a clean canvas with georeferenced positioning by default.
- **Optional Mapbox integration** – Add satellite imagery backgrounds with a free Mapbox token (completely optional).
- **Community support** – Join our Discord server for help, feedback, and feature requests.
- **Created in Maine** – Open-source project by a professional drone pilot focused on privacy-first field tools.

## Prerequisites

- Image files containing GPS EXIF metadata (JPG, TIFF, PNG, RAW formats)

## Installation & Launch


## Usage

1. Name your mission and click **Start New Session**.
2. **Optional**: Enable **RTK Analysis** checkbox for high-precision GPS analysis (adds processing overhead).
3. Drag-and-drop image files (JPG, TIFF, PNG, RAW) or choose a folder; EXIF is parsed locally.
4. Inspect markers, paths, and GPS gaps directly on the map.
   - **RTK Mode**: Green markers indicate RTK Fixed images, red markers indicate RTK Single or no RTK data.
5. View enhanced statistics including RTK Fixed/Float/Single counts and mean correction age (if RTK enabled).
6. Export the session as KML or download the error log for documentation.
   - **RTK Mode**: KML exports include all 7 RTK data fields for each image.
   - **RTK Mode**: Generate detailed HTML RTK analysis reports.
7. Click **Open in Google My Maps** to download the latest KML and launch My Maps, then choose "Create a new map" → "Import" and select the downloaded file.
8. Load previous KML sessions to continue work.

### RTK Analysis Feature

**Real-Time Kinematic (RTK) GPS Analysis** is an optional feature that provides high-precision positioning analysis for drone imagery with RTK capabilities.

#### Enabling RTK Analysis:
- Check the **"Enable RTK Analysis"** checkbox before loading images
- This feature adds processing overhead, so it's disabled by default
- Only enable when working with DJI drones that support RTK GPS

#### RTK Capabilities:
- **Visual Indicators**: 
  - 🟢 Green markers = RTK Fixed (highest precision)
  - 🔴 Red markers = RTK Single or no RTK data (lower precision)
- **Statistics Tracking**:
  - RTK Fixed count
  - RTK Float count  
  - RTK Single count
  - Mean Correction Age (average across dataset)
- **Data Fields Extracted**:
  - `RtkFlag` - RTK status indicator
  - `RtkStdLon` - Standard deviation longitude
  - `RtkStdLat` - Standard deviation latitude
  - `RtkStdHgt` - Standard deviation height
  - `RtkDiffAge` - Differential age in milliseconds
  - `GPSProcessingMethod` - Processing method used
  - Accuracy measurements (horizontal/vertical)
- **Export Features**:
  - All RTK fields embedded in KML exports
  - Detailed HTML RTK analysis reports
  - Filename, coordinates, and complete RTK field breakdown

#### Compatible Equipment:
- DJI Phantom 4 RTK
- DJI Matrice 300 RTK
- DJI Mavic 2 Enterprise Advanced
- Other DJI drones with RTK capabilities
- Images must contain XMP RTK metadata

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

## Technical Capabilities

### EXIF Processing:
- **Standard GPS**: Latitude, longitude, altitude, timestamp extraction
- **RTK Analysis**: Real-Time Kinematic GPS data extraction and analysis
- **Enhanced Metadata**: Camera make/model, processing method, accuracy measurements
- **Multi-format Support**: JPG, TIFF, PNG, RAW formats (DNG, CR2, NEF, ARW, ORF, RW2, PEF, SRW)
- **Full exifr Build**: Comprehensive metadata extraction including XMP namespaces

### Performance Optimizations:
- **Client-side Processing**: All EXIF parsing and KML generation in browser
- **Memory Efficient**: Handles thousands of images with progress feedback
- **Optimized CSS**: 21% size reduction with organized structure and faster parsing
- **Theme System**: Unified dark/light theme handling with CSS variables

### Export Capabilities:
- **KML Generation**: Standard GPS data with optional RTK field embedding
- **HTML Reports**: Detailed RTK analysis reports with field breakdowns
- **Error Logging**: Comprehensive error tracking and reporting
- **Google My Maps**: Direct integration for easy sharing and visualization

## Security Posture

- No uploads, no server processing. All EXIF parsing and KML generation run in your browser.
- Tokens are stored in your browser's localStorage and are not sent to the server.
- KML/HTML exports escape user‑provided text to prevent injection.
- Mapbox tokens are only passed directly to Mapbox's API from your browser - never through our servers.
- RTK data processing occurs entirely client-side with no external data transmission.

## Community & Support

- **Website**: Visit the live application at [https://metainfomapper.com/](https://metainfomapper.com/)
- **💬 Discord Server**: Join our community at [https://discord.gg/975xxNXgMn](https://discord.gg/975xxNXgMn) for help, feedback, and feature requests.
- **About Page**: Visit the comprehensive about page for detailed project information and technical specifications.
- **GitHub**: Source code and issue tracking at [https://github.com/MaineSkyPixels/Metainfo-Mapper](https://github.com/MaineSkyPixels/Metainfo-Mapper)

## Development Status

⚠️ **Active Development**: This project is still in active development and bugs may occur. We're continuously improving the tool based on user feedback and adding new features.

## Notes

- Large batches rely on browser memory; split uploads if your hardware is constrained.
- Supported formats: JPG, TIFF, PNG, and RAW formats (DNG, CR2, NEF, ARW, ORF, RW2, PEF, SRW).
- Consider self-hosting Leaflet/JSZip/exifr bundles for completely offline environments.
- Version tracking: Current version #101625b (MMDDYY + update letter format)
- **RTK Analysis**: Optional high-precision GPS analysis for DJI RTK-capable drones
- **Enhanced Performance**: Optimized CSS structure with 21% size reduction and improved loading
- Regenerate the client bundle with `npm run build:client` before redeploying.

## Version Numbering System

Metainfo Mapper uses a date-based build numbering system for tracking releases and updates:

### Build Number Format: `#MMDDYYx`

- **MM** = Month (01-12)
- **DD** = Day (01-31)  
- **YY** = Year (last two digits)
- **x** = Update letter (a, b, c, etc.) for multiple releases on the same date

### Examples:
- `#101625a` = October 16, 2025, first update of the day
- `#101625b` = October 16, 2025, second update of the day
- `#122501a` = December 25, 2025, first update of the day

### Semantic Versioning:
The project also uses semantic versioning (e.g., 1.6.0) for major feature releases:
- **Major.Minor.Patch** format
- Major version: Significant new features or breaking changes
- Minor version: New features, backwards compatible
- Patch version: Bug fixes and minor improvements

### For AI Coders:
When reviewing this codebase, the build number indicates when changes were made. The date format allows for easy chronological tracking of development progress and helps identify when specific features or fixes were implemented.

## Build Number Increment Protocol

**IMPORTANT:** When making changes to core files, the build number must be incremented in the specific files that were modified.

### Files That Require Build Number Updates:
- `index.html` - Update in owner info section (`Version #MMDDYYx`)
- `about.html` - Update in footer section (`Version #MMDDYYx`)
- `js/app.js` - Update in file header comment (`Build: #MMDDYYx`)
- `css/styles.css` - Update when modified (add if not present)

### Protocol Rules:
1. **Only increment build numbers in files that were actually changed**
2. **Don't update build numbers in unchanged files**
3. **This allows easy tracking of when specific files were last modified**
4. **Increment the letter (a→b→c) for multiple updates on the same date**

### Examples:
- **Change only index.html** → Update build number only in index.html
- **Change index.html + app.js** → Update build numbers in both files
- **Change styles.css** → Update build number in styles.css

### Current Build Number:
`#101625c` (October 16, 2025, third update - RTK Analysis feature and CSS cleanup)

This protocol ensures that by looking at the build number in any file, you can immediately see when that specific file was last modified, making development tracking much easier.

