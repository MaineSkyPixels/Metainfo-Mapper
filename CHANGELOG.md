# Changelog

## 1.7.0 - 2025-10-16
- **RTK Analysis Feature**: Added comprehensive Real-Time Kinematic GPS analysis capabilities as an optional feature.
  - **Optional RTK Processing**: Added checkbox in session setup to enable RTK analysis (disabled by default to avoid processing overhead).
  - **RTK Statistics**: Added new statistics tracking for RTK Fixed, RTK Float, and RTK Single image counts.
  - **Visual Indicators**: RTK images are color-coded on the map (Green for RTK Fixed, Red for RTK Single/No RTK).
  - **Enhanced EXIF Parsing**: Upgraded to full exifr build for comprehensive metadata extraction including DJI RTK fields.
  - **KML Integration**: All 7 RTK data fields are embedded in KML exports for each image.
  - **HTML Reporting**: Added RTK analysis report generation with detailed field breakdowns.
  - **RTK Mean Correction Age**: Calculates and displays average correction age across the dataset.
  - **Field Support**: Extracts RtkFlag, RtkStdLon, RtkStdLat, RtkStdHgt, RtkDiffAge, GPSProcessingMethod, and accuracy data.

- **Major CSS Cleanup and Reorganization**: Complete refactor of stylesheet for better maintainability and performance.
  - **File Size Reduction**: Reduced from 963 lines to 763 lines (21% reduction) by eliminating duplicate rules.
  - **Logical Organization**: Reorganized into 21 clear sections with descriptive headers.
  - **Eliminated Duplications**: Removed 3 duplicate definitions of body, #sidebar, and #sidebar h1 rules.
  - **Consolidated Themes**: Unified dark/light theme handling with consistent CSS variables.
  - **Fixed Conflicts**: Resolved all conflicting and overridden CSS rules.
  - **Improved Performance**: Faster parsing and better maintainability for future development.

- **RTK UI/UX Improvements**: Enhanced RTK Analysis section styling for both themes.
  - **Dark Theme**: Dark blue background with bright white text for excellent contrast.
  - **Light Theme**: Clean white background with dark gray text for optimal readability.
  - **Accessibility**: High contrast ratios meeting readability standards.
  - **Theme Consistency**: RTK section now properly adapts to theme changes.

- **Testing Infrastructure**: Created comprehensive testing tools for RTK development.
  - **Debug Tools**: Multiple HTML files for testing RTK field extraction and EXIF parsing.
  - **Field Analysis**: Tools to identify and verify DJI RTK field names and data structures.
  - **XMP Parsing**: Dedicated tests for XMP metadata extraction capabilities.
  - **Organized Testing**: Moved all testing files to `testing-e/` folder (gitignored for local development).

- **Build System Updates**: Enhanced version tracking and cache management.
  - **Build Number**: Updated to #101625b following date-based increment protocol.
  - **Cache Busting**: Added version parameters to CSS links to force browser refresh.
  - **Documentation**: Updated build numbering protocol in README.md for future AI developers.

- **Repository Management**: Improved organization and workflow.
  - **Branch Creation**: Created `experimental` branch for feature development.
  - **File Organization**: Added testing folders to .gitignore for clean repository.
  - **Clean Commits**: Removed testing files from repository while preserving local development tools.

- **Technical Improvements**:
  - **EXIF Library**: Upgraded from exifr lite to full build for comprehensive metadata support.
  - **Error Handling**: Enhanced RTK data detection with fallback mechanisms.
  - **Performance**: Optimized CSS loading and parsing with organized structure.
  - **Compatibility**: Ensured RTK feature works across different DJI drone models and firmware versions.

## 1.6.0 - 2025-01-XX
- **Expanded Image Format Support**: Added support for TIFF (.tif, .tiff), PNG, and RAW formats (DNG, CR2, NEF, ARW, ORF, RW2, PEF, SRW) in addition to existing JPG support.
- **Enhanced File Processing**: Updated file filtering logic to handle broader range of image formats with GPS metadata.
- **Updated Documentation**: Revised all documentation, help pages, and UI messaging to reflect expanded format support.
- **exifr Library Compatibility**: Added notes about exifr library version 2.1.1+ requirement for TIFF support.
- **Improved User Experience**: Enhanced error messages to clearly list all supported formats when no compatible files are found.

## 1.5.0 - 2025-10-07
- **Major Version Release**: Comprehensive UI/UX improvements and documentation enhancements.
- **Discord Integration**: Added Discord icons (💬) to all Discord links for better visual identification.
- **Mapbox Documentation**: Enhanced about page with detailed API optimization information including zoom restrictions and cost efficiency.
- **Navigation Improvements**: Added return link to mapbox-token-help.html for better user experience.
- **Version Tracking**: Updated to #100725e (October 7, 2025, fifth update).

## 1.4.7 - 2025-10-07
- **Documentation Enhancement**: Updated Mapbox section in about page to include API optimization details and cost efficiency information.
- **Technical Details**: Added information about restricted zoom levels (15-18) and ~2,000 foot buffer for API call minimization.
- **Version Increment**: Updated version tracking from #100725c to #100725d.

## 1.4.6 - 2025-10-07
- **UI Enhancement**: Added Discord icons (💬) to all Discord links across the application for better visual identification.
- **Version Increment**: Updated version tracking from #100725b to #100725c.

## 1.4.5 - 2025-10-07
- **License Update**: Updated about page to reflect PolyForm Noncommercial License 1.0.0 with commercial use restrictions.
- **Version Increment**: Updated version tracking from #100725a to #100725b.

## 1.4.3 - 2025-10-07
- **Project Rebranding**: Renamed from "Metainfo Plotter" to "Metainfo Mapper" across all files and documentation.
- **Removed MBTiles References**: Updated all documentation to remove references to MBTiles fallback system.
- **Updated Basemap Documentation**: Clarified that the application uses a blank canvas by default with georeferenced positioning.
- **Enhanced Mapbox Help**: Updated mapbox-token-help.html to emphasize that Mapbox usage is completely optional.
- **Documentation Updates**:
  - Updated README.md to reflect blank canvas as default instead of MBTiles
  - Updated CHANGELOG.md to remove MBTiles references
  - Enhanced mapbox-token-help.html with clear messaging about optional nature of Mapbox tokens
  - Added emphasis that all core features work perfectly without any Mapbox token
- **User Experience Improvements**: Made it clear that users can use the app effectively with just the blank canvas for GPS plotting and KML export.
- **New About Page**: Created comprehensive about.html page with detailed project information, privacy details, and technical specifications.
- **Enhanced Navigation**: Added links to about page and Discord server throughout the application.
- **Improved UI/UX**:
  - Enhanced text visibility in dark theme with brighter white colors
  - Added theme toggle functionality to about page
  - Updated Basemap Token section with clearer privacy messaging
  - Added "(Optional)" to Basemap Token title for clarity
  - Improved font sizing and emphasis in token configuration section
- **Community Integration**: Added Discord server link (https://discord.gg/975xxNXgMn) for user community and support.
- **Version Tracking**: Implemented version numbering system (#100725a format) for tracking updates.
- **Privacy Enhancements**: Clarified Mapbox token handling with detailed explanation of direct browser-to-Mapbox communication.
- **Development Status Notices**: Added clear warnings about active development status in both main app and about page.
- **Contact Information Update**: Updated email address from info@skypixels.org to info@maineskypixels.com across all files.
- **Website Launch**: Added live website URL (https://metainfomapper.com/) to all documentation and press materials.
- **License Update**: Added PolyForm Noncommercial License 1.0.0 with commercial use restrictions requiring explicit permission.
- **Performance Claims**: Updated capacity from "hundreds" to "thousands" of JPGs for more accurate performance representation.

## 1.4.2 - 2025-09-30
- Added Mapbox streaming support with blank canvas fallback exposed via `/map-config`.
- Basemap Token panel (browser-side) with localStorage persistence; token help page at `mapbox-token-help.html`.
- Constrained Mapbox requests to flight bounds with ~2,000 ft buffer and zoom levels 15–18.
- Repositioned "What it does" into a left map overlay; removed the large "Ready to visualise" overlay; improved dark/light map background.
- Fixed theme toggle to bind once during startup.
- Added About/Ownership card with contact and GitHub link; refined small typography.
- Introduced Cloudflare/ static bundle and on-demand sync scripts: `update-cloudflare.ps1` / `update-cloudflare.bat` and `npm run sync:cloudflare`.
- Optional easter eggs: URL flags (`?frak=yeah`, `?chevron=7`, `?signature=on`) with small CSS pulses and opt-in KML signature comment.

## 1.4.1 - 2025-09-30
- Removed the New England map clamp; the canvas now pans across the entire map coverage.
- Clarified privacy messaging to state the app remains 100% offline once loaded.
- Documented the dark-first/light theme toggle in the README.

## 1.4.0 - 2025-09-30
- Rebranded the interface to *Metainfo Mapper* with refreshed copy highlighting the Maine-based, client-side nature of the project.
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
- Updated map display to use blank canvas with georeferenced positioning.
- Migrated EXIF parsing to the browser; all image handling now stays client-side with progress feedback and improved error reporting.
- Escaped all KML/HTML output to prevent markup injection and clarified client messaging about local-only processing.
- Introduced esbuild bundling pipeline (`src/app.js` → `public/js/app.js`) with build/watch scripts.
- Refreshed README guidance covering secure deployment, development workflow, and SPA architecture.