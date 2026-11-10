/*! StockChart v3.0 | free JavaScript stock chart by simul8or | https://simul8or.com/Javascript-Stock-Chart.php */
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
        this.volumeHeight = 100; this.colorPalette = ['#2196F3', '#E74C3C', '#E69500', '#2157F3', '#9C27B0', '#FF9800', '#4CAF50', '#F44336', '#3F51B5', '#009688', '#FFC107', '#795548', '#607D8B', '#E91E63', '#CDDC39']; this.initializeMovingAverageIndicators(); this.config = { padding: Object.assign({ top: 90, right: 60, bottom: 30, left: 0 }, options.padding || {}), candleWidth: 10, spacing: 4, visibleCandles: (options.initialVisibleCandles !== undefined && typeof options.initialVisibleCandles === 'number' && options.initialVisibleCandles > 0) ? options.initialVisibleCandles : (this.getKeptZoom() || this.getInitialVisibleCandles()), maxVisibleCandles: this.getMaxVisibleCandles(), dataOffset: 0, chartType: options.chartType || 'line', darkMode: options.darkMode || !1, timeframesToDisplay: options.availableTimeframes || this.defaultTimeframes, bullColor: '#26a69a', bearColor: '#ef5350', gridColor: '#d0d0d0', textColor: '#888', crosshairColor: 'rgba(0,0,0,0.3)', drawingLineColor: '#3498db', drawingLineColorSelected: '#ff9800', drawingLineWidth: 1.5, drawingLineWidthSelected: 2.5, verticalScaleFactor: 1.0, verticalPadding: 0.1, priceOffset: 0, watermark: { enabled: !0, text: options.ticker || 'NVDA', font: this.getFontSize('watermark'), opacity: 0.1 }, branding: { enabled: options.hideBranding !== !0, text: 'simul8or.com', font: this.getFontSize('branding'), opacity: 0.3, url: 'https://simul8or.com', logo: options.brandingLogo || StockChart.BRANDING_LOGO || window.S8_CHART_LOGO || null, logoHeight: options.brandingLogoHeight || 26, logoOpacity: options.brandingLogoOpacity || 0.85 }, darkModeColors: { bullColor: '#089981', bearColor: '#F23645', gridColor: '#444', textColor: '#e0e0e0', crosshairColor: 'rgba(255,255,255,0.4)', }, useAfterHoursStyling: options.useAfterHoursStyling !== undefined ? options.useAfterHoursStyling : !0, targetPixelsPerLabel: 45, }; this.createDOM(); this.setupPriceLineShortcuts(); this.chartContainer = this.container.querySelector('.sc-chart-container'); if (this.chartContainer) this.chartContainer._scInstance = this;  this.chartInfoOverlayEl = this.chartContainer.querySelector('.sc-chart-info-overlay'); const ohlcvValuesDisplay = this.chartInfoOverlayEl.querySelector('.sc-ohlcv-values-display'); if (ohlcvValuesDisplay) { this.openEl = ohlcvValuesDisplay.querySelector('.open-value'); this.highEl = ohlcvValuesDisplay.querySelector('.high-value'); this.lowEl = ohlcvValuesDisplay.querySelector('.low-value'); this.closeEl = ohlcvValuesDisplay.querySelector('.close-value'); this.changeEl = ohlcvValuesDisplay.querySelector('.change-value'); this.rangeEl = ohlcvValuesDisplay.querySelector('.range-value'); this.volEl = ohlcvValuesDisplay.querySelector('.vol-value') }
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
            circles: this.circles.slice()
        };
    }
    restoreOverlays(state) {
        if (!state) return;
        const keys = ['limitOrders', 'aiPriceLevels', 'priceLines', 'lines', 'textAnnotations', 'emoticons', 'fibonacciRetracements', 'drawingShapes', 'arrows', 'rectangles', 'circles'];
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
                priceLines: this.priceLines.filter(l => l.kind === 'line')
            });
        } catch (e) { return null; }
    }
    resetDrawingHistory() { this._undoStack = []; this._drawingBaseline = this._drawingSnapshot(); }
    recordDrawingState() {
        // Mid-drag or mid-draw: wait for the gesture to finish.
        if (this.drawingLine || this.draggedLine || this.drawingArrow || this.drawingRectangle || this.drawingCircle || this.drawingFibonacci || this.draggedPriceLine) return;
        const snap = this._drawingSnapshot();
        if (snap === null || snap === this._drawingBaseline) return;
        if (!this._undoStack) this._undoStack = [];
        if (this._drawingBaseline !== undefined && this._drawingBaseline !== null) this._undoStack.push(this._drawingBaseline);
        if (this._undoStack.length > 50) this._undoStack.shift();
        this._drawingBaseline = snap;
    }
    _applyDrawingSnapshot(snap) {
        const s = JSON.parse(snap);
        ['lines', 'textAnnotations', 'emoticons', 'fibonacciRetracements', 'drawingShapes', 'arrows', 'rectangles', 'circles'].forEach(k => { this[k] = Array.isArray(s[k]) ? s[k] : [] });
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
        const empty = JSON.stringify({ lines: [], textAnnotations: [], emoticons: [], fibonacciRetracements: [], drawingShapes: [], arrows: [], rectangles: [], circles: [], priceLines: [] });
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
                f: () => { this.closeOtherToolbarMenus('fibonacci'); if (!this.fibonacciMode) this.activateFibonacciMode(); },
                r: () => { if (this.fitViewButton) this.fitViewButton.click(); },
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
        }); this.priceCanvas.addEventListener('touchstart', (e) => { if (e.touches.length === 1) { const rect = this.priceCanvas.getBoundingClientRect(); const x = e.touches[0].clientX - rect.left; const touchedOrder = this.findLimitOrderAt(x, e.touches[0].clientY - rect.top); if (touchedOrder) { this.startDraggingLimitOrder(touchedOrder, e.touches[0].clientY); e.preventDefault(); return } if (x < this.getCanvasWidth() - this.config.padding.right) { this.isDragging = !0; this.dragStartX = e.touches[0].clientX; this.dragStartY = e.touches[0].clientY; this.dragStartOffset = this.config.dataOffset; this.dragStartPriceOffset = this.config.priceOffset; this.priceCanvas.classList.add('dragging'); e.preventDefault() } } }); this.priceCanvas.addEventListener('contextmenu', (e) => { if (this.lineDrawingMode && this.drawingLine) { this.drawingLine = !1; this.currentLine = null; this.deactivateLineDrawingMode(); this.drawCharts(); e.preventDefault(); return } if (this._longPressMenuAt && Date.now() - this._longPressMenuAt < 1000) { e.preventDefault(); return } const rect = this.priceCanvas.getBoundingClientRect(); if (this.openCandleContextMenu(e.clientX - rect.left, e.clientY - rect.top)) e.preventDefault() }); this.setupLongPressMenu(); this.priceCanvas.addEventListener('mousemove', (e) => {
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
    resizeCanvases() {
        const dpr = window.devicePixelRatio || 1;
        if (this.chartContainer.classList.contains('fullscreen')) {
            this.priceCanvas.style.height = 'calc(100vh - 10px)';
            this.priceCanvas.style.width = '100%';
            setTimeout(() => {
                const rect = this.priceCanvas.getBoundingClientRect();
                this._cssWidth = rect.width;
                this._cssHeight = rect.height;
                this._dpr = dpr;
                this.priceCanvas.width = Math.floor(rect.width * dpr);
                this.priceCanvas.height = Math.floor(rect.height * dpr);
                this.drawCharts();
            }, 50);
        } else {
            this.priceCanvas.style.height = '100%';
            this.priceCanvas.style.width = '100%';
            const rect = this.priceCanvas.getBoundingClientRect();
            this._cssWidth = rect.width;
            this._cssHeight = rect.height;
            this._dpr = dpr;
            this.priceCanvas.width = Math.floor(rect.width * dpr);
            this.priceCanvas.height = Math.floor(rect.height * dpr);
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
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        this.drawPriceChart();
        if (this.pixelOffset !== 0) { ctx.save(); ctx.translate(this.pixelOffset, 0); }
        this.updateLinePositions();
        this.drawLines(ctx);
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
            const y = this.priceToYInRegion(price, min, max, priceChartH, chartTop);
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
                const x = chartLeft + idx * (cW + this.config.spacing) + cW * 0.5;
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
                ctx.fillRect(col, bottomY - barHeight, 1, barHeight);
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
            ctx.fillRect(x, bottomY - barHeight, cW, barHeight);
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
                const x = leftX + idx * (cW + this.config.spacing) + cW * 0.5;
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator line at top
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX - this.pixelOffset, topY);
        ctx.lineTo(rightX - this.pixelOffset, topY);
        ctx.stroke();

        // RSI reference levels
        const valueToY = (val) => topY + ((100 - val) / 100) * height;
        const levels = [80, 70, 50, 30, 20];

        // Draw horizontal reference lines (subtle, like TradingView)
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;

        levels.forEach(level => {
            const y = valueToY(level);
            ctx.beginPath();
            ctx.moveTo(leftX - this.pixelOffset, y);
            ctx.lineTo(rightX - this.pixelOffset, y);
            ctx.stroke();
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
                const x = leftX + idx * (cW + this.config.spacing) + cW * 0.5;
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator line at top
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX - this.pixelOffset, topY);
        ctx.lineTo(rightX - this.pixelOffset, topY);
        ctx.stroke();

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
        ctx.beginPath();
        ctx.moveTo(leftX - this.pixelOffset, zeroY);
        ctx.lineTo(rightX - this.pixelOffset, zeroY);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

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
                    ctx.fillRect(x, barY, barWidth, barHeight);
                } else {
                    ctx.fillRect(x, zeroY, barWidth, barHeight);
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
                const x = leftX + idx * (cW + this.config.spacing) + cW * 0.5;
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator line at top
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX - this.pixelOffset, topY);
        ctx.lineTo(rightX - this.pixelOffset, topY);
        ctx.stroke();

        // Stochastic range is 0-100
        const valueToY = (val) => topY + ((100 - val) / 100) * height;
        const levels = [80, 50, 20];

        // Draw horizontal reference lines (subtle, like TradingView)
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;

        levels.forEach(level => {
            const y = valueToY(level);
            ctx.beginPath();
            ctx.moveTo(leftX - this.pixelOffset, y);
            ctx.lineTo(rightX - this.pixelOffset, y);
            ctx.stroke();
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
                const x = leftX + idx * (cW + this.config.spacing) + cW * 0.5;
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.stroke();
            }
        }

        // Panel separator line at top
        ctx.strokeStyle = this.config.darkMode ? '#000000' : '#999999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftX - this.pixelOffset, topY);
        ctx.lineTo(rightX - this.pixelOffset, topY);
        ctx.stroke();

        // Horizontal reference lines
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        levels.forEach(level => {
            if (level >= scaleMin && level <= scaleMax) {
                const y = valueToY(level);
                ctx.beginPath();
                ctx.moveTo(leftX - this.pixelOffset, y);
                ctx.lineTo(rightX - this.pixelOffset, y);
                ctx.stroke();
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
                const x = leftX + idx * (cW + this.config.spacing) + cW * 0.5;
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

        // Horizontal reference lines
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        levels.forEach(level => {
            const y = valueToY(level);
            ctx.beginPath();
            ctx.moveTo(leftX - this.pixelOffset, y);
            ctx.lineTo(rightX - this.pixelOffset, y);
            ctx.stroke();
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
                const x = leftX + idx * (cW + this.config.spacing) + cW * 0.5;
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

        // Horizontal reference lines
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        levels.forEach(level => {
            const y = valueToY(level);
            ctx.beginPath();
            ctx.moveTo(leftX - this.pixelOffset, y);
            ctx.lineTo(rightX - this.pixelOffset, y);
            ctx.stroke();
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
                const x = leftX + idx * (cW + this.config.spacing) + cW * 0.5;
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
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftX - this.pixelOffset, zeroY);
        ctx.lineTo(rightX - this.pixelOffset, zeroY);
        ctx.stroke();

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
                    ctx.fillRect(x, zeroY - barHeight, barWidth, barHeight);
                } else {
                    ctx.fillRect(x, zeroY, barWidth, barHeight);
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
                const x = leftX + idx * (cW + this.config.spacing) + cW * 0.5;
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
        ctx.beginPath();
        ctx.moveTo(g.midX, g.yHigh);
        ctx.lineTo(g.midX, g.top);
        ctx.moveTo(g.midX, g.top + g.bodyH);
        ctx.lineTo(g.midX, g.yLow);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(g.x - pad, g.top - pad, g.cW + pad * 2, g.bodyH + pad * 2);
        ctx.stroke();
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
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.moveTo(g.midX, g.yHigh);
            ctx.lineTo(g.midX, g.top);
            ctx.moveTo(g.midX, g.top + g.bodyH);
            ctx.lineTo(g.midX, g.yLow);
            ctx.stroke();

            if (hollow) {
                // Inset by half a line width so the stroke lands inside the body
                // slot and hollow bodies keep the same footprint as filled ones.
                const lw = Math.max(1, Math.min(2, g.cW * 0.12));
                ctx.strokeStyle = color;
                ctx.lineWidth = lw;
                ctx.strokeRect(g.x + lw / 2, g.top + lw / 2,
                               Math.max(1, g.cW - lw), Math.max(1, g.bodyH - lw));
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(g.x, g.top, g.cW, g.bodyH);
            }
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
            ctx.lineWidth = 1;
            // Half-pixel offset keeps a 1px stroke on the pixel instead of straddling two.
            const x = Math.floor(gX) + 0.5;
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
            const tick = Math.max(2, g.cW * 0.5);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = Math.max(1, Math.min(2, g.cW * 0.18));
            ctx.moveTo(g.midX, g.yHigh);
            ctx.lineTo(g.midX, g.yLow);
            ctx.moveTo(g.midX - tick, g.yOpen);
            ctx.lineTo(g.midX, g.yOpen);
            ctx.moveTo(g.midX, g.yClose);
            ctx.lineTo(g.midX + tick, g.yClose);
            ctx.stroke();
        }
    }

    drawCandles(ctx, min, max, chartW, chartH) { const start = Math.max(0, this.config.dataOffset - 1); const data = this.stockData.slice(start, this.config.dataOffset + this.config.visibleCandles); const firstIndex = start - this.config.dataOffset; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const cW = this.calculateCandleWidth(); data.forEach((candle, index) => { const i = index + firstIndex; const isUp = candle.close >= candle.open; const color = isUp ? this.config.currentBullColor : this.config.currentBearColor; const x = this.config.padding.left + i * (cW + this.config.spacing); const yHigh = this.priceToY(candle.high, min, max, chartH, h); const yLow = this.priceToY(candle.low, min, max, chartH, h); const yOpen = this.priceToY(candle.open, min, max, chartH, h); const yClose = this.priceToY(candle.close, min, max, chartH, h); ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.moveTo(x + cW * 0.5, yHigh); ctx.lineTo(x + cW * 0.5, yLow); ctx.stroke(); ctx.fillStyle = color; const top = Math.min(yOpen, yClose), bot = Math.max(yOpen, yClose); const bodyH = Math.max(1, bot - top); ctx.fillRect(x, top, cW, bodyH) }) }
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
        ctx.shadowBlur = 6;
        // Shape follows the chart type - see traceBarOutline.
        this.traceBarOutline(ctx, this.candleGeometry(dataIndex, min, max, chartH), 0.5);
        ctx.restore();
    }

    drawPriceScale(ctx, min, max, nMin, nMax, spacing) { const w = this.getCanvasWidth(), h = this.getCanvasHeight(); ctx.fillStyle = this.config.currentTextColor; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '12px Arial'; const chartTop = this.config.padding.top; const chartH = this.getPriceChartHeight(); const chartBottom = chartTop + chartH; let lastLabel = null; for (let price = nMin; price <= nMax + 1e-8; price += spacing) { const y = this.priceToY(price, min, max, chartH, h); if (y < chartTop || y > chartBottom) continue; const txt = s8FormatChartPrice(price); if (txt === lastLabel) continue; ctx.fillText(txt, w - this.config.padding.right + 5, y); lastLabel = txt } }
    drawDateLabels(ctx) { const start = Math.max(0, this.config.dataOffset - 1); const data = this.stockData.slice(start, this.config.dataOffset + this.config.visibleCandles); const firstIndex = start - this.config.dataOffset; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const cW = this.calculateCandleWidth(); ctx.fillStyle = this.config.currentTextColor; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = '12px Arial'; /* Every 10th bar is fine at normal zoom but becomes a smear once bars are a couple of pixels wide, so the step grows with density: aim for ~90px between labels, rounded to a multiple of 10 bars to keep the familiar rhythm. */ const labelStep = this.getGridStep(); data.forEach((candle, index) => { const i = index + firstIndex; const globalIdx = i + this.config.dataOffset; if (globalIdx % labelStep === 0) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; ctx.fillText(this.formatTimestamp(candle.t, this.timeframe), x, h - this.config.padding.bottom + 5) } }) }
    drawLastPriceLabel(ctx, min, max) { if (!this.stockData.length) return; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const last = this.stockData[this.stockData.length - 1]; const currentPriceValue = last.close; const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const currentPriceY = this.priceToY(currentPriceValue, min, max, chartH, h); const chartLeft = this.config.padding.left, lineEndX = w - this.config.padding.right; const isUpCandle = last.close >= last.open; const baseColor = isUpCandle ? this.config.currentBullColor : this.config.currentBearColor; ctx.save(); ctx.setLineDash([1, 2]); ctx.strokeStyle = baseColor; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(chartLeft, currentPriceY); ctx.lineTo(lineEndX, currentPriceY); ctx.stroke(); ctx.restore(); const tagExtra = (typeof window.S8_CHART_PRICE_TAG_EXTRA === 'function') ? window.S8_CHART_PRICE_TAG_EXTRA(this) : null; this._s8TagExtra = tagExtra || null; const labelHeight = tagExtra ? 30 : 20, labelPadding = 5, borderRadius = 3; let y = Math.max(this.config.padding.top + labelHeight / 2, Math.min(chartBottom - labelHeight / 2, currentPriceY)); const label = s8FormatChartPrice(currentPriceValue); ctx.font = '12px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; let txtW = ctx.measureText(label).width; if (tagExtra) { ctx.font = '10px Arial'; txtW = Math.max(txtW, ctx.measureText(tagExtra).width); ctx.font = '12px Arial' } const x = w - this.config.padding.right; const rectX = x, rectY = y - labelHeight / 2; const labelWidth = txtW + 2 * labelPadding; ctx.fillStyle = baseColor; ctx.beginPath(); ctx.moveTo(rectX + borderRadius, rectY); ctx.lineTo(rectX + labelWidth - borderRadius, rectY); ctx.arcTo(rectX + labelWidth, rectY, rectX + labelWidth, rectY + borderRadius, borderRadius); ctx.lineTo(rectX + labelWidth, rectY + labelHeight - borderRadius); ctx.arcTo(rectX + labelWidth, rectY + labelHeight, rectX + labelWidth - borderRadius, rectY + labelHeight, borderRadius); ctx.lineTo(rectX + borderRadius, rectY + labelHeight); ctx.arcTo(rectX, rectY + labelHeight, rectX, rectY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rectX, rectY + borderRadius); ctx.arcTo(rectX, rectY, rectX + borderRadius, rectY, borderRadius); ctx.closePath(); ctx.strokeStyle = 'rgba(0,0,0,0.9)'; ctx.lineWidth = 2; ctx.stroke(); ctx.fill(); ctx.fillStyle = '#FFFFFF'; if (tagExtra) { ctx.fillText(label, x + labelPadding, y - 6); ctx.font = '10px Arial'; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillText(tagExtra, x + labelPadding, y + 8) } else ctx.fillText(label, x + labelPadding, y) }
    drawIndicatorPriceLabels(ctx, priceScaleMin, priceScaleMax) { if (!this.stockData || !this.stockData.length) return; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const labelXPosition = w - this.config.padding.right; const labelHeight = 20, labelPadding = 5, labelFontSize = 12, borderRadius = 3; ctx.font = `${labelFontSize}px Arial`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; this.movingAverages.forEach(ma => { if (ma.enabled && ma.data && ma.data.length) { const data = ma.data; const indicatorColor = ma.color; const processValue = (val, bandName = '') => { if (val === null || val === undefined) return; const y = this.priceToY(val, priceScaleMin, priceScaleMax, chartH, h); const clampedY = Math.max(this.config.padding.top + labelHeight / 2, Math.min(y, chartBottom - labelHeight / 2)); const labelText = s8FormatChartPrice(val); const textWidth = ctx.measureText(labelText).width; const labelWidth = textWidth + 2 * labelPadding; const rectX = labelXPosition, rectY = clampedY - labelHeight / 2; ctx.fillStyle = indicatorColor; ctx.beginPath(); ctx.moveTo(rectX + borderRadius, rectY); ctx.lineTo(rectX + labelWidth - borderRadius, rectY); ctx.arcTo(rectX + labelWidth, rectY, rectX + labelWidth, rectY + borderRadius, borderRadius); ctx.lineTo(rectX + labelWidth, rectY + labelHeight - borderRadius); ctx.arcTo(rectX + labelWidth, rectY + labelHeight, rectX + labelWidth - borderRadius, rectY + labelHeight, borderRadius); ctx.lineTo(rectX + borderRadius, rectY + labelHeight); ctx.arcTo(rectX, rectY + labelHeight, rectX, rectY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rectX, rectY + borderRadius); ctx.arcTo(rectX, rectY, rectX + borderRadius, rectY, borderRadius); ctx.closePath(); ctx.save(); ctx.strokeStyle = 'rgba(0,0,0,0.9)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = 'rgba(8,10,14,0.94)'; ctx.fill(); ctx.strokeStyle = indicatorColor; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); ctx.fillStyle = indicatorColor; ctx.fillText(labelText, labelXPosition + labelPadding, clampedY) }; if (data && data.length > 0) { processValue(data[data.length - 1]) } } }); const staticIndicatorsToDraw = [{ key: 'vwap', name: 'VWAP' }, { key: 'bollinger', name: 'BB' }, { key: 'parabolicSAR', name: 'SAR' }]; staticIndicatorsToDraw.forEach(info => { if (this.indicators[info.key] && this.indicators[info.key].enabled) { const indicator = this.indicators[info.key]; const indicatorColor = indicator.color; const data = indicator.data; const processValue = (val, bandName = '') => { if (val === null || val === undefined) return; const y = this.priceToY(val, priceScaleMin, priceScaleMax, chartH, h); const clampedY = Math.max(this.config.padding.top + labelHeight / 2, Math.min(y, chartBottom - labelHeight / 2)); const labelText = s8FormatChartPrice(val); const textWidth = ctx.measureText(labelText).width; const labelWidth = textWidth + 2 * labelPadding; const rectX = labelXPosition, rectY = clampedY - labelHeight / 2; ctx.fillStyle = indicatorColor; ctx.beginPath(); ctx.moveTo(rectX + borderRadius, rectY); ctx.lineTo(rectX + labelWidth - borderRadius, rectY); ctx.arcTo(rectX + labelWidth, rectY, rectX + labelWidth, rectY + borderRadius, borderRadius); ctx.lineTo(rectX + labelWidth, rectY + labelHeight - borderRadius); ctx.arcTo(rectX + labelWidth, rectY + labelHeight, rectX + labelWidth - borderRadius, rectY + labelHeight, borderRadius); ctx.lineTo(rectX + borderRadius, rectY + labelHeight); ctx.arcTo(rectX, rectY + labelHeight, rectX, rectY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rectX, rectY + borderRadius); ctx.arcTo(rectX, rectY, rectX + borderRadius, rectY, borderRadius); ctx.closePath(); ctx.save(); ctx.strokeStyle = 'rgba(0,0,0,0.9)'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = 'rgba(8,10,14,0.94)'; ctx.fill(); ctx.strokeStyle = indicatorColor; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); ctx.fillStyle = indicatorColor; ctx.fillText(labelText, labelXPosition + labelPadding, clampedY) }; if (info.key === 'bollinger' && data && data.upper && data.middle && data.lower) { processValue(data.upper[data.upper.length - 1], 'BB Up'); processValue(data.middle[data.middle.length - 1], 'BB Mid'); processValue(data.lower[data.lower.length - 1], 'BB Low') } else if (data && data.length > 0) { processValue(data[data.length - 1]) } } }) }
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
            const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: priceMin, max: priceMax } = this.applyVerticalScale(rawRange); priceMin += this.config.priceOffset; priceMax += this.config.priceOffset; const candleIndex = this.findCandleIndexByTime(emoticon.timestamp); if (candleIndex === -1) return; const visibleIndex = candleIndex - this.config.dataOffset; if (visibleIndex < 0 || visibleIndex >= this.config.visibleCandles) return; const cW = this.calculateCandleWidth(); const screenX = this.config.padding.left + visibleIndex * (cW + this.config.spacing) + cW / 2; const relY = (emoticon.price - priceMin) / (priceMax - priceMin); const screenY = chartBottom - (relY * chartH); emoticon.screenX = screenX; emoticon.screenY = screenY; if (index === this.selectedEmoticonIndex) { const selectionSize = emoticon.size + 8; ctx.save(); ctx.strokeStyle = this.emoticonMode ? '#00ff00' : '#ffaa00'; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.strokeRect(screenX - selectionSize / 2, screenY - selectionSize / 2, selectionSize, selectionSize); ctx.restore() }
            ctx.font = `${emoticon.size}px Arial`; ctx.fillText(emoticon.emoji, screenX, screenY)
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
        const absMax = Math.max(Math.abs(min), Math.abs(max)); min = -absMax * 1.5; max = absMax * 1.5; const mid = volumeTopY + (volumeHeight / 2); ctx.beginPath(); ctx.moveTo(this.config.padding.left, mid); ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, mid); ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.stroke(); const barWidth = Math.max(1, cW * 0.8), scaleFactor = volumeHeight / (max - min); for (let i = 0; i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < histogram.length && histogram[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + (cW - barWidth) / 2; const value = histogram[dataIndex]; let height = Math.max(1, Math.abs(value) * scaleFactor); ctx.fillStyle = value > 0 ? (this.config.darkMode ? 'rgba(76,175,80,0.7)' : 'rgba(76,175,80,0.5)') : (this.config.darkMode ? 'rgba(244,67,54,0.7)' : 'rgba(244,67,54,0.5)'); ctx.fillRect(x, value > 0 ? mid - height : mid, barWidth, height) } }
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
    updateTimeframeDropdownVisualState() { if (!this.timeframeDropdown) this.timeframeDropdown = this.container.querySelector('.sc-timeframe-dropdown'); if (!this.timeframeDropdown) return; this.timeframeDropdown.querySelectorAll('.sc-timeframe-option').forEach(opt => { opt.classList.remove('selected'); if (opt.getAttribute('data-value') === this.timeframe) opt.classList.add('selected'); }) }
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
