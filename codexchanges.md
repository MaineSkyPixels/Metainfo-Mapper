# Codex Changes

## 2025-10-16
- Updated css/styles.css (Build #101625f) to strip unused selectors (legacy .intro-card/.about-card, .map-overlay, .modal.active, dark-theme overrides, pulse effects, and the unused .flight-path).
- Tightened performance hints by limiting will-change to active elements and moving the progress animation hint to #progress-fill.
- Restored progress bar structure (#progress-bar container + #progress-fill fill rules) while keeping map overlay containment logic intact.
- Added build comment to the stylesheet per file-tracking protocol.
