/*! StockChart v4.0 | free JavaScript stock chart by simul8or | https://simul8or.com/Javascript-Stock-Chart.php */
class StockChart {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.getElementById(container) : container; if (!this.container) throw new Error('Container not found'); this.aiPriceLevels = []; this.aiPriceLevelHitAreas = []; this.hoveredAIPriceLevelCloseIndex = null; this.priceLines = []; this._nextPriceLineId = 1; this.options = options; this.isDragging = !1; this.scalingActive = !1; this.dragStartX = 0; this.dragStartY = 0; this.dragStartOffset = 0; this.dragStartPriceOffset = 0; this.pixelOffset = 0; this.scalingDragStartY = 0; this.screenSize = this.getScreenSizeCategory(); this.isViewPinnedToRightEdge = !0; this.defaultTimeframes = [{ value: '1min', label: '1 Minute' }, { value: '5min', label: '5 Minutes' }, { value: '15min', label: '15 Minutes' }, { value: '30min', label: '30 Minutes' }, { value: '1hour', label: '1 Hour' }, { value: '1day', label: '1 Day' }, { value: '1week', label: '1 Week' }, { value: '1month', label: '1 Month' }]; this.lastMouseX = null; this.lastMouseY = null; this.mouseIsOverChart = !1; this.lineDrawingMode = !1; this.drawingLine = !1; this.currentLine = null; this.lines = []; this.selectedLineIndex = null; this.draggedLine = null; this.snappingPoint = null; this.snappingActive = !1; this.tradeMarkers = []; this.limitOrders = []; this.limitOrderHitAreas = []; this.draggedLimitOrder = null; this.hoveredLimitOrderIndex = null; this.textMode = !1; this.textAnnotations = []; this.selectedTextIndex = null; this.editingTextIndex = null; this.draggingTextIndex = null; this.textDragStartX = 0; this.textDragStartY = 0; this.textClickTimer = null; this.textDragStarted = !1; this.activeTextInput = null; this.textInputReady = !1; this._textInputClickOutside = null; this.emoticonMode = !1; this.emoticons = []; this.selectedEmoticonIndex = null; this.draggingEmoticonIndex = null; this.emoticonDragStartX = 0; this.emoticonDragStartY = 0; this.emoticonDragStarted = !1; this.selectedEmoticonType = '??'; this.textSettings = { fontSize: 12, fontFamily: 'Arial', color: '#ffffff', fontWeight: 'normal' }; this.fibonacciMode = !1; this.drawingFibonacci = !1; this.currentFibonacci = null; this.fibonacciRetracements = []; this.selectedFibonacciIndex = null; this.draggingFibonacciIndex = null; this.fibonacciDragStartX = 0; this.fibonacciDragStartY = 0; this.fibonacciDragStarted = !1; this.fibonacciSnapPoint = null; this.drawingToolsMode = !1; this.selectedDrawingTool = 'line'; this.drawingShapes = []; this.selectedShapeIndex = null; this.drawingArrow = !1; this.currentArrow = null; this.arrows = []; this.selectedArrowIndex = null; this.draggingArrowIndex = null; this.arrowDragStartX = 0; this.arrowDragStartY = 0; this.arrowDragStarted = !1; this.drawingRectangle = !1; this.currentRectangle = null; this.rectangles = []; this.selectedRectangleIndex = null; this.draggingRectangleIndex = null; this.rectangleDragStartX = 0; this.rectangleDragStartY = 0; this.rectangleDragStarted = !1; this.drawingCircle = !1; this.currentCircle = null; this.circles = []; this.selectedCircleIndex = null; this.draggingCircleIndex = null; this.circleDragStartX = 0; this.circleDragStartY = 0; this.circleDragStarted = !1; this.movingAverages = [{ type: 'ema', period: 9, enabled: !0, id: 'ema_9' }, { type: 'ema', period: 20, enabled: !0, id: 'ema_20' }, { type: 'sma', period: 9, enabled: !1, id: 'sma_9' }, { type: 'sma', period: 20, enabled: !1, id: 'sma_20' }]; this.indicators = {
            vwap: { enabled: !1, data: [], color: '#C71585' },
            keyLevels: { enabled: !1, data: [], color: '#8D96A6' },
            bollinger: { enabled: !1, data: { upper: [], middle: [], lower: [] }, color: '#1E88E5' },
            rsi: { enabled: !1, data: [], color: '#9B83B8' },
            macd: { enabled: !0, data: { macdLine: [], signalLine: [], histogram: [] }, color: '#00C000', macdColor: '#2196F3', signalColor: '#FF9800' },
            parabolicSAR: { enabled: !1, data: [], color: '#FF6B35' },
            atr: { enabled: !1, data: [], color: '#8A2BE2', period: 14 },
            volumeMA: { enabled: !1, data: [], color: '#FFA500', period: 20 },
            stochastic: { enabled: !1, data: { k: [], d: [] }, color: '#FF1493', dColor: '#32CD32' },
            // New oscillators (panel indicators)
            williamsR: { enabled: !1, data: [], color: '#FF6347', period: 14 },
            mfi: { enabled: !1, data: [], color: '#DC143C', period: 14 },
            roc: { enabled: !1, data: [], color: '#228B22', period: 12 },
            cci: { enabled: !1, data: [], color: '#00CED1', period: 20 },
            adx: { enabled: !1, data: { adx: [], pdi: [], mdi: [] }, color: '#8A2BE2', pdiColor: '#26a69a', mdiColor: '#ef5350', period: 14 },
            stochasticRSI: { enabled: !1, data: { k: [], d: [] }, color: '#FF69B4', dColor: '#32CD32', period: 14 },
            awesomeOscillator: { enabled: !1, data: [], color: '#00C853' },
            trix: { enabled: !1, data: [], color: '#9932CC', period: 15 },
            // Volume indicators (panel)
            obv: { enabled: !1, data: [], color: '#00BFFF' },
            adl: { enabled: !1, data: [], color: '#FFD700' },
            forceIndex: { enabled: !1, data: [], color: '#7B68EE', period: 13 },
            kst: { enabled: !1, data: { kst: [], signal: [] }, color: '#FF4500', signalColor: '#00CED1' },
            // Volume display toggle
            volume: { enabled: !0 },
            // Overlays (drawn on price chart)
            ichimoku: { enabled: !1, data: { tenkan: [], kijun: [], senkouA: [], senkouB: [], chikou: [], displacement: 26 }, tenkanColor: '#0496ff', kijunColor: '#991515', cloudUpColor: 'rgba(0, 255, 0, 0.1)', cloudDownColor: 'rgba(255, 0, 0, 0.1)' },
            wma: { enabled: !1, data: [], color: '#FF8C00', period: 20 },
            wema: { enabled: !1, data: [], color: '#4169E1', period: 14 },
            typicalPrice: { enabled: !1, data: [], color: '#808080' },
            // Candlestick patterns
            patterns: { enabled: !1, data: [], bullishColor: '#26a69a', bearishColor: '#ef5350' }
        };
        // Panel configuration for oscillator indicators
        this.indicatorPanels = {
            rsi: { height: 80 },
            macd: { height: 100 },
            stochastic: { height: 80 },
            williamsR: { height: 80 },
            mfi: { height: 80 },
            roc: { height: 80 },
            cci: { height: 80 },
            adx: { height: 80 },
            stochasticRSI: { height: 80 },
            awesomeOscillator: { height: 80 },
            trix: { height: 80 },
            obv: { height: 80 },
            adl: { height: 80 },
            forceIndex: { height: 80 },
            kst: { height: 100 }
        };
        // Panel resize state
        this.panelResizing = false;
        this.panelResizeKey = null;
        this.panelResizeStartY = 0;
        this.panelResizeStartHeight = 0;
        this.panelResizeAboveKey = null;
        this.panelResizeAboveStartHeight = 0;
        this.panelMinHeight = 40;
        this.panelMaxHeight = 300;
        this.volumeHeight = 100; this.colorPalette = ['#2196F3', '#E74C3C', '#E69500', '#2157F3', '#9C27B0', '#FF9800', '#4CAF50', '#F44336', '#3F51B5', '#009688', '#FFC107', '#795548', '#607D8B', '#E91E63', '#CDDC39']; this.initializeMovingAverageIndicators(); this.config = { padding: Object.assign({ top: 56, right: 60, bottom: 30, left: 0 }, options.padding || {}), candleWidth: 10, spacing: 4, visibleCandles: (options.initialVisibleCandles !== undefined && typeof options.initialVisibleCandles === 'number' && options.initialVisibleCandles > 0) ? options.initialVisibleCandles : (this.getKeptZoom() || this.getInitialVisibleCandles()), maxVisibleCandles: this.getMaxVisibleCandles(), dataOffset: 0, chartType: options.chartType || 'line', darkMode: options.darkMode || !1, timeframesToDisplay: options.availableTimeframes || this.defaultTimeframes, bullColor: '#26a69a', bearColor: '#ef5350', gridColor: '#d0d0d0', textColor: '#888', crosshairColor: 'rgba(0,0,0,0.3)', drawingLineColor: '#3498db', drawingLineColorSelected: '#ff9800', drawingLineWidth: 1.5, drawingLineWidthSelected: 2.5, verticalScaleFactor: 1.0, verticalPadding: 0.1, priceOffset: 0, watermark: { enabled: !0, text: options.ticker || 'NVDA', font: this.getFontSize('watermark'), opacity: 0.1 }, branding: { enabled: options.hideBranding !== !0, text: 'simul8or.com', font: this.getFontSize('branding'), opacity: 0.3, url: 'https://simul8or.com', logo: options.brandingLogo || StockChart.BRANDING_LOGO || window.S8_CHART_LOGO || null, logoHeight: options.brandingLogoHeight || 26, logoOpacity: options.brandingLogoOpacity || 0.85 }, darkModeColors: { bullColor: '#089981', bearColor: '#F23645', gridColor: '#444', textColor: '#e0e0e0', crosshairColor: 'rgba(255,255,255,0.4)', }, useAfterHoursStyling: options.useAfterHoursStyling !== undefined ? options.useAfterHoursStyling : !0, targetPixelsPerLabel: 45, }; this.createDOM(); this.applyToolbarLayout(); this.setupPriceLineShortcuts(); this.chartContainer = this.container.querySelector('.sc-chart-container'); if (this.chartContainer) this.chartContainer._scInstance = this;  this.chartInfoOverlayEl = this.chartContainer.querySelector('.sc-chart-info-overlay'); const ohlcvValuesDisplay = this.chartInfoOverlayEl.querySelector('.sc-ohlcv-values-display'); if (ohlcvValuesDisplay) { this.openEl = ohlcvValuesDisplay.querySelector('.open-value'); this.highEl = ohlcvValuesDisplay.querySelector('.high-value'); this.lowEl = ohlcvValuesDisplay.querySelector('.low-value'); this.closeEl = ohlcvValuesDisplay.querySelector('.close-value'); this.changeEl = ohlcvValuesDisplay.querySelector('.change-value'); this.rangeEl = ohlcvValuesDisplay.querySelector('.range-value'); this.volEl = ohlcvValuesDisplay.querySelector('.vol-value') }
        this.tickerInfoDisplay = this.chartInfoOverlayEl.querySelector('.sc-ticker-info-display'); if (this.tickerInfoDisplay) { this.tickerLogoEl = this.tickerInfoDisplay.querySelector('.sc-ticker-logo'); this.tickerSymbolEl = this.tickerInfoDisplay.querySelector('.sc-ticker-symbol'); this.companyNameEl = this.tickerInfoDisplay.querySelector('.sc-company-name'); this.currentPriceEl = this.tickerInfoDisplay.querySelector('.sc-current-price'); this.dayChangeEl = this.tickerInfoDisplay.querySelector('.sc-day-change'); this.dayChangePctEl = this.tickerInfoDisplay.querySelector('.sc-day-change-pct'); const modeTag = this.tickerInfoDisplay.querySelector('.sc-mode-tag'); const mode = window.S8_CHART_MODE, modeLabels = { replay: 'Replay', live: 'Live', closed: 'Market closed' }; if (modeTag && modeLabels[mode]) { modeTag.dataset.mode = mode; modeTag.textContent = modeLabels[mode]; modeTag.hidden = false } }
        this.indicatorValuesDisplay = this.chartInfoOverlayEl.querySelector('.sc-indicator-values-display'); this.atrDisplay = this.chartInfoOverlayEl.querySelector('.sc-atr-display'); if (this.config.darkMode) { this.chartContainer.classList.add('dark-mode') }
        this.updateDarkModeIcon(); this.registerEventListeners(); this.updateConfig(); this.stockData = options.data || []; this.onReachingStartCallback = options.onReachingStart || null; this.isLoadingHistoricalData = false; if (this.options.timeframe) { this.timeframe = this.options.timeframe } else if (this.stockData.length > 0) { this.timeframe = this.detectTimeframe(this.stockData) } else { this.timeframe = "1min" }
        this.config.dataOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.updateOHLCOverlay(); this.resizeCanvases(); this.calculateIndicators(); this.loadSettings(); this.updateChartTypeVisualState(); this.updateTimeframeDropdownVisualState(); this.debouncedResize = this.debounce(() => {
            const newSize = this.getScreenSizeCategory(); if (newSize !== this.screenSize) { this.screenSize = newSize; this.updateResponsiveConfig() }
            this.resizeCanvases(); this.drawCharts()
        }, 250); window.addEventListener('resize', this.debouncedResize)
    }
    getScreenSizeCategory() { const w = window.innerWidth; if (w < 576) return 'xs'; if (w < 768) return 'sm'; if (w < 992) return 'md'; if (w < 1200) return 'lg'; return 'xl' }
    getInitialVisibleCandles() { switch (this.getScreenSizeCategory()) { case 'xs': return 15; case 'sm': return 22; case 'md': return 40; case 'lg': return 60; case 'xl': return 80; default: return 80 } }
    getMaxVisibleCandles() { switch (this.getScreenSizeCategory()) { case 'xs': return 100; case 'sm': return 140; case 'md': return 160; case 'lg': return 200; case 'xl': return 250; default: return 250 } }
    // HiDPI support: Get CSS pixel dimensions (not bitmap dimensions)
    getCanvasWidth() { return this._cssWidth || this.priceCanvas.clientWidth; }
    getCanvasHeight() { return this._cssHeight || this.priceCanvas.clientHeight; }
    // Panel system: Calculate total height of enabled indicator panels
    getTotalPanelHeight() {
        let height = 0;
        // Iterate through all panel-based indicators
        const panelIndicators = ['rsi', 'macd', 'stochastic', 'williamsR', 'mfi', 'roc', 'cci', 'adx', 'stochasticRSI', 'awesomeOscillator', 'trix', 'obv', 'adl', 'forceIndex', 'kst'];
        panelIndicators.forEach(key => {
            if (this.indicators[key] && this.indicators[key].enabled && this.indicatorPanels[key]) {
                height += this.indicatorPanels[key].height;
            }
        });
        return height;
    }
    // Panel system: Calculate height available for price chart (includes volume overlay area)
    // ---- zoom-out density -------------------------------------------------
    // Pitch is the distance from one bar's left edge to the next. Every density
    // decision below is derived from this single number.
    getColumnPitch() {
        const w = this.getCanvasWidth() - this.config.padding.left - this.config.padding.right;
        const n = (this.isDeepZoom() ? this.config.visibleCandles : Math.min(this.config.visibleCandles, this.stockData.length || 1)) || 1;
        return w / n;
    }

    // Fewer bars than the view holds (a thin ticker, a Monday morning): keep the
    // normal pitch and park the bars against the right edge with empty slots on
    // the left, like TOS/TradingView, instead of stretching 20 bars across the
    // whole chart where the wheel can't zoom them. Expressed as a NEGATIVE
    // dataOffset so every x = left + (dataIndex - dataOffset) * pitch lands right.
    // Re-applied each frame because callers keep resetting it with Math.max(0, ...).
    _fitShortSeries() {
        if (!this.isDeepZoom()) return;
        const n = this.stockData.length, vis = this.config.visibleCandles;
        if (n && n < vis) { this.config.dataOffset = n - vis; this.isViewPinnedToRightEdge = !0 }
        else if (this.config.dataOffset < 0) this.config.dataOffset = Math.max(0, n - vis);
    }

    // Empty slots left of the first bar (see _fitShortSeries). Drawing that walks
    // a stockData.slice() by its own index shifts right by this many slots.
    getLeadSlots() {
        return Math.max(0, -this.config.dataOffset);
    }

    // Deep zoom is opt-in per page (the two sims set window.S8_CHART_DEEP_ZOOM):
    // everywhere else keeps the responsive 250-bar ceiling it has always had.
    isDeepZoom() {
        return !!(this.options.deepZoom || window.S8_CHART_DEEP_ZOOM);
    }

    // How far out the wheel is allowed to go. Two ceilings, whichever is lower:
    // the data we actually hold (zooming past it would only add blank space), and
    // half a pixel of pitch, past which a bar is no longer addressable by the
    // crosshair's hit-test and the whole thing stops meaning anything.
    getZoomOutCeiling() {
        if (!this.isDeepZoom()) return this.config.maxVisibleCandles;
        const w = this.getCanvasWidth() - this.config.padding.left - this.config.padding.right;
        return Math.max(this.config.maxVisibleCandles,
                        Math.min(this.stockData.length || 0, Math.floor(w / 0.5)));
    }

    // Bar interval between vertical gridlines AND between time-axis labels - the
    // same number for both, so every gridline has a label under it and vice versa.
    // Fixed at every 10th bar it looked right at default zoom and turned into a
    // picket fence zoomed out, so it is driven by pitch: aim for ~90px apart,
    // rounded up to a multiple of 10 bars to keep the familiar rhythm.
    // Right edge that wheel/pinch zoom holds steady. Capped at the data end: a zoom
    // carried over from a longer series (1-min -> daily under KEEP_ZOOM) puts the raw
    // edge thousands of bars past the data, and anchoring there scrolls into nothing.
    getZoomAnchorRight() {
        const right = this.config.dataOffset + this.config.visibleCandles;
        return this.stockData.length ? Math.min(right, this.stockData.length) : right;
    }

    getGridStep() {
        const pitch = this.getColumnPitch();
        return Math.max(10, Math.ceil(Math.ceil(90 / Math.max(pitch, 0.01)) / 10) * 10);
    }

    // Gaps have to give way before the bars do - at 4px of pitch a 4px gap would
    // leave nothing to draw. Called once at the top of every frame so drawing and
    // hit-testing read the same spacing, since both derive x from cW + spacing.
    _syncDensity() {
        if (this._baseSpacing == null) this._baseSpacing = this.config.spacing;
        const pitch = this.getColumnPitch();
        this.config.spacing = pitch >= this._baseSpacing + 2
            ? this._baseSpacing
            : Math.max(0, pitch - 2);
    }

    getPriceChartHeight() {
        const totalHeight = this.getCanvasHeight();
        const panelHeight = this.getTotalPanelHeight();
        // Volume is an overlay, not a separate region - don't subtract volumeHeight
        return totalHeight - this.config.padding.top - this.config.padding.bottom - panelHeight;
    }
    // Panel system: Get the Y position where volume bars start (bottom portion of price chart)
    getVolumeTopY() {
        // Volume draws in the bottom volumeHeight pixels of the price chart area
        return this.config.padding.top + this.getPriceChartHeight() - this.volumeHeight;
    }
    // Panel system: Get the Y position where indicator panels start (after price chart + volume overlay)
    getPanelsTopY() {
        return this.config.padding.top + this.getPriceChartHeight();
    }
    // Panel system: Get array of enabled panels with their Y boundaries
    getEnabledPanelBounds() {
        const panels = [];
        const panelIndicators = ['rsi', 'macd', 'stochastic', 'williamsR', 'mfi', 'roc', 'cci', 'adx', 'stochasticRSI', 'awesomeOscillator', 'trix', 'obv', 'adl', 'forceIndex', 'kst'];
        let y = this.getPanelsTopY();
        panelIndicators.forEach(key => {
            if (this.indicators[key] && this.indicators[key].enabled && this.indicatorPanels[key]) {
                const h = this.indicatorPanels[key].height;
                panels.push({ key, topY: y, height: h });
                y += h;
            }
        });
        return panels;
    }
    // Panel system: Find which separator (top edge of a panel) the mouse Y is near
    findPanelSeparatorAtY(mouseY) {
        const hitZone = 5;
        const panels = this.getEnabledPanelBounds();
        for (let i = 0; i < panels.length; i++) {
            if (Math.abs(mouseY - panels[i].topY) <= hitZone) {
                return { panelIndex: i, key: panels[i].key, panels };
            }
        }
        return null;
    }
    // Close an indicator panel: disable it, uncheck the dropdown, recalculate, redraw
    closePanelIndicator(key) {
        if (this.indicators[key]) {
            this.indicators[key].enabled = false;
            // Uncheck the corresponding checkbox in the indicators dropdown
            const checkbox = this.indicatorsDropdown.querySelector(`input[type="checkbox"][value="${key}"]`);
            if (checkbox) checkbox.checked = false;
            this.calculateIndicators();
            this.drawCharts();
            this.saveSettings();
        }
    }
    // Hit-test: check if mouse position is over a panel close button
    // Close button is drawn at leftX + 5, topY + 3, size 10x10
    findPanelCloseButtonAt(x, y) {
        const panels = this.getEnabledPanelBounds();
        const leftX = this.config.padding.left;
        for (let i = 0; i < panels.length; i++) {
            const btnX = leftX + 4;
            const btnY = panels[i].topY + 3;
            if (x >= btnX && x <= btnX + 10 && y >= btnY && y <= btnY + 10) {
                return panels[i].key;
            }
        }
        return null;
    }
    // Draw a close (X) button on a panel and return the X offset where the label should start
    drawPanelCloseButton(ctx, topY, key) {
        const leftX = this.config.padding.left;
        const btnX = leftX + 4;
        const btnY = topY + 3;
        const btnSize = 10;
        const isDark = this.chartContainer.classList.contains('dark-mode');
        // Detect hover
        const hovering = this.lastMouseX !== null && this.lastMouseY !== null &&
            this.lastMouseX >= btnX && this.lastMouseX <= btnX + btnSize &&
            this.lastMouseY >= btnY && this.lastMouseY <= btnY + btnSize;
        ctx.save();
        // Panel data is translated while panning; the close control stays at
        // its hit-test position at the viewport edge.
        ctx.translate(-this.pixelOffset, 0);
        ctx.strokeStyle = hovering ? '#ef4444' : (isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)');
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(btnX + 2, btnY + 2);
        ctx.lineTo(btnX + btnSize - 2, btnY + btnSize - 2);
        ctx.moveTo(btnX + btnSize - 2, btnY + 2);
        ctx.lineTo(btnX + 2, btnY + btnSize - 2);
        ctx.stroke();
        ctx.restore();
        // Return X position where the label should start (after the button)
        return leftX + 18 - this.pixelOffset;
    }
    // Alt+A / Alt+H place an alert or a line at the crosshair, matching the
    // shortcuts advertised in the (+) menu. Scoped to when the pointer is over
    // the chart so they can't collide with page-level shortcuts.
    setupPriceLineShortcuts() {
        this._priceLineKeyHandler = (e) => {
            if (!e.altKey || e.ctrlKey || e.metaKey) return;
            if (!this.mouseIsOverChart || this.lastMouseY === null) return;
            const key = (e.key || '').toLowerCase();
            if (key !== 'a' && key !== 'h') return;
            const price = this.priceAtY(this.lastMouseY);
            this.closeCrosshairMenu();
            if (key === 'a') this.handleAddAlertAtPrice(price); else this.handleDrawHorizontalLineAtPrice(price);
            e.preventDefault();
        };
        document.addEventListener('keydown', this._priceLineKeyHandler);
    }
    // Index of the candle closest to `timestamp`. Overlays store the timestamp they
    // were drawn against; after a timeframe change the candles are re-bucketed and
    // that exact timestamp no longer exists, so match the nearest one rather than
    // dropping the overlay.
    findCandleIndexByTime(timestamp) {
        if (timestamp === null || timestamp === undefined || !this.stockData.length) return -1;
        let bestIdx = -1, minDiff = Infinity;
        for (let i = 0; i < this.stockData.length; i++) {
            const diff = Math.abs(this.stockData[i].t - timestamp);
            if (diff < minDiff) { minDiff = diff; bestIdx = i }
            if (diff === 0) break;
        }
        return bestIdx;
    }
    // Cancel (x) on a working order's badge. Mirrors the price-line badges, so every
    // level the user can put on the chart is removed the same way.
    findLimitOrderCloseAt(x, y) {
        const areas = this.limitOrderHitAreas || [];
        for (let i = areas.length - 1; i >= 0; i--) {
            if (this._inRect(x, y, areas[i].closeRect)) return areas[i];
        }
        return null;
    }
    cancelLimitOrder(orderRef) {
        const handler = (typeof this.onLimitOrderCancel === 'function')
            ? this.onLimitOrderCancel
            : window.onChartLimitOrderCancel;
        if (typeof handler === 'function') handler(orderRef, this);
        this.container.dispatchEvent(new CustomEvent('sc-limit-order-cancel', { detail: { order: orderRef, chart: this }, bubbles: !0 }));
    }
    // Shares the crosshair order items would use. The host owns the number; the chart
    // only needs it to label the menu.
    getOrderQuantity() {
        const source = (typeof this.options.getOrderQuantity === 'function')
            ? this.options.getOrderQuantity
            : window.getChartOrderQuantity;
        if (typeof source === 'function') {
            const q = parseInt(source(), 10);
            if (q > 0) return q;
        }
        return 1;
    }
    // Limit or stop, decided by where the level sits relative to the market. Defers to
    // OrderEngine when the host has it so the label can't disagree with the order that
    // actually gets created; the fallback keeps the chart usable standalone.
    classifyOrderType(action, price) {
        const last = this.getLastPrice();
        if (window.OrderEngine && typeof window.OrderEngine.classify === 'function') {
            return window.OrderEngine.classify(action, price, last);
        }
        if (!isFinite(last)) return 'Limit';
        return action === 'Buy' ? (price > last ? 'Stop' : 'Limit') : (price < last ? 'Stop' : 'Limit');
    }
    handlePlaceOrderAtPrice(action, price) {
        const detail = {
            action: action,
            orderType: this.classifyOrderType(action, price),
            price: price,
            quantity: this.getOrderQuantity(),
            chart: this
        };
        const handler = (typeof this.options.onPlaceOrder === 'function')
            ? this.options.onPlaceOrder
            : window.onChartPlaceOrder;
        if (typeof handler === 'function') handler(detail);
        this.container.dispatchEvent(new CustomEvent('sc-place-order', { detail: detail, bubbles: !0 }));
    }
    // ---- Overlay hand-off across chart rebuilds --------------------------------
    // Changing timeframe or ticker tears the chart down and builds a new one, which
    // would otherwise drop everything the user placed by hand. All of these anchor
    // to price and time rather than candle index, so they carry over unchanged.
    captureOverlays() {
        return {
            // limitOrders keeps the HOST's object references, never copies: the host
            // splices its own array by identity and cancelLimitOrder hands the ref
            // back, so a clone would silently break cancelling a restored order.
            limitOrders: this.limitOrders.slice(),
            aiPriceLevels: this.aiPriceLevels.slice(),
            priceLines: this.priceLines.slice(),
            nextPriceLineId: this._nextPriceLineId,
            lines: this.lines.slice(),
            textAnnotations: this.textAnnotations.slice(),
            emoticons: this.emoticons.slice(),
            fibonacciRetracements: this.fibonacciRetracements.slice(),
            drawingShapes: this.drawingShapes.slice(),
            arrows: this.arrows.slice(),
            rectangles: this.rectangles.slice(),
            circles: this.circles.slice(),
            lineTools: (this.lineTools || []).slice()
        };
    }
    restoreOverlays(state) {
        if (!state) return;
        const keys = ['limitOrders', 'aiPriceLevels', 'priceLines', 'lines', 'textAnnotations', 'emoticons', 'fibonacciRetracements', 'drawingShapes', 'arrows', 'rectangles', 'circles', 'lineTools'];
        keys.forEach(k => { if (Array.isArray(state[k])) this[k] = state[k].slice() });
        // Keep issuing fresh ids so a restored line can't collide with a new one.
        if (state.nextPriceLineId > this._nextPriceLineId) this._nextPriceLineId = state.nextPriceLineId;
        this.resetDrawingHistory();
        this.drawCharts();
    }
    // ---- Drawing undo (Ctrl+Z) + clear all ------------------------------------
    // Snapshots every hand-drawn overlay after each pointer/key release and keeps
    // the previous state on a stack when it changed. Alerts are not drawings and
    // are never touched. Ctrl+Z only acts on the chart touched last, so pages with
    // several charts (side timeframes) undo one chart at a time.
    _drawingSnapshot() {
        try {
            return JSON.stringify({
                lines: this.lines, textAnnotations: this.textAnnotations, emoticons: this.emoticons,
                fibonacciRetracements: this.fibonacciRetracements, drawingShapes: this.drawingShapes,
                arrows: this.arrows, rectangles: this.rectangles, circles: this.circles,
                priceLines: this.priceLines.filter(l => l.kind === 'line'),
                lineTools: this.lineTools || []
            });
        } catch (e) { return null; }
    }
    resetDrawingHistory() { this._undoStack = []; this._drawingBaseline = this._drawingSnapshot(); }
    recordDrawingState() {
        // Mid-drag or mid-draw: wait for the gesture to finish.
        if (this._emoGesture || (this._lt && (this._lt.placing || this._lt.drag || this._lt.editing)) || this.drawingLine || this.draggedLine || this.drawingArrow || this.drawingRectangle || this.drawingCircle || this.drawingFibonacci || this.draggedPriceLine) return;
        const snap = this._drawingSnapshot();
        if (snap === null || snap === this._drawingBaseline) return;
        if (!this._undoStack) this._undoStack = [];
        if (this._drawingBaseline !== undefined && this._drawingBaseline !== null) this._undoStack.push(this._drawingBaseline);
        if (this._undoStack.length > 50) this._undoStack.shift();
        this._drawingBaseline = snap;
    }
    _applyDrawingSnapshot(snap) {
        const s = JSON.parse(snap);
        ['lines', 'textAnnotations', 'emoticons', 'fibonacciRetracements', 'drawingShapes', 'arrows', 'rectangles', 'circles', 'lineTools'].forEach(k => { this[k] = Array.isArray(s[k]) ? s[k] : [] });
        if (this._lt) this._lt.sel = this._lt.hover = null;
        const restoredLines = Array.isArray(s.priceLines) ? s.priceLines : [];
        this.priceLines = this.priceLines.filter(l => l.kind !== 'line').concat(restoredLines);
        restoredLines.forEach(l => { if (l.id >= this._nextPriceLineId) this._nextPriceLineId = l.id + 1 });
        this.selectedLineIndex = this.selectedTextIndex = this.selectedEmoticonIndex = this.selectedFibonacciIndex = null;
        this.selectedArrowIndex = this.selectedRectangleIndex = this.selectedCircleIndex = this.selectedShapeIndex = null;
        this.hoveredPriceLineId = this.hoveredPriceLineCloseId = null;
        this.drawCharts();
    }
    undoDrawing() {
        this.recordDrawingState();
        if (!this._undoStack || !this._undoStack.length) { if (this._showNotification) this._showNotification('Nothing to undo'); return; }
        const prev = this._undoStack.pop();
        this._applyDrawingSnapshot(prev);
        this._drawingBaseline = prev;
    }
    clearAllDrawings() {
        this.recordDrawingState();
        const empty = JSON.stringify({ lines: [], textAnnotations: [], emoticons: [], fibonacciRetracements: [], drawingShapes: [], arrows: [], rectangles: [], circles: [], priceLines: [], lineTools: [] });
        if (this._drawingBaseline === empty) return;
        this._applyDrawingSnapshot(empty);
        this.recordDrawingState(); // the pre-clear state lands on the stack, so Ctrl+Z brings it back
        if (this._showNotification) this._showNotification('Drawings cleared - Ctrl+Z to undo');
    }
    setupDrawingHistory() {
        this.resetDrawingHistory();
        this._drawingHistoryRelease = () => { setTimeout(() => { if (this.container.isConnected) this.recordDrawingState() }, 30) };
        this._drawingHistoryActivate = (e) => { if (this.container.contains(e.target)) StockChart._lastActiveChart = this };
        this._drawingUndoKey = (e) => {
            if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey || (e.key || '').toLowerCase() !== 'z') return;
            const t = e.target;
            if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
            if (!this.container.isConnected) return;
            const active = StockChart._lastActiveChart;
            if (active && active !== this && active.container && active.container.isConnected) return;
            this.undoDrawing();
            e.preventDefault();
        };
        document.addEventListener('pointerup', this._drawingHistoryRelease, true);
        document.addEventListener('keyup', this._drawingHistoryRelease, true);
        document.addEventListener('pointerdown', this._drawingHistoryActivate, true);
        document.addEventListener('keydown', this._drawingUndoKey);
    }
    teardownDrawingHistory() {
        if (!this._drawingHistoryRelease) return;
        document.removeEventListener('pointerup', this._drawingHistoryRelease, true);
        document.removeEventListener('keyup', this._drawingHistoryRelease, true);
        document.removeEventListener('pointerdown', this._drawingHistoryActivate, true);
        document.removeEventListener('keydown', this._drawingUndoKey);
        if (StockChart._lastActiveChart === this) StockChart._lastActiveChart = null;
    }
    // ---- Key levels (Indicators > Key levels) ----------------------------------
    // Day high/low (regular session), premarket high/low and prior close, drawn as
    // faint dashed lines with a tag at the right edge. Worked out from the candles
    // already on the chart, so a replay never shows a level from the future. Prior
    // close comes from the previous day's candles when loaded, else from the host
    // via setTickerInfo({ previousClose }). Candle dates are ET 'MM/DD/YYYY HH:mm'.
    _etDayMinutes(candle) {
        if (!candle || typeof candle.date !== 'string') return null;
        const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\D+(\d{1,2}):(\d{2})/.exec(candle.date);
        if (!m) return null;
        return { day: m[3] + '-' + m[1] + '-' + m[2], mins: (Number(m[4]) % 24) * 60 + Number(m[5]) };
    }
    computeKeyLevels() {
        const data = this.stockData;
        if (!data || !data.length) return [];
        const tf = this.getTimeframeMinutes(this.timeframe);
        if (tf >= 1440) return [];
        const last = data[data.length - 1];
        const sig = data.length + '|' + last.date + '|' + last.high + '|' + last.low + '|' + last.close + '|' + tf + '|' + this.keyLevelPrevClose;
        if (this._keyLevelCache && this._keyLevelCache.sig === sig) return this._keyLevelCache.levels;
        const lastPos = this._etDayMinutes(last);
        if (!lastPos) return [];
        // Stocks split premarket from the regular session; 24h markets (crypto/forex) don't.
        const sessions = !!this.config.useAfterHoursStyling;
        let hod = -Infinity, lod = Infinity, pmh = -Infinity, pml = Infinity, prevClose = null;
        for (let i = data.length - 1; i >= 0; i--) {
            const c = data[i], pos = this._etDayMinutes(c);
            if (!pos) continue;
            if (pos.day !== lastPos.day) {
                // Walking backwards, the first prior-day candle inside the regular session is its close.
                if (!sessions || pos.mins < 960) { prevClose = c.close; break; }
                continue;
            }
            if (sessions && pos.mins + tf <= 570) { if (c.high > pmh) pmh = c.high; if (c.low < pml) pml = c.low; }
            else if (!sessions || pos.mins < 960) { if (c.high > hod) hod = c.high; if (c.low < lod) lod = c.low; }
        }
        if (prevClose === null && this.keyLevelPrevClose > 0) prevClose = this.keyLevelPrevClose;
        const levels = [];
        if (isFinite(hod)) levels.push({ label: 'HOD', price: hod, color: '#3ED69B' });
        if (isFinite(lod)) levels.push({ label: 'LOD', price: lod, color: '#FF6E7A' });
        if (isFinite(pmh)) levels.push({ label: 'PMH', price: pmh, color: '#E8B04B' });
        if (isFinite(pml)) levels.push({ label: 'PML', price: pml, color: '#E8B04B' });
        if (prevClose > 0) levels.push({ label: 'PC', price: prevClose, color: '#8D96A6' });
        this._keyLevelCache = { sig: sig, levels: levels };
        return levels;
    }
    drawKeyLevels(ctx) {
        const levels = this.computeKeyLevels();
        if (!levels.length) return;
        const chartTop = this.config.padding.top;
        const chartH = this.getPriceChartHeight();
        const panelsTopY = this.getPanelsTopY();
        const chartLeft = this.config.padding.left;
        const chartRight = this.getCanvasWidth() - this.config.padding.right;
        const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
        let { min, max } = this.applyVerticalScale(rawRange);
        min += this.config.priceOffset; max += this.config.priceOffset;
        ctx.save();
        ctx.beginPath();
        ctx.rect(chartLeft, chartTop, chartRight - chartLeft, chartH);
        ctx.clip();
        ctx.font = '600 10px Arial';
        ctx.textBaseline = 'middle';
        const h = 14;
        // Tags sit at the left edge, away from the live price action. Levels close
        // enough to overlap (e.g. HOD next to PMH) stack downward, top to bottom.
        const rows = levels
            .map(level => ({ level: level, y: Math.round(this.priceToY(level.price, min, max, chartH, this.getCanvasHeight())) + 0.5 }))
            .filter(r => r.y >= chartTop && r.y < panelsTopY)
            .sort((a, b) => a.y - b.y);
        let lastTagY = -Infinity;
        rows.forEach(r => { r.tagY = Math.max(r.y, lastTagY + h + 2); lastTagY = r.tagY; });
        rows.forEach(({ level, y, tagY }) => {
            ctx.save();
            ctx.globalAlpha = 0.55;
            ctx.strokeStyle = level.color;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.moveTo(chartLeft, y);
            ctx.lineTo(chartRight, y);
            ctx.stroke();
            ctx.restore();
            const text = level.label + ' ' + this.formatMenuPrice(level.price);
            const w = ctx.measureText(text).width + 8;
            const x = chartLeft + 4;
            ctx.save();
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = this.config.darkMode ? 'rgba(14,16,22,0.9)' : 'rgba(255,255,255,0.9)';
            this._crosshairLabelPath(ctx, x, tagY - h / 2, w, h, 3);
            ctx.fill();
            ctx.strokeStyle = level.color;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = level.color;
            ctx.textAlign = 'left';
            ctx.fillText(text, x + 4, tagY + 0.5);
            ctx.restore();
        });
        ctx.restore();
    }
    // ---- User price lines (horizontal lines + alerts) -------------------------
    // One store backs both: `kind` is 'line' or 'alert'. Alerts additionally carry
    // `armedAbove`, the cross direction latched when the alert was created.
    addPriceLine(opts) {
        const line = {
            id: this._nextPriceLineId++,
            kind: opts.kind || 'line',
            price: opts.price,
            color: opts.color || '#787b86',
            label: opts.label || '',
            armedAbove: opts.armedAbove
        };
        this.priceLines.push(line);
        this.drawCharts();
        return line;
    }
    removePriceLine(id) {
        const i = this.priceLines.findIndex(l => l.id === id);
        if (i === -1) return null;
        const [removed] = this.priceLines.splice(i, 1);
        this.drawCharts();
        this.container.dispatchEvent(new CustomEvent('sc-price-line-removed', { detail: { line: removed, chart: this }, bubbles: !0 }));
        return removed;
    }
    getPriceLines(kind) { return kind ? this.priceLines.filter(l => l.kind === kind) : this.priceLines.slice() }
    clearPriceLines(kind) {
        this.priceLines = kind ? this.priceLines.filter(l => l.kind !== kind) : [];
        this.drawCharts();
    }
    priceLineLabelText(line) {
        const priceText = this.formatMenuPrice(this.draggedPriceLine && this.draggedPriceLine.lineRef === line ? this.draggedPriceLine.previewPrice : line.price);
        return line.label ? line.label + ' ' + priceText : priceText;
    }
    drawPriceLines(ctx) {
        this.priceLineHitAreas = [];
        if (!this.priceLines.length) return;
        const chartTop = this.config.padding.top;
        const chartH = this.getPriceChartHeight();
        const panelsTopY = this.getPanelsTopY();
        const chartLeft = this.config.padding.left;
        const chartRight = this.getCanvasWidth() - this.config.padding.right;
        const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
        let { min, max } = this.applyVerticalScale(rawRange);
        min += this.config.priceOffset; max += this.config.priceOffset;
        ctx.save();
        ctx.beginPath();
        ctx.rect(chartLeft, chartTop, chartRight - chartLeft, chartH);
        ctx.clip();
        this.priceLines.forEach(line => {
            const isDraggingThis = !!(this.draggedPriceLine && this.draggedPriceLine.lineRef === line);
            const price = isDraggingThis ? this.draggedPriceLine.previewPrice : line.price;
            const y = this.priceToY(price, min, max, chartH, this.getCanvasHeight());
            if (y < chartTop || y >= panelsTopY) return;
            const isHovered = this.hoveredPriceLineId === line.id;
            ctx.save();
            ctx.setLineDash(line.kind === 'alert' ? [6, 4] : []);
            ctx.strokeStyle = line.color;
            ctx.lineWidth = (isDraggingThis || isHovered) ? this.config.drawingLineWidthSelected : this.config.drawingLineWidth;
            ctx.beginPath();
            ctx.moveTo(chartLeft, y);
            ctx.lineTo(chartRight, y);
            ctx.stroke();
            ctx.restore();

            // Badge with the label, the price, and a delete (x) that is always
            // visible so the level can be removed without hunting for it.
            const labelText = this.priceLineLabelText(line);
            ctx.font = '12px Arial';
            const labelPadding = 5;
            const badgeHeight = 20;
            const closeW = 15;
            const badgeWidth = ctx.measureText(labelText).width + 2 * labelPadding + closeW;
            const badgeX = chartLeft + 5;
            const badgeY = y - badgeHeight / 2;
            ctx.save();
            ctx.fillStyle = line.color;
            this._crosshairLabelPath(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 3);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, badgeX + labelPadding, badgeY + badgeHeight / 2);

            const cx = badgeX + badgeWidth - closeW / 2 - 2;
            const cy = badgeY + badgeHeight / 2;
            const closeHovered = this.hoveredPriceLineCloseId === line.id;
            ctx.strokeStyle = closeHovered ? '#ffffff' : 'rgba(255,255,255,0.75)';
            ctx.lineWidth = closeHovered ? 1.8 : 1.4;
            ctx.beginPath();
            ctx.moveTo(cx - 3.2, cy - 3.2); ctx.lineTo(cx + 3.2, cy + 3.2);
            ctx.moveTo(cx + 3.2, cy - 3.2); ctx.lineTo(cx - 3.2, cy + 3.2);
            ctx.stroke();
            ctx.restore();

            this.priceLineHitAreas.push({
                line: line, y: y,
                badgeRect: { x: badgeX, y: badgeY, w: badgeWidth, h: badgeHeight },
                closeRect: { x: cx - 8, y: cy - 9, w: 16, h: 18 }
            });
        });
        ctx.restore();
    }
    _inRect(x, y, rect) {
        return !!rect && x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
    }
    findPriceLineAt(x, y) {
        const areas = this.priceLineHitAreas || [];
        // The badge sits on top of the line, so test it first.
        for (let i = areas.length - 1; i >= 0; i--) {
            if (this._inRect(x, y, areas[i].badgeRect)) return areas[i];
        }
        const chartLeft = this.config.padding.left, chartRight = this.getCanvasWidth() - this.config.padding.right;
        if (x < chartLeft || x > chartRight) return null;
        for (let i = areas.length - 1; i >= 0; i--) {
            if (Math.abs(y - areas[i].y) <= 4) return areas[i];
        }
        return null;
    }
    findPriceLineCloseAt(x, y) {
        const areas = this.priceLineHitAreas || [];
        for (let i = areas.length - 1; i >= 0; i--) {
            if (this._inRect(x, y, areas[i].closeRect)) return areas[i];
        }
        return null;
    }
    startPriceLineDrag(line, clientY) {
        this.draggedPriceLine = { lineRef: line, previewPrice: line.price, startClientY: clientY, startPrice: line.price };
        this.priceCanvas.style.cursor = 'ns-resize';
    }
    handlePriceLineDrag(clientY) {
        if (!this.draggedPriceLine) return;
        const rect = this.priceCanvas.getBoundingClientRect();
        const y = clientY - rect.top;
        this.draggedPriceLine.previewPrice = this.priceAtY(y);
        this.drawCharts();
    }
    endPriceLineDrag() {
        if (!this.draggedPriceLine) return;
        const { lineRef, previewPrice } = this.draggedPriceLine;
        lineRef.price = previewPrice;
        // Moving an alert re-latches its direction against the current price.
        if (lineRef.kind === 'alert') {
            const last = this.getLastPrice();
            if (isFinite(last)) lineRef.armedAbove = lineRef.price > last;
        }
        this.draggedPriceLine = null;
        this.priceCanvas.style.cursor = 'default';
        this.drawCharts();
        this.container.dispatchEvent(new CustomEvent('sc-price-line-moved', { detail: { line: lineRef, chart: this }, bubbles: !0 }));
    }
    // ---- Crosshair (+) button on the price axis -------------------------------
    // Bounds of the small circular (+) button that rides along with the crosshair
    // price label on the right-hand price scale (TradingView-style).
    getCrosshairAddButtonRect() {
        if (this.config.showCrosshairAddButton === !1) return null;
        if (!this.mouseIsOverChart || this.lastMouseY === null || !this.stockData.length) return null;
        const chartTop = this.config.padding.top;
        const chartBottom = chartTop + this.getPriceChartHeight();
        if (this.lastMouseY < chartTop || this.lastMouseY > chartBottom) return null;
        const radius = 8;
        const cx = this.getCanvasWidth() - this.config.padding.right - radius - 4;
        return { cx: cx, cy: this.lastMouseY, radius: radius };
    }
    findCrosshairAddButtonAt(x, y) {
        const r = this.getCrosshairAddButtonRect();
        if (!r) return null;
        const dx = x - r.cx, dy = y - r.cy;
        const hit = r.radius + 2;
        return (dx * dx + dy * dy) <= hit * hit ? r : null;
    }
    drawCrosshairAddButton(ctx) {
        const r = this.getCrosshairAddButtonRect();
        if (!r) return;
        const hovering = this.lastMouseX !== null && this.findCrosshairAddButtonAt(this.lastMouseX, this.lastMouseY) !== null;
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.cx, r.cy, r.radius, 0, Math.PI * 2);
        ctx.fillStyle = hovering ? 'rgba(90, 95, 100, 0.95)' : 'rgba(60, 64, 67, 0.9)';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = hovering ? '#FFFFFF' : 'rgba(240,240,240,0.65)';
        ctx.stroke();
        const arm = 4;
        ctx.beginPath();
        ctx.moveTo(r.cx - arm, r.cy); ctx.lineTo(r.cx + arm, r.cy);
        ctx.moveTo(r.cx, r.cy - arm); ctx.lineTo(r.cx, r.cy + arm);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = hovering ? '#FFFFFF' : '#F0F0F0';
        ctx.stroke();
        ctx.restore();
    }
    // Price at a given canvas Y within the price panel
    priceAtY(y) {
        const chartTop = this.config.padding.top;
        const chartH = this.getPriceChartHeight();
        const chartBottom = chartTop + chartH;
        const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
        let { min, max } = this.applyVerticalScale(rawRange);
        min += this.config.priceOffset; max += this.config.priceOffset;
        return min + (max - min) * ((chartBottom - y) / chartH);
    }
    handleCrosshairAddButtonClick(x, y) {
        this.openCrosshairMenu(this.priceAtY(y), x, y);
    }
    // Items shown in the crosshair (+) menu. Each entry is {icon, label, hint, action},
    // or {separator: true} for a divider.
    getCrosshairMenuItems(price) {
        const priceText = this.formatMenuPrice(price);
        const items = [
            {
                icon: '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="9" cy="10" r="6"/><path d="M9 7v3l2 1.5M6 3.5 3.5 5.5M12 3.5 14.5 5.5M15 14h5M17.5 11.5v5"/></svg>',
                label: 'Add alert at ' + priceText,
                hint: 'Alt + A',
                action: () => this.handleAddAlertAtPrice(price)
            },
            { separator: !0 },
            {
                icon: '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12l6-6 6 6"/></svg>',
                label: 'Buy ' + this.getOrderQuantity() + ' @ ' + priceText + ' ' + this.classifyOrderType('Buy', price).toLowerCase(),
                hint: '',
                action: () => this.handlePlaceOrderAtPrice('Buy', price)
            },
            {
                icon: '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8l6 6 6-6"/></svg>',
                label: 'Sell ' + this.getOrderQuantity() + ' @ ' + priceText + ' ' + this.classifyOrderType('Sell', price).toLowerCase(),
                hint: '',
                action: () => this.handlePlaceOrderAtPrice('Sell', price)
            },
            { separator: !0 },
            {
                icon: '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 10h4M14 10h4"/><circle cx="10" cy="10" r="2.6"/></svg>',
                label: 'Draw horizontal line at ' + priceText,
                hint: 'Alt + H',
                action: () => this.handleDrawHorizontalLineAtPrice(price)
            }
        ];
        // Trading entries only make sense on a page wired to place orders.
        const canTrade = typeof this.options.onPlaceOrder === 'function' || typeof window.onChartPlaceOrder === 'function';
        if (!canTrade) {
            const cut = items.findIndex(i => i.separator);
            items.splice(cut, 4);
        }
        // Host pages can add to or replace these without forking the library.
        if (this.options && typeof this.options.crosshairMenuItems === 'function') {
            const custom = this.options.crosshairMenuItems(price, items, this);
            if (Array.isArray(custom)) return custom;
        }
        return items;
    }
    formatMenuPrice(price) {
        const abs = Math.abs(price);
        const text = price.toFixed(abs >= 1 ? 2 : 4);
        const parts = text.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }
    // opts.items replaces the default (+) items; opts.atCursor opens the menu down-right
    // of (x, y) in container coordinates, context-menu style, instead of hanging off
    // the (+) button.
    openCrosshairMenu(price, x, y, opts) {
        opts = opts || {};
        this.closeCrosshairMenu();
        const items = opts.items || this.getCrosshairMenuItems(price);
        if (!items.length) return;
        const isDark = this.chartContainer.classList.contains('dark-mode') || this.config.darkMode;
        const bg = isDark ? '#1e222d' : '#ffffff';
        const fg = isDark ? '#d1d4dc' : '#131722';
        const hintFg = isDark ? '#787b86' : '#9598a1';
        const border = isDark ? '#2a2e39' : '#e0e3eb';
        const hoverBg = isDark ? '#2a2e39' : '#f0f3fa';

        const menu = document.createElement('div');
        menu.className = 'sc-crosshair-menu';
        menu.style.cssText = 'position:absolute;z-index:200;min-width:250px;padding:6px 0;border-radius:6px;' +
            'background:' + bg + ';color:' + fg + ';border:1px solid ' + border + ';' +
            'box-shadow:0 4px 16px rgba(0,0,0,0.35);font:13px Arial,Helvetica,sans-serif;user-select:none;';

        items.forEach(item => {
            if (item.separator) {
                const hr = document.createElement('div');
                hr.style.cssText = 'height:1px;margin:6px 0;background:' + border + ';';
                menu.appendChild(hr);
                return;
            }
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:7px 14px;cursor:pointer;white-space:nowrap;';
            const ico = document.createElement('span');
            ico.style.cssText = 'display:flex;flex:0 0 15px;opacity:0.85;';
            ico.innerHTML = item.icon || '';
            const label = document.createElement('span');
            label.textContent = item.label;
            label.style.cssText = 'flex:1 1 auto;';
            const hint = document.createElement('span');
            hint.textContent = item.hint || '';
            hint.style.cssText = 'flex:0 0 auto;padding-left:18px;color:' + hintFg + ';font-size:12px;';
            row.appendChild(ico); row.appendChild(label); row.appendChild(hint);
            row.addEventListener('mouseenter', () => { row.style.background = hoverBg });
            row.addEventListener('mouseleave', () => { row.style.background = 'transparent' });
            row.addEventListener('mousedown', e => e.stopPropagation());
            row.addEventListener('click', e => {
                e.stopPropagation();
                const fn = item.action;
                this.closeCrosshairMenu();
                if (typeof fn === 'function') fn();
            });
            menu.appendChild(row);
        });

        this.chartContainer.appendChild(menu);
        this.crosshairMenuEl = menu;
        this.crosshairMenuOpen = !0;
        this.crosshairMenuPrice = price;

        // Hang below-left of the (+) button, flipping if it would overflow the container.
        const cw = this.chartContainer.clientWidth, chH = this.chartContainer.clientHeight;
        const mw = menu.offsetWidth, mh = menu.offsetHeight;
        let left = opts.atCursor ? x + 2 : x - mw + 12;
        let top = opts.atCursor ? y + 2 : y + 10;
        if (left + mw > cw - 4) left = opts.atCursor ? Math.max(4, x - mw - 2) : cw - mw - 4;
        if (left < 4) left = 4;
        if (top + mh > chH - 4) top = Math.max(4, y - mh - (opts.atCursor ? 2 : 10));
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';

        this._crosshairMenuDismiss = (e) => {
            if (this.crosshairMenuEl && this.crosshairMenuEl.contains(e.target)) return;
            this.closeCrosshairMenu();
        };
        this._crosshairMenuKey = (e) => { if (e.key === 'Escape') this.closeCrosshairMenu() };
        // touchstart too: the canvas cancels touchstart, so a tap on the chart never
        // produces the mousedown that would otherwise dismiss the menu.
        setTimeout(() => {
            document.addEventListener('mousedown', this._crosshairMenuDismiss, !0);
            document.addEventListener('touchstart', this._crosshairMenuDismiss, !0);
            document.addEventListener('keydown', this._crosshairMenuKey);
        }, 0);
        this.drawCharts();
    }
    closeCrosshairMenu() {
        if (this._crosshairMenuDismiss) { document.removeEventListener('mousedown', this._crosshairMenuDismiss, !0); document.removeEventListener('touchstart', this._crosshairMenuDismiss, !0); this._crosshairMenuDismiss = null }
        if (this._crosshairMenuKey) { document.removeEventListener('keydown', this._crosshairMenuKey); this._crosshairMenuKey = null }
        if (this.crosshairMenuEl && this.crosshairMenuEl.parentNode) this.crosshairMenuEl.parentNode.removeChild(this.crosshairMenuEl);
        this.crosshairMenuEl = null;
        const wasOpen = this.crosshairMenuOpen;
        this.crosshairMenuOpen = !1;
        if (wasOpen) this.drawCharts();
    }
    handleAddAlertAtPrice(price) {
        // Latch the direction at creation: an alert placed above the current price
        // is waiting for an up-cross, one placed below is waiting for a down-cross.
        const last = this.getLastPrice();
        const line = this.addPriceLine({
            kind: 'alert',
            price: price,
            color: '#2962ff',
            label: 'Alert',
            armedAbove: isFinite(last) ? price > last : !0
        });
        const detail = { price: price, line: line, chart: this };
        if (this.options && typeof this.options.onAddAlert === 'function') this.options.onAddAlert(detail);
        this.container.dispatchEvent(new CustomEvent('sc-add-alert', { detail: detail, bubbles: !0 }));
        return line;
    }
    handleDrawHorizontalLineAtPrice(price) {
        const line = this.addPriceLine({ kind: 'line', price: price, color: this.config.drawingLineColor, label: '' });
        const detail = { price: price, line: line, chart: this };
        if (this.options && typeof this.options.onDrawHorizontalLine === 'function') this.options.onDrawHorizontalLine(detail);
        this.container.dispatchEvent(new CustomEvent('sc-draw-horizontal-line', { detail: detail, bubbles: !0 }));
        return line;
    }
    // ---- Right-click / long-press support & resistance ------------------------
    // Snaps a full-width price line to the clicked candle's wick or body, so a level
    // can be marked without switching the toolbar into a drawing mode.
    handleDrawLevelLine(price, label) {
        const line = this.addPriceLine({ kind: 'line', price: price, color: this.config.drawingLineColor, label: label });
        const detail = { price: price, line: line, chart: this };
        if (this.options && typeof this.options.onDrawHorizontalLine === 'function') this.options.onDrawHorizontalLine(detail);
        this.container.dispatchEvent(new CustomEvent('sc-draw-horizontal-line', { detail: detail, bubbles: !0 }));
        return line;
    }
    // Removes every drawn horizontal line; alerts are left alone.
    clearHorizontalLines() {
        this.getPriceLines('line').forEach(l => this.removePriceLine(l.id));
    }
    getCandleContextMenuItems(x, y) {
        const levelIcon = (up) => '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 ' + (up ? 5 : 15) + 'h16"/><path d="' + (up ? 'M6 16l4-7 4 4' : 'M6 4l4 7 4-4') + '"/></svg>';
        const items = [];
        const idx = this.getCandleIndexAtX(x);
        const candle = idx !== null ? this.stockData[idx] : null;
        if (candle) {
            const bodyTop = Math.max(candle.open, candle.close), bodyBottom = Math.min(candle.open, candle.close);
            const level = (up, label, where, price) => ({ icon: levelIcon(up), label: label + ' at ' + where, hint: this.formatMenuPrice(price), action: () => this.handleDrawLevelLine(price, label) });
            items.push(
                level(!0, 'Resistance', 'wick', candle.high),
                level(!0, 'Resistance', 'body', bodyTop),
                { separator: !0 },
                level(!1, 'Support', 'body', bodyBottom),
                level(!1, 'Support', 'wick', candle.low),
                { separator: !0 }
            );
        }
        const cursorPrice = this.priceAtY(y);
        items.push({
            icon: '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 10h4M14 10h4"/><circle cx="10" cy="10" r="2.6"/></svg>',
            label: 'Horizontal line at ' + this.formatMenuPrice(cursorPrice),
            hint: 'Alt + H',
            action: () => this.handleDrawHorizontalLineAtPrice(cursorPrice)
        });
        const removeIcon = '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 5l10 10M15 5L5 15"/></svg>';
        const hit = this.findPriceLineAt(x, y);
        if (hit) items.push({ icon: removeIcon, label: 'Remove this ' + (hit.line.kind === 'alert' ? 'alert' : 'line'), hint: '', action: () => this.removePriceLine(hit.line.id) });
        const count = this.getPriceLines('line').length;
        if (count) items.push({ separator: !0 }, { icon: removeIcon, label: 'Clear all horizontal lines (' + count + ')', hint: '', action: () => this.clearHorizontalLines() });
        return items;
    }
    // x, y are canvas coordinates; the menu itself lives in chartContainer.
    openCandleContextMenu(x, y) {
        const chartTop = this.config.padding.top, chartBottom = chartTop + this.getPriceChartHeight();
        const chartLeft = this.config.padding.left, chartRight = this.getCanvasWidth() - this.config.padding.right;
        if (x < chartLeft || x > chartRight || y < chartTop || y > chartBottom || !this.stockData.length) return !1;
        const canvasRect = this.priceCanvas.getBoundingClientRect(), containerRect = this.chartContainer.getBoundingClientRect();
        const items = this.getCandleContextMenuItems(x, y);
        this.openCrosshairMenu(this.priceAtY(y), x + canvasRect.left - containerRect.left, y + canvasRect.top - containerRect.top, { items: items, atCursor: !0 });
        return !0;
    }
    // Long-press on touch opens the same menu. Any real movement, lift, or a second
    // finger cancels it, so panning and pinch-zoom behave exactly as before.
    setupLongPressMenu() {
        let timer = null, startX = 0, startY = 0;
        const cancel = () => { if (timer) { clearTimeout(timer); timer = null } };
        this.priceCanvas.addEventListener('touchstart', (e) => {
            cancel();
            if (e.touches.length !== 1) return;
            startX = e.touches[0].clientX; startY = e.touches[0].clientY;
            timer = setTimeout(() => {
                timer = null;
                const rect = this.priceCanvas.getBoundingClientRect();
                if (this.cursorPrefs && this.cursorPrefs.valuesTooltip) { this.startValuesTooltip(startX - rect.left, startY - rect.top); return }
                if (!this.openCandleContextMenu(startX - rect.left, startY - rect.top)) return;
                this._longPressMenuAt = Date.now();
                if (this.isDragging) { this.isDragging = !1; this.pixelOffset = 0; this.priceCanvas.classList.remove('dragging'); this.drawCharts() }
            }, 550);
        }, { passive: !0 });
        this.priceCanvas.addEventListener('touchmove', (e) => {
            if (!timer) return;
            const t = e.touches[0];
            if (e.touches.length !== 1 || Math.hypot(t.clientX - startX, t.clientY - startY) > 8) cancel();
        }, { passive: !0 });
        this.priceCanvas.addEventListener('touchend', cancel);
        this.priceCanvas.addEventListener('touchcancel', cancel);
    }
    getLastPrice() {
        if (!this.stockData.length) return NaN;
        const c = this.stockData[this.stockData.length - 1];
        return c ? c.close : NaN;
    }
    // Draw subtle resize grip handles centered on each panel separator line
    drawPanelResizeHandles(ctx) {
        const panels = this.getEnabledPanelBounds();
        if (panels.length === 0) return;
        const w = this.getCanvasWidth();
        const centerX = w / 2;
        const isDark = this.chartContainer.classList.contains('dark-mode');
        const isHovering = this.lastMouseY !== null && this.findPanelSeparatorAtY(this.lastMouseY) !== null;
        const gripColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)';
        const gripColorHover = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
        for (let i = 0; i < panels.length; i++) {
            const sepY = panels[i].topY;
            const hovering = this.lastMouseY !== null && Math.abs(this.lastMouseY - sepY) <= 5;
            ctx.save();
            ctx.fillStyle = hovering || this.panelResizing ? gripColorHover : gripColor;
            // Draw 3 small horizontal bars as grip indicator
            for (let j = -1; j <= 1; j++) {
                ctx.fillRect(centerX - 10, sepY + j * 3 - 0.5, 20, 1);
            }
            ctx.restore();
        }
    }
    getFontSize(type) {
        const s = this.getScreenSizeCategory(); if (type === 'watermark') { if (s === 'xs') return 'bold 40px Arial'; if (s === 'sm') return 'bold 50px Arial'; if (s === 'md') return 'bold 60px Arial'; if (s === 'lg') return 'bold 70px Arial'; if (s === 'xl') return 'bold 80px Arial'; return 'bold 60px Arial' } else if (type === 'branding') { if (s === 'xs') return '9px Arial'; if (s === 'sm') return '10px Arial'; if (s === 'md') return '12px Arial'; return '12px Arial' }
        return '11px Arial'
    }
    updateResponsiveConfig() {
        this.config.visibleCandles = this.getInitialVisibleCandles(); this.config.maxVisibleCandles = this.getMaxVisibleCandles(); this.config.watermark.font = this.getFontSize('watermark'); this.config.branding.font = this.getFontSize('branding'); if (this.screenSize === 'xs' || this.screenSize === 'sm') { this.config.padding.right = 50; this.config.spacing = 2; this.config.candleWidth = 8 } else { this.config.padding.right = 60; this.config.spacing = 4; this.config.candleWidth = 10 }
        this.config.dataOffset = Math.max(0, this.stockData.length - this.config.visibleCandles)
    }
    debounce(fn, wait) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait) } }
    // toolbarLayout: 'side' moves the floating button row into a top bar (chart settings)
    // and a left strip (drawing tools). The canvas sits beside the bars, not under them.
    // Pages turn it on with the option or, for charts built in several places (the
    // replay sim), a parse-time window.S8_CHART_TOOLBAR: 'side' for every chart on the
    // page, or a list of container ids (['newChart']) so side charts keep their toolbar.
    static _pageWantsSide(id) {
        const g = window.S8_CHART_TOOLBAR;
        return Array.isArray(g) ? g.indexOf(id) >= 0 : g === 'side';
    }
    applyToolbarLayout() {
        if ((this.options.toolbarLayout || 'side') !== 'side') return;
        const root = this.container.querySelector('.sc-chart-container');
        const chartArea = root.querySelector('.sc-price-chart-container');
        const overlay = root.querySelector('.sc-chart-controls-overlay');
        if (!root || !chartArea || !overlay) return;
        this.sideLayout = true;
        root.classList.add('sc-layout-side');
        const top = document.createElement('div'); top.className = 'sc-topbar';
        const side = document.createElement('div'); side.className = 'sc-sidebar';
        const btn = (cls) => overlay.querySelector('.' + cls);
        const sep = () => { const s = document.createElement('span'); s.className = 'sc-bar-sep'; return s; };
        const spacer = () => { const s = document.createElement('span'); s.className = 'sc-bar-spacer'; return s; };
        const put = (bar, classes) => classes.forEach(c => { const b = btn(c); if (b) bar.appendChild(b); });
        // Top: what you're looking at. Left: what you draw with.
        const tf = btn('sc-timeframe-button');
        if (tf) { tf.classList.add('sc-bar-text-button'); tf.innerHTML = '<span class="sc-tf-label"></span>'; top.appendChild(tf); }
        top.appendChild(sep());
        put(top, ['sc-chart-type-button']);
        top.appendChild(sep());
        const ind = btn('sc-indicators-button');
        if (ind) { ind.classList.add('sc-bar-text-button'); ind.insertAdjacentHTML('beforeend', '<span>Indicators</span>'); top.appendChild(ind); }
        top.appendChild(spacer());
        put(top, ['sc-fit-view-button', 'sc-dark-mode-button', 'sc-camera-button', 'sc-maximize-button']);
        put(side, ['sc-line-tool-button', 'sc-drawing-tools-button', 'sc-fibonacci-tool-button']);
        side.appendChild(sep());
        put(side, ['sc-text-tool-button', 'sc-emoticon-tool-button']);
        side.appendChild(sep());
        put(side, ['sc-measure-button']);
        // Anything left over (buttons added later by other versions) goes to the bottom of the strip.
        Array.from(overlay.children).forEach(b => side.appendChild(b));
        overlay.remove();
        root.insertBefore(side, chartArea);
        root.insertBefore(top, side);
        // Popups live in the chart area; open each next to the button that owns it.
        const menus = [
            ['sc-timeframe-button', '.sc-timeframe-dropdown', 'top'], ['sc-chart-type-button', '.sc-charttype-dropdown', 'top'],
            ['sc-indicators-button', '.sc-indicators-dropdown', 'top'], ['sc-drawing-tools-button', '.sc-drawing-tools-panel', 'side'],
            ['sc-emoticon-tool-button', '.sc-emoticon-panel', 'side'], ['sc-text-tool-button', '.sc-text-settings-panel', 'side']
        ];
        menus.forEach(([b, sel, bar]) => {
            const button = root.querySelector('.' + b), menu = root.querySelector(sel);
            if (!button || !menu) return;
            button.addEventListener('click', () => {
                const a = chartArea.getBoundingClientRect(), r = button.getBoundingClientRect();
                if (bar === 'top') { menu.style.top = '4px'; menu.style.left = Math.max(4, r.left - a.left) + 'px'; }
                else { menu.style.left = '4px'; menu.style.top = Math.max(4, r.top - a.top) + 'px'; }
            }, true);
        });
        // Top-row icons in the strip's thin outline style. Every shape carries fill="none"
        // so the old dark-mode rule that paints filled toolbar glyphs white leaves them alone.
        const ic = (d) => `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
        const TOP_ICONS = {
            fit: ic('<path fill="none" d="M5 5.5h18M5 22.5h18M14 9v10M11 11.5l3-3 3 3M11 16.5l3 3 3-3"/>'),
            camera: ic('<path fill="none" d="M4.5 10a2 2 0 0 1 2-2h3.2l1.6-2.5h5.4L18.3 8h3.2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z"/><circle fill="none" cx="14" cy="14.5" r="4"/>'),
            full: ic('<path fill="none" d="M5 10.5V5h5.5M17.5 5H23v5.5M23 17.5V23h-5.5M10.5 23H5v-5.5"/>'),
            sun: ic('<circle fill="none" cx="14" cy="14" r="4.5"/><path fill="none" d="M14 3.5v2.5M14 22v2.5M3.5 14h2.5M22 14h2.5M6.6 6.6l1.8 1.8M19.6 19.6l1.8 1.8M6.6 21.4l1.8-1.8M19.6 8.4l1.8-1.8"/>'),
            moon: ic('<path fill="none" d="M21.5 16.5A8.5 8.5 0 1 1 11.5 6.5a7 7 0 0 0 10 10z"/>')
        };
        const setIcon = (cls, svg) => { const b = top.querySelector('.' + cls); if (b) b.innerHTML = svg };
        setIcon('sc-fit-view-button', TOP_ICONS.fit);
        setIcon('sc-camera-button', TOP_ICONS.camera);
        setIcon('sc-maximize-button', TOP_ICONS.full);
        // Just "Indicators" - no TA badge.
        if (ind) { const badge = ind.querySelector('svg'); if (badge) badge.remove() }
        const plainDarkIcon = this.updateDarkModeIcon.bind(this);
        this.updateDarkModeIcon = () => {
            if (!this.darkModeButton) return plainDarkIcon();
            this.darkModeButton.innerHTML = this.config.darkMode ? TOP_ICONS.sun : TOP_ICONS.moon;
        };
        this.updateDarkModeIcon();
        const info = root.querySelector('.sc-chart-info-overlay');
        if (info) info.style.top = '8px';
        this.updateTimeframeButtonLabel();
    }
    // ---- Cursor tools (Cross / Dot / Arrow / Demonstration / Magic / Eraser) ----------
    // One button opens the menu. The choice changes the pointer (crosshair lines always
    // show) and adds pointer effects on a pass-through canvas over the chart. Eraser
    // deletes the drawing under a click (Ctrl+Z restores it: history records on pointerup).
    static cursorIcons() {
        const s = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
        return {
            cross: s('<path d="M12 3v6.5M12 14.5V21M3 12h6.5M14.5 12H21"/>'),
            dot: s('<circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/>'),
            arrow: s('<path d="M6.5 3.5 18 12.4l-5.2.9 3 6.4-2.2 1-3-6.5-4.1 3.4z"/>'),
            demonstration: s('<circle cx="12" cy="12" r="9"/><path d="M9.5 7.5 16 12.3l-2.9.5 1.6 3.4-1.2.6-1.6-3.5-2.4 2z"/>'),
            magic: s('<path d="m4 20 10.5-10.5"/><path d="m13 8 3 3"/><path d="M18 2.5v3M16.5 4h3M20.5 8.5v2M19.5 9.5h2M10 3.5v2M9 4.5h2"/>'),
            eraser: s('<path d="M8.5 20H20"/><path d="m5.6 13.9 8.2-8.2a2 2 0 0 1 2.8 0l2.7 2.7a2 2 0 0 1 0 2.8L11 19.5a2 2 0 0 1-1.4.5H8.4a2 2 0 0 1-1.4-.6l-1.4-1.4a2.2 2.2 0 0 1 0-3z"/><path d="m9.6 9.9 5.5 5.5"/>')
        };
    }
    static cursorCss() {
        if (StockChart._cursorCssDone) return; StockChart._cursorCssDone = true;
        const url = (svg, x, y, fb) => `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${x} ${y}, ${fb}`;
        const dot = url('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="3.2" fill="#fff" stroke="#131722" stroke-width="1.4"/></svg>', 8, 8, 'crosshair');
        const wand = url('<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><path d="M7 7 22 22" stroke="#131722" stroke-width="4.5" stroke-linecap="round"/><path d="M7 7 22 22" stroke="#c8a2ff" stroke-width="2.4" stroke-linecap="round"/><path d="M4 1.5 5 3.5l2 1-2 1-1 2-1-2-2-1 2-1z" fill="#ffd54a" stroke="#131722" stroke-width=".8"/></svg>', 4, 4, 'pointer');
        const eraser = url('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m5.6 13.9 8.2-8.2a2 2 0 0 1 2.8 0l2.7 2.7a2 2 0 0 1 0 2.8L11 19.5a2 2 0 0 1-1.4.5H8.4a2 2 0 0 1-1.4-.6l-1.4-1.4a2.2 2.2 0 0 1 0-3z" fill="#fff" stroke="#131722" stroke-width="1.4"/><path d="m9.6 9.9 5.5 5.5" stroke="#131722" stroke-width="1.4"/><path d="m5.6 13.9 4-4 5.5 5.5-4 4a2 2 0 0 1-1.5.6H8.4a2 2 0 0 1-1.4-.6l-1.4-1.4a2.2 2.2 0 0 1 0-3z" fill="#f48fb1" stroke="#131722" stroke-width="1.4"/></svg>', 6, 19, 'pointer');
        // Only the plain pointer states are replaced; grab/move/resize/text keep their meaning.
        const plain = ':not(.dragging):not([style*="cursor: grab"]):not([style*="cursor: move"]):not([style*="resize"]):not([style*="cursor: pointer"]):not([style*="cursor: text"])';
        const rule = (mode, cur) => `.sc-cur-${mode}:not(.sc-drawing-on) .sc-price-chart${plain}{cursor:${cur}!important}`;
        // Thin plus with an open centre, outlined so it reads on dark and light charts.
        const cross = url('<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"><path d="M11.5 1v7.5M11.5 14.5V22M1 11.5h7.5M14.5 11.5H22" stroke="#131722" stroke-width="3" stroke-linecap="round"/><path d="M11.5 1v7.5M11.5 14.5V22M1 11.5h7.5M14.5 11.5H22" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>', 11, 11, 'crosshair');
        const css = [rule('cross', cross), rule('dot', dot), rule('arrow', 'default'), rule('demonstration', 'default'), rule('magic', wand), `.sc-cur-eraser:not(.sc-drawing-on) .sc-price-chart:not(.dragging){cursor:${eraser}!important}`].join('\n');
        const el = document.createElement('style'); el.textContent = css; document.head.appendChild(el);
    }
    loadCursorPrefs() {
        let p = {}; try { p = JSON.parse(localStorage.getItem('sc-cursor-prefs') || '{}') || {} } catch (e) { }
        const modes = ['cross', 'dot', 'arrow', 'demonstration', 'magic'];
        return { mode: modes.includes(p.mode) ? p.mode : 'cross', valuesTooltip: !!p.valuesTooltip };
    }
    saveCursorPrefs() {
        // Eraser is a one-off tool, so a reload comes back to the last real cursor.
        const mode = this.cursorMode === 'eraser' ? (this._cursorBeforeEraser || 'cross') : this.cursorMode;
        try { localStorage.setItem('sc-cursor-prefs', JSON.stringify({ mode, valuesTooltip: this.cursorPrefs.valuesTooltip })) } catch (e) { }
    }
    isDrawingModeOn() { return !!((this._lt && this._lt.tool) || (this._zoomBox && this._zoomBox.on) || this.lineDrawingMode || this.drawingToolsMode || this.fibonacciMode || this.textMode || this.emoticonMode || this.measureMode) }
    setupCursorTools() {
        StockChart.cursorCss();
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        if (!root || !area) return;
        this.cursorPrefs = this.loadCursorPrefs();
        this.cursorMode = this.cursorPrefs.mode;
        const icons = StockChart.cursorIcons();

        // Toolbar button: first in the left strip (or the floating row without the side layout).
        const btn = document.createElement('button');
        btn.className = 'sc-overlay-button sc-cursor-button';
        btn.title = 'Cursors';
        const bar = root.querySelector('.sc-sidebar') || root.querySelector('.sc-chart-controls-overlay');
        if (bar) bar.insertBefore(btn, bar.firstChild);
        if (bar && bar.classList.contains('sc-sidebar')) btn.insertAdjacentElement('afterend', Object.assign(document.createElement('span'), { className: 'sc-bar-sep' }));
        this.cursorButton = btn;

        const items = [['cross', 'Cross'], ['dot', 'Dot'], ['arrow', 'Arrow'], ['demonstration', 'Demonstration'], ['magic', 'Magic']];
        const opt = ([k, label]) => `<button type="button" class="sc-cursor-option" data-cursor="${k}">${icons[k]}<span>${label}</span></button>`;
        const menu = document.createElement('div');
        menu.className = 'sc-cursor-menu';
        menu.innerHTML = items.map(opt).join('') + '<div class="sc-cursor-sep"></div>' + opt(['eraser', 'Eraser'])
            + '<div class="sc-cursor-sep"></div><label class="sc-cursor-toggle"><span>Values tooltip on long press</span><input type="checkbox"><i></i></label>';
        area.appendChild(menu);
        this.cursorMenu = menu;
        const tipToggle = menu.querySelector('input[type="checkbox"]');
        tipToggle.checked = this.cursorPrefs.valuesTooltip;

        this.closeCursorMenu = () => { menu.classList.remove('active'); btn.classList.remove('open') };
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = !menu.classList.contains('active');
            this.closeOtherToolbarMenus('cursor');
            if (!open) { this.closeCursorMenu(); return }
            const a = area.getBoundingClientRect(), r = btn.getBoundingClientRect();
            const inSide = btn.parentElement && btn.parentElement.classList.contains('sc-sidebar');
            menu.style.left = (inSide ? 4 : Math.max(4, r.left - a.left)) + 'px';
            menu.style.top = (inSide ? Math.max(4, r.top - a.top) : 4) + 'px';
            menu.classList.add('active'); btn.classList.add('open');
        });
        menu.addEventListener('mousedown', (e) => e.stopPropagation());
        menu.querySelectorAll('.sc-cursor-option').forEach(o => o.addEventListener('click', () => { this.setCursorMode(o.dataset.cursor); this.closeCursorMenu() }));
        tipToggle.addEventListener('change', () => { this.cursorPrefs.valuesTooltip = tipToggle.checked; this.saveCursorPrefs() });
        document.addEventListener('mousedown', (e) => { if (!menu.contains(e.target) && !btn.contains(e.target)) this.closeCursorMenu() }, true);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.closeCursorMenu() });

        // Effects layer (Demonstration ring/ripples/trail, Magic sparkles). Never takes input.
        const fx = document.createElement('canvas');
        fx.className = 'sc-cursor-fx';
        area.appendChild(fx);
        this._fx = { canvas: fx, ctx: fx.getContext('2d'), ripples: [], trail: [], sparks: [], held: false, x: null, y: null, raf: 0 };
        const sizeFx = () => { const d = window.devicePixelRatio || 1, w = area.clientWidth, h = area.clientHeight; fx.width = Math.round(w * d); fx.height = Math.round(h * d); fx.style.width = w + 'px'; fx.style.height = h + 'px'; this._fx.dpr = d };
        sizeFx();
        if ('ResizeObserver' in window) new ResizeObserver(sizeFx).observe(area);

        const local = (e) => { const r = this.priceCanvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } };
        const onChart = (p) => p.x >= this.config.padding.left && p.x <= this.getCanvasWidth() - this.config.padding.right && p.y >= this.config.padding.top && p.y <= this.config.padding.top + this.getPriceChartHeight();
        // Capture on the chart area runs before the library's own canvas handlers.
        area.addEventListener('mousedown', (e) => {
            if (e.target !== this.priceCanvas || e.button !== 0 || this.isDrawingModeOn()) return;
            const p = local(e);
            if (this.cursorMode === 'eraser') {
                if (this.eraseDrawingAt(p.x, p.y)) { e.preventDefault(); e.stopPropagation() }
                return;
            }
            if (this.cursorMode === 'demonstration' && onChart(p)) {
                // Presenting: a held button draws a fading trail instead of panning.
                this._fx.ripples.push({ x: p.x, y: p.y, t: performance.now() });
                this._fx.held = true; this._fx.trail.push({ x: p.x, y: p.y, t: performance.now(), brk: true });
                e.preventDefault(); e.stopPropagation();
                this.kickFx();
            }
        }, true);
        area.addEventListener('mousemove', (e) => {
            root.classList.toggle('sc-drawing-on', this.isDrawingModeOn());
            if (e.target !== this.priceCanvas) return;
            const p = local(e); this._fx.x = p.x; this._fx.y = p.y;
            if (this.cursorMode === 'magic' && !this.isDragging) this.spawnSparks(p.x, p.y);
            if (this.cursorMode === 'demonstration' || this.cursorMode === 'magic') this.kickFx();
        }, true);
        document.addEventListener('mousemove', (e) => { if (this._fx.held) { const p = local(e); this._fx.trail.push({ x: p.x, y: p.y, t: performance.now() }); this.kickFx() } });
        document.addEventListener('mouseup', () => { this._fx.held = false });
        area.addEventListener('mouseleave', () => { this._fx.x = this._fx.y = null; this.kickFx() });

        this.setupValuesTooltip(area);
        this.setCursorMode(this.cursorMode, true);
    }
    setCursorMode(mode, quiet) {
        if (mode === 'eraser' && this.cursorMode !== 'eraser') this._cursorBeforeEraser = this.cursorMode;
        this.cursorMode = mode;
        const root = this.chartContainer;
        root.className = root.className.replace(/\bsc-cur-[a-z]+\b/g, '').trim();
        root.classList.add('sc-cur-' + mode);
        if (this.cursorButton) this.cursorButton.innerHTML = StockChart.cursorIcons()[mode] + '<span class="sc-cursor-chev"></span>';
        if (this.cursorMenu) this.cursorMenu.querySelectorAll('.sc-cursor-option').forEach(o => o.classList.toggle('selected', o.dataset.cursor === mode));
        if (!quiet) { this.saveCursorPrefs(); this.closeOtherToolbarMenus('cursor'); this.drawCharts() }
    }
    // Deletes the topmost drawing under (x, y). Returns true when something was erased.
    eraseDrawingAt(x, y) {
        const clear = () => { this.selectedLineIndex = this.selectedTextIndex = this.selectedEmoticonIndex = this.selectedArrowIndex = this.selectedRectangleIndex = this.selectedCircleIndex = this.selectedFibonacciIndex = this.selectedShapeIndex = null; this.drawCharts(); return true };
        let i;
        const lth = this._ltHit && this._ltHit(x, y); if (lth) { this.lineTools.splice(lth.i, 1); if (this._lt) this._lt.sel = this._lt.hover = null; return clear() }
        const line = this.findClickedLine(x, y); if (line) { this.lines.splice(line.index, 1); return clear() }
        if ((i = this.findClickedText(x, y)) !== -1) { this.textAnnotations.splice(i, 1); return clear() }
        if ((i = this.findClickedEmoticon(x, y)) !== -1) { this.emoticons.splice(i, 1); return clear() }
        if ((i = this.findClickedArrow(x, y)) !== null) { this.arrows.splice(i, 1); return clear() }
        if ((i = this.findClickedRectangle(x, y)) !== null) { this.rectangles.splice(i, 1); return clear() }
        if ((i = this.findClickedCircle(x, y)) !== null) { this.circles.splice(i, 1); return clear() }
        if ((i = this.findClickedFibonacci(x, y)) !== null) { this.fibonacciRetracements.splice(i, 1); return clear() }
        const pl = this.findPriceLineAt(x, y); if (pl && pl.line && pl.line.kind === 'line') { this.removePriceLine(pl.line.id); return clear() }
        return false;
    }
    spawnSparks(x, y) {
        const now = performance.now(), hues = [48, 280, 190, 330];
        for (let n = 0; n < 2; n++) this._fx.sparks.push({ x: x + (Math.random() - .5) * 6, y: y + (Math.random() - .5) * 6, vx: (Math.random() - .5) * .9, vy: (Math.random() - .3) * .9, t: now, life: 550 + Math.random() * 450, r: 3.5 + Math.random() * 4, hue: hues[(Math.random() * hues.length) | 0] });
        if (this._fx.sparks.length > 260) this._fx.sparks.splice(0, this._fx.sparks.length - 260);
    }
    kickFx() { if (!this._fx.raf) this._fx.raf = requestAnimationFrame(() => this.drawFx()) }
    drawFx() {
        const f = this._fx, ctx = f.ctx, now = performance.now(), d = f.dpr || 1;
        f.raf = 0;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, f.canvas.width, f.canvas.height); ctx.setTransform(d, 0, 0, d, 0, 0);
        // The fx canvas covers the chart area; the price canvas starts at its top-left too.
        const TRAIL = 1100, RIPPLE = 550;
        f.trail = f.trail.filter(p => now - p.t < TRAIL);
        f.ripples = f.ripples.filter(r => now - r.t < RIPPLE);
        f.sparks = f.sparks.filter(s => now - s.t < s.life);
        if (f.trail.length > 1) {
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            for (let k = 1; k < f.trail.length; k++) {
                const a = f.trail[k - 1], b = f.trail[k];
                if (b.brk) continue;
                const alpha = Math.max(0, 1 - (now - b.t) / TRAIL);
                ctx.strokeStyle = `rgba(255,82,82,${alpha * .35})`; ctx.lineWidth = 10;
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                ctx.strokeStyle = `rgba(255,120,100,${alpha})`; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
        }
        f.ripples.forEach(r => {
            const k = (now - r.t) / RIPPLE;
            ctx.strokeStyle = `rgba(255,193,7,${1 - k})`; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(r.x, r.y, 8 + k * 26, 0, Math.PI * 2); ctx.stroke();
        });
        if (this.cursorMode === 'demonstration' && f.x !== null) {
            ctx.fillStyle = 'rgba(255,193,7,.16)'; ctx.strokeStyle = 'rgba(255,193,7,.75)'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(f.x, f.y, 19, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
        f.sparks.forEach(s => {
            const k = (now - s.t) / s.life, age = now - s.t;
            const x = s.x + s.vx * age / 16, y = s.y + s.vy * age / 16 + .00002 * age * age, r = s.r * (1 - k * .6);
            ctx.fillStyle = `hsla(${s.hue},100%,70%,${1 - k})`;
            ctx.beginPath();
            for (let j = 0; j < 8; j++) { const ang = j * Math.PI / 4 + age / 300, rr = j % 2 ? r * .38 : r; ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr) }
            ctx.closePath(); ctx.fill();
        });
        const busy = f.trail.length || f.ripples.length || f.sparks.length || f.held || (this.cursorMode === 'demonstration' && f.x !== null);
        if (busy && (f.trail.length || f.ripples.length || f.sparks.length || f.held)) this.kickFx();
    }
    // Values tooltip: with the toggle on, a touch long-press shows the crosshair and an
    // O/H/L/C/V box that follows the finger (instead of the candle menu) until it lifts.
    setupValuesTooltip(area) {
        const tip = document.createElement('div');
        tip.className = 'sc-values-tip';
        area.appendChild(tip);
        this._valuesTipEl = tip;
        const end = () => {
            if (!this._valuesTipActive) return;
            this._valuesTipActive = false; tip.classList.remove('active');
            this.lastMouseX = this.lastMouseY = null; this.mouseIsOverChart = false; this.drawCharts();
        };
        this.priceCanvas.addEventListener('touchmove', (e) => {
            if (!this._valuesTipActive || e.touches.length !== 1) return;
            e.preventDefault();
            const r = this.priceCanvas.getBoundingClientRect();
            this.moveValuesTooltip(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
        }, { passive: false });
        this.priceCanvas.addEventListener('touchend', end);
        this.priceCanvas.addEventListener('touchcancel', end);
    }
    startValuesTooltip(x, y) {
        this._valuesTipActive = true;
        if (this.isDragging) { this.isDragging = false; this.pixelOffset = 0; this.priceCanvas.classList.remove('dragging') }
        if (navigator.vibrate) try { navigator.vibrate(10) } catch (e) { }
        this.moveValuesTooltip(x, y);
    }
    moveValuesTooltip(x, y) {
        this.lastMouseX = x; this.lastMouseY = y; this.mouseIsOverChart = true;
        this.drawCharts();
        const tip = this._valuesTipEl, cW = this.calculateCandleWidth(), step = cW + this.config.spacing;
        const idx = this.config.dataOffset + Math.floor((x - this.pixelOffset - this.config.padding.left) / step);
        const c = this.stockData[idx];
        if (!c) { tip.classList.remove('active'); return }
        const vol = (v) => v >= 1e9 ? (v / 1e9).toFixed(2) + 'B' : v >= 1e6 ? (v / 1e6).toFixed(2) + 'M' : v >= 1e3 ? (v / 1e3).toFixed(2) + 'K' : String(+(+v).toFixed(2));
        const prev = this.stockData[idx - 1], chg = prev ? (c.close / prev.close - 1) * 100 : (c.close / c.open - 1) * 100;
        const fp = (v) => s8FormatChartPrice(v), cls = chg >= 0 ? 'up' : 'down';
        tip.innerHTML = `<div class="sc-values-tip__date">${c.date || ''}</div>`
            + `<div><span>O</span>${fp(c.open)}</div><div><span>H</span>${fp(c.high)}</div><div><span>L</span>${fp(c.low)}</div>`
            + `<div><span>C</span><b class="${cls}">${fp(c.close)}</b></div><div><span>Chg</span><b class="${cls}">${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%</b></div>`
            + (c.volume != null ? `<div><span>Vol</span>${vol(c.volume)}</div>` : '');
        tip.classList.add('active');
        // Sit above-left of the finger so it isn't covered; flip when there's no room.
        const w = tip.offsetWidth, h = tip.offsetHeight, W = this.getCanvasWidth();
        let left = x - w - 24; if (left < 4) left = Math.min(W - w - 4, x + 24);
        let top = y - h - 40; if (top < 4) top = Math.min(this.getCanvasHeight() - h - 4, y + 40);
        tip.style.left = left + 'px'; tip.style.top = top + 'px';
    }
    // ---- Line tools (Lines / Channels / Pitchforks) -------------------------------
    // Anchors are stored as { t: candle time ms, p: price } so drawings stay put when
    // the chart pans, zooms, changes timeframe or drops old bars. Times past either end
    // of the data are extrapolated with the bar interval. Horizontal line reuses the
    // existing price line (same as Alt+H) so there is one kind of horizontal line.
    static lineToolDefs() {
        return [
            { group: 'Lines' },
            { k: 'trendline', label: 'Trendline', n: 2, key: 'Alt + T' },
            { k: 'ray', label: 'Ray', n: 2 },
            { k: 'infoline', label: 'Info line', n: 2 },
            { k: 'extended', label: 'Extended line', n: 2 },
            { k: 'trendangle', label: 'Trend angle', n: 2 },
            { k: 'hline', label: 'Horizontal line', n: 1, key: 'Alt + H' },
            { k: 'hray', label: 'Horizontal ray', n: 1, key: 'Alt + J' },
            { k: 'vline', label: 'Vertical line', n: 1, key: 'Alt + V' },
            { k: 'crossline', label: 'Crossline', n: 1, key: 'Alt + C' },
            { group: 'Channels' },
            { k: 'parallel', label: 'Parallel channel', n: 3 },
            { k: 'regression', label: 'Regression trend', n: 2 },
            { k: 'flattop', label: 'Flat top/bottom', n: 3 },
            { k: 'disjoint', label: 'Disjoint channel', n: 3 },
            { group: 'Pitchforks' },
            { k: 'pitchfork', label: 'Pitchfork', n: 3 },
            { k: 'schiff', label: 'Schiff pitchfork', n: 3 },
            { k: 'modschiff', label: 'Modified Schiff pitchfork', n: 3 },
            { k: 'inside', label: 'Inside pitchfork', n: 3 }
        ];
    }
    static lineToolIcons() {
        const o = (x, y) => `<circle cx="${x}" cy="${y}" r="2"/>`;
        const s = (d) => `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
        const fork = (h) => s(`<path d="M${h} 13.4 22 5.5M11.6 9.5 20 1.5M17.4 16.5 26 9M12.5 10.5l3.7 4.6"/>` + o(h === 7.5 ? 6 : 9, h === 7.5 ? 21 : 18) + o(11, 9) + o(17, 17));
        return {
            trendline: s('<path d="M8.4 19.6 19.6 8.4"/>' + o(7, 21) + o(21, 7)),
            ray: s('<path d="M7.4 20.6 11.6 16.4M14.4 13.6 25 3"/>' + o(6, 22) + o(13, 15)),
            infoline: s('<path d="M7.4 18.6 15.6 10.4"/><rect x="17.5" y="16.5" width="8" height="6.5" rx="1.5"/>' + o(6, 20) + o(17, 9)),
            extended: s('<path d="M3 25 8.6 19.4M11.4 16.6 16.6 11.4M19.4 8.6 25 3"/>' + o(10, 18) + o(18, 10)),
            trendangle: s('<path d="M7.4 19.6 21 6M8 21h16M15 21a8 8 0 0 0-2.4-5.7"/>' + o(6, 21)),
            hline: s('<path d="M3 14h9M16 14h9"/>' + o(14, 14)),
            hray: s('<path d="M8 14h17"/>' + o(6, 14)),
            vline: s('<path d="M14 3v9M14 16v9"/>' + o(14, 14)),
            crossline: s('<path d="M3 14h9M16 14h9M14 3v9M14 16v9"/>' + o(14, 14)),
            parallel: s('<path d="M7.7 15 18.3 9M5 25l20-12"/>' + o(6, 16) + o(20, 8)),
            regression: s('<path d="M4 15 24 5M4 25 24 15"/><path d="M4 20 24 10" stroke-dasharray="2 2"/>' + o(5, 19.5) + o(23, 10.5)),
            flattop: s('<path d="M7.6 18.8 18.4 11.2M4 24h20"/>' + o(6, 20) + o(20, 10)),
            disjoint: s('<path d="M7 11.3 24 4M7 16.7 24 24"/>' + o(5, 12) + o(5, 16)),
            pitchfork: fork(7.5), schiff: fork(10.5), modschiff: fork(10.5),
            inside: s('<path d="M7.5 19.6 22 5.5M13 12 20 5M16 15l7-7M11.6 9.5l5.8 7"/>' + o(6, 21) + o(11, 9) + o(17, 17))
        };
    }
    setupLineTools() {
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        if (!root || !area) return;
        if (!Array.isArray(this.lineTools)) this.lineTools = [];
        this._lt = { tool: null, placing: null, sel: null, hover: null, drag: null, down: null, editing: null };
        this._ltDefs = {}; this._ltMenus = [];
        this._ltPaintButton = () => this._ltMenus.forEach(m => m.paint());
        this.closeLineMenu = () => this._ltMenus.forEach(m => m.close());
        const cursorBtn = root.querySelector('.sc-cursor-button');
        const after = cursorBtn && cursorBtn.nextElementSibling && cursorBtn.nextElementSibling.classList.contains('sc-bar-sep') ? cursorBtn.nextElementSibling : cursorBtn;
        const lineMenu = this._ltMakeMenu({ defs: StockChart.lineToolDefs(), icons: StockChart.lineToolIcons(), store: 'sc-linetool-last', title: 'Lines, channels and pitchforks', after });
        this.lineToolButton2 = lineMenu.btn;

        const local = (e) => { const r = this.priceCanvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } };
        const lt = this._lt;
        area.addEventListener('mousedown', (e) => {
            if (lt.editing && e.target === this.priceCanvas) this._ntFinishEdit();
            if (e.target !== this.priceCanvas || e.button !== 0) return;
            const p = local(e);
            if (lt.tool && this._ltDefs[lt.tool].free) {
                // Brushes: press, drag, release.
                e.preventDefault(); e.stopPropagation();
                if (!this.stockData.length) return;
                lt.placing = this._ltNew(this._ltDefs[lt.tool], [this._shRaw(p.x, p.y, this._ltView())]);
                lt.free = { x: p.x, y: p.y };
                this.drawCharts();
                return;
            }
            if (lt.tool) {
                e.preventDefault(); e.stopPropagation();
                this._ltPlace(p.x, p.y);
                lt.down = lt.placing && lt.placing.pts.length === 2 ? { x: p.x, y: p.y } : null;
                return;
            }
            if (this.isDrawingModeOn() || this.cursorMode === 'eraser' || this.cursorMode === 'demonstration') { if (lt.sel !== null) { lt.sel = null; this.drawCharts() } return }
            const hit = this._ltHit(p.x, p.y);
            if (!hit) { if (lt.sel !== null) { lt.sel = null; this.drawCharts() } return }
            e.preventDefault(); e.stopPropagation();
            lt.sel = hit.i;
            if (this.lineTools[hit.i].locked) { this.drawCharts(); return } // locked: select only
            lt.drag = { i: hit.i, h: hit.h, x: p.x, y: p.y, orig: this.lineTools[hit.i].pts.map(q => ({ ...q })) };
            root.classList.add('sc-lt-drag');
            this.drawCharts();
        }, true);
        area.addEventListener('mousemove', (e) => {
            if (e.target !== this.priceCanvas) return;
            const p = local(e);
            if (lt.placing && lt.free) {
                if (Math.hypot(p.x - lt.free.x, p.y - lt.free.y) >= 2) { lt.placing.pts.push(this._shRaw(p.x, p.y, this._ltView())); lt.free = { x: p.x, y: p.y }; this.drawCharts() }
            }
            else if (lt.placing) { const v = this._ltView(); lt.placing.pts[lt.placing.pts.length - 1] = this._ltAnchor(p.x, p.y, v); this._ltConstrain(lt.placing); }
            const hit = (!lt.tool && !lt.drag && !this.isDrawingModeOn()) ? this._ltHit(p.x, p.y) : null;
            const hov = hit ? hit.i : null;
            if (hov !== lt.hover) lt.hover = hov;
            root.classList.toggle('sc-lt-hover', !!hit);
            root.classList.toggle('sc-lt-active', !!lt.tool);
            root.classList.toggle('sc-drawing-on', this.isDrawingModeOn() || !!hit || !!lt.drag);
        }, true);
        document.addEventListener('mousemove', (e) => {
            if (!lt.drag) return;
            const p = local(e), v = this._ltView(), d = this.lineTools[lt.drag.i];
            if (!d) { lt.drag = null; return }
            if (typeof lt.drag.h === 'string') { if (/^t[\d-]p[\d-]$/.test(lt.drag.h)) this._shResize(d, lt.drag.h, p, v); else this._ntResize(d, lt.drag.h, p, v) }
            else if (lt.drag.h >= 0) { d.pts[lt.drag.h] = this._ltAnchor(p.x, p.y, v); this._ltConstrain(d, lt.drag.h) }
            else {
                // Whole bars only, so points on candles stay on candles; brush points keep their fractions.
                const di = Math.round(v.xToIdx(p.x) - v.xToIdx(lt.drag.x)), dp = v.yToP(p.y) - v.yToP(lt.drag.y);
                d.pts = lt.drag.orig.map(q => ({ t: v.idxToT(v.tToIdx(q.t) + di), p: q.p + dp }));
            }
            this.drawCharts();
        });
        document.addEventListener('mouseup', (e) => {
            if (lt.drag) { lt.drag = null; root.classList.remove('sc-lt-drag'); this.drawCharts() }
            if (lt.free) {
                lt.free = null;
                if (lt.placing && lt.placing.pts.length >= 2) this._ltCommit(lt.placing);
                else { lt.placing = null; this.drawCharts() }
                return;
            }
            // Press-drag-release draws a two-point line in one gesture.
            if (lt.placing && lt.down) {
                const p = local(e);
                if (Math.hypot(p.x - lt.down.x, p.y - lt.down.y) > 8) this._ltPlace(p.x, p.y);
            }
            lt.down = null;
        });
        window.addEventListener('keydown', (e) => this._ltKey(e), true);
        this._ltPaintButton();
    }
    // Split button + flyout menu for a set of tools (lines, text...). The icon starts the
    // menu's last-used tool; the right-edge chevron opens the menu.
    _ltMakeMenu(cfg) {
        const root = this.chartContainer, area = root.querySelector('.sc-price-chart-container');
        const { defs, icons } = cfg;
        let last = defs.find(d => d.k).k;
        try { const v = localStorage.getItem(cfg.store); if (v && defs.some(d => d.k === v)) last = v } catch (e) { }
        const m = { last, store: cfg.store, defs };
        defs.forEach(d => { if (d.k) { this._ltDefs[d.k] = d; d.menu = m } });
        const btn = document.createElement('button');
        btn.className = 'sc-overlay-button sc-lt-button';
        btn.title = cfg.title;
        const bar = root.querySelector('.sc-sidebar') || root.querySelector('.sc-chart-controls-overlay');
        if (cfg.after) cfg.after.insertAdjacentElement('afterend', btn); else if (bar) bar.insertBefore(btn, bar.firstChild);
        const menu = document.createElement('div');
        menu.className = 'sc-cursor-menu sc-lt-menu';
        menu.innerHTML = defs.map(d => d.group
            ? `<div class="sc-lt-group">${d.group}</div>`
            : `<button type="button" class="sc-cursor-option" data-lt="${d.k}">${icons[d.k]}<span>${d.label}</span>${d.key ? `<kbd>${d.key}</kbd>` : ''}</button>`).join('');
        area.appendChild(menu);
        Object.assign(m, { btn, menu });
        m.close = () => { menu.classList.remove('active'); btn.classList.remove('open') };
        m.paint = () => {
            btn.innerHTML = icons[m.last] + '<span class="sc-cursor-chev"></span>';
            btn.classList.toggle('active', !!(this._lt.tool && this._ltDefs[this._lt.tool].menu === m));
            menu.querySelectorAll('[data-lt]').forEach(o => o.classList.toggle('selected', o.dataset.lt === m.last));
        };
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const r = btn.getBoundingClientRect();
            if (e.clientX >= r.right - 11 || menu.classList.contains('active')) {
                const open = !menu.classList.contains('active');
                this.closeOtherToolbarMenus('linetools');
                this.closeLineMenu();
                if (!open) return;
                const a = area.getBoundingClientRect();
                menu.style.left = '4px';
                menu.classList.add('active'); btn.classList.add('open');
                menu.style.top = Math.max(4, Math.min(r.top - a.top, area.clientHeight - menu.offsetHeight - 4)) + 'px';
                return;
            }
            const mine = this._lt.tool && this._ltDefs[this._lt.tool].menu === m;
            if (mine) this.deactivateLineTool(); else this.activateLineTool(m.last);
        });
        menu.addEventListener('mousedown', (e) => e.stopPropagation());
        menu.querySelectorAll('[data-lt]').forEach(o => o.addEventListener('click', () => { this.activateLineTool(o.dataset.lt); this.closeLineMenu() }));
        document.addEventListener('mousedown', (e) => { if (!menu.contains(e.target) && !btn.contains(e.target)) m.close() }, true);
        this._ltMenus.push(m);
        m.paint();
        return m;
    }
    activateLineTool(k) {
        if (!this._ltDefs[k]) return;
        this.closeOtherToolbarMenus('linetools');
        const lt = this._lt;
        this._ntFinishEdit && this._ntFinishEdit();
        if (this._zoomBox) this._zoomBox.set(false);
        lt.tool = k; lt.placing = null; lt.sel = null;
        const m = this._ltDefs[k].menu; m.last = k;
        try { localStorage.setItem(m.store, k) } catch (e) { }
        this.chartContainer.classList.add('sc-lt-active', 'sc-drawing-on');
        this._ltPaintButton();
        this.drawCharts();
    }
    deactivateLineTool() {
        const lt = this._lt; if (!lt) return;
        lt.tool = null; lt.placing = null; lt.down = null; lt.free = null;
        this.chartContainer.classList.remove('sc-lt-active');
        this._ltPaintButton();
        this.drawCharts();
    }
    _ltPlace(x, y) {
        const lt = this._lt, def = this._ltDefs[lt.tool], v = this._ltView();
        if (!def || !this.stockData.length) return;
        const a = this._ltAnchor(x, y, v);
        if (def.multi && lt.placing) {
            // Path / polyline: click to add points; click the last point again (or
            // double-click, Enter) to finish; polyline also closes on its first point.
            const pts = lt.placing.pts, near = (q) => { const s = v.xy(q); return Math.hypot(s.x - x, s.y - y) < 6 };
            if (near(pts[pts.length - 2])) { pts.pop(); if (pts.length >= 2) this._ltCommit(lt.placing); else this.deactivateLineTool(); this.drawCharts(); return }
            if (def.k === 'polyline' && pts.length >= 4 && near(pts[0])) { pts.pop(); lt.placing.closed = true; this._ltCommit(lt.placing); this.drawCharts(); return }
            pts[pts.length - 1] = a; pts.push({ ...a });
            this.drawCharts();
            return;
        }
        if (!lt.placing) {
            if (def.n === 1) { this._ltCommit(this._ltNew(def, [a])); return }
            lt.placing = this._ltNew(def, [a, { ...a }]);
        } else {
            lt.placing.pts[lt.placing.pts.length - 1] = a;
            this._ltConstrain(lt.placing);
            if (lt.placing.pts.length >= def.n) this._ltCommit(lt.placing);
            else lt.placing.pts.push({ ...a });
        }
        this.drawCharts();
    }
    _ltCommit(d) {
        const lt = this._lt;
        lt.placing = null; lt.down = null; lt.free = null;
        if (this._shFinish) this._shFinish(d);
        if (this._fcFinish) this._fcFinish(d);
        if (d.type === 'hline') this.handleDrawHorizontalLineAtPrice(d.pts[0].p);
        else { d.id = Date.now() + Math.random(); this.lineTools.push(d); lt.sel = this.lineTools.length - 1 }
        this.deactivateLineTool();
        if (this._ntAfterCommit) this._ntAfterCommit(d);
    }
    _ltNew(def, pts) {
        const d = { type: def.k, pts };
        if (def.style) d.style = { ...def.style };
        if (def.color) d.color = def.color;
        if (def.k === 'table') d.cells = [['', '', ''], ['', '', ''], ['', '', '']];
        return d;
    }
    // Some tools pin a point's time to another so the shape keeps its form.
    _ltConstrain(d) {
        if (d.pts.length < 3) return;
        if (d.type === 'flattop') d.pts[2].t = d.pts[1].t;
        if (d.type === 'disjoint') d.pts[2].t = d.pts[0].t;
    }
    _ltKey(e) {
        const lt = this._lt, t = e.target;
        if (!lt || !this.container.isConnected) return;
        if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
        const active = StockChart._lastActiveChart;
        if (active && active !== this && active.container && active.container.isConnected) return;
        const key = (e.key || '').toLowerCase();
        if ((key === 'enter' || key === 'escape') && lt.placing && this._ltDefs[lt.placing.type].multi && lt.placing.pts.length >= 3) {
            lt.placing.pts.pop(); this._ltCommit(lt.placing); this.drawCharts();
            e.preventDefault(); e.stopPropagation(); return;
        }
        if (key === 'escape') {
            if (lt.placing || lt.tool) this.deactivateLineTool();
            else if (lt.sel !== null) { lt.sel = null; this.drawCharts() }
            return;
        }
        if ((key === 'delete' || key === 'backspace') && lt.sel !== null && !e.altKey && !e.ctrlKey && !e.metaKey) {
            this.lineTools.splice(lt.sel, 1); lt.sel = lt.hover = null; this.drawCharts();
            e.preventDefault(); e.stopPropagation(); return;
        }
        if (!e.altKey || e.ctrlKey || e.metaKey || !this.mouseIsOverChart || this.lastMouseX === null) return;
        if (key === 'r' && e.shiftKey && this._ltDefs.rectangle) { this.activateLineTool('rectangle'); e.preventDefault(); e.stopPropagation(); return }
        if (key === 't') { this.activateLineTool('trendline'); e.preventDefault(); e.stopPropagation(); return }
        const one = { j: 'hray', v: 'vline', c: 'crossline' }[key];
        if (one) {
            const v = this._ltView();
            this.closeOtherToolbarMenus('linetools');
            this.lineTools.push({ type: one, id: Date.now() + Math.random(), pts: [this._ltAnchor(this.lastMouseX, this.lastMouseY, v)] });
            lt.sel = this.lineTools.length - 1;
            this.drawCharts();
            e.preventDefault(); e.stopPropagation();
        }
    }
    // Screen <-> data mapping for the current view. Candle i's centre is at idxToX(i).
    _ltView() {
        const cW = this.calculateCandleWidth(), step = cW + this.config.spacing, L = this.config.padding.left;
        const R = this.getCanvasWidth() - this.config.padding.right, top = this.config.padding.top, H = this.getPriceChartHeight(), bottom = top + H;
        const raw = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
        let { min, max } = this.applyVerticalScale(raw); min += this.config.priceOffset; max += this.config.priceOffset;
        const d = this.stockData, n = d.length;
        let bar = 60000;
        if (n > 1) { const diffs = []; for (let i = Math.max(1, n - 30); i < n; i++) diffs.push(d[i].t - d[i - 1].t); diffs.sort((a, b) => a - b); bar = diffs[diffs.length >> 1] || bar }
        const off = this.config.dataOffset, px = this.pixelOffset || 0;
        const v = { cW, step, L, R, top, H, bottom, min, max, n };
        v.idxToX = (i) => L + px + (i - off) * step + cW / 2;
        v.xToIdx = (x) => (x - L - px - cW / 2) / step + off;
        v.pToY = (p) => bottom - (p - min) / (max - min) * H;
        v.yToP = (y) => min + (bottom - y) / H * (max - min);
        v.tToIdx = (t) => {
            if (!n) return 0;
            if (t <= d[0].t) return (t - d[0].t) / bar;
            if (t >= d[n - 1].t) return n - 1 + (t - d[n - 1].t) / bar;
            let lo = 0, hi = n - 1;
            while (hi - lo > 1) { const m = (lo + hi) >> 1; if (d[m].t <= t) lo = m; else hi = m }
            return lo + (t - d[lo].t) / ((d[hi].t - d[lo].t) || 1);
        };
        v.idxToT = (i) => {
            if (!n) return 0;
            if (i <= 0) return d[0].t + i * bar;
            if (i >= n - 1) return d[n - 1].t + (i - (n - 1)) * bar;
            const lo = Math.floor(i); return d[lo].t + (i - lo) * (d[lo + 1].t - d[lo].t);
        };
        v.xy = (a) => ({ x: v.idxToX(v.tToIdx(a.t)), y: v.pToY(a.p) });
        return v;
    }
    _ltAnchor(x, y, v) {
        const i = Math.round(v.xToIdx(x)), snap = this._magnetSnapIdx ? this._magnetSnapIdx(i, y, v) : null;
        return { t: v.idxToT(i), p: snap ? snap.p : v.yToP(y) };
    }
    // Builds what to draw for one drawing: segments, fills, handles, labels, axis tags.
    _ltShape(d, v, state) {
        if (this._ntTypes && this._ntTypes.has(d.type)) return this._ntShape(d, v, state || {});
        if (this._shTypes && this._shTypes.has(d.type)) return this._shShape(d, v, state || {});
        if (this._fbTypes && this._fbTypes.has(d.type)) return this._fbShape(d, v, state || {});
        if (this._cpTypes && this._cpTypes.has(d.type)) return this._cpShape(d, v, state || {});
        if (this._fcTypes && this._fcTypes.has(d.type)) return this._fcShape(d, v, state || {});
        const P = d.pts.map(v.xy), A = d.pts, g = { segs: [], fills: [], handles: [], labels: [], arcs: [], tags: [] };
        const far = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy); if (len < 1e-6) return { x: b.x, y: b.y }; const k = 6000 / len; return { x: b.x + dx * k, y: b.y + dy * k } };
        const seg = (a, b, o) => g.segs.push(Object.assign({ a, b }, o || {}));
        const fill = (pts, c) => g.fills.push({ pts, c: d.fill || c || 'rgba(41,98,255,0.12)' });
        const handles = () => P.forEach((p, i) => g.handles.push({ x: p.x, y: p.y, a: i }));
        const idx = A.map(a => v.tToIdx(a.t));
        const at = (i, p) => ({ x: v.idxToX(i), y: v.pToY(p) });
        const [a, b, c] = P;
        switch (d.type) {
            case 'trendline': seg(a, b); break;
            case 'ray': seg(a, far(a, b)); break;
            case 'extended': seg(far(b, a), far(a, b)); break;
            case 'infoline': {
                seg(a, b);
                const dp = A[1].p - A[0].p, pct = A[0].p ? dp / A[0].p * 100 : 0, bars = Math.round(idx[1] - idx[0]);
                const ms = Math.abs(A[1].t - A[0].t), m = Math.round(ms / 60000), span = m >= 1440 ? `${Math.floor(m / 1440)}d ${Math.floor(m % 1440 / 60)}h` : m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
                const deg = Math.atan2(-(b.y - a.y), b.x - a.x) * 180 / Math.PI;
                g.labels.push({ x: b.x + 12, y: b.y + 12, lines: [`${dp >= 0 ? '+' : ''}${s8FormatChartPrice(dp)} (${dp >= 0 ? '+' : ''}${pct.toFixed(2)}%)`, `${bars} bars, ${span}`, `${deg.toFixed(1)}°`] });
                break;
            }
            case 'trendangle': {
                seg(a, b);
                const len = Math.max(40, Math.abs(b.x - a.x));
                seg(a, { x: a.x + len, y: a.y }, { dash: [4, 4], w: 1 });
                const ang = Math.atan2(b.y - a.y, b.x - a.x), r = Math.min(36, Math.max(18, Math.hypot(b.x - a.x, b.y - a.y) / 3));
                g.arcs.push({ x: a.x, y: a.y, r, s: 0, e: ang, ccw: ang < 0 });
                const deg = -ang * 180 / Math.PI;
                g.labels.push({ x: a.x + r + 8, y: a.y + (ang < 0 ? -22 : 4), lines: [`${deg.toFixed(1)}°`], plain: true });
                break;
            }
            case 'hray': seg(a, { x: v.R + 10, y: a.y }); g.tags.push({ p: A[0].p }); break;
            case 'vline': seg({ x: a.x, y: v.top - 10 }, { x: a.x, y: v.bottom + 10 }); g.tags.push({ t: A[0].t }); break;
            case 'crossline': seg({ x: v.L - 10, y: a.y }, { x: v.R + 10, y: a.y }); seg({ x: a.x, y: v.top - 10 }, { x: a.x, y: v.bottom + 10 }); g.tags.push({ p: A[0].p }, { t: A[0].t }); break;
            case 'parallel': {
                if (!c) { seg(a, b); break }
                const slope = idx[1] !== idx[0] ? (A[1].p - A[0].p) / (idx[1] - idx[0]) : 0;
                const off = A[2].p - (A[0].p + slope * (idx[2] - idx[0]));
                const a2 = at(idx[0], A[0].p + off), b2 = at(idx[1], A[1].p + off), am = at(idx[0], A[0].p + off / 2), bm = at(idx[1], A[1].p + off / 2);
                fill([a, b, b2, a2]); seg(a, b); seg(a2, b2); seg(am, bm, { dash: [5, 4], w: 1 });
                break;
            }
            case 'flattop': {
                if (!c) { seg(a, b); break }
                const fa = at(idx[0], A[2].p), fb = at(idx[1], A[2].p);
                fill([a, b, fb, fa]); seg(a, b); seg(fa, fb);
                break;
            }
            case 'disjoint': {
                if (!c) { seg(a, b); break }
                const da = at(idx[0], A[2].p), db = at(idx[1], A[2].p - (A[1].p - A[0].p));
                fill([a, b, db, da]); seg(a, b); seg(da, db);
                break;
            }
            case 'regression': {
                const lo = Math.max(0, Math.round(Math.min(idx[0], idx[1]))), hi = Math.min(v.n - 1, Math.round(Math.max(idx[0], idx[1])));
                if (hi - lo < 1) { seg(a, b); handles(); return g }
                let sx = 0, sy = 0, sxx = 0, sxy = 0; const m = hi - lo + 1;
                for (let i = lo; i <= hi; i++) { const y = this.stockData[i].close; sx += i; sy += y; sxx += i * i; sxy += i * y }
                const slope = (m * sxy - sx * sy) / ((m * sxx - sx * sx) || 1), icp = (sy - slope * sx) / m;
                let ss = 0; for (let i = lo; i <= hi; i++) { const r = this.stockData[i].close - (icp + slope * i); ss += r * r }
                const sd = Math.sqrt(ss / m) * 2, fit = (i) => icp + slope * i;
                const c0 = at(idx[0], fit(idx[0])), c1 = at(idx[1], fit(idx[1]));
                const u0 = at(idx[0], fit(idx[0]) + sd), u1 = at(idx[1], fit(idx[1]) + sd), l0 = at(idx[0], fit(idx[0]) - sd), l1 = at(idx[1], fit(idx[1]) - sd);
                fill([u0, u1, l1, l0]); seg(u0, u1); seg(l0, l1); seg(c0, c1, { c: '#f23645', dash: [5, 4] });
                g.handles.push({ x: c0.x, y: c0.y, a: 0 }, { x: c1.x, y: c1.y, a: 1 });
                return g;
            }
            case 'pitchfork': case 'schiff': case 'modschiff': case 'inside': {
                if (!c) { seg(a, b); break }
                const mi = (idx[1] + idx[2]) / 2, mp = (A[1].p + A[2].p) / 2, m = at(mi, mp);
                let o = a;
                if (d.type === 'schiff') o = at(idx[0], (A[0].p + A[1].p) / 2);
                if (d.type === 'modschiff') o = at((idx[0] + idx[1]) / 2, (A[0].p + A[1].p) / 2);
                if (o !== a) seg(a, o, { dash: [4, 4], w: 1 });
                const dx = m.x - o.x, dy = m.y - o.y, len = Math.hypot(dx, dy) || 1, k = 6000 / len;
                const ext = (p) => ({ x: p.x + dx * k, y: p.y + dy * k });
                // Inside: the tines start halfway between each outer point and the median.
                const t1 = d.type === 'inside' ? { x: (b.x + m.x) / 2, y: (b.y + m.y) / 2 } : b;
                const t2 = d.type === 'inside' ? { x: (c.x + m.x) / 2, y: (c.y + m.y) / 2 } : c;
                fill([t1, ext(t1), ext(m), m], 'rgba(41,98,255,0.10)'); fill([m, ext(m), ext(t2), t2], 'rgba(255,152,0,0.10)');
                seg(o, ext(m), { c: '#f23645' }); seg(t1, ext(t1)); seg(t2, ext(t2)); seg(b, c);
                break;
            }
        }
        handles();
        return g;
    }
    _ltHit(x, y) {
        if (!this._ltCache || !this.lineTools || !this.lineTools.length) return null;
        const v = { top: this.config.padding.top, bottom: this.config.padding.top + this.getPriceChartHeight() };
        if (y < v.top - 8 || y > v.bottom + 8) return null;
        const inPoly = (pts) => { let inside = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const a = pts[i], b = pts[j]; if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / ((b.y - a.y) || 1e-9) + a.x) inside = !inside } return inside };
        for (let i = this.lineTools.length - 1; i >= 0; i--) {
            const g = this._ltCache.get(this.lineTools[i]); if (!g) continue;
            for (const h of g.handles) if (Math.hypot(x - h.x, y - h.y) <= 7) return { i, h: h.a };
            for (const s of g.segs) if (this.distanceToLine(x, y, s.a.x, s.a.y, s.b.x, s.b.y) <= 6) return { i, h: -1 };
            if (g.polys) for (const q of g.polys) {
                const tol = Math.max(6, (q.w || 2) / 2 + 2), n = q.pts.length;
                if (n === 1 && Math.hypot(x - q.pts[0].x, y - q.pts[0].y) <= tol) return { i, h: -1 };
                for (let k = 1; k < n + (q.closed ? 1 : 0); k++) { const s = q.pts[k - 1], t = q.pts[k % n]; if (this.distanceToLine(x, y, s.x, s.y, t.x, t.y) <= tol) return { i, h: -1 } }
            }
            for (const f of g.fills) if (inPoly(f.pts)) return { i, h: -1 };
            if (g.hit) for (const r of g.hit) if (r.pts ? inPoly(r.pts) : (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h)) return { i, h: -1 };
        }
        return null;
    }
    drawLineTools(ctx) {
        const lt = this._lt; if (!lt || !Array.isArray(this.lineTools)) return;
        this._ltCache = new Map();
        if (this._syncChartLogo) this._syncChartLogo();
        const list = this.lineTools.map((d, i) => ({ d, i }));
        if (lt.placing) list.push({ d: lt.placing, i: -1 });
        if (!list.length || !this.stockData.length) { if (this._ntSyncUi) this._ntSyncUi(); return }
        const v = this._ltView(), dark = !!this.config.darkMode, tags = [];
        ctx.save();
        ctx.beginPath(); ctx.rect(v.L, v.top, v.R - v.L, v.H); ctx.clip();
        list.forEach(({ d, i }) => {
            const sel = i === -1 || i === lt.sel, hov = i === lt.hover;
            const g = this._ltShape(d, v, { sel, hov }); if (!g) return;
            if (i >= 0) this._ltCache.set(d, g);
            // Strokes with no width of their own are the drawing's main lines: they take its width and line style.
            const color = d.color || '#2962ff', dw = d.w || 2, dd = d.dash === 'dashed' ? [7, 5] : d.dash === 'dotted' ? [2, 3] : [];
            if (!d.noFill) g.fills.forEach(f => { ctx.fillStyle = f.c; ctx.beginPath(); f.pts.forEach((p, j) => j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath(); ctx.fill() });
            g.segs.forEach(s => { ctx.strokeStyle = s.c || color; ctx.lineWidth = (s.w || dw) + (hov && !sel ? 0.6 : 0); ctx.setLineDash(s.dash || (s.w ? [] : dd)); ctx.beginPath(); ctx.moveTo(s.a.x, s.a.y); ctx.lineTo(s.b.x, s.b.y); ctx.stroke() });
            ctx.setLineDash([]);
            // Polylines draw as one path so joins are smooth and see-through strokes don't double up.
            if (g.polys) g.polys.forEach(q => {
                ctx.save(); ctx.globalAlpha = q.a == null ? 1 : q.a; ctx.strokeStyle = q.c || color;
                ctx.lineWidth = (q.w || dw) + (hov && !sel && q.a == null ? 0.6 : 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                ctx.setLineDash(q.dash || (q.w ? [] : dd));
                ctx.beginPath(); q.pts.forEach((p, j) => j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
                if (q.pts.length === 1) ctx.lineTo(q.pts[0].x + 0.01, q.pts[0].y);
                if (q.closed) ctx.closePath(); ctx.stroke(); ctx.restore();
            });
            g.arcs.forEach(r => { ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, r.s, r.e, r.ccw); ctx.stroke() });
            if (g.draws) g.draws.forEach(fn => { ctx.save(); fn(ctx); ctx.restore() });
            if (g.frame && sel && i >= 0) { ctx.strokeStyle = '#2962ff'; ctx.lineWidth = 1; ctx.strokeRect(g.frame.x - 0.5, g.frame.y - 0.5, g.frame.w + 1, g.frame.h + 1) }
            g.labels.forEach(lb => this._ltLabel(ctx, lb, color, dark, v));
            if ((sel || hov) && !d.locked) g.handles.forEach(h => { ctx.beginPath(); ctx.arc(h.x, h.y, 5, 0, Math.PI * 2); ctx.fillStyle = dark ? '#131722' : '#fff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.stroke() });
            g.tags.forEach(t => tags.push(Object.assign({ color }, t)));
        });
        const hint = this._magnetHint;
        if (hint && (lt.placing || (lt.drag && lt.drag.h >= 0))) {
            ctx.strokeStyle = '#2962ff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(hint.x, hint.y, 7, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.restore();
        tags.forEach(t => this._ltTag(ctx, t, v));
        if (this._ntSyncUi) this._ntSyncUi();
    }
    _ltLabel(ctx, lb, color, dark, v) {
        ctx.save();
        ctx.font = '12px "Open Sans", Arial, sans-serif'; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
        const pad = 6, lh = 16, w = Math.max(...lb.lines.map(s => ctx.measureText(s).width)) + pad * 2, h = lb.lines.length * lh + pad * 2 - 2;
        const x = Math.max(v.L + 2, Math.min(lb.x, v.R - w - 2)), y = Math.max(v.top + 2, Math.min(lb.y, v.bottom - h - 2));
        if (!lb.plain) {
            ctx.fillStyle = dark ? 'rgba(30,34,45,0.94)' : 'rgba(255,255,255,0.96)'; ctx.strokeStyle = color; ctx.lineWidth = 1;
            this._crosshairLabelPath(ctx, x, y, w, h, 4); ctx.fill(); ctx.stroke();
        }
        ctx.fillStyle = dark ? '#d1d4dc' : '#131722';
        lb.lines.forEach((s, k) => ctx.fillText(s, x + pad, y + pad + k * lh));
        ctx.restore();
    }
    _ltTag(ctx, t, v) {
        ctx.save();
        ctx.font = '12px Arial'; ctx.textBaseline = 'middle';
        const pad = 5, h = 20;
        ctx.fillStyle = t.color;
        if (t.p !== undefined) {
            const y = v.pToY(t.p); if (y < v.top || y > v.bottom) { ctx.restore(); return }
            const text = s8FormatChartPrice(t.p), w = ctx.measureText(text).width + pad * 2;
            this._crosshairLabelPath(ctx, v.R, y - h / 2, w, h, 3); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(text, v.R + pad, y);
        } else {
            const x = v.idxToX(v.tToIdx(t.t)); if (x < v.L || x > v.R) { ctx.restore(); return }
            const text = this.formatDetailTimestamp(t.t, this.timeframe), w = ctx.measureText(text).width + pad * 2;
            this._crosshairLabelPath(ctx, x - w / 2, v.bottom + 4, w, h, 3); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(text, x, v.bottom + 4 + h / 2);
        }
        ctx.restore();
    }
    // ---- Fibonacci / Gann ------------------------------------------------------------
    // Same engine as the line tools. Level sets and colours follow TradingView's
    // defaults. Retracement runs 1 at the first click to 0 at the second.
    static fibToolDefs() {
        return [
            { group: 'Fibonacci' },
            { k: 'fibret', label: 'Fib retracement', n: 2, key: 'Alt + F' },
            { k: 'fibext', label: 'Trend-based fib extension', n: 3 },
            { k: 'fibchannel', label: 'Fib channel', n: 3 },
            { k: 'fibtz', label: 'Fib time zone', n: 2 },
            { k: 'fibfan', label: 'Fib speed resistance fan', n: 2 },
            { k: 'fibtime', label: 'Trend-based fib time', n: 3 },
            { k: 'fibcircles', label: 'Fib circles', n: 2 },
            { k: 'fibspiral', label: 'Fib spiral', n: 2 },
            { k: 'fibarcs', label: 'Fib speed resistance arcs', n: 2 },
            { k: 'fibwedge', label: 'Fib wedge', n: 3 },
            { k: 'pitchfan', label: 'Pitchfan', n: 3 },
            { group: 'Gann' },
            { k: 'gannbox', label: 'Gann box', n: 2 },
            { k: 'gannsqfixed', label: 'Gann square fixed', n: 2 },
            { k: 'gannsquare', label: 'Gann square', n: 2 },
            { k: 'gannfan', label: 'Gann fan', n: 2 }
        ];
    }
    static fibToolIcons() {
        const s = (d) => `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
        const o = (x, y) => `<circle cx="${x}" cy="${y}" r="2"/>`;
        const box = '<rect x="4.5" y="4.5" width="19" height="19"/>';
        return {
            fibret: s('<path d="M3 6.5h15M3 11.5h22M3 16.5h22M9 21.5h16"/>' + o(5.5, 21.5) + o(20.5, 6.5)),
            fibext: s('<path d="M6.6 11.4 11.4 6.6M3 16h22M3 20h22M3 24h22"/>' + o(5, 13) + o(13, 5)),
            fibchannel: s('<path d="M7.7 11 19.3 5M4 18 24 8M4 24l20-10"/>' + o(6, 12) + o(21, 4)),
            fibtz: s('<path d="M5 3v8M5 15v10M10 3v22M16 3v22M24 3v22"/>' + o(5, 13)),
            fibfan: s('<path d="M6.4 21.6 24 4M7 23h17M5 21V4M7 22l17-9M6 21.5 15 4"/>' + o(5, 23)),
            fibtime: s('<path d="M5 11.5 7 20M9.5 20.5 12.5 6.5M16 3v22M20 3v22M24.5 3v22"/>' + o(4.5, 9.5) + o(8.5, 22.5) + o(13, 4.5)),
            fibcircles: s('<circle cx="14" cy="14" r="10.5"/><circle cx="14" cy="14" r="7"/><circle cx="14" cy="14" r="3.5"/>'),
            fibspiral: s('<path d="M14.5 15.5a1.6 1.6 0 0 1-1.8-1.8 3 3 0 0 1 3.4-2.6 4.6 4.6 0 0 1 3.7 5.2 7 7 0 0 1-8 5.5 9.5 9.5 0 0 1-7.4-9.5"/>' + o(14.5, 15.5)),
            fibarcs: s('<path d="M3 11a11 11 0 0 0 22 0M7 11a7 7 0 0 0 14 0M11 11a3 3 0 0 0 6 0"/>' + o(14, 11)),
            fibwedge: s('<path d="M5 21V4M7 23h17M5 13a10 10 0 0 1 10 10M5 8a15 15 0 0 1 15 15"/>' + o(5, 23)),
            pitchfan: s('<path d="M6.4 21.6 22 6M7 22.2l17-9M6 21.4 16 4M7.2 22.8 24 19"/>' + o(5, 23)),
            gannbox: s(box + '<path d="M9.5 4.5v19M14 4.5v19M18.5 4.5v19M4.5 9.5h19M4.5 14h19M4.5 18.5h19"/>'),
            gannsqfixed: s(box + '<path d="M4.5 23.5l19-19M4.5 4.5l19 19M4.5 23.5 23.5 14M4.5 23.5 14 4.5"/>' + o(4.5, 23.5)),
            gannsquare: s(box + '<path d="M4.5 23.5l19-19M4.5 4.5l19 19M4.5 14a9.5 9.5 0 0 1 9.5 9.5"/>'),
            gannfan: s('<path d="M6.4 21.6 24 4M6 21.5 13 4M7 22.2 24 15M6.2 21.2 18 4M7.2 22.8 24 10"/>' + o(5, 23))
        };
    }
    setupFibTools() {
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        if (!area || !this._lt) return;
        const defs = StockChart.fibToolDefs();
        this._fbTypes = new Set(defs.filter(d => d.k).map(d => d.k));
        // The new menu takes the old Fibonacci button's place.
        const old = this.fibonacciToolButton;
        const m = this._ltMakeMenu({ defs, icons: StockChart.fibToolIcons(), store: 'sc-fibtool-last', title: 'Fibonacci and Gann', after: old || null });
        if (old) old.style.display = 'none';
        this.fibToolButton = m.btn;
    }
    static fibColor(r) {
        return ({ 0: '#787b86', 0.236: '#f23645', 0.382: '#ff9800', 0.5: '#4caf50', 0.618: '#089981', 0.786: '#00bcd4', 1: '#787b86', 1.618: '#2962ff', 2.618: '#f23645', 3.618: '#9c27b0', 4.236: '#e91e63' })[r] || '#787b86';
    }
    _fbShape(d, v, state) {
        const g = { segs: [], fills: [], handles: [], labels: [], arcs: [], tags: [], draws: [], polys: [], hit: [] };
        const P = d.pts.map(v.xy), A = d.pts, [a, b, c] = P, idx = A.map(q => v.tToIdx(q.t));
        const pt = (x, y) => ({ x, y }), at = (i, p) => pt(v.idxToX(i), v.pToY(p));
        const col = StockChart.fibColor, tint = (cl, al) => this._shTint(cl, al);
        const LV = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618, 2.618, 3.618, 4.236];
        const CYCLE = ['#787b86', '#f23645', '#ff9800', '#4caf50', '#089981', '#00bcd4', '#2962ff', '#9c27b0', '#e91e63'];
        const gray = '#787b86', dash = [4, 4];
        const seg = (p, q, cl, o) => g.segs.push(Object.assign({ a: p, b: q, c: cl, w: 1 }, o || {}));
        const trend = (...pts) => { for (let i = 1; i < pts.length; i++) seg(pts[i - 1], pts[i], gray, { dash }) };
        const text = (x, y, s, cl, al) => g.draws.push(ctx => { ctx.font = '11px "Open Sans", Arial, sans-serif'; ctx.fillStyle = cl; ctx.textAlign = al || 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y) });
        const far = (o, q) => { const dx = q.x - o.x, dy = q.y - o.y, L = Math.hypot(dx, dy); if (L < 1e-6) return q; const k = 6000 / L; return pt(q.x + dx * k, q.y + dy * k) };
        const ray = (o, q, cl) => seg(o, far(o, q), cl);
        const handles = () => P.forEach((q, i) => g.handles.push({ x: q.x, y: q.y, a: i }));
        const done = () => { handles(); return g };
        const line = () => { if (b) trend(a, b); return done() };
        const ringPts = (cx, cy, rx, ry, s0, s1, n) => { const out = []; for (let k = 0; k <= n; k++) { const t = s0 + (s1 - s0) * k / n; out.push(pt(cx + rx * Math.cos(t), cy + ry * Math.sin(t))) } return out };
        const fmt = (r) => String(r);
        // Horizontal price levels between x0 and x1 with bands and left-hand labels.
        const levels = (x0, x1, priceAt) => {
            const L = Math.min(x0, x1), R = Math.max(x0, x1), left = L - 6 > v.L + 110;
            LV.forEach((r, i) => {
                const p = priceAt(r), y = v.pToY(p), cl = col(r);
                if (i) { const yp = v.pToY(priceAt(LV[i - 1])); g.fills.push({ pts: [pt(L, yp), pt(R, yp), pt(R, y), pt(L, y)], c: tint(cl, 0.1) }) }
                seg(pt(L, y), pt(R, y), cl);
                text(left ? L - 6 : R + 6, y, `${fmt(r)} (${s8FormatChartPrice(p)})`, cl, left ? 'right' : 'left');
            });
        };
        // Vertical time lines at bar positions, labelled along the bottom.
        const vlines = (list) => list.forEach(([i, lab, cl]) => { const x = v.idxToX(i); seg(pt(x, v.top - 10), pt(x, v.bottom + 10), cl); text(x + 4, v.bottom - 10, lab, cl) });
        switch (d.type) {
            case 'fibret':
                if (!b) return line();
                levels(a.x, b.x, (r) => A[1].p + (A[0].p - A[1].p) * r);
                trend(a, b); return done();
            case 'fibext': {
                if (!c) return line();
                const span = Math.max(40, Math.abs(b.x - a.x));
                levels(c.x, c.x + span, (r) => A[2].p + (A[1].p - A[0].p) * r);
                trend(a, b, c); return done();
            }
            case 'fibchannel': {
                if (!c) return line();
                const slope = idx[1] !== idx[0] ? (A[1].p - A[0].p) / (idx[1] - idx[0]) : 0;
                const off = A[2].p - (A[0].p + slope * (idx[2] - idx[0]));
                let prev = null;
                LV.forEach(r => {
                    const p0 = at(idx[0], A[0].p + off * r), p1 = at(idx[1], A[1].p + off * r), cl = col(r);
                    if (prev) g.fills.push({ pts: [prev[0], prev[1], p1, p0], c: tint(cl, 0.1) });
                    seg(p0, p1, cl); text(Math.min(p0.x, p1.x) - 6, p0.x < p1.x ? p0.y : p1.y, fmt(r), cl, 'right');
                    prev = [p0, p1];
                });
                return done();
            }
            case 'fibtz': {
                if (!b) return line();
                const step = idx[1] - idx[0];
                if (Math.abs(step) < 0.5) return line();
                vlines([0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144].map((n, k) => [idx[0] + step * n, String(n), CYCLE[k % CYCLE.length]]));
                trend(a, b); return done();
            }
            case 'fibtime': {
                if (!c) return line();
                const step = idx[1] - idx[0];
                vlines([0, 0.382, 0.5, 0.618, 1, 1.382, 1.618, 2, 2.382, 2.618, 3, 3.618, 4.236].map((r, k) => [idx[2] + step * r, fmt(r), CYCLE[k % CYCLE.length]]));
                trend(a, b, c); return done();
            }
            case 'fibfan': {
                if (!b) return line();
                const FL = [0, 0.25, 0.382, 0.5, 0.618, 0.75, 1], fc = (k) => CYCLE[k % CYCLE.length];
                let prevP = null;
                FL.forEach((r, k) => {
                    const pp = pt(b.x, a.y + (b.y - a.y) * r), tp = pt(a.x + (b.x - a.x) * r, b.y);
                    if (prevP) g.fills.push({ pts: [a, far(a, prevP), far(a, pp)], c: tint(fc(k), 0.07) });
                    ray(a, pp, fc(k)); if (r < 1) ray(a, tp, fc(k));
                    seg(pt(a.x, pp.y), pt(b.x, pp.y), tint(gray, 0.5)); seg(pt(tp.x, a.y), pt(tp.x, b.y), tint(gray, 0.5));
                    text(b.x + 4, pp.y, fmt(r), fc(k)); text(tp.x, b.y + (b.y > a.y ? 10 : -10), fmt(r), fc(k), 'center');
                    prevP = pp;
                });
                return done();
            }
            case 'fibcircles': {
                if (!b) return line();
                const R = Math.hypot(b.x - a.x, b.y - a.y), CL = [0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618, 2.618, 3.618, 4.236];
                let prev = null;
                CL.forEach(r => {
                    const ring = ringPts(a.x, a.y, R * r, R * r, 0, Math.PI * 2, 96), cl = col(r);
                    g.fills.push({ pts: prev ? ring.concat(prev.slice().reverse()) : ring, c: tint(cl, 0.08) });
                    g.polys.push({ pts: ring, closed: true, w: 1, c: cl });
                    text(a.x + R * r + 3, a.y - 6, fmt(r), cl);
                    prev = ring;
                });
                trend(a, b); return done();
            }
            case 'fibspiral': {
                // Golden spiral around a, passing through b, widening by phi every quarter turn.
                if (!b) return line();
                const R = Math.hypot(b.x - a.x, b.y - a.y), t0 = Math.atan2(b.y - a.y, b.x - a.x), phi = 1.618033988749895, pts = [];
                if (R < 2) return line();
                for (let k = 0; k <= 480; k++) { const t = -10 * Math.PI + k * (12.5 * Math.PI / 480), r = R * Math.pow(phi, t / (Math.PI / 2)); pts.push(pt(a.x + r * Math.cos(t0 - t), a.y + r * Math.sin(t0 - t))) }
                g.polys.push({ pts, w: 1.5, c: '#f23645' });
                seg(a, b, gray, { dash }); return done();
            }
            case 'fibarcs': {
                // Arcs round the second point, on the side the move came from.
                if (!b) return line();
                const R = Math.hypot(b.x - a.x, b.y - a.y), down = a.y > b.y, AL = [0.236, 0.382, 0.5, 0.618, 0.786, 1];
                let prev = null;
                AL.forEach(r => {
                    const arc = ringPts(b.x, b.y, R * r, R * r, down ? 0 : Math.PI, down ? Math.PI : Math.PI * 2, 64), cl = col(r);
                    g.fills.push({ pts: prev ? arc.concat(prev.slice().reverse()) : arc, c: tint(cl, 0.08) });
                    g.polys.push({ pts: arc, w: 1, c: cl });
                    text(b.x + R * r + 3, b.y + (down ? 8 : -8), fmt(r), cl);
                    prev = arc;
                });
                trend(a, b); return done();
            }
            case 'fibwedge': {
                if (!c) return line();
                const R = Math.hypot(b.x - a.x, b.y - a.y), s0 = Math.atan2(b.y - a.y, b.x - a.x);
                let s1 = Math.atan2(c.y - a.y, c.x - a.x), dd = s1 - s0;
                while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI; s1 = s0 + dd;
                const WL = [0.236, 0.382, 0.5, 0.618, 0.786, 1];
                let prev = null;
                WL.forEach(r => {
                    const arc = ringPts(a.x, a.y, R * r, R * r, s0, s1, 48), cl = col(r);
                    g.fills.push({ pts: prev ? arc.concat(prev.slice().reverse()) : [a].concat(arc), c: tint(cl, 0.1) });
                    g.polys.push({ pts: arc, w: 1, c: cl });
                    const e = arc[arc.length - 1]; text(e.x + 4, e.y, fmt(r), cl);
                    prev = arc;
                });
                seg(a, b, gray); seg(a, pt(a.x + R * Math.cos(s1), a.y + R * Math.sin(s1)), gray);
                return done();
            }
            case 'pitchfan': {
                // Rays from the pivot through levels on the b-c span, median in red.
                if (!c) return line();
                const m = pt((b.x + c.x) / 2, (b.y + c.y) / 2), PL = [-1, -0.618, -0.5, -0.382, 0, 0.382, 0.5, 0.618, 1];
                let prev = null;
                PL.forEach(r => {
                    const q = pt(m.x + (c.x - m.x) * r, m.y + (c.y - m.y) * r), cl = r === 0 ? '#f23645' : col(Math.abs(r));
                    if (prev) g.fills.push({ pts: [a, far(a, prev), far(a, q)], c: tint(cl, 0.07) });
                    ray(a, q, cl); prev = q;
                });
                seg(b, c, gray, { dash }); return done();
            }
            case 'gannbox': {
                if (!b) return line();
                const GL = [0, 0.25, 0.382, 0.5, 0.618, 0.75, 1], x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y);
                GL.forEach((r, k) => {
                    const cl = CYCLE[k % CYCLE.length], x = a.x + (b.x - a.x) * r, y = a.y + (b.y - a.y) * r;
                    if (k) { const xp = a.x + (b.x - a.x) * GL[k - 1], yp = a.y + (b.y - a.y) * GL[k - 1]; g.fills.push({ pts: [pt(x0, yp), pt(x1, yp), pt(x1, y), pt(x0, y)], c: tint(cl, 0.06) }); g.fills.push({ pts: [pt(xp, y0), pt(x, y0), pt(x, y1), pt(xp, y1)], c: tint(cl, 0.06) }) }
                    seg(pt(x, y0), pt(x, y1), cl); seg(pt(x0, y), pt(x1, y), cl);
                    text(x, y0 - 8, fmt(r), cl, 'center'); text(x0 - 4, y, fmt(r), cl, 'right');
                });
                return done();
            }
            case 'gannsquare': case 'gannsqfixed': {
                if (!b) return line();
                // Fixed keeps the box square on screen; the second point only sets size and direction.
                const e = d.type === 'gannsqfixed' ? pt(b.x, a.y + Math.sign(b.y - a.y || -1) * Math.abs(b.x - a.x)) : b;
                const dx = e.x - a.x, dy = e.y - a.y, Q = [0.25, 0.5, 0.75];
                g.fills.push({ pts: [a, pt(e.x, a.y), e, pt(a.x, e.y)], c: tint('#2962ff', 0.05) });
                [0, 1].forEach(t => { seg(pt(a.x + dx * t, a.y), pt(a.x + dx * t, e.y), gray); seg(pt(a.x, a.y + dy * t), pt(e.x, a.y + dy * t), gray) });
                Q.forEach(t => { seg(pt(a.x + dx * t, a.y), pt(a.x + dx * t, e.y), tint(gray, 0.45)); seg(pt(a.x, a.y + dy * t), pt(e.x, a.y + dy * t), tint(gray, 0.45)) });
                seg(a, e, '#2962ff'); seg(pt(e.x, a.y), pt(a.x, e.y), '#2962ff');
                Q.forEach((t, k) => { seg(a, pt(e.x, a.y + dy * t), CYCLE[k + 1]); seg(a, pt(a.x + dx * t, e.y), CYCLE[k + 1]) });
                // Quarter arcs from the first corner, spanning the box's quadrant.
                const s0 = dx >= 0 ? 0 : Math.PI;
                const sweep = ((dx >= 0) === (dy >= 0) ? 1 : -1) * Math.PI / 2;
                [0.25, 0.5, 0.75, 1].forEach((t, k) => g.polys.push({ pts: ringPts(a.x, a.y, Math.abs(dx) * t, Math.abs(dy) * t, s0, s0 + sweep, 32), w: 1, c: CYCLE[(k + 4) % CYCLE.length] }));
                g.handles.push({ x: a.x, y: a.y, a: 0 }, { x: e.x, y: e.y, a: 1 });
                return g;
            }
            case 'gannfan': {
                if (!b) return line();
                const dx = b.x - a.x, dy = b.y - a.y, R = [[1, 8], [1, 4], [1, 3], [1, 2], [1, 1], [2, 1], [3, 1], [4, 1], [8, 1]];
                let prev = null;
                R.forEach(([t, p], k) => {
                    const mx = Math.max(t, p), q = pt(a.x + dx * t / mx, a.y + dy * p / mx), cl = CYCLE[k % CYCLE.length];
                    if (prev) g.fills.push({ pts: [a, far(a, prev), far(a, q)], c: tint(cl, 0.07) });
                    // Labels sit at the same distance along every ray, so the steep ones don't stack up.
                    const L = Math.hypot(dx, dy) * 1.1, ql = Math.hypot(q.x - a.x, q.y - a.y) || 1;
                    ray(a, q, cl); text(a.x + (q.x - a.x) / ql * L + 4, a.y + (q.y - a.y) / ql * L, `${t}/${p}`, cl);
                    prev = q;
                });
                return done();
            }
        }
        return line();
    }
    // ---- Chart patterns / Elliott waves / Cycles ------------------------------------
    // Same engine as the line tools: click each point in turn. Harmonic patterns show
    // their leg ratios; Elliott waves label each point above a peak or below a trough;
    // cycles repeat across the whole chart.
    static patternToolDefs() {
        return [
            { group: 'Chart patterns' },
            { k: 'xabcd', label: 'XABCD pattern', n: 5 },
            { k: 'cypher', label: 'Cypher pattern', n: 5 },
            { k: 'headshoulders', label: 'Head and shoulders', n: 7 },
            { k: 'abcd', label: 'ABCD pattern', n: 4 },
            { k: 'trianglepat', label: 'Triangle pattern', n: 4 },
            { k: 'threedrives', label: 'Three drives pattern', n: 7 },
            { group: 'Elliott waves' },
            { k: 'ewimpulse', label: 'Elliott impulse wave (1·2·3·4·5)', n: 6, marks: ['0', '1', '2', '3', '4', '5'] },
            { k: 'ewcorrection', label: 'Elliott correction wave (A·B·C)', n: 4, marks: ['0', 'A', 'B', 'C'] },
            { k: 'ewtriangle', label: 'Elliott triangle wave (A·B·C·D·E)', n: 6, marks: ['0', 'A', 'B', 'C', 'D', 'E'] },
            { k: 'ewdouble', label: 'Elliott double combo wave (W·X·Y)', n: 4, marks: ['0', 'W', 'X', 'Y'] },
            { k: 'ewtriple', label: 'Elliott triple combo wave (W·X·Y·X·Z)', n: 6, marks: ['0', 'W', 'X', 'Y', 'X', 'Z'] },
            { group: 'Cycles' },
            { k: 'cycliclines', label: 'Cyclic lines', n: 2 },
            { k: 'timecycles', label: 'Time cycles', n: 2 },
            { k: 'sineline', label: 'Sine line', n: 2 }
        ];
    }
    static patternToolIcons() {
        const s = (d) => `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
        const link = (pts, closed, r) => {
            r = r || 1.8; let d = '';
            const n = pts.length, m = closed ? n : n - 1;
            for (let i = 0; i < m; i++) {
                const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n], L = Math.hypot(x2 - x1, y2 - y1), k = (r + 0.6) / L, ux = (x2 - x1) * k, uy = (y2 - y1) * k;
                d += `M${(x1 + ux).toFixed(1)} ${(y1 + uy).toFixed(1)}L${(x2 - ux).toFixed(1)} ${(y2 - uy).toFixed(1)}`;
            }
            return `<path d="${d}"/>` + pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}"/>`).join('');
        };
        const t = (x, y, c) => `<text x="${x}" y="${y}" font-size="6.5" font-family="Arial" fill="currentColor" stroke="none" text-anchor="middle">${c}</text>`;
        const wave = (pts, a, b) => s(link(pts, false, 1.5) + t(pts[1][0], pts[1][1] - 3.5, a) + t(pts[pts.length - 1][0], pts[pts.length - 1][1] - 3.5, b));
        return {
            xabcd: s(link([[5, 22], [8, 6], [14, 15], [20, 7], [23, 22]])),
            cypher: s(link([[4, 18], [9, 5], [12, 13], [21, 4], [17, 23]])),
            headshoulders: s(link([[3, 22], [7, 12], [10, 17], [14, 5], [18, 17], [21, 12], [25, 22]], false, 1.5)),
            abcd: s(link([[5, 21], [10, 6], [17, 14], [23, 4]])),
            trianglepat: s(link([[4, 5], [23, 13], [6, 22], [17, 15]])),
            threedrives: s(link([[3, 23], [6, 15], [10, 19], [14, 10], [18, 14], [22, 4], [25, 9]], false, 1.5)),
            ewimpulse: wave([[3, 23], [7, 16], [11, 20], [16, 11], [20, 15], [25, 8]], '1', '5'),
            ewcorrection: wave([[4, 22], [9, 12], [15, 18], [22, 9]], 'A', 'C'),
            ewtriangle: wave([[3, 23], [7, 13], [11, 20], [16, 15], [20, 19], [25, 14]], 'A', 'E'),
            ewdouble: wave([[4, 22], [9, 12], [15, 18], [22, 9]], 'W', 'Y'),
            ewtriple: wave([[3, 23], [7, 13], [11, 20], [16, 15], [20, 19], [25, 10]], 'W', 'Z'),
            cycliclines: s('<path d="M5 3v8M5 15v10M11 3v22M17 3v22M23 3v8M23 15v10"/><circle cx="5" cy="13" r="2"/><circle cx="23" cy="13" r="2"/>'),
            timecycles: s('<path d="M4.5 16a4.5 4.5 0 0 1 9 0M14.5 16a4.5 4.5 0 0 1 9 0"/><circle cx="4.5" cy="18" r="1.8"/><circle cx="14" cy="18" r="1.8"/><circle cx="23.5" cy="18" r="1.8"/>'),
            sineline: s('<path d="M4.5 17C7 7 10 7 13 14s6 7 9 0"/><circle cx="4" cy="19" r="1.8"/><circle cx="23.5" cy="11" r="1.8"/>')
        };
    }
    setupPatternTools() {
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        if (!area || !this._lt) return;
        const defs = StockChart.patternToolDefs();
        this._cpTypes = new Set(defs.filter(d => d.k).map(d => d.k));
        const m = this._ltMakeMenu({ defs, icons: StockChart.patternToolIcons(), store: 'sc-patterntool-last', title: 'Patterns, Elliott waves and cycles', after: this.fibToolButton || null });
        this.patternToolButton = m.btn;
    }
    _cpShape(d, v, state) {
        const g = { segs: [], fills: [], handles: [], labels: [], arcs: [], tags: [], draws: [], polys: [], hit: [] };
        const P = d.pts.map(v.xy), A = d.pts, n = P.length, idx = A.map(q => v.tToIdx(q.t));
        const color = d.color || '#2962ff', tint = d.fill || this._shTint(color, 0.15), dark = !!this.config.darkMode, gray = '#787b86';
        const pt = (x, y) => ({ x, y });
        const seg = (p, q, o) => g.segs.push(Object.assign({ a: p, b: q }, o || {}));
        const dashed = (p, q) => seg(p, q, { dash: [4, 4], w: 1 });
        const zig = () => { if (n > 1) g.polys.push({ pts: P }) };
        // Text with a halo in the chart's background colour so it reads over candles.
        const text = (x, y, s, o) => g.draws.push(ctx => {
            o = o || {};
            ctx.font = `${o.bold === false ? '' : 'bold '}${o.size || 12}px "Open Sans", Arial, sans-serif`; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
            ctx.lineWidth = 3; ctx.strokeStyle = dark ? '#000' : '#fff'; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y);
            ctx.fillStyle = o.c || color; ctx.fillText(s, x, y);
        });
        // A point's label goes above it if it's a peak, below if it's a trough.
        const isHigh = (i) => i > 0 ? A[i].p >= A[i - 1].p : (n > 1 ? A[0].p >= A[1].p : true);
        const mark = (i, s) => text(P[i].x, P[i].y + (isHigh(i) ? -14 : 14), s);
        const leg = (i, j) => Math.abs(A[j].p - A[i].p);
        const ratio = (p, q, num, den) => { dashed(p, q); if (den > 0) text((p.x + q.x) / 2, (p.y + q.y) / 2, (num / den).toFixed(3), { size: 11, bold: false, c: gray }) };
        const handles = () => P.forEach((q, i) => g.handles.push({ x: q.x, y: q.y, a: i }));
        const done = () => { handles(); return g };
        const mid = v.idxToX, L = v.L, R = v.R;
        switch (d.type) {
            case 'xabcd': case 'cypher': {
                const N = ['X', 'A', 'B', 'C', 'D'];
                if (n >= 3) g.fills.push({ pts: [P[0], P[1], P[2]], c: tint });
                if (n >= 5) g.fills.push({ pts: [P[2], P[3], P[4]], c: tint });
                zig();
                if (n >= 3) ratio(P[0], P[2], leg(1, 2), leg(0, 1));
                if (d.type === 'xabcd') {
                    if (n >= 4) ratio(P[1], P[3], leg(2, 3), leg(1, 2));
                    if (n >= 5) { ratio(P[2], P[4], leg(3, 4), leg(2, 3)); ratio(P[0], P[4], leg(1, 4), leg(0, 1)) }
                } else {
                    if (n >= 4) ratio(P[0], P[3], leg(0, 3), leg(0, 1));
                    if (n >= 5) ratio(P[0], P[4], leg(3, 4), leg(0, 3));
                }
                P.forEach((q, i) => mark(i, N[i]));
                return done();
            }
            case 'abcd': {
                zig();
                if (n >= 3) ratio(P[0], P[2], leg(1, 2), leg(0, 1));
                if (n >= 4) ratio(P[1], P[3], leg(2, 3), leg(1, 2));
                P.forEach((q, i) => mark(i, 'ABCD'[i]));
                return done();
            }
            case 'headshoulders': {
                if (n >= 7) g.fills.push({ pts: P, c: tint });
                zig();
                if (n >= 5) {
                    // Neckline through the two troughs, run out to the pattern's ends.
                    const a = P[2], b = P[4], k = (b.y - a.y) / ((b.x - a.x) || 1e-9);
                    const x0 = P[0].x, x1 = P[n - 1].x;
                    seg(pt(x0, a.y + k * (x0 - a.x)), pt(Math.max(x1, b.x), a.y + k * (Math.max(x1, b.x) - a.x)), { w: 1 });
                }
                [[1, 'Left Shoulder'], [3, 'Head'], [5, 'Right Shoulder']].forEach(([i, s]) => { if (i < n) mark(i, s) });
                return done();
            }
            case 'trianglepat': {
                zig();
                if (n >= 4) {
                    // Sides A-C and B-D run on to where they meet; if they don't converge ahead they stop at C and D.
                    const [a, b, c, e] = P, d1x = c.x - a.x, d1y = c.y - a.y, d2x = e.x - b.x, d2y = e.y - b.y;
                    const den = d1x * d2y - d1y * d2x, right = Math.max(c.x, e.x);
                    let apex = null;
                    if (Math.abs(den) > 1e-9) { const t = ((b.x - a.x) * d2y - (b.y - a.y) * d2x) / den; const q = pt(a.x + d1x * t, a.y + d1y * t); if (q.x > right && q.x - right < 4000) apex = q }
                    if (apex) { seg(a, apex, { w: 1 }); seg(b, apex, { w: 1 }); g.fills.push({ pts: [a, apex, b], c: tint }) }
                    else { seg(a, c, { w: 1 }); seg(b, e, { w: 1 }) }
                }
                P.forEach((q, i) => mark(i, 'ABCD'[i]));
                return done();
            }
            case 'threedrives': {
                zig();
                if (n >= 4) ratio(P[1], P[3], leg(2, 3), leg(1, 2));
                if (n >= 6) ratio(P[3], P[5], leg(4, 5), leg(3, 4));
                [[1, 'Drive 1'], [3, 'Drive 2'], [5, 'Drive 3']].forEach(([i, s]) => { if (i < n) mark(i, s) });
                return done();
            }
            case 'ewimpulse': case 'ewcorrection': case 'ewtriangle': case 'ewdouble': case 'ewtriple': {
                zig();
                const marks = this._ltDefs[d.type].marks;
                P.forEach((q, i) => { if (i) mark(i, `(${marks[i]})`) });
                return done();
            }
            case 'cycliclines': case 'timecycles': case 'sineline': {
                if (n < 2) return done();
                const step = idx[1] - idx[0];
                if (Math.abs(step) < 0.5) { dashed(P[0], P[1]); return done() }
                // Repeat across the visible bars only (capped so a tiny period can't hang the draw).
                const iL = v.xToIdx(L), iR = v.xToIdx(R), per = Math.abs(step) * (d.type === 'sineline' ? 2 : 1);
                if ((iR - iL) / per > 600) { dashed(P[0], P[1]); return done() }
                const k0 = Math.floor((iL - idx[0]) / Math.abs(step)) - 1, k1 = Math.ceil((iR - idx[0]) / Math.abs(step)) + 1;
                const sx = (k) => mid(idx[0] + Math.abs(step) * k);
                if (d.type === 'cycliclines') {
                    for (let k = k0; k <= k1; k++) seg(pt(sx(k), v.top - 10), pt(sx(k), v.bottom + 10), { w: 1, c: k === 0 || k === Math.sign(step) ? color : this._shTint(color, 0.6) });
                } else if (d.type === 'timecycles') {
                    // Half-ellipses on the first point's level, as tall as the second point says.
                    const ry = Math.max(4, Math.abs(P[1].y - P[0].y)), up = P[1].y <= P[0].y, y0 = P[0].y;
                    for (let k = k0; k < k1; k++) {
                        const xa = sx(k), xb = sx(k + 1), cx = (xa + xb) / 2, rx = Math.abs(xb - xa) / 2, arc = [];
                        for (let j = 0; j <= 32; j++) { const t = Math.PI * j / 32; arc.push(pt(cx - rx * Math.cos(t), y0 + (up ? -1 : 1) * ry * Math.sin(t))) }
                        g.fills.push({ pts: arc, c: this._shTint(color, 0.08) }); g.polys.push({ pts: arc });
                    }
                } else {
                    // First point = a crest/trough, second = the opposite one; repeats both ways.
                    const ym = (P[0].y + P[1].y) / 2, amp = P[0].y - ym, pts = [];
                    for (let x = L; x <= R; x += 2) pts.push(pt(x, ym + amp * Math.cos(Math.PI * (v.xToIdx(x) - idx[0]) / step)));
                    g.polys.push({ pts });
                }
                return done();
            }
        }
        zig(); return done();
    }
    // ---- Forecasting / Volume-based / Measurers --------------------------------------
    // Same engine as the line tools. Long/short positions and the position forecast
    // check themselves against the real bars after the entry. Volume tools read the
    // bars' volume; measurers report change, %, bars, time span and volume.
    static forecastToolDefs() {
        return [
            { group: 'Forecasting' },
            { k: 'longpos', label: 'Long position', n: 1 },
            { k: 'shortpos', label: 'Short position', n: 1 },
            { k: 'forecast', label: 'Position forecast', n: 2 },
            { k: 'barspattern', label: 'Bars pattern', n: 2 },
            { k: 'ghostfeed', label: 'Ghost feed', n: 99, multi: true },
            { k: 'sector', label: 'Sector', n: 3 },
            { group: 'Volume-based' },
            { k: 'avwap', label: 'Anchored VWAP', n: 1 },
            { k: 'frvp', label: 'Fixed range volume profile', n: 2 },
            { k: 'avp', label: 'Anchored volume profile', n: 1 },
            { group: 'Measurers' },
            { k: 'pricerange', label: 'Price range', n: 2 },
            { k: 'daterange', label: 'Date range', n: 2 },
            { k: 'dpRange', label: 'Date and price range', n: 2 }
        ];
    }
    static forecastToolIcons() {
        const s = (d) => `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
        const o = (x, y) => `<circle cx="${x}" cy="${y}" r="2"/>`;
        const t = (x, y, c) => `<text x="${x}" y="${y}" font-size="7" font-family="Arial" fill="currentColor" stroke="none" text-anchor="middle">${c}</text>`;
        const candle = (x, y1, y2, b1, b2) => `<path d="M${x} ${y1}V${b1}M${x} ${b2}V${y2}"/><rect x="${x - 1.6}" y="${b1}" width="3.2" height="${b2 - b1}"/>`;
        return {
            longpos: s('<path d="M7 6.5h17M7 14h17M7 21.5h17"/>' + o(4.5, 14) + t(16, 12, 'L')),
            shortpos: s('<path d="M7 6.5h17M7 14h17M7 21.5h17"/>' + o(4.5, 14) + t(16, 19.5, 'S')),
            forecast: s(candle(7, 5, 23, 9, 18) + candle(13, 4, 22, 8, 15) + '<path d="M20 6v3M20 12v3M20 18v4M18 20l2 2 2-2"/>'),
            barspattern: s(candle(6, 6, 22, 10, 18) + candle(11, 4, 20, 7, 14) + candle(17, 8, 24, 12, 20) + candle(22, 5, 21, 9, 16)),
            ghostfeed: s('<path d="M3 22l4-3" stroke-dasharray="1.5 2"/>' + candle(10, 12, 23, 15, 20) + candle(15, 8, 20, 11, 16) + candle(20, 4, 16, 7, 12) + o(25, 4)),
            sector: s('<path d="M7 21.5V6M8.6 22.6h15M7 9.5a13 13 0 0 1 13 13"/>' + o(7, 4) + o(7, 23) + o(24, 23)),
            avwap: s(candle(9, 4, 24, 9, 18) + candle(17, 6, 22, 10, 16) + '<path d="M4 19c4-1 7-6 11-7s6 2 9 1"/>'),
            frvp: s('<path d="M6 4v20M6 7h7M6 11h11M6 15h5M6 19h8M22 9v15"/>' + o(22, 6)),
            avp: s('<path d="M15 4v20M15 7h7M15 11h9M15 15h5M15 19h8M5 14h8"/>' + o(4, 14)),
            pricerange: s('<path d="M6 6h12M6 22h12M12 8.5v13M9.5 11 12 8.5 14.5 11"/>' + o(4, 6) + o(20.5, 22)),
            daterange: s('<path d="M6 5v18M22 5v18M8.5 14h13M19 11.5l2.5 2.5-2.5 2.5"/>' + o(6, 3) + o(22, 25)),
            dpRange: s('<rect x="6" y="6" width="16" height="16"/><path d="M14 9v10M11.5 11.5 14 9l2.5 2.5M9 14h10M16.5 11.5 19 14l-2.5 2.5"/>' + o(6, 6) + o(22, 22))
        };
    }
    setupForecastTools() {
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        if (!area || !this._lt) return;
        const defs = StockChart.forecastToolDefs();
        this._fcTypes = new Set(defs.filter(d => d.k).map(d => d.k));
        const m = this._ltMakeMenu({ defs, icons: StockChart.forecastToolIcons(), store: 'sc-forecasttool-last', title: 'Forecasting, volume and measurers', after: this.patternToolButton || this.fibToolButton || null });
        this.forecastToolButton = m.btn;
    }
    // Fill in what a one-click tool needs once it's placed.
    _fcFinish(d) {
        if (!this._fcTypes || !this._fcTypes.has(d.type)) return;
        const v = this._ltView(), i0 = v.tToIdx(d.pts[0].t), n = this.stockData.length;
        if (d.type === 'longpos' || d.type === 'shortpos') {
            // Default stop = 8% of the visible price range; target at 1.5R; 20 bars wide.
            const r = (v.max - v.min) * 0.08, e = d.pts[0].p, k = d.type === 'longpos' ? 1 : -1, t1 = v.idxToT(i0 + 20);
            d.pts.push({ t: t1, p: e + k * r * 1.5 }, { t: t1, p: e - k * r });
        }
        if (d.type === 'barspattern' && d.pts.length >= 2) {
            // Copy the bars between the two clicks and paste the copy right after them.
            let a = Math.round(i0), b = Math.round(v.tToIdx(d.pts[1].t)); if (a > b) [a, b] = [b, a];
            a = Math.max(0, a); b = Math.min(n - 1, b);
            if (b < a) return;
            d.bars = this.stockData.slice(a, b + 1).map(c => [c.open, c.high, c.low, c.close]);
            d.base = d.bars[0][0];
            d.pts = [{ t: v.idxToT(b + 1), p: d.bars[d.bars.length - 1][3] }];
        }
    }
    static fmtVol(x) {
        const a = Math.abs(x);
        return a >= 1e9 ? (x / 1e9).toFixed(2) + 'B' : a >= 1e6 ? (x / 1e6).toFixed(2) + 'M' : a >= 1e3 ? (x / 1e3).toFixed(2) + 'K' : (Math.round(x * 100) / 100).toString();
    }
    static fmtSpan(ms) {
        const m = Math.round(Math.abs(ms) / 60000);
        return m >= 1440 ? `${Math.floor(m / 1440)}d ${Math.floor(m % 1440 / 60)}h` : m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
    }
    _fcShape(d, v, state) {
        const g = { segs: [], fills: [], handles: [], labels: [], arcs: [], tags: [], draws: [], polys: [], hit: [] };
        const P = d.pts.map(v.xy), A = d.pts, n = P.length, data = this.stockData, N = data.length;
        const idx = A.map(q => v.tToIdx(q.t)), color = d.color || '#2962ff', dark = !!this.config.darkMode;
        const GREEN = '#089981', RED = '#f23645', tint = (c, a) => this._shTint(c, a);
        const pt = (x, y) => ({ x, y }), [a, b, c] = P;
        const seg = (p, q, o) => g.segs.push(Object.assign({ a: p, b: q }, o || {}));
        const fp = (p) => s8FormatChartPrice(p), pct = (x, base) => base ? (x / base * 100).toFixed(2) + '%' : '0%';
        const sgn = (x) => x >= 0 ? '+' : '';
        const handles = (list) => (list || P.map((q, i) => [q, i])).forEach(([q, k]) => g.handles.push({ x: q.x, y: q.y, a: k }));
        const done = () => { handles(); return g };
        const line = () => { if (n > 1) g.polys.push({ pts: [a, b] }); return done() };
        // Filled, rounded label box centred on x; lines of white text.
        const tag = (x, y, lines, bg, below) => g.draws.push(ctx => {
            ctx.font = '12px "Open Sans", Arial, sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
            const lh = 16, w = Math.max(...lines.map(s => ctx.measureText(s).width)) + 16, h = lines.length * lh + 8;
            const bx = Math.max(v.L + 2, Math.min(x - w / 2, v.R - w - 2)), by = below ? y : y - h;
            ctx.fillStyle = bg; this._ntRound(ctx, bx, by, w, h, 4); ctx.fill();
            ctx.fillStyle = '#fff'; lines.forEach((s, k) => ctx.fillText(s, bx + w / 2, by + 4 + lh * (k + 0.5)));
        });
        const head = (from, to, cl) => {
            const dx = to.x - from.x, dy = to.y - from.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, s = 9;
            g.fills.push({ pts: [to, pt(to.x - ux * s - uy * s * 0.5, to.y - uy * s + ux * s * 0.5), pt(to.x - ux * s + uy * s * 0.5, to.y - uy * s - ux * s * 0.5)], c: cl || color });
        };
        const bar = (i) => data[Math.max(0, Math.min(N - 1, Math.round(i)))];
        switch (d.type) {
            case 'longpos': case 'shortpos': {
                if (n < 3) return done();
                const long = d.type === 'longpos', e = A[0].p, tp = A[1].p, sl = A[2].p;
                const x0 = a.x, x1 = v.idxToX(idx[1]), ye = a.y, yt = v.pToY(tp), ys = v.pToY(sl);
                g.fills.push({ pts: [pt(x0, ye), pt(x1, ye), pt(x1, yt), pt(x0, yt)], c: tint(GREEN, 0.2) });
                g.fills.push({ pts: [pt(x0, ye), pt(x1, ye), pt(x1, ys), pt(x0, ys)], c: tint(RED, 0.2) });
                seg(pt(x0, ye), pt(x1, ye), { c: '#787b86', w: 1 });
                // Walk the real bars after entry until the target or stop is touched.
                let exitI = null, exitP = null, hit = null;
                const last = Math.min(N - 1, Math.floor(idx[1]));
                for (let i = Math.floor(idx[0]) + 1; i <= last; i++) {
                    const k = data[i]; if (!k) continue;
                    const stopHit = long ? k.low <= sl : k.high >= sl, tgtHit = long ? k.high >= tp : k.low <= tp;
                    if (stopHit) { hit = 'stop'; exitI = i; exitP = sl; break } // same-bar tie counts as the stop
                    if (tgtHit) { hit = 'target'; exitI = i; exitP = tp; break }
                }
                if (exitI === null && last > idx[0]) { exitI = last; exitP = data[last].close }
                if (exitI !== null) {
                    const xe = v.idxToX(exitI), ype = v.pToY(exitP), up = long ? exitP >= e : exitP <= e;
                    g.fills.push({ pts: [pt(x0, ye), pt(xe, ye), pt(xe, ype), pt(x0, ype)], c: tint(up ? GREEN : RED, 0.25) });
                    seg(pt(x0, ye), pt(xe, ype), { c: '#787b86', w: 1, dash: [4, 4] });
                }
                const risk = Math.abs(e - sl), reward = Math.abs(tp - e), rr = risk ? (reward / risk).toFixed(2) : '-';
                const pl = exitP === null ? 0 : (long ? exitP - e : e - exitP);
                const status = hit === 'target' ? 'Closed (target)' : hit === 'stop' ? 'Closed (stop)' : 'Open';
                const cx = (x0 + x1) / 2;
                tag(cx, Math.min(yt, ys) - 4, [`${long ? 'Target' : 'Stop'}: ${fp(long ? tp : sl)} (${pct(Math.abs((long ? tp : sl) - e), e)})`], long ? GREEN : RED);
                tag(cx, Math.max(yt, ys) + 4, [`${long ? 'Stop' : 'Target'}: ${fp(long ? sl : tp)} (${pct(Math.abs((long ? sl : tp) - e), e)})`], long ? RED : GREEN, true);
                tag(cx, ye - 4, [`${status} P&L: ${sgn(pl)}${fp(pl)} (${sgn(pl)}${pct(pl, e)})`, `Risk/reward ratio: ${rr}`], pl >= 0 ? GREEN : RED);
                handles([[a, 0], [pt(x0, yt), 't-p1'], [pt(x0, ys), 't-p2'], [pt(x1, ye), 't1p-']]);
                return g;
            }
            case 'forecast': {
                if (!b) return done();
                seg(a, b, { w: 1.5 }); head(a, b);
                const dp = A[1].p - A[0].p, up = dp >= 0, bars = Math.round(idx[1] - idx[0]);
                // Reached the target price between the two times?
                let ok = false; const lastI = Math.min(N - 1, Math.floor(idx[1]));
                for (let i = Math.floor(idx[0]) + 1; i <= lastI; i++) { const k = data[i]; if (k && (up ? k.high >= A[1].p : k.low <= A[1].p)) { ok = true; break } }
                const over = N - 1 >= idx[1], st = ok ? 'Success' : over ? 'Failure' : 'In progress';
                tag(b.x, up ? b.y - 8 : b.y + 8, [`${sgn(dp)}${fp(dp)} (${sgn(dp)}${pct(dp, A[0].p)})`, `${bars} bars, ${StockChart.fmtSpan(A[1].t - A[0].t)}`, st], ok ? GREEN : over ? RED : color, !up);
                return done();
            }
            case 'barspattern': {
                if (!d.bars) return line();
                const off = A[0].p - d.base, cw = Math.max(1, v.cW * 0.8);
                d.bars.forEach(([o, h, l, cl], k) => {
                    const x = v.idxToX(idx[0] + k), up = cl >= o, col = tint(up ? GREEN : RED, 0.55);
                    const yo = v.pToY(o + off), yc = v.pToY(cl + off);
                    seg(pt(x, v.pToY(h + off)), pt(x, v.pToY(l + off)), { c: col, w: 1 });
                    g.fills.push({ pts: [pt(x - cw / 2, yo), pt(x + cw / 2, yo), pt(x + cw / 2, yc), pt(x - cw / 2, yc)], c: col });
                });
                handles([[a, 0]]); return g;
            }
            case 'ghostfeed': {
                if (n < 2) return done();
                // Made-up candles that follow the clicked path, one per bar.
                const at = (i) => { for (let k = 1; k < n; k++) { const i0 = idx[k - 1], i1 = idx[k]; if ((i >= i0 && i <= i1) || (i <= i0 && i >= i1)) return A[k - 1].p + (A[k].p - A[k - 1].p) * ((i - i0) / ((i1 - i0) || 1)) } return A[n - 1].p };
                const lo = Math.round(Math.min(...idx)), hi = Math.round(Math.max(...idx)), span = Math.abs(v.yToP(v.top) - v.yToP(v.bottom)) || 1;
                const rnd = (i) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x) };
                const cw = Math.max(1, v.cW * 0.8);
                let prev = at(lo);
                for (let i = lo + 1; i <= hi && i - lo < 2000; i++) {
                    const cl = at(i) + (rnd(i) - 0.5) * span * 0.01, o = prev, w = Math.abs(cl - o) * 0.4 + span * 0.004 * rnd(i + 0.5);
                    const x = v.idxToX(i), up = cl >= o, col = tint(up ? GREEN : RED, 0.55);
                    seg(pt(x, v.pToY(Math.max(o, cl) + w)), pt(x, v.pToY(Math.min(o, cl) - w)), { c: col, w: 1 });
                    const yo = v.pToY(o), yc = v.pToY(cl);
                    g.fills.push({ pts: [pt(x - cw / 2, yo), pt(x + cw / 2, yo), pt(x + cw / 2, yc), pt(x - cw / 2, yc)], c: col });
                    prev = cl;
                }
                g.polys.push({ pts: P, w: 1, dash: [3, 3], c: tint(color, 0.6) });
                return done();
            }
            case 'sector': {
                if (!c) return line();
                const R = Math.hypot(b.x - a.x, b.y - a.y), s0 = Math.atan2(b.y - a.y, b.x - a.x);
                let dd = Math.atan2(c.y - a.y, c.x - a.x) - s0;
                while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
                const arc = []; for (let k = 0; k <= 48; k++) { const t = s0 + dd * k / 48; arc.push(pt(a.x + R * Math.cos(t), a.y + R * Math.sin(t))) }
                const pts = [a].concat(arc);
                g.fills.push({ pts, c: tint(color, 0.2) }); g.polys.push({ pts, closed: true });
                const mid = s0 + dd / 2; tag(a.x + Math.cos(mid) * R * 0.45, a.y + Math.sin(mid) * R * 0.45 + 10, [`${Math.abs(dd * 180 / Math.PI).toFixed(1)}°`], color);
                handles([[a, 0], [b, 1], [arc[arc.length - 1], 2]]); return g;
            }
            case 'avwap': {
                const s = Math.max(0, Math.round(idx[0]));
                if (s >= N) return done();
                let pv = 0, vv = 0; const pts = [];
                for (let i = s; i < N; i++) {
                    const k = data[i], vol = k.volume || 0, tp = (k.high + k.low + k.close) / 3;
                    pv += tp * vol; vv += vol;
                    pts.push(pt(v.idxToX(i), v.pToY(vv ? pv / vv : tp)));
                }
                g.polys.push({ pts });
                const e = pts[pts.length - 1]; g.draws.push(ctx => { ctx.font = 'bold 11px "Open Sans", Arial, sans-serif'; ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText('VWAP', e.x + 6, e.y) });
                handles([[pts[0], 0]]); return g;
            }
            case 'frvp': case 'avp': {
                if (d.type === 'frvp' && !b) return line();
                let i0 = Math.round(idx[0]), i1 = d.type === 'avp' ? N - 1 : Math.round(idx[1]);
                if (i0 > i1) [i0, i1] = [i1, i0];
                i0 = Math.max(0, i0); i1 = Math.min(N - 1, i1);
                if (i1 < i0) return done();
                let lo = Infinity, hi = -Infinity;
                for (let i = i0; i <= i1; i++) { lo = Math.min(lo, data[i].low); hi = Math.max(hi, data[i].high) }
                const rows = 24, step = (hi - lo) / rows || 1, upV = new Array(rows).fill(0), dnV = new Array(rows).fill(0);
                // Spread each bar's volume over the rows its high-low covers.
                for (let i = i0; i <= i1; i++) {
                    const k = data[i], vol = k.volume || 0, rng = (k.high - k.low) || step, arr = k.close >= k.open ? upV : dnV;
                    const r0 = Math.max(0, Math.floor((k.low - lo) / step)), r1 = Math.min(rows - 1, Math.floor((k.high - lo) / step));
                    for (let r = r0; r <= r1; r++) { const ov = Math.min(k.high, lo + (r + 1) * step) - Math.max(k.low, lo + r * step); arr[r] += vol * (k.high === k.low ? 1 / (r1 - r0 + 1) : Math.max(0, ov) / rng) }
                }
                const tot = upV.map((u, r) => u + dnV[r]), all = tot.reduce((x, y) => x + y, 0), maxV = Math.max(...tot) || 1;
                let poc = tot.indexOf(maxV), va = new Set([poc]), sum = maxV, lo2 = poc, hi2 = poc;
                while (sum < all * 0.7 && (lo2 > 0 || hi2 < rows - 1)) {
                    const dn = lo2 > 0 ? tot[lo2 - 1] : -1, upn = hi2 < rows - 1 ? tot[hi2 + 1] : -1;
                    if (upn >= dn) { hi2++; va.add(hi2); sum += upn } else { lo2--; va.add(lo2); sum += dn }
                }
                const x0 = v.idxToX(i0) - v.cW / 2, x1 = v.idxToX(i1) + v.cW / 2, W = Math.max(30, (x1 - x0) * 0.3);
                g.fills.push({ pts: [pt(x0, v.pToY(hi)), pt(x1, v.pToY(hi)), pt(x1, v.pToY(lo)), pt(x0, v.pToY(lo))], c: tint('#2962ff', 0.04) });
                for (let r = 0; r < rows; r++) {
                    const yT = v.pToY(lo + (r + 1) * step) + 0.5, yB = v.pToY(lo + r * step) - 0.5, inVA = va.has(r);
                    const wu = upV[r] / maxV * W, wd = dnV[r] / maxV * W;
                    if (wu > 0) g.fills.push({ pts: [pt(x0, yT), pt(x0 + wu, yT), pt(x0 + wu, yB), pt(x0, yB)], c: inVA ? 'rgba(41,98,255,0.7)' : 'rgba(41,98,255,0.3)' });
                    if (wd > 0) g.fills.push({ pts: [pt(x0 + wu, yT), pt(x0 + wu + wd, yT), pt(x0 + wu + wd, yB), pt(x0 + wu, yB)], c: inVA ? 'rgba(251,192,45,0.7)' : 'rgba(251,192,45,0.3)' });
                }
                const yp = v.pToY(lo + (poc + 0.5) * step);
                seg(pt(x0, yp), pt(x1, yp), { c: RED, w: 1.5 });
                seg(pt(x0, v.pToY(hi)), pt(x0, v.pToY(lo)), { c: tint('#2962ff', 0.5), w: 1 });
                if (d.type === 'frvp') seg(pt(x1, v.pToY(hi)), pt(x1, v.pToY(lo)), { c: tint('#2962ff', 0.5), w: 1 });
                handles(d.type === 'frvp' ? [[pt(x0, v.pToY(hi)), 't0p-'], [pt(x1, v.pToY(lo)), 't1p-']] : [[pt(x0, v.pToY(hi)), 't0p-']]);
                return g;
            }
            case 'pricerange': case 'daterange': case 'dpRange': {
                if (!b) return line();
                // Blue going up (or forward in time for Date range), red the other way.
                const dp = A[1].p - A[0].p, up = d.type === 'daterange' ? idx[1] >= idx[0] : dp >= 0, cl = d.color || (up ? '#2962ff' : RED);
                const x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
                g.fills.push({ pts: [pt(x0, y0), pt(x1, y0), pt(x1, y1), pt(x0, y1)], c: tint(cl, 0.2) });
                const lines = [];
                if (d.type !== 'daterange') {
                    if (d.type === 'pricerange') { seg(pt(x0, a.y), pt(x1, a.y), { c: cl, w: 1 }); seg(pt(x0, b.y), pt(x1, b.y), { c: cl, w: 1 }) }
                    seg(pt(mx, a.y), pt(mx, b.y), { c: cl, w: 1.5 }); head(pt(mx, a.y), pt(mx, b.y), cl);
                    lines.push(`${sgn(dp)}${fp(dp)} (${sgn(dp)}${pct(dp, A[0].p)})`);
                }
                if (d.type !== 'pricerange') {
                    if (d.type === 'daterange') { seg(pt(a.x, y0), pt(a.x, y1), { c: cl, w: 1 }); seg(pt(b.x, y0), pt(b.x, y1), { c: cl, w: 1 }) }
                    seg(pt(a.x, my), pt(b.x, my), { c: cl, w: 1.5 }); head(pt(a.x, my), pt(b.x, my), cl);
                    const ia = Math.round(Math.min(idx[0], idx[1])), ib = Math.round(Math.max(idx[0], idx[1]));
                    let vol = 0; for (let i = Math.max(0, ia); i <= Math.min(N - 1, ib); i++) vol += data[i].volume || 0;
                    lines.push(`${Math.round(idx[1] - idx[0])} bars, ${StockChart.fmtSpan(A[1].t - A[0].t)}`, `Vol ${StockChart.fmtVol(vol)}`);
                }
                const below = b.y >= a.y;
                tag(mx, below ? y1 + 6 : y0 - 6, lines, cl, below);
                return done();
            }
        }
        return line();
    }
    // ---- Zoom in (box zoom) ---------------------------------------------------------
    // Click the magnifier, then drag a box: the chart shows exactly that time and price
    // range. Zoom out appears next to it and steps back through earlier views.
    setupBoxZoom() {
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        const bar = root && (root.querySelector('.sc-sidebar') || root.querySelector('.sc-chart-controls-overlay'));
        if (!area || !bar) return;
        const s = (d) => `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="12.5" cy="12.5" r="7.5"/><path d="m18 18 6 6"/>${d}</svg>`;
        const mk = (cls, title, icon) => { const b = document.createElement('button'); b.className = 'sc-overlay-button ' + cls; b.title = title; b.innerHTML = icon; return b };
        const inBtn = mk('sc-zoom-in-button', 'Zoom in (drag a box)', s('<path d="M12.5 9v7M9 12.5h7"/>'));
        const outBtn = mk('sc-zoom-out-button', 'Zoom out (previous view)', s('<path d="M9 12.5h7"/>'));
        const measure = bar.querySelector('.sc-measure-button');
        if (measure) measure.insertAdjacentElement('afterend', inBtn); else bar.appendChild(inBtn);
        inBtn.insertAdjacentElement('afterend', outBtn);
        const box = document.createElement('div'); box.className = 'sc-zoom-box'; area.appendChild(box);
        const z = this._zoomBox = { on: false, start: null, stack: [] };
        const paint = () => { inBtn.classList.toggle('active', z.on); outBtn.hidden = !z.stack.length; root.classList.toggle('sc-zoom-active', z.on) };
        z.set = (on) => {
            if (z.on === on) return;
            z.on = on; z.start = null; box.classList.remove('active');
            if (on) { if (this.closeOtherToolbarMenus) this.closeOtherToolbarMenus('zoom'); if (this._lt && this._lt.tool) this.deactivateLineTool() }
            paint();
        };
        z.paint = paint;
        inBtn.addEventListener('click', (e) => { e.stopPropagation(); z.set(!z.on) });
        outBtn.addEventListener('click', (e) => { e.stopPropagation(); this.zoomOutStep() });
        // Chart-area coords of the price pane, clamped to the plot.
        const local = (e) => {
            const r = this.priceCanvas.getBoundingClientRect(), L = this.config.padding.left, R = this.getCanvasWidth() - this.config.padding.right;
            const top = this.config.padding.top, bottom = top + this.getPriceChartHeight();
            return { x: Math.max(L, Math.min(R, e.clientX - r.left)), y: Math.max(top, Math.min(bottom, e.clientY - r.top)), raw: { x: e.clientX - r.left, y: e.clientY - r.top } };
        };
        const place = (a, b) => {
            const r = this.priceCanvas.getBoundingClientRect(), ar = area.getBoundingClientRect(), ox = r.left - ar.left, oy = r.top - ar.top;
            Object.assign(box.style, { left: ox + Math.min(a.x, b.x) + 'px', top: oy + Math.min(a.y, b.y) + 'px', width: Math.abs(b.x - a.x) + 'px', height: Math.abs(b.y - a.y) + 'px' });
        };
        area.addEventListener('mousedown', (e) => {
            if (!z.on || e.target !== this.priceCanvas || e.button !== 0) return;
            const p = local(e);
            if (p.raw.x > this.getCanvasWidth() - this.config.padding.right) return; // price scale keeps its own drag
            e.preventDefault(); e.stopPropagation();
            z.start = p; place(p, p); box.classList.add('active');
        }, true);
        document.addEventListener('mousemove', (e) => { if (z.start) place(z.start, local(e)) });
        document.addEventListener('mouseup', (e) => {
            if (!z.start) return;
            const a = z.start, b = local(e);
            z.start = null; box.classList.remove('active');
            if (Math.abs(b.x - a.x) < 6 || Math.abs(b.y - a.y) < 6) return; // a click, not a box
            this.zoomToBox(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.x, b.x), Math.max(a.y, b.y));
            z.set(false);
        });
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && z.on) { z.set(false); e.stopPropagation() } }, true);
        paint();
    }
    _viewState() {
        const c = this.config;
        return { dataOffset: c.dataOffset, visibleCandles: c.visibleCandles, priceOffset: c.priceOffset, verticalScaleFactor: c.verticalScaleFactor, pinned: !!this.isViewPinnedToRightEdge };
    }
    // Screen box (price-pane coords) -> that exact bar range and price range.
    zoomToBox(x0, y0, x1, y1) {
        if (!this.stockData.length) return;
        const v = this._ltView(), c = this.config, n = this.stockData.length;
        const i0 = v.xToIdx(x0), i1 = v.xToIdx(x1), pHi = v.yToP(y0), pLo = v.yToP(y1);
        if (!(pHi > pLo)) return;
        const z = this._zoomBox;
        if (z) { z.stack.push(this._viewState()); if (z.stack.length > 50) z.stack.shift() }
        c.visibleCandles = Math.max(5, Math.round(i1 - i0 + 1));
        c.dataOffset = Math.max(0, Math.min(Math.round(i0), Math.max(0, n - 1)));
        this.isViewPinnedToRightEdge = c.dataOffset >= Math.max(0, n - c.visibleCandles);
        // Work the price scale back from the new window's auto range.
        const raw = this.calculateRawPriceRange(this.stockData, c.dataOffset, c.visibleCandles);
        const rawRng = (raw.max - raw.min) || Math.abs(raw.max) * 0.001 || 1;
        c.verticalScaleFactor = rawRng * (1 + c.verticalPadding * 2) / (pHi - pLo);
        c.priceOffset = (pLo + pHi) / 2 - (raw.min + raw.max) / 2;
        if (z) z.paint();
        this.drawCharts();
    }
    zoomOutStep() {
        const z = this._zoomBox; if (!z || !z.stack.length) return;
        const s = z.stack.pop(), c = this.config;
        c.visibleCandles = s.visibleCandles; c.priceOffset = s.priceOffset; c.verticalScaleFactor = s.verticalScaleFactor;
        // A view that was following the live edge goes back to following it.
        c.dataOffset = s.pinned ? Math.max(0, this.stockData.length - s.visibleCandles) : s.dataOffset;
        this.isViewPinnedToRightEdge = s.pinned;
        z.paint();
        this.drawCharts();
    }
    // ---- Brushes / Arrows / Shapes --------------------------------------------------
    // Same engine as the line tools. Brushes are press-drag-release freehand strokes;
    // Path and Polyline take any number of clicks; Curve and Double curve get their
    // bend handles added once both ends are placed.
    static shapeToolDefs() {
        const blue = '#2962ff', purple = '#9c27b0';
        return [
            { group: 'Brushes' },
            { k: 'brush', label: 'Brush', n: 99, free: true, color: blue, style: { w: 2 } },
            { k: 'highlighter', label: 'Highlighter', n: 99, free: true, color: '#ffeb3b', style: { w: 18, a: 0.35 } },
            { group: 'Arrows' },
            { k: 'arrowmarker', label: 'Arrow marker', n: 2, color: blue },
            { k: 'arrow', label: 'Arrow', n: 2, color: blue },
            { k: 'arrowup', label: 'Arrow mark up', n: 1, color: '#089981' },
            { k: 'arrowdown', label: 'Arrow mark down', n: 1, color: '#f23645' },
            { group: 'Shapes' },
            { k: 'rectangle', label: 'Rectangle', n: 2, key: 'Alt + Shift + R', color: purple },
            { k: 'rotrect', label: 'Rotated rectangle', n: 3, color: purple },
            { k: 'path', label: 'Path', n: 99, multi: true, color: blue },
            { k: 'circle', label: 'Circle', n: 2, color: '#ff9800' },
            { k: 'ellipse', label: 'Ellipse', n: 2, color: '#f23645' },
            { k: 'polyline', label: 'Polyline', n: 99, multi: true, color: blue },
            { k: 'triangle', label: 'Triangle', n: 3, color: '#089981' },
            { k: 'arc', label: 'Arc', n: 3, color: '#e91e63' },
            { k: 'curve', label: 'Curve', n: 2, color: blue },
            { k: 'dcurve', label: 'Double curve', n: 2, color: blue }
        ];
    }
    static shapeToolIcons() {
        const s = (d) => `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
        const o = (x, y) => `<circle cx="${x}" cy="${y}" r="2"/>`;
        // Straight segments between handle circles, stopping short of each circle.
        const link = (pts, closed) => {
            let d = '';
            const n = pts.length, m = closed ? n : n - 1;
            for (let i = 0; i < m; i++) {
                const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n], L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L * 2.6, uy = (y2 - y1) / L * 2.6;
                d += `M${(x1 + ux).toFixed(1)} ${(y1 + uy).toFixed(1)}L${(x2 - ux).toFixed(1)} ${(y2 - uy).toFixed(1)}`;
            }
            return `<path d="${d}"/>` + pts.map(p => o(p[0], p[1])).join('');
        };
        // Outline arrow (tip up at 0,-11) turned by deg and centred on the icon.
        const marker = (deg) => {
            const r = deg * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
            const pts = [[0, -11], [6.5, -3], [2.3, -3], [1.2, 11], [-1.2, 11], [-2.3, -3], [-6.5, -3]];
            return s(`<path d="M${pts.map(([x, y]) => `${(14 + x * c - y * sn).toFixed(1)} ${(14 + x * sn + y * c).toFixed(1)}`).join('L')}z"/>`);
        };
        return {
            brush: s('<path d="M23.5 4.5 14 14"/><path d="M14 14c-2.2-.6-4.3.4-4.9 2.6-.5 1.9-1.1 3.7-3.6 4.6 3 1.7 7.2.8 8.9-1.7 1-1.5.8-3.5-.4-5.5z"/>'),
            highlighter: s('<path d="m9 17 9.5-9.5 3 3L12 20z"/><path d="m18.5 7.5 2-2 3 3-2 2"/><path d="m9 17-2.5 4.5h4L12 20"/><path d="M4 24h9"/>'),
            arrowmarker: marker(45),
            arrow: s('<path d="M7.6 20.4 21 7M21 7h-6.5M21 7v6.5"/>' + o(6, 22)),
            arrowup: s('<path d="M14 4.5 22 13h-4.5v10h-7V13H6z"/>'),
            arrowdown: s('<path d="M14 23.5 22 15h-4.5V5h-7v10H6z"/>'),
            rectangle: s(link([[6, 6], [22, 6], [22, 22], [6, 22]], true)),
            rotrect: s(link([[14, 4], [24, 14], [14, 24], [4, 14]], true)),
            path: s(link([[5, 20], [11, 12], [17, 18]]) + '<path d="M19 15.5 24 9M24 9h-5M24 9v5"/>'),
            circle: s('<circle cx="14" cy="14" r="9.5"/>' + o(14, 14)),
            ellipse: s('<ellipse cx="14" cy="14" rx="10.5" ry="6.5"/>' + o(3.5, 14) + o(24.5, 14)),
            polyline: s(link([[5, 22], [9, 9], [16, 16], [23, 6]])),
            triangle: s(link([[7, 5], [7, 22], [22, 22]], true)),
            arc: s('<path d="M6.7 20.2A10 10 0 0 1 21.3 7.8"/>' + o(5.5, 22) + o(22.5, 6)),
            curve: s('<path d="M6.4 21.1C8 12 13.5 8 21 6.5"/>' + o(5.5, 23) + o(23, 6)),
            dcurve: s('<path d="M7.6 21.2C5 15 10.5 14 14 14s9-1 6.4-7.2"/>' + o(8.5, 23) + o(19.5, 5))
        };
    }
    setupShapeTools() {
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        if (!area || !this._lt) return;
        const defs = StockChart.shapeToolDefs();
        this._shTypes = new Set(defs.filter(d => d.k).map(d => d.k));
        // The new menu takes the old drawing-tools button's place.
        const old = this.drawingToolsButton;
        const m = this._ltMakeMenu({ defs, icons: StockChart.shapeToolIcons(), store: 'sc-shapetool-last', title: 'Brushes, arrows and shapes', after: old || null });
        if (old) old.style.display = 'none';
        this.shapeToolButton = m.btn;
    }
    // Anchor at the exact mouse spot (no bar snap, no magnet) for brush strokes and bend handles.
    _shRaw(x, y, v) { return { t: v.idxToT(v.xToIdx(x)), p: v.yToP(y) } }
    _shTint(c, a) {
        const m = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(c || '');
        return m ? `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})` : `rgba(41,98,255,${a})`;
    }
    // Curves start bent so there's something to grab.
    _shFinish(d) {
        if ((d.type !== 'curve' && d.type !== 'dcurve') || d.pts.length !== 2) return;
        const v = this._ltView(), a = v.xy(d.pts[0]), b = v.xy(d.pts[1]);
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
        const at = (f, k) => this._shRaw(a.x + dx * f + nx * len * k, a.y + dy * f + ny * len * k, v);
        if (d.type === 'curve') d.pts.push(at(0.5, -0.25));
        else d.pts.push(at(0.3, -0.3), at(0.7, 0.3));
    }
    // Edge/corner handles named t<i>p<j>: take time from point i, price from point j ('-' = leave).
    _shResize(d, h, p, v) {
        const m = /^t([\d-])p([\d-])$/.exec(h), a = this._ltAnchor(p.x, p.y, v);
        if (m[1] !== '-') d.pts[+m[1]].t = a.t;
        if (m[2] !== '-') d.pts[+m[2]].p = a.p;
    }
    _shShape(d, v, state) {
        const g = { segs: [], fills: [], handles: [], labels: [], arcs: [], tags: [], draws: [], polys: [], hit: [] };
        const P = d.pts.map(v.xy), [a, b, c] = P, color = d.color || '#2962ff', st = d.style || {}, tint = d.fill || this._shTint(color, 0.2);
        const handles = (list) => (list || P.map((q, i) => [q, i])).forEach(([q, k]) => g.handles.push({ x: q.x, y: q.y, a: k }));
        const shape = (pts, closed) => { if (closed) g.fills.push({ pts, c: tint }); g.polys.push({ pts, closed }) };
        const line = () => { g.polys.push({ pts: [a, b || a] }); handles(); return g };
        const pt = (x, y) => ({ x, y });
        // Arrowhead triangle with its tip on `to`; base = where the shaft should stop.
        const head = (from, to, L, W) => {
            const dx = to.x - from.x, dy = to.y - from.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
            const base = pt(to.x - ux * L, to.y - uy * L);
            return { base, tri: [to, pt(base.x - uy * W / 2, base.y + ux * W / 2), pt(base.x + uy * W / 2, base.y - ux * W / 2)] };
        };
        const ring = (cx, cy, rx, ry) => { const out = []; for (let k = 0; k < 72; k++) { const t = k / 72 * Math.PI * 2; out.push(pt(cx + rx * Math.cos(t), cy + ry * Math.sin(t))) } return out };
        switch (d.type) {
            case 'brush': case 'highlighter': {
                const w = st.w || 2, pad = w / 2 + 3;
                g.polys.push({ pts: P, w, a: st.a });
                const xs = P.map(q => q.x), ys = P.map(q => q.y), x0 = Math.min(...xs), y0 = Math.min(...ys);
                g.frame = { x: x0 - pad, y: y0 - pad, w: Math.max(...xs) - x0 + pad * 2, h: Math.max(...ys) - y0 + pad * 2 };
                return g;
            }
            case 'arrow': {
                if (!b || Math.hypot(b.x - a.x, b.y - a.y) < 2) return line();
                const hd = head(a, b, 12, 11);
                g.polys.push({ pts: [a, Math.hypot(b.x - a.x, b.y - a.y) > 12 ? hd.base : a] });
                g.fills.push({ pts: hd.tri, c: color });
                handles(); return g;
            }
            case 'arrowmarker': {
                const len = b ? Math.hypot(b.x - a.x, b.y - a.y) : 0;
                if (len < 4) return line();
                const ux = (b.x - a.x) / len, uy = (b.y - a.y) / len, nx = -uy, ny = ux;
                const W = Math.min(28, Math.max(12, len * 0.22)), hl = Math.min(len * 0.5, W * 1.1), sw = W * 0.28, tw = sw * 0.35;
                const base = pt(b.x - ux * hl, b.y - uy * hl), off = (q, k) => pt(q.x + nx * k, q.y + ny * k);
                g.fills.push({ pts: [b, off(base, W / 2), off(base, sw), off(a, tw), off(a, -tw), off(base, -sw), off(base, -W / 2)], c: color });
                handles(); return g;
            }
            case 'arrowup': case 'arrowdown': {
                // Tip on the anchor; up arrows hang below it, down arrows sit above.
                const k = d.type === 'arrowup' ? 1 : -1, q = (x, y) => pt(a.x + x, a.y + y * k);
                g.fills.push({ pts: [q(0, 0), q(11, 12), q(4.5, 12), q(4.5, 30), q(-4.5, 30), q(-4.5, 12), q(-11, 12)], c: color });
                handles(); return g;
            }
            case 'rectangle': case 'ellipse': {
                if (!b) return line();
                const x0 = a.x, y0 = a.y, x1 = b.x, y1 = b.y, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
                const edges = [[pt(mx, y0), 't-p0'], [pt(mx, y1), 't-p1'], [pt(x0, my), 't0p-'], [pt(x1, my), 't1p-']];
                if (d.type === 'ellipse') { shape(ring(mx, my, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2), true); handles(edges); return g }
                shape([pt(x0, y0), pt(x1, y0), pt(x1, y1), pt(x0, y1)], true);
                handles([[a, 0], [b, 1], [pt(x1, y0), 't1p0'], [pt(x0, y1), 't0p1']].concat(edges));
                return g;
            }
            case 'circle': {
                if (!b) return line();
                const r = Math.hypot(b.x - a.x, b.y - a.y);
                shape(ring(a.x, a.y, r, r), true); handles(); return g;
            }
            case 'rotrect': {
                if (!c) return line();
                const len = Math.hypot(b.x - a.x, b.y - a.y) || 1, nx = -(b.y - a.y) / len, ny = (b.x - a.x) / len;
                const dist = (c.x - a.x) * nx + (c.y - a.y) * ny, a2 = pt(a.x + nx * dist, a.y + ny * dist), b2 = pt(b.x + nx * dist, b.y + ny * dist);
                shape([a, b, b2, a2], true);
                handles([[a, 0], [b, 1], [pt((a2.x + b2.x) / 2, (a2.y + b2.y) / 2), 2]]);
                return g;
            }
            case 'triangle': if (!c) return line(); shape([a, b, c], true); handles(); return g;
            case 'polyline': shape(P, !!d.closed); handles(); return g;
            case 'path': {
                // Arrow on the last real segment (skip the zero-length one while placing).
                let j = P.length - 1;
                while (j > 0 && Math.hypot(P[j].x - P[j - 1].x, P[j].y - P[j - 1].y) < 2) j--;
                if (j < 1) return line();
                const hd = head(P[j - 1], P[j], 12, 11);
                g.polys.push({ pts: P.slice(0, j).concat(Math.hypot(P[j].x - P[j - 1].x, P[j].y - P[j - 1].y) > 12 ? [hd.base] : []) });
                g.fills.push({ pts: hd.tri, c: color });
                handles(); return g;
            }
            case 'arc': {
                // Circular arc from a to b passing through c; the chord side is shaded.
                if (!c) return line();
                const D = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
                const sq = (q) => q.x * q.x + q.y * q.y;
                if (Math.abs(D) < 1e-6) { g.polys.push({ pts: [a, c, b] }); handles(); return g }
                const ux = (sq(a) * (b.y - c.y) + sq(b) * (c.y - a.y) + sq(c) * (a.y - b.y)) / D;
                const uy = (sq(a) * (c.x - b.x) + sq(b) * (a.x - c.x) + sq(c) * (b.x - a.x)) / D;
                const r = Math.hypot(a.x - ux, a.y - uy), TAU = Math.PI * 2, norm = (x) => ((x % TAU) + TAU) % TAU;
                const sa = Math.atan2(a.y - uy, a.x - ux), ea = Math.atan2(b.y - uy, b.x - ux), ca = Math.atan2(c.y - uy, c.x - ux);
                const ccw = norm(ea - sa), span = norm(ca - sa) < ccw ? ccw : ccw - TAU, pts = [];
                for (let k = 0; k <= 64; k++) { const t = sa + span * k / 64; pts.push(pt(ux + r * Math.cos(t), uy + r * Math.sin(t))) }
                g.fills.push({ pts, c: tint }); g.polys.push({ pts });
                handles(); return g;
            }
            case 'curve': {
                if (!c) return line();
                // The handle sits on the curve: control = 2*handle - midpoint of the ends.
                const qx = 2 * c.x - (a.x + b.x) / 2, qy = 2 * c.y - (a.y + b.y) / 2, pts = [];
                for (let k = 0; k <= 48; k++) { const t = k / 48, u = 1 - t; pts.push(pt(u * u * a.x + 2 * u * t * qx + t * t * b.x, u * u * a.y + 2 * u * t * qy + t * t * b.y)) }
                g.polys.push({ pts }); handles(); return g;
            }
            case 'dcurve': {
                if (P.length < 4) return line();
                const c1 = P[2], c2 = P[3], pts = [];
                for (let k = 0; k <= 64; k++) {
                    const t = k / 64, u = 1 - t, A = u * u * u, B = 3 * u * u * t, C = 3 * u * t * t, E = t * t * t;
                    pts.push(pt(A * a.x + B * c1.x + C * c2.x + E * b.x, A * a.y + B * c1.y + C * c2.y + E * b.y));
                }
                g.polys.push({ pts });
                if (state.sel || state.hov) g.segs.push({ a, b: c1, w: 1, dash: [3, 3] }, { a: b, b: c2, w: 1, dash: [3, 3] });
                handles(); return g;
            }
        }
        return line();
    }
    // ---- Emoji picker ------------------------------------------------------------
    // Full Unicode set from emoji-data.js (window.StockChartEmojiData), in tabs with a
    // Recently used row. Emoji draw as Twemoji images so they look the same on every
    // OS (Windows has no flag emoji); options.emojiImages = false uses system emoji,
    // or a string sets another image base URL. Native text is the fallback while an
    // image loads or if it fails.
    static emojiImageUrl(e, base) {
        const s = e.indexOf('‍') < 0 ? e.replace(/️/g, '') : e;
        return base + Array.from(s).map(ch => ch.codePointAt(0).toString(16)).join('-') + '.svg';
    }
    emojiImageBase() {
        const o = this.options.emojiImages;
        if (o === false) return null;
        return typeof o === 'string' ? o : 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/';
    }
    _drawEmoji(ctx, e, x, y, size) {
        const base = this.emojiImageBase();
        if (base) {
            const cache = StockChart._emojiImgs || (StockChart._emojiImgs = new Map());
            const url = StockChart.emojiImageUrl(e, base);
            let rec = cache.get(url);
            if (!rec) {
                const img = new Image();
                img.crossOrigin = 'anonymous'; // keeps the canvas exportable for the camera button
                rec = { img, ok: false, bad: false, waiters: new Set() };
                const done = () => { rec.waiters.forEach(c => c.container.isConnected && c.drawCharts()); rec.waiters.clear() };
                img.onload = () => { rec.ok = true; done() };
                img.onerror = () => { rec.bad = true; done() };
                cache.set(url, rec);
                img.src = url;
            }
            if (rec.ok) { ctx.drawImage(rec.img, x - size / 2, y - size / 2, size, size); return }
            if (!rec.bad) rec.waiters.add(this);
        }
        ctx.font = `${size}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(e, x, y);
    }
    // ---- Text and notes -------------------------------------------------------------
    // Built on the line-tool engine (time/price anchors, select, drag, delete, undo,
    // eraser). Text is typed straight onto the chart in an inline editor; a floating
    // toolbar over the selected item sets colour, size, bold and italic. Double-click
    // an item to edit it again. Empty text is removed when editing ends.
    static get NT_FONT() { return '-apple-system, BlinkMacSystemFont, "Trebuchet MS", Roboto, Ubuntu, sans-serif' }
    static textToolDefs() {
        const blue = '#2962ff';
        return [
            { group: 'Text and notes' },
            { k: 'text', label: 'Text', n: 1, edit: true, style: { color: blue, size: 14 } },
            { k: 'note', label: 'Note', n: 1, edit: true, style: { color: '#ffffff', bg: blue, size: 14 } },
            { k: 'pricenote', label: 'Price note', n: 2, style: { color: '#ffffff', bg: blue, size: 13 } },
            { k: 'pin', label: 'Pin', n: 1, edit: true, keepEmpty: true, style: { color: '#ffffff', bg: blue, size: 14 } },
            { k: 'table', label: 'Table', n: 1, edit: true, keepEmpty: true, style: { color: '', bg: blue, size: 13 } },
            { k: 'callout', label: 'Callout', n: 2, edit: true, style: { color: '#ffffff', bg: blue, size: 14 } },
            { k: 'comment', label: 'Comment', n: 1, edit: true, style: { color: '#ffffff', bg: blue, size: 14 } },
            { k: 'pricelabel', label: 'Price label', n: 1, style: { color: '#ffffff', bg: blue, size: 13 } },
            { k: 'signpost', label: 'Signpost', n: 1, edit: true, style: { color: '#ffffff', bg: blue, size: 14 } },
            { k: 'flagmark', label: 'Flag mark', n: 1, style: { bg: blue } },
            { group: 'Content' },
            { k: 'image', label: 'Image', n: 1, keepEmpty: true }
        ];
    }
    static textToolIcons() {
        const s = (d) => `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
        const stem = '<path d="M14 15v5.5"/><circle cx="14" cy="22.5" r="1.8"/>';
        return {
            text: s('<path d="M7.5 6.5h13M14 6.5v15.5M11 22h6"/>'),
            note: s('<rect x="7" y="3.5" width="14" height="11.5" rx="1.5"/><path d="M11 7h6M14 7v5.5"/>' + stem),
            pricenote: s('<rect x="7" y="3.5" width="14" height="11.5" rx="1.5"/><path d="M16.2 6.6h-3a1.3 1.3 0 0 0 0 2.6h2a1.3 1.3 0 0 1 0 2.6h-3M14 5.5v8"/>' + stem),
            pin: s('<path d="M14 24.5s-7-6.6-7-12.2a7 7 0 0 1 14 0c0 5.6-7 12.2-7 12.2z"/><circle cx="14" cy="12.3" r="2.6"/>'),
            table: s('<rect x="4.5" y="6" width="19" height="16" rx="1"/><path d="M4.5 11.3h19M4.5 16.6h19M10.8 6v16"/>'),
            callout: s('<path d="M6 6.5h16v10.5H12l-4.5 4v-4H6z"/>'),
            comment: s('<path d="M10.5 7h8a4.5 4.5 0 0 1 0 9h-12V11.5A4.5 4.5 0 0 1 10.5 7z"/>'),
            pricelabel: s('<path d="M9 5.5h13.5v12H11L7 21.5V7.5a2 2 0 0 1 2-2z"/>'),
            signpost: s('<circle cx="14" cy="10" r="6.5"/><path d="M14 16.5V25"/><path d="m14 6.6 1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z"/>'),
            flagmark: s('<path d="M7.5 24.5V5h13l-3.5 4.5 3.5 4.5h-13"/>'),
            image: s('<rect x="4.5" y="5.5" width="19" height="17" rx="2"/><path d="m4.5 19 5.5-5.5 4.5 4.5 3-3 6 6"/><circle cx="18" cy="10.5" r="1.7"/>')
        };
    }
    setupTextTools() {
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        if (!area || !this._lt) return;
        const defs = StockChart.textToolDefs();
        this._ntTypes = new Set(defs.filter(d => d.k).map(d => d.k));
        this._ntArea = area;
        this._ntImgs = new Map();
        // The new menu takes the old text button's place.
        const old = this.textToolButton;
        const m = this._ltMakeMenu({ defs, icons: StockChart.textToolIcons(), store: 'sc-texttool-last', title: 'Text and notes', after: old || null });
        if (old) old.style.display = 'none';
        this.textToolButton2 = m.btn;

        // Floating toolbar for the selected text item.
        const tb = document.createElement('div');
        tb.className = 'sc-nt-toolbar';
        area.appendChild(tb);
        this._ntToolbar = tb;
        tb.addEventListener('mousedown', (e) => { e.stopPropagation(); if (!/^(INPUT|SELECT|OPTION)$/.test(e.target.tagName)) e.preventDefault() });

        area.addEventListener('dblclick', (e) => {
            if (e.target !== this.priceCanvas || this._lt.tool) return;
            const r = this.priceCanvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
            const hit = this._ltHit(x, y); if (!hit) return;
            const d = this.lineTools[hit.i], def = this._ltDefs[d.type];
            if (!def || !def.edit) return;
            e.preventDefault(); e.stopPropagation();
            let cell = null;
            const g = this._ltCache && this._ltCache.get(d);
            if (d.type === 'table' && g && g.cells) g.cells.forEach((row, ri) => row.forEach((c, ci) => { if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) cell = [ri, ci] }));
            if (d.type === 'table' && !cell) cell = [0, 0];
            this._ntEdit(d, cell);
        }, true);
        // Clicking anywhere outside the chart drops the selection (and its toolbar).
        document.addEventListener('mousedown', (e) => {
            const lt = this._lt;
            if (lt.sel === null || this.chartContainer.contains(e.target)) return;
            if (lt.editing) return; // the editor's own blur handles this
            lt.sel = lt.hover = null; this.drawCharts();
        }, true);
        this._ntAfterCommit = (d) => {
            const def = this._ltDefs[d.type]; if (!def || !this._ntTypes.has(d.type)) return;
            if (d.type === 'image') this._ntPickImage(d);
            else if (def.edit) this._ntEdit(d, d.type === 'table' ? [0, 0] : null);
        };
    }
    _ntMeasure() { return this._ntMeasureCtx || (this._ntMeasureCtx = document.createElement('canvas').getContext('2d')) }
    _ntLayout(text, st, minW) {
        const size = st.size || 14, font = `${st.italic ? 'italic ' : ''}${st.bold ? 'bold ' : ''}${size}px ${StockChart.NT_FONT}`;
        const ctx = this._ntMeasure(); ctx.font = font;
        const lines = String(text || '').split('\n'), lh = Math.round(size * 1.35);
        const w = Math.max(minW || 0, ...lines.map(l => ctx.measureText(l).width));
        return { font, lines, lh, size, w: Math.ceil(w), h: lines.length * lh };
    }
    _ntText(ctx, lay, x, y, color) {
        ctx.font = lay.font; ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
        lay.lines.forEach((l, i) => ctx.fillText(l, x, y + lay.lh * (i + 0.5)));
    }
    _ntRound(ctx, x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    _ntShape(d, v, state) {
        const g = { segs: [], fills: [], handles: [], labels: [], arcs: [], tags: [], draws: [], hit: [] };
        const st = d.style || {}, P = d.pts.map(v.xy), a = P[0], dark = !!this.config.darkMode;
        const ed = this._lt.editing && this._lt.editing.d === d ? this._lt.editing : null;
        const editingText = ed && !ed.cell;
        const theme = dark ? '#d1d4dc' : '#131722', bg = st.bg || '#2962ff', fg = st.color || theme;
        const priceText = (i) => s8FormatChartPrice(d.pts[i].p);
        // A filled, rounded text box. (x, y) = box top-left.
        const textBox = (lay, x, y, padX, padY, r) => {
            const w = lay.w + padX * 2, h = lay.h + padY * 2;
            g.draws.push(ctx => { ctx.fillStyle = bg; this._ntRound(ctx, x, y, w, h, r); ctx.fill(); if (!editingText) this._ntText(ctx, lay, x + padX, y + padY, fg) });
            g.hit.push({ x, y, w, h });
            g.box = { x: x + padX, y: y + padY, lay, color: fg };
            g.frame = { x, y, w, h };
            return { x, y, w, h };
        };
        const minW = editingText ? 6 : 0;
        switch (d.type) {
            case 'text': {
                const lay = this._ntLayout(d.text, st, minW), pad = st.bgOn || st.border ? 6 : 3;
                const f = { x: a.x - pad, y: a.y - pad, w: lay.w + pad * 2, h: lay.h + pad * 2 };
                g.draws.push(ctx => {
                    if (st.bgOn) { ctx.fillStyle = st.bgColor || 'rgba(41,98,255,0.2)'; this._ntRound(ctx, f.x, f.y, f.w, f.h, 3); ctx.fill() }
                    if (st.border) { ctx.strokeStyle = st.borderColor || fg; ctx.lineWidth = 1; this._ntRound(ctx, f.x, f.y, f.w, f.h, 3); ctx.stroke() }
                    if (!editingText) this._ntText(ctx, lay, a.x, a.y, fg);
                });
                g.hit.push(f); g.frame = f; g.box = { x: a.x, y: a.y, lay, color: fg };
                break;
            }
            case 'note': {
                const lay = this._ntLayout(d.text, st, Math.max(minW, 8)), w = lay.w + 16, h = lay.h + 12;
                const bx = a.x - w / 2, by = a.y - 20 - h;
                g.draws.push(ctx => { ctx.strokeStyle = bg; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x, by + h); ctx.stroke(); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(a.x, a.y, 3.5, 0, Math.PI * 2); ctx.fill() });
                textBox(lay, bx, by, 8, 6, 4);
                g.hit.push({ x: a.x - 6, y: by + h, w: 12, h: 26 });
                break;
            }
            case 'comment': case 'pricelabel': {
                const text = d.type === 'pricelabel' ? priceText(0) : d.text;
                const lay = this._ntLayout(text, st, Math.max(minW, 8)), h = lay.h + 12, bx = a.x + 2, by = a.y - 12 - h;
                g.draws.push(ctx => { ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(bx + 3, by + h - 6); ctx.lineTo(bx + 18, by + h - 1); ctx.closePath(); ctx.fill() });
                textBox(lay, bx, by, 10, 6, Math.min(12, h / 2));
                g.hit.push({ pts: [a, { x: bx + 2, y: by + h - 6 }, { x: bx + 20, y: by + h }] });
                break;
            }
            case 'callout': {
                const b = P[1] || a, lay = this._ntLayout(d.text, st, Math.max(minW, 8)), w = lay.w + 20, h = lay.h + 14;
                const bx = b.x - w / 2, by = b.y - h / 2;
                let dx = a.x - b.x, dy = a.y - b.y; const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
                const k = Math.min(10, w / 3, h / 3), p1 = { x: b.x - dy * k, y: b.y + dx * k }, p2 = { x: b.x + dy * k, y: b.y - dx * k };
                g.draws.push(ctx => { ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.closePath(); ctx.fill() });
                textBox(lay, bx, by, 10, 7, 4);
                g.hit.push({ pts: [a, p1, p2] });
                g.handles.push({ x: a.x, y: a.y, a: 0 });
                if (P[1]) g.handles.push({ x: b.x, y: b.y + h / 2, a: 1 });
                break;
            }
            case 'pricenote': {
                const b = P[1] || a, lay = this._ntLayout(priceText(0), st), w = lay.w + 16, h = lay.h + 10;
                g.segs.push({ a, b, c: bg, w: 1.5 });
                g.draws.push(ctx => { ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(a.x, a.y, 3.5, 0, Math.PI * 2); ctx.fill() });
                textBox(lay, b.x - w / 2, b.y - h / 2, 8, 5, 4);
                g.handles.push({ x: a.x, y: a.y, a: 0 }, { x: b.x, y: b.y, a: 1 });
                break;
            }
            case 'pin': {
                const head = { x: a.x, y: a.y - 18 };
                g.draws.push(ctx => {
                    ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(a.x, a.y);
                    ctx.bezierCurveTo(a.x - 4, a.y - 7, head.x - 10, head.y + 5, head.x - 10, head.y);
                    ctx.arc(head.x, head.y, 10, Math.PI, 0);
                    ctx.bezierCurveTo(head.x + 10, head.y + 5, a.x + 4, a.y - 7, a.x, a.y); ctx.fill();
                    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(head.x, head.y, 3.8, 0, Math.PI * 2); ctx.fill();
                });
                g.hit.push({ x: a.x - 11, y: a.y - 29, w: 22, h: 30 });
                g.frame = null;
                // Pin text shows when the pin is hovered, selected or being edited.
                if ((state.sel || state.hov || ed) && (d.text || ed)) {
                    const lay = this._ntLayout(d.text, st, Math.max(minW, 8)), w = lay.w + 16, h = lay.h + 12;
                    textBox(lay, a.x - w / 2, a.y - 36 - h, 8, 6, 4);
                    g.frame = null;
                }
                break;
            }
            case 'signpost': {
                const lay = this._ntLayout(d.text, st, Math.max(minW, 8)), w = lay.w + 22, h = lay.h + 12;
                const bx = a.x - w / 2, by = a.y - h / 2;
                const ci = Math.round(v.tToIdx(d.pts[0].t)), c = this.stockData[ci];
                let pole = null;
                if (c) { const hy = v.pToY(c.high), ly = v.pToY(c.low); if (by + h < hy) pole = [by + h, hy]; else if (by > ly) pole = [by, ly] }
                if (pole) g.draws.push(ctx => { ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a.x, pole[0]); ctx.lineTo(a.x, pole[1]); ctx.stroke(); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(a.x, pole[1], 3, 0, Math.PI * 2); ctx.fill() });
                textBox(lay, bx, by, 11, 6, h / 2);
                break;
            }
            case 'flagmark': {
                g.draws.push(ctx => {
                    ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x, a.y - 30); ctx.stroke();
                    ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(a.x, a.y - 30); ctx.lineTo(a.x + 20, a.y - 30); ctx.lineTo(a.x + 14, a.y - 24); ctx.lineTo(a.x + 20, a.y - 18); ctx.lineTo(a.x, a.y - 18); ctx.closePath(); ctx.fill();
                });
                g.hit.push({ x: a.x - 4, y: a.y - 32, w: 26, h: 34 });
                break;
            }
            case 'table': {
                const cells = d.cells || [['']], cols = Math.max(...cells.map(r => r.length));
                const ctxm = this._ntMeasure(), lay0 = this._ntLayout('', st), pad = 8, rh = lay0.lh + 10;
                ctxm.font = lay0.font;
                const cw = []; for (let c = 0; c < cols; c++) cw[c] = Math.max(56, ...cells.map(r => Math.ceil(ctxm.measureText(r[c] || '').width))) + pad * 2;
                const W = cw.reduce((s, x) => s + x, 0), H = rh * cells.length;
                g.cells = cells.map((row, ri) => { let x = a.x; return cw.map((w, ci) => { const r = { x, y: a.y + ri * rh, w, h: rh }; x += w; return r }) });
                g.draws.push(ctx => {
                    ctx.fillStyle = dark ? 'rgba(30,34,45,0.92)' : 'rgba(255,255,255,0.95)'; ctx.fillRect(a.x, a.y, W, H);
                    ctx.strokeStyle = bg; ctx.lineWidth = 1;
                    g.cells.forEach((row, ri) => row.forEach((c, ci) => {
                        ctx.strokeRect(c.x + 0.5, c.y + 0.5, c.w, c.h);
                        if (ed && ed.cell && ed.cell[0] === ri && ed.cell[1] === ci) return;
                        const t = cells[ri][ci]; if (t) this._ntText(ctx, { font: lay0.font, lines: [t], lh: lay0.lh }, c.x + pad, c.y + 5, fg);
                    }));
                });
                g.hit.push({ x: a.x, y: a.y, w: W, h: H });
                g.frame = { x: a.x, y: a.y, w: W, h: H };
                if (ed && ed.cell && g.cells[ed.cell[0]]) {
                    const c = g.cells[ed.cell[0]][ed.cell[1]];
                    if (c) g.box = { x: c.x + pad, y: c.y + 5, lay: { ...lay0, w: c.w - pad * 2, h: lay0.lh }, color: fg };
                }
                break;
            }
            case 'image': {
                const w = d.w || 200, h = w * (d.ar || 0.6);
                let img = d.src ? this._ntImgs.get(d.src) : null;
                if (d.src && !img) { img = new Image(); img.onload = () => this.drawCharts(); img.src = d.src; this._ntImgs.set(d.src, img) }
                g.draws.push(ctx => {
                    if (img && img.complete && img.naturalWidth) ctx.drawImage(img, a.x, a.y, w, h);
                    else { ctx.strokeStyle = '#2962ff'; ctx.setLineDash([4, 4]); ctx.strokeRect(a.x, a.y, w, h); ctx.setLineDash([]); ctx.fillStyle = theme; ctx.font = `12px ${StockChart.NT_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(d.src ? 'Loading image' : 'Choose an image', a.x + w / 2, a.y + h / 2) }
                });
                g.hit.push({ x: a.x, y: a.y, w, h });
                g.frame = { x: a.x, y: a.y, w, h };
                g.handles.push({ x: a.x + w, y: a.y + h, a: 'img' });
                break;
            }
        }
        return g;
    }
    _ntResize(d, h, p, v) {
        if (h !== 'img') return;
        const a = v.xy(d.pts[0]);
        d.w = Math.max(24, Math.min(1600, Math.round(p.x - a.x)));
    }
    _ntPickImage(d) {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = 'image/png,image/jpeg,image/gif,image/webp';
        const drop = () => { const i = this.lineTools.indexOf(d); if (i >= 0 && !d.src) { this.lineTools.splice(i, 1); this._lt.sel = null; this.drawCharts() } };
        input.addEventListener('cancel', drop);
        input.addEventListener('change', () => {
            const file = input.files && input.files[0]; if (!file) { drop(); return }
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    // Keep drawings light: shrink big images before storing them.
                    const max = 1200, k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
                    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
                    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                    d.src = c.toDataURL(/png|gif|webp/.test(file.type) ? 'image/png' : 'image/jpeg', 0.9);
                    d.ar = c.height / c.width; d.w = Math.min(320, c.width);
                    this.drawCharts(); this.recordDrawingState();
                };
                img.onerror = drop;
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
        input.click();
    }
    _ntEdit(d, cell) {
        this._ntFinishEdit();
        const lt = this._lt, i = this.lineTools.indexOf(d); if (i < 0) return;
        lt.sel = i;
        const ta = document.createElement('textarea');
        ta.className = 'sc-nt-editor'; ta.spellcheck = false; ta.setAttribute('wrap', 'off');
        ta.value = cell ? (d.cells[cell[0]][cell[1]] || '') : (d.text || '');
        lt.editing = { d, cell, ta };
        this._ntArea.appendChild(ta);
        ta.addEventListener('input', () => { if (cell) d.cells[cell[0]][cell[1]] = ta.value; else d.text = ta.value; this.drawCharts() });
        ta.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Escape' || (e.key === 'Enter' && (e.ctrlKey || e.metaKey || cell))) { e.preventDefault(); this._ntFinishEdit(); return }
            if (e.key === 'Tab' && cell) {
                // Tab / Shift+Tab walk the table cells.
                e.preventDefault();
                const rows = d.cells.length, cols = d.cells[0].length;
                let n = cell[0] * cols + cell[1] + (e.shiftKey ? -1 : 1); n = (n + rows * cols) % (rows * cols);
                this._ntEdit(d, [Math.floor(n / cols), n % cols]);
            }
        });
        ta.addEventListener('blur', () => { if (lt.editing && lt.editing.ta === ta) this._ntFinishEdit() });
        this.drawCharts();
        requestAnimationFrame(() => { ta.focus(); const n = ta.value.length; ta.setSelectionRange(n, n) });
    }
    _ntFinishEdit() {
        const lt = this._lt, ed = lt && lt.editing; if (!ed) return;
        lt.editing = null;
        ed.ta.remove();
        const d = ed.d, def = this._ltDefs[d.type];
        if (!ed.cell && def && !def.keepEmpty && !String(d.text || '').trim()) {
            const i = this.lineTools.indexOf(d); if (i >= 0) this.lineTools.splice(i, 1);
            lt.sel = null;
        }
        this.drawCharts();
        this.recordDrawingState();
    }
    // Keeps the inline editor and the floating toolbar on top of their item.
    _ntSyncUi() {
        const lt = this._lt, area = this._ntArea; if (!lt || !area) return;
        const cr = this.priceCanvas.getBoundingClientRect(), ar = area.getBoundingClientRect(), ox = cr.left - ar.left, oy = cr.top - ar.top;
        const ed = lt.editing;
        if (ed) {
            const g = this._ltCache.get(ed.d);
            if (g && g.box) {
                const b = g.box, ta = ed.ta;
                Object.assign(ta.style, { left: (ox + b.x) + 'px', top: (oy + b.y) + 'px', width: (Math.max(b.lay.w, 6) + 14) + 'px', height: Math.max(b.lay.h, b.lay.lh) + 'px', font: b.lay.font, lineHeight: b.lay.lh + 'px', color: b.color, caretColor: b.color });
            }
        }
        const tb = this._ntToolbar, d = lt.sel !== null ? this.lineTools[lt.sel] : null;
        const hide = () => { tb.classList.remove('active'); this._ntTbFor = null };
        const isText = !!(d && this._ntTypes.has(d.type));
        const show = d && !lt.drag && !lt.tool && !this.isDrawingModeOn();
        if (!show) return hide();
        const g = this._ltCache.get(d); if (!g) return hide();
        // Sit above everything the item draws (a pin's text bubble, a note's stem...).
        // Other drawings: the box round their handles (and a brush's frame).
        const rects = [g.frame].concat(g.hit || []).filter(r => r && r.w).concat(isText ? [] : g.handles.map(q => ({ x: q.x - 1, y: q.y - 1, w: 2, h: 2 })));
        if (!rects.length) return hide();
        const fx = Math.min(...rects.map(r => r.x)), fy = Math.min(...rects.map(r => r.y));
        const f = { x: fx, y: fy, w: Math.max(...rects.map(r => r.x + r.w)) - fx, h: Math.max(...rects.map(r => r.y + r.h)) - fy };
        // Hide while the item is panned or zoomed out of the visible plot.
        const L = this.config.padding.left, R = this.getCanvasWidth() - this.config.padding.right, T = this.config.padding.top, B = T + this.getPriceChartHeight();
        if (f.x + f.w < L || f.x > R || f.y + f.h < T || f.y > B) return hide();
        if (this._ntTbFor !== d) { if (isText) this._ntBuildToolbar(d); else this._dsBuildToolbar(d); this._ntTbFor = d }
        tb.classList.add('active');
        const w = tb.offsetWidth, h = tb.offsetHeight;
        let left = ox + f.x + f.w / 2 - w / 2, top = oy + f.y - h - 12;
        if (top < 4) top = oy + f.y + f.h + 12;
        top = Math.max(4, Math.min(area.clientHeight - h - 4, top));
        left = Math.max(4, Math.min(area.clientWidth - w - 4, left));
        tb.style.left = left + 'px'; tb.style.top = top + 'px';
    }
    _ntBuildToolbar(d) {
        const tb = this._ntToolbar, st = d.style || (d.style = {});
        const hex = (c, fb) => /^#[0-9a-f]{6}$/i.test(c || '') ? c : fb;
        const theme = this.config.darkMode ? '#d1d4dc' : '#131722';
        const parts = [];
        const hasText = ['text', 'note', 'pin', 'callout', 'comment', 'signpost', 'table', 'pricenote', 'pricelabel'].includes(d.type);
        if (hasText) parts.push(`<label class="sc-nt-swatch" title="Text color"><span class="sc-nt-a" style="--c:${hex(st.color, theme)}">A</span><input type="color" data-k="color" value="${hex(st.color, theme)}"></label>`);
        if (st.bg !== undefined) parts.push(`<label class="sc-nt-swatch" title="Background"><span class="sc-nt-fill" style="--c:${hex(st.bg, '#2962ff')}"></span><input type="color" data-k="bg" value="${hex(st.bg, '#2962ff')}"></label>`);
        if (hasText) {
            parts.push(`<select data-k="size" title="Font size">${[10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32, 40].map(n => `<option value="${n}"${n === (st.size || 14) ? ' selected' : ''}>${n}</option>`).join('')}</select>`);
            parts.push(`<button type="button" data-t="bold" class="${st.bold ? 'on' : ''}" title="Bold"><b>B</b></button><button type="button" data-t="italic" class="${st.italic ? 'on' : ''}" title="Italic"><i>I</i></button>`);
        }
        if (d.type === 'text') parts.push(`<button type="button" data-t="bgOn" class="${st.bgOn ? 'on' : ''}" title="Background">Bg</button><button type="button" data-t="border" class="${st.border ? 'on' : ''}" title="Border">Border</button>`);
        if (d.type === 'table') parts.push('<span class="sc-nt-sep"></span><button type="button" data-a="row+" title="Add row">+ Row</button><button type="button" data-a="col+" title="Add column">+ Col</button><button type="button" data-a="row-" title="Remove last row">− Row</button><button type="button" data-a="col-" title="Remove last column">− Col</button>');
        parts.push(this._dsTail(d));
        tb.innerHTML = parts.join('');
        const apply = () => { this.drawCharts(); this.recordDrawingState() };
        tb.querySelectorAll('input[type="color"]').forEach(inp => inp.addEventListener('input', () => {
            st[inp.dataset.k] = inp.value; if (d.type === 'text' && inp.dataset.k === 'color') st.bgColor = null;
            const sw = inp.parentElement.firstElementChild; if (sw) sw.style.setProperty('--c', inp.value);
            this.drawCharts();
        }));
        tb.querySelectorAll('input[type="color"]').forEach(inp => inp.addEventListener('change', apply));
        const sel = tb.querySelector('select'); if (sel) sel.addEventListener('change', () => { st.size = +sel.value; apply() });
        tb.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => { st[b.dataset.t] = !st[b.dataset.t]; b.classList.toggle('on', !!st[b.dataset.t]); apply() }));
        tb.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
            const act = b.dataset.a, c = d.cells;
            if (this._dsAction(d, act)) return;
            if (act === 'row+') c.push(c[0].map(() => ''));
            if (act === 'col+') c.forEach(r => r.push(''));
            if (act === 'row-' && c.length > 1) c.pop();
            if (act === 'col-' && c[0].length > 1) c.forEach(r => r.pop());
            this._ntFinishEdit(); apply();
        }));
    }
    // ---- Drawing toolbar ------------------------------------------------------------
    // Floats over the selected drawing (same box as the text toolbar). Line colour,
    // fill, width and line style where the tool has them; lock, clone and delete for
    // every drawing. Fib and Gann levels keep their own colours, so those get a
    // background on/off switch instead.
    static get DS_FILLED() { return ['rectangle', 'rotrect', 'circle', 'ellipse', 'triangle', 'arc', 'xabcd', 'cypher', 'headshoulders', 'trianglepat', 'parallel', 'flattop', 'disjoint', 'regression'] }
    _dsTail(d) {
        const i = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
        return '<span class="sc-nt-sep"></span>'
            + `<button type="button" data-a="lock" class="${d.locked ? 'on' : ''}" title="${d.locked ? 'Unlock' : 'Lock'}">${i(d.locked ? '<rect x="5.5" y="11" width="13" height="9" rx="1.5"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/>' : '<rect x="5.5" y="11" width="13" height="9" rx="1.5"/><path d="M8.5 11V8a3.5 3.5 0 0 1 6.8-1.2"/>')}</button>`
            + `<button type="button" data-a="clone" title="Clone">${i('<rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/><path d="M15.5 8.5v-2a1.5 1.5 0 0 0-1.5-1.5H6.5A1.5 1.5 0 0 0 5 6.5V14a1.5 1.5 0 0 0 1.5 1.5h2"/>')}</button>`
            + `<button type="button" data-a="del" title="Delete">${i('<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13M10.5 11v6M13.5 11v6"/>')}</button>`;
    }
    // Lock / clone / delete. Returns true when it handled the action.
    _dsAction(d, act) {
        const lt = this._lt, done = () => { this._ntTbFor = null; this.drawCharts(); this.recordDrawingState() };
        if (act === 'del') { if (this._ntFinishEdit) this._ntFinishEdit(); const i = this.lineTools.indexOf(d); if (i >= 0) this.lineTools.splice(i, 1); lt.sel = lt.hover = null; done(); return true }
        if (act === 'lock') { d.locked = !d.locked; done(); return true }
        if (act === 'clone') {
            // The copy sits a few bars to the right so it doesn't hide the original.
            const c = JSON.parse(JSON.stringify(d)), v = this._ltView();
            c.id = Date.now() + Math.random(); c.locked = false;
            c.pts = c.pts.map(q => ({ t: v.idxToT(v.tToIdx(q.t) + 5), p: q.p }));
            this.lineTools.push(c); lt.sel = this.lineTools.length - 1; done(); return true;
        }
        return false;
    }
    _dsBuildToolbar(d) {
        const tb = this._ntToolbar, k = d.type, parts = [];
        const hex = (c, fb) => /^#[0-9a-f]{6}$/i.test(c || '') ? c : fb;
        const plain = ['longpos', 'shortpos', 'barspattern', 'ghostfeed', 'frvp', 'avp'].includes(k);
        if (plain) { tb.innerHTML = this._dsTail(d); tb.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => this._dsAction(d, b.dataset.a))); return }
        const isFib = !!(this._fbTypes && this._fbTypes.has(k)), brush = k === 'brush' || k === 'highlighter';
        const solid = ['arrowmarker', 'arrowup', 'arrowdown'].includes(k); // filled marks, no outline
        const filled = StockChart.DS_FILLED.includes(k) || (k === 'polyline' && d.closed);
        if (!isFib) parts.push(`<label class="sc-nt-swatch" title="${solid ? 'Color' : 'Line color'}"><span class="sc-ds-line" style="--c:${hex(d.color, '#2962ff')}"></span><input type="color" data-k="color" value="${hex(d.color, '#2962ff')}"></label>`);
        if (filled) parts.push(`<label class="sc-nt-swatch" title="Fill color"><span class="sc-nt-fill" style="--c:${hex(d.fillHex, hex(d.color, '#2962ff'))};opacity:.6"></span><input type="color" data-k="fill" value="${hex(d.fillHex, hex(d.color, '#2962ff'))}"></label>`);
        if (isFib || filled || ['pitchfork', 'schiff', 'modschiff', 'inside', 'timecycles'].includes(k)) parts.push(`<button type="button" data-a="nofill" class="${d.noFill ? '' : 'on'}" title="Background on/off">Bg</button>`);
        if (!isFib && !solid) {
            const w = brush ? ((d.style && d.style.w) || 2) : (d.w || 2), opts = k === 'highlighter' ? [8, 12, 18, 24, 32] : [1, 2, 3, 4];
            parts.push(`<select data-k="w" title="Line width">${opts.map(n => `<option value="${n}"${n === w ? ' selected' : ''}>${n}px</option>`).join('')}</select>`);
            if (!brush) parts.push(`<select data-k="dash" title="Line style">${[['', 'Solid'], ['dashed', 'Dashed'], ['dotted', 'Dotted']].map(([v, l]) => `<option value="${v}"${(d.dash || '') === v ? ' selected' : ''}>${l}</option>`).join('')}</select>`);
        }
        parts.push(this._dsTail(d));
        tb.innerHTML = parts.join('');
        const save = () => { this.drawCharts(); this.recordDrawingState() };
        tb.querySelectorAll('input[type="color"]').forEach(inp => {
            const set = () => {
                if (inp.dataset.k === 'fill') { d.fillHex = inp.value; d.fill = this._shTint(inp.value, 0.2) } else d.color = inp.value;
                const sw = inp.parentElement.firstElementChild; if (sw) sw.style.setProperty('--c', inp.value);
                this.drawCharts();
            };
            inp.addEventListener('input', set); inp.addEventListener('change', () => { set(); this.recordDrawingState() });
        });
        tb.querySelectorAll('select').forEach(sel => sel.addEventListener('change', () => {
            if (sel.dataset.k === 'w') { if (brush) (d.style || (d.style = {})).w = +sel.value; else d.w = +sel.value }
            else d.dash = sel.value || undefined;
            save();
        }));
        tb.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
            if (b.dataset.a === 'nofill') { d.noFill = !d.noFill; b.classList.toggle('on', !d.noFill); save(); return }
            this._dsAction(d, b.dataset.a);
        }));
    }
    // ---- Magnet --------------------------------------------------------------------
    // Snaps drawing points to the bar's open/high/low/close. Weak: only when the
    // pointer is near one of them. Strong: always the nearest. Holding Ctrl (Cmd on
    // Mac) flips the magnet while held. Every drawing point uses it: the line, channel,
    // pitchfork and text tools, emoji, and the older line and Fibonacci tools.
    static get MAGNET_WEAK_PX() { return 14 }
    magnetMode() {
        const m = this._magnet; if (!m) return 'off';
        if (this._ctrlHeld) return m.on ? 'off' : m.mode;
        return m.on ? m.mode : 'off';
    }
    // Snap for bar index i at pointer y. Returns { p, x, y } or null.
    _magnetSnapIdx(i, y, v) {
        this._magnetHint = null;
        const mode = this.magnetMode(), c = this.stockData[i];
        if (mode === 'off' || !c) return null;
        let best = null;
        [c.open, c.high, c.low, c.close].forEach(p => { const py = v.pToY(p), d = Math.abs(py - y); if (!best || d < best.d) best = { p, d, y: py } });
        if (mode === 'weak' && best.d > StockChart.MAGNET_WEAK_PX) return null;
        this._magnetHint = { x: v.idxToX(i), y: best.y };
        return { p: best.p, x: this._magnetHint.x, y: best.y };
    }
    _magnetSnapXY(x, y) {
        const v = this._ltView(), i = Math.round(v.xToIdx(x)), s = this._magnetSnapIdx(i, y, v);
        return s ? { x: s.x, y: s.y, price: s.p } : null;
    }
    setupMagnet() {
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        const bar = root && (root.querySelector('.sc-sidebar') || root.querySelector('.sc-chart-controls-overlay'));
        if (!area || !bar) return;
        let saved = {}; try { saved = JSON.parse(localStorage.getItem('sc-magnet') || '{}') || {} } catch (e) { }
        this._magnet = { on: !!saved.on, mode: saved.mode === 'strong' ? 'strong' : 'weak' };
        const save = () => { try { localStorage.setItem('sc-magnet', JSON.stringify(this._magnet)) } catch (e) { } };
        // The older line + Fibonacci tools snap through the same magnet.
        this.findSnappingPoint = (x, y) => this._magnetSnapXY(x, y);
        this.findPriceSnappingPoint = (x, y) => this._magnetSnapXY(x, y);

        const icon = (strong) => `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M8 4.5h4.5v8.5a1.5 1.5 0 0 0 3 0V4.5H20V13a6 6 0 0 1-12 0z"/><path d="M8 8.5h4.5M15.5 8.5H20"/>${strong ? '<path d="m10.5 21.5-1.2 2.5M14 21.5V24M17.5 21.5l1.2 2.5" stroke-linecap="round"/>' : ''}</svg>`;
        const btn = document.createElement('button');
        btn.className = 'sc-overlay-button sc-lt-button sc-magnet-button';
        btn.title = 'Magnet (hold Ctrl to flip)';
        const sep = document.createElement('span'); sep.className = 'sc-bar-sep';
        const measure = bar.querySelector('.sc-measure-button');
        if (measure) { measure.insertAdjacentElement('afterend', sep); sep.insertAdjacentElement('afterend', btn) } else { bar.appendChild(sep); bar.appendChild(btn) }
        const menu = document.createElement('div');
        menu.className = 'sc-cursor-menu sc-lt-menu sc-magnet-menu';
        menu.innerHTML = '<div class="sc-lt-group">Magnet</div>'
            + `<button type="button" class="sc-cursor-option" data-mag="weak">${icon(false)}<span>Weak magnet</span></button>`
            + `<button type="button" class="sc-cursor-option" data-mag="strong">${icon(true)}<span>Strong magnet</span></button>`
            + '<div class="sc-magnet-tip">Weak snaps when you are near a bar\'s open, high, low or close. Strong always snaps. Hold Ctrl to flip it.</div>';
        area.appendChild(menu);
        const paint = () => {
            btn.innerHTML = icon(this._magnet.mode === 'strong') + '<span class="sc-cursor-chev"></span>';
            btn.classList.toggle('active', this.magnetMode() !== 'off');
            menu.querySelectorAll('[data-mag]').forEach(o => o.classList.toggle('selected', o.dataset.mag === this._magnet.mode && this._magnet.on));
        };
        // Ctrl / Cmd state, from keys and from the pointer events themselves.
        const setHeld = (v) => { if (this._ctrlHeld !== v) { this._ctrlHeld = v; paint() } };
        window.addEventListener('keydown', (e) => { if (e.key === 'Control' || e.key === 'Meta') setHeld(true) });
        window.addEventListener('keyup', (e) => { if (e.key === 'Control' || e.key === 'Meta') setHeld(false) });
        window.addEventListener('blur', () => setHeld(false));
        ['mousemove', 'mousedown'].forEach(t => document.addEventListener(t, (e) => setHeld(!!(e.ctrlKey || e.metaKey)), true));
        const close = () => { menu.classList.remove('active'); btn.classList.remove('open') };
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const r = btn.getBoundingClientRect();
            if (e.clientX >= r.right - 11 || menu.classList.contains('active')) {
                const open = !menu.classList.contains('active');
                if (this.closeLineMenu) this.closeLineMenu();
                if (!open) return close();
                const a = area.getBoundingClientRect();
                menu.style.left = '4px'; menu.classList.add('active'); btn.classList.add('open');
                menu.style.top = Math.max(4, Math.min(r.top - a.top, area.clientHeight - menu.offsetHeight - 4)) + 'px';
                return;
            }
            this._magnet.on = !this._magnet.on; save(); paint();
        });
        menu.addEventListener('mousedown', (e) => e.stopPropagation());
        menu.querySelectorAll('[data-mag]').forEach(o => o.addEventListener('click', () => { this._magnet.mode = o.dataset.mag; this._magnet.on = true; save(); paint(); close() }));
        document.addEventListener('mousedown', (e) => { if (!menu.contains(e.target) && !btn.contains(e.target)) close() }, true);
        paint();
    }
    // ---- Remove drawings / indicators (trash) -------------------------------------
    // Trash icon removes every drawing; its chevron opens a menu that also removes
    // indicators, or both. Removing drawings is undoable with Ctrl+Z.
    countDrawings() {
        const n = (a) => Array.isArray(a) ? a.length : 0;
        return n(this.lines) + n(this.textAnnotations) + n(this.emoticons) + n(this.fibonacciRetracements) + n(this.drawingShapes)
            + n(this.arrows) + n(this.rectangles) + n(this.circles) + n(this.lineTools)
            + (this.priceLines || []).filter(l => l.kind === 'line').length;
    }
    countIndicators() {
        let n = 0;
        // Volume bars aren't counted: they have their own toggle and people don't think of them as an indicator.
        for (const k in this.indicators) if (k !== 'volume' && this.indicators[k] && this.indicators[k].enabled) n++;
        return n + (this.movingAverages || []).filter(m => m.enabled).length;
    }
    removeAllDrawings() {
        if (this._ntFinishEdit) this._ntFinishEdit();
        if (this._lt) { this._lt.sel = this._lt.hover = null; if (this._lt.tool) this.deactivateLineTool() }
        this.clearAllDrawings();
    }
    removeAllIndicators() {
        for (const k in this.indicators) {
            const ind = this.indicators[k];
            if (k === 'volume' || !ind || !ind.enabled) continue; // volume bars stay (own toggle)
            ind.enabled = false;
            const cb = this.indicatorsDropdown && this.indicatorsDropdown.querySelector(`input[type="checkbox"][value="${k}"]`);
            if (cb) cb.checked = false;
        }
        (this.movingAverages || []).forEach(m => {
            if (!m.enabled) return;
            m.enabled = false;
            const cb = this.container.querySelector(`.sc-moving-averages-list input[type="checkbox"][value="${m.id}"]`);
            if (cb) cb.checked = false;
        });
        this.calculateIndicators();
        this.drawCharts();
        this.saveSettings();
    }
    setupRemoveMenu() {
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        const bar = root && (root.querySelector('.sc-sidebar') || root.querySelector('.sc-chart-controls-overlay'));
        if (!area || !bar) return;
        const trash = '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h16M11 8V5.5h6V8M8 8l1 15h10l1-15M12 12v7M16 12v7"/></svg>';
        const btn = document.createElement('button');
        btn.className = 'sc-overlay-button sc-lt-button sc-remove-button';
        btn.title = 'Remove drawings';
        btn.innerHTML = trash + '<span class="sc-cursor-chev"></span>';
        const sep = document.createElement('span'); sep.className = 'sc-bar-sep';
        const magnet = bar.querySelector('.sc-magnet-button');
        if (magnet) { magnet.insertAdjacentElement('afterend', sep); sep.insertAdjacentElement('afterend', btn) } else { bar.appendChild(sep); bar.appendChild(btn) }
        const menu = document.createElement('div');
        menu.className = 'sc-cursor-menu sc-lt-menu sc-remove-menu';
        area.appendChild(menu);
        const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
        const build = () => {
            const d = this.countDrawings(), i = this.countIndicators();
            menu.innerHTML = `<button type="button" class="sc-cursor-option" data-rm="d"${d ? '' : ' disabled'}><span>Remove ${plural(d, 'drawing')}</span></button>`
                + `<button type="button" class="sc-cursor-option" data-rm="i"${i ? '' : ' disabled'}><span>Remove ${plural(i, 'indicator')}</span></button>`
                + `<button type="button" class="sc-cursor-option" data-rm="b"${d || i ? '' : ' disabled'}><span>Remove ${plural(d, 'drawing')} &amp; ${plural(i, 'indicator')}</span></button>`;
        };
        const close = () => { menu.classList.remove('active'); btn.classList.remove('open') };
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const r = btn.getBoundingClientRect();
            if (e.clientX >= r.right - 11 || menu.classList.contains('active')) {
                const open = !menu.classList.contains('active');
                if (this.closeLineMenu) this.closeLineMenu();
                if (!open) return close();
                build();
                const a = area.getBoundingClientRect();
                menu.style.left = '4px'; menu.classList.add('active'); btn.classList.add('open');
                menu.style.top = Math.max(4, Math.min(r.top - a.top, area.clientHeight - menu.offsetHeight - 4)) + 'px';
                return;
            }
            this.removeAllDrawings();
        });
        menu.addEventListener('mousedown', (e) => e.stopPropagation());
        menu.addEventListener('click', (e) => {
            const b = e.target.closest('[data-rm]'); if (!b || b.disabled) return;
            const k = b.dataset.rm;
            if (k === 'd' || k === 'b') this.removeAllDrawings();
            if (k === 'i' || k === 'b') this.removeAllIndicators();
            close();
        });
        document.addEventListener('mousedown', (e) => { if (!menu.contains(e.target) && !btn.contains(e.target)) close() }, true);
    }
    // ---- Collapsible tool strip ---------------------------------------------------------
    // An arrow at the bottom of the strip tucks it down to a thin edge (TradingView does
    // the same). The choice is remembered. The class goes on the chart box and, when the
    // strip has been moved outside the chart, on its wrapper too.
    _setupStripCollapse() {
        if (!this.sideLayout) return;
        const root = this.chartContainer, side = root && root.querySelector('.sc-sidebar');
        if (!side) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sc-overlay-button sc-strip-toggle';
        side.appendChild(btn);
        let collapsed = false;
        try { collapsed = localStorage.getItem('sc-strip-collapsed') === '1' } catch (e) { }
        const apply = (save) => {
            root.classList.toggle('sc-strip-collapsed', collapsed);
            const wrap = side.parentNode && side.parentNode.classList && side.parentNode.classList.contains('sc-ext-strip') ? side.parentNode : null;
            if (wrap) wrap.classList.toggle('sc-strip-collapsed', collapsed);
            btn.title = collapsed ? 'Show drawing tools' : 'Hide drawing tools';
            // Same bold chevron in the same spot both ways: left = hide, right = show.
            btn.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" d="'
                + (collapsed ? 'M6 3.5 10.5 8 6 12.5' : 'M10 3.5 5.5 8 10 12.5') + '"/></svg>';
            if (save) { try { localStorage.setItem('sc-strip-collapsed', collapsed ? '1' : '0') } catch (e) { } }
            // The chart gets wider or narrower; let it re-measure.
            requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
        };
        btn.addEventListener('click', (e) => { e.stopPropagation(); collapsed = !collapsed; if (this.closeLineMenu) this.closeLineMenu(); apply(true) });
        // Collapsed, the whole thin bar is a target for bringing the tools back.
        side.addEventListener('click', (e) => { if (collapsed && !btn.contains(e.target)) { collapsed = false; apply(true) } });
        this._applyStripCollapse = () => apply(false);
        apply(false);
    }
    // ---- Tool strip outside the chart ---------------------------------------------------
    // window.S8_CHART_TOOLBAR_HOST (a CSS selector) moves the left tool strip out of the
    // chart to the front of that element, so other panels (the side timeframe charts) sit
    // between the tools and the chart, as on TradingView. Fullscreen takes the strip back
    // inside the chart, and a rebuilt chart replaces the strip it left behind.
    _mountExternalStrip() {
        const sel = window.S8_CHART_TOOLBAR_HOST;
        if (!sel || !this.sideLayout) return;
        const root = this.chartContainer, host = document.querySelector(sel);
        const side = root && root.querySelector('.sc-sidebar'), area = root && root.querySelector('.sc-price-chart-container');
        if (!host || !side || !area) return;
        Array.from(host.children).forEach(n => { if (n.classList.contains('sc-ext-strip')) n.remove() });
        const wrap = document.createElement('div');
        wrap.className = 'sc-layout-side sc-ext-strip';
        const out = () => { if (side.parentNode === wrap) return; wrap.appendChild(side); if (!wrap.isConnected) host.insertBefore(wrap, host.firstChild); root.classList.add('sc-side-external') };
        // Strip menus live in the chart area and open at its left edge. With the strip outside
        // (other panels in between) the one that just opened floats beside its button instead.
        const MENUS = '.sc-cursor-menu, .sc-emoticon-panel, .sc-text-settings-panel, .sc-drawing-tools-panel';
        const unfloat = () => area.querySelectorAll(MENUS).forEach(m => { if (m.classList.contains('sc-menu-floating')) { m.classList.remove('sc-menu-floating'); m.style.maxHeight = '' } });
        const float = (btn) => {
            if (side.parentNode !== wrap) return unfloat();
            const r = btn.getBoundingClientRect(), w = wrap.getBoundingClientRect();
            area.querySelectorAll(MENUS).forEach(m => {
                if (getComputedStyle(m).display === 'none') return;
                // Kept within the chart row; taller menus scroll.
                m.classList.add('sc-menu-floating');
                m.style.maxHeight = Math.max(120, w.height - 8) + 'px';
                m.style.left = (w.right + 6) + 'px';
                m.style.top = Math.max(w.top + 4, Math.min(r.top, w.bottom - m.offsetHeight - 4)) + 'px';
            });
        };
        // Capture: the menu buttons stop their clicks from bubbling.
        wrap.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) requestAnimationFrame(() => float(b)) }, true);
        const back = () => { if (side.parentNode === root) return; root.insertBefore(side, area); root.classList.remove('sc-side-external'); unfloat() };
        out();
        if (this._applyStripCollapse) this._applyStripCollapse();
        new MutationObserver(() => {
            if (!root.isConnected) { wrap.remove(); return }
            wrap.classList.toggle('dark-mode', root.classList.contains('dark-mode'));
            if (root.classList.contains('fullscreen')) back(); else out();
        }).observe(root, { attributes: true, attributeFilter: ['class'] });
        wrap.classList.toggle('dark-mode', root.classList.contains('dark-mode'));
        this._extStrip = wrap;
    }
    // ---- s8 logo -------------------------------------------------------------------
    // The s8 mark (favicon) sits in the bottom-left of the price pane, like the
    // TradingView logo. options.logo: false hides it; { src, href } swaps it.
    setupChartLogo() {
        const o = this.options.logo;
        if (o === false) return;
        if (o === undefined && Array.isArray(window.S8_CHART_TOOLBAR) && !StockChart._pageWantsSide(this.container && this.container.id)) return;
        const area = this.chartContainer && this.chartContainer.querySelector('.sc-price-chart-container');
        if (!area) return;
        const cfg = Object.assign({ src: StockChart.ASSET_BASE + 's8-logo.svg', href: 'https://simul8or.com/' }, typeof o === 'object' ? o : {});
        const a = document.createElement('a');
        a.className = 'sc-chart-logo'; a.href = cfg.href; a.target = '_blank'; a.rel = 'noopener'; a.title = 'simul8or'; a.setAttribute('aria-label', 'simul8or');
        a.innerHTML = `<img src="${cfg.src}" alt="" draggable="false">`;
        area.appendChild(a);
        this.chartContainer.classList.add('sc-has-logo');
        this._chartLogo = a;
        this._syncChartLogo = () => {
            const cr = this.priceCanvas.getBoundingClientRect(), ar = area.getBoundingClientRect();
            const size = a.offsetHeight || 30;
            a.style.left = (cr.left - ar.left + this.config.padding.left + 10) + 'px';
            a.style.top = (cr.top - ar.top + this.config.padding.top + this.getPriceChartHeight() - size - 10) + 'px';
        };
        this._syncChartLogo();
    }
    // ---- Emoji scale + rotate ------------------------------------------------------
    // A selected emoji gets a box with four corner handles (drag to resize, centre
    // stays put) and a handle above it (drag to rotate; Shift snaps to 15 degrees).
    // The size and angle live on the emoticon, so undo, eraser and dragging all work.
    static get EMOJI_START_SIZE() { return 64 }
    _emoticonFrame(em) {
        const half = em.size / 2 + 6, a = em.angle || 0, cos = Math.cos(a), sin = Math.sin(a);
        const pt = (lx, ly) => ({ x: em.screenX + lx * cos - ly * sin, y: em.screenY + lx * sin + ly * cos });
        return {
            half, a,
            corners: [pt(-half, -half), pt(half, -half), pt(half, half), pt(-half, half)],
            top: pt(0, -half), rot: pt(0, -half - 24)
        };
    }
    _drawEmoticonItem(ctx, em, x, y, selected) {
        const a = em.angle || 0;
        if (a) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); this._drawEmoji(ctx, em.emoji, 0, 0, em.size); ctx.restore() }
        else this._drawEmoji(ctx, em.emoji, x, y, em.size);
        if (!selected) return;
        const f = this._emoticonFrame(em), blue = '#2962ff', dark = !!this.config.darkMode;
        ctx.save();
        ctx.strokeStyle = blue; ctx.lineWidth = 1;
        ctx.beginPath(); f.corners.forEach((c, i) => i ? ctx.lineTo(c.x, c.y) : ctx.moveTo(c.x, c.y)); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(f.top.x, f.top.y); ctx.lineTo(f.rot.x, f.rot.y); ctx.stroke();
        const dot = (p, r) => { ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fillStyle = dark ? '#131722' : '#fff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = blue; ctx.stroke() };
        f.corners.forEach(c => dot(c, 4.5));
        dot(f.rot, 5.5);
        // Small circular arrow inside the rotate handle.
        ctx.beginPath(); ctx.arc(f.rot.x, f.rot.y, 2.4, -Math.PI * 0.9, Math.PI * 0.6); ctx.lineWidth = 1.2; ctx.stroke();
        ctx.restore();
    }
    _emoticonHandleAt(x, y) {
        const i = this.selectedEmoticonIndex, em = i !== null && i !== undefined ? this.emoticons[i] : null;
        if (!em || em.screenX == null) return null;
        const f = this._emoticonFrame(em);
        if (Math.hypot(x - f.rot.x, y - f.rot.y) <= 9) return { i, kind: 'rotate' };
        for (let k = 0; k < 4; k++) if (Math.hypot(x - f.corners[k].x, y - f.corners[k].y) <= 8) return { i, kind: 'scale', corner: k };
        return null;
    }
    setupEmojiTransform() {
        const root = this.chartContainer, area = root && root.querySelector('.sc-price-chart-container');
        if (!area) return;
        const local = (e) => { const r = this.priceCanvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } };
        let gesture = null;
        const cursorFor = (h) => {
            if (!h) return '';
            if (h.kind === 'rotate') return 'sc-emo-rotate';
            // Pick the resize arrow that matches the corner's on-screen direction.
            const em = this.emoticons[h.i], ang = ((h.corner * 90 + 45 + (em.angle || 0) * 180 / Math.PI) % 180 + 180) % 180;
            return ang < 90 ? 'sc-emo-nwse' : 'sc-emo-nesw';
        };
        const setCursor = (cls) => {
            root.classList.remove('sc-emo-rotate', 'sc-emo-nwse', 'sc-emo-nesw');
            if (cls) root.classList.add(cls, 'sc-drawing-on');
        };
        area.addEventListener('mousedown', (e) => {
            if (e.target !== this.priceCanvas || e.button !== 0 || this.cursorMode === 'eraser') return;
            const p = local(e), h = this._emoticonHandleAt(p.x, p.y);
            if (!h) return;
            e.preventDefault(); e.stopPropagation();
            const em = this.emoticons[h.i];
            gesture = { ...h, startAngle: em.angle || 0, grab: Math.atan2(p.y - em.screenY, p.x - em.screenX) };
            this._emoGesture = gesture;
            setCursor(cursorFor(h));
        }, true);
        area.addEventListener('mousemove', (e) => {
            if (gesture || e.target !== this.priceCanvas) return;
            const p = local(e), h = this._emoticonHandleAt(p.x, p.y);
            setCursor(cursorFor(h));
        }, true);
        document.addEventListener('mousemove', (e) => {
            if (!gesture) return;
            const em = this.emoticons[gesture.i]; if (!em) { gesture = null; return }
            const p = local(e);
            if (gesture.kind === 'scale') {
                // Corner distance from the centre is half the box diagonal.
                const d = Math.hypot(p.x - em.screenX, p.y - em.screenY);
                em.size = Math.max(12, Math.min(480, Math.round((d / Math.SQRT2 - 6) * 2)));
            } else {
                let a = gesture.startAngle + Math.atan2(p.y - em.screenY, p.x - em.screenX) - gesture.grab;
                if (e.shiftKey) a = Math.round(a / (Math.PI / 12)) * (Math.PI / 12);
                a = Math.atan2(Math.sin(a), Math.cos(a));
                em.angle = Math.abs(a) < 0.03 ? 0 : a;
            }
            this.drawCharts();
        });
        document.addEventListener('mouseup', () => { if (gesture) { gesture = null; this._emoGesture = null; setCursor(''); this.drawCharts() } });
    }
    setupEmojiPicker() {
        this.setupEmojiTransform();
        const panel = this.emoticonPanel, data = window.StockChartEmojiData;
        if (!panel || !data) return;
        if (!this.selectedEmoticonType || /^\?+$/.test(this.selectedEmoticonType)) this.selectedEmoticonType = '\u{1F600}';
        const s = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
        const cats = [
            ['recent', 'Recently used', s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')],
            ['people', 'Smiles & People', s('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.9 2 5.1 2 7 0"/><path d="M9 9.5h.01M15 9.5h.01" stroke-width="2.2"/>')],
            ['nature', 'Animals & Nature', s('<path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14z"/><path d="m5 19 8-8"/>')],
            ['food', 'Food & Drink', s('<path d="M5 11h14M6 11a6 6 0 0 1 12 0M5 15h14M6 15v1a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-1"/>')],
            ['activity', 'Activity', s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.6 5.6c3 3.4 3 9.4 0 12.8M18.4 5.6c-3 3.4-3 9.4 0 12.8"/>')],
            ['travel', 'Travel & Places', s('<path d="M14.5 15.5 8.5 9.5C10.5 5 14 3 20.5 3.5 21 10 19 13.5 14.5 15.5z"/><path d="M8.5 9.5H5l2.5-3h4M14.5 15.5V19l3-2.5v-4M6.5 17.5 4 20"/><circle cx="15.5" cy="8.5" r="1.3"/>')],
            ['objects', 'Objects', s('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>')],
            ['symbols', 'Symbols', s('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>')],
            ['flags', 'Flags', s('<path d="M5 21V4h11l-2 4 2 4H5"/>')]
        ];
        const base = this.emojiImageBase();
        const cell = (e) => `<button type="button" class="sc-emoji" data-emoticon="${e}" aria-label="${e}">${base ? `<img src="${StockChart.emojiImageUrl(e, base)}" alt="${e}" loading="lazy" draggable="false" onerror="this.replaceWith(document.createTextNode(this.alt))">` : e}</button>`;
        const loadRecent = () => { try { const r = JSON.parse(localStorage.getItem('sc-emoji-recent') || '[]'); return Array.isArray(r) ? r.slice(0, 18) : [] } catch (e) { return [] } };
        const recentHtml = () => { const r = loadRecent(); return r.length ? r.map(cell).join('') : '<div class="sc-emoji-empty">Emoji you place show up here</div>' };
        let built = false, body, tabs;
        const build = () => {
            if (built) return; built = true;
            panel.classList.add('sc-emoji-picker');
            panel.querySelectorAll('.sc-emoticon-header, .sc-emoticon-categories').forEach(n => n.remove());
            const wrap = document.createElement('div');
            wrap.innerHTML = `<div class="sc-emoji-tabs">${cats.map(([k, label, icon]) => `<button type="button" class="sc-emoji-tab" data-cat="${k}" title="${label}">${icon}</button>`).join('')}</div>`
                + `<div class="sc-emoji-body">${cats.map(([k, label]) => `<div class="sc-emoji-section" data-cat="${k}"><div class="sc-emoji-title">${label}</div><div class="sc-emoji-grid">${k === 'recent' ? recentHtml() : data[k].split(' ').map(cell).join('')}</div></div>`).join('')}</div>`;
            panel.insertBefore(wrap.firstChild, panel.firstChild);
            panel.insertBefore(wrap.firstChild, panel.children[1]);
            tabs = panel.querySelector('.sc-emoji-tabs'); body = panel.querySelector('.sc-emoji-body');
            const setTab = (k) => tabs.querySelectorAll('.sc-emoji-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === k));
            setTab('recent');
            tabs.addEventListener('click', (e) => {
                const t = e.target.closest('.sc-emoji-tab'); if (!t) return;
                const sec = body.querySelector(`.sc-emoji-section[data-cat="${t.dataset.cat}"]`);
                body.scrollTop = sec ? sec.offsetTop : 0; setTab(t.dataset.cat);
            });
            body.addEventListener('scroll', () => {
                let cur = 'recent';
                body.querySelectorAll('.sc-emoji-section').forEach(sec => { if (sec.offsetTop <= body.scrollTop + 12) cur = sec.dataset.cat });
                if (body.scrollTop + body.clientHeight >= body.scrollHeight - 2) cur = 'flags';
                setTab(cur);
            });
            body.addEventListener('click', (e) => {
                const b = e.target.closest('[data-emoticon]'); if (!b) return;
                this.selectedEmoticonType = b.dataset.emoticon;
                // Pick, then click the chart to place it (the panel gets out of the way).
                panel.style.display = 'none';
            });
        };
        this._emojiRecentRefresh = () => {
            if (!built) return;
            const g = body.querySelector('.sc-emoji-section[data-cat="recent"] .sc-emoji-grid');
            if (g) g.innerHTML = recentHtml();
        };
        const origActivate = this.activateEmoticonMode.bind(this);
        this.activateEmoticonMode = () => {
            build();
            origActivate();
            const area = panel.parentElement;
            if (body && area) body.style.maxHeight = Math.max(160, Math.min(440, area.clientHeight - 150)) + 'px';
            if (body) body.scrollTop = 0; // reopen on Recently used
            if (area) {
                const btn = this.emoticonToolButton, a = area.getBoundingClientRect(), r = btn.getBoundingClientRect();
                if (this.sideLayout) panel.style.top = Math.max(4, Math.min(r.top - a.top, area.clientHeight - panel.offsetHeight - 4)) + 'px';
            }
        };
        const origAdd = this.addEmoticon.bind(this);
        this.addEmoticon = (x, y) => {
            const snap = this._magnetSnapXY ? this._magnetSnapXY(x, y) : null;
            if (snap) { x = snap.x; y = snap.y }
            const before = this.emoticons.length, r = origAdd(x, y);
            if (this.emoticons.length > before) {
                const e = this.emoticons[this.emoticons.length - 1].emoji;
                try { const list = loadRecent().filter(v => v !== e); list.unshift(e); localStorage.setItem('sc-emoji-recent', JSON.stringify(list.slice(0, 18))) } catch (err) { }
                this._emojiRecentRefresh();
                const placed = this.emoticons[this.emoticons.length - 1];
                placed.size = StockChart.EMOJI_START_SIZE; placed.angle = 0;
                this.deactivateEmoticonMode();
                this.selectedEmoticonIndex = this.emoticons.length - 1;
                this.drawCharts();
            }
            return r;
        };
    }
    updateTimeframeButtonLabel() {
        if (!this.sideLayout) return;
        const label = this.container.querySelector('.sc-tf-label');
        if (!label) return;
        const all = this.options.availableTimeframes || this.config.timeframesToDisplay || this.defaultTimeframes || [];
        const tf = all.find(t => t.value === this.timeframe);
        label.textContent = tf ? tf.label : (this.timeframe || '');
    }
    createDOM() {
        this.container.innerHTML = `
                        <div class="sc-chart-container">
                          <div class="sc-price-chart-container">
                            <canvas class="sc-price-chart"></canvas>
                            <div class="sc-vertical-scale-area"></div>
                            <div class="sc-chart-controls-overlay">
                                <button class="sc-overlay-button sc-chart-type-button" title="Chart style">
                                  ${this.chartTypeIcon(this.config.chartType)}
                                </button>
                                <button class="sc-overlay-button sc-timeframe-button" title="Change timeframe">
                                      <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7H11V13L16.2,16.2L17,14.9L12.5,12.2V7Z"/>
                                      </svg>
                                </button>
                                <button class="sc-overlay-button sc-line-tool-button d-none" title="Draw lines">
                                  <svg viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-width="2" d="M5,19 L19,5" />
                                    <circle cx="5" cy="19" r="2" fill="currentColor" />
                                    <circle cx="19" cy="5" r="2" fill="currentColor" />
                                  </svg>
                                </button>
                                <button class="sc-overlay-button sc-text-tool-button" title="Add text">
                                  <svg viewBox="0 0 24 24">
                                    <text x="12" y="18" text-anchor="middle" font-family="Arial" font-size="20" font-weight="bold">T</text>
                                  </svg>
                                </button>
                                <button class="sc-overlay-button sc-emoticon-tool-button" title="Add emoticon">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                                  <circle cx="9" cy="10" r="1.3" fill="currentColor"/>
                                  <circle cx="15" cy="10" r="1.3" fill="currentColor"/>
                                  <path d="M8 14c1.2 1.5 3 2.3 4 2.3s2.8-.8 4-2.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
                                </svg>

                                </button>
                                <button class="sc-overlay-button sc-fibonacci-tool-button" title="Fibonacci retracement (Alt+F)">

                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                  <!-- lines -->
                                  <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                    <line x1="3" y1="6"  x2="21" y2="6"/>
                                    <line x1="3" y1="12" x2="21" y2="12"/>
                                    <line x1="3" y1="18" x2="21" y2="18"/>
                                  </g>
                                  <!-- knobs (drawn after so they sit on top) -->
                                  <g fill="currentColor">
                                    <circle cx="8"  cy="6"  r="2.2"/>
                                    <circle cx="5.5" cy="12" r="2.2"/>
                                    <circle cx="7"  cy="18" r="2.2"/>
                                  </g>
                                </svg>
                                </button>
                                <button class="sc-overlay-button sc-measure-button" title="Measure (Alt+M, or Shift+drag)">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2.5" y="8" width="19" height="8" rx="1.5"/>
                                    <path d="M6.5 8v3M10 8v4.5M13.5 8v3M17 8v4.5"/>
                                  </svg>
                                </button>
                                <button class="sc-overlay-button sc-drawing-tools-button" title="Drawing tools (Alt+T: trend line)">


    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
     xmlns="http://www.w3.org/2000/svg">
  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
        stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
  <path d="M20.71 7.04a1 1 0 0 0 0-1.42l-2.34-2.34a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
        stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
</svg>



                                </button>
                                <button class="sc-overlay-button sc-indicators-button" title="Technical Indicators (Alt+I)">
                                  <svg viewBox="0 0 24 24">
                                    <text x="12" y="19" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">TA</text>
                                  </svg>
                                </button>
                                <button class="sc-overlay-button sc-dark-mode-button" title="Toggle dark/light mode">
                                  <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9
                                    M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2
                                    M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7
                                    M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17
                                    M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7
                                    M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17
                                    M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" />
                                  </svg>
                                </button>
                                <button class="sc-overlay-button sc-maximize-button" title="Toggle fullscreen">
                                  <svg viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                      d="M5,5H10V7H7V10H5V5
                                         M14,5H19V10H17V7H14V5
                                         M17,14H19V19H14V17H17V14
                                         M10,17V19H5V14H7V17H10Z"/>
                                  </svg>
                                </button>
                                <button class="sc-overlay-button sc-fit-view-button" title="Fit to View (Alt+R)">
                                  <svg viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M21 3H3v2h18V3zm0 16H3v2h18v-2zM12 6l-3 4h2v4H9l3 4 3-4h-2V10h2l-3-4z"/>
                                  </svg>
                                </button>
                                <button title="Copy Chart to Clipboard" class="sc-overlay-button sc-camera-button">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                      <circle cx="12" cy="13" r="4"/>
                                  </svg>
                                </button>
                            </div>
                            <div class="sc-drawing-tools-panel" style="display: none;">
                                <div class="sc-drawing-tools-header">
                                    <span>Drawing Tools</span>
                                </div>
                                <div class="sc-drawing-tools-grid">
                                    <div class="sc-drawing-tool-option sc-drawing-tool-line selected" data-tool="line" title="Line">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M5 12l14 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                        </svg>
                                        <span>Line</span>
                                    </div>
                                    <div class="sc-drawing-tool-option sc-drawing-tool-arrow" data-tool="arrow" title="Arrow">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M5 12l14 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                            <path d="M15 8l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <span>Arrow</span>
                                    </div>
                                    <div class="sc-drawing-tool-option sc-drawing-tool-rectangle" data-tool="rectangle" title="Rectangle">
                                        <svg viewBox="0 0 24 24">
                                            <rect x="6" y="8" width="12" height="8" fill="none" stroke="currentColor" stroke-width="2"/>
                                        </svg>
                                        <span>Rectangle</span>
                                    </div>
                                    <div class="sc-drawing-tool-option sc-drawing-tool-circle" data-tool="circle" title="Circle">
                                        <svg viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
                                        </svg>
                                        <span>Circle</span>
                                    </div>
                                    <div class="sc-drawing-tool-option sc-drawing-tool-hline" data-tool="hline" title="Horizontal line (Alt+H)">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                            <circle cx="12" cy="12" r="2" fill="currentColor"/>
                                        </svg>
                                        <span>H-Line</span>
                                    </div>
                                    <div class="sc-drawing-tool-option sc-drawing-tool-undo" data-action="undo" title="Undo (Ctrl+Z)">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M9 14L4 9l5-5M4 9h10a5 5 0 0 1 0 10h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <span>Undo</span>
                                    </div>
                                    <div class="sc-drawing-tool-option sc-drawing-tool-clear" data-action="clear" title="Clear all drawings">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <span>Clear all</span>
                                    </div>
                                </div>
                            </div>
                            <div class="sc-emoticon-panel" style="display: none;">
                                <div class="sc-emoticon-header">
                                    <span>Emoticons</span>
                                </div>
                                <div class="sc-emoticon-categories">
                                    <div class="sc-emoticon-category">
                                        <div class="sc-category-title">Trading</div>
                                        <div class="sc-emoticon-grid">
                                            <span class="sc-emoticon-option" data-emoticon="📈">📈</span>
                                            <span class="sc-emoticon-option" data-emoticon="📉">📉</span>
                                            <span class="sc-emoticon-option" data-emoticon="💰">💰</span>
                                            <span class="sc-emoticon-option" data-emoticon="💸">💸</span>
                                            <span class="sc-emoticon-option" data-emoticon="🚀">🚀</span>
                                            <span class="sc-emoticon-option" data-emoticon="🔥">🔥</span>
                                            <span class="sc-emoticon-option" data-emoticon="💎">💎</span>
                                            <span class="sc-emoticon-option" data-emoticon="⚡">⚡</span>
                                            <span class="sc-emoticon-option" data-emoticon="🎯">🎯</span>
                                            <span class="sc-emoticon-option" data-emoticon="💪">💪</span>
                                            <span class="sc-emoticon-option" data-emoticon="👀">👀</span>
                                            <span class="sc-emoticon-option" data-emoticon="🤔">🤔</span>
                                        </div>
                                    </div>
                                    <div class="sc-emoticon-category">
                                        <div class="sc-category-title">General</div>
                                        <div class="sc-emoticon-grid">
                                            <span class="sc-emoticon-option" data-emoticon="😀">😀</span>
                                            <span class="sc-emoticon-option" data-emoticon="😊">😊</span>
                                            <span class="sc-emoticon-option" data-emoticon="😎">😎</span>
                                            <span class="sc-emoticon-option" data-emoticon="😢">😢</span>
                                            <span class="sc-emoticon-option" data-emoticon="😱">😱</span>
                                            <span class="sc-emoticon-option" data-emoticon="🤯">🤯</span>
                                            <span class="sc-emoticon-option" data-emoticon="👍">👍</span>
                                            <span class="sc-emoticon-option" data-emoticon="👎">👎</span>
                                            <span class="sc-emoticon-option" data-emoticon="✅">✅</span>
                                            <span class="sc-emoticon-option" data-emoticon="❌">❌</span>
                                            <span class="sc-emoticon-option" data-emoticon="⚠️">⚠️</span>
                                            <span class="sc-emoticon-option" data-emoticon="🔔">🔔</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="sc-emoticon-controls">
                                    <label>Size:</label>
                                    <input type="range" class="sc-emoticon-size-slider" min="16" max="64" value="24">
                                    <span class="sc-emoticon-size-display">24px</span>
                                </div>
                            </div>
                            <div class="sc-text-settings-panel" style="display: none;">
                                <div class="sc-text-controls">
                                    <label>Size:</label>
                                    <input type="range" class="sc-font-size-slider" min="8" max="32" value="12">
                                    <span class="sc-font-size-display">12px</span>
                                </div>
                                <div class="sc-text-controls">
                                    <label>Font:</label>
                                    <select class="sc-font-family-select">
                                        <option value="Arial">Arial</option>
                                        <option value="Times New Roman">Times</option>
                                        <option value="monospace">Mono</option>
                                        <option value="serif">Serif</option>
                                    </select>
                                </div>
                                <div class="sc-text-controls">
                                    <label>Color:</label>
                                    <input type="color" class="sc-text-color-picker" value="#ffffff">
                                </div>
                                <div class="sc-text-controls">
                                    <button class="sc-text-bold-button">B</button>
                                    <button class="sc-text-apply-button">Apply to Selected</button>
                                </div>
                            </div>
                            <div class="sc-chart-info-overlay" style="position: absolute; top: 50px; left: 10px; display: flex; flex-direction: column; z-index: 5;">
                                <div class="sc-ticker-info-display" style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; font-family: 'Open Sans', Arial, sans-serif;">
                                    <img class="sc-ticker-logo" alt="" aria-hidden="true" hidden>
                                    <span class="sc-ticker-symbol" style="font-weight: 700; font-size: 15px; color: #e0e0e0;"></span>
                                    <span class="sc-company-name" style="font-size: 12px; color: #888; font-weight: 400;"></span>
                                    <span class="sc-current-price" style="font-weight: 600; font-size: 14px; color: #e0e0e0;"></span>
                                    <span class="sc-day-change" style="display: none;"></span>
                                    <span class="sc-day-change-pct" style="display: none;"></span>
                                    <span class="sc-mode-tag" hidden></span>
                                </div>
                                <div class="sc-ohlcv-values-display" style="display: flex; flex-wrap: wrap; align-items: center; font-size: 12px; margin-bottom: 5px;">
                                  <span class="label-open" style="margin-right: 10px;">O: <span class="open-value"></span></span>
                                  <span class="label-high" style="margin-right: 10px;">H: <span class="high-value"></span></span>
                                  <span class="label-low" style="margin-right: 10px;">L: <span class="low-value"></span></span>
                                  <span class="label-close" style="margin-right: 10px;">C: <span class="close-value"></span></span>
                                  <span class="label-change" style="margin-right: 10px; font-family: 'Open Sans', Arial, sans-serif; font-weight: 500;"><span class="change-value"></span></span>
                                  <span class="label-range" style="margin-right: 10px; font-family: 'Open Sans', Arial, sans-serif; font-weight: 500;">R: <span class="range-value"></span></span>
                                  <span class="label-volume">V: <span class="vol-value"></span></span>
                                </div>
                                <div class="sc-indicator-values-display" style="display: flex; flex-wrap: wrap; align-items: center; font-size: 12px; z-index: 5;">
                                </div>
                                <div class="sc-atr-display" style="display: flex; align-items: center; font-size: 12px; margin-top: 5px; z-index: 5;">
                                </div>
                            </div>
                            <div class="sc-indicators-dropdown">
                              <div class="d-none sc-dropdown-header">Technical Indicators</div>
                              <div class="sc-dropdown-content">
                                <div class="sc-indicator-group">
                                  <div class="sc-indicator-group-title">Chart</div>
                                  <div class="sc-indicator-toggle sc-candle-colors-row">
                                    <span class="sc-indicator-dot sc-color-dot" data-sc-color="candles" role="button" tabindex="0" title="Change color"></span>
                                    <span class="sc-indicator-name">Candle colors</span>
                                  </div>
                                </div>
                                <div class="sc-indicator-group">
                                  <div class="sc-indicator-group-title">Moving Averages</div>
                                  <div class="sc-moving-averages-list">
                                    <!-- Dynamic content will be inserted here -->
                                  </div>
                                  <div class="sc-add-indicator-section">
                                    <div class="sc-add-ma-controls">
                                      <select class="sc-ma-type-select">
                                        <option value="ema">EMA</option>
                                        <option value="sma">SMA</option>
                                      </select>
                                      <input type="number" class="sc-ma-period-input" placeholder="Period" min="1" max="200" />
                                      <button type="button" class="sc-ma-color-button sc-color-dot" data-sc-color="new" title="Line color" aria-label="Line color"></button>
                                      <button class="sc-add-ma-button">Add</button>
                                    </div>
                                  </div>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="vwap" />
                                    <span class="sc-indicator-dot" style="background-color: #C71585;"></span>
                                    <span class="sc-indicator-name">VWAP</span>
                                  </label>
                                  <label class="sc-indicator-toggle" title="Day high/low, premarket high/low and prior close">
                                    <input type="checkbox" value="keyLevels" />
                                    <span class="sc-indicator-dot" style="background-color: #8D96A6;"></span>
                                    <span class="sc-indicator-name">Key levels (HOD, LOD, PMH, PML, PC)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="parabolicSAR" />
                                    <span class="sc-indicator-dot" style="background-color: #FF6B35;"></span>
                                    <span class="sc-indicator-name">Parabolic SAR (0.02, 0.2)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="volumeMA" />
                                    <span class="sc-indicator-dot" style="background-color: #FFA500;"></span>
                                    <span class="sc-indicator-name">Volume MA (20)</span>
                                  </label>
                                </div>
                                <div class="sc-indicator-group">
                                  <div class="sc-indicator-group-title">Bands & Channels</div>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="bollinger" />
                                    <span class="sc-indicator-dot" style="background-color: #1E88E5;"></span>
                                    <span class="sc-indicator-name">Bollinger Bands (20, 2)</span>
                                  </label>
                                </div>
                                <div class="sc-indicator-group">
                                  <div class="sc-indicator-group-title">Oscillators</div>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="rsi" />
                                    <span class="sc-indicator-dot" style="background-color: #9B83B8;"></span>
                                    <span class="sc-indicator-name">RSI (14)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" checked value="macd" />
                                    <span class="sc-indicator-dot" style="background-color: #00C000;"></span>
                                    <span class="sc-indicator-name">MACD (12, 26, 9)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="stochastic" />
                                    <span class="sc-indicator-dot" style="background-color: #FF1493;"></span>
                                    <span class="sc-indicator-name">Stochastic (14, 3, 3)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="williamsR" />
                                    <span class="sc-indicator-dot" style="background-color: #FF6347;"></span>
                                    <span class="sc-indicator-name">Williams %R (14)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="mfi" />
                                    <span class="sc-indicator-dot" style="background-color: #DC143C;"></span>
                                    <span class="sc-indicator-name">MFI (14)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="cci" />
                                    <span class="sc-indicator-dot" style="background-color: #00CED1;"></span>
                                    <span class="sc-indicator-name">CCI (20)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="stochasticRSI" />
                                    <span class="sc-indicator-dot" style="background-color: #FF69B4;"></span>
                                    <span class="sc-indicator-name">Stochastic RSI (14)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="awesomeOscillator" />
                                    <span class="sc-indicator-dot" style="background-color: #00C853;"></span>
                                    <span class="sc-indicator-name">Awesome Oscillator</span>
                                  </label>
                                </div>
                                <div class="sc-indicator-group">
                                  <div class="sc-indicator-group-title">Momentum</div>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="roc" />
                                    <span class="sc-indicator-dot" style="background-color: #228B22;"></span>
                                    <span class="sc-indicator-name">ROC (12)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="trix" />
                                    <span class="sc-indicator-dot" style="background-color: #9932CC;"></span>
                                    <span class="sc-indicator-name">TRIX (15)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="kst" />
                                    <span class="sc-indicator-dot" style="background-color: #FF4500;"></span>
                                    <span class="sc-indicator-name">KST</span>
                                  </label>
                                </div>
                                <div class="sc-indicator-group">
                                  <div class="sc-indicator-group-title">Trend</div>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="adx" />
                                    <span class="sc-indicator-dot" style="background-color: #8A2BE2;"></span>
                                    <span class="sc-indicator-name">ADX (14)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="ichimoku" />
                                    <span class="sc-indicator-dot" style="background-color: #0496ff;"></span>
                                    <span class="sc-indicator-name">Ichimoku Cloud</span>
                                  </label>
                                </div>
                                <div class="sc-indicator-group">
                                  <div class="sc-indicator-group-title">Volume</div>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" checked value="volume" />
                                    <span class="sc-indicator-dot" style="background-color: #26a69a;"></span>
                                    <span class="sc-indicator-name">Volume Bars</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="obv" />
                                    <span class="sc-indicator-dot" style="background-color: #00BFFF;"></span>
                                    <span class="sc-indicator-name">OBV</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="adl" />
                                    <span class="sc-indicator-dot" style="background-color: #FFD700;"></span>
                                    <span class="sc-indicator-name">A/D Line</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="forceIndex" />
                                    <span class="sc-indicator-dot" style="background-color: #7B68EE;"></span>
                                    <span class="sc-indicator-name">Force Index (13)</span>
                                  </label>
                                </div>
                                <div class="sc-indicator-group">
                                  <div class="sc-indicator-group-title">Volatility</div>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="atr" />
                                    <span class="sc-indicator-dot" style="background-color: #8A2BE2;"></span>
                                    <span class="sc-indicator-name">ATR (14)</span>
                                  </label>
                                </div>
                                <div class="sc-indicator-group">
                                  <div class="sc-indicator-group-title">Overlays</div>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="wma" />
                                    <span class="sc-indicator-dot" style="background-color: #FF8C00;"></span>
                                    <span class="sc-indicator-name">WMA (20)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="wema" />
                                    <span class="sc-indicator-dot" style="background-color: #4169E1;"></span>
                                    <span class="sc-indicator-name">WEMA (14)</span>
                                  </label>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="typicalPrice" />
                                    <span class="sc-indicator-dot" style="background-color: #808080;"></span>
                                    <span class="sc-indicator-name">Typical Price</span>
                                  </label>
                                </div>
                                <!-- The "Candlestick Patterns" marker overlay was removed
                                     from this menu: it marks every match across the whole
                                     visible range, which is unreadable on intraday data.
                                     The simulators use js/pattern-alerts.js instead, which
                                     alerts on the candle that just closed. The indicator
                                     itself still works if enabled in code. -->
                              </div>
                            </div>
                            <div class="sc-charttype-dropdown">
                                <div class="sc-dropdown-content">
                                    ${this.availableChartTypes().map(t => `<div class="sc-charttype-option${t.value === this.config.chartType ? ' selected' : ''}" data-value="${t.value}">${this.chartTypeIcon(t.value)}<span>${t.label}</span></div>`).join('')}
                                </div>
                            </div>
                            <div class="sc-timeframe-dropdown">
                                <div class="d-none sc-dropdown-header">Select Timeframe</div>
                                <div class="sc-dropdown-content">
                                    ${(this.config.timeframesToDisplay || this.defaultTimeframes).map(tf => `<div class="sc-timeframe-option" data-value="${tf.value}">${tf.label}</div>`).join('')}
                                </div>
                            </div>
                          </div>
                        </div>`; this.chartContainer = this.container.querySelector('.sc-chart-container'); if (this.chartContainer) this.chartContainer._scInstance = this;  this.priceCanvas = this.container.querySelector('.sc-price-chart'); this.priceCtx = this.priceCanvas.getContext('2d'); this.verticalScaleArea = this.container.querySelector('.sc-vertical-scale-area'); this.chartTypeButton = this.container.querySelector('.sc-chart-type-button'); this.chartTypeDropdown = this.container.querySelector('.sc-charttype-dropdown'); this.darkModeButton = this.container.querySelector('.sc-dark-mode-button'); this.maximizeButton = this.container.querySelector('.sc-maximize-button'); this.lineToolButton = this.container.querySelector('.sc-line-tool-button'); this.textToolButton = this.container.querySelector('.sc-text-tool-button'); this.textSettingsPanel = this.container.querySelector('.sc-text-settings-panel'); this.fontSizeSlider = this.container.querySelector('.sc-font-size-slider'); this.fontSizeDisplay = this.container.querySelector('.sc-font-size-display'); this.fontFamilySelect = this.container.querySelector('.sc-font-family-select'); this.textColorPicker = this.container.querySelector('.sc-text-color-picker'); this.textBoldButton = this.container.querySelector('.sc-text-bold-button'); this.textApplyButton = this.container.querySelector('.sc-text-apply-button'); this.emoticonToolButton = this.container.querySelector('.sc-emoticon-tool-button'); this.emoticonPanel = this.container.querySelector('.sc-emoticon-panel'); this.emoticonSizeSlider = this.container.querySelector('.sc-emoticon-size-slider'); this.emoticonSizeDisplay = this.container.querySelector('.sc-emoticon-size-display'); this.fibonacciToolButton = this.container.querySelector('.sc-fibonacci-tool-button'); this.drawingToolsButton = this.container.querySelector('.sc-drawing-tools-button'); this.drawingToolsPanel = this.container.querySelector('.sc-drawing-tools-panel'); this.indicatorsDropdown = this.container.querySelector('.sc-indicators-dropdown'); this.indicatorsButton = this.container.querySelector('.sc-indicators-button'); this.fitViewButton = this.container.querySelector('.sc-fit-view-button'); this.cameraButton = this.container.querySelector('.sc-camera-button'); this.populateMovingAveragesUI(); this.setupMovingAverageEventHandlers()
    }
    populateMovingAveragesUI() { const movingAveragesList = this.container.querySelector('.sc-moving-averages-list'); if (!movingAveragesList) return; this.applyColorPrefs(); movingAveragesList.innerHTML = ''; this.movingAverages.forEach(ma => { const toggle = this.createMovingAverageToggle(ma); movingAveragesList.appendChild(toggle) }); this.paintNewMaSwatch() }
    createMovingAverageToggle(ma) {
        const label = document.createElement('label'); label.className = 'sc-indicator-toggle'; label.innerHTML = `
            <input type="checkbox" value="${ma.id}" ${ma.enabled ? 'checked' : ''} />
            <span class="sc-indicator-dot sc-color-dot" data-sc-color="ma:${ma.id}" role="button" tabindex="0" title="Change color" style="background-color: ${ma.color};"></span>
            <span class="sc-indicator-name">${ma.type.toUpperCase()} ${ma.period}</span>
            <button class="sc-remove-ma-button" data-ma-id="${ma.id}">×</button>
        `; return label
    }
    setupMovingAverageEventHandlers() {
        const addButton = this.container.querySelector('.sc-add-ma-button'); const typeSelect = this.container.querySelector('.sc-ma-type-select'); const periodInput = this.container.querySelector('.sc-ma-period-input'); if (addButton && typeSelect && periodInput) { addButton.addEventListener('click', () => { const type = typeSelect.value; const period = parseInt(periodInput.value); if (period && period > 0 && period <= 200) { if (this.addMovingAverage(type, period)) { this.commitPendingMaColor(`${type}_${period}`); periodInput.value = ''; this.populateMovingAveragesUI(); this.setupMovingAverageToggleHandlers(); this.drawCharts() } else { alert(`${type.toUpperCase()} ${period} already exists`) } } else { alert('Please enter a valid period (1-200)') } }); periodInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { addButton.click() } }) }
        this.setupMovingAverageToggleHandlers()
    }
    setupMovingAverageToggleHandlers() { const movingAveragesList = this.container.querySelector('.sc-moving-averages-list'); if (!movingAveragesList) return; const toggles = movingAveragesList.querySelectorAll('input[type="checkbox"]'); toggles.forEach(toggle => { toggle.addEventListener('change', (e) => { const maId = e.target.value; const ma = this.movingAverages.find(m => m.id === maId); if (ma) { ma.enabled = e.target.checked; this.calculateIndicators(); this.drawCharts(); this.saveSettings() } }) }); const removeButtons = movingAveragesList.querySelectorAll('.sc-remove-ma-button'); removeButtons.forEach(button => { button.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); const maId = button.getAttribute('data-ma-id'); if (this.removeMovingAverage(maId)) { this.populateMovingAveragesUI(); this.setupMovingAverageToggleHandlers(); this.drawCharts() } }) }) }
    // ── Indicator style: color, thickness, settings ───────────────────────────
    // Click a color dot in the Indicators menu to restyle that line. Choices are saved per
    // browser under 'scIndicatorColors' and apply to every chart on the site, including pages
    // that pass indicators in code. Keys: colors 'ma.ema_9' / 'macd.signalColor' / 'candles.bull',
    // thickness '<key>.width' ('thin' | 'thick'), settings '<key>.p.<field>' (e.g. 'rsi.p.period').
    static colorSlots() {
        return {
            vwap: [['color', 'VWAP']], parabolicSAR: [['color', 'Parabolic SAR']], volumeMA: [['color', 'Volume MA']],
            bollinger: [['color', 'Bands']], rsi: [['color', 'RSI']], macd: [['macdColor', 'MACD line'], ['signalColor', 'Signal line']],
            stochastic: [['color', '%K'], ['dColor', '%D']], williamsR: [['color', 'Williams %R']], mfi: [['color', 'MFI']], cci: [['color', 'CCI']],
            stochasticRSI: [['color', '%K'], ['dColor', '%D']], roc: [['color', 'ROC']], trix: [['color', 'TRIX']], kst: [['color', 'KST'], ['signalColor', 'Signal']],
            adx: [['color', 'ADX'], ['pdiColor', '+DI'], ['mdiColor', '-DI']], ichimoku: [['tenkanColor', 'Conversion line'], ['kijunColor', 'Base line']],
            obv: [['color', 'OBV']], adl: [['color', 'A/D Line']], forceIndex: [['color', 'Force Index']], atr: [['color', 'ATR']],
            wma: [['color', 'WMA']], wema: [['color', 'WEMA']], typicalPrice: [['color', 'Typical Price']]
        };
    }
    // Editable inputs: [field, label, default, step]. A step under 1 means a decimal value.
    static paramSpec() {
        const len = (d) => [['period', 'Length', d, 1]];
        return {
            rsi: len(14), bollinger: [['period', 'Length', 20, 1], ['mult', 'Std dev', 2, 0.1]],
            macd: [['fast', 'Fast', 12, 1], ['slow', 'Slow', 26, 1], ['signal', 'Signal', 9, 1]],
            stochastic: [['period', '%K', 14, 1], ['dPeriod', '%D', 3, 1], ['slowing', 'Smooth', 3, 1]],
            atr: len(14), volumeMA: len(20), williamsR: len(14), mfi: len(14), roc: len(12), cci: len(20), adx: len(14),
            stochasticRSI: len(14), trix: len(15), forceIndex: len(13), wma: len(20), wema: len(14)
        };
    }
    // Indicators drawn as lines (Parabolic SAR is dots, ATR is a readout, candles aren't lines)
    static hasWidth(target) { return target.indexOf('ma:') === 0 || ['vwap', 'bollinger', 'rsi', 'macd', 'stochastic', 'williamsR', 'mfi', 'roc', 'cci', 'trix', 'obv', 'adl', 'forceIndex', 'adx', 'stochasticRSI', 'kst', 'ichimoku', 'wma', 'wema', 'typicalPrice', 'volumeMA'].indexOf(target) > -1; }
    static styleKey(target) { return target.indexOf('ma:') === 0 ? 'ma.' + target.slice(3) : target; }
    static colorSwatches() { return ['#2196F3', '#00BCD4', '#26A69A', '#4CAF50', '#CDDC39', '#FFEB3B', '#FF9800', '#F44336', '#E91E63', '#C71585', '#9C27B0', '#7E57C2', '#FFFFFF', '#9E9E9E']; }
    static loadColorPrefs() {
        if (!StockChart._colorPrefs) { let p = {}; try { p = JSON.parse(localStorage.getItem('scIndicatorColors') || '{}') || {}; } catch (e) { } StockChart._colorPrefs = p; }
        return StockChart._colorPrefs;
    }
    static saveColorPrefs() { try { localStorage.setItem('scIndicatorColors', JSON.stringify(StockChart.loadColorPrefs())); } catch (e) { } }
    lineScale(key) { const w = StockChart.loadColorPrefs()[key + '.width']; return w === 'thin' ? 0.6 : w === 'thick' ? 1.8 : 1; }
    applyColorPrefs() {
        const prefs = StockChart.loadColorPrefs(), slots = StockChart.colorSlots(), spec = StockChart.paramSpec();
        if (!this._defaultColors) { // remember the built-in colors so "Reset" can restore them
            this._defaultColors = {};
            for (const key in slots) { const ind = this.indicators[key]; if (ind) slots[key].forEach(([f]) => { this._defaultColors[key + '.' + f] = ind[f]; }); }
        }
        for (const key in slots) { const ind = this.indicators[key]; if (ind) slots[key].forEach(([f]) => { ind[f] = prefs[key + '.' + f] || this._defaultColors[key + '.' + f]; }); }
        for (const key in spec) { const ind = this.indicators[key]; if (ind) spec[key].forEach(([f, , d]) => { const v = prefs[key + '.p.' + f]; ind[f] = typeof v === 'number' ? v : d; }); }
        (this.movingAverages || []).forEach(ma => { const c = prefs['ma.' + ma.id]; if (c) ma.color = c; });
    }
    nextMaColor() { return this._pendingMaColor || this.colorPalette[this.movingAverages.length % this.colorPalette.length]; }
    paintNewMaSwatch() { const b = this.container.querySelector('.sc-ma-color-button'); if (b) b.style.background = this.nextMaColor(); }
    commitPendingMaColor(id) {
        const color = this._pendingMaColor; this._pendingMaColor = null;
        if (color) { StockChart.loadColorPrefs()['ma.' + id] = color; StockChart.saveColorPrefs(); const ma = this.movingAverages.find(m => m.id === id); if (ma) ma.color = color; this.saveSettings(); this.broadcastColorChange(); }
        this.paintNewMaSwatch();
    }
    // [{ label, color, prefKey }] for a dot's data-sc-color target: 'new', 'candles', 'ma:<id>' or an indicator key
    getColorSlots(target) {
        if (target === 'new') return [{ label: 'New moving average', color: this.nextMaColor(), prefKey: null }];
        if (target === 'candles') return [{ label: 'Up candles', color: this.config.currentBullColor, prefKey: 'candles.bull' }, { label: 'Down candles', color: this.config.currentBearColor, prefKey: 'candles.bear' }];
        if (target.indexOf('ma:') === 0) { const ma = this.movingAverages.find(m => m.id === target.slice(3)); return ma ? [{ label: ma.type.toUpperCase() + ' ' + ma.period, color: ma.color, prefKey: 'ma.' + ma.id }] : []; }
        const ind = this.indicators[target], defs = StockChart.colorSlots()[target];
        return ind && defs ? defs.map(([f, label]) => ({ label: label, color: ind[f], prefKey: target + '.' + f })) : [];
    }
    // Every change lands here: re-apply, recalculate if settings moved, repaint, tell the other charts.
    styleChanged(recalc) {
        StockChart.saveColorPrefs(); this.applyColorPrefs(); this.updateConfig();
        if (recalc) this.calculateIndicators();
        this.saveSettings(); this.refreshColorDots(); this.drawCharts(); this.broadcastColorChange(recalc);
    }
    setSlotColor(target, index, color) { // color null = back to default
        if (target === 'new') { this._pendingMaColor = color; this.paintNewMaSwatch(); return; }
        const slot = this.getColorSlots(target)[index]; if (!slot) return;
        const prefs = StockChart.loadColorPrefs();
        if (color) prefs[slot.prefKey] = color; else delete prefs[slot.prefKey];
        if (!color && target.indexOf('ma:') === 0) { const i = this.movingAverages.findIndex(m => m.id === target.slice(3)); if (i > -1) this.movingAverages[i].color = this.colorPalette[i % this.colorPalette.length]; }
        this.styleChanged(false);
    }
    setLineWidth(target, w) { const prefs = StockChart.loadColorPrefs(), k = StockChart.styleKey(target) + '.width'; if (w && w !== 'normal') prefs[k] = w; else delete prefs[k]; this.styleChanged(false); }
    setParam(target, field, value) { // value null = back to default
        const def = (StockChart.paramSpec()[target] || []).find(p => p[0] === field); if (!def) return;
        const prefs = StockChart.loadColorPrefs(), k = target + '.p.' + field;
        if (value == null || value === def[2]) delete prefs[k]; else prefs[k] = value;
        this.styleChanged(true);
    }
    resetStyle(target) {
        const prefs = StockChart.loadColorPrefs(), base = StockChart.styleKey(target);
        this.getColorSlots(target).forEach(s => { if (s.prefKey) delete prefs[s.prefKey]; });
        delete prefs[base + '.width'];
        (StockChart.paramSpec()[target] || []).forEach(([f]) => delete prefs[target + '.p.' + f]);
        if (target.indexOf('ma:') === 0) { const i = this.movingAverages.findIndex(m => m.id === target.slice(3)); if (i > -1) this.movingAverages[i].color = this.colorPalette[i % this.colorPalette.length]; }
        this.styleChanged(!!StockChart.paramSpec()[target]);
    }
    broadcastColorChange(recalc) { try { window.dispatchEvent(new CustomEvent('sc-indicator-colors', { detail: { source: this, recalc: !!recalc } })); } catch (e) { } }
    refreshColorDots() {
        const dd = this.indicatorsDropdown; if (!dd) return;
        this.applyColorPrefs();
        dd.querySelectorAll('.sc-color-dot').forEach(dot => {
            const slots = this.getColorSlots(dot.dataset.scColor); if (!slots.length) return;
            // Two-line indicators show both colors split across the dot
            dot.style.background = slots.length > 1 ? `linear-gradient(135deg, ${slots[0].color} 50%, ${slots[1].color} 50%)` : slots[0].color;
        });
        // Menu names show the current settings: "RSI (7)", "MACD (8, 21, 5)". The chart legend reads these names.
        const spec = StockChart.paramSpec();
        dd.querySelectorAll('.sc-indicator-toggle input[type="checkbox"]').forEach(cb => {
            const params = spec[cb.value], ind = this.indicators[cb.value], nameEl = cb.parentNode.querySelector('.sc-indicator-name');
            if (!params || !ind || !nameEl) return;
            if (!nameEl.dataset.scBase) nameEl.dataset.scBase = nameEl.textContent.replace(/\s*\([^)]*\)\s*$/, '').trim();
            nameEl.textContent = nameEl.dataset.scBase + ' (' + params.map(([f]) => ind[f]).join(', ') + ')';
        });
    }
    setupColorPickers() {
        const dd = this.indicatorsDropdown; if (!dd || this._colorPickersReady) return; this._colorPickersReady = true;
        StockChart.injectColorPickerStyles();
        const slots = StockChart.colorSlots();
        dd.querySelectorAll('.sc-indicator-toggle input[type="checkbox"]').forEach(cb => {
            const dot = cb.parentNode.querySelector('.sc-indicator-dot');
            if (dot && slots[cb.value]) { dot.classList.add('sc-color-dot'); dot.dataset.scColor = cb.value; dot.title = 'Change color & settings'; dot.setAttribute('role', 'button'); dot.tabIndex = 0; }
        });
        // Capture phase: the dots sit inside <label>s, so stop the click before it toggles the checkbox
        const open = (e) => { const dot = e.target.closest && e.target.closest('.sc-color-dot'); if (!dot || !dd.contains(dot)) return; e.preventDefault(); e.stopPropagation(); this.openColorPopover(dot); };
        dd.addEventListener('click', open, true);
        dd.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(e); });
        if (this.indicatorsButton) this.indicatorsButton.addEventListener('click', () => this.refreshColorDots());
        const sync = (recalc) => { this.applyColorPrefs(); this.updateConfig(); if (recalc) this.calculateIndicators(); this.refreshColorDots(); this.drawCharts(); };
        window.addEventListener('sc-indicator-colors', (e) => { if (!e.detail || e.detail.source !== this) sync(!e.detail || e.detail.recalc); });
        window.addEventListener('storage', (e) => { if (e.key === 'scIndicatorColors') { StockChart._colorPrefs = null; sync(true); } });
        this.updateConfig(); this.refreshColorDots();
    }
    closeColorPopover() {
        const p = this._colorPop; if (!p) return; this._colorPop = null;
        p.remove(); (this._colorPopCleanup || []).forEach(fn => fn()); this._colorPopCleanup = null;
    }
    openColorPopover(dot) {
        const target = dot.dataset.scColor;
        if (this._colorPop && this._colorPopTarget === target) { this.closeColorPopover(); return; }
        this.closeColorPopover(); this._colorPopTarget = target;
        const row = dot.closest('.sc-indicator-toggle'), nameEl = row && row.querySelector('.sc-indicator-name');
        const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
        const pop = mk('div', 'sc-color-pop'); pop.setAttribute('role', 'dialog');
        const title = mk('div', 'sc-color-pop__title', nameEl ? nameEl.textContent.trim() : 'New moving average'); pop.appendChild(title);
        const body = mk('div'); pop.appendChild(body);
        const build = () => {
            body.innerHTML = '';
            if (nameEl) title.textContent = nameEl.textContent.trim();
            // Colors: one swatch row per line
            const slots = this.getColorSlots(target);
            slots.forEach((slot, i) => {
                const wrap = mk('div', 'sc-color-pop__slot');
                if (slots.length > 1) wrap.appendChild(mk('div', 'sc-color-pop__label', slot.label));
                const grid = mk('div', 'sc-color-pop__grid');
                const current = String(slot.color || '').toLowerCase();
                StockChart.colorSwatches().forEach(c => {
                    const b = mk('button', 'sc-color-pop__sw' + (c.toLowerCase() === current ? ' is-on' : '')); b.type = 'button';
                    b.style.background = c; b.title = c; b.setAttribute('aria-label', c);
                    b.addEventListener('click', () => { this.setSlotColor(target, i, c); if (target === 'new') this.closeColorPopover(); else build(); });
                    grid.appendChild(b);
                });
                // Custom: the browser's own picker, hidden under a rainbow swatch
                const custom = mk('label', 'sc-color-pop__sw sc-color-pop__custom'); custom.title = 'Custom color';
                if (current && !StockChart.colorSwatches().some(c => c.toLowerCase() === current)) custom.classList.add('is-on');
                const input = mk('input'); input.type = 'color'; input.setAttribute('aria-label', 'Custom color');
                input.value = /^#[0-9a-f]{6}$/i.test(slot.color || '') ? slot.color : '#2196f3';
                input.addEventListener('input', () => this.setSlotColor(target, i, input.value));
                custom.appendChild(input); grid.appendChild(custom);
                wrap.appendChild(grid); body.appendChild(wrap);
            });
            // Thickness
            if (StockChart.hasWidth(target)) {
                body.appendChild(mk('div', 'sc-color-pop__label', 'Thickness'));
                const cur = StockChart.loadColorPrefs()[StockChart.styleKey(target) + '.width'] || 'normal';
                const seg = mk('div', 'sc-color-pop__seg');
                [['thin', 'Thin', 1], ['normal', 'Normal', 2], ['thick', 'Thick', 3.5]].forEach(([v, label, px]) => {
                    const b = mk('button', 'sc-color-pop__segbtn' + (v === cur ? ' is-on' : '')); b.type = 'button'; b.title = label; b.setAttribute('aria-label', label + ' line');
                    const line = mk('i'); line.style.height = px + 'px'; b.appendChild(line);
                    b.addEventListener('click', () => { this.setLineWidth(target, v); build(); });
                    seg.appendChild(b);
                });
                body.appendChild(seg);
            }
            // Settings (lengths etc.)
            const params = StockChart.paramSpec()[target], ind = this.indicators[target];
            if (params && ind) {
                body.appendChild(mk('div', 'sc-color-pop__label', 'Settings'));
                const grid = mk('div', 'sc-color-pop__params');
                params.forEach(([f, label, d, step]) => {
                    const cell = mk('label', 'sc-color-pop__param'); cell.appendChild(mk('span', null, label));
                    const input = mk('input'); input.type = 'number'; input.step = String(step); input.min = step < 1 ? '0.1' : '1'; input.max = step < 1 ? '10' : '500'; input.value = String(ind[f]);
                    let t = null;
                    const commit = () => {
                        clearTimeout(t); const v = step < 1 ? Math.round(parseFloat(input.value) * 10) / 10 : parseInt(input.value, 10);
                        const ok = isFinite(v) && v >= parseFloat(input.min) && v <= parseFloat(input.max);
                        input.classList.toggle('is-bad', !ok); if (!ok || v === ind[f]) return;
                        this.setParam(target, f, v); if (nameEl) title.textContent = nameEl.textContent.trim();
                    };
                    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(commit, 450); });
                    input.addEventListener('change', commit);
                    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } });
                    cell.appendChild(input); grid.appendChild(cell);
                });
                body.appendChild(grid);
            }
            if (target !== 'new') {
                const reset = mk('button', 'sc-color-pop__reset', 'Reset to default'); reset.type = 'button';
                reset.addEventListener('click', () => { this.resetStyle(target); build(); });
                body.appendChild(reset);
            }
        };
        build();
        // Clicks inside must not reach the chart's document handler (it closes the menu)
        pop.addEventListener('click', (e) => e.stopPropagation());
        document.body.appendChild(pop); this._colorPop = pop;
        const r = dot.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
        let left = Math.min(r.left - 8, window.innerWidth - w - 8), top = r.bottom + 8;
        if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 8);
        pop.style.left = Math.max(8, left) + 'px'; pop.style.top = top + 'px';
        const outside = (e) => { if (!pop.contains(e.target) && !(e.target.closest && e.target.closest('.sc-color-dot'))) this.closeColorPopover(); };
        const onKey = (e) => { if (e.key === 'Escape') { this.closeColorPopover(); dot.focus && dot.focus(); } };
        const onScroll = (e) => { if (!pop.contains(e.target)) this.closeColorPopover(); };
        const onResize = () => this.closeColorPopover();
        document.addEventListener('click', outside, true); document.addEventListener('keydown', onKey); window.addEventListener('scroll', onScroll, true); window.addEventListener('resize', onResize);
        this._colorPopCleanup = [() => document.removeEventListener('click', outside, true), () => document.removeEventListener('keydown', onKey), () => window.removeEventListener('scroll', onScroll, true), () => window.removeEventListener('resize', onResize)];
    }
    static injectColorPickerStyles() {
        if (document.getElementById('sc-color-pop-css')) return;
        const s = document.createElement('style'); s.id = 'sc-color-pop-css';
        s.textContent = '.sc-indicators-dropdown .sc-color-dot{cursor:pointer;transition:box-shadow .15s}'
            + '.sc-indicators-dropdown .sc-color-dot:hover,.sc-indicators-dropdown .sc-color-dot:focus-visible{box-shadow:0 0 0 2px rgba(255,255,255,.85);outline:none}'
            + '.sc-ma-color-button{flex:none;width:20px;height:20px;padding:0;border:2px solid rgba(255,255,255,.3);border-radius:50%}'
            + '.sc-candle-colors-row{cursor:default}.sc-candle-colors-row .sc-indicator-dot{margin-left:32px}'
            + '.sc-color-pop{position:fixed;z-index:2147483000;width:216px;padding:10px 10px 8px;background:#16161f;border:1px solid rgba(255,255,255,.14);border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.55);font:12px/1.3 "Open Sans",Arial,sans-serif;color:#e6e6ea;text-align:left}'
            + '.sc-color-pop__title{font-weight:700;color:#fff;margin-bottom:8px}'
            + '.sc-color-pop__label{font-size:11px;color:rgba(255,255,255,.6);margin:10px 0 5px}.sc-color-pop__slot:first-child .sc-color-pop__label{margin-top:0}'
            + '.sc-color-pop__grid{display:grid;grid-template-columns:repeat(8,20px);gap:5px}'
            + '.sc-color-pop__sw{position:relative;width:20px;height:20px;margin:0;padding:0;border:0;border-radius:50%;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(0,0,0,.35)}'
            + '.sc-color-pop__sw:hover{transform:scale(1.12)}.sc-color-pop__sw.is-on{box-shadow:0 0 0 2px #16161f,0 0 0 4px #fff}'
            + '.sc-color-pop__custom{overflow:hidden;background:conic-gradient(#f44336,#ffeb3b,#4caf50,#00bcd4,#2196f3,#9c27b0,#f44336)}'
            + '.sc-color-pop__custom input{position:absolute;inset:0;width:100%;height:100%;margin:0;padding:0;border:0;opacity:0;cursor:pointer}'
            + '.sc-color-pop__seg{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}'
            + '.sc-color-pop__segbtn{display:flex;align-items:center;justify-content:center;height:26px;padding:0 10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:5px;cursor:pointer}'
            + '.sc-color-pop__segbtn i{display:block;width:100%;background:rgba(255,255,255,.75);border-radius:2px}'
            + '.sc-color-pop__segbtn:hover{border-color:rgba(255,255,255,.35)}.sc-color-pop__segbtn.is-on{border-color:#fff;background:rgba(255,255,255,.12)}.sc-color-pop__segbtn.is-on i{background:#fff}'
            + '.sc-color-pop__params{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}'
            + '.sc-color-pop__param{display:grid;gap:3px;font-size:10px;color:rgba(255,255,255,.55)}'
            + '.sc-color-pop__param input{width:100%;box-sizing:border-box;height:26px;padding:0 6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:5px;color:#fff;font:600 12px/1 "Open Sans",Arial,sans-serif}'
            + '.sc-color-pop__param input:focus{outline:none;border-color:rgba(255,255,255,.5)}.sc-color-pop__param input.is-bad{border-color:#f44336}'
            + '.sc-shortcuts{position:fixed;z-index:2147483000;width:280px;padding:14px 16px 12px;background:#16161f;border:1px solid rgba(255,255,255,.14);border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.55);font:12px/1.3 "Open Sans",Arial,sans-serif;color:#e6e6ea}'
            + '.sc-shortcuts__title{font-weight:700;font-size:13px;color:#fff;margin-bottom:10px}.sc-shortcuts__row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:4px 0}'
            + '.sc-shortcuts__row kbd{flex:none;min-width:56px;padding:2px 7px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:5px;font:600 11px/1.5 "IBM Plex Mono",ui-monospace,monospace;color:#fff;text-align:center}'
            + '.sc-shortcuts__row span{color:rgba(255,255,255,.75);text-align:right}.sc-shortcuts__note{margin-top:10px;font-size:11px;color:rgba(255,255,255,.45)}'
            + '.sc-color-pop__reset{display:block;margin-top:10px;padding:0;background:none;border:0;color:rgba(255,255,255,.6);font:inherit;cursor:pointer;text-decoration:none}.sc-color-pop__reset:hover{color:#fff}';
        document.head.appendChild(s);
    }
    // ── Measure tool + keyboard shortcuts ───────────────────────────────────
    // Measure: ruler button / Alt+M, then click-move-click (or drag), or Shift+drag anytime.
    // Shows price change, %, bars, time span and volume between two points. Esc or the next
    // click clears it. Shortcuts only fire while the pointer is over this chart.
    candleXAt(index) { const cW = this.calculateCandleWidth(); return this.config.padding.left + (index - this.config.dataOffset) * (cW + this.config.spacing) + cW * 0.5 + this.pixelOffset; }
    candleIndexNear(x) { const cW = this.calculateCandleWidth(); return Math.round((x - this.pixelOffset - this.config.padding.left - cW * 0.5) / (cW + this.config.spacing)) + this.config.dataOffset; }
    yAtPrice(price) {
        const chartTop = this.config.padding.top, chartH = this.getPriceChartHeight();
        const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
        let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset;
        return chartTop + chartH - (price - min) / (max - min) * chartH;
    }
    activateMeasureMode() { this.closeOtherToolbarMenus('measure'); this.measureMode = true; this.priceCanvas.style.cursor = 'crosshair'; if (this.measureButton) this.measureButton.classList.add('active'); }
    deactivateMeasureMode() { this.measureMode = false; if (!this._measuring) this.priceCanvas.style.cursor = 'default'; if (this.measureButton) this.measureButton.classList.remove('active'); }
    clearMeasure() { this.measure = null; this._measuring = false; this.deactivateMeasureMode(); this.drawCharts(); }
    otherToolActive() { return this.lineDrawingMode || this.textMode || this.emoticonMode || this.fibonacciMode || this.drawingToolsMode || this.draggedLimitOrder; }
    setupMeasureAndShortcuts() {
        if (this._measureReady || !this.priceCanvas) return; this._measureReady = true;
        const cv = this.priceCanvas, pos = (e) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
        const point = (p) => ({ i: this.candleIndexNear(p.x), price: this.priceAtY(p.y) });
        // Capture phase so these run before the chart's own pan/drawing handlers
        cv.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            const p = pos(e);
            if (this._measuring) { // second click finishes a click-move-click measure
                const q = point(p); this.measure.i1 = q.i; this.measure.p1 = q.price; this._measuring = false; this.deactivateMeasureMode(); this.drawCharts();
                e.stopImmediatePropagation(); e.preventDefault(); return;
            }
            const starting = this.measureMode || (e.shiftKey && !this.otherToolActive());
            if (this.measure && !starting) { this.measure = null; this.drawCharts(); return; } // any click clears the last measure
            if (!starting || !this.stockData.length) return;
            const q = point(p);
            this.measure = { i0: q.i, p0: q.price, i1: q.i, p1: q.price, firstT: this.stockData[0].t };
            this._measuring = true; this._measureDown = p; cv.style.cursor = 'crosshair';
            e.stopImmediatePropagation(); e.preventDefault(); this.drawCharts();
        }, true);
        cv.addEventListener('mousemove', (e) => {
            if (!this._measuring || !this.measure) return;
            const q = point(pos(e)); this.measure.i1 = q.i; this.measure.p1 = q.price; this.drawCharts();
        }, true);
        document.addEventListener('mouseup', (e) => { // a drag finishes on release; a plain click keeps following the mouse
            if (!this._measuring || !this._measureDown) return;
            const p = pos(e); if (Math.hypot(p.x - this._measureDown.x, p.y - this._measureDown.y) < 6) return;
            this._measuring = false; this.deactivateMeasureMode(); this.drawCharts();
        });
        if (this.measureButton) this.measureButton.addEventListener('click', (e) => { e.stopPropagation(); if (this.measureMode) { this.deactivateMeasureMode(); } else { this.measure = null; this.activateMeasureMode(); } this.drawCharts(); });
        // Keyboard shortcuts (capture phase: Esc for an open measure must win over the page's Esc handlers)
        document.addEventListener('keydown', (e) => {
            const t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
            if (typing) return;
            const key = (e.key || '').toLowerCase();
            if (key === 'escape' && (this.measure || this.measureMode || this._shortcutHelp)) { if (this._shortcutHelp) this.closeShortcutHelp(); this.clearMeasure(); e.stopPropagation(); e.preventDefault(); return; }
            if (!this.mouseIsOverChart) return;
            if (key === 'backspace' && !e.altKey && !e.ctrlKey && !e.metaKey) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' })); return; } // Mac "delete" key
            if (key === '?' && !e.ctrlKey && !e.metaKey) { this.toggleShortcutHelp(); e.preventDefault(); return; }
            if (!e.altKey || e.ctrlKey || e.metaKey) return;
            const run = {
                m: () => { if (this.measureMode) this.deactivateMeasureMode(); else { this.measure = null; this.activateMeasureMode(); } this.drawCharts(); },
                t: () => { this.closeOtherToolbarMenus('drawingTools'); if (!this.drawingToolsMode) this.activateDrawingToolsMode(); this.selectDrawingTool('line'); },
                f: () => { if (this._fbTypes) { this.activateLineTool('fibret'); return } this.closeOtherToolbarMenus('fibonacci'); if (!this.fibonacciMode) this.activateFibonacciMode(); },
                r: () => { if (e.shiftKey) return; if (this.fitViewButton) this.fitViewButton.click(); }, // Alt+Shift+R = rectangle
                i: () => { if (this.indicatorsButton) this.indicatorsButton.click(); }
            }[key];
            if (run) { run(); e.preventDefault(); e.stopPropagation(); }
        }, true);
    }
    toggleShortcutHelp() { if (this._shortcutHelp) this.closeShortcutHelp(); else this.openShortcutHelp(); }
    closeShortcutHelp() { if (this._shortcutHelp) { this._shortcutHelp.remove(); this._shortcutHelp = null; } }
    openShortcutHelp() {
        StockChart.injectColorPickerStyles();
        const rows = [['Alt + M', 'Measure (or Shift + drag)'], ['Alt + T', 'Trend line'], ['Alt + H', 'Horizontal line'], ['Alt + F', 'Fibonacci'], ['Alt + A', 'Price alert'], ['Alt + I', 'Indicators'], ['Alt + R', 'Fit chart to view'], ['Delete', 'Remove selected drawing'], ['Esc', 'Cancel / close'], ['?', 'Show these shortcuts']];
        const box = document.createElement('div'); box.className = 'sc-shortcuts';
        const h = document.createElement('div'); h.className = 'sc-shortcuts__title'; h.textContent = 'Keyboard shortcuts'; box.appendChild(h);
        rows.forEach(([k, v]) => { const r = document.createElement('div'); r.className = 'sc-shortcuts__row'; const kb = document.createElement('kbd'); kb.textContent = k; const s = document.createElement('span'); s.textContent = v; r.appendChild(kb); r.appendChild(s); box.appendChild(r); });
        const note = document.createElement('div'); note.className = 'sc-shortcuts__note'; note.textContent = 'Point at the chart, then press the keys.'; box.appendChild(note);
        document.body.appendChild(box); this._shortcutHelp = box;
        const r = this.chartContainer.getBoundingClientRect();
        box.style.left = Math.max(8, r.left + (r.width - box.offsetWidth) / 2) + 'px'; box.style.top = Math.max(8, r.top + Math.min(80, (r.height - box.offsetHeight) / 2)) + 'px';
        const close = () => { document.removeEventListener('mousedown', close, true); this.closeShortcutHelp(); };
        setTimeout(() => document.addEventListener('mousedown', close, true), 0);
    }
    drawMeasure(ctx) {
        const m = this.measure; if (!m || !this.stockData.length) return;
        if (this.stockData[0].t !== m.firstT) { this.measure = null; this._measuring = false; return; } // ticker/timeframe changed
        const x0 = this.candleXAt(m.i0), x1 = this.candleXAt(m.i1), y0 = this.yAtPrice(m.p0), y1 = this.yAtPrice(m.p1);
        const up = m.p1 >= m.p0, col = up ? '38,166,154' : '239,83,80', stroke = `rgb(${col})`;
        const chartTop = this.config.padding.top, chartBottom = chartTop + this.getPriceChartHeight(), rightX = this.getCanvasWidth() - this.config.padding.right;
        ctx.save();
        ctx.beginPath(); ctx.rect(0, chartTop, rightX, chartBottom - chartTop); ctx.clip();
        const lx = Math.min(x0, x1), ty = Math.min(y0, y1), w = Math.max(1, Math.abs(x1 - x0)), hh = Math.max(1, Math.abs(y1 - y0));
        ctx.fillStyle = `rgba(${col},0.16)`; ctx.fillRect(lx, ty, w, hh);
        ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.strokeRect(lx + 0.5, ty + 0.5, w - 1, hh - 1);
        // Arrows through the middle: vertical shows direction, horizontal shows time
        const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, arrow = (ax, ay, bx, by) => {
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
            const a = Math.atan2(by - ay, bx - ax), s = 6; if (Math.hypot(bx - ax, by - ay) < 10) return;
            ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - s * Math.cos(a - 0.5), by - s * Math.sin(a - 0.5)); ctx.lineTo(bx - s * Math.cos(a + 0.5), by - s * Math.sin(a + 0.5)); ctx.closePath(); ctx.fillStyle = stroke; ctx.fill();
        };
        ctx.lineWidth = 1.5; arrow(mx, y0, mx, y1); arrow(x0, my, x1, my);
        ctx.restore();
        // Label
        const dec = typeof this.limitOrderPriceDecimals === 'number' ? this.limitOrderPriceDecimals : s8PriceDecimals(m.p0);
        const diff = m.p1 - m.p0, pct = m.p0 ? diff / m.p0 * 100 : 0, bars = Math.abs(m.i1 - m.i0);
        const lo = Math.max(0, Math.min(m.i0, m.i1)), hi = Math.min(this.stockData.length - 1, Math.max(m.i0, m.i1));
        let vol = 0; for (let i = lo; i <= hi; i++) vol += Number(this.stockData[i].volume) || 0;
        let span = '';
        const tA = this.stockData[Math.max(0, Math.min(this.stockData.length - 1, m.i0))].t, tB = this.stockData[Math.max(0, Math.min(this.stockData.length - 1, m.i1))].t;
        let ms = Math.abs(tB - tA);
        if (this.stockData.length > 1 && (m.i0 < 0 || m.i1 < 0 || m.i0 >= this.stockData.length || m.i1 >= this.stockData.length)) { const step = Math.abs(this.stockData[this.stockData.length - 1].t - this.stockData[this.stockData.length - 2].t); ms = bars * step; }
        if (ms > 0) { const s = Math.round(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), mi = Math.floor(s % 3600 / 60), se = s % 60; span = d ? `${d}d ${h}h` : h ? `${h}h ${mi}m` : mi ? `${mi}m${se ? ' ' + se + 's' : ''}` : `${se}s`; }
        const sign = diff >= 0 ? '+' : '−';
        const lines = [`${sign}${Math.abs(diff).toFixed(dec)} (${sign}${Math.abs(pct).toFixed(2)}%)`, `${bars} bar${bars === 1 ? '' : 's'}${span ? ', ' + span : ''}`];
        if (vol > 0) lines.push('Vol ' + (this.formatVolume ? this.formatVolume(vol) : Math.round(vol)));
        ctx.save();
        ctx.font = '600 12px "Open Sans", Arial, sans-serif';
        const pad = 8, lh = 16, bw = Math.max(...lines.map(s => ctx.measureText(s).width)) + pad * 2, bh = lines.length * lh + pad * 2 - 4;
        let bx = mx - bw / 2, by = up ? ty - bh - 8 : ty + hh + 8;
        if (by < chartTop + 4) by = ty + hh + 8; if (by + bh > chartBottom - 4) by = Math.max(chartTop + 4, ty - bh - 8);
        bx = Math.max(4, Math.min(bx, rightX - bw - 4));
        ctx.fillStyle = stroke; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 5); else ctx.rect(bx, by, bw, bh); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        lines.forEach((s, i) => { ctx.font = (i === 0 ? '700 ' : '500 ') + '12px "Open Sans", Arial, sans-serif'; ctx.fillText(s, bx + bw / 2, by + pad - 1 + i * lh); });
        ctx.restore();
    }
    closeOtherToolbarMenus(keepOpen) {
        const dropdowns = [
            ['chartType', this.chartTypeDropdown, this.chartTypeButton],
            ['timeframe', this.timeframeDropdown, this.timeframeButton],
            ['indicators', this.indicatorsDropdown, this.indicatorsButton]
        ];
        dropdowns.forEach(([name, menu, button]) => {
            if (name === keepOpen) return;
            menu.classList.remove('active');
            button.classList.remove('active');
        });
        // Use the existing mode cleanup so a closed palette cannot keep drawing.
        if (keepOpen !== 'drawingTools' && this.drawingToolsMode) this.deactivateDrawingToolsMode();
        if (keepOpen !== 'text' && this.textMode) this.deactivateTextMode();
        if (keepOpen !== 'emoticon' && this.emoticonMode) this.deactivateEmoticonMode();
        if (keepOpen !== 'fibonacci' && this.fibonacciMode) this.deactivateFibonacciMode();
        if (keepOpen !== 'line' && keepOpen !== 'drawingTools' && this.lineDrawingMode) this.deactivateLineDrawingMode();
        if (keepOpen !== 'measure' && this.measureMode) this.deactivateMeasureMode();
        if (keepOpen !== 'cursor' && this.closeCursorMenu) this.closeCursorMenu();
        if (keepOpen !== 'linetools' && this._lt) { this.closeLineMenu(); if (this._lt.tool) this.deactivateLineTool(); }
    }
    registerEventListeners() {
        this.timeframeButton = this.container.querySelector('.sc-timeframe-button'); this.timeframeDropdown = this.container.querySelector('.sc-timeframe-dropdown'); this.timeframeButton.addEventListener('click', (e) => { this.closeOtherToolbarMenus('timeframe'); this.timeframeDropdown.classList.toggle('active'); this.timeframeButton.classList.toggle('active'); e.stopPropagation() }); const timeframeOptions = this.timeframeDropdown.querySelectorAll('.sc-timeframe-option'); this.updateTimeframeDropdownVisualState(); timeframeOptions.forEach(option => { option.addEventListener('click', (e) => { this.changeTimeframe(option.getAttribute('data-value')); this.timeframeDropdown.classList.remove('active'); this.timeframeButton.classList.remove('active'); e.stopPropagation(); this.saveSettings() }) }); document.addEventListener('click', (e) => {
            if (!this.timeframeDropdown.contains(e.target) && !this.timeframeButton.contains(e.target)) { this.timeframeDropdown.classList.remove('active'); this.timeframeButton.classList.remove('active') }
            if (!this.indicatorsDropdown.contains(e.target) && !this.indicatorsButton.contains(e.target)) { this.indicatorsDropdown.classList.remove('active'); this.indicatorsButton.classList.remove('active') }
            if (this.chartTypeDropdown && !this.chartTypeDropdown.contains(e.target) && !this.chartTypeButton.contains(e.target)) { this.chartTypeDropdown.classList.remove('active'); this.chartTypeButton.classList.remove('active') }
            if (!this.activeTextInput && !this.textSettingsPanel.contains(e.target) && !this.textToolButton.contains(e.target) && !this.priceCanvas.contains(e.target)) { if (this.textMode && this.textSettingsPanel.style.display === 'block') { this.deactivateTextMode() } }
            if (!this.emoticonPanel.contains(e.target) && !this.emoticonToolButton.contains(e.target) && !this.priceCanvas.contains(e.target)) { if (this.emoticonMode && this.emoticonPanel.style.display === 'block') { this.deactivateEmoticonMode() } }
            if (!this.drawingToolsPanel.contains(e.target) && !this.drawingToolsButton.contains(e.target) && !this.priceCanvas.contains(e.target)) { if (this.drawingToolsMode && this.drawingToolsPanel.style.display === 'block') { this.deactivateDrawingToolsMode() } }
        }); const staticIndicatorToggles = this.indicatorsDropdown.querySelectorAll('input[type="checkbox"]:not([value^="ema_"]):not([value^="sma_"])'); staticIndicatorToggles.forEach(toggle => { toggle.addEventListener('change', (e) => { const indicatorType = e.target.value; if (this.indicators[indicatorType]) { this.indicators[indicatorType].enabled = e.target.checked; this.calculateIndicators(); this.drawCharts(); this.saveSettings() } }) }); this.lineToolButton.addEventListener('click', () => { this.closeOtherToolbarMenus('line'); if (this.lineDrawingMode) this.deactivateLineDrawingMode(); else this.activateLineDrawingMode() }); this.textToolButton.addEventListener('click', () => { this.closeOtherToolbarMenus('text'); if (this.textMode) this.deactivateTextMode(); else this.activateTextMode() }); this.fontSizeSlider.addEventListener('input', (e) => { this.textSettings.fontSize = parseInt(e.target.value); this.fontSizeDisplay.textContent = `${e.target.value}px` }); this.fontFamilySelect.addEventListener('change', (e) => { this.textSettings.fontFamily = e.target.value }); this.textColorPicker.addEventListener('change', (e) => { this.textSettings.color = e.target.value }); this.textBoldButton.addEventListener('click', () => { this.textSettings.fontWeight = this.textSettings.fontWeight === 'bold' ? 'normal' : 'bold'; this.textBoldButton.classList.toggle('active') }); this.textApplyButton.addEventListener('click', () => { this.applyTextSettingsToSelected() }); this.emoticonToolButton.addEventListener('click', () => { this.closeOtherToolbarMenus('emoticon'); if (this.emoticonMode) this.deactivateEmoticonMode(); else this.activateEmoticonMode() }); this.fibonacciToolButton.addEventListener('click', () => { this.closeOtherToolbarMenus('fibonacci'); if (this.fibonacciMode) this.deactivateFibonacciMode(); else this.activateFibonacciMode() }); this.drawingToolsButton.addEventListener('click', () => { this.closeOtherToolbarMenus('drawingTools'); if (this.drawingToolsMode) this.deactivateDrawingToolsMode(); else this.activateDrawingToolsMode() }); const drawingToolOptions = this.container.querySelectorAll('.sc-drawing-tool-option'); drawingToolOptions.forEach(option => { option.addEventListener('click', () => { const action = option.dataset.action; if (action === 'undo') { this.undoDrawing(); return } if (action === 'clear') { this.clearAllDrawings(); return } const tool = option.dataset.tool; this.selectDrawingTool(tool) }) }); const emoticonOptions = this.container.querySelectorAll('.sc-emoticon-option'); emoticonOptions.forEach(option => { option.addEventListener('click', () => { emoticonOptions.forEach(opt => opt.classList.remove('selected')); option.classList.add('selected'); this.selectedEmoticonType = option.dataset.emoticon }) }); this.emoticonSizeSlider.addEventListener('input', (e) => { this.emoticonSizeDisplay.textContent = `${e.target.value}px` }); this.indicatorsButton.addEventListener('click', (e) => { this.closeOtherToolbarMenus('indicators'); this.indicatorsDropdown.classList.toggle('active'); this.indicatorsButton.classList.toggle('active'); e.stopPropagation() }); this.indicatorsDropdown.addEventListener('click', (e) => e.stopPropagation()); this.setupColorPickers(); this.measureButton = this.container.querySelector('.sc-measure-button'); this.setupMeasureAndShortcuts(); this.setupDrawingHistory(); this.darkModeButton.addEventListener('click', () => { this.chartContainer.classList.toggle('dark-mode'); this.config.darkMode = this.chartContainer.classList.contains('dark-mode'); this.updateDarkModeIcon(); this.updateConfig(); this.drawCharts() }); this.chartTypeButton.addEventListener('click', (e) => {
            this.closeOtherToolbarMenus('chartType');
            this.chartTypeDropdown.classList.toggle('active');
            this.chartTypeButton.classList.toggle('active');
            e.stopPropagation();
        });
        this.chartTypeDropdown.addEventListener('click', (e) => e.stopPropagation());
        this.container.querySelectorAll('.sc-charttype-option').forEach(option => {
            option.addEventListener('click', () => {
                this.setChartType(option.dataset.value);
                this.chartTypeDropdown.classList.remove('active');
                this.chartTypeButton.classList.remove('active');
            });
        });
        this.maximizeButton.addEventListener('click', () => {
            this._ensureFullscreenLogo();
            const isFull = this.chartContainer.classList.contains('fullscreen'); this.chartContainer.classList.toggle('fullscreen'); document.body.style.overflow = !isFull ? 'hidden' : ''; this.config.maxVisibleCandles = !isFull ? 200 : this.getMaxVisibleCandles(); if (isFull && this.config.visibleCandles > this.config.maxVisibleCandles) { const rightEdge = this.config.dataOffset + this.config.visibleCandles; this.config.visibleCandles = this.config.maxVisibleCandles; this.config.dataOffset = Math.max(0, rightEdge - this.config.visibleCandles) }
            this.resizeCanvases()
        }); document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete') { if (this.selectedLineIndex !== null) { this.deleteSelectedLine(); e.preventDefault() } else if (this.selectedTextIndex !== null) { this.deleteSelectedText(); e.preventDefault() } else if (this.selectedEmoticonIndex !== null) { this.deleteSelectedEmoticon(); e.preventDefault() } else if (this.selectedFibonacciIndex !== null) { this.deleteSelectedFibonacci(); e.preventDefault() } else if (this.selectedArrowIndex !== null) { this.deleteSelectedArrowUniversal(); e.preventDefault() } else if (this.selectedRectangleIndex !== null) { this.deleteSelectedRectangleUniversal(); e.preventDefault() } else if (this.selectedCircleIndex !== null) { this.deleteSelectedCircleUniversal(); e.preventDefault() } else if (this.selectedShapeIndex !== null && this.selectedDrawingTool === 'arrow') { this.deleteSelectedArrow(); e.preventDefault() } else if (this.selectedShapeIndex !== null && this.selectedDrawingTool === 'rectangle') { this.deleteSelectedRectangle(); e.preventDefault() } else if (this.selectedShapeIndex !== null && this.selectedDrawingTool === 'circle') { this.deleteSelectedCircle(); e.preventDefault() } }
            if (e.key === 'Escape') {
                const toolbarMenus = [
                    [this.chartTypeDropdown, this.chartTypeButton],
                    [this.timeframeDropdown, this.timeframeButton],
                    [this.indicatorsDropdown, this.indicatorsButton]
                ];
                toolbarMenus.forEach(([menu, button]) => {
                    if (menu) menu.classList.remove('active');
                    if (button) button.classList.remove('active');
                });
                if (this.draggedLimitOrder) { this.cancelLimitOrderDrag() } else if (this.lineDrawingMode) { this.deactivateLineDrawingMode() } else if (this.textMode) { this.deactivateTextMode() } else if (this.emoticonMode) { this.deactivateEmoticonMode() } else if (this.fibonacciMode) { this.deactivateFibonacciMode() } else if (this.drawingToolsMode) { this.deactivateDrawingToolsMode() } else if (this.draggedLine) { this.lines[this.draggedLine.index] = JSON.parse(JSON.stringify(this.draggedLine.originalLine)); this.draggedLine = null; this.drawCharts() } else if (this.chartContainer.classList.contains('fullscreen')) {
                    this.chartContainer.classList.remove('fullscreen'); document.body.style.overflow = ''; this.config.maxVisibleCandles = this.getMaxVisibleCandles(); if (this.config.visibleCandles > this.config.maxVisibleCandles) { const rightEdge = this.config.dataOffset + this.config.visibleCandles; this.config.visibleCandles = this.config.maxVisibleCandles; this.config.dataOffset = Math.max(0, rightEdge - this.config.visibleCandles) }
                    this.resizeCanvases()
                }
                e.preventDefault()
            }
        }); this.priceCanvas.addEventListener('dblclick', (e) => { if (this.lineDrawingMode) { this.deactivateLineDrawingMode(); e.preventDefault() } }); this.verticalScaleArea.addEventListener('mousedown', (e) => { this.scalingDragStartY = e.clientY; this.scalingActive = !0; e.preventDefault() }); this.verticalScaleArea.addEventListener('touchstart', (e) => { if (e.touches.length === 1) { this.scalingDragStartY = e.touches[0].clientY; this.scalingActive = !0; e.preventDefault() } }); document.addEventListener('mousemove', (e) => { if (this.scalingActive) { const dy = e.clientY - this.scalingDragStartY; this.scalingDragStartY = e.clientY; this.config.verticalScaleFactor *= (1 + (dy < 0 ? Math.abs(dy) : -dy) * 0.01); this.config.verticalScaleFactor = Math.max(0.1, this.config.verticalScaleFactor); this.drawCharts() } }); document.addEventListener('touchmove', (e) => { if (this.scalingActive && e.touches.length === 1) { const dy = e.touches[0].clientY - this.scalingDragStartY; this.scalingDragStartY = e.touches[0].clientY; this.config.verticalScaleFactor *= (1 + (dy < 0 ? Math.abs(dy) : -dy) * 0.01); this.config.verticalScaleFactor = Math.max(0.1, this.config.verticalScaleFactor); this.drawCharts(); e.preventDefault() } }); document.addEventListener('mouseup', () => this.scalingActive = !1); document.addEventListener('touchend', () => this.scalingActive = !1); this.priceCanvas.addEventListener('mousedown', (e) => {
            // Right button belongs to the contextmenu handler; don't let it start a pan
            // or drop a line point underneath the menu.
            if (e.button === 2) return;
            const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top;
            // Crosshair (+) button on the price axis
            if (this.findCrosshairAddButtonAt(x, y)) { this.handleCrosshairAddButtonClick(x, y); e.preventDefault(); return; }
            // Working orders: cancel via the badge (x)
            const loClose = this.findLimitOrderCloseAt(x, y);
            if (loClose) { this.cancelLimitOrder(loClose.order); e.preventDefault(); return; }
            // Chart Analyzer levels: the badge (x) drops the whole plan
            const aiClose = this.findAIPriceLevelCloseAt(x, y);
            if (aiClose) { this.dismissAIPriceLevels(); e.preventDefault(); return; }
            // User price lines: delete via the badge (x), or drag the line to move it
            const plClose = this.findPriceLineCloseAt(x, y);
            if (plClose) { this.removePriceLine(plClose.line.id); e.preventDefault(); return; }
            const plHit = this.findPriceLineAt(x, y);
            if (plHit) { this.startPriceLineDrag(plHit.line, e.clientY); e.preventDefault(); return; }
            // Panel close button: check if clicking on an X button
            const closeKey = this.findPanelCloseButtonAt(x, y);
            if (closeKey) { this.closePanelIndicator(closeKey); e.preventDefault(); return; }
            // Panel resize: check if clicking on a separator
            const sepHit = this.findPanelSeparatorAtY(y);
            if (sepHit) {
                this.panelResizing = true;
                this.panelResizeStartY = e.clientY;
                this.panelResizeKey = sepHit.key;
                this.panelResizeStartHeight = this.indicatorPanels[sepHit.key].height;
                // If dragging the top separator of panel index > 0, we resize the panel above
                if (sepHit.panelIndex > 0) {
                    const abovePanel = sepHit.panels[sepHit.panelIndex - 1];
                    this.panelResizeAboveKey = abovePanel.key;
                    this.panelResizeAboveStartHeight = this.indicatorPanels[abovePanel.key].height;
                } else {
                    // First panel - dragging resizes main chart area (just grow/shrink this panel)
                    this.panelResizeAboveKey = null;
                    this.panelResizeAboveStartHeight = 0;
                }
                this.priceCanvas.style.cursor = 'row-resize';
                e.preventDefault();
                return;
            }
            if (this.lineDrawingMode) { this.handleLineDrawingMouseDown(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'hline') { this.handleDrawHorizontalLineAtPrice(this.priceAtY(y)); this.deactivateDrawingToolsMode(); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'arrow') { this.handleArrowMouseDown(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'rectangle') { this.handleRectangleMouseDown(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'circle') { this.handleCircleMouseDown(x, y, e); e.preventDefault(); return }
            if (this.fibonacciMode) { this.handleFibonacciMouseDown(x, y, e); e.preventDefault(); return }
            if (this.textMode) { const handledTextClick = this.addTextAnnotation(x, y); e.preventDefault(); return }
            if (this.emoticonMode) { this.addEmoticon(x, y); e.preventDefault(); return }
            const clickedLimitOrder = this.findLimitOrderAt(x, y); if (clickedLimitOrder) { this.startDraggingLimitOrder(clickedLimitOrder, e.clientY); e.preventDefault(); return }
            const clickedLine = this.findClickedLine(x, y); if (clickedLine) { this.startDraggingLine(clickedLine, x, y); e.preventDefault(); return }
            const clickedTextIndex = this.findClickedText(x, y); if (clickedTextIndex !== -1) { this.handleTextClick(clickedTextIndex, x, y); e.preventDefault(); return }
            const clickedEmoticonIndex = this.findClickedEmoticon(x, y); if (clickedEmoticonIndex !== -1) { this.handleEmoticonClick(clickedEmoticonIndex, x, y); e.preventDefault(); return }
            const clickedArrowIndex = this.findClickedArrow(x, y); if (clickedArrowIndex !== null) { this.handleArrowClick(clickedArrowIndex, x, y); e.preventDefault(); return }
            const clickedRectangleIndex = this.findClickedRectangle(x, y); if (clickedRectangleIndex !== null) { this.handleRectangleClick(clickedRectangleIndex, x, y); e.preventDefault(); return }
            const clickedCircleIndex = this.findClickedCircle(x, y); if (clickedCircleIndex !== null) { this.handleCircleClick(clickedCircleIndex, x, y); e.preventDefault(); return }
            const clickedFibonacciIndex = this.findClickedFibonacci(x, y); if (clickedFibonacciIndex !== null) { this.handleFibonacciClick(clickedFibonacciIndex, x, y); e.preventDefault(); return }
            if (this.selectedLineIndex !== null) { this.selectedLineIndex = null; this.drawCharts() }
            if (this.selectedTextIndex !== null) { this.selectedTextIndex = null; this.drawCharts() }
            if (this.selectedEmoticonIndex !== null) { this.selectedEmoticonIndex = null; this.drawCharts() }
            if (this.selectedArrowIndex !== null) { this.selectedArrowIndex = null; this.drawCharts() }
            if (this.selectedRectangleIndex !== null) { this.selectedRectangleIndex = null; this.drawCharts() }
            if (this.selectedCircleIndex !== null) { this.selectedCircleIndex = null; this.drawCharts() }
            if (this.selectedFibonacciIndex !== null) { this.selectedFibonacciIndex = null; this.drawCharts() }
            if (x < this.getCanvasWidth() - this.config.padding.right) { this.isDragging = !0; this.dragStartX = e.clientX; this.dragStartY = e.clientY; this.dragStartOffset = this.config.dataOffset; this.dragStartPriceOffset = this.config.priceOffset; this.priceCanvas.classList.add('dragging'); e.preventDefault() }
        }); this.priceCanvas.addEventListener('touchstart', (e) => { if (e.touches.length === 1) { const rect = this.priceCanvas.getBoundingClientRect(); const x = e.touches[0].clientX - rect.left; const touchedOrder = this.findLimitOrderAt(x, e.touches[0].clientY - rect.top); if (touchedOrder) { this.startDraggingLimitOrder(touchedOrder, e.touches[0].clientY); e.preventDefault(); return } if (x < this.getCanvasWidth() - this.config.padding.right) { this.isDragging = !0; this.dragStartX = e.touches[0].clientX; this.dragStartY = e.touches[0].clientY; this.dragStartOffset = this.config.dataOffset; this.dragStartPriceOffset = this.config.priceOffset; this.priceCanvas.classList.add('dragging'); e.preventDefault() } } }); this.priceCanvas.addEventListener('contextmenu', (e) => { if (this.lineDrawingMode && this.drawingLine) { this.drawingLine = !1; this.currentLine = null; this.deactivateLineDrawingMode(); this.drawCharts(); e.preventDefault(); return } if (this._longPressMenuAt && Date.now() - this._longPressMenuAt < 1000) { e.preventDefault(); return } const rect = this.priceCanvas.getBoundingClientRect(); if (this.openCandleContextMenu(e.clientX - rect.left, e.clientY - rect.top)) e.preventDefault() }); this.setupLongPressMenu(); this.setupCursorTools(); this.setupLineTools(); this.setupTextTools(); this.setupShapeTools(); this.setupFibTools(); this.setupPatternTools(); this.setupForecastTools(); this.setupEmojiPicker(); this.setupMagnet(); this.setupBoxZoom(); this.setupRemoveMenu(); this.setupChartLogo(); this._setupStripCollapse(); this._mountExternalStrip(); this.priceCanvas.addEventListener('mousemove', (e) => {
            if (this.draggedLimitOrder || this.isDragging || this.panelResizing) return;
            const rect = this.priceCanvas.getBoundingClientRect(); const hit = this.findLimitOrderAt(e.clientX - rect.left, e.clientY - rect.top);
            const hoverIndex = hit ? hit.index : null;
            if (hoverIndex !== this.hoveredLimitOrderIndex) { this.hoveredLimitOrderIndex = hoverIndex; this.drawCharts() }
            if (hit) this.priceCanvas.style.cursor = 'grab'; else if (this.priceCanvas.style.cursor === 'grab') this.priceCanvas.style.cursor = 'default';
        }); this.priceCanvas.addEventListener('mouseleave', () => { if (this.crosshairMenuOpen) return; this.lastMouseX = null; this.lastMouseY = null; this.mouseIsOverChart = !1; if (this.hoveredLimitOrderIndex !== null) this.hoveredLimitOrderIndex = null; this.hoveredPriceLineId = null; this.hoveredPriceLineCloseId = null; this.hoveredLimitOrderCloseIndex = null; this.hoveredAIPriceLevelCloseIndex = null; if (!this.panelResizing) this.drawCharts() }); document.addEventListener('mousemove', (e) => {
            // Panel resize drag handling
            if (this.panelResizing) {
                const dy = e.clientY - this.panelResizeStartY;
                if (this.panelResizeAboveKey) {
                    let newAboveH = this.panelResizeAboveStartHeight + dy;
                    let newBelowH = this.panelResizeStartHeight - dy;
                    newAboveH = Math.max(this.panelMinHeight, Math.min(this.panelMaxHeight, newAboveH));
                    newBelowH = Math.max(this.panelMinHeight, Math.min(this.panelMaxHeight, newBelowH));
                    this.indicatorPanels[this.panelResizeAboveKey].height = newAboveH;
                    this.indicatorPanels[this.panelResizeKey].height = newBelowH;
                } else {
                    let newH = this.panelResizeStartHeight - dy;
                    newH = Math.max(this.panelMinHeight, Math.min(this.panelMaxHeight, newH));
                    this.indicatorPanels[this.panelResizeKey].height = newH;
                }
                this.drawCharts();
                e.preventDefault();
                return;
            }
            if (this.draggedPriceLine) { this.handlePriceLineDrag(e.clientY); e.preventDefault(); return }
            if (this.draggedLimitOrder) { this.handleLimitOrderDrag(e.clientY); e.preventDefault(); return }
            if (this.isDragging) {
                const distX = e.clientX - this.dragStartX; const pxPerCandle = this.calculateCandleWidth() + this.config.spacing; const totalShift = distX / pxPerCandle; const wholeCandleShift = Math.floor(totalShift); const requestedOffset = this.dragStartOffset - wholeCandleShift; let newOffset = Math.max(0, requestedOffset); if (this.stockData.length > 0) { newOffset = Math.min(newOffset, this.stockData.length - 1) } else { newOffset = 0 }
                this.config.dataOffset = newOffset; if (newOffset === 0 && !this.isLoadingHistoricalData && this.onReachingStartCallback) { this.isLoadingHistoricalData = true; this.onReachingStartCallback(); } this.pixelOffset = newOffset === 0 && requestedOffset <= 0 ? 0 : (totalShift - wholeCandleShift) * pxPerCandle; if (this.stockData.length === 0) { this.isViewPinnedToRightEdge = !0 } else { const fullyScrolledRightOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.isViewPinnedToRightEdge = (this.config.dataOffset === fullyScrolledRightOffset) }
                const distY = e.clientY - this.dragStartY; const drawingH = this.getPriceChartHeight(); const raw = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); const expanded = this.applyVerticalScale(raw); const rng = expanded.max - expanded.min; const pricePerPixel = rng / drawingH; const dPrice = distY * pricePerPixel; this.config.priceOffset = this.dragStartPriceOffset + dPrice; this.drawCharts(); e.preventDefault()
            }
            if (this.draggingTextIndex !== null) { this.handleTextDrag(e) }
            if (this.draggingEmoticonIndex !== null) { this.handleEmoticonDrag(e) }
            if (this.draggingArrowIndex !== null) { this.handleArrowDrag(e) }
            if (this.draggingRectangleIndex !== null) { this.handleRectangleDrag(e) }
            if (this.draggingCircleIndex !== null) { this.handleCircleDrag(e) }
        }); document.addEventListener('touchmove', (e) => {
            if (this.draggedLimitOrder && e.touches.length === 1) { this.handleLimitOrderDrag(e.touches[0].clientY); e.preventDefault(); return }
            if (this.isDragging && e.touches.length === 1) {
                const distX = e.touches[0].clientX - this.dragStartX; const pxPerCandle = this.calculateCandleWidth() + this.config.spacing; const totalShift = distX / pxPerCandle; const wholeCandleShift = Math.floor(totalShift); const requestedOffset = this.dragStartOffset - wholeCandleShift; let newOffset = Math.max(0, requestedOffset); if (this.stockData.length > 0) { newOffset = Math.min(newOffset, this.stockData.length - 1) } else { newOffset = 0 }
                this.config.dataOffset = newOffset; if (newOffset === 0 && !this.isLoadingHistoricalData && this.onReachingStartCallback) { this.isLoadingHistoricalData = true; this.onReachingStartCallback(); } this.pixelOffset = newOffset === 0 && requestedOffset <= 0 ? 0 : (totalShift - wholeCandleShift) * pxPerCandle; if (this.stockData.length === 0) { this.isViewPinnedToRightEdge = !0 } else { const fullyScrolledRightOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.isViewPinnedToRightEdge = (this.config.dataOffset === fullyScrolledRightOffset) }
                const distY = e.touches[0].clientY - this.dragStartY; const drawH = this.getPriceChartHeight(); const raw = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); const exp = this.applyVerticalScale(raw); const rng = exp.max - exp.min; const pp = rng / drawH; const dPrice = distY * pp; this.config.priceOffset = this.dragStartPriceOffset + dPrice; this.drawCharts(); e.preventDefault()
            }
        }); document.addEventListener('mouseup', () => {
            if (this.draggedPriceLine) { this.endPriceLineDrag(); return }
            if (this.draggedLimitOrder) { this.endLimitOrderDrag(); return }
            if (this.panelResizing) { this.panelResizing = false; this.panelResizeKey = null; this.panelResizeAboveKey = null; this.priceCanvas.style.cursor = 'default'; this.drawCharts(); return }
            if (this.drawingArrow) this.endDrawingArrow(); if (this.drawingRectangle) this.endDrawingRectangle(); if (this.drawingCircle) this.endDrawingCircle(); if (this.drawingFibonacci) this.endDrawingFibonacci(); if (this.draggedLine) this.endDraggingLine(); if (this.isDragging) { this.isDragging = !1; this.pixelOffset = 0; this.priceCanvas.classList.remove('dragging'); this.drawCharts() }
            if (this.draggingTextIndex !== null) { this.endTextDrag() }
            if (this.draggingEmoticonIndex !== null) { this.endEmoticonDrag() }
            if (this.draggingArrowIndex !== null) { this.endArrowDrag() }
            if (this.draggingRectangleIndex !== null) { this.endRectangleDrag() }
            if (this.draggingCircleIndex !== null) { this.endCircleDrag() }
        }); document.addEventListener('touchend', () => { if (this.draggedLimitOrder) { this.endLimitOrderDrag(); return } if (this.isDragging) { this.isDragging = !1; this.pixelOffset = 0; this.priceCanvas.classList.remove('dragging'); this.drawCharts() } }); this.priceCanvas.addEventListener('wheel', (e) => {
            const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; if (x >= this.getCanvasWidth() - this.config.padding.right) return; e.preventDefault(); const prevRight = this.getZoomAnchorRight(); if (e.deltaY < 0) { if (this.config.visibleCandles > 10) this.config.visibleCandles = Math.floor(this.config.visibleCandles * 0.9); } else { const ceiling = this.getZoomOutCeiling(); let newVis = Math.min(ceiling, Math.floor(this.config.visibleCandles * 1.1)); if (this.config.visibleCandles <= 10) newVis = 11; if (newVis <= ceiling) this.config.visibleCandles = newVis }
            this.config.dataOffset = Math.max(0, prevRight - this.config.visibleCandles); if (this.stockData.length === 0) { this.isViewPinnedToRightEdge = !0 } else { const fullyScrolledRightOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.isViewPinnedToRightEdge = (this.config.dataOffset === fullyScrolledRightOffset) }
            this.drawCharts()
        }); let initialPinch = 0, initialCandleCount = 0; this.priceCanvas.addEventListener('touchstart', (e) => { if (e.touches.length === 2) { initialPinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); initialCandleCount = this.config.visibleCandles; e.preventDefault() } }); this.priceCanvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialPinch > 0) {
                const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); const factor = initialPinch / dist; const prevRight = this.getZoomAnchorRight(); let newVis = Math.max(10, Math.min(this.config.maxVisibleCandles, Math.round(initialCandleCount * factor))); if (newVis !== this.config.visibleCandles) {
                    this.config.visibleCandles = newVis; this.config.dataOffset = Math.max(0, prevRight - this.config.visibleCandles); if (this.stockData.length === 0) { this.isViewPinnedToRightEdge = !0 } else { const fullyScrolledRightOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.isViewPinnedToRightEdge = (this.config.dataOffset === fullyScrolledRightOffset) }
                    this.drawCharts()
                }
                e.preventDefault()
            }
        }); this.priceCanvas.addEventListener('touchend', (e) => { if (e.touches.length < 2) initialPinch = 0 }); this.priceCanvas.addEventListener('click', (e) => { if (!this.config.branding.enabled) return; const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const padX = 10, padY = 2; const brandY = this.getCanvasHeight() - padY; this.priceCtx.save(); this.priceCtx.font = this.config.branding.font; const txtW = this.priceCtx.measureText(this.config.branding.text).width; this.priceCtx.restore(); if (x >= padX && x <= padX + txtW + 5 && y >= brandY - 15 && y <= brandY + 5) { window.open(this.config.branding.url, '_blank') } }); this.priceCanvas.addEventListener('mousemove', (e) => {
            if (!this.priceCanvas) return; const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; if (this.lineDrawingMode && this.drawingLine) { this.handleLineDrawingMouseMove(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'arrow' && this.drawingArrow) { this.handleArrowMouseMove(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'rectangle' && this.drawingRectangle) { this.handleRectangleMouseMove(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'circle' && this.drawingCircle) { this.handleCircleMouseMove(x, y, e); e.preventDefault(); return }
            if (this.fibonacciMode && this.drawingFibonacci) { this.handleFibonacciMouseMove(x, y, e); e.preventDefault(); return }
            if (this.draggedLine) { this.handleLineDragging(x, y, e); e.preventDefault(); return }
            if (this.isDragging || this.crosshairMenuOpen) return; this.lastMouseX = x; this.lastMouseY = y; const chartLeft = this.config.padding.left; const chartRight = this.getCanvasWidth() - this.config.padding.right; const chartTop = this.config.padding.top; const chartBottom = this.config.padding.top + this.getPriceChartHeight(); this.mouseIsOverChart = (x >= chartLeft && x <= chartRight && y >= chartTop && y <= chartBottom); if (!this.textMode && !this.lineDrawingMode && !this.emoticonMode && !this.draggingTextIndex && !this.draggingEmoticonIndex && !this.draggingArrowIndex && !this.draggingRectangleIndex && !this.draggingCircleIndex) { const loClose = this.findLimitOrderCloseAt(x, y); this.hoveredLimitOrderCloseIndex = loClose ? loClose.index : null; const aiClose = this.findAIPriceLevelCloseAt(x, y); this.hoveredAIPriceLevelCloseIndex = aiClose ? aiClose.index : null; const plClose = this.findPriceLineCloseAt(x, y); const plHover = plClose || this.findPriceLineAt(x, y); this.hoveredPriceLineId = plHover ? plHover.line.id : null; this.hoveredPriceLineCloseId = plClose ? plClose.line.id : null; const closeHit = loClose || aiClose || this.findPanelCloseButtonAt(x, y) || this.findCrosshairAddButtonAt(x, y) || (plHover ? { priceLine: !0 } : null); if (closeHit) { this.priceCanvas.style.cursor = closeHit.priceLine ? (plClose ? 'pointer' : 'ns-resize') : 'pointer' } else { const sepHit = this.findPanelSeparatorAtY(y); if (sepHit) { this.priceCanvas.style.cursor = 'row-resize' } else { const hoveredTextIndex = this.findClickedText(x, y); const hoveredEmoticonIndex = this.findClickedEmoticon(x, y); const hoveredArrowIndex = this.findClickedArrow(x, y); const hoveredRectangleIndex = this.findClickedRectangle(x, y); const hoveredCircleIndex = this.findClickedCircle(x, y); const hoveredFibonacciIndex = this.findClickedFibonacci(x, y); if (hoveredTextIndex !== -1 || hoveredEmoticonIndex !== -1 || hoveredArrowIndex !== null || hoveredRectangleIndex !== null || hoveredCircleIndex !== null || hoveredFibonacciIndex !== null) { this.priceCanvas.style.cursor = 'pointer' } else { this.priceCanvas.style.cursor = 'default' } } } }
            this.drawCharts()
        }); if (this.cameraButton) { this.cameraButton.addEventListener('click', () => this.copyChartToClipboard()) }
        if (this.fitViewButton) { this.fitViewButton.addEventListener('click', () => this.refreshChartWithLatestCandle()) }
        // Touch tracking feeds the same crosshair path the mouse uses, so the
        // snapping and the empty-space behaviour stay identical on both.
        this.priceCanvas.addEventListener('touchmove', (e) => {
            if (this.isDragging || e.touches.length !== 1) return;
            const rect = this.priceCanvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            const chartLeft = this.config.padding.left;
            const chartRight = this.getCanvasWidth() - this.config.padding.right;
            const chartTop = this.config.padding.top;
            const chartBottom = chartTop + this.getPriceChartHeight();
            this.lastMouseX = x; this.lastMouseY = y;
            this.mouseIsOverChart = (x >= chartLeft && x <= chartRight && y >= chartTop && y <= chartBottom);
            this.drawCharts();
        })
    }
    // ---- Crisp rendering -------------------------------------------------------------
    // The canvas's CSS box is often a fractional size (692.8px tall). Rounding the
    // backing store makes the browser stretch it to fit, which softens everything.
    // The device-pixel-content-box observer reports the exact device pixels the box
    // covers, so the bitmap maps 1:1 to the screen. Browsers without it (Safari) fall
    // back to rounding.
    _sizeBacking(rect, dpr) {
        const c = this.priceCanvas, b = this._devBox;
        let w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr);
        if (b && Math.abs(b.cw - rect.width) < 0.01 && Math.abs(b.ch - rect.height) < 0.01) { w = b.w; h = b.h }
        if (c.width !== w) c.width = w;
        if (c.height !== h) c.height = h;
        this._watchDevicePixels();
    }
    _watchDevicePixels() {
        if (this._dpro !== undefined) return;
        this._dpro = null;
        if (typeof ResizeObserver === 'undefined') return;
        try {
            const ro = new ResizeObserver((entries) => {
                const e = entries[entries.length - 1], dp = e.devicePixelContentBoxSize && e.devicePixelContentBoxSize[0];
                if (!dp) return;
                const c = this.priceCanvas, r = this._contentRect();
                this._devBox = { w: dp.inlineSize, h: dp.blockSize, cw: r.width, ch: r.height };
                this._cssWidth = r.width; this._cssHeight = r.height;
                if (c.width !== dp.inlineSize || c.height !== dp.blockSize) { c.width = dp.inlineSize; c.height = dp.blockSize; this.drawCharts() }
            });
            ro.observe(this.priceCanvas, { box: 'device-pixel-content-box' });
            this._dpro = ro;
        } catch (e) { this._dpro = null }
    }
    // Scale from CSS px to device px on each axis (equal to devicePixelRatio, give or take the fit).
    _scaleX() { return this._sx || this._dpr || 1 }
    _scaleY() { return this._sy || this._dpr || 1 }
    // Snap a CSS coordinate to a device-pixel edge (for filled rects).
    _snapX(x) { const s = this._scaleX(); return Math.round(x * s) / s }
    _snapY(y) { const s = this._scaleY(); return Math.round(y * s) / s }
    // Centre of the device pixel a 1-device-pixel line through x / y should use.
    _lineX(x) { const s = this._scaleX(); return (Math.floor(x * s) + 0.5) / s }
    _lineY(y) { const s = this._scaleY(); return (Math.floor(y * s) + 0.5) / s }
    // Horizontal line at the current lineWidth rounded to whole device pixels, edges on device pixels (pane levels, zero lines, separators).
    _hLine(ctx, x1, x2, y) { const s = this._scaleY(), n = Math.max(1, Math.round(ctx.lineWidth * s)), yy = (Math.round(y * s - n / 2) + n / 2) / s; const lw = ctx.lineWidth; ctx.lineWidth = n / s; ctx.beginPath(); ctx.moveTo(x1, yy); ctx.lineTo(x2, yy); ctx.stroke(); ctx.lineWidth = lw }
    // The canvas's drawing area in CSS px: its box minus any border (padding is 0).
    _contentRect() {
        const c = this.priceCanvas, r = c.getBoundingClientRect(), cs = getComputedStyle(c);
        const bx = (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0);
        const by = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
        return { width: Math.max(0, r.width - bx), height: Math.max(0, r.height - by) };
    }
    resizeCanvases() {
        const dpr = window.devicePixelRatio || 1;
        if (this.chartContainer.classList.contains('fullscreen') && !this.sideLayout) {
            this.priceCanvas.style.height = 'calc(100vh - 10px)';
            this.priceCanvas.style.width = '100%';
            setTimeout(() => {
                const rect = this._contentRect();
                this._cssWidth = rect.width;
                this._cssHeight = rect.height;
                this._dpr = dpr;
                this._sizeBacking(rect, dpr);
                this.drawCharts();
            }, 50);
        } else {
            this.priceCanvas.style.height = '100%';
            this.priceCanvas.style.width = '100%';
            const rect = this._contentRect();
            this._cssWidth = rect.width;
            this._cssHeight = rect.height;
            this._dpr = dpr;
            this._sizeBacking(rect, dpr);
            this.drawCharts();
        }
    }
    refreshChartWithLatestCandle() { if (this.stockData && this.stockData.length) { this.config.dataOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.config.priceOffset = 0; this.config.verticalScaleFactor = 1.0; this.isViewPinnedToRightEdge = !0; this.calculateIndicators(); this.resizeCanvases(); this.drawCharts() } }
    updateConfig() { const d = this.config.darkMode; this.config.currentTextColor = d ? this.config.darkModeColors.textColor : this.config.textColor; this.config.currentGridColor = d ? this.config.darkModeColors.gridColor : this.config.gridColor; this.config.currentCrosshairColor = d ? this.config.darkModeColors.crosshairColor : this.config.crosshairColor; this.config.currentBullColor = d ? this.config.darkModeColors.bullColor : this.config.bullColor; this.config.currentBearColor = d ? this.config.darkModeColors.bearColor : this.config.bearColor; { const cp = StockChart.loadColorPrefs(); if (cp['candles.bull']) this.config.currentBullColor = cp['candles.bull']; if (cp['candles.bear']) this.config.currentBearColor = cp['candles.bear']; } if (this.chartInfoOverlayEl) this.chartInfoOverlayEl.style.color = this.config.currentTextColor }
    updateDarkModeIcon() { this.darkModeButton.innerHTML = this.config.darkMode ? `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9 M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2 M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7 M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17 M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7 M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17 M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" /></svg>` : `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" /></svg>` }
    calculateCandleWidth() { const w = this.getCanvasWidth() - this.config.padding.left - this.config.padding.right; const effectiveCandles = this.isDeepZoom() ? (this.config.visibleCandles || 1) : Math.min(this.config.visibleCandles, this.stockData.length || 1); /* 2px floor is what stops a normal chart drawing hairlines; under deep zoom the floor drops so bars can keep shrinking past it. */ return Math.max(this.isDeepZoom() ? 0.5 : 2, (w / effectiveCandles) - this.config.spacing) }
    calculateRawPriceRange(data, off, cnt) {
        const v = data.slice(Math.max(0, off), off + cnt);

        // Collect all valid prices
        const validPrices = [];
        v.forEach(c => {
            if (c.close && typeof c.close === 'number' && !isNaN(c.close) && c.close > 0) {
                validPrices.push(c.close);
            }
            if (c.high && typeof c.high === 'number' && !isNaN(c.high) && c.high > 0) {
                validPrices.push(c.high);
            }
            if (c.low && typeof c.low === 'number' && !isNaN(c.low) && c.low > 0) {
                validPrices.push(c.low);
            }
        });

        if (validPrices.length === 0) {
            return { min: 0, max: 100 };
        }

        // Calculate median to detect outliers
        validPrices.sort((a, b) => a - b);
        const median = validPrices[Math.floor(validPrices.length / 2)];

        // Filter out extreme data anomalies only (10x away from median)
        const filtered = validPrices.filter(p => {
            const deviation = Math.abs(p - median) / median;
            return deviation < 10;
        });

        // If filtering removed everything, use original valid prices
        const finalPrices = filtered.length > 0 ? filtered : validPrices;

        const mn = Math.min(...finalPrices);
        const mx = Math.max(...finalPrices);

        return { min: mn, max: mx };
    }
    applyVerticalScale({ min, max }) { const mid = (min + max) * 0.5; let rng = (max - min) / this.config.verticalScaleFactor; rng *= (1 + this.config.verticalPadding * 2); return { min: mid - rng * 0.5, max: mid + rng * 0.5 } }
    // Pages that rebuild the chart on every ticker/timeframe switch (the two sims set
    // window.S8_CHART_KEEP_ZOOM) hand the zoom from the old chart to the new one,
    // keyed by the container element since that survives the rebuild.
    getKeptZoom() {
        if (!window.S8_CHART_KEEP_ZOOM || !StockChart._keptZoom) return 0;
        return StockChart._keptZoom.get(this.container) || 0;
    }
    keepZoom() {
        if (!window.S8_CHART_KEEP_ZOOM || !(this.config.visibleCandles > 0)) return;
        // A replaced chart that never got destroyed can still redraw on resize - not its call anymore.
        if (!this.chartContainer || !this.container.contains(this.chartContainer)) return;
        (StockChart._keptZoom || (StockChart._keptZoom = new WeakMap())).set(this.container, this.config.visibleCandles);
    }

    drawCharts() {
        this.keepZoom();
        this._fitShortSeries();
        this._syncDensity();
        const ctx = this.priceCtx;
        const dpr = this._dpr || window.devicePixelRatio || 1;
        const cw = this.getCanvasWidth(), chh = this._cssHeight || this.priceCanvas.clientHeight;
        this._sx = cw ? this.priceCanvas.width / cw : dpr; this._sy = chh ? this.priceCanvas.height / chh : dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(this._sx, this._sy);
        this.drawPriceChart();
        if (this.pixelOffset !== 0) { ctx.save(); ctx.translate(this.pixelOffset, 0); }
        this.updateLinePositions();
        this.drawLines(ctx);
        if (this.drawLineTools) this.drawLineTools(ctx);
        this.drawArrows(ctx);
        this.drawRectangles(ctx);
        this.drawCircles(ctx);
        this.drawTextAnnotations(ctx);
        this.drawEmoticons(ctx);
        this.drawFibonacciRetracements(ctx);
        this.drawTradeMarkers(ctx);
        if (this.pixelOffset !== 0) { ctx.restore(); }
        if (this.indicators.keyLevels && this.indicators.keyLevels.enabled) this.drawKeyLevels(ctx);
        this.drawAIPriceLevels(ctx);
        this.drawPositionLine(ctx, 'line');
        this.drawLimitOrders(ctx);
        this.drawPositionLine(ctx, 'tag');
        this.drawPriceLines(ctx);
        this.drawMeasure(ctx);
        if (this.mouseIsOverChart && this.lastMouseX !== null && this.lastMouseY !== null) {
            this.drawCrosshair(ctx, this.lastMouseX, this.lastMouseY);
        } else {
            this.updateOHLCOverlay();
        }
        this._positionPatternCallout();
        this._emitLayout();
    }
    // Lets page overlays (the Community Pulse pill) sit on the floor of the price pane,
    // which rises as indicator panels are added or resized. floorY also clears the
    // branding mark, which shares that corner when no panels are open. Fires only
    // when the geometry changes, not on every draw.
    _emitLayout() {
        const priceBottomY = this.getPanelsTopY();
        const floorY = this._brandingLogoTop != null ? Math.min(priceBottomY, this._brandingLogoTop) : priceBottomY;
        const height = this.getCanvasHeight();
        const key = floorY + '|' + height;
        if (key === this._layoutKey) return;
        this._layoutKey = key;
        this.container.dispatchEvent(new CustomEvent('sc-layout', { detail: { chart: this, floorY: floorY, priceBottomY: priceBottomY, height: height }, bubbles: !0 }));
    }
    drawVolumeBars(ctx, visibleData, volumeHeight) { let maxVolume = 0; visibleData.forEach(candle => maxVolume = Math.max(maxVolume, candle.volume)); const cW = this.calculateCandleWidth(); const volumeBottomY = this.getCanvasHeight() - this.config.padding.bottom; const lead = this.getLeadSlots(); visibleData.forEach((candle, i) => { const x = this.config.padding.left + (i + lead) * (cW + this.config.spacing); const barHeight = (candle.volume / maxVolume) * volumeHeight; const isUp = candle.close >= candle.open; const baseColorHex = isUp ? this.config.currentBullColor : this.config.currentBearColor; const r = parseInt(baseColorHex.slice(1, 3), 16); const g = parseInt(baseColorHex.slice(3, 5), 16); const b = parseInt(baseColorHex.slice(5, 7), 16); ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`; ctx.fillRect(x, volumeBottomY - barHeight, cW, barHeight) }); if (this.indicators.volumeMA.enabled && this.indicators.volumeMA.data.length) { this.drawVolumeMA(ctx, volumeHeight, maxVolume) } }
    drawVolumeMA(ctx, volumeHeight, maxVolume) {
        const volumeMAData = this.indicators.volumeMA.data; const cW = this.calculateCandleWidth(); const volumeBottomY = this.getCanvasHeight() - this.config.padding.bottom; ctx.strokeStyle = this.indicators.volumeMA.color; ctx.lineWidth = 1; ctx.beginPath(); let started = !1; for (let i = 0; i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < volumeMAData.length && volumeMAData[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const normalizedVolume = volumeMAData[dataIndex] / maxVolume; const y = volumeBottomY - (normalizedVolume * volumeHeight); if (!started) { ctx.moveTo(x, y); started = !0 } else { ctx.lineTo(x, y) } } }
        ctx.stroke(); if (started && volumeMAData.length > 0) { const currentVolumeMA = volumeMAData[volumeMAData.length - 1]; if (currentVolumeMA !== null && currentVolumeMA !== undefined) { const normalizedVolume = currentVolumeMA / maxVolume; const labelY = volumeBottomY - (normalizedVolume * volumeHeight); const labelXPosition = this.getCanvasWidth() - this.config.padding.right; const labelText = this.formatVolume(currentVolumeMA); const labelHeight = 16; const labelPadding = 4; const borderRadius = 2; ctx.font = '11px Arial'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; const textWidth = ctx.measureText(labelText).width; const labelWidth = textWidth + 2 * labelPadding; const rectX = labelXPosition; const rectY = labelY - labelHeight / 2; const clampedY = Math.max(volumeBottomY - volumeHeight + labelHeight / 2, Math.min(labelY, volumeBottomY - labelHeight / 2)); const clampedRectY = clampedY - labelHeight / 2; ctx.fillStyle = this.indicators.volumeMA.color; ctx.beginPath(); ctx.moveTo(rectX + borderRadius, clampedRectY); ctx.lineTo(rectX + labelWidth - borderRadius, clampedRectY); ctx.arcTo(rectX + labelWidth, clampedRectY, rectX + labelWidth, clampedRectY + borderRadius, borderRadius); ctx.lineTo(rectX + labelWidth, clampedRectY + labelHeight - borderRadius); ctx.arcTo(rectX + labelWidth, clampedRectY + labelHeight, rectX + labelWidth - borderRadius, clampedRectY + labelHeight, borderRadius); ctx.lineTo(rectX + borderRadius, clampedRectY + labelHeight); ctx.arcTo(rectX, clampedRectY + labelHeight, rectX, clampedRectY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rectX, clampedRectY + borderRadius); ctx.arcTo(rectX, clampedRectY, rectX + borderRadius, clampedRectY, borderRadius); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.fillText(labelText, rectX + labelPadding, clampedY) } }
    }
    drawPriceChart() {
        const ctx = this.priceCtx;
        const w = this.getCanvasWidth(), h = this.getCanvasHeight();
        ctx.clearRect(0, 0, w, h);

        // Fill background
        ctx.fillStyle = this.config.darkMode ? '#000000' : '#ffffff';
        ctx.fillRect(0, 0, w, h);

        // Calculate dynamic heights based on enabled panels
        const priceChartH = this.getPriceChartHeight();
        const volumeTopY = this.getVolumeTopY();
        const panelsTopY = this.getPanelsTopY();

        const visibleData = this.stockData.slice(Math.max(0, this.config.dataOffset), this.config.dataOffset + this.config.visibleCandles);

        const raw = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
        let { min, max } = this.applyVerticalScale(raw);
        min += this.config.priceOffset;
        max += this.config.priceOffset;
        this.config.padding.right = max >= 10000 ? 80 : 60;

        // Cache the live price scale so DOM overlays (e.g. the pattern callout)
        // can map a candle to a pixel position outside of draw time
        this._lastPriceScale = { min, max, chartH: priceChartH };

        const chartLeft = this.config.padding.left, chartTop = this.config.padding.top;
        const chartW = w - chartLeft - this.config.padding.right;

        // Clip to price chart area only
        ctx.save();
        ctx.beginPath();
        ctx.rect(chartLeft, chartTop, chartW, priceChartH);
        ctx.clip();
        if (this.pixelOffset !== 0) ctx.translate(this.pixelOffset, 0);

        // Draw market hours shading first (so watermark renders on top)
        if (this.config.useAfterHoursStyling && this.getTimeframeMinutes(this.timeframe) < 1440) this.drawMarketHoursShading(ctx, visibleData);

        // Draw watermark after shading so it's not obscured
        ctx.save();
        if (this.pixelOffset !== 0) ctx.translate(-this.pixelOffset, 0);
        if (this.config.watermark.enabled) this.drawWatermark(ctx, w, h);
        ctx.restore();

        // Grid lines and axis labels share a scale sized to the usable price pane.
        const { min: nMin, max: nMax, tickSpacing } = this.calculatePriceAxisScale(min, max, priceChartH);
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        let lastGridLabel = null;
        for (let price = nMin; price <= nMax + 1e-8; price += tickSpacing) {
            const txt = s8FormatChartPrice(price);
            if (txt === lastGridLabel) continue;
            lastGridLabel = txt;
            const y = this._lineY(this.priceToYInRegion(price, min, max, priceChartH, chartTop));
            ctx.beginPath();
            ctx.moveTo(chartLeft - this.pixelOffset, y);
            ctx.lineTo(chartLeft + chartW - this.pixelOffset, y);
            ctx.stroke();
        }

        // Vertical grid lines
        const cW = this.calculateCandleWidth();
        const gridStep = this.getGridStep(); for (let i = Math.floor((this.config.dataOffset - 1) / gridStep) * gridStep; i < this.config.dataOffset + this.config.visibleCandles; i += gridStep) {
            if (i >= this.config.dataOffset - 1 && i >= 0 && i < this.stockData.length) {
                const idx = i - this.config.dataOffset;
                const x = this._lineX(chartLeft + idx * (cW + this.config.spacing) + cW * 0.5);
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(x, chartTop);
                ctx.lineTo(x, chartTop + priceChartH);
                ctx.stroke();
            }
        }

        // Draw volume bars as overlay (inside clipping region, before candles so candles draw on top)
        if (this.indicators.volume && this.indicators.volume.enabled) {
            this.drawVolumeBarsInRegion(ctx, visibleData, volumeTopY, this.volumeHeight);
        }

        // Draw candles/line chart
        if (this.config.chartType === 'line') this.drawLineChart(ctx, min, max, chartW, priceChartH);
        else if (this.getColumnPitch() < 1.5) this.drawDensitySeries(ctx, min, max, priceChartH);
        else if (this.config.chartType === 'hollow') this.drawHollowCandles(ctx, min, max, chartW, priceChartH);
        else if (this.config.chartType === 'bars') this.drawBars(ctx, min, max, chartW, priceChartH);
        else this.drawCandles(ctx, min, max, chartW, priceChartH);

        // Pulsing outline on pattern candles (drawn over the candles)
        this.drawCandlePulses(ctx, min, max, priceChartH);

        // Brighter outline on whichever candle the crosshair is over
        if (this.mouseIsOverChart && this.lastMouseX !== null) {
            this.drawHoveredCandleOutline(ctx, min, max, priceChartH);
        }

        // Draw price overlays (EMA, BB, VWAP, SAR)
        this.drawIndicators(ctx);
        this.drawVisibleExtremesMarkers(ctx, min, max, priceChartH);
        ctx.restore();

        // Draw indicator panels below volume
        let panelY = panelsTopY;

        // Helper to draw panel if enabled (with smooth panning support)
        const panelRightX = w - this.config.padding.right;
        const drawPanelIfEnabled = (key, drawFn) => {
            if (this.indicators[key] && this.indicators[key].enabled && this.indicatorPanels[key]) {
                const pH = this.indicatorPanels[key].height;
                if (this.pixelOffset !== 0) {
                    // Pass 1: clip to chart data area + translate (data shifts smoothly, right labels clipped)
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(chartLeft, panelY, chartW, pH);
                    ctx.clip();
                    ctx.translate(this.pixelOffset, 0);
                    drawFn.call(this, ctx, panelY, pH);
                    ctx.restore();
                    // Pass 2: clip to right label area only, no translate (scale labels stay fixed)
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(panelRightX, panelY, this.config.padding.right, pH);
                    ctx.clip();
                    drawFn.call(this, ctx, panelY, pH);
                    ctx.restore();
                } else {
                    drawFn.call(this, ctx, panelY, pH);
                }
                panelY += pH;
            }
        };

        // Existing panels
        drawPanelIfEnabled('rsi', this.drawRSIPanel);
        drawPanelIfEnabled('macd', this.drawMACDPanel);
        drawPanelIfEnabled('stochastic', this.drawStochasticPanel);

        // New oscillator panels
        drawPanelIfEnabled('williamsR', this.drawWilliamsRPanel);
        drawPanelIfEnabled('mfi', this.drawMFIPanel);
        drawPanelIfEnabled('roc', this.drawROCPanel);
        drawPanelIfEnabled('cci', this.drawCCIPanel);
        drawPanelIfEnabled('adx', this.drawADXPanel);
        drawPanelIfEnabled('stochasticRSI', this.drawStochasticRSIPanel);
        drawPanelIfEnabled('awesomeOscillator', this.drawAwesomeOscillatorPanel);
        drawPanelIfEnabled('trix', this.drawTRIXPanel);

        // Volume-based panels
        drawPanelIfEnabled('obv', this.drawOBVPanel);
        drawPanelIfEnabled('adl', this.drawADLPanel);
        drawPanelIfEnabled('forceIndex', this.drawForceIndexPanel);
        drawPanelIfEnabled('kst', this.drawKSTPanel);

        // Draw resize grip handles on panel separators
        this.drawPanelResizeHandles(ctx);

        // Draw other elements
        this.drawPriceScale(ctx, min, max, nMin, nMax, tickSpacing);
        this.drawIndicatorPriceLabels(ctx, min, max);
        if (this.pixelOffset !== 0) { ctx.save(); ctx.translate(this.pixelOffset, 0); }
        this.drawDateLabels(ctx);
        if (this.pixelOffset !== 0) { ctx.restore(); }
        this.drawLastPriceLabel(ctx, min, max);
        this.drawBranding(ctx);
    }
    // Helper: Convert price to Y coordinate within a specific region
    priceToYInRegion(price, pMin, pMax, regionHeight, regionTop) {
        const range = pMax - pMin;
        return regionTop + regionHeight - ((price - pMin) / range) * regionHeight;
    }
    // Draw volume bars in their dedicated region (not overlapping with indicator panels)
    drawVolumeBarsInRegion(ctx, visibleData, topY, height) {
        let maxVolume = 0;
        visibleData.forEach(candle => maxVolume = Math.max(maxVolume, candle.volume));
        // Throwing here would skip drawPriceChart's ctx.restore() and leave the price
        // clip on for every later frame (indicator panels vanish), so only lead with
        // the previous bar when it actually exists.
        const firstIndex = (this.config.dataOffset > 0 && this.stockData[this.config.dataOffset - 1]) ? -1 : 0;
        const plotData = firstIndex < 0
            ? [this.stockData[this.config.dataOffset - 1], ...visibleData]
            : visibleData;
        const cW = this.calculateCandleWidth();
        const bottomY = topY + height;
        const lead = this.getLeadSlots();

        // Zoomed far out, one translucent rect per bar stops being a profile: the
        // rects overlap, their alpha compounds, and the whole band fills in as a
        // solid wash. Collapse each pixel column to its tallest bar and draw that
        // column once, so the shape survives and the alpha stays honest.
        const pitch = this.getColumnPitch();
        if (pitch < 1.5 && maxVolume > 0) {
            const cols = new Map();
            plotData.forEach((candle, index) => {
                const i = index + firstIndex + lead;
                const col = Math.floor(this.config.padding.left + i * pitch);
                const prev = cols.get(col);
                if (!prev || candle.volume > prev.volume) cols.set(col, candle);
            });
            cols.forEach((candle, col) => {
                const barHeight = (candle.volume / maxVolume) * height;
                const hex = candle.close >= candle.open ? this.config.currentBullColor : this.config.currentBearColor;
                const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
                this._crispRect(ctx, col, bottomY - barHeight, 1, barHeight);
            });
            return;
        }

        plotData.forEach((candle, index) => {
            const i = index + firstIndex + lead;
            const x = this.config.padding.left + i * (cW + this.config.spacing);
            const barHeight = (candle.volume / maxVolume) * height;
            const isUp = candle.close >= candle.open;
            const baseColorHex = isUp ? this.config.currentBullColor : this.config.currentBearColor;
            const r = parseInt(baseColorHex.slice(1, 3), 16);
            const g = parseInt(baseColorHex.slice(3, 5), 16);
            const b = parseInt(baseColorHex.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
            this._crispRect(ctx, x, bottomY - barHeight, cW, barHeight);
        });

        // Draw Volume MA if enabled
        if (this.indicators.volumeMA.enabled && this.indicators.volumeMA.data.length) {
            this.drawVolumeMAInRegion(ctx, topY, height, maxVolume);
        }
    }
    // Draw Volume MA in the volume region
    drawVolumeMAInRegion(ctx, topY, height, maxVolume) {
        const volumeMAData = this.indicators.volumeMA.data;
        const cW = this.calculateCandleWidth();
        const bottomY = topY + height;

        ctx.strokeStyle = this.indicators.volumeMA.color;
        ctx.lineWidth = 1 * this.lineScale('volumeMA');
        ctx.beginPath();
        let started = false;

        for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
            const dataIndex = i + this.config.dataOffset;
            if (dataIndex >= 0 && dataIndex < volumeMAData.length && volumeMAData[dataIndex] !== null) {
                const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5;
                const normalizedVolume = volumeMAData[dataIndex] / maxVolume;
                const y = bottomY - (normalizedVolume * height);
                if (!started) { ctx.moveTo(x, y); started = true; }
                else { ctx.lineTo(x, y); }
            }
        }
        ctx.stroke();
    }
    // Draw RSI in its own dedicated panel below volume (TradingView style)
    drawRSIPanel(ctx, topY, height) {
        if (!this.indicators.rsi || !this.indicators.rsi.enabled || !this.indicators.rsi.data.length) return;

        const data = this.indicators.rsi.data;
        const cW = this.calculateCandleWidth();
        const leftX = this.config.padding.left;
        const rightX = this.getCanvasWidth() - this.config.padding.right;
        const bottomY = topY + height;
        const chartWidth = rightX - leftX;

        // Translucent panel background (TradingView style - allows gridlines to show through)
        ctx.fillStyle = this.config.darkMode ? 'rgba(30, 34, 45, 0.8)' : 'rgba(245, 245, 245, 0.8)';
        ctx.fillRect(leftX - this.pixelOffset, topY, chartWidth, height);

        // Draw vertical gridlines extending into panel (matching price chart gridlines)
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        const gridStep = this.getGridStep(); for (let i = Math.floor((this.config.dataOffset - 1) / gridStep) * gridStep; i < this.config.dataOffset + this.config.visibleCandles; i += gridStep) {
            if (i >= this.config.dataOffset - 1 && i >= 0 && i < this.stockData.length) {
                const idx = i - this.config.dataOffset;
                const x = this._lineX(leftX + idx * (cW + this.config.spacing) + cW * 0.5);
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator line at top
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, topY);

        // RSI reference levels
        const valueToY = (val) => topY + ((100 - val) / 100) * height;
        const levels = [80, 70, 50, 30, 20];

        // Draw horizontal reference lines (subtle, like TradingView)
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;

        levels.forEach(level => {
            const y = valueToY(level);
            this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, y);
        });
        ctx.setLineDash([]);

        // Draw RSI line
        ctx.beginPath();
        let started = false;
        for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
            const dataIndex = i + this.config.dataOffset;
            if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                const y = valueToY(data[dataIndex]);
                if (!started) { ctx.moveTo(x, y); started = true; }
                else { ctx.lineTo(x, y); }
            }
        }
        ctx.strokeStyle = this.indicators.rsi.color;
        ctx.lineWidth = 1.5 * this.lineScale('rsi');
        ctx.stroke();

        // Close button and panel label (top left)
        const labelStartX = this.drawPanelCloseButton(ctx, topY, 'rsi');
        const labelText = `RSI(${this.indicators.rsi.period || 14})`;
        ctx.font = '10px Arial';
        ctx.fillStyle = this.indicators.rsi.color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(labelText, labelStartX, topY + 4);

        // Draw scale labels on the right side (TradingView style)
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const scaleX = rightX + 5;

        levels.forEach(level => {
            const y = valueToY(level);
            ctx.fillStyle = this.config.darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
            ctx.fillText(level.toString(), scaleX, y);
        });

        // Draw current RSI value label on the right edge (highlighted)
        let lastRsiValue = null;
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i] !== null && data[i] !== undefined) {
                lastRsiValue = data[i];
                break;
            }
        }

        if (lastRsiValue !== null) {
            const rsiY = valueToY(lastRsiValue);
            const valueText = lastRsiValue.toFixed(1);
            ctx.font = '10px Arial';
            const valueLabelWidth = ctx.measureText(valueText).width + 8;
            const valueLabelHeight = 16;
            const valueLabelX = rightX;
            const clampedY = Math.max(topY + valueLabelHeight / 2, Math.min(rsiY, bottomY - valueLabelHeight / 2));
            const valueLabelY = clampedY - valueLabelHeight / 2;

            // Color based on RSI level (like TradingView)
            let bgColor = this.indicators.rsi.color;
            if (lastRsiValue >= 70) bgColor = this.config.currentBearColor;
            else if (lastRsiValue <= 30) bgColor = this.config.currentBullColor;

            ctx.fillStyle = bgColor;
            ctx.fillRect(valueLabelX, valueLabelY, valueLabelWidth, valueLabelHeight);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(valueText, valueLabelX + 4, clampedY);
        }
    }
    // Draw MACD in its own dedicated panel (TradingView style)
    drawMACDPanel(ctx, topY, height) {
        if (!this.indicators.macd || !this.indicators.macd.enabled ||
            !this.indicators.macd.data.macdLine || !this.indicators.macd.data.macdLine.length) return;

        const { macdLine, signalLine, histogram } = this.indicators.macd.data;
        const cW = this.calculateCandleWidth();
        const leftX = this.config.padding.left;
        const rightX = this.getCanvasWidth() - this.config.padding.right;
        const bottomY = topY + height;
        const chartWidth = rightX - leftX;

        // Translucent panel background (TradingView style)
        ctx.fillStyle = this.config.darkMode ? 'rgba(30, 34, 45, 0.8)' : 'rgba(245, 245, 245, 0.8)';
        ctx.fillRect(leftX - this.pixelOffset, topY, chartWidth, height);

        // Draw vertical gridlines extending into panel
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        const gridStep = this.getGridStep(); for (let i = Math.floor((this.config.dataOffset - 1) / gridStep) * gridStep; i < this.config.dataOffset + this.config.visibleCandles; i += gridStep) {
            if (i >= this.config.dataOffset - 1 && i >= 0 && i < this.stockData.length) {
                const idx = i - this.config.dataOffset;
                const x = this._lineX(leftX + idx * (cW + this.config.spacing) + cW * 0.5);
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator line at top
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, topY);

        // Calculate min/max for visible MACD data
        let min = Infinity, max = -Infinity;
        const updateMinMax = (val) => {
            if (val !== null && val !== undefined && isFinite(val)) {
                min = Math.min(min, val);
                max = Math.max(max, val);
            }
        };

        for (let i = this.config.dataOffset; i < this.config.dataOffset + this.config.visibleCandles; i++) {
            if (i >= 0 && i < macdLine.length) {
                updateMinMax(macdLine[i]);
                updateMinMax(signalLine[i]);
                updateMinMax(histogram[i]);
            }
        }

        if (min === Infinity || max === -Infinity || min === max) {
            min = -1; max = 1;
        }

        // Symmetric scale around zero
        const absMax = Math.max(Math.abs(min), Math.abs(max)) * 1.2;
        min = -absMax;
        max = absMax;

        const valueToY = (val) => topY + ((max - val) / (max - min)) * height;
        const zeroY = valueToY(0);

        // Draw zero line
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, zeroY);

        // Draw histogram bars
        const barWidth = Math.max(1, cW * 0.8);
        for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
            const dataIndex = i + this.config.dataOffset;
            if (dataIndex >= 0 && dataIndex < histogram.length && histogram[dataIndex] !== null) {
                const x = leftX + i * (cW + this.config.spacing) + (cW - barWidth) / 2;
                const value = histogram[dataIndex];
                const barY = valueToY(value);
                const barHeight = Math.abs(barY - zeroY);

                // Color based on histogram direction and momentum
                let barColor;
                if (value > 0) {
                    // Positive histogram - check if increasing or decreasing
                    const prevValue = dataIndex > 0 ? histogram[dataIndex - 1] : 0;
                    barColor = value >= prevValue
                        ? (this.config.darkMode ? 'rgba(38, 166, 154, 0.8)' : 'rgba(38, 166, 154, 0.7)')
                        : (this.config.darkMode ? 'rgba(38, 166, 154, 0.4)' : 'rgba(38, 166, 154, 0.35)');
                } else {
                    const prevValue = dataIndex > 0 ? histogram[dataIndex - 1] : 0;
                    barColor = value <= prevValue
                        ? (this.config.darkMode ? 'rgba(239, 83, 80, 0.8)' : 'rgba(239, 83, 80, 0.7)')
                        : (this.config.darkMode ? 'rgba(239, 83, 80, 0.4)' : 'rgba(239, 83, 80, 0.35)');
                }

                ctx.fillStyle = barColor;
                if (value > 0) {
                    this._crispRect(ctx, x, barY, barWidth, barHeight);
                } else {
                    this._crispRect(ctx, x, zeroY, barWidth, barHeight);
                }
            }
        }

        // Draw MACD and Signal lines
        const drawLine = (lineData, color, lineWidth) => {
            ctx.beginPath();
            let started = false;
            for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < lineData.length && lineData[dataIndex] !== null) {
                    const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                    const y = valueToY(lineData[dataIndex]);
                    if (!started) { ctx.moveTo(x, y); started = true; }
                    else { ctx.lineTo(x, y); }
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth * this.lineScale('macd');
            ctx.stroke();
        };

        drawLine(macdLine, this.indicators.macd.macdColor || '#2196F3', 1.5);      // MACD line (default blue)
        drawLine(signalLine, this.indicators.macd.signalColor || '#FF9800', 1.5);  // Signal line (default orange)

        // Close button and panel label (top left, TradingView style)
        const macdLabelX = this.drawPanelCloseButton(ctx, topY, 'macd');
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = this.indicators.macd.macdColor || '#2196F3';
        ctx.fillText(`MACD(${this.indicators.macd.fast || 12},${this.indicators.macd.slow || 26},${this.indicators.macd.signal || 9})`, macdLabelX, topY + 4);

        // Draw scale labels on the right side
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const scaleX = rightX + 5;

        // Draw scale labels (0, max, min) on the right side
        ctx.fillStyle = this.config.darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

        // Zero line label
        ctx.fillText('0', scaleX, zeroY);

        // Max label (top) - format to appropriate decimal places
        const maxLabel = max.toFixed(Math.abs(max) >= 1 ? 1 : 2);
        ctx.fillText(maxLabel, scaleX, topY + 8);

        // Min label (bottom) - format to appropriate decimal places
        const minLabel = min.toFixed(Math.abs(min) >= 1 ? 1 : 2);
        ctx.fillText(minLabel, scaleX, bottomY - 8);

        // Draw current MACD value label
        let lastMacdValue = null;
        for (let i = macdLine.length - 1; i >= 0; i--) {
            if (macdLine[i] !== null && macdLine[i] !== undefined) {
                lastMacdValue = macdLine[i];
                break;
            }
        }

        if (lastMacdValue !== null) {
            const macdY = valueToY(lastMacdValue);
            const valueText = lastMacdValue.toFixed(3);
            ctx.font = '10px Arial';
            const valueLabelWidth = ctx.measureText(valueText).width + 8;
            const valueLabelHeight = 16;
            const valueLabelX = rightX;
            const clampedY = Math.max(topY + valueLabelHeight / 2, Math.min(macdY, bottomY - valueLabelHeight / 2));
            const valueLabelY = clampedY - valueLabelHeight / 2;

            ctx.fillStyle = this.indicators.macd.macdColor || '#2196F3';
            ctx.fillRect(valueLabelX, valueLabelY, valueLabelWidth, valueLabelHeight);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(valueText, valueLabelX + 4, clampedY);
        }
    }
    // Draw Stochastic in its own dedicated panel (TradingView style)
    drawStochasticPanel(ctx, topY, height) {
        if (!this.indicators.stochastic || !this.indicators.stochastic.enabled ||
            !this.indicators.stochastic.data.k || !this.indicators.stochastic.data.k.length) return;

        const { k, d } = this.indicators.stochastic.data;
        const cW = this.calculateCandleWidth();
        const leftX = this.config.padding.left;
        const rightX = this.getCanvasWidth() - this.config.padding.right;
        const bottomY = topY + height;
        const chartWidth = rightX - leftX;

        // Translucent panel background (TradingView style)
        ctx.fillStyle = this.config.darkMode ? 'rgba(30, 34, 45, 0.8)' : 'rgba(245, 245, 245, 0.8)';
        ctx.fillRect(leftX - this.pixelOffset, topY, chartWidth, height);

        // Draw vertical gridlines extending into panel
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        const gridStep = this.getGridStep(); for (let i = Math.floor((this.config.dataOffset - 1) / gridStep) * gridStep; i < this.config.dataOffset + this.config.visibleCandles; i += gridStep) {
            if (i >= this.config.dataOffset - 1 && i >= 0 && i < this.stockData.length) {
                const idx = i - this.config.dataOffset;
                const x = this._lineX(leftX + idx * (cW + this.config.spacing) + cW * 0.5);
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator line at top
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, topY);

        // Stochastic range is 0-100
        const valueToY = (val) => topY + ((100 - val) / 100) * height;
        const levels = [80, 50, 20];

        // Draw horizontal reference lines (subtle, like TradingView)
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;

        levels.forEach(level => {
            const y = valueToY(level);
            this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, y);
        });
        ctx.setLineDash([]);

        // Draw %K and %D lines
        const drawLine = (lineData, color, lineWidth) => {
            ctx.beginPath();
            let started = false;
            for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < lineData.length && lineData[dataIndex] !== null) {
                    const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                    const y = valueToY(lineData[dataIndex]);
                    if (!started) { ctx.moveTo(x, y); started = true; }
                    else { ctx.lineTo(x, y); }
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth * this.lineScale('stochastic');
            ctx.stroke();
        };

        drawLine(k, this.indicators.stochastic.color, 1.5);   // %K line
        drawLine(d, this.indicators.stochastic.dColor, 1.5);  // %D line

        // Close button and panel label (top left, TradingView style)
        const stochLabelX = this.drawPanelCloseButton(ctx, topY, 'stochastic');
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = this.indicators.stochastic.color;
        ctx.fillText(`Stoch(${this.indicators.stochastic.period || 14},${this.indicators.stochastic.dPeriod || 3},${this.indicators.stochastic.slowing || 3})`, stochLabelX, topY + 4);

        // Draw scale labels on the right side
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const scaleX = rightX + 5;

        levels.forEach(level => {
            const y = valueToY(level);
            ctx.fillStyle = this.config.darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
            ctx.fillText(level.toString(), scaleX, y);
        });

        // Draw current %K value label on right edge (highlighted)
        let lastK = null;
        for (let i = k.length - 1; i >= 0; i--) {
            if (k[i] !== null && k[i] !== undefined) { lastK = k[i]; break; }
        }

        if (lastK !== null) {
            const kY = valueToY(lastK);
            const valueText = lastK.toFixed(1);
            ctx.font = '10px Arial';
            const valueLabelWidth = ctx.measureText(valueText).width + 8;
            const valueLabelHeight = 16;
            const valueLabelX = rightX;
            const clampedY = Math.max(topY + valueLabelHeight / 2, Math.min(kY, bottomY - valueLabelHeight / 2));
            const valueLabelY = clampedY - valueLabelHeight / 2;

            // Color based on level (like TradingView)
            let bgColor = this.indicators.stochastic.color;
            if (lastK >= 80) bgColor = this.config.currentBearColor;
            else if (lastK <= 20) bgColor = this.config.currentBullColor;

            ctx.fillStyle = bgColor;
            ctx.fillRect(valueLabelX, valueLabelY, valueLabelWidth, valueLabelHeight);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(valueText, valueLabelX + 4, clampedY);
        }
    }

    // Generic oscillator panel drawing helper (0-100 scale or custom scale)
    drawOscillatorPanel(ctx, topY, height, indicatorKey, label, options = {}) {
        const indicator = this.indicators[indicatorKey];
        if (!indicator || !indicator.enabled || !indicator.data || !indicator.data.length) return;

        const data = indicator.data;
        const cW = this.calculateCandleWidth();
        const leftX = this.config.padding.left;
        const rightX = this.getCanvasWidth() - this.config.padding.right;
        const bottomY = topY + height;
        const chartWidth = rightX - leftX;

        // Determine scale
        const minVal = options.minVal !== undefined ? options.minVal : 0;
        const maxVal = options.maxVal !== undefined ? options.maxVal : 100;
        const levels = options.levels || [80, 50, 20];
        const autoScale = options.autoScale || false;

        let scaleMin = minVal, scaleMax = maxVal;
        if (autoScale) {
            // Calculate dynamic scale from visible data
            let visMin = Infinity, visMax = -Infinity;
            for (let i = 0; i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                    visMin = Math.min(visMin, data[dataIndex]);
                    visMax = Math.max(visMax, data[dataIndex]);
                }
            }
            if (visMin !== Infinity && visMax !== -Infinity) {
                const padding = (visMax - visMin) * 0.1 || 1;
                scaleMin = visMin - padding;
                scaleMax = visMax + padding;
            }
        }

        const valueToY = (val) => topY + ((scaleMax - val) / (scaleMax - scaleMin)) * height;

        // Translucent panel background
        ctx.fillStyle = this.config.darkMode ? 'rgba(30, 34, 45, 0.8)' : 'rgba(245, 245, 245, 0.8)';
        ctx.fillRect(leftX - this.pixelOffset, topY, chartWidth, height);

        // Vertical gridlines
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        const gridStep = this.getGridStep(); for (let i = Math.floor((this.config.dataOffset - 1) / gridStep) * gridStep; i < this.config.dataOffset + this.config.visibleCandles; i += gridStep) {
            if (i >= this.config.dataOffset - 1 && i >= 0 && i < this.stockData.length) {
                const idx = i - this.config.dataOffset;
                const x = this._lineX(leftX + idx * (cW + this.config.spacing) + cW * 0.5);
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator line at top
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, topY);

        // Horizontal reference lines
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        levels.forEach(level => {
            if (level >= scaleMin && level <= scaleMax) {
                const y = valueToY(level);
                this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, y);
            }
        });
        ctx.setLineDash([]);

        // Draw indicator line
        ctx.beginPath();
        let started = false;
        for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
            const dataIndex = i + this.config.dataOffset;
            if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                const y = valueToY(data[dataIndex]);
                if (!started) { ctx.moveTo(x, y); started = true; }
                else { ctx.lineTo(x, y); }
            }
        }
        ctx.strokeStyle = indicator.color;
        ctx.lineWidth = 1.5 * this.lineScale(indicatorKey);
        ctx.stroke();

        // Close button and panel label
        const oscLabelX = this.drawPanelCloseButton(ctx, topY, indicatorKey);
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = indicator.color;
        ctx.fillText(label, oscLabelX, topY + 4);

        // Scale labels
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const scaleX = rightX + 5;
        levels.forEach(level => {
            if (level >= scaleMin && level <= scaleMax) {
                const y = valueToY(level);
                ctx.fillStyle = this.config.darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
                ctx.fillText(level.toString(), scaleX, y);
            }
        });

        // Current value label
        let lastVal = null;
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i] !== null && data[i] !== undefined) { lastVal = data[i]; break; }
        }
        if (lastVal !== null) {
            const valY = valueToY(lastVal);
            const valueText = Math.abs(lastVal) < 10 ? lastVal.toFixed(2) : lastVal.toFixed(1);
            ctx.font = '10px Arial';
            const valueLabelWidth = ctx.measureText(valueText).width + 8;
            const valueLabelHeight = 16;
            const valueLabelX = rightX;
            const clampedY = Math.max(topY + valueLabelHeight / 2, Math.min(valY, bottomY - valueLabelHeight / 2));
            const valueLabelY = clampedY - valueLabelHeight / 2;

            ctx.fillStyle = indicator.color;
            ctx.fillRect(valueLabelX, valueLabelY, valueLabelWidth, valueLabelHeight);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(valueText, valueLabelX + 4, clampedY);
        }
    }

    // Williams %R Panel (-100 to 0 scale)
    drawWilliamsRPanel(ctx, topY, height) {
        this.drawOscillatorPanel(ctx, topY, height, 'williamsR', `Williams %R(${this.indicators.williamsR.period || 14})`, {
            minVal: -100, maxVal: 0, levels: [-20, -50, -80]
        });
    }

    // MFI Panel (0-100 scale)
    drawMFIPanel(ctx, topY, height) {
        this.drawOscillatorPanel(ctx, topY, height, 'mfi', `MFI(${this.indicators.mfi.period || 14})`, {
            minVal: 0, maxVal: 100, levels: [80, 50, 20]
        });
    }

    // ROC Panel (dynamic scale)
    drawROCPanel(ctx, topY, height) {
        this.drawOscillatorPanel(ctx, topY, height, 'roc', `ROC(${this.indicators.roc.period || 12})`, {
            autoScale: true, levels: [0]
        });
    }

    // CCI Panel (dynamic scale, typically -200 to +200)
    drawCCIPanel(ctx, topY, height) {
        this.drawOscillatorPanel(ctx, topY, height, 'cci', `CCI(${this.indicators.cci.period || 20})`, {
            autoScale: true, levels: [-100, 0, 100]
        });
    }

    // ADX Panel (0-100 scale with +DI and -DI lines)
    drawADXPanel(ctx, topY, height) {
        const indicator = this.indicators.adx;
        if (!indicator || !indicator.enabled || !indicator.data || !indicator.data.adx || !indicator.data.adx.length) return;

        const { adx, pdi, mdi } = indicator.data;
        const cW = this.calculateCandleWidth();
        const leftX = this.config.padding.left;
        const rightX = this.getCanvasWidth() - this.config.padding.right;
        const bottomY = topY + height;
        const chartWidth = rightX - leftX;

        const valueToY = (val) => topY + ((100 - val) / 100) * height;
        const levels = [40, 20];

        // Translucent panel background
        ctx.fillStyle = this.config.darkMode ? 'rgba(30, 34, 45, 0.8)' : 'rgba(245, 245, 245, 0.8)';
        ctx.fillRect(leftX - this.pixelOffset, topY, chartWidth, height);

        // Vertical gridlines
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        const gridStep = this.getGridStep(); for (let i = Math.floor((this.config.dataOffset - 1) / gridStep) * gridStep; i < this.config.dataOffset + this.config.visibleCandles; i += gridStep) {
            if (i >= this.config.dataOffset - 1 && i >= 0 && i < this.stockData.length) {
                const idx = i - this.config.dataOffset;
                const x = this._lineX(leftX + idx * (cW + this.config.spacing) + cW * 0.5);
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, topY);

        // Horizontal reference lines
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        levels.forEach(level => {
            const y = valueToY(level);
            this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, y);
        });
        ctx.setLineDash([]);

        // Draw lines helper
        const drawLine = (data, color, lineWidth) => {
            ctx.beginPath();
            let started = false;
            for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                    const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                    const y = valueToY(data[dataIndex]);
                    if (!started) { ctx.moveTo(x, y); started = true; }
                    else { ctx.lineTo(x, y); }
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth * this.lineScale('adx');
            ctx.stroke();
        };

        drawLine(pdi, indicator.pdiColor || '#26a69a', 1);   // +DI
        drawLine(mdi, indicator.mdiColor || '#ef5350', 1);   // -DI
        drawLine(adx, indicator.color, 1.5);                 // ADX

        // Panel label
        const adxLabelX = this.drawPanelCloseButton(ctx, topY, 'adx');
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = indicator.color;
        ctx.fillText(`ADX(${indicator.period || 14})`, adxLabelX, topY + 4);
    }

    // Stochastic RSI Panel (0-100 scale with K and D lines)
    drawStochasticRSIPanel(ctx, topY, height) {
        const indicator = this.indicators.stochasticRSI;
        if (!indicator || !indicator.enabled || !indicator.data || !indicator.data.k || !indicator.data.k.length) return;

        const { k, d } = indicator.data;
        const cW = this.calculateCandleWidth();
        const leftX = this.config.padding.left;
        const rightX = this.getCanvasWidth() - this.config.padding.right;
        const bottomY = topY + height;
        const chartWidth = rightX - leftX;

        const valueToY = (val) => topY + ((100 - val) / 100) * height;
        const levels = [80, 50, 20];

        // Translucent panel background
        ctx.fillStyle = this.config.darkMode ? 'rgba(30, 34, 45, 0.8)' : 'rgba(245, 245, 245, 0.8)';
        ctx.fillRect(leftX - this.pixelOffset, topY, chartWidth, height);

        // Vertical gridlines
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        const gridStep = this.getGridStep(); for (let i = Math.floor((this.config.dataOffset - 1) / gridStep) * gridStep; i < this.config.dataOffset + this.config.visibleCandles; i += gridStep) {
            if (i >= this.config.dataOffset - 1 && i >= 0 && i < this.stockData.length) {
                const idx = i - this.config.dataOffset;
                const x = this._lineX(leftX + idx * (cW + this.config.spacing) + cW * 0.5);
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, topY);

        // Horizontal reference lines
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        levels.forEach(level => {
            const y = valueToY(level);
            this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, y);
        });
        ctx.setLineDash([]);

        // Draw K and D lines
        const drawLine = (data, color, lineWidth) => {
            ctx.beginPath();
            let started = false;
            for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                    const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                    const y = valueToY(data[dataIndex]);
                    if (!started) { ctx.moveTo(x, y); started = true; }
                    else { ctx.lineTo(x, y); }
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth * this.lineScale('stochasticRSI');
            ctx.stroke();
        };

        drawLine(k, indicator.color, 1.5);
        drawLine(d, indicator.dColor || '#32CD32', 1.5);

        // Panel label
        const stochRsiLabelX = this.drawPanelCloseButton(ctx, topY, 'stochasticRSI');
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = indicator.color;
        ctx.fillText(`StochRSI(${indicator.period || 14})`, stochRsiLabelX, topY + 4);
    }

    // Awesome Oscillator Panel (histogram with dynamic scale)
    drawAwesomeOscillatorPanel(ctx, topY, height) {
        const indicator = this.indicators.awesomeOscillator;
        if (!indicator || !indicator.enabled || !indicator.data || !indicator.data.length) return;

        const data = indicator.data;
        const cW = this.calculateCandleWidth();
        const leftX = this.config.padding.left;
        const rightX = this.getCanvasWidth() - this.config.padding.right;
        const bottomY = topY + height;
        const chartWidth = rightX - leftX;

        // Calculate scale from visible data
        let visMin = Infinity, visMax = -Infinity;
        for (let i = 0; i < this.config.visibleCandles; i++) {
            const dataIndex = i + this.config.dataOffset;
            if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                visMin = Math.min(visMin, data[dataIndex]);
                visMax = Math.max(visMax, data[dataIndex]);
            }
        }
        if (visMin === Infinity || visMax === -Infinity) return;

        const absMax = Math.max(Math.abs(visMin), Math.abs(visMax)) * 1.1;
        const scaleMin = -absMax, scaleMax = absMax;
        const valueToY = (val) => topY + ((scaleMax - val) / (scaleMax - scaleMin)) * height;
        const zeroY = valueToY(0);

        // Translucent panel background
        ctx.fillStyle = this.config.darkMode ? 'rgba(30, 34, 45, 0.8)' : 'rgba(245, 245, 245, 0.8)';
        ctx.fillRect(leftX - this.pixelOffset, topY, chartWidth, height);

        // Vertical gridlines
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        const gridStep = this.getGridStep(); for (let i = Math.floor((this.config.dataOffset - 1) / gridStep) * gridStep; i < this.config.dataOffset + this.config.visibleCandles; i += gridStep) {
            if (i >= this.config.dataOffset - 1 && i >= 0 && i < this.stockData.length) {
                const idx = i - this.config.dataOffset;
                const x = this._lineX(leftX + idx * (cW + this.config.spacing) + cW * 0.5);
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, topY);

        // Zero line
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        this._hLine(ctx, leftX - this.pixelOffset, rightX - this.pixelOffset, zeroY);

        // Draw histogram bars
        const barWidth = Math.max(1, cW * 0.8);
        for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
            const dataIndex = i + this.config.dataOffset;
            if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                const x = leftX + i * (cW + this.config.spacing) + (cW - barWidth) / 2;
                const val = data[dataIndex];
                const prevVal = dataIndex > 0 && data[dataIndex - 1] !== null ? data[dataIndex - 1] : val;
                const barHeight = Math.abs(valueToY(val) - zeroY);

                // Color based on momentum direction (green if increasing, red if decreasing)
                const isIncreasing = val > prevVal;
                ctx.fillStyle = isIncreasing
                    ? (this.config.darkMode ? 'rgba(76,175,80,0.8)' : 'rgba(76,175,80,0.6)')
                    : (this.config.darkMode ? 'rgba(244,67,54,0.8)' : 'rgba(244,67,54,0.6)');

                if (val >= 0) {
                    this._crispRect(ctx, x, zeroY - barHeight, barWidth, barHeight);
                } else {
                    this._crispRect(ctx, x, zeroY, barWidth, barHeight);
                }
            }
        }

        // Panel label
        const aoLabelX = this.drawPanelCloseButton(ctx, topY, 'awesomeOscillator');
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = indicator.color;
        ctx.fillText('AO', aoLabelX, topY + 4);
    }

    // TRIX Panel (dynamic scale)
    drawTRIXPanel(ctx, topY, height) {
        this.drawOscillatorPanel(ctx, topY, height, 'trix', `TRIX(${this.indicators.trix.period || 15})`, {
            autoScale: true, levels: [0]
        });
    }

    // OBV Panel (dynamic scale)
    drawOBVPanel(ctx, topY, height) {
        this.drawOscillatorPanel(ctx, topY, height, 'obv', 'OBV', {
            autoScale: true, levels: []
        });
    }

    // ADL Panel (dynamic scale)
    drawADLPanel(ctx, topY, height) {
        this.drawOscillatorPanel(ctx, topY, height, 'adl', 'A/D', {
            autoScale: true, levels: []
        });
    }

    // Force Index Panel (dynamic scale)
    drawForceIndexPanel(ctx, topY, height) {
        this.drawOscillatorPanel(ctx, topY, height, 'forceIndex', `Force(${this.indicators.forceIndex.period || 13})`, {
            autoScale: true, levels: [0]
        });
    }

    // KST Panel (dynamic scale with signal line)
    drawKSTPanel(ctx, topY, height) {
        const indicator = this.indicators.kst;
        if (!indicator || !indicator.enabled || !indicator.data || !indicator.data.kst || !indicator.data.kst.length) return;

        const { kst, signal } = indicator.data;
        const cW = this.calculateCandleWidth();
        const leftX = this.config.padding.left;
        const rightX = this.getCanvasWidth() - this.config.padding.right;
        const bottomY = topY + height;
        const chartWidth = rightX - leftX;

        // Calculate scale from visible data
        let visMin = Infinity, visMax = -Infinity;
        for (let i = 0; i < this.config.visibleCandles; i++) {
            const dataIndex = i + this.config.dataOffset;
            if (dataIndex >= 0 && dataIndex < kst.length && kst[dataIndex] !== null) {
                visMin = Math.min(visMin, kst[dataIndex]);
                visMax = Math.max(visMax, kst[dataIndex]);
            }
            if (dataIndex >= 0 && dataIndex < signal.length && signal[dataIndex] !== null) {
                visMin = Math.min(visMin, signal[dataIndex]);
                visMax = Math.max(visMax, signal[dataIndex]);
            }
        }
        if (visMin === Infinity || visMax === -Infinity) return;

        const padding = (visMax - visMin) * 0.1 || 1;
        const scaleMin = visMin - padding, scaleMax = visMax + padding;
        const valueToY = (val) => topY + ((scaleMax - val) / (scaleMax - scaleMin)) * height;

        // Translucent panel background
        ctx.fillStyle = this.config.darkMode ? 'rgba(30, 34, 45, 0.8)' : 'rgba(245, 245, 245, 0.8)';
        ctx.fillRect(leftX - this.pixelOffset, topY, chartWidth, height);

        // Vertical gridlines
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        const gridStep = this.getGridStep(); for (let i = Math.floor((this.config.dataOffset - 1) / gridStep) * gridStep; i < this.config.dataOffset + this.config.visibleCandles; i += gridStep) {
            if (i >= this.config.dataOffset - 1 && i >= 0 && i < this.stockData.length) {
                const idx = i - this.config.dataOffset;
                const x = this._lineX(leftX + idx * (cW + this.config.spacing) + cW * 0.5);
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX - this.pixelOffset, topY);
        ctx.lineTo(rightX - this.pixelOffset, topY);
        ctx.stroke();

        // Zero line
        if (0 >= scaleMin && 0 <= scaleMax) {
            ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
            ctx.setLineDash([2, 4]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(leftX - this.pixelOffset, valueToY(0));
            ctx.lineTo(rightX - this.pixelOffset, valueToY(0));
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw lines
        const drawLine = (data, color, lineWidth) => {
            ctx.beginPath();
            let started = false;
            for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                    const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                    const y = valueToY(data[dataIndex]);
                    if (!started) { ctx.moveTo(x, y); started = true; }
                    else { ctx.lineTo(x, y); }
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth * this.lineScale('kst');
            ctx.stroke();
        };

        drawLine(kst, indicator.color, 1.5);
        drawLine(signal, indicator.signalColor || '#00CED1', 1.5);

        // Panel label
        const kstLabelX = this.drawPanelCloseButton(ctx, topY, 'kst');
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = indicator.color;
        ctx.fillText('KST', kstLabelX, topY + 4);
    }

    drawVisibleExtremesMarkers(ctx, priceScaleMin, priceScaleMax, chartHeight) {
        if (!this.stockData || !this.stockData.length) return;
        // Skip high/low markers for line charts (they only make sense for candlesticks)
        if (this.config.chartType === 'line') return;
        const visibleData = this.stockData.slice(Math.max(0, this.config.dataOffset), this.config.dataOffset + this.config.visibleCandles);
        if (!visibleData.length) return;

        // Calculate the visible price chart bounds (excluding indicator panels)
        // Markers can appear in the volume overlay area, but not in indicator panels
        const chartTop = this.config.padding.top;
        const panelsTopY = this.getPanelsTopY();

        let highestHigh = -Infinity, highestHighCandle = null, highestHighIndexInVisible = -1;
        let lowestLow = Infinity, lowestLowCandle = null, lowestLowIndexInVisible = -1;

        visibleData.forEach((candle, index) => {
            if (candle.high > highestHigh) { highestHigh = candle.high; highestHighCandle = candle; highestHighIndexInVisible = index }
            if (candle.low < lowestLow) { lowestLow = candle.low; lowestLowCandle = candle; lowestLowIndexInVisible = index }
        });

        const cW = this.calculateCandleWidth();
        const markerColor = this.config.darkMode ? 'rgba(200,200,200,0.9)' : 'rgba(50,50,50,0.9)';
        const textColor = this.config.currentTextColor;
        const lineLength = 30, circleRadius = 2.5, textPadding = 5;
        const numVisibleCandles = visibleData.length;
        // A user price line sitting on the high/low already shows that price in its
        // badge; drawing the marker too just stacks a second label on the line.
        const coveredByPriceLine = (y) => this.priceLines.some(l => Math.abs(this.priceToY(l.price, priceScaleMin, priceScaleMax, chartHeight, this.getCanvasHeight()) - y) < 2);

        ctx.save();
        ctx.font = '12px Arial';

        // Draw high marker only if it's in the visible price+volume area (above panels)
        if (highestHighCandle) {
            const x = this.config.padding.left + (highestHighIndexInVisible + this.getLeadSlots()) * (cW + this.config.spacing) + cW * 0.5;
            const y = this.priceToY(highestHigh, priceScaleMin, priceScaleMax, chartHeight, this.getCanvasHeight());
            // Only draw if Y is within the price chart area (not in indicator panels)
            if (y >= chartTop && y < panelsTopY && !coveredByPriceLine(y)) {
                ctx.beginPath();
                ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
                ctx.fillStyle = markerColor;
                ctx.fill();
                const isNearRightEdge = (numVisibleCandles - 1 - highestHighIndexInVisible) <= 3;
                const highText = s8FormatChartPrice(highestHigh);
                ctx.beginPath();
                ctx.moveTo(x + (isNearRightEdge ? -circleRadius : circleRadius), y);
                ctx.lineTo(x + (isNearRightEdge ? -circleRadius - lineLength : circleRadius + lineLength), y);
                ctx.strokeStyle = markerColor;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = textColor;
                ctx.textAlign = isNearRightEdge ? 'right' : 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(highText, x + (isNearRightEdge ? -circleRadius - lineLength - textPadding : circleRadius + lineLength + textPadding), y);
            }
        }

        // Draw low marker only if it's in the visible price+volume area (above panels)
        if (lowestLowCandle) {
            const x = this.config.padding.left + (lowestLowIndexInVisible + this.getLeadSlots()) * (cW + this.config.spacing) + cW * 0.5;
            const y = this.priceToY(lowestLow, priceScaleMin, priceScaleMax, chartHeight, this.getCanvasHeight());
            // Only draw if Y is within the price chart area (not in indicator panels)
            if (y >= chartTop && y < panelsTopY && !coveredByPriceLine(y)) {
                ctx.beginPath();
                ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
                ctx.fillStyle = markerColor;
                ctx.fill();
                const isNearRightEdge = (numVisibleCandles - 1 - lowestLowIndexInVisible) <= 3;
                const lowText = s8FormatChartPrice(lowestLow);
                ctx.beginPath();
                ctx.moveTo(x + (isNearRightEdge ? -circleRadius : circleRadius), y);
                ctx.lineTo(x + (isNearRightEdge ? -circleRadius - lineLength : circleRadius + lineLength), y);
                ctx.strokeStyle = markerColor;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = textColor;
                ctx.textAlign = isNearRightEdge ? 'right' : 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(lowText, x + (isNearRightEdge ? -circleRadius - lineLength - textPadding : circleRadius + lineLength + textPadding), y);
            }
        }
        ctx.restore();
    }
    normalizeTimeframeAlias(tf) { switch (tf) { case 'hour': case '60min': case '1h': return '1hour'; case 'day': case '1d': return '1day'; case 'week': case '1week': case '1w': case '1W': return '1week'; case 'month': case '1month': case '1mo': case '1M': return '1month'; default: return tf } }
    formatTimeframeLabel(tf) { switch (this.normalizeTimeframeAlias(tf)) { case '1min': return '1 Minute'; case '2min': return '2 Minutes'; case '5min': return '5 Minutes'; case '15min': return '15 Minutes'; case '30min': return '30 Minutes'; case '1hour': return '1 Hour'; case '4hour': return '4 Hours'; case '1day': return '1 Day'; case '1week': return '1 Week'; case '1month': return '1 Month'; default: return tf } }
    getTimeframeMinutes(tf) { switch (this.normalizeTimeframeAlias(tf)) { case '1min': return 1; case '2min': return 2; case '5min': return 5; case '15min': return 15; case '30min': return 30; case '1hour': return 60; case '4hour': return 240; case '1day': return 1440; case '1week': return 10080; case '1month': return 43200; default: return 1 } }
    drawMarketHoursShading(ctx, visibleData) {
        if (!visibleData.length) return;
        const candleFullWidth = this.calculateCandleWidth() + this.config.spacing;
        const margins = this.config.padding, h = this.getCanvasHeight();
        const shadingHeight = h - margins.top - margins.bottom;
        const timeframeMinutes = this.getTimeframeMinutes(this.timeframe);
        // TradingView-style sessions: premarket (and anything before it, the 24/5
        // overnight) is a warm brown, after hours is navy, regular hours stay plain.
        const sessionOf = (candle) => {
            if (!candle || typeof candle.date !== 'string') return null;
            const timePart = candle.date.split(' ').pop();
            const [hours, minutes] = timePart.split(':').map(Number);
            const candleStartMinutes = (hours % 24) * 60 + minutes;
            if (candleStartMinutes + timeframeMinutes <= 570) return 'pre';
            if (candleStartMinutes >= 960) return 'post';
            return null;
        };
        const sessionColors = this.config.darkMode
            ? { pre: '#111622', post: '#111622' }
            : { pre: '#f3f3f3', post: '#f3f3f3' };

        // Panning translates the visible candles by up to one candle pitch. Paint
        // the exposed left edge using the preceding candle's session, so the
        // canvas's black base color does not show through during the drag.
        if (this.pixelOffset > 0) {
            const precedingCandle = this.config.dataOffset > 0
                ? this.stockData[this.config.dataOffset - 1]
                : visibleData[0];
            const edgeSession = sessionOf(precedingCandle);
            if (edgeSession) {
                ctx.fillStyle = sessionColors[edgeSession];
                ctx.fillRect(margins.left - this.pixelOffset, margins.top, this.pixelOffset, shadingHeight);
            }
        }

        let regionStart = null, regionSession = null;
        const flushRegion = (endIndex) => {
            if (regionStart === null) return;
            const lead = this.getLeadSlots();
            const startX = margins.left + (regionStart + lead) * candleFullWidth;
            const endX = margins.left + (endIndex + lead) * candleFullWidth;
            ctx.fillStyle = sessionColors[regionSession];
            ctx.fillRect(Math.round(startX), margins.top, Math.round(endX) - Math.round(startX), shadingHeight);
            regionStart = null;
            regionSession = null;
        };
        visibleData.forEach((candle, index) => {
            if (!candle.date || typeof candle.date !== 'string') return;
            const session = sessionOf(candle);
            if (session !== regionSession) flushRegion(index);
            if (session && regionStart === null) { regionStart = index; regionSession = session; }
        });
        flushRegion(visibleData.length);
    }
    priceToY(val, pMin, pMax, chartH, canvasHeight) { const range = pMax - pMin; const chartTop = this.config.padding.top; return chartTop + chartH - ((val - pMin) / range) * chartH }
    drawLineChart(ctx, min, max, chartW, chartH) { const start = Math.max(0, this.config.dataOffset - 2); const data = this.stockData.slice(start, this.config.dataOffset + this.config.visibleCandles); const firstIndex = start - this.config.dataOffset; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const cW = this.calculateCandleWidth(); const chartBottom = this.config.padding.top + chartH; ctx.beginPath(); let firstX, firstY, lastX, lastY; data.forEach((candle, index) => { const i = index + firstIndex; const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = this.priceToY(candle.close, min, max, chartH, h); if (index === 0) { ctx.moveTo(x, y); firstX = x; firstY = y } else ctx.lineTo(x, y); if (index === data.length - 1) { lastX = x; lastY = y } }); ctx.save(); const grad = ctx.createLinearGradient(0, this.config.padding.top, 0, chartBottom); grad.addColorStop(0, this.config.darkMode ? 'rgba(52,152,219,0.5)' : 'rgba(52,152,219,0.3)'); grad.addColorStop(1, this.config.darkMode ? 'rgba(52,152,219,0.05)' : 'rgba(52,152,219,0.02)'); ctx.lineTo(lastX, chartBottom); ctx.lineTo(firstX, chartBottom); ctx.closePath(); ctx.fillStyle = grad; ctx.fill(); ctx.restore(); ctx.beginPath(); data.forEach((candle, index) => { const i = index + firstIndex; const x = this.config.padding.left + i * (cW + this.config.spacing) + cW / 2; const y = this.priceToY(candle.close, min, max, chartH, h); if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y) }); ctx.strokeStyle = '#3498db'; ctx.lineWidth = 2.5; ctx.stroke() }
    // Chart styles offered by the overlay menu. 'candlestick' and 'line' keep
    // their original config values so stored settings and every caller that
    // passes chartType in options still resolve.
    static get CHART_TYPES() {
        return [
            { value: 'candlestick', label: 'Candles' },
            { value: 'hollow',      label: 'Hollow' },
            { value: 'bars',        label: 'Bars' },
            { value: 'line',        label: 'Line' }
        ];
    }

    // The subset of CHART_TYPES this instance offers. Callers can pass
    // chartTypes: ['candlestick','hollow','bars'] to drop styles that make no
    // sense for their page - the sims hide 'line' because you cannot read an
    // entry or a stop off a close-only line. Anything not offered here is also
    // rejected by setChartType and ignored when loading stored settings, so an
    // old stored choice cannot come back on a page that no longer lists it.
    availableChartTypes() {
        const allowed = this.options && this.options.chartTypes;
        if (!Array.isArray(allowed) || !allowed.length) return StockChart.CHART_TYPES;
        const subset = StockChart.CHART_TYPES.filter(t => allowed.indexOf(t.value) !== -1);
        return subset.length ? subset : StockChart.CHART_TYPES;
    }

    // Monochrome by design: every icon draws in currentColor so it picks up the
    // toolbar button's colour (white in dark mode, #333 in light) and the menu
    // row's text colour. Bull/bear green and red belong on the chart, not on a
    // control - a coloured icon reads as a state indicator rather than a style
    // picker. The four styles are told apart by SHAPE alone, which is why
    // candles are solid-bodied and hollow is outlined all the way across.
    chartTypeIcon(type) {
        const icons = {
            // Artwork fills the 24 box the same way the neighbouring toolbar
            // glyphs do (clock, camera) - a glyph that only uses the middle of
            // its viewBox reads as a smaller button than the ones beside it.
            // Two candles on centres 7.5 and 16.5, bodies 6 wide.
            candlestick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="7.5" y1="2.5" x2="7.5" y2="21.5"/><rect x="4.5" y="7.5" width="6" height="9" fill="currentColor"/><line x1="16.5" y1="2" x2="16.5" y2="22"/><rect x="13.5" y="5.5" width="6" height="12.5" fill="currentColor"/></svg>',
            // Wicks in two segments that stop at the body edges, never one line
            // from high to low - exactly as drawHollowCandles does it, and for
            // the same reason: a hollow body does not hide the middle of a
            // full-length wick, it leaves a line bisecting the body.
            hollow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="7.5" y1="2.5" x2="7.5" y2="7.5"/><line x1="7.5" y1="16.5" x2="7.5" y2="21.5"/><rect x="4.5" y="7.5" width="6" height="9"/><line x1="16.5" y1="2" x2="16.5" y2="5.5"/><line x1="16.5" y1="18" x2="16.5" y2="22"/><rect x="13.5" y="5.5" width="6" height="12.5"/></svg>',
            bars: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="7.5" y1="3" x2="7.5" y2="21"/><line x1="4" y1="8" x2="7.5" y2="8"/><line x1="7.5" y1="15" x2="11" y2="15"/><line x1="16.5" y1="2.5" x2="16.5" y2="21.5"/><line x1="13" y1="17" x2="16.5" y2="17"/><line x1="16.5" y1="6.5" x2="20" y2="6.5"/></svg>',
            line: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5,16 L8.5,9 L14,15 L21.5,5.5" fill="none"/></svg>'
        };
        return icons[type] || icons.candlestick;
    }

    // createDOM runs before loadSettings, so the button icon and the ticked
    // menu row still reflect the constructor's chartType. Re-sync them once the
    // stored preference has been applied.
    updateChartTypeVisualState() {
        if (this.chartTypeButton) this.chartTypeButton.innerHTML = this.chartTypeIcon(this.config.chartType);
        this.container.querySelectorAll('.sc-charttype-option').forEach(option => {
            option.classList.toggle('selected', option.dataset.value === this.config.chartType);
        });
    }

    setChartType(type) {
        const known = this.availableChartTypes().some(t => t.value === type);
        if (!known || type === this.config.chartType) return;
        this.config.chartType = type;

        if (this.chartTypeButton) this.chartTypeButton.innerHTML = this.chartTypeIcon(type);
        this.container.querySelectorAll('.sc-charttype-option').forEach(option => {
            option.classList.toggle('selected', option.dataset.value === type);
        });

        // A pattern callout already on screen was placed over a candle box that
        // line view is about to stop drawing. The canvas layers redraw below,
        // but this one is a DOM node with its own dismiss timer, so it would
        // hang over the line chart until that timer ran out.
        if (type === 'line' && this.chartContainer) {
            this.chartContainer.querySelectorAll('.sc-pattern-callout').forEach(n => n.remove());
        }

        // The hovered-candle outline is cached geometry from the old style.
        this.saveSettings();
        this.drawCharts();
    }

    // Price direction used for COLOUR in hollow mode. TradingView's rule:
    // colour comes from this close vs the PREVIOUS close, while hollow/filled
    // comes from close vs open. That is what makes the mode worth having - a
    // red hollow candle rallied off its low but still closed below yesterday.
    // dataIndex is absolute, so the first visible candle can still look back
    // one bar into the data that is scrolled off screen.
    isUpVsPrevClose(dataIndex) {
        const prev = dataIndex > 0 ? this.stockData[dataIndex - 1] : null;
        const candle = this.stockData[dataIndex];
        if (!candle) return true;
        if (!prev) return candle.close >= candle.open;   // no history: fall back
        return candle.close >= prev.close;
    }

    // Geometry every per-bar renderer and every outline needs. One place, so
    // the pulse and hover outlines cannot drift out of alignment with the bars.
    candleGeometry(dataIndex, min, max, chartH) {
        const candle = this.stockData[dataIndex];
        if (!candle) return null;
        const cW = this.calculateCandleWidth();
        const h = this.getCanvasHeight();
        const x = this.config.padding.left + (dataIndex - this.config.dataOffset) * (cW + this.config.spacing);
        const yOpen = this.priceToY(candle.open, min, max, chartH, h);
        const yClose = this.priceToY(candle.close, min, max, chartH, h);
        const top = Math.min(yOpen, yClose);
        return {
            candle: candle, cW: cW, x: x, midX: x + cW * 0.5,
            yHigh: this.priceToY(candle.high, min, max, chartH, h),
            yLow: this.priceToY(candle.low, min, max, chartH, h),
            yOpen: yOpen, yClose: yClose,
            top: top, bodyH: Math.max(1, Math.max(yOpen, yClose) - top)
        };
    }

    // Trace the outline of one bar in whatever style is current, WITHOUT
    // stroking - the caller sets colour, width and shadow then strokes.
    // Candles and hollow share a shape (body rect + two wicks); bars have no
    // body at all, so tracing a rectangle there would box in empty space.
    traceBarOutline(ctx, g, inset) {
        if (!g) return;
        const pad = inset || 0;
        if (this.config.chartType === 'bars') {
            const tick = Math.max(2, g.cW * 0.5);
            ctx.beginPath();
            ctx.moveTo(g.midX, g.yHigh);
            ctx.lineTo(g.midX, g.yLow);
            ctx.moveTo(g.midX - tick, g.yOpen);
            ctx.lineTo(g.midX, g.yOpen);
            ctx.moveTo(g.midX, g.yClose);
            ctx.lineTo(g.midX + tick, g.yClose);
            ctx.stroke();
            return;
        }
        // Built from the same device-pixel box the candle was drawn with, so the
        // outline hugs the body with no gap at any zoom. The border is a whole
        // number of device pixels sitting just outside the body; the wick is
        // repainted at the wick's own width in the outline colour.
        const b = this._crispBox(g), sx = b.sx;
        const lw = Math.max(1, Math.round(ctx.lineWidth * sx)) / sx, gap = Math.round(pad * sx) / sx, half = lw / 2 + gap;
        ctx.lineWidth = b.ww;
        ctx.beginPath();
        ctx.moveTo(b.wx, b.hT);
        ctx.lineTo(b.wx, b.by - gap - lw);
        ctx.moveTo(b.wx, b.by + b.bh + gap + lw);
        ctx.lineTo(b.wx, b.hB);
        ctx.stroke();
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.rect(b.bx - half, b.by - half, b.bw + half * 2, b.bh + half * 2);
        ctx.stroke();
    }
    // A candle's body and wick in CSS px, snapped exactly as _crispCandle draws them.
    _crispBox(g) {
        const sx = this._scaleX(), sy = this._scaleY();
        const L = Math.round(g.x * sx); let W = Math.max(1, Math.round(g.cW * sx));
        const ww = Math.max(1, Math.floor(sx));
        if (W > ww && (W - ww) % 2) W -= 1;
        const wl = W > ww ? L + (W - ww) / 2 : L + Math.floor((W - ww) / 2);
        const yT = Math.round(Math.min(g.yOpen, g.yClose) * sy), yB = Math.max(yT + 1, Math.round(Math.max(g.yOpen, g.yClose) * sy));
        const hT = Math.round(g.yHigh * sy), hB = Math.max(hT + 1, Math.round(g.yLow * sy));
        return { sx, sy, bx: L / sx, bw: W / sx, by: yT / sy, bh: (yB - yT) / sy, wx: (wl + ww / 2) / sx, ww: ww / sx, hT: hT / sy, hB: hB / sy };
    }

    // Hollow candles: same geometry as filled candles, but up bars are drawn
    // as an outline and the colour comes from the previous close.
    drawHollowCandles(ctx, min, max, chartW, chartH) {
        const start = Math.max(0, this.config.dataOffset - 1);
        const end = Math.min(this.config.dataOffset + this.config.visibleCandles, this.stockData.length);
        for (let i = start; i < end; i++) {
            const g = this.candleGeometry(i, min, max, chartH);
            if (!g) continue;
            const color = this.isUpVsPrevClose(i) ? this.config.currentBullColor : this.config.currentBearColor;
            const hollow = g.candle.close >= g.candle.open;

            // Wicks as TWO segments that stop at the body, never one line from
            // high to low. A filled body hides the middle of a full-length wick,
            // but a hollow one does not - it leaves a line bisecting the body,
            // which is not what a hollow candle looks like anywhere else.
            // Hollow bodies draw as a crisp outline inside the body slot, with the wick
            // stopping at the body so no line bisects it.
            this._crispCandle(ctx, color, g.x, g.cW, g.yHigh, g.yLow, g.top, g.top + g.bodyH, hollow ? Math.max(1, Math.min(2, g.cW * 0.12)) : 0);
        }
    }

    // Zoomed far enough out that bars are thinner than a pixel, drawing one rect
    // per bar just smears them together and the shape of the session is lost. So
    // draw per PIXEL COLUMN instead: every bar landing in the same column collapses
    // into one high-low stroke, coloured by that group's own open vs close. Cost is
    // bounded by the width of the canvas, not by how much history is loaded - which
    // is what lets the view keep opening up without the frame rate falling over.
    drawDensitySeries(ctx, min, max, chartH) {
        const start = Math.max(0, this.config.dataOffset - 1);
        const end = Math.min(this.config.dataOffset + this.config.visibleCandles, this.stockData.length);
        if (end <= start) return;
        const h = this.getCanvasHeight();
        const pitch = this.getColumnPitch();
        const left = this.config.padding.left;

        let col = null, gHigh = 0, gLow = 0, gOpen = 0, gClose = 0, gX = 0;
        const flush = () => {
            if (col === null) return;
            ctx.beginPath();
            ctx.strokeStyle = gClose >= gOpen ? this.config.currentBullColor : this.config.currentBearColor;
            ctx.lineWidth = 1 / this._scaleX();
            // Centre of a device pixel, so the 1px stroke doesn't straddle two (at any screen scale).
            const x = this._lineX(gX);
            ctx.moveTo(x, this.priceToY(gHigh, min, max, chartH, h));
            ctx.lineTo(x, this.priceToY(gLow, min, max, chartH, h));
            ctx.stroke();
        };

        for (let i = start; i < end; i++) {
            const c = this.stockData[i];
            if (!c) continue;
            const x = left + (i - this.config.dataOffset) * pitch;
            const thisCol = Math.floor(x);
            if (thisCol !== col) {
                flush();
                col = thisCol; gX = x;
                gHigh = c.high; gLow = c.low; gOpen = c.open;
            } else {
                gHigh = Math.max(gHigh, c.high);
                gLow = Math.min(gLow, c.low);
            }
            gClose = c.close;
        }
        flush();
    }

    // OHLC bars: high-low line, open tick left, close tick right. Coloured by
    // the bar's own direction, which is the usual default for this style.
    drawBars(ctx, min, max, chartW, chartH) {
        const start = Math.max(0, this.config.dataOffset - 1);
        const end = Math.min(this.config.dataOffset + this.config.visibleCandles, this.stockData.length);
        for (let i = start; i < end; i++) {
            const g = this.candleGeometry(i, min, max, chartH);
            if (!g) continue;
            const color = g.candle.close >= g.candle.open ? this.config.currentBullColor : this.config.currentBearColor;
            // calculateCandleWidth floors at 2px, which would leave a 1px tick
            // either side - invisible. Give bars their own floor.
            const tick = Math.max(2, g.cW * 0.5), sx = this._scaleX(), sy = this._scaleY();
            const lw = Math.max(1, Math.round(Math.max(1, Math.min(2, g.cW * 0.18)) * sx)), lh = Math.max(1, Math.round(Math.max(1, Math.min(2, g.cW * 0.18)) * sy));
            const mx = Math.round(g.midX * sx - lw / 2), tk = Math.max(1, Math.round(tick * sx));
            const hT = Math.round(g.yHigh * sy), hB = Math.max(hT + 1, Math.round(g.yLow * sy));
            const yo = Math.round(g.yOpen * sy - lh / 2), yc = Math.round(g.yClose * sy - lh / 2);
            ctx.fillStyle = color;
            ctx.fillRect(mx / sx, hT / sy, lw / sx, (hB - hT) / sy);
            ctx.fillRect((mx - tk) / sx, yo / sy, tk / sx, lh / sy);
            ctx.fillRect((mx + lw) / sx, yc / sy, tk / sx, lh / sy);
        }
    }

    drawCandles(ctx, min, max, chartW, chartH) { const start = Math.max(0, this.config.dataOffset - 1); const data = this.stockData.slice(start, this.config.dataOffset + this.config.visibleCandles); const firstIndex = start - this.config.dataOffset; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const cW = this.calculateCandleWidth(); data.forEach((candle, index) => { const i = index + firstIndex; const isUp = candle.close >= candle.open; const color = isUp ? this.config.currentBullColor : this.config.currentBearColor; const x = this.config.padding.left + i * (cW + this.config.spacing); const yHigh = this.priceToY(candle.high, min, max, chartH, h); const yLow = this.priceToY(candle.low, min, max, chartH, h); const yOpen = this.priceToY(candle.open, min, max, chartH, h); const yClose = this.priceToY(candle.close, min, max, chartH, h); this._crispCandle(ctx, color, x, cW, yHigh, yLow, yOpen, yClose) }) }
    // One candle in device pixels: whole-pixel body edges, a wick 1 CSS px wide (rounded
    // to device pixels) sitting dead centre, and at least one device pixel of body.
    // hollowLw > 0 draws the body as an outline that many CSS px thick, with the wick
    // stopping at the body.
    _crispCandle(ctx, color, x, cW, yHigh, yLow, yOpen, yClose, hollowLw) {
        const sx = this._scaleX(), sy = this._scaleY();
        let L = Math.round(x * sx), W = Math.max(1, Math.round(cW * sx));
        const ww = Math.max(1, Math.floor(sx));
        if (W > ww && (W - ww) % 2) W -= 1; // keep the wick centred
        const wl = W > ww ? L + (W - ww) / 2 : L + Math.floor((W - ww) / 2);
        const yT = Math.round(Math.min(yOpen, yClose) * sy), yB = Math.max(yT + 1, Math.round(Math.max(yOpen, yClose) * sy));
        const hT = Math.round(yHigh * sy), hB = Math.max(hT + 1, Math.round(yLow * sy));
        ctx.fillStyle = color;
        const R = (a, b, w, h) => { if (w > 0 && h > 0) ctx.fillRect(a / sx, b / sy, w / sx, h / sy) };
        if (!hollowLw) { R(wl, hT, ww, hB - hT); R(L, yT, W, yB - yT); return }
        R(wl, hT, ww, yT - hT); R(wl, yB, ww, hB - yB);
        const bx = Math.max(1, Math.round(hollowLw * sx)), by = Math.max(1, Math.round(hollowLw * sy));
        if (W <= bx * 2 || yB - yT <= by * 2) { R(L, yT, W, yB - yT); return }
        R(L, yT, W, by); R(L, yB - by, W, by); R(L, yT + by, bx, yB - yT - by * 2); R(L + W - bx, yT + by, bx, yB - yT - by * 2);
    }
    // A filled rect with its edges on device pixels (at least one device pixel each way).
    _crispRect(ctx, x, y, w, h) {
        const sx = this._scaleX(), sy = this._scaleY();
        const L = Math.round(x * sx), T = Math.round(y * sy), Rr = Math.max(L + 1, Math.round((x + w) * sx)), B = Math.max(T + 1, Math.round((y + h) * sy));
        if (h <= 0) return;
        ctx.fillRect(L / sx, T / sy, (Rr - L) / sx, (B - T) / sy);
    }
    // Index into stockData of the candle sitting under a canvas x coordinate,
    // or null if that x is outside the data. Mirrors the crosshair's own math,
    // including the drag pixel offset, so both land on the same candle.
    getCandleIndexAtX(mouseX) {
        if (mouseX === null || mouseX === undefined || !this.stockData.length) return null;
        const cW = this.calculateCandleWidth();
        const indexWithinView = Math.floor((mouseX - this.pixelOffset - this.config.padding.left) / (cW + this.config.spacing));
        const firstDrawableIndex = this.config.dataOffset > 0 && this.pixelOffset > 0 ? -1 : 0;
        if (indexWithinView < firstDrawableIndex || indexWithinView >= this.config.visibleCandles) return null;
        const dataIndex = this.config.dataOffset + indexWithinView;
        if (dataIndex < 0 || dataIndex >= this.stockData.length) return null;
        return dataIndex;
    }

    // Brighter take on a hex color. Works in HSL so the hue is preserved exactly
    // - scaling RGB instead would clamp the dominant channel and drift the color
    // (the teal bull green would slide toward cyan). Lightness moves `amount` of
    // the way to white, with a small saturation lift so it does not wash out.
    brightenColor(hex, amount = 0.35, satLift = 0.1) {
        if (typeof hex !== 'string') return hex;
        let s = hex.trim().replace('#', '');
        if (s.length === 3) s = s.split('').map(c => c + c).join('');
        if (s.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(s)) return hex;
        const n = parseInt(s, 16);
        const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
        let l = (max + min) / 2;
        let sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
        let hue = 0;
        if (d !== 0) {
            if (max === r) hue = ((g - b) / d) % 6;
            else if (max === g) hue = (b - r) / d + 2;
            else hue = (r - g) / d + 4;
            hue *= 60;
            if (hue < 0) hue += 360;
        }
        l = Math.min(1, l + (1 - l) * amount);
        // Greys have no hue to lift toward - lifting them would tint the result red
        if (sat > 0) sat = Math.min(1, sat + satLift);
        // HSL back to RGB
        const c = (1 - Math.abs(2 * l - 1)) * sat;
        const hp = hue / 60;
        const xx = c * (1 - Math.abs((hp % 2) - 1));
        let rr = 0, gg = 0, bb = 0;
        if (hp < 1) { rr = c; gg = xx } else if (hp < 2) { rr = xx; gg = c }
        else if (hp < 3) { gg = c; bb = xx } else if (hp < 4) { gg = xx; bb = c }
        else if (hp < 5) { rr = xx; bb = c } else { rr = c; bb = xx }
        const m = l - c / 2;
        const to255 = (v) => Math.max(0, Math.min(255, Math.round((v + m) * 255)));
        return `rgb(${to255(rr)}, ${to255(gg)}, ${to255(bb)})`;
    }

    // Outline the candle the crosshair is parked on so the OHLCV readout has a
    // visible anchor on the chart. Same shape as the pattern-match pulse (body
    // border plus wicks) but static, and colored a brighter version of that
    // candle's own green/red rather than white.
    drawHoveredCandleOutline(ctx, min, max, chartH) {
        if (this.config.chartType === 'line') return;
        const dataIndex = this.getCandleIndexAtX(this.lastMouseX);
        if (dataIndex === null) return;
        const candle = this.stockData[dataIndex];
        if (!candle) return;

        const cW = this.calculateCandleWidth();
        const h = this.getCanvasHeight();
        const x = this.config.padding.left + (dataIndex - this.config.dataOffset) * (cW + this.config.spacing);
        const isUp = candle.close >= candle.open;
        // Bull and bear get different lifts on purpose. The bull green sits far
        // darker in HSL than the bear red (L~32% vs ~58%), so one shared amount
        // over-brightens the green into neon while leaving the red looking flat.
        // The green also skips the saturation lift, which would peg it at 100%.
        const color = isUp
            ? this.brightenColor(this.config.currentBullColor, 0.22, 0)
            : this.brightenColor(this.config.currentBearColor, 0.40, 0.1);

        const yHigh = this.priceToY(candle.high, min, max, chartH, h);
        const yLow = this.priceToY(candle.low, min, max, chartH, h);
        const yOpen = this.priceToY(candle.open, min, max, chartH, h);
        const yClose = this.priceToY(candle.close, min, max, chartH, h);
        const top = Math.min(yOpen, yClose);
        const bodyH = Math.max(1, Math.max(yOpen, yClose) - top);
        const midX = x + cW * 0.5;

        ctx.save();
        ctx.strokeStyle = color;
        // Candles floor at ~2px wide when zoomed out - keep the outline
        // proportional so it reads as a border, not a repainted candle
        ctx.lineWidth = Math.max(1, Math.min(1.5, cW * 0.25));
        ctx.shadowColor = color;
        ctx.shadowBlur = 4;
        // Shape follows the chart type - see traceBarOutline.
        this.traceBarOutline(ctx, this.candleGeometry(dataIndex, min, max, chartH), 0);
        ctx.restore();
    }

    drawPriceScale(ctx, min, max, nMin, nMax, spacing) { const w = this.getCanvasWidth(), h = this.getCanvasHeight(); ctx.fillStyle = this.config.currentTextColor; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '12px Arial'; const chartTop = this.config.padding.top; const chartH = this.getPriceChartHeight(); const chartBottom = chartTop + chartH; let lastLabel = null; for (let price = nMin; price <= nMax + 1e-8; price += spacing) { const y = this.priceToY(price, min, max, chartH, h); if (y < chartTop || y > chartBottom) continue; const txt = s8FormatChartPrice(price); if (txt === lastLabel) continue; ctx.fillText(txt, w - this.config.padding.right + 5, y); lastLabel = txt } }
    drawDateLabels(ctx) { const start = Math.max(0, this.config.dataOffset - 1); const data = this.stockData.slice(start, this.config.dataOffset + this.config.visibleCandles); const firstIndex = start - this.config.dataOffset; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const cW = this.calculateCandleWidth(); ctx.fillStyle = this.config.currentTextColor; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = '12px Arial'; /* Every 10th bar is fine at normal zoom but becomes a smear once bars are a couple of pixels wide, so the step grows with density: aim for ~90px between labels, rounded to a multiple of 10 bars to keep the familiar rhythm. */ const labelStep = this.getGridStep(); data.forEach((candle, index) => { const i = index + firstIndex; const globalIdx = i + this.config.dataOffset; if (globalIdx % labelStep === 0) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; ctx.fillText(this.formatTimestamp(candle.t, this.timeframe), x, h - this.config.padding.bottom + 5) } }) }
    drawLastPriceLabel(ctx, min, max) { if (!this.stockData.length) return; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const last = this.stockData[this.stockData.length - 1]; const currentPriceValue = last.close; const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const currentPriceY = this.priceToY(currentPriceValue, min, max, chartH, h); const chartLeft = this.config.padding.left, lineEndX = w - this.config.padding.right; const isUpCandle = last.close >= last.open; const baseColor = isUpCandle ? this.config.currentBullColor : this.config.currentBearColor; ctx.save(); ctx.setLineDash([1, 2]); ctx.strokeStyle = baseColor; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(chartLeft, currentPriceY); ctx.lineTo(lineEndX, currentPriceY); ctx.stroke(); ctx.restore(); const tagExtra = (typeof window.S8_CHART_PRICE_TAG_EXTRA === 'function') ? window.S8_CHART_PRICE_TAG_EXTRA(this) : null; this._s8TagExtra = tagExtra || null; const labelHeight = tagExtra ? 30 : 20, labelPadding = 5, borderRadius = 3; let y = Math.max(this.config.padding.top + labelHeight / 2, Math.min(chartBottom - labelHeight / 2, currentPriceY)); const label = s8FormatChartPrice(currentPriceValue); ctx.font = '12px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; let txtW = ctx.measureText(label).width; if (tagExtra) { ctx.font = '10px Arial'; txtW = Math.max(txtW, ctx.measureText(tagExtra).width); ctx.font = '12px Arial' } const x = w - this.config.padding.right; const rectX = x, rectY = y - labelHeight / 2; const labelWidth = txtW + 2 * labelPadding; ctx.fillStyle = baseColor; ctx.beginPath(); ctx.moveTo(rectX + borderRadius, rectY); ctx.lineTo(rectX + labelWidth - borderRadius, rectY); ctx.arcTo(rectX + labelWidth, rectY, rectX + labelWidth, rectY + borderRadius, borderRadius); ctx.lineTo(rectX + labelWidth, rectY + labelHeight - borderRadius); ctx.arcTo(rectX + labelWidth, rectY + labelHeight, rectX + labelWidth - borderRadius, rectY + labelHeight, borderRadius); ctx.lineTo(rectX + borderRadius, rectY + labelHeight); ctx.arcTo(rectX, rectY + labelHeight, rectX, rectY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rectX, rectY + borderRadius); ctx.arcTo(rectX, rectY, rectX + borderRadius, rectY, borderRadius); ctx.closePath(); ctx.strokeStyle = this.config.darkMode ? 'rgba(0,0,0,0.9)' : '#fff'; ctx.lineWidth = 2; ctx.stroke(); ctx.fill(); ctx.fillStyle = '#FFFFFF'; if (tagExtra) { ctx.fillText(label, x + labelPadding, y - 6); ctx.font = '10px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillText(tagExtra, x + labelPadding, y + 8) } else ctx.fillText(label, x + labelPadding, y) }
    drawIndicatorPriceLabels(ctx, priceScaleMin, priceScaleMax) { if (!this.stockData || !this.stockData.length) return; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const labelXPosition = w - this.config.padding.right; const labelHeight = 20, labelPadding = 5, labelFontSize = 12, borderRadius = 3; ctx.font = `${labelFontSize}px Arial`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; this.movingAverages.forEach(ma => { if (ma.enabled && ma.data && ma.data.length) { const data = ma.data; const indicatorColor = ma.color; const processValue = (val, bandName = '') => { if (val === null || val === undefined) return; const y = this.priceToY(val, priceScaleMin, priceScaleMax, chartH, h); const clampedY = Math.max(this.config.padding.top + labelHeight / 2, Math.min(y, chartBottom - labelHeight / 2)); const labelText = s8FormatChartPrice(val); const textWidth = ctx.measureText(labelText).width; const labelWidth = textWidth + 2 * labelPadding; const rectX = labelXPosition, rectY = clampedY - labelHeight / 2; ctx.fillStyle = indicatorColor; ctx.beginPath(); ctx.moveTo(rectX + borderRadius, rectY); ctx.lineTo(rectX + labelWidth - borderRadius, rectY); ctx.arcTo(rectX + labelWidth, rectY, rectX + labelWidth, rectY + borderRadius, borderRadius); ctx.lineTo(rectX + labelWidth, rectY + labelHeight - borderRadius); ctx.arcTo(rectX + labelWidth, rectY + labelHeight, rectX + labelWidth - borderRadius, rectY + labelHeight, borderRadius); ctx.lineTo(rectX + borderRadius, rectY + labelHeight); ctx.arcTo(rectX, rectY + labelHeight, rectX, rectY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rectX, rectY + borderRadius); ctx.arcTo(rectX, rectY, rectX + borderRadius, rectY, borderRadius); ctx.closePath(); ctx.save(); if (this.config.darkMode) { ctx.strokeStyle = 'rgba(0,0,0,0.9)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = 'rgba(8,10,14,0.94)'; ctx.fill(); ctx.strokeStyle = indicatorColor; ctx.lineWidth = 1; ctx.stroke() } else { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); ctx.fill() } ctx.restore(); ctx.fillStyle = this.config.darkMode ? indicatorColor : '#fff'; ctx.fillText(labelText, labelXPosition + labelPadding, clampedY) }; if (data && data.length > 0) { processValue(data[data.length - 1]) } } }); const staticIndicatorsToDraw = [{ key: 'vwap', name: 'VWAP' }, { key: 'bollinger', name: 'BB' }, { key: 'parabolicSAR', name: 'SAR' }]; staticIndicatorsToDraw.forEach(info => { if (this.indicators[info.key] && this.indicators[info.key].enabled) { const indicator = this.indicators[info.key]; const indicatorColor = indicator.color; const data = indicator.data; const processValue = (val, bandName = '') => { if (val === null || val === undefined) return; const y = this.priceToY(val, priceScaleMin, priceScaleMax, chartH, h); const clampedY = Math.max(this.config.padding.top + labelHeight / 2, Math.min(y, chartBottom - labelHeight / 2)); const labelText = s8FormatChartPrice(val); const textWidth = ctx.measureText(labelText).width; const labelWidth = textWidth + 2 * labelPadding; const rectX = labelXPosition, rectY = clampedY - labelHeight / 2; ctx.fillStyle = indicatorColor; ctx.beginPath(); ctx.moveTo(rectX + borderRadius, rectY); ctx.lineTo(rectX + labelWidth - borderRadius, rectY); ctx.arcTo(rectX + labelWidth, rectY, rectX + labelWidth, rectY + borderRadius, borderRadius); ctx.lineTo(rectX + labelWidth, rectY + labelHeight - borderRadius); ctx.arcTo(rectX + labelWidth, rectY + labelHeight, rectX + labelWidth - borderRadius, rectY + labelHeight, borderRadius); ctx.lineTo(rectX + borderRadius, rectY + labelHeight); ctx.arcTo(rectX, rectY + labelHeight, rectX, rectY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rectX, rectY + borderRadius); ctx.arcTo(rectX, rectY, rectX + borderRadius, rectY, borderRadius); ctx.closePath(); ctx.save(); if (this.config.darkMode) { ctx.strokeStyle = 'rgba(0,0,0,0.9)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = 'rgba(8,10,14,0.94)'; ctx.fill(); ctx.strokeStyle = indicatorColor; ctx.lineWidth = 1; ctx.stroke() } else { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); ctx.fill() } ctx.restore(); ctx.fillStyle = this.config.darkMode ? indicatorColor : '#fff'; ctx.fillText(labelText, labelXPosition + labelPadding, clampedY) }; if (info.key === 'bollinger' && data && data.upper && data.middle && data.lower) { processValue(data.upper[data.upper.length - 1], 'BB Up'); processValue(data.middle[data.middle.length - 1], 'BB Mid'); processValue(data.lower[data.lower.length - 1], 'BB Low') } else if (data && data.length > 0) { processValue(data[data.length - 1]) } } }) }
    drawWatermark(ctx, w, h) { ctx.save(); const fontParts = this.config.watermark.font.split(' '); const sizeIndex = fontParts.findIndex(part => part.includes('px')); const mainFontSize = parseInt(fontParts[sizeIndex]); const verticalSpacing = mainFontSize * 0.4; ctx.font = this.config.watermark.font; ctx.fillStyle = this.config.darkMode ? `rgba(255,255,255,${this.config.watermark.opacity})` : `rgba(0,0,0,${this.config.watermark.opacity})`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(this.config.watermark.text, w * 0.5, h * 0.5 - verticalSpacing); const timeframeFontSize = Math.max(Math.floor(mainFontSize * 0.5), 12); ctx.font = this.config.watermark.font.replace(/\d+px/, `${timeframeFontSize}px`); ctx.fillText(this.formatTimeframeLabel(this.timeframe), w * 0.5, h * 0.5 + verticalSpacing); ctx.restore() }
    // Fullscreen brand mark: the same outlined wordmark and 15px corner inset the
    // clipboard screenshot uses, but smaller (24px vs 36px). It is a DOM node, not canvas paint, so it is
    // built once on the first toggle and shown purely by the container's
    // .fullscreen class - every exit path (button, Escape) hides it for free.
    // The canvas is 100vh - 10px tall in fullscreen, hence 15 + 10 from the bottom.
    _ensureFullscreenLogo() {
        if (this._fullscreenLogoEl) return;
        if (!document.getElementById('sc-fullscreen-logo-style')) {
            const style = document.createElement('style');
            style.id = 'sc-fullscreen-logo-style';
            style.textContent = '.sc-fullscreen-logo{display:none;position:absolute;left:15px;bottom:25px;height:24px;width:auto;z-index:4;pointer-events:none;user-select:none}'
                + '.sc-chart-container.fullscreen .sc-fullscreen-logo{display:block}';
            document.head.appendChild(style);
        }
        const img = document.createElement('img');
        img.className = 'sc-fullscreen-logo';
        img.alt = 'simul8or';
        img.draggable = false;
        img.src = StockChart.ASSET_BASE + 'simul8or-logo.svg';
        this.chartContainer.appendChild(img);
        this._fullscreenLogoEl = img;
    }

    // Corner mark, bottom-left of the price area - the spot TradingView uses.
    // Sits inside the plot, not over the time axis, and never intercepts a click:
    // it is painted onto the canvas rather than being a DOM node on top of it.
    //
    // The logo is a shared per-URL Image: many charts on one page (Markets draws
    // three) decode it once between them. It arrives after the first paint, so the
    // load handler asks for one redraw - guarded, or every chart on the page would
    // redraw for every other chart's load of the same file.
    drawBrandingLogo(ctx) {
        const src = this.config.branding.logo;
        if (!src) return false;

        StockChart._logoCache = StockChart._logoCache || {};
        let img = StockChart._logoCache[src];
        if (!img) {
            img = new Image();
            img.src = src;
            StockChart._logoCache[src] = img;
        }
        if (!img.complete || !img.naturalWidth) {
            if (!img._scRedrawBound) {
                img._scRedrawBound = true;
                img.addEventListener('load', () => {
                    document.querySelectorAll('.sc-chart-container').forEach(el => {
                        if (el._scInstance && typeof el._scInstance.drawCharts === 'function') el._scInstance.drawCharts();
                    });
                });
            }
            return false;
        }

        const h = this.config.branding.logoHeight;
        const w = h * (img.naturalWidth / img.naturalHeight);
        // The floor of the whole plot stack - below every indicator panel, above the
        // time-axis labels (padding.bottom). Deliberately NOT the bottom of the price
        // area: that moves up each time a panel is added, and the mark should stay
        // put in the corner. Panels paint no background, and the mark is drawn under
        // the data, so panel content simply passes over it.
        const bottom = this.getCanvasHeight() - this.config.padding.bottom;

        ctx.save();
        ctx.globalAlpha = this.config.branding.logoOpacity;
        ctx.drawImage(img, this.config.padding.left + 10, bottom - h - 6, w, h);
        ctx.restore();
        this._brandingLogoTop = bottom - h - 6;
        return true;
    }

    // Painted last, from drawBranding, and deliberately so: indicator panels lay a
    // translucent rgba(30,34,45,.8) background over their whole region, which sits
    // exactly where this mark goes and knocked it back to about a fifth of its set
    // opacity when it was drawn earlier. On top, what you set is what you see.
    drawBranding(ctx) { this._brandingLogoTop = null; if (!this.config.branding.enabled) return; if (this.drawBrandingLogo(ctx)) return; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); ctx.save(); ctx.font = this.config.branding.font; ctx.fillStyle = this.config.darkMode ? `rgba(255,255,255,${this.config.branding.opacity})` : `rgba(100,100,100,${this.config.branding.opacity})`; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(this.config.branding.text, 10, h - 2); ctx.restore() }
    calculatePriceAxisScale(min, max, chartHeight) {
        const labelGap = this.config.targetPixelsPerLabel;
        const height = Math.max(1, chartHeight);
        const tickCount = Math.max(2, Math.min(20, Math.floor(height / labelGap) + 1));
        const scale = this.calculateNiceScale(min, max, tickCount);
        // Rounding a price interval down can undo the height-based tick budget.
        // Round up when needed to keep adjacent labels at least labelGap apart.
        const minimumStep = (max - min) * labelGap / height;
        if (scale.tickSpacing >= minimumStep) return scale;
        const tickSpacing = this.niceNumber(minimumStep, false);
        return {
            min: Math.floor(min / tickSpacing) * tickSpacing,
            max: Math.ceil(max / tickSpacing) * tickSpacing,
            tickSpacing
        };
    }
    calculateNiceScale(min, max, ticks = 5) {
        if (Math.abs(max - min) < 1e-5) { min -= 1; max += 1 }
        const rng = this.niceNumber(max - min, !1); const spacing = this.niceNumber(rng / (ticks - 1), !0); return { min: Math.floor(min / spacing) * spacing, max: Math.ceil(max / spacing) * spacing, tickSpacing: spacing }
    }
    niceNumber(range, round) {
        if (range === 0) return 1; const exp = Math.floor(Math.log10(range)); const frac = range / Math.pow(10, exp); let nice; if (round) { if (frac < 1.5) nice = 1; else if (frac < 3) nice = 2; else if (frac < 7) nice = 5; else nice = 10 } else { if (frac <= 1) nice = 1; else if (frac <= 2) nice = 2; else if (frac <= 5) nice = 5; else nice = 10 }
        return nice * Math.pow(10, exp)
    }
    // Crosshair date label, TradingView's shape: "Wed 29 Jul '26   22:39". The
    // weekday earns its space on intraday charts (it answers "which session am I
    // in?" without counting candles) and the abbreviated month plus 2-digit year
    // is narrower than 7/3/2024 despite carrying more information.
    formatDetailTimestamp(ts, timeframe) {
        const normalized = this.normalizeTimeframeAlias(timeframe);
        const d = new Date(ts);
        const isIntraday = ['1min', '2min', '5min', '15min', '30min', '1hour', '4hour'].includes(normalized);
        const opts = { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' };
        if (isIntraday) {
            // Intraday stamps are market time; daily and up are date-only, where
            // reading them as UTC avoids sliding back onto the previous day
            opts.timeZone = 'America/New_York';
            opts.hour = '2-digit';
            opts.minute = '2-digit';
            // hourCycle rather than hour12:false - that combination renders
            // midnight as "24:00" instead of "00:00"
            opts.hourCycle = 'h23';
        } else {
            opts.timeZone = 'UTC';
        }
        const p = {};
        for (const part of new Intl.DateTimeFormat('en-GB', opts).formatToParts(d)) p[part.type] = part.value;
        const datePart = `${p.weekday} ${p.day} ${p.month} '${p.year}`;
        // Wide gap between date and time, as TradingView has it
        return isIntraday ? `${datePart}   ${p.hour}:${p.minute}` : datePart;
    }
    detectTimeframe(data) { if (!data || data.length < 2) return '1day'; const diff = Math.abs(data[1].t - data[0].t); if (diff < 90000) return '1min'; if (diff < 600000) return '5min'; if (diff < 1800000) return '15min'; if (diff < 3600000) return '30min'; if (diff < 86400000) return '1hour'; if (diff < 604800000) return '1day'; if (diff < 2678400000) return '1week'; return '1month' }
    formatTimestamp(ts, tf) { const normalized = this.normalizeTimeframeAlias(tf); const d = new Date(ts); switch (normalized) { case '1min': case '5min': case '15min': case '30min': { const et = d.toLocaleString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false }); return et } case '1hour': case '4hour': { const et = d.toLocaleString('en-US', { timeZone: 'America/New_York', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }); return et.replace(',', '') } case '1day': return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`; case '1week': case '1month': return `${d.getUTCMonth() + 1}/${String(d.getUTCFullYear()).slice(-2)}`; default: return `${d.getUTCMonth() + 1}/${d.getUTCDate()}` } }
    pad(n) { return String(n).padStart(2, '0') }
    destroy() { window.removeEventListener('resize', this.debouncedResize); this.teardownDrawingHistory() }
    updateOHLCOverlay() {
        if (this.stockData.length > 0) {
            const last = this.stockData[this.stockData.length - 1]; if (this.openEl) this.openEl.textContent = s8FormatChartPrice(last.open); if (this.highEl) this.highEl.textContent = s8FormatChartPrice(last.high); if (this.lowEl) this.lowEl.textContent = s8FormatChartPrice(last.low); if (this.closeEl) { this.closeEl.textContent = s8FormatChartPrice(last.close); this.closeEl.style.color = last.close >= last.open ? '#26a69a' : '#ef5350' }
            this.updateChangeRange(this.stockData.length - 1);
            if (this.volEl) {
                let suffix = '', scaled = last.volume; if (scaled >= 1e9) { suffix = 'B'; scaled /= 1e9 } else if (scaled >= 1e6) { suffix = 'M'; scaled /= 1e6 } else if (scaled >= 1e3) { suffix = 'K'; scaled /= 1e3 }
                this.volEl.textContent = parseFloat(scaled.toFixed(2)) + suffix
            }
            this.updateIndicatorValuesDisplay(this.stockData.length - 1); this.updateATRDisplay()
        } else { if (this.openEl) this.openEl.textContent = ''; if (this.highEl) this.highEl.textContent = ''; if (this.lowEl) this.lowEl.textContent = ''; if (this.closeEl) this.closeEl.textContent = ''; this.updateChangeRange(-1); if (this.volEl) this.volEl.textContent = ''; if (this.indicatorValuesDisplay) this.indicatorValuesDisplay.innerHTML = ''; this.updateATRDisplay() }
    }
    // Legend change (vs the previous candle's close, like TradingView) and range (high - low).
    updateChangeRange(i) {
        const c = this.stockData[i];
        if (!c) { if (this.changeEl) this.changeEl.textContent = ''; if (this.rangeEl) this.rangeEl.textContent = ''; return }
        const prev = this.stockData[i - 1];
        const base = prev ? prev.close : c.open;
        const dec = s8PriceDecimals(c.close);
        if (this.changeEl) {
            const diff = c.close - base;
            const pct = base ? diff / base * 100 : 0;
            const sign = diff > 0 ? '+' : (diff < 0 ? '-' : '');
            this.changeEl.textContent = sign + Math.abs(diff).toFixed(dec) + ' (' + sign + Math.abs(pct).toFixed(2) + '%)';
            this.changeEl.style.color = diff >= 0 ? '#26a69a' : '#ef5350';
        }
        if (this.rangeEl) this.rangeEl.textContent = (c.high - c.low).toFixed(dec);
    }
    updateATRDisplay() {
        if (!this.atrDisplay) return; if (this.indicators.atr.enabled && this.indicators.atr.data.length > 0) {
            const currentATR = this.indicators.atr.data[this.indicators.atr.data.length - 1]; if (currentATR !== null && currentATR !== undefined) {
                const textColor = this.config.darkMode ? this.config.darkModeColors.textColor : this.config.textColor; this.atrDisplay.innerHTML = `
                    <span style="color: ${textColor}; font-family: 'Open Sans', Arial, sans-serif; font-weight: 500;">
                        <span style="background-color: ${this.indicators.atr.color}; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; display: inline-block;"></span>
                        ATR(${this.indicators.atr.period}): ${currentATR.toFixed(4)}
                    </span>
                `; this.atrDisplay.style.display = 'flex'
            } else { this.atrDisplay.style.display = 'none' }
        } else { this.atrDisplay.style.display = 'none' }
    }
    updateTickerLogo(symbol) {
        if (!this.tickerLogoEl) return;
        const key = typeof symbol === 'string' ? symbol.trim().toUpperCase() : '';
        if (this._tickerLogoSymbol === key) return;
        this._tickerLogoSymbol = key;
        const image = this.tickerLogoEl;
        image.hidden = true;
        image.onload = null;
        image.onerror = null;
        image.removeAttribute('src');
        if (!/^[A-Z0-9.\-]{1,10}$/.test(key)) return;
        image.onload = () => { if (this._tickerLogoSymbol === key) image.hidden = false; };
        image.onerror = () => { if (this._tickerLogoSymbol === key) { image.hidden = true; image.removeAttribute('src'); } };
        const logoUrl = typeof this.options.tickerLogoUrl === 'function' ? this.options.tickerLogoUrl(key) : null; if (!logoUrl) return; image.src = logoUrl;
    }
    setTickerInfo(info) {
        if (info) this.keyLevelPrevClose = info.previousClose > 0 ? Number(info.previousClose) : null;
        if (!info || !this.tickerInfoDisplay) return;
        const bullColor = this.config.darkMode ? this.config.darkModeColors.bullColor : this.config.bullColor;
        const bearColor = this.config.darkMode ? this.config.darkModeColors.bearColor : this.config.bearColor;
        const textColor = this.config.darkMode ? this.config.darkModeColors.textColor : this.config.textColor;
        const change = info.change || 0;
        const changePercent = info.changePercent || 0;
        const changeColor = change >= 0 ? bullColor : bearColor;
        if (this.tickerSymbolEl) this.tickerSymbolEl.textContent = info.symbol || '';
        this.updateTickerLogo(info.logoSymbol !== undefined ? info.logoSymbol : info.symbol);
        if (this.companyNameEl) {
            const name = info.companyName || '';
            this.companyNameEl.textContent = name ? name : '';
            this.companyNameEl.style.display = name ? 'inline' : 'none';
        }
        if (this.currentPriceEl && info.price != null) {
            this.currentPriceEl.textContent = s8FormatChartPrice(info.price);
            this.currentPriceEl.style.color = changeColor;
        }
        if (this.dayChangeEl) {
            this.dayChangeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(s8PriceDecimals(info.price))}`;
            this.dayChangeEl.style.color = changeColor;
        }
        if (this.dayChangePctEl) {
            this.dayChangePctEl.textContent = `(${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
            this.dayChangePctEl.style.color = changeColor;
        }
    }
    calculateOverlayWidths() { }
    applyOverlayWidths() { }
    formatVolume(vol) {
        let suffix = '', scaled = vol; if (vol >= 1e9) { suffix = 'B'; scaled /= 1e9 } else if (vol >= 1e6) { suffix = 'M'; scaled /= 1e6 } else if (vol >= 1e3) { suffix = 'K'; scaled /= 1e3 }
        return parseFloat(scaled.toFixed(2)) + suffix
    }
    activateLineDrawingMode() { this.deactivateTextMode(); this.lineDrawingMode = !0; this.priceCanvas.style.cursor = 'crosshair'; this.priceCanvas.classList.add('line-drawing-mode'); this.lineToolButton.classList.add('active'); this.textToolButton.classList.remove('active'); this.drawCharts() }
    deactivateLineDrawingMode() { this.lineDrawingMode = !1; this.drawingLine = !1; this.currentLine = null; this.priceCanvas.classList.remove('line-drawing-mode'); this.lineToolButton.classList.remove('active'); this.priceCanvas.style.cursor = 'default'; this.drawCharts() }
    activateTextMode() { this.deactivateLineDrawingMode(); this.textMode = !0; this.priceCanvas.style.cursor = 'text'; this.textToolButton.classList.add('active'); this.lineToolButton.classList.remove('active'); this.textSettingsPanel.style.display = 'block'; this.indicatorsDropdown.classList.remove('active'); this.indicatorsButton.classList.remove('active'); this.timeframeDropdown.classList.remove('active'); this.timeframeButton.classList.remove('active') }
    deactivateTextMode() { this.textMode = !1; this.priceCanvas.style.cursor = 'default'; this.textToolButton.classList.remove('active'); this.textSettingsPanel.style.display = 'none'; this.selectedTextIndex = null; this.removeTextInput(); this.drawCharts() }
    applyTextSettingsToSelected() { if (this.selectedTextIndex !== null) { const annotation = this.textAnnotations[this.selectedTextIndex]; annotation.fontSize = this.textSettings.fontSize; annotation.fontFamily = this.textSettings.fontFamily; annotation.color = this.textSettings.color; annotation.fontWeight = this.textSettings.fontWeight; this.drawCharts() } }
    activateEmoticonMode() { this.deactivateLineDrawingMode(); this.deactivateTextMode(); this.emoticonMode = !0; this.priceCanvas.style.cursor = 'crosshair'; this.emoticonToolButton.classList.add('active'); this.lineToolButton.classList.remove('active'); this.textToolButton.classList.remove('active'); this.emoticonPanel.style.display = 'block'; this.indicatorsDropdown.classList.remove('active'); this.indicatorsButton.classList.remove('active'); this.timeframeDropdown.classList.remove('active'); this.timeframeButton.classList.remove('active') }
    deactivateEmoticonMode() { this.emoticonMode = !1; this.priceCanvas.style.cursor = 'default'; this.emoticonToolButton.classList.remove('active'); this.emoticonPanel.style.display = 'none'; this.selectedEmoticonIndex = null; this.drawCharts() }
    activateFibonacciMode() { this.deactivateLineDrawingMode(); this.deactivateTextMode(); this.deactivateEmoticonMode(); this.fibonacciMode = !0; this.priceCanvas.style.cursor = 'crosshair'; this.fibonacciToolButton.classList.add('active'); this.lineToolButton.classList.remove('active'); this.textToolButton.classList.remove('active'); this.emoticonToolButton.classList.remove('active') }
    deactivateFibonacciMode() { this.fibonacciMode = !1; this.drawingFibonacci = !1; this.currentFibonacci = null; this.priceCanvas.style.cursor = 'default'; this.fibonacciToolButton.classList.remove('active'); this.selectedFibonacciIndex = null; this.drawCharts() }
    activateDrawingToolsMode() { this.deactivateLineDrawingMode(); this.deactivateTextMode(); this.deactivateEmoticonMode(); this.deactivateFibonacciMode(); this.drawingToolsMode = !0; this.priceCanvas.style.cursor = 'crosshair'; this.drawingToolsButton.classList.add('active'); this.lineToolButton.classList.remove('active'); this.textToolButton.classList.remove('active'); this.emoticonToolButton.classList.remove('active'); this.fibonacciToolButton.classList.remove('active'); this.drawingToolsPanel.style.display = 'block'; this.activateSelectedDrawingTool() }
    deactivateDrawingToolsMode() {
        this.drawingToolsMode = !1; this.priceCanvas.style.cursor = 'default'; this.drawingToolsButton.classList.remove('active'); this.drawingToolsPanel.style.display = 'none'; this.selectedShapeIndex = null; this.selectedArrowIndex = null; this.selectedRectangleIndex = null; this.selectedCircleIndex = null; this.selectedFibonacciIndex = null; if (this.selectedDrawingTool === 'line') { this.deactivateLineDrawingMode() } else if (this.selectedDrawingTool === 'arrow') { this.drawingArrow = !1; this.currentArrow = null } else if (this.selectedDrawingTool === 'rectangle') { this.drawingRectangle = !1; this.currentRectangle = null } else if (this.selectedDrawingTool === 'circle') { this.drawingCircle = !1; this.currentCircle = null }
        this.drawCharts()
    }
    selectDrawingTool(tool) { const options = this.container.querySelectorAll('.sc-drawing-tool-option'); options.forEach(opt => opt.classList.remove('selected')); const selectedOption = this.container.querySelector(`[data-tool="${tool}"]`); if (selectedOption) selectedOption.classList.add('selected'); this.selectedDrawingTool = tool; this.activateSelectedDrawingTool() }
    activateSelectedDrawingTool() { if (!this.drawingToolsMode) return; this.deactivateLineDrawingMode(); this.drawingArrow = !1; this.drawingRectangle = !1; this.drawingCircle = !1; if (this.selectedDrawingTool === 'line') { this.activateLineDrawingMode() } else if (this.selectedDrawingTool === 'arrow') { this.priceCanvas.style.cursor = 'crosshair'; console.log('Arrow tool activated - click and drag to draw arrows') } else if (this.selectedDrawingTool === 'rectangle') { this.priceCanvas.style.cursor = 'crosshair'; console.log('Rectangle tool activated - click and drag to draw rectangles') } else if (this.selectedDrawingTool === 'circle') { this.priceCanvas.style.cursor = 'crosshair'; console.log('Circle tool activated - click and drag to draw circles') } else if (this.selectedDrawingTool === 'hline') { this.priceCanvas.style.cursor = 'crosshair' } else { console.log(`${this.selectedDrawingTool} tool selected - implementation coming soon!`) } }
    handleFibonacciMouseDown(x, y, event) {
        if (!this.drawingFibonacci) {
            const clickedFibIndex = this.findClickedFibonacci(x, y); if (clickedFibIndex !== null) { this.selectedFibonacciIndex = clickedFibIndex; this.drawCharts(); return }
            const snapPoint = this.findPriceSnappingPoint(x, y); const startX = snapPoint ? snapPoint.x : x; const startY = snapPoint ? snapPoint.y : y; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: startMin, max: startMax } = this.applyVerticalScale(rawRange); startMin += this.config.priceOffset; startMax += this.config.priceOffset; const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const relY = (chartBottom - startY) / chartH; const startPrice = startMin + (startMax - startMin) * relY; this.currentFibonacci = { startX: startX, startY: startY, endX: x, endY: y, startPrice: startPrice, endPrice: startMin + (startMax - startMin) * ((chartBottom - y) / chartH) }; this.drawingFibonacci = !0; this.fibonacciSnapPoint = snapPoint
        }
    }
    handleFibonacciMouseMove(x, y, event) { if (this.drawingFibonacci && this.currentFibonacci) { const snapPoint = this.findPriceSnappingPoint(x, y); const endX = snapPoint ? snapPoint.x : x; const endY = snapPoint ? snapPoint.y : y; this.currentFibonacci.endX = endX; this.currentFibonacci.endY = endY; const rawRange2 = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: endMin, max: endMax } = this.applyVerticalScale(rawRange2); endMin += this.config.priceOffset; endMax += this.config.priceOffset; const chartH2 = this.getPriceChartHeight(); const chartBottom2 = this.config.padding.top + chartH2; this.currentFibonacci.endPrice = endMin + (endMax - endMin) * ((chartBottom2 - endY) / chartH2); this.fibonacciSnapPoint = snapPoint; this.drawCharts() } }
    endDrawingFibonacci() {
        if (this.drawingFibonacci && this.currentFibonacci) { const distance = Math.abs(this.currentFibonacci.endY - this.currentFibonacci.startY); if (distance > 20) { this.fibonacciRetracements.push({ startX: this.currentFibonacci.startX, startY: this.currentFibonacci.startY, endX: this.currentFibonacci.endX, endY: this.currentFibonacci.endY, startPrice: this.currentFibonacci.startPrice, endPrice: this.currentFibonacci.endPrice }) } }
        this.drawingFibonacci = !1; this.currentFibonacci = null; this.fibonacciSnapPoint = null; this.drawCharts()
    }
    findPriceSnappingPoint(x, y) {
        const snapRadius = 15; const candleWidth = this.calculateCandleWidth(); const spacing = this.config.spacing; const fullWidth = candleWidth + spacing; const candleIndex = Math.floor((x - this.config.padding.left) / fullWidth); const dataIndex = this.config.dataOffset + candleIndex; if (dataIndex < 0 || dataIndex >= this.stockData.length) return null; const candle = this.stockData[dataIndex]; const candleX = this.config.padding.left + candleIndex * fullWidth + candleWidth / 2; if (Math.abs(x - candleX) > snapRadius) return null; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const chartHeight = this.getPriceChartHeight(); const highY = this.priceToY(candle.high, min, max, chartHeight, this.getCanvasHeight()); const lowY = this.priceToY(candle.low, min, max, chartHeight, this.getCanvasHeight()); if (Math.abs(y - highY) <= snapRadius) { return { x: candleX, y: highY, price: candle.high, type: 'high' } }
        if (Math.abs(y - lowY) <= snapRadius) { return { x: candleX, y: lowY, price: candle.low, type: 'low' } }
        return null
    }
    findClickedFibonacci(x, y) {
        const clickRadius = 10; for (let i = this.fibonacciRetracements.length - 1; i >= 0; i--) { const fib = this.fibonacciRetracements[i]; const levels = this.calculateFibonacciLevels(fib.startPrice, fib.endPrice); for (const level of levels) { const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const chartHeight = this.getPriceChartHeight(); const levelY = this.priceToY(level.price, min, max, chartHeight, this.getCanvasHeight()); if (Math.abs(y - levelY) <= clickRadius && x >= this.config.padding.left && x <= this.getCanvasWidth() - this.config.padding.right) { return i } } }
        return null
    }
    calculateFibonacciLevels(startPrice, endPrice) { const diff = endPrice - startPrice; const levels = [{ ratio: 0.000, price: startPrice, label: '0.0%' }, { ratio: 0.236, price: startPrice + diff * 0.236, label: '23.6%' }, { ratio: 0.382, price: startPrice + diff * 0.382, label: '38.2%' }, { ratio: 0.500, price: startPrice + diff * 0.500, label: '50.0%' }, { ratio: 0.618, price: startPrice + diff * 0.618, label: '61.8%' }, { ratio: 0.786, price: startPrice + diff * 0.786, label: '78.6%' }, { ratio: 1.000, price: endPrice, label: '100.0%' }]; return levels }
    screenToPrice(y) { const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const relY = (chartBottom - y) / chartH; return min + (max - min) * relY }
    screenToTimestamp(x) {
        const candleWidth = this.calculateCandleWidth(); const spacing = this.config.spacing; const fullWidth = candleWidth + spacing; const candleIndex = Math.round((x - this.config.padding.left - candleWidth / 2) / fullWidth); const dataIndex = this.config.dataOffset + candleIndex; if (dataIndex < 0 || dataIndex >= this.stockData.length) { const clampedIndex = Math.max(0, Math.min(this.stockData.length - 1, dataIndex)); return this.stockData[clampedIndex].t }
        return this.stockData[dataIndex].t
    }
    priceToScreen(price) { const chartH = this.getPriceChartHeight(); const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const chartBottom = this.config.padding.top + chartH; return chartBottom - ((price - min) / (max - min)) * chartH }
    timestampToScreen(timestamp) { const candleIndex = this.findCandleIndexByTime(timestamp); if (candleIndex === -1) return null; const visibleIndex = candleIndex - this.config.dataOffset; if (visibleIndex < 0 || visibleIndex >= this.config.visibleCandles) return null; const candleWidth = this.calculateCandleWidth(); const spacing = this.config.spacing; return this.config.padding.left + visibleIndex * (candleWidth + spacing) + candleWidth / 2 }
    handleArrowMouseDown(x, y, event) {
        if (!this.drawingArrow) {
            const clickedArrowIndex = this.findClickedArrow(x, y); if (clickedArrowIndex !== null) { this.selectedShapeIndex = clickedArrowIndex; this.drawCharts(); return }
            this.currentArrow = { startX: x, startY: y, endX: x, endY: y, type: 'arrow' }; this.drawingArrow = !0
        }
    }
    handleArrowMouseMove(x, y, event) { if (this.drawingArrow && this.currentArrow) { this.currentArrow.endX = x; this.currentArrow.endY = y; this.drawCharts() } }
    endDrawingArrow() {
        if (this.drawingArrow && this.currentArrow) { const distance = Math.hypot(this.currentArrow.endX - this.currentArrow.startX, this.currentArrow.endY - this.currentArrow.startY); if (distance > 10) { this.arrows.push({ startTimestamp: this.screenToTimestamp(this.currentArrow.startX), startPrice: this.screenToPrice(this.currentArrow.startY), endTimestamp: this.screenToTimestamp(this.currentArrow.endX), endPrice: this.screenToPrice(this.currentArrow.endY), type: 'arrow' }) } }
        this.drawingArrow = !1; this.currentArrow = null; this.drawCharts()
    }
    findClickedArrow(x, y) {
        const clickRadius = 8; for (let i = this.arrows.length - 1; i >= 0; i--) {
            const arrow = this.arrows[i]; const startX = this.timestampToScreen(arrow.startTimestamp); const startY = this.priceToScreen(arrow.startPrice); const endX = this.timestampToScreen(arrow.endTimestamp); const endY = this.priceToScreen(arrow.endPrice); if (startX === null || endX === null) continue; const lineLength = Math.hypot(endX - startX, endY - startY); if (lineLength === 0) continue; const A = x - startX; const B = y - startY; const C = endX - startX; const D = endY - startY; const dot = A * C + B * D; const lenSq = C * C + D * D; const param = lenSq !== 0 ? dot / lenSq : -1; let xx, yy; if (param < 0) { xx = startX; yy = startY } else if (param > 1) { xx = endX; yy = endY } else { xx = startX + param * C; yy = startY + param * D }
            const distance = Math.hypot(x - xx, y - yy); if (distance <= clickRadius) { return i }
        }
        return null
    }
    handleRectangleMouseDown(x, y, event) {
        if (!this.drawingRectangle) {
            const clickedRectangleIndex = this.findClickedRectangle(x, y); if (clickedRectangleIndex !== null) { this.selectedShapeIndex = clickedRectangleIndex; this.drawCharts(); return }
            this.currentRectangle = { startX: x, startY: y, endX: x, endY: y, type: 'rectangle' }; this.drawingRectangle = !0
        }
    }
    handleRectangleMouseMove(x, y, event) { if (this.drawingRectangle && this.currentRectangle) { this.currentRectangle.endX = x; this.currentRectangle.endY = y; this.drawCharts() } }
    endDrawingRectangle() {
        if (this.drawingRectangle && this.currentRectangle) { const width = Math.abs(this.currentRectangle.endX - this.currentRectangle.startX); const height = Math.abs(this.currentRectangle.endY - this.currentRectangle.startY); if (width > 10 && height > 10) { this.rectangles.push({ startTimestamp: this.screenToTimestamp(this.currentRectangle.startX), startPrice: this.screenToPrice(this.currentRectangle.startY), endTimestamp: this.screenToTimestamp(this.currentRectangle.endX), endPrice: this.screenToPrice(this.currentRectangle.endY), type: 'rectangle' }) } }
        this.drawingRectangle = !1; this.currentRectangle = null; this.drawCharts()
    }
    findClickedRectangle(x, y) {
        const clickMargin = 8; for (let i = this.rectangles.length - 1; i >= 0; i--) { const rect = this.rectangles[i]; const startX = this.timestampToScreen(rect.startTimestamp); const startY = this.priceToScreen(rect.startPrice); const endX = this.timestampToScreen(rect.endTimestamp); const endY = this.priceToScreen(rect.endPrice); if (startX === null || endX === null) continue; const left = Math.min(startX, endX); const right = Math.max(startX, endX); const top = Math.min(startY, endY); const bottom = Math.max(startY, endY); const nearLeftEdge = Math.abs(x - left) <= clickMargin && y >= top - clickMargin && y <= bottom + clickMargin; const nearRightEdge = Math.abs(x - right) <= clickMargin && y >= top - clickMargin && y <= bottom + clickMargin; const nearTopEdge = Math.abs(y - top) <= clickMargin && x >= left - clickMargin && x <= right + clickMargin; const nearBottomEdge = Math.abs(y - bottom) <= clickMargin && x >= left - clickMargin && x <= right + clickMargin; if (nearLeftEdge || nearRightEdge || nearTopEdge || nearBottomEdge) { return i } }
        return null
    }
    handleCircleMouseDown(x, y, event) {
        if (!this.drawingCircle) {
            const clickedCircleIndex = this.findClickedCircle(x, y); if (clickedCircleIndex !== null) { this.selectedShapeIndex = clickedCircleIndex; this.drawCharts(); return }
            this.currentCircle = { centerX: x, centerY: y, radiusX: 0, radiusY: 0, type: 'circle' }; this.drawingCircle = !0
        }
    }
    handleCircleMouseMove(x, y, event) { if (this.drawingCircle && this.currentCircle) { this.currentCircle.radiusX = Math.abs(x - this.currentCircle.centerX); this.currentCircle.radiusY = Math.abs(y - this.currentCircle.centerY); this.drawCharts() } }
    endDrawingCircle() {
        if (this.drawingCircle && this.currentCircle) { const radius = Math.max(this.currentCircle.radiusX, this.currentCircle.radiusY); if (radius > 10) { const centerTimestamp = this.screenToTimestamp(this.currentCircle.centerX); const centerPrice = this.screenToPrice(this.currentCircle.centerY); const leftTimestamp = this.screenToTimestamp(this.currentCircle.centerX - this.currentCircle.radiusX); const rightTimestamp = this.screenToTimestamp(this.currentCircle.centerX + this.currentCircle.radiusX); const topPrice = this.screenToPrice(this.currentCircle.centerY - this.currentCircle.radiusY); const bottomPrice = this.screenToPrice(this.currentCircle.centerY + this.currentCircle.radiusY); this.circles.push({ centerTimestamp: centerTimestamp, centerPrice: centerPrice, leftTimestamp: leftTimestamp, rightTimestamp: rightTimestamp, topPrice: topPrice, bottomPrice: bottomPrice, type: 'circle' }) } }
        this.drawingCircle = !1; this.currentCircle = null; this.drawCharts()
    }
    findClickedCircle(x, y) {
        const clickMargin = 8; for (let i = this.circles.length - 1; i >= 0; i--) { const circle = this.circles[i]; const centerX = this.timestampToScreen(circle.centerTimestamp); const centerY = this.priceToScreen(circle.centerPrice); const leftX = this.timestampToScreen(circle.leftTimestamp); const rightX = this.timestampToScreen(circle.rightTimestamp); const topY = this.priceToScreen(circle.topPrice); const bottomY = this.priceToScreen(circle.bottomPrice); if (centerX === null) continue; const radiusX = leftX !== null && rightX !== null ? Math.abs(rightX - leftX) / 2 : 50; const radiusY = topY !== null && bottomY !== null ? Math.abs(bottomY - topY) / 2 : 50; const dx = (x - centerX) / radiusX; const dy = (y - centerY) / radiusY; const distance = Math.sqrt(dx * dx + dy * dy); if (Math.abs(distance - 1.0) <= clickMargin / Math.min(radiusX, radiusY)) { return i } }
        return null
    }
    addEmoticon(x, y) {
        const clickedEmoticonIndex = this.findClickedEmoticon(x, y); if (clickedEmoticonIndex !== -1) { this.handleEmoticonClick(clickedEmoticonIndex, x, y); return !0 }
        if (this.selectedEmoticonIndex !== null) { this.selectedEmoticonIndex = null; this.drawCharts() }
        if (this.selectedFibonacciIndex !== null) { this.selectedFibonacciIndex = null; this.drawCharts() }
        const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: priceMin, max: priceMax } = this.applyVerticalScale(rawRange); priceMin += this.config.priceOffset; priceMax += this.config.priceOffset; const relY = (chartBottom - y) / chartH; const price = priceMin + (priceMax - priceMin) * relY; const cW = this.calculateCandleWidth(); const candleIndex = Math.floor((x - this.config.padding.left) / (cW + this.config.spacing)); const dataIndex = this.config.dataOffset + candleIndex; if (dataIndex < 0 || dataIndex >= this.stockData.length) return; const timestamp = this.stockData[dataIndex].t; this.emoticons.push({ emoji: this.selectedEmoticonType, timestamp: timestamp, price: price, size: parseInt(this.emoticonSizeSlider.value), id: Date.now() }); this.drawCharts(); return !1
    }
    findClickedEmoticon(x, y) {
        for (let i = this.emoticons.length - 1; i >= 0; i--) { const emoticon = this.emoticons[i]; if (!emoticon.screenX || !emoticon.screenY) continue; const size = emoticon.size; const buffer = 5; if (x >= emoticon.screenX - size / 2 - buffer && x <= emoticon.screenX + size / 2 + buffer && y >= emoticon.screenY - size / 2 - buffer && y <= emoticon.screenY + size / 2 + buffer) { return i } }
        return -1
    }
    handleEmoticonClick(emoticonIndex, x, y) { if (this.selectedEmoticonIndex === emoticonIndex) { this.startEmoticonDrag(emoticonIndex, x, y) } else { this.selectedEmoticonIndex = emoticonIndex; this.drawCharts() } }
    startEmoticonDrag(emoticonIndex, x, y) { this.draggingEmoticonIndex = emoticonIndex; this.emoticonDragStartX = x; this.emoticonDragStartY = y; this.emoticonDragStarted = !1 }
    handleEmoticonDrag(e) {
        if (this.draggingEmoticonIndex === null) return; const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const dx = Math.abs(x - this.emoticonDragStartX); const dy = Math.abs(y - this.emoticonDragStartY); const dragThreshold = 5; if (!this.emoticonDragStarted && (dx > dragThreshold || dy > dragThreshold)) { this.emoticonDragStarted = !0; this.priceCanvas.style.cursor = 'grabbing' }
        if (!this.emoticonDragStarted) return; const emoticon = this.emoticons[this.draggingEmoticonIndex]; const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: priceMin, max: priceMax } = this.applyVerticalScale(rawRange); priceMin += this.config.priceOffset; priceMax += this.config.priceOffset; const relY = (chartBottom - y) / chartH; const newPrice = priceMin + (priceMax - priceMin) * relY; const cW = this.calculateCandleWidth(); const candleIndex = Math.floor((x - this.config.padding.left) / (cW + this.config.spacing)); const dataIndex = this.config.dataOffset + candleIndex; if (dataIndex >= 0 && dataIndex < this.stockData.length) { const newTimestamp = this.stockData[dataIndex].t; emoticon.timestamp = newTimestamp; emoticon.price = newPrice; this.drawCharts() }
    }
    endEmoticonDrag() { this.draggingEmoticonIndex = null; this.emoticonDragStarted = !1; this.priceCanvas.style.cursor = this.emoticonMode ? 'crosshair' : 'default' }
    deleteSelectedEmoticon() { if (this.selectedEmoticonIndex !== null) { this.emoticons.splice(this.selectedEmoticonIndex, 1); this.selectedEmoticonIndex = null; this.drawCharts() } }
    deleteSelectedFibonacci() { if (this.selectedFibonacciIndex !== null) { this.fibonacciRetracements.splice(this.selectedFibonacciIndex, 1); this.selectedFibonacciIndex = null; this.drawCharts() } }
    deleteSelectedArrow() { if (this.selectedShapeIndex !== null) { this.arrows.splice(this.selectedShapeIndex, 1); this.selectedShapeIndex = null; this.drawCharts() } }
    deleteSelectedRectangle() { if (this.selectedShapeIndex !== null) { this.rectangles.splice(this.selectedShapeIndex, 1); this.selectedShapeIndex = null; this.drawCharts() } }
    deleteSelectedCircle() { if (this.selectedShapeIndex !== null) { this.circles.splice(this.selectedShapeIndex, 1); this.selectedShapeIndex = null; this.drawCharts() } }
    deleteSelectedArrowUniversal() { if (this.selectedArrowIndex !== null) { this.arrows.splice(this.selectedArrowIndex, 1); this.selectedArrowIndex = null; this.drawCharts() } }
    deleteSelectedRectangleUniversal() { if (this.selectedRectangleIndex !== null) { this.rectangles.splice(this.selectedRectangleIndex, 1); this.selectedRectangleIndex = null; this.drawCharts() } }
    deleteSelectedCircleUniversal() { if (this.selectedCircleIndex !== null) { this.circles.splice(this.selectedCircleIndex, 1); this.selectedCircleIndex = null; this.drawCharts() } }
    addTextAnnotation(x, y) {
        if (this.activeTextInput) { return !0 }
        const clickedTextIndex = this.findClickedText(x, y); if (clickedTextIndex !== -1) { this.handleTextClick(clickedTextIndex, x, y); return !0 }
        if (this.selectedTextIndex !== null) { this.selectedTextIndex = null }
        this.showTextInput(x, y, '', (text) => { if (!text) return; const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: priceMin, max: priceMax } = this.applyVerticalScale(rawRange); priceMin += this.config.priceOffset; priceMax += this.config.priceOffset; const relY = (chartBottom - y) / chartH; const price = priceMin + (priceMax - priceMin) * relY; const cW = this.calculateCandleWidth(); const candleIndex = Math.floor((x - this.config.padding.left) / (cW + this.config.spacing)); const dataIndex = this.config.dataOffset + candleIndex; if (dataIndex < 0 || dataIndex >= this.stockData.length) return; const timestamp = this.stockData[dataIndex].t; this.textAnnotations.push({ text: text, timestamp: timestamp, price: price, fontSize: this.textSettings.fontSize, fontFamily: this.textSettings.fontFamily, color: this.textSettings.color, fontWeight: this.textSettings.fontWeight, id: Date.now() }); this.drawCharts() }); return !0
    }
    findClickedText(x, y) {
        for (let i = this.textAnnotations.length - 1; i >= 0; i--) { const annotation = this.textAnnotations[i]; if (!annotation.screenX || !annotation.screenY) continue; const ctx = this.priceCtx; ctx.font = `${annotation.fontWeight} ${annotation.fontSize}px ${annotation.fontFamily}`; const lines = annotation.text.split('\n'); const lineHeight = annotation.fontSize * 1.2; let maxWidth = 0; lines.forEach(line => { const lineWidth = ctx.measureText(line).width; maxWidth = Math.max(maxWidth, lineWidth) }); const totalHeight = lines.length * lineHeight; const buffer = 5; if (x >= annotation.screenX - buffer && x <= annotation.screenX + maxWidth + buffer && y >= annotation.screenY - annotation.fontSize - buffer && y <= annotation.screenY + totalHeight - annotation.fontSize + buffer) { return i } }
        return -1
    }
    handleTextClick(textIndex, x, y) { if (this.selectedTextIndex === textIndex) { this.startTextDrag(textIndex, x, y) } else { this.selectedTextIndex = textIndex; this.drawCharts() } }
    startTextDrag(textIndex, x, y) { this.draggingTextIndex = textIndex; this.textDragStartX = x; this.textDragStartY = y; this.textDragStarted = !1 }
    handleTextDrag(e) {
        if (this.draggingTextIndex === null) return; const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const dx = Math.abs(x - this.textDragStartX); const dy = Math.abs(y - this.textDragStartY); const dragThreshold = 5; if (!this.textDragStarted && (dx > dragThreshold || dy > dragThreshold)) { this.textDragStarted = !0; this.priceCanvas.style.cursor = 'grabbing' }
        if (!this.textDragStarted) return; const annotation = this.textAnnotations[this.draggingTextIndex]; const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: priceMin, max: priceMax } = this.applyVerticalScale(rawRange); priceMin += this.config.priceOffset; priceMax += this.config.priceOffset; const relY = (chartBottom - y) / chartH; const newPrice = priceMin + (priceMax - priceMin) * relY; const cW = this.calculateCandleWidth(); const candleIndex = Math.floor((x - this.config.padding.left) / (cW + this.config.spacing)); const dataIndex = this.config.dataOffset + candleIndex; if (dataIndex >= 0 && dataIndex < this.stockData.length) { const newTimestamp = this.stockData[dataIndex].t; annotation.timestamp = newTimestamp; annotation.price = newPrice; this.drawCharts() }
    }
    endTextDrag() {
        if (this.draggingTextIndex !== null && !this.textDragStarted) { this.editTextAnnotation(this.draggingTextIndex) }
        this.draggingTextIndex = null; this.textDragStarted = !1; this.priceCanvas.style.cursor = this.textMode ? 'text' : 'default'
    }
    handleArrowClick(arrowIndex, x, y) { if (this.selectedArrowIndex === arrowIndex) { this.startArrowDrag(arrowIndex, x, y) } else { this.selectedArrowIndex = arrowIndex; this.drawCharts() } }
    handleRectangleClick(rectangleIndex, x, y) { if (this.selectedRectangleIndex === rectangleIndex) { this.startRectangleDrag(rectangleIndex, x, y) } else { this.selectedRectangleIndex = rectangleIndex; this.drawCharts() } }
    handleCircleClick(circleIndex, x, y) { if (this.selectedCircleIndex === circleIndex) { this.startCircleDrag(circleIndex, x, y) } else { this.selectedCircleIndex = circleIndex; this.drawCharts() } }
    handleFibonacciClick(fibonacciIndex, x, y) { this.selectedFibonacciIndex = fibonacciIndex; this.drawCharts() }
    startArrowDrag(arrowIndex, x, y) { this.draggingArrowIndex = arrowIndex; this.arrowDragStartX = x; this.arrowDragStartY = y; this.arrowDragStarted = !1 }
    startRectangleDrag(rectangleIndex, x, y) { this.draggingRectangleIndex = rectangleIndex; this.rectangleDragStartX = x; this.rectangleDragStartY = y; this.rectangleDragStarted = !1 }
    startCircleDrag(circleIndex, x, y) { this.draggingCircleIndex = circleIndex; this.circleDragStartX = x; this.circleDragStartY = y; this.circleDragStarted = !1 }
    handleArrowDrag(e) {
        if (this.draggingArrowIndex === null) return; const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; if (!this.arrowDragStarted) { const distance = Math.sqrt(Math.pow(x - this.arrowDragStartX, 2) + Math.pow(y - this.arrowDragStartY, 2)); if (distance > 5) { this.arrowDragStarted = !0; this.priceCanvas.style.cursor = 'move' } }
        if (!this.arrowDragStarted) return; const arrow = this.arrows[this.draggingArrowIndex]; const startTimestamp = this.screenToTimestamp(this.arrowDragStartX); const startPrice = this.screenToPrice(this.arrowDragStartY); const currentTimestamp = this.screenToTimestamp(x); const currentPrice = this.screenToPrice(y); const deltaTimestamp = currentTimestamp - startTimestamp; const deltaPrice = currentPrice - startPrice; arrow.startTimestamp += deltaTimestamp; arrow.startPrice += deltaPrice; arrow.endTimestamp += deltaTimestamp; arrow.endPrice += deltaPrice; this.arrowDragStartX = x; this.arrowDragStartY = y; this.drawCharts()
    }
    handleRectangleDrag(e) {
        if (this.draggingRectangleIndex === null) return; const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; if (!this.rectangleDragStarted) { const distance = Math.sqrt(Math.pow(x - this.rectangleDragStartX, 2) + Math.pow(y - this.rectangleDragStartY, 2)); if (distance > 5) { this.rectangleDragStarted = !0; this.priceCanvas.style.cursor = 'move' } }
        if (!this.rectangleDragStarted) return; const rectangle = this.rectangles[this.draggingRectangleIndex]; const startTimestamp = this.screenToTimestamp(this.rectangleDragStartX); const startPrice = this.screenToPrice(this.rectangleDragStartY); const currentTimestamp = this.screenToTimestamp(x); const currentPrice = this.screenToPrice(y); const deltaTimestamp = currentTimestamp - startTimestamp; const deltaPrice = currentPrice - startPrice; rectangle.startTimestamp += deltaTimestamp; rectangle.startPrice += deltaPrice; rectangle.endTimestamp += deltaTimestamp; rectangle.endPrice += deltaPrice; this.rectangleDragStartX = x; this.rectangleDragStartY = y; this.drawCharts()
    }
    handleCircleDrag(e) {
        if (this.draggingCircleIndex === null) return; const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; if (!this.circleDragStarted) { const distance = Math.sqrt(Math.pow(x - this.circleDragStartX, 2) + Math.pow(y - this.circleDragStartY, 2)); if (distance > 5) { this.circleDragStarted = !0; this.priceCanvas.style.cursor = 'move' } }
        if (!this.circleDragStarted) return; const circle = this.circles[this.draggingCircleIndex]; const startTimestamp = this.screenToTimestamp(this.circleDragStartX); const startPrice = this.screenToPrice(this.circleDragStartY); const currentTimestamp = this.screenToTimestamp(x); const currentPrice = this.screenToPrice(y); const deltaTimestamp = currentTimestamp - startTimestamp; const deltaPrice = currentPrice - startPrice; circle.centerTimestamp += deltaTimestamp; circle.centerPrice += deltaPrice; this.circleDragStartX = x; this.circleDragStartY = y; this.drawCharts()
    }
    endArrowDrag() { this.draggingArrowIndex = null; this.arrowDragStarted = !1; this.priceCanvas.style.cursor = 'default' }
    endRectangleDrag() { this.draggingRectangleIndex = null; this.rectangleDragStarted = !1; this.priceCanvas.style.cursor = 'default' }
    endCircleDrag() { this.draggingCircleIndex = null; this.circleDragStarted = !1; this.priceCanvas.style.cursor = 'default' }
    editTextAnnotation(textIndex) { const annotation = this.textAnnotations[textIndex]; this.showTextInput(annotation.screenX, annotation.screenY, annotation.text, (newText) => { if (newText !== null && newText !== annotation.text) { annotation.text = newText; this.drawCharts() } }) }
    deleteSelectedText() { if (this.selectedTextIndex !== null) { this.textAnnotations.splice(this.selectedTextIndex, 1); this.selectedTextIndex = null; this.drawCharts() } }
    showTextInput(x, y, initialText, onComplete) {
        this.removeTextInput();

        // Position BELOW click point to avoid mouse-over issues with large fonts
        const offsetY = 10;

        // Create simple textarea (no buttons - click outside to save, ESC to cancel)
        const textarea = document.createElement('textarea');
        textarea.className = 'sc-text-annotation-input';
        textarea.value = initialText;
        textarea.placeholder = 'Type here... (click outside to save, ESC to cancel)';
        textarea.style.cssText = `position: absolute; left: ${x}px; top: ${y + offsetY}px; min-width: 180px; min-height: 45px; max-width: 350px; max-height: 250px; resize: both; font-size: ${this.textSettings.fontSize}px; font-family: ${this.textSettings.fontFamily}; font-weight: ${this.textSettings.fontWeight}; background: ${this.config.darkMode ? 'rgba(30, 34, 45, 0.98)' : 'rgba(255, 255, 255, 0.98)'}; color: ${this.config.darkMode ? '#e0e0e0' : '#333'}; border: 2px solid #4285f4; border-radius: 4px; padding: 8px; outline: none; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4); z-index: 1000;`;

        this.activeTextInput = textarea;
        this.textInputReady = !1;
        this.container.appendChild(textarea);

        // Focus after DOM is ready
        requestAnimationFrame(() => {
            textarea.focus();
            if (initialText) textarea.select();
            // Enable click-outside detection after input is stable (150ms delay)
            setTimeout(() => { this.textInputReady = !0; }, 150);
        });

        const complete = () => {
            if (!this.activeTextInput) return;
            const text = textarea.value.trim();
            this.removeTextInput();
            if (onComplete) onComplete(text || null);
        };

        const cancel = () => {
            this.removeTextInput();
            if (onComplete) onComplete(null);
        };

        // ESC to cancel, Ctrl+Enter to save
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { e.preventDefault(); cancel(); }
            else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); complete(); }
            e.stopPropagation();
        });

        // Auto-resize
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.max(45, textarea.scrollHeight)}px`;
        });

        // Stop mousedown inside textarea from triggering canvas handlers
        textarea.addEventListener('mousedown', (e) => e.stopPropagation());
        textarea.addEventListener('click', (e) => e.stopPropagation());

        // Click-outside handler - save when clicking anywhere outside the textarea
        this._textInputClickOutside = (e) => {
            if (!this.textInputReady) return;
            if (this.activeTextInput && !this.activeTextInput.contains(e.target)) {
                complete();
            }
        };

        // Delay adding listener to avoid catching the originating click
        setTimeout(() => {
            document.addEventListener('mousedown', this._textInputClickOutside);
        }, 50);
    }
    removeTextInput() {
        if (this._textInputClickOutside) {
            document.removeEventListener('mousedown', this._textInputClickOutside);
            this._textInputClickOutside = null;
        }
        if (this.activeTextInput) {
            this.activeTextInput.remove();
            this.activeTextInput = null;
        }
        this.textInputReady = !1;
    }
    drawArrows(ctx) {
        if (!this.arrows.length && !this.currentArrow) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left - this.pixelOffset, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); this.arrows.forEach((arrow, index) => { const isSelected = (index === this.selectedShapeIndex) || (index === this.selectedArrowIndex); this.drawSingleArrow(ctx, arrow, isSelected) }); if (this.currentArrow && this.drawingArrow) { this.drawSingleArrow(ctx, this.currentArrow, !1, !0) }
        ctx.restore()
    }
    drawSingleArrow(ctx, arrow, isSelected = !1, isDrawing = !1) {
        const lineColor = isSelected ? '#00ff00' : (isDrawing ? '#ffaa00' : '#2196F3'); let startX, startY, endX, endY; if (isDrawing) { startX = arrow.startX; startY = arrow.startY; endX = arrow.endX; endY = arrow.endY } else { startX = this.timestampToScreen(arrow.startTimestamp); startY = this.priceToScreen(arrow.startPrice); endX = this.timestampToScreen(arrow.endTimestamp); endY = this.priceToScreen(arrow.endPrice); if (startX === null || endX === null) return }
        ctx.strokeStyle = lineColor; ctx.fillStyle = lineColor; ctx.lineWidth = isSelected ? this.config.drawingLineWidthSelected : this.config.drawingLineWidth; ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.stroke(); const angle = Math.atan2(endY - startY, endX - startX); const arrowLength = 12; const arrowAngle = Math.PI / 6; ctx.beginPath(); ctx.moveTo(endX, endY); ctx.lineTo(endX - arrowLength * Math.cos(angle - arrowAngle), endY - arrowLength * Math.sin(angle - arrowAngle)); ctx.lineTo(endX - arrowLength * Math.cos(angle + arrowAngle), endY - arrowLength * Math.sin(angle + arrowAngle)); ctx.closePath(); ctx.fill()
    }
    drawRectangles(ctx) {
        if (!this.rectangles.length && !this.currentRectangle) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left - this.pixelOffset, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); this.rectangles.forEach((rectangle, index) => { const isSelected = (index === this.selectedShapeIndex) || (index === this.selectedRectangleIndex); this.drawSingleRectangle(ctx, rectangle, isSelected) }); if (this.currentRectangle && this.drawingRectangle) { this.drawSingleRectangle(ctx, this.currentRectangle, !1, !0) }
        ctx.restore()
    }
    drawSingleRectangle(ctx, rectangle, isSelected = !1, isDrawing = !1) {
        const lineColor = isSelected ? '#00ff00' : (isDrawing ? '#ffaa00' : '#9C27B0'); let startX, startY, endX, endY; if (isDrawing) { startX = rectangle.startX; startY = rectangle.startY; endX = rectangle.endX; endY = rectangle.endY } else { startX = this.timestampToScreen(rectangle.startTimestamp); startY = this.priceToScreen(rectangle.startPrice); endX = this.timestampToScreen(rectangle.endTimestamp); endY = this.priceToScreen(rectangle.endPrice); if (startX === null || endX === null) return }
        const left = Math.min(startX, endX); const top = Math.min(startY, endY); const width = Math.abs(endX - startX); const height = Math.abs(endY - startY); ctx.strokeStyle = lineColor; ctx.lineWidth = isSelected ? this.config.drawingLineWidthSelected : this.config.drawingLineWidth; ctx.fillStyle = lineColor; ctx.strokeRect(left, top, width, height); ctx.globalAlpha = isSelected ? 0.15 : (isDrawing ? 0.1 : 0.05); ctx.fillRect(left, top, width, height); ctx.globalAlpha = 1.0
    }
    drawCircles(ctx) {
        if (!this.circles.length && !this.currentCircle) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left - this.pixelOffset, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); this.circles.forEach((circle, index) => { const isSelected = (index === this.selectedShapeIndex) || (index === this.selectedCircleIndex); this.drawSingleCircle(ctx, circle, isSelected) }); if (this.currentCircle && this.drawingCircle) { this.drawSingleCircle(ctx, this.currentCircle, !1, !0) }
        ctx.restore()
    }
    drawSingleCircle(ctx, circle, isSelected = !1, isDrawing = !1) {
        const lineColor = isSelected ? '#00ff00' : (isDrawing ? '#ffaa00' : '#FF5722'); let centerX, centerY, radiusX, radiusY; if (isDrawing) { centerX = circle.centerX; centerY = circle.centerY; radiusX = circle.radiusX; radiusY = circle.radiusY } else { centerX = this.timestampToScreen(circle.centerTimestamp); centerY = this.priceToScreen(circle.centerPrice); const leftX = this.timestampToScreen(circle.leftTimestamp); const rightX = this.timestampToScreen(circle.rightTimestamp); const topY = this.priceToScreen(circle.topPrice); const bottomY = this.priceToScreen(circle.bottomPrice); if (centerX === null) return; radiusX = leftX !== null && rightX !== null ? Math.abs(rightX - leftX) / 2 : 50; radiusY = topY !== null && bottomY !== null ? Math.abs(bottomY - topY) / 2 : 50 }
        ctx.strokeStyle = lineColor; ctx.lineWidth = isSelected ? this.config.drawingLineWidthSelected : this.config.drawingLineWidth; ctx.fillStyle = lineColor; ctx.beginPath(); ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI); ctx.stroke(); ctx.globalAlpha = isSelected ? 0.15 : (isDrawing ? 0.1 : 0.05); ctx.fill(); ctx.globalAlpha = 1.0
    }
    drawTextAnnotations(ctx) {
        if (!this.textAnnotations.length) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left - this.pixelOffset, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; this.textAnnotations.forEach((annotation, index) => {
            const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: priceMin, max: priceMax } = this.applyVerticalScale(rawRange); priceMin += this.config.priceOffset; priceMax += this.config.priceOffset; const candleIndex = this.findCandleIndexByTime(annotation.timestamp); if (candleIndex === -1) return; const visibleIndex = candleIndex - this.config.dataOffset; if (visibleIndex < 0 || visibleIndex >= this.config.visibleCandles) return; const cW = this.calculateCandleWidth(); const screenX = this.config.padding.left + visibleIndex * (cW + this.config.spacing) + cW / 2; const relY = (annotation.price - priceMin) / (priceMax - priceMin); const screenY = chartBottom - (relY * chartH); annotation.screenX = screenX; annotation.screenY = screenY; ctx.font = `${annotation.fontWeight} ${annotation.fontSize}px ${annotation.fontFamily}`; ctx.fillStyle = annotation.color; if (index === this.selectedTextIndex) { const lines = annotation.text.split('\n'); const lineHeight = annotation.fontSize * 1.2; let maxWidth = 0; lines.forEach(line => { const lineWidth = ctx.measureText(line).width; maxWidth = Math.max(maxWidth, lineWidth) }); const totalHeight = lines.length * lineHeight; ctx.save(); ctx.strokeStyle = this.textMode ? '#00ff00' : '#ffaa00'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]); ctx.strokeRect(screenX - 2, screenY - annotation.fontSize - 2, maxWidth + 4, totalHeight + 4); ctx.restore() }
            const lines = annotation.text.split('\n'); const lineHeight = annotation.fontSize * 1.2; lines.forEach((line, lineIndex) => { const yOffset = lineIndex * lineHeight; ctx.fillText(line, screenX, screenY + yOffset) })
        }); ctx.restore()
    }
    drawEmoticons(ctx) {
        if (!this.emoticons.length) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left - this.pixelOffset, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; this.emoticons.forEach((emoticon, index) => {
            const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: priceMin, max: priceMax } = this.applyVerticalScale(rawRange); priceMin += this.config.priceOffset; priceMax += this.config.priceOffset; const candleIndex = this.findCandleIndexByTime(emoticon.timestamp); if (candleIndex === -1) return; const visibleIndex = candleIndex - this.config.dataOffset; if (visibleIndex < 0 || visibleIndex >= this.config.visibleCandles) return; const cW = this.calculateCandleWidth(); const screenX = this.config.padding.left + visibleIndex * (cW + this.config.spacing) + cW / 2; const relY = (emoticon.price - priceMin) / (priceMax - priceMin); const screenY = chartBottom - (relY * chartH); emoticon.screenX = screenX; emoticon.screenY = screenY;
            this._drawEmoticonItem(ctx, emoticon, screenX, screenY, index === this.selectedEmoticonIndex)
        }); ctx.restore()
    }
    drawFibonacciRetracements(ctx) {
        if (!this.fibonacciRetracements.length && !this.currentFibonacci) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left - this.pixelOffset, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); this.fibonacciRetracements.forEach((fib, index) => { this.drawSingleFibonacci(ctx, fib, index === this.selectedFibonacciIndex) }); if (this.currentFibonacci && this.drawingFibonacci) { this.drawSingleFibonacci(ctx, this.currentFibonacci, !1, !0) }
        if (this.fibonacciSnapPoint) { ctx.strokeStyle = '#00ff00'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(this.fibonacciSnapPoint.x, this.fibonacciSnapPoint.y, 6, 0, 2 * Math.PI); ctx.stroke() }
        ctx.restore()
    }
    drawSingleFibonacci(ctx, fib, isSelected = !1, isDrawing = !1) {
        const levels = this.calculateFibonacciLevels(fib.startPrice, fib.endPrice); const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const chartHeight = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartHeight; const chartLeft = this.config.padding.left; const chartRight = this.getCanvasWidth() - this.config.padding.right; const lineColor = isSelected ? '#00ff00' : (isDrawing ? '#ffaa00' : '#6a8ef5'); const textColor = this.config.darkMode ? '#ffffff' : '#333333'; const bgColor = this.config.darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'; levels.forEach((level, index) => {
            const levelY = this.priceToY(level.price, min, max, chartHeight, this.getCanvasHeight()); if (levelY < this.config.padding.top || levelY > chartBottom) { return }
            ctx.strokeStyle = lineColor; ctx.lineWidth = isSelected ? 2 : 1; if (index === 0 || index === levels.length - 1) { ctx.setLineDash([]) } else { ctx.setLineDash([5, 5]) }
            ctx.beginPath(); ctx.moveTo(chartLeft, levelY); ctx.lineTo(chartRight, levelY); ctx.stroke(); ctx.setLineDash([]); const labelText = `${level.label} (${s8FormatChartPrice(level.price)})`; ctx.font = '11px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const textWidth = ctx.measureText(labelText).width; const labelX = chartLeft + 5; const labelY = levelY; ctx.fillStyle = bgColor; ctx.fillRect(labelX - 2, labelY - 7, textWidth + 4, 14); ctx.fillStyle = textColor; ctx.fillText(labelText, labelX, labelY)
        }); ctx.setLineDash([])
    }
    findSnappingPoint(x, y) { if (!this.stockData || !this.stockData.length) return null; const snapThreshold = 15; let closestPoint = null, minDistance = snapThreshold; const chartH = this.getPriceChartHeight(); const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const visibleData = this.stockData.slice(Math.max(0, this.config.dataOffset), this.config.dataOffset + this.config.visibleCandles); const cW = this.calculateCandleWidth(); const lead = this.getLeadSlots(); visibleData.forEach((candle, i) => { const candleX = this.config.padding.left + (i + lead) * (cW + this.config.spacing) + cW / 2;['high', 'low', 'open', 'close'].forEach(type => { const priceVal = candle[type]; const pointY = this.priceToY(priceVal, min, max, chartH, this.getCanvasHeight()); const dist = Math.hypot(x - candleX, y - pointY); if (dist < minDistance) { minDistance = dist; closestPoint = { x: candleX, y: pointY, price: priceVal, type } } }) }); return closestPoint }
    handleLineDrawingMouseDown(x, y, event) {
        if (!this.drawingLine) { const snapPoint = (!event || !event.altKey) ? this.findSnappingPoint(x, y) : null; const startX = snapPoint ? snapPoint.x : x; const startY = snapPoint ? snapPoint.y : y; this.drawingLine = !0; this.currentLine = { startX, startY, endX: startX, endY: startY, infiniteExtension: event && event.ctrlKey } } else {
            this.drawingLine = !1; if (this.currentLine && (Math.abs(this.currentLine.startX - this.currentLine.endX) > 5 || Math.abs(this.currentLine.startY - this.currentLine.endY) > 5)) { this.saveLineDataWithPrices() }
            this.currentLine = null
        }
        this.drawCharts()
    }
    handleLineDrawingMouseMove(x, y, event) {
        if (!this.drawingLine || !this.currentLine) return; let endX = x, endY = y; this.currentLine.infiniteExtension = event && event.ctrlKey; if (event && event.shiftKey) { const dx = endX - this.currentLine.startX, dy = endY - this.currentLine.startY; const angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4); const distance = Math.hypot(dx, dy); endX = this.currentLine.startX + distance * Math.cos(angle); endY = this.currentLine.startY + distance * Math.sin(angle) }
        if (!event || !event.altKey) { const snapPoint = this.findSnappingPoint(endX, endY); if (snapPoint) { endX = snapPoint.x; endY = snapPoint.y; this.snappingPoint = snapPoint; this.snappingActive = !0 } else this.snappingActive = !1 } else this.snappingActive = !1; this.currentLine.endX = endX; this.currentLine.endY = endY; this.drawCharts()
    }
    saveLineDataWithPrices() {
        if (!this.currentLine) return; const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const startRelY = (chartBottom - this.currentLine.startY) / chartH; const endRelY = (chartBottom - this.currentLine.endY) / chartH; const startPrice = min + (max - min) * startRelY; const endPrice = min + (max - min) * endRelY; const cW = this.calculateCandleWidth(); const startCandleIndex = Math.round((this.currentLine.startX - this.config.padding.left) / (cW + this.config.spacing)); const endCandleIndex = Math.round((this.currentLine.endX - this.config.padding.left) / (cW + this.config.spacing)); const globalStartIdx = this.config.dataOffset + startCandleIndex; const globalEndIdx = this.config.dataOffset + endCandleIndex; const startTime = (globalStartIdx >= 0 && globalStartIdx < this.stockData.length) ? this.stockData[globalStartIdx].t : null; const endTime = (globalEndIdx >= 0 && globalEndIdx < this.stockData.length) ? this.stockData[globalEndIdx].t : null; if (startTime === null || endTime === null) { console.warn("Could not save line: candle index out of bounds."); return }
        this.lines.push({ ...this.currentLine, startPrice, endPrice, startTime, endTime, visible: !0, selected: !1 })
    }
    updateLinePositions() {
        if (!this.lines.length || !this.stockData.length) return; const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const cW = this.calculateCandleWidth(); const findCandleIndexByTime = ts => this.findCandleIndexByTime(ts); this.lines.forEach(line => {
            const currentStartIdx = findCandleIndexByTime(line.startTime); const currentEndIdx = findCandleIndexByTime(line.endTime); if (currentStartIdx === -1 || currentEndIdx === -1) { line.visible = !1; return }
            const startScreenIdx = currentStartIdx - this.config.dataOffset; const endScreenIdx = currentEndIdx - this.config.dataOffset; const isStartVis = startScreenIdx >= -1 && startScreenIdx <= this.config.visibleCandles; const isEndVis = endScreenIdx >= -1 && endScreenIdx <= this.config.visibleCandles; if (!isStartVis && !isEndVis && !((startScreenIdx < -1 && endScreenIdx > this.config.visibleCandles) || (startScreenIdx > this.config.visibleCandles && endScreenIdx < -1))) { line.visible = !1; return }
            line.startX = this.config.padding.left + startScreenIdx * (cW + this.config.spacing) + cW / 2; line.endX = this.config.padding.left + endScreenIdx * (cW + this.config.spacing) + cW / 2; const startRelY = (line.startPrice - min) / (max - min); const endRelY = (line.endPrice - min) / (max - min); line.startY = chartBottom - (startRelY * chartH); line.endY = chartBottom - (endRelY * chartH); line.visible = !0
        })
    }
    drawLines(ctx) {
        if (!this.lines.length && !this.currentLine) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left - this.pixelOffset, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); this.lines.forEach((line, index) => {
            if (!line.visible) return; const isSelected = index === this.selectedLineIndex; ctx.save(); ctx.beginPath(); ctx.moveTo(line.startX, line.startY); ctx.lineTo(line.endX, line.endY); if (line.infiniteExtension) { const dx = line.endX - line.startX, dy = line.endY - line.startY; if (Math.abs(dx) > 0.001) { const slope = dy / dx, rightEdge = this.getCanvasWidth() - this.config.padding.right; if (line.endX > line.startX) { const extendedY = line.endY + (slope * (rightEdge - line.endX)); ctx.save(); ctx.setLineDash([5, 3]); ctx.moveTo(line.endX, line.endY); ctx.lineTo(rightEdge, extendedY); ctx.stroke(); ctx.restore() } } }
            ctx.strokeStyle = isSelected ? this.config.drawingLineColorSelected : this.config.drawingLineColor; ctx.lineWidth = isSelected ? this.config.drawingLineWidthSelected : this.config.drawingLineWidth; ctx.stroke(); const radius = isSelected ? 5 : 3; ctx.fillStyle = isSelected ? this.config.drawingLineColorSelected : this.config.drawingLineColor; ctx.beginPath(); ctx.arc(line.startX, line.startY, radius, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(line.endX, line.endY, radius, 0, Math.PI * 2); ctx.fill(); ctx.restore()
        }); if (this.drawingLine && this.currentLine) {
            ctx.save(); ctx.beginPath(); ctx.moveTo(this.currentLine.startX, this.currentLine.startY); ctx.lineTo(this.currentLine.endX, this.currentLine.endY); ctx.strokeStyle = '#ff9800'; ctx.lineWidth = 2; ctx.stroke(); if (this.currentLine.infiniteExtension) { const dx = this.currentLine.endX - this.currentLine.startX, dy = this.currentLine.endY - this.currentLine.startY; if (Math.abs(dx) > 0.001) { const slope = dy / dx, rightEdge = this.getCanvasWidth() - this.config.padding.right; if (this.currentLine.endX > this.currentLine.startX) { const extendedY = this.currentLine.endY + (slope * (rightEdge - this.currentLine.endX)); ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(this.currentLine.endX, this.currentLine.endY); ctx.lineTo(rightEdge, extendedY); ctx.stroke() } } }
            ctx.fillStyle = '#ff9800'; ctx.beginPath(); ctx.arc(this.currentLine.startX, this.currentLine.startY, 4, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(this.currentLine.endX, this.currentLine.endY, 4, 0, Math.PI * 2); ctx.fill(); if (this.snappingActive && this.snappingPoint) { ctx.beginPath(); ctx.arc(this.snappingPoint.x, this.snappingPoint.y, 8, 0, Math.PI * 2); ctx.strokeStyle = '#ff9800'; ctx.lineWidth = 2; ctx.stroke() }
            ctx.restore()
        }
        ctx.restore()
    }
    findClickedLine(x, y) {
        if (!this.lines.length) return null; const hitDist = 5; for (let i = this.lines.length - 1; i >= 0; i--) { const line = this.lines[i]; if (!line.visible) continue; if (Math.hypot(x - line.startX, y - line.startY) <= hitDist) return { index: i, point: 'start' }; if (Math.hypot(x - line.endX, y - line.endY) <= hitDist) return { index: i, point: 'end' }; if (this.distanceToLine(x, y, line.startX, line.startY, line.endX, line.endY) <= hitDist) return { index: i, point: 'line' } }
        return null
    }
    distanceToLine(x, y, x1, y1, x2, y2) { const A = x - x1, B = y - y1, C = x2 - x1, D = y2 - y1; const dot = A * C + B * D, lenSq = C * C + D * D; if (lenSq === 0) return Math.hypot(x - x1, y - y1); let param = dot / lenSq; if (param < 0) param = 0; else if (param > 1) param = 1; const xx = x1 + param * C, yy = y1 + param * D; return Math.hypot(x - xx, y - yy) }
    startDraggingLine(lineInfo, x, y) { this.draggedLine = { index: lineInfo.index, point: lineInfo.point, startX: x, startY: y, originalLine: JSON.parse(JSON.stringify(this.lines[lineInfo.index])) }; this.selectedLineIndex = lineInfo.index }
    handleLineDragging(x, y, event) {
        if (!this.draggedLine) return; const line = this.lines[this.draggedLine.index]; const dx = x - this.draggedLine.startX, dy = y - this.draggedLine.startY; if (this.draggedLine.point === 'start') { line.startX = this.draggedLine.originalLine.startX + dx; line.startY = this.draggedLine.originalLine.startY + dy; if (!event || !event.altKey) { const snap = this.findSnappingPoint(line.startX, line.startY); if (snap) { line.startX = snap.x; line.startY = snap.y } } } else if (this.draggedLine.point === 'end') { line.endX = this.draggedLine.originalLine.endX + dx; line.endY = this.draggedLine.originalLine.endY + dy; if (!event || !event.altKey) { const snap = this.findSnappingPoint(line.endX, line.endY); if (snap) { line.endX = snap.x; line.endY = snap.y } } } else if (this.draggedLine.point === 'line') { line.startX = this.draggedLine.originalLine.startX + dx; line.startY = this.draggedLine.originalLine.startY + dy; line.endX = this.draggedLine.originalLine.endX + dx; line.endY = this.draggedLine.originalLine.endY + dy }
        this.updateLineDataAfterDrag(line); this.drawCharts()
    }
    updateLineDataAfterDrag(line) { const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const startRelY = (chartBottom - line.startY) / chartH; const endRelY = (chartBottom - line.endY) / chartH; line.startPrice = min + (max - min) * startRelY; line.endPrice = min + (max - min) * endRelY; const cW = this.calculateCandleWidth(); const startCandleIndex = Math.round((line.startX - this.config.padding.left) / (cW + this.config.spacing)); const endCandleIndex = Math.round((line.endX - this.config.padding.left) / (cW + this.config.spacing)); const startCandle = (startCandleIndex >= 0 && startCandleIndex < this.stockData.length) ? this.stockData[this.config.dataOffset + startCandleIndex] : null; const endCandle = (endCandleIndex >= 0 && endCandleIndex < this.stockData.length) ? this.stockData[this.config.dataOffset + endCandleIndex] : null; if (startCandle) line.startTime = startCandle.t; if (endCandle) line.endTime = endCandle.t }
    endDraggingLine() {
        if (this.draggedLine) { const line = this.lines[this.draggedLine.index]; this.updateLineDataAfterDrag(line); this.draggedLine = null }
        this.drawCharts()
    }
    deleteSelectedLine() { if (this.selectedLineIndex !== null) { this.lines.splice(this.selectedLineIndex, 1); this.selectedLineIndex = null; this.drawCharts() } }
    calculateMA(period, type = 'sma') {
        if (!this.stockData || this.stockData.length < period) return []; const result = []; if (type === 'sma') { for (let i = 0; i < this.stockData.length; i++) { if (i < period - 1) result.push(null); else { let sum = 0; for (let j = 0; j < period; j++)sum += this.stockData[i - j].close; result.push(sum / period) } } } else if (type === 'ema') { const multiplier = 2 / (period + 1); let sum = 0; for (let i = 0; i < period; i++)sum += this.stockData[i].close; let ema = sum / period; result.push(...Array(period - 1).fill(null), ema); for (let i = period; i < this.stockData.length; i++) { ema = (this.stockData[i].close - ema) * multiplier + ema; result.push(ema) } }
        return result
    }
    calculateVWAP() {
        if (!this.stockData || !this.stockData.length) return []; const result = []; let cumulativeTPV = 0, cumulativeVolume = 0, currentDay = null; const isSameDay = (t1, t2) => { const d1 = new Date(t1), d2 = new Date(t2); return d1.getUTCFullYear() === d2.getUTCFullYear() && d1.getUTCMonth() === d2.getUTCMonth() && d1.getUTCDate() === d2.getUTCDate() }; for (let i = 0; i < this.stockData.length; i++) {
            const candle = this.stockData[i]; if (!currentDay || !isSameDay(candle.t, currentDay)) { cumulativeTPV = 0; cumulativeVolume = 0; currentDay = candle.t }
            const typicalPrice = (candle.high + candle.low + candle.close) / 3; cumulativeTPV += typicalPrice * candle.volume; cumulativeVolume += candle.volume; result.push(cumulativeVolume > 0 ? cumulativeTPV / cumulativeVolume : typicalPrice)
        }
        return result
    }
    calculateBollingerBands(period = 20, stdDevMultiplier = 2) {
        if (!this.stockData || this.stockData.length < period) return { upper: [], middle: [], lower: [] }; const middle = this.calculateMA(period, 'sma'), upper = [], lower = []; for (let i = 0; i < this.stockData.length; i++) {
            if (i < period - 1) { upper.push(null); lower.push(null) } else {
                let sum = 0; for (let j = 0; j < period; j++) { const diff = this.stockData[i - j].close - middle[i]; sum += diff * diff }
                const stdDev = Math.sqrt(sum / period); upper.push(middle[i] + stdDevMultiplier * stdDev); lower.push(middle[i] - stdDevMultiplier * stdDev)
            }
        }
        return { upper, middle, lower }
    }
    initializeMovingAverageIndicators() { this.movingAverages.forEach((ma, index) => { ma.data = []; ma.color = this.colorPalette[index % this.colorPalette.length] }) }
    addMovingAverage(type, period) {
        const id = `${type}_${period}`; if (this.movingAverages.find(ma => ma.id === id)) { return !1 }
        const colorIndex = this.movingAverages.length % this.colorPalette.length; const newMA = { type: type, period: parseInt(period), enabled: !0, id: id, data: [], color: this.colorPalette[colorIndex] }; this.movingAverages.push(newMA); this.calculateIndicators(); this.saveSettings(); return !0
    }
    removeMovingAverage(id) {
        const index = this.movingAverages.findIndex(ma => ma.id === id); if (index !== -1) { this.movingAverages.splice(index, 1); this.calculateIndicators(); this.saveSettings(); return !0 }
        return !1
    }
    getMovingAverageColor(index) { return this.colorPalette[index % this.colorPalette.length] }
    calculateIndicators() {
        const TI = window.TechnicalIndicators;
        const CP = window.CandlestickPatterns;

        // Moving averages (existing)
        this.movingAverages.forEach(ma => { if (ma.enabled) { ma.data = this.calculateMA(ma.period, ma.type) } });

        // Existing indicators
        if (this.indicators.vwap.enabled) this.indicators.vwap.data = this.calculateVWAP();
        if (this.indicators.bollinger.enabled) this.indicators.bollinger.data = this.calculateBollingerBands(this.indicators.bollinger.period || 20, this.indicators.bollinger.mult || 2);
        if (this.indicators.rsi && this.indicators.rsi.enabled) this.indicators.rsi.data = this.calculateRSI(this.indicators.rsi.period || 14);
        if (this.indicators.macd && this.indicators.macd.enabled) this.indicators.macd.data = this.calculateMACD(this.indicators.macd.fast || 12, this.indicators.macd.slow || 26, this.indicators.macd.signal || 9);
        if (this.indicators.parabolicSAR && this.indicators.parabolicSAR.enabled) this.indicators.parabolicSAR.data = this.calculateParabolicSAR();
        if (this.indicators.atr && this.indicators.atr.enabled) this.indicators.atr.data = this.calculateATR(this.indicators.atr.period);
        if (this.indicators.volumeMA && this.indicators.volumeMA.enabled) this.indicators.volumeMA.data = this.calculateVolumeMA(this.indicators.volumeMA.period);
        if (this.indicators.stochastic && this.indicators.stochastic.enabled) this.indicators.stochastic.data = this.calculateStochastic(this.indicators.stochastic.period || 14, this.indicators.stochastic.dPeriod || 3, this.indicators.stochastic.slowing || 3);

        // New indicators using TechnicalIndicators library (if available)
        if (TI && this.stockData && this.stockData.length > 0) {
            // New oscillators
            if (this.indicators.williamsR && this.indicators.williamsR.enabled) {
                this.indicators.williamsR.data = TI.WilliamsR(this.stockData, this.indicators.williamsR.period || 14);
            }
            if (this.indicators.mfi && this.indicators.mfi.enabled) {
                this.indicators.mfi.data = TI.MFI(this.stockData, this.indicators.mfi.period || 14);
            }
            if (this.indicators.roc && this.indicators.roc.enabled) {
                this.indicators.roc.data = TI.ROC(this.stockData, this.indicators.roc.period || 12);
            }
            if (this.indicators.cci && this.indicators.cci.enabled) {
                this.indicators.cci.data = TI.CCI(this.stockData, this.indicators.cci.period || 20);
            }
            if (this.indicators.adx && this.indicators.adx.enabled) {
                this.indicators.adx.data = TI.ADX(this.stockData, this.indicators.adx.period || 14);
            }
            if (this.indicators.stochasticRSI && this.indicators.stochasticRSI.enabled) {
                this.indicators.stochasticRSI.data = TI.StochasticRSI(this.stockData, this.indicators.stochasticRSI.period || 14);
            }
            if (this.indicators.awesomeOscillator && this.indicators.awesomeOscillator.enabled) {
                this.indicators.awesomeOscillator.data = TI.AwesomeOscillator(this.stockData);
            }
            if (this.indicators.trix && this.indicators.trix.enabled) {
                this.indicators.trix.data = TI.TRIX(this.stockData, this.indicators.trix.period || 15);
            }
            // Volume indicators
            if (this.indicators.obv && this.indicators.obv.enabled) {
                this.indicators.obv.data = TI.OBV(this.stockData);
            }
            if (this.indicators.adl && this.indicators.adl.enabled) {
                this.indicators.adl.data = TI.ADL(this.stockData);
            }
            if (this.indicators.forceIndex && this.indicators.forceIndex.enabled) {
                this.indicators.forceIndex.data = TI.ForceIndex(this.stockData, this.indicators.forceIndex.period || 13);
            }
            if (this.indicators.kst && this.indicators.kst.enabled) {
                this.indicators.kst.data = TI.KST(this.stockData);
            }
            // Overlay indicators
            if (this.indicators.ichimoku && this.indicators.ichimoku.enabled) {
                this.indicators.ichimoku.data = TI.IchimokuCloud(this.stockData);
            }
            if (this.indicators.wma && this.indicators.wma.enabled) {
                const closes = this.stockData.map(d => d.close);
                this.indicators.wma.data = TI.WMA(closes, this.indicators.wma.period || 20);
            }
            if (this.indicators.wema && this.indicators.wema.enabled) {
                const closes = this.stockData.map(d => d.close);
                this.indicators.wema.data = TI.WEMA(closes, this.indicators.wema.period || 14);
            }
            if (this.indicators.typicalPrice && this.indicators.typicalPrice.enabled) {
                this.indicators.typicalPrice.data = TI.TypicalPrice(this.stockData);
            }
        }

        // Candlestick patterns
        if (CP && this.stockData && this.stockData.length > 0 && this.indicators.patterns && this.indicators.patterns.enabled) {
            this.indicators.patterns.data = CP.scanAll(this.stockData);
        }

        this.updateATRDisplay();
    }
    drawIndicators(ctx) {
        // Two preceding centers keep connected lines crossing the left clip
        // even when a wide candle has almost fully shifted into view.
        if (!this.stockData || !this.stockData.length) return; const chartH = this.getPriceChartHeight(); const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const cW = this.calculateCandleWidth(); const drawIndicatorLine = (data, color, lineWidth = 1) => {
            if (!data || !data.length) return; let latestValue = null; for (let i = this.config.visibleCandles - 1; i >= 0; i--) { const dataIndex = i + this.config.dataOffset; if (data[dataIndex] !== null && data[dataIndex] !== undefined) { latestValue = data[dataIndex]; break } }
            const currentPrice = this.stockData[this.stockData.length - 1].close; const glowActive = latestValue !== null && Math.abs(currentPrice - latestValue) <= 0.01; ctx.beginPath(); let started = !1; for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = this.priceToY(data[dataIndex], min, max, chartH, this.getCanvasHeight()); if (!started) { ctx.moveTo(x, y); started = !0 } else ctx.lineTo(x, y) } }
            ctx.strokeStyle = color; ctx.lineWidth = lineWidth; if (glowActive) { ctx.save(); ctx.shadowColor = '#FFFFFF'; ctx.shadowBlur = 25; ctx.stroke(); ctx.restore() } else ctx.stroke()
        }; this.movingAverages.forEach(ma => { if (ma.enabled && ma.data && ma.data.length) { drawIndicatorLine(ma.data, ma.color, this.lineScale('ma.' + ma.id)) } }); if (this.indicators.vwap.enabled) drawIndicatorLine(this.indicators.vwap.data, this.indicators.vwap.color, this.lineScale('vwap')); if (this.indicators.bollinger.enabled) {
            const bollingerUpperLowerColor = this.indicators.bollinger.color; const bollingerMiddleColor = '#E69500'; drawIndicatorLine(this.indicators.bollinger.data.upper, bollingerUpperLowerColor, this.lineScale('bollinger')); drawIndicatorLine(this.indicators.bollinger.data.middle, bollingerMiddleColor, this.lineScale('bollinger')); drawIndicatorLine(this.indicators.bollinger.data.lower, bollingerUpperLowerColor, this.lineScale('bollinger')); const upperBandData = this.indicators.bollinger.data.upper; const lowerBandData = this.indicators.bollinger.data.lower; if (upperBandData && upperBandData.length && lowerBandData && lowerBandData.length) {
                ctx.beginPath(); let firstPoint = !0; for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < upperBandData.length && upperBandData[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = this.priceToY(upperBandData[dataIndex], min, max, chartH, this.getCanvasHeight()); if (firstPoint) { ctx.moveTo(x, y); firstPoint = !1 } else { ctx.lineTo(x, y) } } }
                for (let i = this.config.visibleCandles - 1; i >= (-Math.min(2, this.config.dataOffset)); i--) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < lowerBandData.length && lowerBandData[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = this.priceToY(lowerBandData[dataIndex], min, max, chartH, this.getCanvasHeight()); ctx.lineTo(x, y) } }
                ctx.closePath(); ctx.fillStyle = 'rgba(30, 136, 229, 0.15)'; ctx.fill()
            }
        }
        if (this.indicators.parabolicSAR.enabled && this.indicators.parabolicSAR.data.length) { const sarData = this.indicators.parabolicSAR.data; const sarColor = this.indicators.parabolicSAR.color; ctx.fillStyle = sarColor; for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < sarData.length && sarData[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = this.priceToY(sarData[dataIndex], min, max, chartH, this.getCanvasHeight()); ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill() } } }

        // New overlay indicators
        if (this.indicators.wma && this.indicators.wma.enabled && this.indicators.wma.data && this.indicators.wma.data.length) {
            drawIndicatorLine(this.indicators.wma.data, this.indicators.wma.color, this.lineScale('wma'));
        }
        if (this.indicators.wema && this.indicators.wema.enabled && this.indicators.wema.data && this.indicators.wema.data.length) {
            drawIndicatorLine(this.indicators.wema.data, this.indicators.wema.color, this.lineScale('wema'));
        }
        if (this.indicators.typicalPrice && this.indicators.typicalPrice.enabled && this.indicators.typicalPrice.data && this.indicators.typicalPrice.data.length) {
            drawIndicatorLine(this.indicators.typicalPrice.data, this.indicators.typicalPrice.color, this.lineScale('typicalPrice'));
        }

        // Ichimoku Cloud overlay
        if (this.indicators.ichimoku && this.indicators.ichimoku.enabled && this.indicators.ichimoku.data) {
            const ich = this.indicators.ichimoku;
            const data = ich.data;
            const displacement = data.displacement || 26;

            // Draw Tenkan-sen (Conversion Line)
            if (data.tenkan && data.tenkan.length) {
                drawIndicatorLine(data.tenkan, ich.tenkanColor || '#0496ff', this.lineScale('ichimoku'));
            }
            // Draw Kijun-sen (Base Line)
            if (data.kijun && data.kijun.length) {
                drawIndicatorLine(data.kijun, ich.kijunColor || '#991515', this.lineScale('ichimoku'));
            }
            // Draw Chikou Span (Lagging Span) - shifted back
            if (data.chikou && data.chikou.length) {
                const shiftedChikou = new Array(Math.max(0, this.stockData.length - displacement)).fill(null);
                for (let i = displacement; i < data.chikou.length; i++) {
                    shiftedChikou[i - displacement] = data.chikou[i];
                }
                drawIndicatorLine(shiftedChikou, '#4caf50', 1);
            }

            // Draw the cloud (Senkou Span A and B)
            if (data.senkouA && data.senkouB && data.senkouA.length && data.senkouB.length) {
                // Cloud is shifted forward by displacement periods
                // Draw cloud fill
                ctx.save();
                for (let i = -Math.min(2, this.config.dataOffset); i < this.config.visibleCandles; i++) {
                    const dataIndex = i + this.config.dataOffset;
                    // Cloud data at dataIndex shows where the cloud will be `displacement` periods later
                    const cloudDataIndex = dataIndex - displacement;
                    if (cloudDataIndex >= 0 && cloudDataIndex < data.senkouA.length && cloudDataIndex < data.senkouB.length) {
                        const senkouA = data.senkouA[cloudDataIndex];
                        const senkouB = data.senkouB[cloudDataIndex];
                        if (senkouA !== null && senkouB !== null) {
                            const x = this.config.padding.left + i * (cW + this.config.spacing);
                            const yA = this.priceToY(senkouA, min, max, chartH, this.getCanvasHeight());
                            const yB = this.priceToY(senkouB, min, max, chartH, this.getCanvasHeight());
                            const isCloudUp = senkouA >= senkouB;
                            ctx.fillStyle = isCloudUp ? (ich.cloudUpColor || 'rgba(0, 255, 0, 0.1)') : (ich.cloudDownColor || 'rgba(255, 0, 0, 0.1)');
                            ctx.fillRect(x, Math.min(yA, yB), cW + this.config.spacing, Math.abs(yA - yB));
                        }
                    }
                }
                ctx.restore();
            }
        }

        // Draw candlestick patterns if enabled
        if (this.indicators.patterns && this.indicators.patterns.enabled && this.indicators.patterns.data && this.indicators.patterns.data.length) {
            this.drawCandlestickPatterns(ctx, min, max, chartH);
        }
    }

    // Draw candlestick pattern markers
    drawCandlestickPatterns(ctx, min, max, chartH) {
        // These are candlestick patterns by definition, and every label is
        // anchored to a bar's high or low - neither of which a line chart
        // plots. Left on, the callouts float at prices with nothing under
        // them. Same bail as drawVisibleExtremesMarkers, drawHoveredCandleOutline
        // and drawCandlePulses.
        if (this.config.chartType === 'line') return;
        const patterns = this.indicators.patterns.data;
        const cW = this.calculateCandleWidth();

        ctx.font = '9px Arial';
        ctx.textAlign = 'center';

        // Track occupied label positions to avoid overlap
        const labelPositions = []; // {x, y, width, height}
        const labelHeight = 12;
        const labelSpacing = 14; // Vertical spacing between stacked labels
        const minHorizontalGap = 25; // Minimum horizontal gap between labels

        // Check if a position overlaps with existing labels
        const checkOverlap = (x, y, width) => {
            for (const pos of labelPositions) {
                const horizontalOverlap = Math.abs(x - pos.x) < (width + pos.width) / 2 + minHorizontalGap;
                const verticalOverlap = Math.abs(y - pos.y) < labelHeight;
                if (horizontalOverlap && verticalOverlap) return true;
            }
            return false;
        };

        // Find a non-overlapping y position
        const findNonOverlappingY = (x, baseY, isBullish, width) => {
            let y = baseY;
            let attempts = 0;
            const maxAttempts = 5;
            while (checkOverlap(x, y, width) && attempts < maxAttempts) {
                y += isBullish ? labelSpacing : -labelSpacing;
                attempts++;
            }
            return y;
        };

        for (const pattern of patterns) {
            const dataIndex = pattern.index;
            const visibleIndex = dataIndex - this.config.dataOffset;

            // Only draw if visible
            if (visibleIndex < 0 || visibleIndex >= this.config.visibleCandles) continue;

            const candle = this.stockData[dataIndex];
            if (!candle) continue;

            const x = this.config.padding.left + visibleIndex * (cW + this.config.spacing) + cW * 0.5;
            const isBullish = pattern.type === 'bullish';
            const color = isBullish ? this.indicators.patterns.bullishColor : this.indicators.patterns.bearishColor;

            // Calculate base position
            const baseY = isBullish
                ? this.priceToY(candle.low, min, max, chartH, this.getCanvasHeight()) + 15
                : this.priceToY(candle.high, min, max, chartH, this.getCanvasHeight()) - 15;

            const abbrev = pattern.name.slice(0, 3).toUpperCase();
            const textWidth = ctx.measureText(abbrev).width;

            // Find non-overlapping position for text
            const textY = findNonOverlappingY(x, isBullish ? baseY + 12 : baseY - 12, isBullish, textWidth);
            const arrowY = isBullish ? textY - 12 : textY + 12;

            // Draw arrow
            ctx.fillStyle = color;
            ctx.beginPath();
            if (isBullish) {
                ctx.moveTo(x, arrowY - 8);
                ctx.lineTo(x - 5, arrowY);
                ctx.lineTo(x + 5, arrowY);
            } else {
                ctx.moveTo(x, arrowY + 8);
                ctx.lineTo(x - 5, arrowY);
                ctx.lineTo(x + 5, arrowY);
            }
            ctx.closePath();
            ctx.fill();

            // Draw pattern name (abbreviated)
            ctx.fillStyle = this.config.darkMode ? '#ffffff' : '#000000';
            ctx.fillText(abbrev, x, textY);

            // Record this label position
            labelPositions.push({ x, y: textY, width: textWidth, height: labelHeight });
        }
    }

    // Pulse a glowing outline on specific candles (e.g. the candles that formed
    // a detected pattern). Indices are into stockData.
    //
    // style: 'candle' (default) traces the candle itself - the body's border
    //        plus its wicks. 'box' draws a rounded box around the whole candle.
    // color: defaults to a neutral highlight that follows the chart theme, so
    //        the pulse reads as "look here" rather than re-stating direction.
    // brackets: L-shaped corner brackets framing the whole group of candles.
    //        They snap in from 1.25x scale, hold, then fade - deliberately
    //        steady while the candles themselves pulse underneath.
    pulseCandles(indices, options = {}) {
        const list = (Array.isArray(indices) ? indices : [indices]).filter(i => Number.isInteger(i) && i >= 0);
        if (!list.length) return;
        if (!this._candlePulses) this._candlePulses = [];
        this._candlePulses.push({
            indices: list,
            color: options.color || (this.config.darkMode ? '#ffffff' : '#1a1a1a'),
            duration: options.duration || 4200,
            cycles: options.cycles || 3,
            style: options.style || 'candle',
            brackets: options.brackets !== false,
            bracketColor: options.bracketColor || '#FBBF24',
            start: performance.now()
        });
        this._startCandlePulseAnimation();
    }

    clearCandlePulses() {
        this._candlePulses = [];
        if (this._candlePulseRaf) { cancelAnimationFrame(this._candlePulseRaf); this._candlePulseRaf = null; }
    }

    // Bounding box of a group of candles in CSS pixels relative to
    // chartContainer, or null if none of them are on screen. Canvas drawing
    // coords are CSS pixels (the ctx is dpr-scaled), but the canvas sits in a
    // nested wrapper, so measure its offset rather than assuming 0,0.
    _candleGroupBoxCss(indices) {
        const scale = this._lastPriceScale;
        if (!scale || !this.priceCanvas || !this.chartContainer) return null;

        const cW = this.calculateCandleWidth();
        const h = this.getCanvasHeight();
        let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;

        for (const dataIndex of indices) {
            const visibleIndex = dataIndex - this.config.dataOffset;
            if (visibleIndex < 0 || visibleIndex >= this.config.visibleCandles) continue;
            const candle = this.stockData[dataIndex];
            if (!candle) continue;

            const x = this.config.padding.left + visibleIndex * (cW + this.config.spacing);
            const yHigh = this.priceToY(candle.high, scale.min, scale.max, scale.chartH, h);
            const yLow = this.priceToY(candle.low, scale.min, scale.max, scale.chartH, h);

            if (x < left) left = x;
            if (x + cW > right) right = x + cW;
            if (yHigh < top) top = yHigh;
            if (yLow > bottom) bottom = yLow;
        }
        if (left === Infinity) return null;

        const cRect = this.chartContainer.getBoundingClientRect();
        const vRect = this.priceCanvas.getBoundingClientRect();
        // Mid-drag the candles are drawn translated by pixelOffset (sub-candle
        // smooth pan), so follow that too or the callout steps a bar at a time.
        const offX = vRect.left - cRect.left + this.priceCanvas.clientLeft + (this.pixelOffset || 0);
        const offY = vRect.top - cRect.top + this.priceCanvas.clientTop;

        // Price pane bounds, so the callout can hide once the candles are
        // panned out of the pane instead of pinning to its edge.
        const plotLeft = this.config.padding.left + offX - (this.pixelOffset || 0);
        const plotRight = this.getCanvasWidth() - this.config.padding.right + offX - (this.pixelOffset || 0);
        const plotTop = this.config.padding.top + offY;
        const plotBottom = plotTop + scale.chartH;

        return {
            left: left + offX, right: right + offX, top: top + offY, bottom: bottom + offY,
            plotLeft, plotRight, plotTop, plotBottom
        };
    }

    // A callout pinned beside the pattern candles. Deliberately separate from
    // _showNotification(), which is the general top-centre chart toast reused
    // for pause/copy/errors.
    //
    // opts: { name, bias:'bullish'|'bearish', kind, candles, duration,
    //         side:'left'|'right' - preferred side, default left }
    showPatternCallout(indices, opts = {}) {
        if (!this.chartContainer) return;
        // A candlestick pattern needs candles. The callout is positioned off
        // _candleGroupBoxCss, a box built from the bars' highs and lows, so in
        // line view it would point at a shape the chart never drew - and the
        // pulse that goes with it (drawCandlePulses) already bails here.
        if (this.config.chartType === 'line') return;
        const list = (Array.isArray(indices) ? indices : [indices]).filter(i => Number.isInteger(i) && i >= 0);
        if (!list.length) return;

        const box = this._candleGroupBoxCss(list);
        if (!box) return;

        // Only one pattern callout at a time, same as _showNotification
        this.chartContainer.querySelectorAll('.sc-pattern-callout').forEach(n => n.remove());

        const bias = opts.bias === 'bullish' ? 'bullish' : 'bearish';
        const duration = opts.duration || 4200;
        const arrow = bias === 'bullish' ? '↑ Bullish' : '↓ Bearish';

        const el = document.createElement('div');
        el.className = 'sc-pattern-callout sc-pc-' + bias;

        const kicker = document.createElement('div');
        kicker.className = 'sc-pc-kicker';
        kicker.textContent = 'Pattern' + (opts.candles ? ' · ' + opts.candles + '-candle' : '');

        const name = document.createElement('div');
        name.className = 'sc-pc-name';
        name.textContent = opts.name || '';

        const meta = document.createElement('div');
        meta.className = 'sc-pc-meta';
        const strong = document.createElement('b');
        strong.textContent = arrow;
        meta.appendChild(strong);
        const dot = document.createElement('span');
        dot.className = 'sc-pc-dot';
        dot.textContent = '·';
        meta.appendChild(dot);
        meta.appendChild(document.createTextNode((opts.kind || 'Reversal').toLowerCase()));

        const settingsButton = document.createElement('button');
        settingsButton.type = 'button';
        settingsButton.className = 'sc-pc-settings';
        settingsButton.setAttribute('aria-label', 'Open pattern alert settings');
        // Static gear markup, no user data
        settingsButton.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="2.2"></circle>' +
            '<path d="M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1"></path></svg>';
        settingsButton.appendChild(document.createTextNode('Pattern settings'));
        settingsButton.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            clearTimeout(el._scHideTimer);
            el.remove();
            window.dispatchEvent(new CustomEvent('simul8or:open-pattern-settings'));
        });

        el.appendChild(kicker);
        el.appendChild(name);
        el.appendChild(meta);
        el.appendChild(document.createElement('hr'));
        el.appendChild(settingsButton);
        this.chartContainer.appendChild(el);

        // Anchored to the candles, not the screen: drawCharts() calls
        // _positionPatternCallout() on every redraw, so pan/zoom/resize and
        // new ticks carry the callout along with the brackets.
        this._patternCallout = { el, indices: list, side: opts.side };
        this._positionPatternCallout();

        const hide = setTimeout(() => {
            el.classList.add('sc-pc-out');
            setTimeout(() => el.remove(), 450);
        }, duration);
        el._scHideTimer = hide;
    }

    // Sits to the left of the pattern by default, which also suits patterns
    // firing on the newest candle at the right edge. Flips to the other side
    // only when the preferred one would overflow. Hidden (not removed) while
    // the pattern is panned out of view, so it returns if panned back.
    _positionPatternCallout() {
        const pc = this._patternCallout;
        if (!pc) return;
        const el = pc.el;
        if (!el.isConnected || this.config.chartType === 'line') {
            if (el.isConnected) el.remove();
            this._patternCallout = null;
            return;
        }

        const box = this._candleGroupBoxCss(pc.indices);
        if (!box || box.right < box.plotLeft || box.left > box.plotRight ||
            box.bottom < box.plotTop || box.top > box.plotBottom) {
            el.style.visibility = 'hidden';
            return;
        }
        el.style.visibility = '';

        // GAP leaves room for the notch (~8px past the card edge) plus the
        // brackets' 8px padding, so the notch tip lands just off the bracket.
        const GAP = 20;
        const EDGE = 10;
        const NOTCH_Y = 16;
        const cw = this.chartContainer.clientWidth;
        const ch = this.chartContainer.clientHeight;
        const w = el.offsetWidth, hgt = el.offsetHeight;

        let x;
        let onLeft = pc.side !== 'right';
        if (onLeft) {
            x = box.left - GAP - w;
            if (x < EDGE) { x = box.right + GAP; onLeft = false; }
        } else {
            x = box.right + GAP;
            if (x + w > cw - EDGE) { x = box.left - GAP - w; onLeft = true; }
        }
        x = Math.max(EDGE, Math.min(x, cw - w - EDGE));
        el.classList.toggle('sc-pc-left', onLeft);
        el.classList.toggle('sc-pc-right', !onLeft);

        // Aim the notch at the upper part of the pattern, then keep aiming at
        // it if the card gets clamped against the top or bottom edge.
        const target = box.top + Math.min(28, (box.bottom - box.top) / 2);
        const y = Math.max(EDGE, Math.min(target - NOTCH_Y - 6, ch - hgt - EDGE));
        const ny = Math.max(10, Math.min(target - y - 6, hgt - 24));

        el.style.left = Math.round(x) + 'px';
        el.style.top = Math.round(y) + 'px';
        el.style.setProperty('--sc-pc-ny', Math.round(ny) + 'px');
    }

    _startCandlePulseAnimation() {
        if (this._candlePulseRaf) return;
        const step = () => {
            this._candlePulseRaf = null;
            if (!this._candlePulses || !this._candlePulses.length) return;
            const now = performance.now();
            this._candlePulses = this._candlePulses.filter(p => now - p.start < p.duration);
            this.drawCharts();
            if (this._candlePulses.length) this._candlePulseRaf = requestAnimationFrame(step);
        };
        this._candlePulseRaf = requestAnimationFrame(step);
    }

    drawCandlePulses(ctx, min, max, chartH) {
        if (!this._candlePulses || !this._candlePulses.length) return;
        // A line chart has no per-bar shape to outline. Its two siblings
        // (drawVisibleExtremesMarkers, drawHoveredCandleOutline) already bail
        // here; this one never did, which only stayed invisible because the
        // sims hardcoded candlestick. Now that the style is user-switchable a
        // pattern alert firing in line view would paint floating outlines.
        if (this.config.chartType === 'line') return;
        const cW = this.calculateCandleWidth();
        const h = this.getCanvasHeight();
        const now = performance.now();
        const pad = 3;

        ctx.save();
        for (const pulse of this._candlePulses) {
            const elapsed = now - pulse.start;
            const t = elapsed / pulse.duration;
            if (t < 0 || t > 1) continue;
            // Sine wave for the pulse, damped so it fades as it expires
            const wave = 0.5 - 0.5 * Math.cos(t * Math.PI * 2 * pulse.cycles);
            const alpha = wave * (1 - t * 0.6);

            // Bounding box of the whole group, for the corner brackets. Built
            // even on frames where the candle pulse is at its dim phase.
            let boxL = Infinity, boxR = -Infinity, boxT = Infinity, boxB = -Infinity;

            for (const dataIndex of pulse.indices) {
                const visibleIndex = dataIndex - this.config.dataOffset;
                if (visibleIndex < 0 || visibleIndex >= this.config.visibleCandles) continue;
                const candle = this.stockData[dataIndex];
                if (!candle) continue;

                const x = this.config.padding.left + visibleIndex * (cW + this.config.spacing);
                const yHigh = this.priceToY(candle.high, min, max, chartH, h);
                const yLow = this.priceToY(candle.low, min, max, chartH, h);

                if (x < boxL) boxL = x;
                if (x + cW > boxR) boxR = x + cW;
                if (yHigh < boxT) boxT = yHigh;
                if (yLow > boxB) boxB = yLow;

                if (alpha <= 0.02) continue;

                ctx.globalAlpha = alpha;
                ctx.strokeStyle = pulse.color;
                ctx.lineWidth = 2;
                ctx.shadowColor = pulse.color;
                ctx.shadowBlur = 10 * wave;

                if (pulse.style === 'box') {
                    // Rounded box around the whole candle
                    const rectX = x - pad, rectY = yHigh - pad;
                    const rectW = cW + pad * 2, rectH = Math.max(2, yLow - yHigh) + pad * 2;
                    ctx.beginPath();
                    if (typeof ctx.roundRect === 'function') ctx.roundRect(rectX, rectY, rectW, rectH, 3);
                    else ctx.rect(rectX, rectY, rectW, rectH);
                    ctx.stroke();
                } else {
                    // Trace the bar in whatever style is current. On OHLC bars
                    // there is no body, so the shared helper strokes the
                    // high-low line and the two O/C ticks instead of boxing in
                    // empty space where a candle body would have been.
                    const g = this.candleGeometry(dataIndex, min, max, chartH);
                    if (!g) continue;

                    // Bars floor at 2px wide when zoomed out - keep the border
                    // proportional so it reads as an outline, not a solid blob
                    ctx.lineWidth = Math.max(1, Math.min(2, cW * 0.25));
                    this.traceBarOutline(ctx, g, 0);
                }
            }

            if (pulse.brackets && boxL !== Infinity) {
                this._drawPulseBrackets(ctx, pulse, elapsed, boxL, boxT, boxR, boxB);
            }
        }
        ctx.restore();
    }

    // L-shaped corner brackets framing a group of pattern candles. Unlike the
    // candle pulse these do not oscillate - they snap in from 1.25x, hold, then
    // fade, so the frame stays readable while the candles pulse inside it.
    _drawPulseBrackets(ctx, pulse, elapsed, left, top, right, bottom) {
        const IN = 400, OUT = 400;

        // Ease-out cubic on the way in
        const inT = Math.min(1, elapsed / IN);
        const eased = 1 - Math.pow(1 - inT, 3);
        const scale = 1.25 - 0.25 * eased;

        let opacity = eased;
        const fadeStart = pulse.duration - OUT;
        if (elapsed > fadeStart) opacity = Math.max(0, (pulse.duration - elapsed) / OUT);
        if (opacity <= 0.02) return;

        // Breathing room around the candles, then scale about the box centre
        const padX = 8, padY = 6;
        const cx = (left + right) * 0.5;
        const cy = (top + bottom) * 0.5;
        const halfW = ((right - left) * 0.5 + padX) * scale;
        const halfH = ((bottom - top) * 0.5 + padY) * scale;

        const L = cx - halfW, R = cx + halfW;
        const T = cy - halfH, B = cy + halfH;

        // Arm length tracks the box so small patterns don't get closed corners
        const arm = Math.max(5, Math.min(12, Math.min(R - L, B - T) * 0.3));

        ctx.globalAlpha = opacity;
        ctx.strokeStyle = pulse.bracketColor;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 0;
        ctx.lineCap = 'butt';

        ctx.beginPath();
        // top-left
        ctx.moveTo(L, T + arm); ctx.lineTo(L, T); ctx.lineTo(L + arm, T);
        // top-right
        ctx.moveTo(R - arm, T); ctx.lineTo(R, T); ctx.lineTo(R, T + arm);
        // bottom-left
        ctx.moveTo(L, B - arm); ctx.lineTo(L, B); ctx.lineTo(L + arm, B);
        // bottom-right
        ctx.moveTo(R - arm, B); ctx.lineTo(R, B); ctx.lineTo(R, B - arm);
        ctx.stroke();
    }
    calculateRSI(period = 14) {
        if (!this.stockData || this.stockData.length < period + 1) return []; const result = Array(period).fill(null); let gains = 0, losses = 0; for (let i = 1; i <= period; i++) { const change = this.stockData[i].close - this.stockData[i - 1].close; if (change > 0) gains += change; else losses += Math.abs(change) }
        let avgGain = gains / period, avgLoss = losses / period; let rs = avgGain / avgLoss, rsi = 100 - (100 / (1 + rs)); result.push(rsi); for (let i = period + 1; i < this.stockData.length; i++) { const change = this.stockData[i].close - this.stockData[i - 1].close; let currentGain = 0, currentLoss = 0; if (change > 0) currentGain = change; else currentLoss = Math.abs(change); avgGain = ((avgGain * (period - 1)) + currentGain) / period; avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period; rs = avgGain / avgLoss; rsi = 100 - (100 / (1 + rs)); result.push(rsi) }
        return result
    }
    calculateMACD(fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        if (!this.stockData || this.stockData.length < slowPeriod + signalPeriod) return { macdLine: [], signalLine: [], histogram: [] }; const fastEMA = this.calculateMA(fastPeriod, 'ema'), slowEMA = this.calculateMA(slowPeriod, 'ema'); const macdLine = []; for (let i = 0; i < this.stockData.length; i++) { if (i < slowPeriod - 1 || fastEMA[i] === null || slowEMA[i] === null) macdLine.push(null); else macdLine.push(fastEMA[i] - slowEMA[i]) }
        let firstValidIndex = 0; while (firstValidIndex < macdLine.length && macdLine[firstValidIndex] === null) firstValidIndex++; const signalLine = Array(firstValidIndex + signalPeriod - 1).fill(null); if (firstValidIndex + signalPeriod >= macdLine.length) return { macdLine, signalLine: Array(macdLine.length).fill(null), histogram: Array(macdLine.length).fill(null) }; let sum = 0; for (let i = firstValidIndex; i < firstValidIndex + signalPeriod; i++)sum += macdLine[i]; let ema = sum / signalPeriod; signalLine.push(ema); const multiplier = 2 / (signalPeriod + 1); for (let i = firstValidIndex + signalPeriod; i < macdLine.length; i++) { ema = (macdLine[i] - ema) * multiplier + ema; signalLine.push(ema) }
        const histogram = []; for (let i = 0; i < macdLine.length; i++) { if (i < signalLine.length && macdLine[i] !== null && signalLine[i] !== null) histogram.push((macdLine[i] - signalLine[i]) * 3.0); else histogram.push(null) }
        return { macdLine, signalLine, histogram }
    }
    calculateParabolicSAR(initialAF = 0.02, maxAF = 0.2) {
        if (!this.stockData || this.stockData.length < 2) return []; const result = []; const data = this.stockData; let sar = data[0].low; let ep = data[0].high; let af = initialAF; let isUpTrend = !0; result.push(sar); for (let i = 1; i < data.length; i++) {
            const current = data[i]; const previous = data[i - 1]; if (isUpTrend) {
                sar = sar + af * (ep - sar); if (i > 1) { sar = Math.min(sar, previous.low, data[i - 2].low) } else { sar = Math.min(sar, previous.low) }
                if (current.low <= sar) { isUpTrend = !1; sar = ep; ep = current.low; af = initialAF } else { if (current.high > ep) { ep = current.high; af = Math.min(af + initialAF, maxAF) } }
            } else {
                sar = sar + af * (ep - sar); if (i > 1) { sar = Math.max(sar, previous.high, data[i - 2].high) } else { sar = Math.max(sar, previous.high) }
                if (current.high >= sar) { isUpTrend = !0; sar = ep; ep = current.high; af = initialAF } else { if (current.low < ep) { ep = current.low; af = Math.min(af + initialAF, maxAF) } }
            }
            result.push(sar)
        }
        return result
    }
    calculateATR(period = 14) {
        if (!this.stockData || this.stockData.length < period + 1) return []; const result = []; const trueRanges = []; for (let i = 1; i < this.stockData.length; i++) { const current = this.stockData[i]; const previous = this.stockData[i - 1]; const tr1 = current.high - current.low; const tr2 = Math.abs(current.high - previous.close); const tr3 = Math.abs(current.low - previous.close); const trueRange = Math.max(tr1, tr2, tr3); trueRanges.push(trueRange) }
        result.push(null); if (trueRanges.length < period) return result; let sum = 0; for (let i = 0; i < period; i++) { sum += trueRanges[i] }
        let atr = sum / period; result.push(atr); for (let i = period; i < trueRanges.length; i++) { atr = ((atr * (period - 1)) + trueRanges[i]) / period; result.push(atr) }
        return result
    }
    calculateVolumeMA(period = 20) {
        if (!this.stockData || this.stockData.length < period) return []; const result = []; for (let i = 0; i < period - 1; i++) { result.push(null) }
        for (let i = period - 1; i < this.stockData.length; i++) {
            let sum = 0; for (let j = 0; j < period; j++) { sum += this.stockData[i - j].volume }
            result.push(sum / period)
        }
        return result
    }
    calculateStochastic(kPeriod = 14, dPeriod = 3, slowing = 3) {
        if (!this.stockData || this.stockData.length < kPeriod) return { k: [], d: [] }; const kValues = []; const dValues = []; for (let i = 0; i < this.stockData.length; i++) {
            if (i < kPeriod - 1) { kValues.push(null) } else {
                let highestHigh = -Infinity; let lowestLow = Infinity; for (let j = 0; j < kPeriod; j++) { const candleIndex = i - j; highestHigh = Math.max(highestHigh, this.stockData[candleIndex].high); lowestLow = Math.min(lowestLow, this.stockData[candleIndex].low) }
                const currentClose = this.stockData[i].close; const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100; kValues.push(k)
            }
        }
        let smoothedK = [...kValues]; if (slowing > 1) {
            smoothedK = []; for (let i = 0; i < kValues.length; i++) {
                if (i < slowing - 1 || kValues[i] === null) { smoothedK.push(i < kPeriod + slowing - 2 ? null : kValues[i]) } else {
                    let sum = 0; let count = 0; for (let j = 0; j < slowing; j++) { if (kValues[i - j] !== null) { sum += kValues[i - j]; count++ } }
                    smoothedK.push(count > 0 ? sum / count : null)
                }
            }
        }
        for (let i = 0; i < smoothedK.length; i++) {
            if (i < dPeriod - 1 || smoothedK[i] === null) { dValues.push(null) } else {
                let sum = 0; let count = 0; for (let j = 0; j < dPeriod; j++) { if (smoothedK[i - j] !== null) { sum += smoothedK[i - j]; count++ } }
                dValues.push(count === dPeriod ? sum / dPeriod : null)
            }
        }
        return { k: smoothedK, d: dValues }
    }
    drawRSI(ctx, volumeHeight) {
        if (!this.indicators.rsi || !this.indicators.rsi.enabled || !this.indicators.rsi.data.length) return; const data = this.indicators.rsi.data, cW = this.calculateCandleWidth(); const volumeBottomY = this.getCanvasHeight() - this.config.padding.bottom, volumeTopY = volumeBottomY - volumeHeight; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left, volumeTopY, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, volumeHeight); ctx.clip(); const rsiLineColor = this.indicators.rsi.color; const rsiZoneFillColor = 'rgba(120, 100, 150, 0.15)'; const rsiLevelLineColor = '#FFFFFF'; const y50 = volumeTopY + (0.5 * volumeHeight); const y70 = volumeTopY + (0.3 * volumeHeight); const y30 = volumeTopY + (0.7 * volumeHeight); ctx.fillStyle = rsiZoneFillColor; ctx.fillRect(this.config.padding.left, volumeTopY, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, y70 - volumeTopY); ctx.fillRect(this.config.padding.left, y30, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, volumeBottomY - y30); ctx.strokeStyle = rsiLevelLineColor; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(this.config.padding.left, y70); ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, y70); ctx.stroke(); ctx.beginPath(); ctx.moveTo(this.config.padding.left, y50); ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, y50); ctx.stroke(); ctx.beginPath(); ctx.moveTo(this.config.padding.left, y30); ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, y30); ctx.stroke(); ctx.setLineDash([]); ctx.font = '9px Arial'; ctx.textAlign = 'left'; ctx.fillStyle = rsiLevelLineColor; ctx.fillText('70', this.config.padding.left + 3, y70 - 3); ctx.fillText('50', this.config.padding.left + 3, y50 - 3); ctx.fillText('30', this.config.padding.left + 3, y30 + 9); ctx.beginPath(); let started = !1; for (let i = 0; i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = volumeTopY + ((1 - (data[dataIndex] / 100)) * volumeHeight); if (!started) { ctx.moveTo(x, y); started = !0 } else ctx.lineTo(x, y) } }
        ctx.strokeStyle = rsiLineColor; ctx.lineWidth = 2.0; ctx.stroke(); const rsiLabelText = 'RSI'; ctx.font = '11px Arial'; const rsiTextWidth = ctx.measureText(rsiLabelText).width; const rsiLabelBgHeight = 15, rsiLabelBgWidth = rsiTextWidth + 10; const rsiLabelY = volumeTopY + 5; let rsiLabelXPane = this.config.padding.left + 5; if (this.indicators.macd && this.indicators.macd.enabled) { const macdLabelText = 'MACD'; const macdTextWidth = ctx.measureText(macdLabelText).width; rsiLabelXPane = this.config.padding.left + 5 + (macdTextWidth + 10) + 10 }
        ctx.fillStyle = this.config.darkMode ? '#202124' : '#F1F3F4'; ctx.fillRect(rsiLabelXPane, rsiLabelY, rsiLabelBgWidth, rsiLabelBgHeight); ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = rsiLineColor; ctx.fillText(rsiLabelText, rsiLabelXPane + 5, rsiLabelY + 3); ctx.restore(); if (data && data.length > 0) {
            let lastRsiValue = null; for (let i = data.length - 1; i >= 0; i--) { if (data[i] !== null && data[i] !== undefined) { lastRsiValue = data[i]; break } }
            if (lastRsiValue !== null) { const rsiValueY = volumeTopY + ((1 - (lastRsiValue / 100)) * volumeHeight); const rsiLabelValueText = lastRsiValue.toFixed(2); const labelHeight = 20; const labelPadding = 5; const borderRadius = 3; const labelFontSize = 12; ctx.font = `${labelFontSize}px Arial`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const textMetrics = ctx.measureText(rsiLabelValueText); const valueTextWidth = textMetrics.width; const rsiValueLabelWidth = valueTextWidth + 2 * labelPadding; const rsiValueLabelX = this.getCanvasWidth() - this.config.padding.right; const clampedRsiY = Math.max(volumeTopY + labelHeight / 2, Math.min(rsiValueY, volumeBottomY - labelHeight / 2)); const rectRsiY = clampedRsiY - labelHeight / 2; ctx.fillStyle = this.config.darkMode ? '#333333' : '#EEEEEE'; ctx.beginPath(); ctx.moveTo(rsiValueLabelX + borderRadius, rectRsiY); ctx.lineTo(rsiValueLabelX + rsiValueLabelWidth - borderRadius, rectRsiY); ctx.arcTo(rsiValueLabelX + rsiValueLabelWidth, rectRsiY, rsiValueLabelX + rsiValueLabelWidth, rectRsiY + borderRadius, borderRadius); ctx.lineTo(rsiValueLabelX + rsiValueLabelWidth, rectRsiY + labelHeight - borderRadius); ctx.arcTo(rsiValueLabelX + rsiValueLabelWidth, rectRsiY + labelHeight, rsiValueLabelX + rsiValueLabelWidth - borderRadius, rectRsiY + labelHeight, borderRadius); ctx.lineTo(rsiValueLabelX + borderRadius, rectRsiY + labelHeight); ctx.arcTo(rsiValueLabelX, rectRsiY + labelHeight, rsiValueLabelX, rectRsiY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rsiValueLabelX, rectRsiY + borderRadius); ctx.arcTo(rsiValueLabelX, rectRsiY, rsiValueLabelX + borderRadius, rectRsiY, borderRadius); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.fillText(rsiLabelValueText, rsiValueLabelX + labelPadding, clampedRsiY) }
        }
    }
    drawMACD(ctx, volumeHeight) {
        if (!this.indicators.macd || !this.indicators.macd.enabled || !this.indicators.macd.data.macdLine || !this.indicators.macd.data.macdLine.length) return; const { macdLine, signalLine, histogram } = this.indicators.macd.data; const cW = this.calculateCandleWidth(); const volumeBottomY = this.getCanvasHeight() - this.config.padding.bottom, volumeTopY = volumeBottomY - volumeHeight; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left, volumeTopY, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, volumeHeight); ctx.clip(); let min = Infinity, max = -Infinity; const updateMinMax = val => { if (val !== null && val !== undefined && isFinite(val)) { min = Math.min(min, val); max = Math.max(max, val) } }; for (let i = this.config.dataOffset; i < this.config.dataOffset + this.config.visibleCandles; i++) { if (i >= 0 && i < macdLine.length) { updateMinMax(macdLine[i]); updateMinMax(signalLine[i]) } }
        if (min === Infinity || max === -Infinity || min === max) { min = -1; max = 1 }
        const absMax = Math.max(Math.abs(min), Math.abs(max)); min = -absMax * 1.5; max = absMax * 1.5; const mid = volumeTopY + (volumeHeight / 2); ctx.beginPath(); ctx.moveTo(this.config.padding.left, mid); ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, mid); ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.stroke(); const barWidth = Math.max(1, cW * 0.8), scaleFactor = volumeHeight / (max - min); for (let i = 0; i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < histogram.length && histogram[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + (cW - barWidth) / 2; const value = histogram[dataIndex]; let height = Math.max(1, Math.abs(value) * scaleFactor); ctx.fillStyle = value > 0 ? (this.config.darkMode ? 'rgba(76,175,80,0.7)' : 'rgba(76,175,80,0.5)') : (this.config.darkMode ? 'rgba(244,67,54,0.7)' : 'rgba(244,67,54,0.5)'); this._crispRect(ctx, x, value > 0 ? mid - height : mid, barWidth, height) } }
        const drawLine = (lineData, color) => {
            ctx.beginPath(); let started = !1; for (let i = 0; i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < lineData.length && lineData[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = volumeTopY + ((1 - (lineData[dataIndex] - min) / (max - min)) * volumeHeight); if (!started) { ctx.moveTo(x, y); started = !0 } else ctx.lineTo(x, y) } }
            ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke()
        }; drawLine(macdLine, this.indicators.macd.macdColor || '#2196F3'); drawLine(signalLine, this.indicators.macd.signalColor || '#FF9800'); const macdLabelText = 'MACD'; ctx.font = '11px Arial'; const macdTextWidth = ctx.measureText(macdLabelText).width; const macdLabelX = this.config.padding.left + 5, macdLabelY = volumeTopY + 5; const macdLabelBgHeight = 15, macdLabelBgWidth = macdTextWidth + 10; ctx.fillStyle = this.config.darkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)'; ctx.fillRect(macdLabelX, macdLabelY, macdLabelBgWidth, macdLabelBgHeight); ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = this.config.darkMode ? '#2196F3' : '#1565C0'; ctx.fillText(macdLabelText, macdLabelX + 5, macdLabelY + 3); ctx.restore()
    }
    drawStochastic(ctx, volumeHeight) {
        if (!this.indicators.stochastic || !this.indicators.stochastic.enabled || !this.indicators.stochastic.data.k || !this.indicators.stochastic.data.k.length) return; const { k, d } = this.indicators.stochastic.data; const cW = this.calculateCandleWidth(); const volumeBottomY = this.getCanvasHeight() - this.config.padding.bottom; const volumeTopY = volumeBottomY - volumeHeight; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left, volumeTopY, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, volumeHeight); ctx.clip(); const min = 0; const max = 100; const drawHorizontalLine = (value, alpha = 0.3) => { const y = volumeTopY + ((max - value) / (max - min)) * volumeHeight; ctx.beginPath(); ctx.moveTo(this.config.padding.left, y); ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, y); ctx.strokeStyle = this.config.darkMode ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`; ctx.lineWidth = 1; ctx.stroke() }; drawHorizontalLine(20); drawHorizontalLine(50, 0.2); drawHorizontalLine(80); const drawLine = (lineData, color, lineWidth = 1) => {
            ctx.beginPath(); let started = !1; for (let i = 0; i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < lineData.length && lineData[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = volumeTopY + ((max - lineData[dataIndex]) / (max - min)) * volumeHeight; if (!started) { ctx.moveTo(x, y); started = !0 } else { ctx.lineTo(x, y) } } }
            ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke()
        }; drawLine(k, this.indicators.stochastic.color, 1.5); drawLine(d, this.indicators.stochastic.dColor, 1.5); const labelText = 'Stochastic'; ctx.font = '11px Arial'; const textWidth = ctx.measureText(labelText).width; const labelX = this.config.padding.left + 5; const labelY = volumeTopY + 5; const labelBgHeight = 15; const labelBgWidth = textWidth + 10; ctx.fillStyle = this.config.darkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)'; ctx.fillRect(labelX, labelY, labelBgWidth, labelBgHeight); ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = this.config.darkMode ? this.indicators.stochastic.color : '#C91F58'; ctx.fillText(labelText, labelX + 5, labelY + 3); ctx.restore()
    }
    addTradeMarker(marker) { this.tradeMarkers.push(marker); this.drawCharts() }
    setTradeMarkers(markersArray) { this.tradeMarkers = markersArray.slice(); this.drawCharts() }
    drawTradeMarkers(ctx) {
        // Opt-out flag, usually set on the prototype so it survives the chart
        // being rebuilt on timeframe changes. Strict === false so the many pages
        // that never set it render exactly as before.
        if (this.showTradeMarkers === false) return;
        if (!this.tradeMarkers.length) return; ctx.save(); const chartTop = this.config.padding.top; const panelsTopY = this.getPanelsTopY(); const chartH = this.getPriceChartHeight(); ctx.beginPath(); ctx.rect(this.config.padding.left - this.pixelOffset, chartTop, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, chartH); ctx.clip(); let { min, max } = this.applyVerticalScale(this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles)); min += this.config.priceOffset; max += this.config.priceOffset; const cW = this.calculateCandleWidth(); const timeframeMinutes = this.getTimeframeMinutes(this.timeframe); this.tradeMarkers.forEach(marker => {
            const { price, type, quantity, timestamp } = marker; let localIndex = this.stockData.findIndex(candle => new Date(candle.date).getTime() <= timestamp && new Date(candle.date).getTime() + (timeframeMinutes * 60000) > timestamp); localIndex -= this.config.dataOffset; if (localIndex < 0 || localIndex > this.config.visibleCandles) return; const x = this.config.padding.left + (localIndex * (cW + this.config.spacing)) + (cW / 2); const y = this.priceToY(price, min, max, chartH, this.getCanvasHeight()); if (y < chartTop || y >= panelsTopY) return; ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 5; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2; ctx.beginPath(); if (type === 'buy') { ctx.fillStyle = '#1E6124'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.moveTo(x - 10, y + 10); ctx.lineTo(x + 10, y + 10); ctx.lineTo(x, y); ctx.closePath() } else if (type === 'sell') { ctx.fillStyle = '#FF0000'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.moveTo(x - 10, y - 10); ctx.lineTo(x + 10, y - 10); ctx.lineTo(x, y); ctx.closePath() } else if (type === 'short') { ctx.fillStyle = '#0000FF'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.moveTo(x, y - 10); ctx.lineTo(x - 10, y); ctx.lineTo(x, y + 10); ctx.lineTo(x + 10, y); ctx.closePath() } else if (type === 'cover') { ctx.fillStyle = '#800080'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.moveTo(x, y - 10); ctx.lineTo(x - 10, y); ctx.lineTo(x, y + 10); ctx.lineTo(x + 10, y); ctx.closePath() } else { ctx.fillStyle = '#ff9900'; ctx.arc(x, y, 5, 0, 2 * Math.PI) }
            ctx.fill(); ctx.stroke(); ctx.restore()
        }); ctx.restore()
    }
    addLimitOrder(order) { this.limitOrders.push(order); this.drawCharts() }
    setLimitOrders(ordersArray) { this.limitOrders = ordersArray.slice(); this.drawCharts() }
    // Returns the hit area for a draggable order line/badge under the given canvas point, or null.
    // Badge is tested first so an overlapping line never steals the more precise target.
    findLimitOrderAt(x, y) {
        if (!this.limitOrderHitAreas.length) return null;
        const lineHitDist = 4;
        const leftEdge = this.config.padding.left;
        const rightEdge = this.getCanvasWidth() - this.config.padding.right;
        for (let i = this.limitOrderHitAreas.length - 1; i >= 0; i--) {
            const hit = this.limitOrderHitAreas[i];
            if (hit.order.preview || hit.order.draggable === false) continue;
            if (x >= hit.badgeX && x <= hit.badgeX + hit.badgeWidth && y >= hit.badgeY && y <= hit.badgeY + hit.badgeHeight) return hit;
        }
        for (let i = this.limitOrderHitAreas.length - 1; i >= 0; i--) {
            const hit = this.limitOrderHitAreas[i];
            if (hit.order.preview || hit.order.draggable === false) continue;
            if (x >= leftEdge && x <= rightEdge && Math.abs(y - hit.y) <= lineHitDist) return hit;
        }
        return null;
    }
    startDraggingLimitOrder(hit, clientY) {
        this.draggedLimitOrder = {
            orderRef: hit.order,
            index: hit.index,
            originalPrice: Number(hit.order.price),
            previewPrice: Number(hit.order.price),
            startClientY: clientY,
            moved: !1
        };
        this.priceCanvas.style.cursor = 'grabbing';
        this.drawCharts();
    }
    // Converts the pointer position to a price, clamped to the price pane so the
    // line cannot be dragged into the indicator panels or off the top of the chart.
    handleLimitOrderDrag(clientY) {
        if (!this.draggedLimitOrder) return;
        if (Math.abs(clientY - this.draggedLimitOrder.startClientY) > 2) this.draggedLimitOrder.moved = !0;
        const rect = this.priceCanvas.getBoundingClientRect();
        const chartTop = this.config.padding.top;
        const chartBottom = this.getPanelsTopY() - 1;
        const y = Math.max(chartTop, Math.min(chartBottom, clientY - rect.top));
        const decimals = typeof this.limitOrderPriceDecimals === 'number' ? this.limitOrderPriceDecimals : 2;
        const price = Number(this.screenToPrice(y).toFixed(decimals));
        if (isFinite(price) && price > 0) this.draggedLimitOrder.previewPrice = price;
        this.drawCharts();
    }
    endLimitOrderDrag() {
        if (!this.draggedLimitOrder) return;
        const drag = this.draggedLimitOrder;
        this.draggedLimitOrder = null;
        // The line followed the pointer, so it is still under it - stay in the grab
        // affordance. The hover handler resets to default once the pointer moves away.
        this.priceCanvas.style.cursor = 'grab';
        // A click with no real movement is not an edit - leave the order untouched.
        if (!drag.moved || drag.previewPrice === drag.originalPrice) { this.drawCharts(); return }
        const handler = typeof this.onLimitOrderPriceChange === 'function'
            ? this.onLimitOrderPriceChange
            : (typeof window.onChartLimitOrderPriceChange === 'function' ? window.onChartLimitOrderPriceChange : null);
        if (handler) {
            handler(drag.orderRef, drag.previewPrice, drag.originalPrice);
        } else {
            drag.orderRef.price = drag.previewPrice;
        }
        this.drawCharts();
    }
    cancelLimitOrderDrag() {
        if (!this.draggedLimitOrder) return;
        this.draggedLimitOrder = null;
        this.priceCanvas.style.cursor = 'default';
        this.drawCharts();
    }
    // Average entry (breakeven) line for the open position: thin gray dotted line under the
    // order lines, with a small "Long 100 · +$85" tag drawn after them. Pages opt in with
    // window.s8ChartPosition() (see s8ChartHeld).
    drawPositionLine(ctx, part) {
        const held = s8ChartHeld();
        if (!held || !held.line || !this.stockData || !this.stockData.length) return;
        const avg = held.avg;
        const chartTop = this.config.padding.top;
        const chartH = this.getPriceChartHeight();
        const panelsTopY = this.getPanelsTopY();
        const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
        let { min, max } = this.applyVerticalScale(rawRange);
        min += this.config.priceOffset; max += this.config.priceOffset;
        const y = this.priceToY(avg, min, max, chartH, this.getCanvasHeight());
        if (y < chartTop || y >= panelsTopY) return;
        const left = this.config.padding.left;
        const right = this.getCanvasWidth() - this.config.padding.right;

        if (part === 'line') {
            ctx.save();
            ctx.beginPath(); ctx.rect(left, chartTop, right - left, chartH); ctx.clip();
            ctx.setLineDash([2, 3]);
            ctx.strokeStyle = 'rgba(160,166,178,0.85)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
            ctx.restore();
            return;
        }

        let text = (held.dir > 0 ? 'Long ' : 'Short ') + held.sizeText;
        if (held.price > 0) text += s8PnlTagText(held.pnl(held.price, held.size));
        ctx.save();
        ctx.font = '12px Arial';
        const pad = 5, h = 20, w = ctx.measureText(text).width + 2 * pad;
        let x = left + 5;
        if (typeof window.s8LimitBadgeX === 'function') {
            const bx = window.s8LimitBadgeX(w, y, this);
            if (typeof bx === 'number' && isFinite(bx)) x = bx;
        }
        // Slide right past any order tag it would sit on (a stop moved to breakeven).
        (this.limitOrderHitAreas || []).forEach(a => {
            if (Math.abs(a.y - y) < h && x < a.badgeX + a.badgeWidth + 6 && x + w > a.badgeX - 6) x = a.badgeX + a.badgeWidth + 6;
        });
        const top = y - h / 2, r = 3;
        ctx.beginPath();
        ctx.moveTo(x + r, top); ctx.arcTo(x + w, top, x + w, top + h, r); ctx.arcTo(x + w, top + h, x, top + h, r);
        ctx.arcTo(x, top + h, x, top, r); ctx.arcTo(x, top, x + w, top, r); ctx.closePath();
        ctx.fillStyle = '#4a4f5c';
        ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(text, x + pad, y);
        ctx.restore();
    }

    drawLimitOrders(ctx) { this.limitOrderHitAreas = []; if (!this.limitOrders.length) return; ctx.save(); const chartTop = this.config.padding.top; const chartH = this.getPriceChartHeight(); const panelsTopY = this.getPanelsTopY(); ctx.beginPath(); ctx.rect(this.config.padding.left, chartTop, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, chartH); ctx.clip(); this.limitOrders.forEach((order, orderIndex) => { const { action, quantity } = order; const isDraggingThis = !!(this.draggedLimitOrder && this.draggedLimitOrder.orderRef === order); const price = isDraggingThis ? this.draggedLimitOrder.previewPrice : order.price; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const y = this.priceToY(price, min, max, chartH, this.getCanvasHeight()); if (y < chartTop || y >= panelsTopY) return; ctx.save(); ctx.setLineDash(isDraggingThis ? [] : [5, 5]); ctx.strokeStyle = (action.toLowerCase() === 'buy') ? '#089981' : '#ff3333'; ctx.lineWidth = (isDraggingThis || this.hoveredLimitOrderIndex === orderIndex) ? 2 : 1; ctx.beginPath(); ctx.moveTo(this.config.padding.left, y); ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, y); ctx.stroke(); ctx.restore(); const typeSuffix = (order.orderType === 'Stop' ? ' stop' : '') + (order.triggerOnClose ? ' close' : ''); const fillPnl = order.preview ? '' : s8OrderFillPnlText(order, price); const labelText = (isDraggingThis ? `${action}${typeSuffix} ${quantity} @ ${s8FormatChartPrice(price)}` : `${action}${typeSuffix} ${quantity}`) + fillPnl; const closeW = (order.preview || isDraggingThis) ? 0 : 15; ctx.font = '12px Arial'; const textMetrics = ctx.measureText(labelText); const textWidth = textMetrics.width; const labelPadding = 5; const badgeHeight = 20; const dynamicBadgeWidth = textWidth + 2 * labelPadding + closeW; let badgeX = this.config.padding.left + 5; if (typeof window.s8LimitBadgeX === 'function') { const bx = window.s8LimitBadgeX(dynamicBadgeWidth, y, this); if (typeof bx === 'number' && isFinite(bx)) badgeX = bx; } const badgeY = y - badgeHeight / 2; const borderRadius = 3; ctx.save(); ctx.fillStyle = (action.toLowerCase() === 'buy') ? '#089981' : '#ff3333'; ctx.beginPath(); ctx.moveTo(badgeX + borderRadius, badgeY); ctx.lineTo(badgeX + dynamicBadgeWidth - borderRadius, badgeY); ctx.arcTo(badgeX + dynamicBadgeWidth, badgeY, badgeX + dynamicBadgeWidth, badgeY + borderRadius, borderRadius); ctx.lineTo(badgeX + dynamicBadgeWidth, badgeY + badgeHeight - borderRadius); ctx.arcTo(badgeX + dynamicBadgeWidth, badgeY + badgeHeight, badgeX + dynamicBadgeWidth - borderRadius, badgeY + badgeHeight, borderRadius); ctx.lineTo(badgeX + borderRadius, badgeY + badgeHeight); ctx.arcTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - borderRadius, borderRadius); ctx.lineTo(badgeX, badgeY + borderRadius); ctx.arcTo(badgeX, badgeY, badgeX + borderRadius, badgeY, borderRadius); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(labelText, badgeX + labelPadding, badgeY + badgeHeight / 2); let closeRect = null; if (closeW) { const ccx = badgeX + dynamicBadgeWidth - closeW / 2 - 2, ccy = badgeY + badgeHeight / 2; const closeHovered = this.hoveredLimitOrderCloseIndex === orderIndex; ctx.strokeStyle = closeHovered ? '#ffffff' : 'rgba(255,255,255,0.75)'; ctx.lineWidth = closeHovered ? 1.8 : 1.4; ctx.beginPath(); ctx.moveTo(ccx - 3.2, ccy - 3.2); ctx.lineTo(ccx + 3.2, ccy + 3.2); ctx.moveTo(ccx + 3.2, ccy - 3.2); ctx.lineTo(ccx - 3.2, ccy + 3.2); ctx.stroke(); closeRect = { x: ccx - 8, y: ccy - 9, w: 16, h: 18 } } ctx.restore(); this.limitOrderHitAreas.push({ index: orderIndex, order: order, y: y, badgeX: badgeX, badgeY: badgeY, badgeWidth: dynamicBadgeWidth, badgeHeight: badgeHeight, closeRect: closeRect }) }); ctx.restore() }
    addDataPoint() {
        if (this.isViewPinnedToRightEdge && this.stockData.length > 0) {
            this.config.dataOffset = Math.max(0, this.stockData.length - this.config.visibleCandles);
        } else if (this.stockData.length > 0) {
            const rightmostVisibleIndex = this.config.dataOffset + this.config.visibleCandles - 1;
            const newestCandleIndex = this.stockData.length - 1;
            if (newestCandleIndex > rightmostVisibleIndex) {
                this.isViewPinnedToRightEdge = true;
                this.config.dataOffset = Math.max(0, this.stockData.length - this.config.visibleCandles);
            }
        }
        this.calculateIndicators(); this.drawCharts()
    }
    prependHistoricalData(newData) {
        if (!newData || newData.length === 0) { this.isLoadingHistoricalData = false; return; }
        const oldOffset = this.config.dataOffset;
        this.stockData = [...newData, ...this.stockData];
        this.config.dataOffset = oldOffset + newData.length;
        this.isLoadingHistoricalData = false;
        this.calculateIndicators(); this.drawCharts();
    }
    appendCandle(candle) {
        this.stockData.push(candle);
        this.config.dataOffset = Math.max(0, this.stockData.length - this.config.visibleCandles);
        this.calculateIndicators();
        this.drawCharts();
    }
    setLoadingHistoricalData(loading) { this.isLoadingHistoricalData = loading; }
    // Rounded-rect path helper for the crosshair labels.
    _crosshairLabelPath(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
    }
    drawCrosshair(ctx, mouseX, mouseY) {
        if (!this.stockData.length) return;
        const chartLeft = this.config.padding.left;
        const chartRight = this.getCanvasWidth() - this.config.padding.right;
        const chartTop = this.config.padding.top;
        const chartH = this.getPriceChartHeight();
        const chartBottom = chartTop + chartH;
        if (mouseX < chartLeft || mouseX > chartRight || mouseY < chartTop || mouseY > chartBottom) return;

        const cW = this.calculateCandleWidth();
        const candleStep = cW + this.config.spacing;
        const indexWithinView = Math.floor((mouseX - this.pixelOffset - chartLeft) / candleStep);
        const dataIndex = this.config.dataOffset + indexWithinView;
        // The cursor may sit past the newest candle (or before the oldest) when the
        // chart has been dragged to open empty space. The crosshair and the price
        // label still apply there -- only the candle-derived readouts don't.
        const candle = (dataIndex >= 0 && dataIndex < this.stockData.length) ? this.stockData[dataIndex] : null;
        const snappedMouseX = chartLeft + this.pixelOffset + indexWithinView * candleStep + cW * 0.5;

        ctx.save();
        ctx.strokeStyle = this.config.currentCrosshairColor;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(snappedMouseX, 0);
        ctx.lineTo(snappedMouseX, this.getCanvasHeight());
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, mouseY);
        ctx.lineTo(chartRight, mouseY);
        ctx.stroke();
        ctx.setLineDash([]);

        if (candle) {
            if (this.openEl) this.openEl.textContent = s8FormatChartPrice(candle.open);
            if (this.highEl) this.highEl.textContent = s8FormatChartPrice(candle.high);
            if (this.lowEl) this.lowEl.textContent = s8FormatChartPrice(candle.low);
            if (this.closeEl) {
                this.closeEl.textContent = s8FormatChartPrice(candle.close);
                this.closeEl.style.color = candle.close >= candle.open ? '#26a69a' : '#ef5350';
            }
            this.updateChangeRange(dataIndex);
            if (this.volEl) {
                let suffix = '', scaled = candle.volume;
                if (scaled >= 1e9) { suffix = 'B'; scaled /= 1e9 }
                else if (scaled >= 1e6) { suffix = 'M'; scaled /= 1e6 }
                else if (scaled >= 1e3) { suffix = 'K'; scaled /= 1e3 }
                this.volEl.textContent = parseFloat(scaled.toFixed(2)) + suffix;
            }
            this.updateIndicatorValuesDisplay(dataIndex);
        }

        const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
        let { min, max } = this.applyVerticalScale(rawRange);
        min += this.config.priceOffset;
        max += this.config.priceOffset;
        const price = min + (max - min) * ((chartBottom - mouseY) / chartH);
        const priceText = s8FormatChartPrice(price);

        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const bgColor = 'rgba(60, 64, 67, 0.9)', textColor = '#F0F0F0';
        const radius = 3, labelH = 20, pad = 5;

        const priceLabelW = ctx.measureText(priceText).width + 2 * pad;
        const priceLabelY = mouseY - labelH / 2;
        ctx.fillStyle = bgColor;
        this._crosshairLabelPath(ctx, chartRight, priceLabelY, priceLabelW, labelH, radius);
        ctx.fill();
        ctx.fillStyle = textColor;
        ctx.fillText(priceText, chartRight + pad, mouseY);

        // No candle under the cursor means no timestamp to show -- extrapolating one
        // would invent times inside session gaps, so the date label is simply omitted.
        if (candle) {
            const dateText = this.formatDetailTimestamp(candle.t, this.timeframe);
            const dateLabelW = ctx.measureText(dateText).width + 2 * pad;
            const dateLabelX = snappedMouseX - dateLabelW / 2;
            const dateLabelY = chartBottom + pad;
            ctx.fillStyle = bgColor;
            this._crosshairLabelPath(ctx, dateLabelX, dateLabelY, dateLabelW, labelH, radius);
            ctx.fill();
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            ctx.fillText(dateText, snappedMouseX, dateLabelY + labelH / 2);
        }

        ctx.restore();
        this.drawCrosshairAddButton(ctx);
    }

    changeTimeframe(newTimeframe) {
        if (this.timeframe === newTimeframe || !this.stockData.length) return; this.timeframe = newTimeframe; this.updateTimeframeDropdownVisualState(); if (this.config.dataOffset + this.config.visibleCandles >= this.stockData.length - 1) { this.config.dataOffset = Math.max(0, this.stockData.length - this.config.visibleCandles) }
        this.saveSettings(); this.updateWatermark(); this.drawCharts()
    }
    updateCurrentCandle(minuteCandle, volumeIncrement) {
        if (!this.stockData.length) return; const lastIndex = this.stockData.length - 1, lastCandle = this.stockData[lastIndex]; if (this._originalData) {
            if (this.timeframe === '1min') this._originalData[lastIndex] = { ...minuteCandle }; else {
                let found = !1; for (let i = this._originalData.length - 1; i >= 0; i--) { if (this._originalData[i].t === minuteCandle.t) { this._originalData[i] = { ...minuteCandle }; found = !0; break } }
                if (!found) this._originalData.push({ ...minuteCandle })
            }
        }
        if (this.timeframe === '1min') this.stockData[lastIndex] = { ...minuteCandle }; else { lastCandle.high = Math.max(lastCandle.high, minuteCandle.high); lastCandle.low = Math.min(lastCandle.low, minuteCandle.low); lastCandle.close = minuteCandle.close; if (volumeIncrement) lastCandle.volume += volumeIncrement }
        this.calculateIndicators()
    }
    updateTradeMarkers() {
        if (!this.tradeMarkers.length || !this._originalData) return; this.tradeMarkers.forEach(marker => {
            if (!marker.originalTimestamp && marker.dataIndex >= 0 && marker.dataIndex < this._originalData.length) { marker.originalTimestamp = this._originalData[marker.dataIndex].t }
            if (marker.originalTimestamp) {
                let bestIndex = 0, bestDistance = Infinity; for (let i = 0; i < this.stockData.length; i++) { const dist = Math.abs(this.stockData[i].t - marker.originalTimestamp); if (dist < bestDistance) { bestDistance = dist; bestIndex = i } }
                marker.dataIndex = bestIndex
            }
        })
    }
    getIndicatorConfig(key) {
        const toggle = this.indicatorsDropdown.querySelector(`input[type="checkbox"][value="${key}"]`); if (toggle && toggle.parentElement) { const nameEl = toggle.parentElement.querySelector('.sc-indicator-name'); const dotEl = toggle.parentElement.querySelector('.sc-indicator-dot'); return { name: nameEl ? nameEl.textContent.trim() : key, color: dotEl ? dotEl.style.backgroundColor : (this.indicators[key]?.color || '#ccc') } }
        return { name: key, color: (this.indicators[key]?.color || '#ccc') }
    }
    updateIndicatorValuesDisplay(dataIndex) {
        if (!this.indicatorValuesDisplay || dataIndex < 0 || dataIndex >= this.stockData.length) { if (this.indicatorValuesDisplay) this.indicatorValuesDisplay.innerHTML = ''; return }
        this.indicatorValuesDisplay.innerHTML = ''; const formatValue = val => (val === null || val === undefined) ? 'N/A' : (typeof val === 'number' ? (Math.abs(val) < 0.001 && val !== 0 ? val.toExponential(2) : val.toFixed(2)) : String(val)); const textColor = this.config.darkMode ? this.config.darkModeColors.textColor : this.config.textColor; this.movingAverages.forEach(ma => { if (ma.enabled && ma.data && dataIndex < ma.data.length && ma.data[dataIndex] !== null) { const item = document.createElement('div'); item.style.cssText = `display:flex;align-items:center;margin-right:10px;margin-bottom:2px;color:${textColor};font-size:12px;font-family:'Open Sans',Arial,sans-serif;font-weight:500;`; const dot = document.createElement('span'); dot.style.cssText = `background-color:${ma.color};width:8px;height:8px;border-radius:50%;margin-right:4px;display:inline-block;`; item.appendChild(dot); const name = document.createElement('span'); name.textContent = `${ma.type.toUpperCase()}${ma.period}: `; name.style.marginRight = '3px'; item.appendChild(name); const valSpan = document.createElement('span'); valSpan.textContent = s8FormatChartPrice(ma.data[dataIndex]); item.appendChild(valSpan); this.indicatorValuesDisplay.appendChild(item) } }); for (const key in this.indicators) {
            if (this.indicators[key].enabled && key !== 'atr') {
                const config = this.getIndicatorConfig(key), data = this.indicators[key].data; let values = [];
                // Special handling for candlestick patterns
                if (key === 'patterns' && Array.isArray(data)) {
                    const patternsAtIndex = data.filter(p => p.index === dataIndex);
                    if (patternsAtIndex.length > 0) {
                        values.push(patternsAtIndex.map(p => p.name).join(', '));
                    }
                } else if (key === 'bollinger' && data.middle && data.upper && data.lower && dataIndex < data.middle.length) { values.push(`U: ${formatValue(data.upper[dataIndex])}`, `M: ${formatValue(data.middle[dataIndex])}`, `L: ${formatValue(data.lower[dataIndex])}`) } else if (key === 'macd' && data.macdLine && data.signalLine && data.histogram && dataIndex < data.macdLine.length) { values.push(`M: ${formatValue(data.macdLine[dataIndex])}`, `S: ${formatValue(data.signalLine[dataIndex])}`, `H: ${formatValue(data.histogram[dataIndex])}`) } else if (data && dataIndex < data.length && data[dataIndex] !== null) { values.push(formatValue(data[dataIndex])) }
                if (values.length > 0) { const item = document.createElement('div'); item.style.cssText = `display:flex;align-items:center;margin-right:10px;margin-bottom:2px;color:${textColor};font-size:12px;font-family:'Open Sans',Arial,sans-serif;font-weight:500;`; const dot = document.createElement('span'); dot.style.cssText = `background-color:${config.color};width:8px;height:8px;border-radius:50%;margin-right:4px;display:inline-block;`; item.appendChild(dot); const name = document.createElement('span'); name.textContent = `${config.name}: `; name.style.marginRight = '3px'; item.appendChild(name); const valSpan = document.createElement('span'); valSpan.textContent = values.join(', '); item.appendChild(valSpan); this.indicatorValuesDisplay.appendChild(item) }
            }
        }
    }
    saveSettings() {
        // Skip saving if indicators were provided via constructor options (programmatic configuration)
        if (this.options.indicators) { return; }
        const settings = { timeframe: this.timeframe, chartType: this.config.chartType, indicators: {}, movingAverages: this.movingAverages.map(ma => ({ type: ma.type, period: ma.period, enabled: ma.enabled, id: ma.id, color: ma.color })) }; for (const key in this.indicators) settings.indicators[key] = this.indicators[key].enabled; try { localStorage.setItem('stockChartSettings', JSON.stringify(settings)) } catch (e) { console.error('Failed to save chart settings:', e) }
    }
    loadSettings() {
        try {
            // If indicators were provided in constructor options, use those instead of localStorage
            if (this.options.indicators) {
                for (const key in this.options.indicators) { if (this.indicators[key]) { this.indicators[key].enabled = this.options.indicators[key] } }
                this.indicatorsDropdown.querySelectorAll('input[type="checkbox"]:not([value^="ema_"]):not([value^="sma_"])').forEach(toggle => { if (this.options.indicators.hasOwnProperty(toggle.value) && this.indicators[toggle.value]) { toggle.checked = this.options.indicators[toggle.value] } });
                // If moving averages also provided in options, use those
                if (this.options.movingAverages && Array.isArray(this.options.movingAverages)) { this.movingAverages = this.options.movingAverages.map((ma, index) => ({ ...ma, data: [], color: ma.color || this.colorPalette[index % this.colorPalette.length] })) }
                this.populateMovingAveragesUI(); this.setupMovingAverageToggleHandlers(); this.updateTimeframeDropdownVisualState(); this.calculateIndicators(); this.drawCharts(); this.updateWatermark();
                return; // Skip localStorage loading
            }
            // Otherwise, load from localStorage as normal
            const saved = localStorage.getItem('stockChartSettings'); if (saved) {
                const settings = JSON.parse(saved); if (!this.options.timeframe && settings.timeframe) this.timeframe = settings.timeframe; if (settings.chartType && this.availableChartTypes().some(t => t.value === settings.chartType)) this.config.chartType = settings.chartType; if (settings.movingAverages && Array.isArray(settings.movingAverages)) { this.movingAverages = settings.movingAverages.map((ma, index) => ({ ...ma, data: [], color: ma.color || this.colorPalette[index % this.colorPalette.length] })) }
                if (settings.indicators) {
                    for (const key in settings.indicators) { if (this.indicators[key]) { this.indicators[key].enabled = settings.indicators[key] } }
                    this.indicatorsDropdown.querySelectorAll('input[type="checkbox"]:not([value^="ema_"]):not([value^="sma_"])').forEach(toggle => { if (settings.indicators.hasOwnProperty(toggle.value) && this.indicators[toggle.value]) { toggle.checked = settings.indicators[toggle.value] } })
                    // The candlestick-pattern marker overlay no longer has a menu
                    // control, so ignore any value persisted from when it did -
                    // otherwise anyone who once enabled it is stuck with it on.
                    // Still settable in code: chart.indicators.patterns.enabled = true
                    if (this.indicators.patterns) this.indicators.patterns.enabled = false;
                }
                this.populateMovingAveragesUI(); this.setupMovingAverageToggleHandlers(); this.updateTimeframeDropdownVisualState(); this.calculateIndicators(); this.drawCharts(); this.updateWatermark()
            } else { this.indicatorsDropdown.querySelectorAll('input[type="checkbox"]:not([value^="ema_"]):not([value^="sma_"])').forEach(toggle => { if (this.indicators[toggle.value]) { this.indicators[toggle.value].enabled = toggle.checked } }); this.calculateIndicators(); this.updateTimeframeDropdownVisualState() }
        } catch (e) { console.error('Failed to load chart settings:', e); this.indicatorsDropdown.querySelectorAll('input[type="checkbox"]').forEach(t => { if (this.indicators[t.value]) this.indicators[t.value].enabled = t.checked }); this.calculateIndicators(); this.updateTimeframeDropdownVisualState() }
    }
    updateWatermark() { if (this.config.watermark.enabled) this.drawWatermark(this.priceCtx, this.getCanvasWidth(), this.getCanvasHeight()); }
    updateTimeframeDropdownVisualState() { if (!this.timeframeDropdown) this.timeframeDropdown = this.container.querySelector('.sc-timeframe-dropdown'); if (!this.timeframeDropdown) return; this.timeframeDropdown.querySelectorAll('.sc-timeframe-option').forEach(opt => { opt.classList.remove('selected'); if (opt.getAttribute('data-value') === this.timeframe) opt.classList.add('selected'); }); this.updateTimeframeButtonLabel() }
    _showNotification(message) {
        const existingNotifications = this.chartContainer.querySelectorAll('.chart-notification'); existingNotifications.forEach(notification => { notification.parentNode?.removeChild(notification) }); const n = document.createElement('div'); n.classList.add('chart-notification'); if (message.includes('<') && message.includes('>')) { n.innerHTML = message } else { n.textContent = message }
        n.style.cssText = `position:absolute;top:20px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:5px;z-index:100;transition:opacity .5s ease-in-out;opacity:1;background-color:${this.config.darkMode ? 'black' : 'rgba(240,240,240,0.9)'};color:${this.config.darkMode ? '#e0e0e0' : '#333'};border:1px solid ${this.config.darkMode ? '#666' : '#ccc'};`; this.chartContainer.appendChild(n); setTimeout(() => { n.style.opacity = '0'; setTimeout(() => n.parentNode?.removeChild(n), 500) }, 5000)
    }
    async copyChartToClipboard() {
        if (!this.priceCanvas) { this._showNotification('Error: Chart canvas not available.'); return }
        const cssWidth = this.getCanvasWidth(); const cssHeight = this.getCanvasHeight();
        const tempCanvas = document.createElement('canvas'); tempCanvas.width = cssWidth; tempCanvas.height = cssHeight; const ctx = tempCanvas.getContext('2d'); ctx.fillStyle = this.config.darkMode ? '#0F0F0F' : '#FFFFFF'; ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height); ctx.drawImage(this.priceCanvas, 0, 0, this.priceCanvas.width, this.priceCanvas.height, 0, 0, cssWidth, cssHeight); const logo = new Image(); logo.src = StockChart.ASSET_BASE + 'simul8or-logo.svg'; try { await new Promise((res, rej) => { logo.onload = res; logo.onerror = () => rej(new Error('Logo failed to load.')) }); /* The wordmark carries its own black outline, which is what keeps it legible on a white chart or over bright candles, so it no longer needs the black pill it used to sit in. Same 36px height and same 15px corner inset as before. NOTE: this method is one long line - only block comments are safe here. */ const extPad = 15, logoH = 36, logoW = logoH * (logo.naturalWidth / logo.naturalHeight); ctx.drawImage(logo, extPad, tempCanvas.height - logoH - extPad, logoW, logoH) } catch (e) { this._showNotification('Error: Could not load logo.') }
        tempCanvas.toBlob(async blob => {
            if (!blob) { this._showNotification('Error: Could not generate image.'); return }
            if (navigator.clipboard && navigator.clipboard.write) { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); this._showNotification('Chart Image Copied to Clipboard') } catch (err) { this._showNotification('Error: Failed to copy image.') } } else this._showNotification('Clipboard API not available.')
        }, 'image/png')
    }
    addAIPriceLevel(level) {
        if (!level.color) { const labelLower = level.label.toLowerCase(); if (labelLower.includes('entry') || labelLower.includes('buy')) { level.color = '#EDF0F5' } else if (labelLower.includes('stop') || labelLower.includes('loss')) { level.color = '#FF6E7A' } else if (labelLower.includes('target') || labelLower.includes('exit') || labelLower.includes('take')) { level.color = '#3ED69B' } else { level.color = '#F5B14A' } }
        this.aiPriceLevels.push(level); this.drawCharts()
    }
    setAIPriceLevels(levelsArray) { this.aiPriceLevels = levelsArray.slice(); this.aiPriceLevels.forEach(level => { if (!level.color) { const labelLower = level.label.toLowerCase(); if (labelLower.includes('entry') || labelLower.includes('buy')) { level.color = '#EDF0F5' } else if (labelLower.includes('stop') || labelLower.includes('loss')) { level.color = '#FF6E7A' } else if (labelLower.includes('target') || labelLower.includes('exit') || labelLower.includes('take')) { level.color = '#3ED69B' } else { level.color = '#F5B14A' } } }); this.drawCharts() }
    clearAIPriceLevels() { this.aiPriceLevels = []; this.drawCharts() }
    removeAIPriceLevelsByLabel(labelFilter) { this.aiPriceLevels = this.aiPriceLevels.filter(level => !level.label.toLowerCase().includes(labelFilter.toLowerCase())); this.drawCharts() }
    // Advisory plan levels from the Chart Analyzer. They are NOT working orders,
    // so they borrow the order badge's geometry (h20 / r3 / 15px close) but stay
    // OUTLINED with a colored label, while real orders are filled with white text.
    // The line is dotted [2,4] where orders are dashed [5,5], so the two stay
    // separable without relying on colour. They are not draggable by design.
    drawAIPriceLevels(ctx) {
        this.aiPriceLevelHitAreas = [];
        if (!this.aiPriceLevels.length) return;
        ctx.save();
        const dpr = this._dpr || window.devicePixelRatio || 1;
        const snap = v => Math.round(v * dpr) / dpr;
        const chartTop = this.config.padding.top;
        const chartH = this.getPriceChartHeight();
        const panelsTopY = this.getPanelsTopY();
        ctx.beginPath();
        ctx.rect(this.config.padding.left, chartTop, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, chartH);
        ctx.clip();
        this.aiPriceLevels.forEach((level, levelIndex) => {
            const { label, price, color } = level;
            const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
            let { min, max } = this.applyVerticalScale(rawRange);
            min += this.config.priceOffset;
            max += this.config.priceOffset;
            const rawY = this.priceToY(price, min, max, chartH, this.getCanvasHeight());
            if (rawY < chartTop || rawY >= panelsTopY) return;
            const y = snap(rawY);

            ctx.save();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.config.padding.left, y);
            ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, y);
            ctx.stroke();
            ctx.restore();

            const labelText = `${label} ${s8FormatChartPrice(price)}`;
            ctx.font = '12px Arial';
            const labelPadding = 5;
            const badgeHeight = 20;
            const closeW = 15;
            const badgeWidth = ctx.measureText(labelText).width + 2 * labelPadding + closeW;
            const badgeX = snap(this.config.padding.left + 5);
            const badgeY = snap(y - badgeHeight / 2);

            ctx.save();
            // Outlined, not filled: proposed level rather than a committed order.
            ctx.fillStyle = 'rgba(8, 9, 11, 0.85)';
            this._crosshairLabelPath(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 3);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            this._crosshairLabelPath(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 3);
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, snap(badgeX + labelPadding), snap(badgeY + badgeHeight / 2));

            const ccx = badgeX + badgeWidth - closeW / 2 - 2;
            const ccy = badgeY + badgeHeight / 2;
            const closeHovered = this.hoveredAIPriceLevelCloseIndex === levelIndex;
            ctx.strokeStyle = closeHovered ? '#ffffff' : color;
            ctx.lineWidth = closeHovered ? 1.8 : 1.4;
            ctx.beginPath();
            ctx.moveTo(ccx - 3.2, ccy - 3.2); ctx.lineTo(ccx + 3.2, ccy + 3.2);
            ctx.moveTo(ccx + 3.2, ccy - 3.2); ctx.lineTo(ccx - 3.2, ccy + 3.2);
            ctx.stroke();
            ctx.restore();

            this.aiPriceLevelHitAreas.push({
                index: levelIndex, level: level, y: y,
                badgeRect: { x: badgeX, y: badgeY, w: badgeWidth, h: badgeHeight },
                closeRect: { x: ccx - 8, y: ccy - 9, w: 16, h: 18 }
            });
        });
        ctx.restore();
    }
    findAIPriceLevelCloseAt(x, y) {
        const areas = this.aiPriceLevelHitAreas || [];
        for (let i = areas.length - 1; i >= 0; i--) {
            if (this._inRect(x, y, areas[i].closeRect)) return areas[i];
        }
        return null;
    }
    // The three levels are one plan: an entry and a target with no stop is a worse
    // state than no plan at all, and there is no undo short of another analysis.
    // So the (x) on ANY badge drops all of them. The analyzer card stays open, so
    // the analysis the user paid for is still readable; the card's Clear button is
    // the heavier action that also closes the card.
    dismissAIPriceLevels() {
        this.clearAIPriceLevels();
        this.hoveredAIPriceLevelCloseIndex = null;
        const handler = (typeof this.onAIPriceLevelsDismiss === 'function')
            ? this.onAIPriceLevelsDismiss
            : window.onChartAIPriceLevelsDismiss;
        if (typeof handler === 'function') handler(this);
        this.container.dispatchEvent(new CustomEvent('sc-ai-levels-dismiss', { detail: { chart: this }, bubbles: !0 }));
    }
}

// Stable identity for limit orders. The fill loop splices the order book by index on
// every tick, so an index alone is not a safe handle for drag/edit operations that
// span more than one tick.
if (typeof window !== 'undefined' && typeof window.nextLimitOrderId !== 'function') {
    let limitOrderIdSeq = 0;
    window.nextLimitOrderId = function () { return 'lo_' + Date.now().toString(36) + '_' + (++limitOrderIdSeq) };
}

// Sub-dollar stocks quote in 4 decimals; everything else in cents.
function s8PriceDecimals(price) {
    const abs = Math.abs(Number(price));
    return abs > 0 && abs < 1 ? 4 : 2;
}
function s8FormatChartPrice(price) {
    return Number(price).toFixed(s8PriceDecimals(price));
}

// The open position, as the page reports it through window.s8ChartPosition(). Pages opt
// in by defining that hook; it returns:
//   position      signed size, negative = short (shares, units, contracts, coins)
//   positionCost  cost basis (stocks), or
//   avg           average entry price directly
//   price         current price, for the open P&L on the entry line's tag
//   pnlAt(exit, qty)  optional: dollars for closing `qty` at `exit` (forex converts to
//                 USD, futures price by the tick); default is (exit - avg) * qty
//   qtyOf(order)  optional: an order line's size in position units, when its label
//                 quantity isn't (forex lots, crypto text); default Number(order.quantity)
//   line: false   the page draws its own entry line
//   sizeText      optional size text for the entry line's tag
function s8ChartHeld() {
    if (typeof window.s8ChartPosition !== 'function') return null;
    let held;
    try { held = window.s8ChartPosition(); } catch (e) { return null; }
    const position = held ? Number(held.position) : 0;
    if (!position || !isFinite(position)) return null;
    const size = Math.abs(position);
    const dir = position > 0 ? 1 : -1;
    const avg = isFinite(Number(held.avg)) && Number(held.avg) > 0 ? Number(held.avg)
        : (Number(held.positionCost) > 0 ? Number(held.positionCost) / size : NaN);
    if (!(avg > 0)) return null;
    return {
        size, dir, avg,
        price: Number(held.price),
        line: held.line !== false,
        sizeText: held.sizeText || size.toLocaleString('en-US', { maximumFractionDigits: 6 }),
        pnl: (exit, qty) => typeof held.pnlAt === 'function' ? Number(held.pnlAt(exit, qty)) : dir * (exit - avg) * qty,
        qtyOf: order => typeof held.qtyOf === 'function' ? Number(held.qtyOf(order)) : Number(order.quantity)
    };
}

// Dollars as " · −$120" (whole dollars from $10 up, cents below).
function s8PnlTagText(pnl) {
    if (!isFinite(pnl)) return '';
    const abs = Math.abs(pnl);
    const digits = abs < 10 ? 2 : 0;
    const rounded = Number(abs.toFixed(digits));
    const sign = rounded === 0 ? '' : (pnl > 0 ? '+' : '−');
    return ' · ' + sign + '$' + rounded.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

// What an order that closes part or all of the open position would make or lose if it
// filled at `price`, for the order line's label (Leslie's request). Orders that open or
// add to a position get nothing.
function s8OrderFillPnlText(order, price) {
    const held = s8ChartHeld();
    if (!held || !isFinite(price)) return '';
    const action = String(order.action || '').toLowerCase();
    const closes = (action === 'sell' && held.dir > 0) || (action === 'buy' && held.dir < 0) || (action === 'stop' && held.dir > 0);
    if (!closes) return '';
    const qty = Math.min(held.qtyOf(order) || 0, held.size);
    if (!(qty > 0)) return '';
    return s8PnlTagText(held.pnl(price, qty));
}

// Files that ship next to stockchart.js (the simul8or logo) load from the script's own folder.
StockChart.ASSET_BASE = (function () { var s = document.currentScript; return s && s.src ? s.src.replace(/[^\/?#]*([?#].*)?$/, '') : ''; })();
