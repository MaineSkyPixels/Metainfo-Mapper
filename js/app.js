/**
 * Metainfo Mapper - Client-side drone imagery GPS metadata visualization
 * Version: 1.5.0
 * Build: #100725e
 * 
 * A privacy-first web application for visualizing drone imagery GPS metadata
 * while keeping all data processing entirely in the browser.
 */

(() => {
    'use strict';

    /**
     * Main application class for Metainfo Mapper
     */
    class MetainfoMapper {
        constructor() {
            // Map and data properties
            this.map = null;
            this.markers = [];
            this.flightPath = null;
            this.imageData = [];
            this.errorData = [];
            this.sessionName = '';
            this.kmlData = null;
            this.isProcessing = false;

            // DOM element references
            this.progressEls = {
                container: document.getElementById('progress'),
                fill: document.getElementById('progress-fill'),
                text: document.getElementById('progress-text')
            };

            this.myMapsControls = {
                button: document.getElementById('open-mymaps'),
                hint: document.getElementById('mymaps-hint')
            };

            this.privacyNotice = {
                modal: document.getElementById('privacy-modal'),
                acknowledgeBtn: document.getElementById('privacy-ack-btn')
            };

            this.themeState = {
                toggleButton: document.getElementById('theme-toggle'),
                storedPreference: null
            };

            this.mapboxControls = {
                container: document.getElementById('mapbox-config'),
                input: document.getElementById('mapbox-token-input'),
                applyButton: document.getElementById('mapbox-token-apply'),
                clearButton: document.getElementById('mapbox-token-clear'),
                status: document.getElementById('mapbox-token-status')
            };

            // Map configuration
            this.mapIntroCard = document.getElementById('map-intro-card');
            this.mapAboutCard = document.getElementById('map-about-card');
            this.mapConfig = null;
            this.baseLayer = null;
            this.activeBaseProvider = null;
            this.defaultMapView = { center: [39, -98], zoom: 4 };
            this.mapBoundsBufferFeet = 2000;
            this.dataBounds = null;
            this.bufferedDataBounds = null;
            this.serverMapboxDefaults = null;
            this.userMapboxToken = null;

            // Event binding flags
            this.themeToggleBound = false;
            this.mapboxControlsBound = false;
            this.privacyNoticeBound = false;

            this.initializeApp();
        }

        /**
         * Initialize the application
         */
        async initializeApp() {
            this.setupEventListeners();
            await this.loadMapConfig();
            this.initThemeToggle();
            this.initMapboxTokenControls();
            this.initializeMap();
            this.toggleMyMapsGuidance(false);
            this.initPrivacyNotice();
            document.getElementById('load-session').style.display = 'block';
        }

        /**
         * Load map configuration from server
         */
        async loadMapConfig() {
            try {
                const response = await fetch('/map-config', { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`Tile config request failed with status ${response.status}`);
                }
                this.mapConfig = await response.json();
            } catch (error) {
                console.warn('Falling back to default blank canvas configuration:', error);
                this.mapConfig = {
                    provider: 'blank',
                    attribution: 'Metainfo Mapper'
                };
            }

            // Set up Mapbox defaults
            this.serverMapboxDefaults = this.mapConfig?.mapbox ? {
                token: this.mapConfig.mapbox.token || '',
                style: this.mapConfig.mapbox.style || 'mapbox/satellite-streets-v12',
                minZoom: Number.isFinite(this.mapConfig.mapbox.minZoom) ? this.mapConfig.mapbox.minZoom : 15,
                maxZoom: Number.isFinite(this.mapConfig.mapbox.maxZoom) ? this.mapConfig.mapbox.maxZoom : 18,
                attribution: this.mapConfig.mapbox.attribution || 'Mapbox; OpenStreetMap contributors'
            } : null;

            // Check for stored Mapbox token
            const storedToken = this.readStoredMapboxToken();
            if (storedToken) {
                this.ensureMapboxConfigDefaults();
                this.mapConfig.mapbox.token = storedToken;
                this.mapConfig.provider = 'mapbox';
                this.userMapboxToken = storedToken;
            } else {
                this.userMapboxToken = null;
            }

            // Set default provider if not specified
            if (!this.mapConfig?.provider) {
                this.mapConfig = {
                    ...this.mapConfig,
                    provider: this.mapConfig?.mapbox && (this.mapConfig.mapbox.token || this.serverMapboxDefaults?.token) ? 'mapbox' : 'blank'
                };
            }
        }

        /**
         * Initialize the map
         */
        initializeMap() {
            const mbtilesConfig = this.mapConfig?.mbtiles || {};
            this.map = L.map('map', {
                center: this.defaultMapView.center,
                zoom: this.defaultMapView.zoom,
                minZoom: mbtilesConfig.minZoom ?? 1,
                maxZoom: mbtilesConfig.maxZoom ?? 18
            });
            this.map.options.maxBoundsViscosity = 0;
            this.useFallbackBasemap();
        }

        /**
         * Use fallback basemap (blank canvas)
         */
        useFallbackBasemap() {
            if (!this.map) return;

            const mbtilesConfig = this.mapConfig?.mbtiles;
            if (!mbtilesConfig) {
                if (this.baseLayer) {
                    this.map.removeLayer(this.baseLayer);
                    this.baseLayer = null;
                }
                this.activeBaseProvider = null;
                return;
            }

            const tileLayer = L.tileLayer(mbtilesConfig.url || '/tiles/{z}/{x}/{y}', {
                minZoom: mbtilesConfig.minZoom ?? 1,
                maxZoom: mbtilesConfig.maxZoom ?? 17,
                attribution: mbtilesConfig.attribution || 'Metainfo Mapper'
            });

            this.swapBaseLayer(tileLayer, 'mbtiles');
            this.map.setMinZoom(tileLayer.options.minZoom ?? 1);
            this.map.setMaxZoom(tileLayer.options.maxZoom ?? 18);
            this.map.setMaxBounds(null);
            this.map.options.maxBoundsViscosity = 0;
        }

        /**
         * Ensure Mapbox configuration defaults are set
         */
        ensureMapboxConfigDefaults() {
            if (!this.mapConfig) {
                this.mapConfig = {};
            }

            if (this.mapConfig.mapbox) {
                const config = this.mapConfig.mapbox;
                config.style = config.style || 'mapbox/satellite-streets-v12';
                config.minZoom = Number.isFinite(config.minZoom) ? config.minZoom : 15;
                config.maxZoom = Number.isFinite(config.maxZoom) ? config.maxZoom : 18;
                config.attribution = config.attribution || 'Mapbox; OpenStreetMap contributors';
            } else {
                const defaults = this.serverMapboxDefaults || {};
                this.mapConfig.mapbox = {
                    token: defaults.token || '',
                    style: defaults.style || 'mapbox/satellite-streets-v12',
                    minZoom: Number.isFinite(defaults.minZoom) ? defaults.minZoom : 15,
                    maxZoom: Number.isFinite(defaults.maxZoom) ? defaults.maxZoom : 18,
                    attribution: defaults.attribution || 'Mapbox; OpenStreetMap contributors'
                };
            }
        }

        /**
         * Read stored Mapbox token from localStorage
         */
        readStoredMapboxToken() {
            try {
                if (typeof window === 'undefined' || !window.localStorage) {
                    return null;
                }
                return window.localStorage.getItem('metainfo-mapbox-token') || null;
            } catch (error) {
                console.warn('Unable to read stored Mapbox token:', error.message);
                return null;
            }
        }

        /**
         * Write Mapbox token to localStorage
         */
        writeStoredMapboxToken(token) {
            try {
                if (typeof window === 'undefined' || !window.localStorage) {
                    return;
                }
                if (token) {
                    window.localStorage.setItem('metainfo-mapbox-token', token);
                } else {
                    window.localStorage.removeItem('metainfo-mapbox-token');
                }
            } catch (error) {
                console.warn('Unable to persist Mapbox token:', error.message);
            }
        }

        /**
         * Initialize Mapbox token controls
         */
        initMapboxTokenControls() {
            const controls = this.mapboxControls;
            if (!controls || !controls.container) return;

            if (controls.input) {
                controls.input.value = this.userMapboxToken || '';
            }

            if (this.mapboxControlsBound) {
                this.updateMapboxTokenStatus();
                return;
            }

            // Apply button
            controls.applyButton?.addEventListener('click', () => {
                const token = controls.input?.value || '';
                this.setMapboxToken(token, { persist: true, announce: true });
            });

            // Clear button
            controls.clearButton?.addEventListener('click', () => {
                this.clearMapboxToken(true);
            });

            // Enter key on input
            controls.input?.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    const token = controls.input?.value || '';
                    this.setMapboxToken(token, { persist: true, announce: true });
                }
            });

            this.mapboxControlsBound = true;
            this.updateMapboxTokenStatus();
        }

        /**
         * Hide map intro card
         */
        hideMapIntroCard() {
            if (this.mapIntroCard) {
                this.mapIntroCard.style.display = 'none';
            }
            if (this.mapAboutCard) {
                this.mapAboutCard.style.display = 'none';
            }
        }

        /**
         * Show map intro card
         */
        showMapIntroCard() {
            if (this.mapIntroCard) {
                this.mapIntroCard.style.display = 'block';
            }
            if (this.mapAboutCard) {
                this.mapAboutCard.style.display = 'block';
            }
        }

        /**
         * Update Mapbox token status display
         */
        updateMapboxTokenStatus(message = null) {
            const statusEl = this.mapboxControls?.status;
            if (!statusEl) return;

            if (message) {
                statusEl.textContent = message;
                return;
            }

            const settings = this.getMapboxSettings();
            if (this.mapConfig?.provider === 'mapbox' && settings.token) {
                statusEl.textContent = this.userMapboxToken
                    ? 'Using browser-supplied Mapbox token. Tiles load once imagery is processed.'
                    : 'Using server-provided Mapbox token. Tiles load once imagery is processed.';
            } else {
                statusEl.textContent = 'No Mapbox token active. Offline blank canvas will be used.';
            }
        }

        /**
         * Set Mapbox token
         */
        setMapboxToken(token, options = {}) {
            const { persist = false, announce = false } = options;
            const trimmedToken = typeof token === 'string' ? token.trim() : '';
            const hasData = this.imageData.length > 0;
            const dataCoords = hasData ? this.imageData.map(img => [img.latitude, img.longitude]) : null;
            let statusMessage;

            // Update input field
            if (this.mapboxControls?.input) {
                this.mapboxControls.input.value = trimmedToken;
            }

            if (trimmedToken) {
                this.ensureMapboxConfigDefaults();
                this.mapConfig.mapbox.token = trimmedToken;
                this.mapConfig.provider = 'mapbox';
                this.userMapboxToken = trimmedToken;

                if (persist) {
                    this.writeStoredMapboxToken(trimmedToken);
                }

                statusMessage = 'Mapbox token saved. Hybrid tiles will load once imagery is processed.';
            } else {
                if (persist) {
                    this.writeStoredMapboxToken(null);
                }

                this.userMapboxToken = null;

                if (this.serverMapboxDefaults && this.serverMapboxDefaults.token) {
                    this.ensureMapboxConfigDefaults();
                    this.mapConfig.mapbox.token = this.serverMapboxDefaults.token;
                    this.mapConfig.mapbox.style = this.serverMapboxDefaults.style;
                    this.mapConfig.mapbox.minZoom = this.serverMapboxDefaults.minZoom;
                    this.mapConfig.mapbox.maxZoom = this.serverMapboxDefaults.maxZoom;
                    this.mapConfig.mapbox.attribution = this.serverMapboxDefaults.attribution;
                    this.mapConfig.provider = 'mapbox';
                    statusMessage = 'Reverted to server-provided Mapbox token.';
                } else {
                    if (this.mapConfig?.mapbox) {
                        this.mapConfig.mapbox.token = '';
                    }
                    this.mapConfig.provider = 'mbtiles';
                    statusMessage = 'Cleared Mapbox token. Offline tiles will remain active.';
                }
            }

            if (announce) {
                this.updateMapboxTokenStatus(statusMessage);
            } else {
                this.updateMapboxTokenStatus();
            }

            // Update basemap if we have data
            if (hasData && Array.isArray(dataCoords) && dataCoords.length > 0) {
                this.ensureBasemapForBounds(dataCoords);
            } else if (!trimmedToken && (!this.mapConfig.mapbox || !this.mapConfig.mapbox.token) && this.activeBaseProvider !== 'mbtiles') {
                this.useFallbackBasemap();
            }

            return trimmedToken.length > 0;
        }

        /**
         * Clear Mapbox token
         */
        clearMapboxToken(announce = false) {
            this.setMapboxToken('', { persist: announce, announce: announce });
            if (this.mapboxControls?.input) {
                this.mapboxControls.input.value = '';
            }
        }

        /**
         * Swap base layer
         */
        swapBaseLayer(layer, provider) {
            if (this.map) {
                if (this.baseLayer) {
                    this.map.removeLayer(this.baseLayer);
                }
                this.baseLayer = layer || null;
                if (this.baseLayer) {
                    this.baseLayer.addTo(this.map);
                }
                this.activeBaseProvider = provider || null;
            }
        }

        /**
         * Get Mapbox settings
         */
        getMapboxSettings() {
            const config = this.mapConfig?.mapbox || {};
            return {
                token: config.token || '',
                style: config.style || 'mapbox/satellite-streets-v12',
                minZoom: Number.isFinite(config.minZoom) ? config.minZoom : 16,
                maxZoom: Number.isFinite(config.maxZoom) ? config.maxZoom : 18,
                attribution: config.attribution || 'Mapbox; OpenStreetMap contributors'
            };
        }

        /**
         * Activate Mapbox basemap
         */
        activateMapboxBasemap(bounds) {
            const settings = this.getMapboxSettings();
            if (!settings.token) {
                console.warn('Mapbox token missing, staying on blank canvas fallback.');
                this.useFallbackBasemap();
                return;
            }

            const tileUrl = `https://api.mapbox.com/styles/v1/${settings.style}/tiles/512/{z}/{x}/{y}@2x?access_token=${encodeURIComponent(settings.token)}`;
            const tileLayer = L.tileLayer(tileUrl, {
                tileSize: 512,
                zoomOffset: -1,
                minZoom: settings.minZoom,
                maxZoom: settings.maxZoom,
                maxNativeZoom: settings.maxZoom,
                noWrap: true,
                bounds: bounds,
                attribution: settings.attribution
            });

            tileLayer.on('tileerror', () => {
                if (this.activeBaseProvider === 'mapbox') {
                    console.warn('Mapbox tile load failed, reverting to blank canvas.');
                    this.useFallbackBasemap();
                }
            });

            this.swapBaseLayer(tileLayer, 'mapbox');
            this.map.setMinZoom(settings.minZoom);
            this.map.setMaxZoom(settings.maxZoom);

            if (bounds) {
                this.map.setMaxBounds(bounds);
                this.map.options.maxBoundsViscosity = 1;
            }
        }

        /**
         * Get buffered bounds
         */
        getBufferedBounds(bounds) {
            if (!bounds || !bounds.isValid()) return bounds;

            const bufferFeet = this.mapBoundsBufferFeet;
            if (!bufferFeet || bufferFeet <= 0) return bounds;

            const bufferMeters = bufferFeet * 0.3048;
            const latBuffer = bufferMeters / 111320;
            const centerLat = bounds.getCenter().lat * (Math.PI / 180);
            const latFactor = Math.max(Math.cos(centerLat), 0.01);
            const lonBuffer = bufferMeters / (111320 * latFactor);

            return L.latLngBounds(
                [bounds.getSouth() - latBuffer, bounds.getWest() - lonBuffer],
                [bounds.getNorth() + latBuffer, bounds.getEast() + lonBuffer]
            );
        }

        /**
         * Ensure basemap for bounds
         */
        ensureBasemapForBounds(coords) {
            if (!this.map || !Array.isArray(coords) || coords.length === 0) return;

            const bounds = L.latLngBounds(coords);
            if (!bounds.isValid()) return;

            const bufferedBounds = this.getBufferedBounds(bounds);
            this.dataBounds = bounds;
            this.bufferedDataBounds = bufferedBounds;

            const settings = this.getMapboxSettings();

            if (this.mapConfig?.provider === 'mapbox' && this.mapConfig.mapbox && settings.token) {
                if (this.activeBaseProvider !== 'mapbox') {
                    this.activateMapboxBasemap(bufferedBounds);
                } else if (bufferedBounds) {
                    this.map.setMaxBounds(bufferedBounds);
                    this.map.options.maxBoundsViscosity = 1;
                    this.map.setMinZoom(settings.minZoom);
                    this.map.setMaxZoom(settings.maxZoom);
                }

                const targetBounds = bufferedBounds ? bufferedBounds : bounds;
                this.map.fitBounds(targetBounds, { padding: [50, 50] });
                return;
            }

            if (this.activeBaseProvider !== 'mbtiles') {
                this.useFallbackBasemap();
            }

            this.map.setMaxBounds(null);
            this.map.options.maxBoundsViscosity = 0;

            const targetBounds = bufferedBounds?.isValid?.() ? bufferedBounds : bounds;
            this.map.fitBounds(targetBounds, { padding: [50, 50] });
        }

        /**
         * Setup event listeners
         */
        setupEventListeners() {
            // Session controls
            document.getElementById('start-session').addEventListener('click', () => this.startNewSession());
            document.getElementById('load-kml-btn').addEventListener('click', () => {
                document.getElementById('kml-input').click();
            });
            document.getElementById('kml-input').addEventListener('change', (e) => this.loadKMLSession(e));

            // File handling
            const dropZone = document.getElementById('drop-zone');
            const fileInput = document.getElementById('file-input');
            const folderInput = document.getElementById('folder-input');

            dropZone.addEventListener('click', () => fileInput.click());
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                this.handleFiles(e.dataTransfer.files);
            });

            fileInput.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
                e.target.value = '';
            });

            document.getElementById('select-folder').addEventListener('click', () => folderInput.click());
            folderInput.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
                e.target.value = '';
            });

            // UI controls
            document.getElementById('add-more-btn').addEventListener('click', () => {
                document.getElementById('upload-section').style.display = 'block';
                document.getElementById('controls').style.display = 'none';
            });

            document.getElementById('done-btn').addEventListener('click', () => {
                this.generateKML();
                this.collapseHeroOverlay();
            });

            document.getElementById('download-kml').addEventListener('click', () => this.downloadKML());
            document.getElementById('open-mymaps').addEventListener('click', () => this.openGoogleMyMaps());
            document.getElementById('view-errors').addEventListener('click', () => this.showErrorReport());

            // Error modal
            document.querySelector('.close').addEventListener('click', () => {
                document.getElementById('error-modal').style.display = 'none';
            });

            document.getElementById('download-report').addEventListener('click', () => this.downloadErrorReport());
            document.getElementById('new-session-btn').addEventListener('click', () => this.startNewSessionFromControls());
        }

        /**
         * Start new session
         */
        startNewSession() {
            const locationName = document.getElementById('location-name').value.trim();
            if (!locationName) {
                alert('Please enter a location name');
                return;
            }

            this.hideMapIntroCard();
            this.sessionName = locationName;
            document.getElementById('session-section').style.display = 'none';
            document.getElementById('upload-section').style.display = 'block';
            document.getElementById('stats').style.display = 'block';
        }

        /**
         * Start new session from controls
         */
        startNewSessionFromControls() {
            if (this.imageData.length > 0 && !confirm('Are you sure you want to start a new session? All current data will be lost.')) {
                return;
            }

            this.clearSession();
            document.getElementById('session-section').style.display = 'block';
            document.getElementById('upload-section').style.display = 'none';
            document.getElementById('stats').style.display = 'none';
            document.getElementById('controls').style.display = 'none';
            document.getElementById('download-kml').style.display = 'none';
            document.getElementById('done-btn').style.display = 'block';
            document.getElementById('view-errors').style.display = 'none';
            document.getElementById('location-name').value = '';
            document.getElementById('load-session').style.display = 'block';
        }

        /**
         * Clear current session
         */
        clearSession() {
            // Remove markers from map
            this.markers.forEach(marker => this.map.removeLayer(marker));
            this.markers = [];

            // Remove flight path
            if (this.flightPath) {
                this.map.removeLayer(this.flightPath);
                this.flightPath = null;
            }

            // Clear data
            this.imageData = [];
            this.errorData = [];
            this.sessionName = '';
            this.kmlData = null;

            // Reset UI
            this.toggleMyMapsGuidance(false);
            this.initThemeToggle();
            this.updateStats();

            // Reset map
            this.dataBounds = null;
            this.bufferedDataBounds = null;
            this.map.setMaxBounds(null);
            this.map.options.maxBoundsViscosity = 0;
            this.useFallbackBasemap();
            this.map.setView(this.defaultMapView.center, this.defaultMapView.zoom);
            this.showMapIntroCard();
            this.setProcessingState(false);
        }

        /**
         * Load KML session
         */
        async loadKMLSession(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.hideMapIntroCard();

            try {
                let kmlContent;

                if (file.name.endsWith('.kmz')) {
                    const zip = await JSZip.loadAsync(file);
                    const kmlFile = Object.keys(zip.files).find(name => name.endsWith('.kml'));
                    if (!kmlFile) {
                        alert('No KML file found in KMZ archive');
                        return;
                    }
                    kmlContent = await zip.files[kmlFile].async('text');
                } else {
                    kmlContent = await file.text();
                }

                const parser = new DOMParser();
                const kmlDoc = parser.parseFromString(kmlContent, 'text/xml');
                const nameElement = kmlDoc.querySelector('Document > name');
                this.sessionName = nameElement ? nameElement.textContent : 'Loaded Session';

                const placemarks = kmlDoc.querySelectorAll('Placemark');
                this.imageData = [];

                placemarks.forEach(placemark => {
                    const coordsElement = placemark.querySelector('coordinates')?.textContent.trim();
                    if (!coordsElement) return;

                    const coords = coordsElement.split(',');
                    if (coords.length < 2) return;

                    const nameElement = placemark.querySelector('name')?.textContent || 'Image';
                    const timestampElement = placemark.querySelector('TimeStamp when')?.textContent;

                    this.imageData.push({
                        filename: nameElement,
                        longitude: parseFloat(coords[0]),
                        latitude: parseFloat(coords[1]),
                        altitude: coords[2] ? parseFloat(coords[2]) : null,
                        timestamp: timestampElement || null
                    });
                });

                this.updateMapWithData();
                document.getElementById('session-section').style.display = 'none';
                document.getElementById('upload-section').style.display = 'block';
                document.getElementById('stats').style.display = 'block';
                document.getElementById('controls').style.display = 'block';
                document.getElementById('done-btn').style.display = 'none';
                document.getElementById('download-kml').style.display = 'block';
                document.getElementById('view-errors').style.display = this.errorData.length > 0 ? 'block' : 'none';

                this.kmlData = this.imageData.length > 0 ? this.buildKmlDocument(this.sessionName, this.imageData) : null;
                this.toggleMyMapsGuidance(this.kmlData !== null);
                this.updateStats();

            } catch (error) {
                console.error('Error loading KML:', error);
                alert('Error loading KML/KMZ file: ' + error.message);
            } finally {
                event.target.value = '';
            }
        }

        /**
         * Handle file uploads
         */
        async handleFiles(files) {
            if (this.isProcessing) return;

            const jpgFiles = Array.from(files).filter(file => 
                file.name.toLowerCase().endsWith('.jpg') || 
                file.name.toLowerCase().endsWith('.jpeg')
            );

            if (jpgFiles.length === 0) {
                alert('No JPG images found');
                return;
            }

            this.hideMapIntroCard();
            this.kmlData = null;
            this.toggleMyMapsGuidance(false);
            this.initThemeToggle();
            this.setProcessingState(true, jpgFiles.length);
            document.getElementById('upload-section').style.display = 'none';

            let processedCount = 0;

            for (const file of jpgFiles) {
                try {
                    const result = await this.extractExifFromFile(file);
                    if (result.success) {
                        this.imageData.push(result.data);
                    } else {
                        this.errorData.push({
                            filename: file.name,
                            error: result.reason,
                            details: result.details
                        });
                    }
                } catch (error) {
                    this.errorData.push({
                        filename: file.name,
                        error: 'Failed to read EXIF data',
                        details: error.message
                    });
                }

                processedCount += 1;
                this.updateProgress(processedCount, jpgFiles.length);
            }

            this.sortImageData();
            this.updateMapWithData();
            this.updateStats();

            document.getElementById('controls').style.display = 'block';
            document.getElementById('upload-section').style.display = 'none';
            document.getElementById('done-btn').style.display = this.imageData.length > 0 ? 'block' : 'none';
            document.getElementById('view-errors').style.display = this.errorData.length > 0 ? 'block' : 'none';
            this.setProcessingState(false);
        }

        /**
         * Initialize theme toggle
         */
        initThemeToggle() {
            const themeState = this.themeState;
            if (!themeState || !themeState.toggleButton) return;

            const updateTheme = (theme) => {
                document.body.classList.toggle('light-theme', theme === 'light');
                themeState.toggleButton.textContent = theme === 'light' ? 'Switch to Dark' : 'Switch to Light';
                themeState.toggleButton.classList.toggle('primary-btn', theme === 'light');
                themeState.toggleButton.classList.toggle('secondary-btn', theme !== 'light');
            };

            const storedTheme = (() => {
                try {
                    return window.localStorage?.getItem('metainfo-theme');
                } catch (error) {
                    console.warn('Unable to read stored theme:', error.message);
                    return null;
                }
            })() === 'light' ? 'light' : 'dark';

            updateTheme(storedTheme);

            if (!this.themeToggleBound) {
                themeState.toggleButton.addEventListener('click', () => {
                    const newTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
                    updateTheme(newTheme);
                    try {
                        window.localStorage?.setItem('metainfo-theme', newTheme);
                    } catch (error) {
                        console.warn('Unable to persist theme:', error.message);
                    }
                });
                this.themeToggleBound = true;
            }
        }

        /**
         * Collapse hero overlay
         */
        collapseHeroOverlay() {
            const hero = document.getElementById('map-hero');
            if (hero) {
                hero.classList.add('collapsed');
            }
        }

        /**
         * Initialize privacy notice
         */
        initPrivacyNotice() {
            const privacyNotice = this.privacyNotice;
            if (!privacyNotice || !privacyNotice.modal || !privacyNotice.acknowledgeBtn) return;

            const hideModal = () => {
                privacyNotice.modal.style.display = 'none';
                try {
                    window.localStorage?.setItem('metainfo-privacy-ack', '1');
                } catch (error) {
                    console.warn('Unable to persist privacy acknowledgment:', error.message);
                }
            };

            const isAcknowledged = (() => {
                try {
                    return window.localStorage?.getItem('metainfo-privacy-ack') === '1';
                } catch (error) {
                    console.warn('Unable to read privacy acknowledgment:', error.message);
                    return false;
                }
            })();

            if (!this.privacyNoticeBound) {
                privacyNotice.acknowledgeBtn.addEventListener('click', hideModal);
                privacyNotice.modal.addEventListener('click', (event) => {
                    if (event.target === privacyNotice.modal) {
                        hideModal();
                    }
                });
                this.privacyNoticeBound = true;
            }

            privacyNotice.modal.style.display = isAcknowledged ? 'none' : 'flex';
        }

        /**
         * Extract EXIF data from file
         */
        async extractExifFromFile(file) {
            const arrayBuffer = await file.arrayBuffer();
            const exifData = await exifr.parse(arrayBuffer, { gps: true });

            if (!exifData || typeof exifData.latitude !== 'number' || typeof exifData.longitude !== 'number') {
                return {
                    success: false,
                    reason: 'No GPS data found',
                    details: 'Image does not contain GPS metadata'
                };
            }

            if (Math.abs(exifData.latitude) > 90 || Math.abs(exifData.longitude) > 180) {
                return {
                    success: false,
                    reason: 'Invalid GPS coordinates',
                    details: `Lat: ${exifData.latitude}, Lon: ${exifData.longitude}`
                };
            }

            return {
                success: true,
                data: {
                    filename: file.name,
                    latitude: exifData.latitude,
                    longitude: exifData.longitude,
                    altitude: exifData.GPSAltitude || exifData.altitude || null,
                    timestamp: exifData.DateTimeOriginal || exifData.CreateDate || null,
                    make: exifData.Make || null,
                    model: exifData.Model || null
                }
            };
        }

        /**
         * Toggle My Maps guidance
         */
        toggleMyMapsGuidance(show) {
            const controls = this.myMapsControls;
            if (!controls || !controls.button || !controls.hint) return;

            controls.button.style.display = show ? 'block' : 'none';
            controls.hint.style.display = show ? 'block' : 'none';
        }

        /**
         * Open Google My Maps
         */
        openGoogleMyMaps() {
            if (!this.kmlData) {
                alert('Generate a KML before opening Google My Maps.');
                return;
            }

            this.downloadKML();
            window.open('https://www.google.com/maps/d/', '_blank', 'noopener');
        }

        /**
         * Set processing state
         */
        setProcessingState(processing, totalFiles = 0) {
            this.isProcessing = processing;

            if (processing) {
                this.progressEls.container.style.display = 'block';
                this.updateProgress(0, totalFiles);
            } else {
                this.progressEls.container.style.display = 'none';
                this.progressEls.fill.style.width = '0%';
                this.progressEls.text.textContent = '0 / 0';
            }
        }

        /**
         * Update progress
         */
        updateProgress(current, total) {
            if (total === 0) {
                this.progressEls.fill.style.width = '0%';
                this.progressEls.text.textContent = '0 / 0';
                return;
            }

            const percentage = Math.round(current / total * 100);
            this.progressEls.fill.style.width = `${percentage}%`;
            this.progressEls.text.textContent = `${current} / ${total}`;
        }

        /**
         * Sort image data by timestamp
         */
        sortImageData() {
            this.imageData.sort((a, b) => {
                if (a.timestamp && b.timestamp) {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                }
                return 0;
            });
        }

        /**
         * Update map with data
         */
        updateMapWithData() {
            // Remove existing markers
            this.markers.forEach(marker => this.map.removeLayer(marker));
            this.markers = [];

            // Remove flight path
            if (this.flightPath) {
                this.map.removeLayer(this.flightPath);
                this.flightPath = null;
            }

            if (this.imageData.length === 0) return;

            const allCoords = [];
            const pathCoords = [];

            this.imageData.forEach(image => {
                const marker = L.circleMarker([image.latitude, image.longitude], {
                    radius: 6,
                    fillColor: '#00ff00',
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(this.map);

                marker.on('click', () => {
                    const popup = document.getElementById('coord-popup');
                    const coords = [
                        `Lat: ${image.latitude.toFixed(6)}`,
                        `Lon: ${image.longitude.toFixed(6)}`
                    ];

                    if (typeof image.altitude === 'number') {
                        coords.push(`Alt: ${image.altitude.toFixed(1)}m`);
                    }

                    document.getElementById('coord-text').innerHTML = coords.join('<br>');

                    const point = this.map.latLngToContainerPoint([image.latitude, image.longitude]);
                    popup.style.left = `${point.x}px`;
                    popup.style.top = `${point.y - 40}px`;
                    popup.style.display = 'block';

                    setTimeout(() => {
                        popup.style.display = 'none';
                    }, 3000);
                });

                this.markers.push(marker);
                allCoords.push([image.latitude, image.longitude]);
                pathCoords.push([image.latitude, image.longitude]);
            });

            // Create flight path
            if (pathCoords.length > 1) {
                this.flightPath = L.polyline(pathCoords, {
                    color: '#0088ff',
                    weight: 2,
                    opacity: 0.8
                }).addTo(this.map);
            }

            // Update basemap and fit bounds
            if (allCoords.length > 0) {
                this.ensureBasemapForBounds(allCoords);
            }
        }

        /**
         * Update statistics
         */
        updateStats() {
            document.getElementById('image-count').textContent = this.imageData.length + this.errorData.length;
            document.getElementById('valid-count').textContent = this.imageData.length;
            document.getElementById('error-count').textContent = this.errorData.length;
        }

        /**
         * Generate KML
         */
        generateKML() {
            if (this.imageData.length === 0) {
                alert('No GPS data to export');
                return;
            }

            try {
                this.kmlData = this.buildKmlDocument(this.sessionName, this.imageData);
                document.getElementById('done-btn').style.display = 'none';
                document.getElementById('download-kml').style.display = 'block';
                this.toggleMyMapsGuidance(true);
            } catch (error) {
                console.error('Error generating KML:', error);
                alert('Error generating KML: ' + error.message);
            }
        }

        /**
         * Build KML document
         */
        buildKmlDocument(sessionName, imageData) {
            const escapeXml = (text) => {
                if (text == null) return '';
                return String(text)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&apos;');
            };

            const escapedSessionName = escapeXml(sessionName || 'Session');
            const placemarks = imageData.map((image, index) => {
                const details = [
                    `File: ${escapeXml(image.filename)}`,
                    `Lat: ${image.latitude.toFixed(6)}`,
                    `Lon: ${image.longitude.toFixed(6)}`
                ];

                if (typeof image.altitude === 'number') {
                    details.push(`Alt: ${image.altitude.toFixed(1)}m`);
                }

                let timestampElement = '';
                if (image.timestamp) {
                    const isoString = new Date(image.timestamp).toISOString();
                    details.push(`Time: ${escapeXml(isoString)}`);
                    timestampElement = `<TimeStamp><when>${isoString}</when></TimeStamp>`;
                }

                return `      <Placemark>
        <name></name>
        <description>${escapeXml(details.join('\\n'))}</description>
        <styleUrl>#imagePoint</styleUrl>
        <Point>
          <coordinates>${image.longitude},${image.latitude},${image.altitude || 0}</coordinates>
        </Point>
        ${timestampElement}
      </Placemark>`;
            }).join('\\n');

            return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapedSessionName}</name>
    <Style id="imagePoint">
      <IconStyle>
        <color>ff00ff00</color>
        <scale>0.8</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/shapes/camera.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Style id="flightPath">
      <LineStyle>
        <color>ff0088ff</color>
        <width>2</width>
      </LineStyle>
    </Style> -->
    <Folder>
      <name>Image Locations</name>
${placemarks}
    </Folder>
  </Document>
</kml>`;
        }

        /**
         * Download KML
         */
        downloadKML() {
            if (!this.kmlData) return;

            const blob = new Blob([this.kmlData], { type: 'application/vnd.google-earth.kml+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${(this.sessionName || 'session').replace(/[^a-z0-9]/gi, '_')}.kml`;
            link.click();
            URL.revokeObjectURL(url);
        }

        /**
         * Show error report
         */
        showErrorReport() {
            if (this.errorData.length === 0) return;

            let tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Filename</th>
                        <th>Error Type</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
        `;

            this.errorData.forEach(error => {
                tableHtml += `
                <tr>
                    <td>${this.escapeHtml(error.filename)}</td>
                    <td>${this.escapeHtml(error.error)}</td>
                    <td>${this.escapeHtml(error.details)}</td>
                </tr>
            `;
            });

            tableHtml += '</tbody></table>';
            document.getElementById('error-table-container').innerHTML = tableHtml;
            document.getElementById('error-modal').style.display = 'flex';
        }

        /**
         * Download error report
         */
        downloadErrorReport() {
            if (this.errorData.length === 0) return;

            const escapeHtml = (text) => this.escapeHtml(text);
            const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Error Report - ${escapeHtml(this.sessionName || 'Session')}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #d32f2f; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .summary { background: #fff3e0; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>GPS Metadata Error Report</h1>
    <div class="summary">
        <p><strong>Location:</strong> ${escapeHtml(this.sessionName || 'Session')}</p>
        <p><strong>Date:</strong> ${escapeHtml(new Date().toLocaleString())}</p>
        <p><strong>Total Errors:</strong> ${this.errorData.length}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Filename</th>
                <th>Error Type</th>
                <th>Details</th>
            </tr>
        </thead>
        <tbody>
${this.errorData.map(error => `
            <tr>
                <td>${escapeHtml(error.filename)}</td>
                <td>${escapeHtml(error.error)}</td>
                <td>${escapeHtml(error.details)}</td>
            </tr>
`).join('')}
        </tbody>
    </table>
</body>
</html>
            `;

            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `error_report_${(this.sessionName || 'session').replace(/[^a-z0-9]/gi, '_')}.html`;
            link.click();
            URL.revokeObjectURL(url);
        }

        /**
         * Escape HTML
         */
        escapeHtml(text) {
            if (text == null) return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
    }

    // Initialize application when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.exifr) {
            alert('Failed to load EXIF reader. Please check your network connection.');
            return;
        }
        new MetainfoMapper();
    });
})();