class StockChart {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.getElementById(container) : container; if (!this.container) throw new Error('Container not found'); this.aiPriceLevels = []; this.options = options; this.isDragging = !1; this.scalingActive = !1; this.dragStartX = 0; this.dragStartY = 0; this.dragStartOffset = 0; this.dragStartPriceOffset = 0; this.pixelOffset = 0; this.scalingDragStartY = 0; this.screenSize = this.getScreenSizeCategory(); this.isViewPinnedToRightEdge = !0; this.defaultTimeframes = [{ value: '1min', label: '1 Minute' }, { value: '5min', label: '5 Minutes' }, { value: '15min', label: '15 Minutes' }, { value: '1hour', label: '1 Hour' }, { value: '1day', label: '1 Day' }, { value: '1week', label: '1 Week' }, { value: '1month', label: '1 Month' }]; this.lastMouseX = null; this.lastMouseY = null; this.mouseIsOverChart = !1; this.lineDrawingMode = !1; this.drawingLine = !1; this.currentLine = null; this.lines = []; this.selectedLineIndex = null; this.draggedLine = null; this.snappingPoint = null; this.snappingActive = !1; this.tradeMarkers = []; this.limitOrders = []; this.textMode = !1; this.textAnnotations = []; this.selectedTextIndex = null; this.editingTextIndex = null; this.draggingTextIndex = null; this.textDragStartX = 0; this.textDragStartY = 0; this.textClickTimer = null; this.textDragStarted = !1; this.activeTextInput = null; this.textInputReady = !1; this._textInputClickOutside = null; this.emoticonMode = !1; this.emoticons = []; this.selectedEmoticonIndex = null; this.draggingEmoticonIndex = null; this.emoticonDragStartX = 0; this.emoticonDragStartY = 0; this.emoticonDragStarted = !1; this.selectedEmoticonType = '??'; this.textSettings = { fontSize: 12, fontFamily: 'Arial', color: '#ffffff', fontWeight: 'normal' }; this.fibonacciMode = !1; this.drawingFibonacci = !1; this.currentFibonacci = null; this.fibonacciRetracements = []; this.selectedFibonacciIndex = null; this.draggingFibonacciIndex = null; this.fibonacciDragStartX = 0; this.fibonacciDragStartY = 0; this.fibonacciDragStarted = !1; this.fibonacciSnapPoint = null; this.drawingToolsMode = !1; this.selectedDrawingTool = 'line'; this.drawingShapes = []; this.selectedShapeIndex = null; this.drawingArrow = !1; this.currentArrow = null; this.arrows = []; this.selectedArrowIndex = null; this.draggingArrowIndex = null; this.arrowDragStartX = 0; this.arrowDragStartY = 0; this.arrowDragStarted = !1; this.drawingRectangle = !1; this.currentRectangle = null; this.rectangles = []; this.selectedRectangleIndex = null; this.draggingRectangleIndex = null; this.rectangleDragStartX = 0; this.rectangleDragStartY = 0; this.rectangleDragStarted = !1; this.drawingCircle = !1; this.currentCircle = null; this.circles = []; this.selectedCircleIndex = null; this.draggingCircleIndex = null; this.circleDragStartX = 0; this.circleDragStartY = 0; this.circleDragStarted = !1; this.movingAverages = [{ type: 'ema', period: 9, enabled: !0, id: 'ema_9' }, { type: 'ema', period: 20, enabled: !0, id: 'ema_20' }, { type: 'sma', period: 9, enabled: !1, id: 'sma_9' }, { type: 'sma', period: 20, enabled: !1, id: 'sma_20' }]; this.indicators = {
            vwap: { enabled: !1, data: [], color: '#C71585' },
            bollinger: { enabled: !1, data: { upper: [], middle: [], lower: [] }, color: '#1E88E5' },
            rsi: { enabled: !1, data: [], color: '#9B83B8' },
            macd: { enabled: !0, data: { macdLine: [], signalLine: [], histogram: [] }, color: '#00C000' },
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
        this.volumeHeight = 100; this.colorPalette = ['#2196F3', '#E74C3C', '#E69500', '#2157F3', '#9C27B0', '#FF9800', '#4CAF50', '#F44336', '#3F51B5', '#009688', '#FFC107', '#795548', '#607D8B', '#E91E63', '#CDDC39']; this.initializeMovingAverageIndicators(); this.config = { padding: { top: 0, right: 60, bottom: 30, left: 0 }, candleWidth: 10, spacing: 4, visibleCandles: (options.initialVisibleCandles !== undefined && typeof options.initialVisibleCandles === 'number' && options.initialVisibleCandles > 0) ? options.initialVisibleCandles : this.getInitialVisibleCandles(), maxVisibleCandles: this.getMaxVisibleCandles(), dataOffset: 0, chartType: options.chartType || 'line', darkMode: options.darkMode || !1, timeframesToDisplay: options.availableTimeframes || this.defaultTimeframes, bullColor: '#26a69a', bearColor: '#ef5350', gridColor: '#d0d0d0', textColor: '#888', crosshairColor: 'rgba(0,0,0,0.3)', verticalScaleFactor: 1.0, verticalPadding: 0.1, priceOffset: 0, watermark: { enabled: !0, text: options.ticker || 'NVDA', font: this.getFontSize('watermark'), opacity: 0.1 }, branding: { enabled: options.hideBranding !== !0, text: 'simul8or.com', font: this.getFontSize('branding'), opacity: 0.3, url: 'https://simul8or.com' }, darkModeColors: { bullColor: '#089981', bearColor: '#F23645', gridColor: '#444', textColor: '#e0e0e0', crosshairColor: 'rgba(255,255,255,0.4)', }, useAfterHoursStyling: options.useAfterHoursStyling !== undefined ? options.useAfterHoursStyling : !0, targetPixelsPerLabel: 20, }; this.createDOM(); this.chartContainer = this.container.querySelector('.sc-chart-container'); this.chartInfoOverlayEl = this.chartContainer.querySelector('.sc-chart-info-overlay'); const ohlcvValuesDisplay = this.chartInfoOverlayEl.querySelector('.sc-ohlcv-values-display'); if (ohlcvValuesDisplay) { this.openEl = ohlcvValuesDisplay.querySelector('.open-value'); this.highEl = ohlcvValuesDisplay.querySelector('.high-value'); this.lowEl = ohlcvValuesDisplay.querySelector('.low-value'); this.closeEl = ohlcvValuesDisplay.querySelector('.close-value'); this.volEl = ohlcvValuesDisplay.querySelector('.vol-value') }
        this.tickerInfoDisplay = this.chartInfoOverlayEl.querySelector('.sc-ticker-info-display'); if (this.tickerInfoDisplay) { this.tickerSymbolEl = this.tickerInfoDisplay.querySelector('.sc-ticker-symbol'); this.companyNameEl = this.tickerInfoDisplay.querySelector('.sc-company-name'); this.currentPriceEl = this.tickerInfoDisplay.querySelector('.sc-current-price'); this.dayChangeEl = this.tickerInfoDisplay.querySelector('.sc-day-change'); this.dayChangePctEl = this.tickerInfoDisplay.querySelector('.sc-day-change-pct'); }
        this.indicatorValuesDisplay = this.chartInfoOverlayEl.querySelector('.sc-indicator-values-display'); this.atrDisplay = this.chartInfoOverlayEl.querySelector('.sc-atr-display'); if (this.config.darkMode) { this.chartContainer.classList.add('dark-mode') }
        this.updateDarkModeIcon(); this.registerEventListeners(); this.updateConfig(); this.stockData = options.data || []; this.onReachingStartCallback = options.onReachingStart || null; this.isLoadingHistoricalData = false; if (this.options.timeframe) { this.timeframe = this.options.timeframe } else if (this.stockData.length > 0) { this.timeframe = this.detectTimeframe(this.stockData) } else { this.timeframe = "1min" }
        this.config.dataOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.updateOHLCOverlay(); this.resizeCanvases(); this.calculateIndicators(); this.loadSettings(); this.updateTimeframeDropdownVisualState(); this.debouncedResize = this.debounce(() => {
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
        return leftX + 18;
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
                                <button class="d-none sc-overlay-button sc-chart-type-button" title="Toggle chart type">
                                  <svg viewBox="0 0 24 24">
                                    <path d="M3,14 L8,8 L14,16 L21,6" stroke="currentColor" stroke-width="2" fill="none"/>
                                  </svg>
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
                                <button class="sc-overlay-button sc-fibonacci-tool-button" title="Fibonacci retracement">

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
                                <button class="sc-overlay-button sc-drawing-tools-button" title="Drawing tools">


    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
     xmlns="http://www.w3.org/2000/svg">
  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
        stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
  <path d="M20.71 7.04a1 1 0 0 0 0-1.42l-2.34-2.34a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
        stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
</svg>



                                </button>
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
                                <button class="sc-overlay-button sc-indicators-button" title="Technical Indicators">
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
                                <button class="sc-overlay-button sc-fit-view-button" title="Fit to View">
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
                            <div class="sc-chart-info-overlay" style="position: absolute; top: 50px; left: 10px; display: flex; flex-direction: column; z-index: 5;">
                                <div class="sc-ticker-info-display" style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; font-family: 'Open Sans', Arial, sans-serif;">
                                    <span class="sc-ticker-symbol" style="font-weight: 700; font-size: 15px; color: #e0e0e0;"></span>
                                    <span class="sc-company-name" style="font-size: 12px; color: #888; font-weight: 400;"></span>
                                    <span class="sc-current-price" style="font-weight: 600; font-size: 14px; color: #e0e0e0;"></span>
                                    <span class="sc-day-change" style="font-size: 12px; font-weight: 500;"></span>
                                    <span class="sc-day-change-pct" style="font-size: 12px; font-weight: 500;"></span>
                                </div>
                                <div class="sc-ohlcv-values-display" style="display: flex; flex-wrap: wrap; align-items: center; font-size: 12px; margin-bottom: 5px;">
                                  <span class="label-open" style="margin-right: 10px;">O: <span class="open-value"></span></span>
                                  <span class="label-high" style="margin-right: 10px;">H: <span class="high-value"></span></span>
                                  <span class="label-low" style="margin-right: 10px;">L: <span class="low-value"></span></span>
                                  <span class="label-close" style="margin-right: 10px;">C: <span class="close-value"></span></span>
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
                                      <button class="sc-add-ma-button">Add</button>
                                    </div>
                                  </div>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="vwap" />
                                    <span class="sc-indicator-dot" style="background-color: #C71585;"></span>
                                    <span class="sc-indicator-name">VWAP</span>
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
                                <div class="sc-indicator-group">
                                  <div class="sc-indicator-group-title">Patterns</div>
                                  <label class="sc-indicator-toggle">
                                    <input type="checkbox" value="patterns" />
                                    <span class="sc-indicator-dot" style="background-color: #26a69a;"></span>
                                    <span class="sc-indicator-name">Candlestick Patterns</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="sc-timeframe-dropdown">
                                <div class="d-none sc-dropdown-header">Select Timeframe</div>
                                <div class="sc-dropdown-content">
                                    ${(this.config.timeframesToDisplay || this.defaultTimeframes).map(tf => `<div class="sc-timeframe-option" data-value="${tf.value}">${tf.label}</div>`).join('')}
                                </div>
                            </div>
                          </div>
                        </div>`; if (this.config.branding.enabled && this.config.branding.text) { const brandingLink = document.createElement('a'); brandingLink.className = 'sc-branding-link'; brandingLink.href = this.config.branding.url || '#'; brandingLink.target = '_blank'; brandingLink.rel = 'noopener'; brandingLink.textContent = this.config.branding.text; const priceChartContainer = this.container.querySelector('.sc-price-chart-container'); if (priceChartContainer) priceChartContainer.appendChild(brandingLink) } this.chartContainer = this.container.querySelector('.sc-chart-container'); this.priceCanvas = this.container.querySelector('.sc-price-chart'); this.priceCtx = this.priceCanvas.getContext('2d'); this.verticalScaleArea = this.container.querySelector('.sc-vertical-scale-area'); this.chartTypeButton = this.container.querySelector('.sc-chart-type-button'); this.darkModeButton = this.container.querySelector('.sc-dark-mode-button'); this.maximizeButton = this.container.querySelector('.sc-maximize-button'); this.lineToolButton = this.container.querySelector('.sc-line-tool-button'); this.textToolButton = this.container.querySelector('.sc-text-tool-button'); this.textSettingsPanel = this.container.querySelector('.sc-text-settings-panel'); this.fontSizeSlider = this.container.querySelector('.sc-font-size-slider'); this.fontSizeDisplay = this.container.querySelector('.sc-font-size-display'); this.fontFamilySelect = this.container.querySelector('.sc-font-family-select'); this.textColorPicker = this.container.querySelector('.sc-text-color-picker'); this.textBoldButton = this.container.querySelector('.sc-text-bold-button'); this.textApplyButton = this.container.querySelector('.sc-text-apply-button'); this.emoticonToolButton = this.container.querySelector('.sc-emoticon-tool-button'); this.emoticonPanel = this.container.querySelector('.sc-emoticon-panel'); this.emoticonSizeSlider = this.container.querySelector('.sc-emoticon-size-slider'); this.emoticonSizeDisplay = this.container.querySelector('.sc-emoticon-size-display'); this.fibonacciToolButton = this.container.querySelector('.sc-fibonacci-tool-button'); this.drawingToolsButton = this.container.querySelector('.sc-drawing-tools-button'); this.drawingToolsPanel = this.container.querySelector('.sc-drawing-tools-panel'); this.indicatorsDropdown = this.container.querySelector('.sc-indicators-dropdown'); this.indicatorsButton = this.container.querySelector('.sc-indicators-button'); this.fitViewButton = this.container.querySelector('.sc-fit-view-button'); this.cameraButton = this.container.querySelector('.sc-camera-button'); this.populateMovingAveragesUI(); this.setupMovingAverageEventHandlers()
    }
    populateMovingAveragesUI() { const movingAveragesList = this.container.querySelector('.sc-moving-averages-list'); if (!movingAveragesList) return; movingAveragesList.innerHTML = ''; this.movingAverages.forEach(ma => { const toggle = this.createMovingAverageToggle(ma); movingAveragesList.appendChild(toggle) }) }
    createMovingAverageToggle(ma) {
        const label = document.createElement('label'); label.className = 'sc-indicator-toggle'; label.innerHTML = `
            <input type="checkbox" value="${ma.id}" ${ma.enabled ? 'checked' : ''} />
            <span class="sc-indicator-dot" style="background-color: ${ma.color};"></span>
            <span class="sc-indicator-name">${ma.type.toUpperCase()} ${ma.period}</span>
            <button class="sc-remove-ma-button" data-ma-id="${ma.id}">×</button>
        `; return label
    }
    setupMovingAverageEventHandlers() {
        const addButton = this.container.querySelector('.sc-add-ma-button'); const typeSelect = this.container.querySelector('.sc-ma-type-select'); const periodInput = this.container.querySelector('.sc-ma-period-input'); if (addButton && typeSelect && periodInput) { addButton.addEventListener('click', () => { const type = typeSelect.value; const period = parseInt(periodInput.value); if (period && period > 0 && period <= 200) { if (this.addMovingAverage(type, period)) { periodInput.value = ''; this.populateMovingAveragesUI(); this.setupMovingAverageToggleHandlers(); this.drawCharts() } else { alert(`${type.toUpperCase()} ${period} already exists`) } } else { alert('Please enter a valid period (1-200)') } }); periodInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { addButton.click() } }) }
        this.setupMovingAverageToggleHandlers()
    }
    setupMovingAverageToggleHandlers() { const movingAveragesList = this.container.querySelector('.sc-moving-averages-list'); if (!movingAveragesList) return; const toggles = movingAveragesList.querySelectorAll('input[type="checkbox"]'); toggles.forEach(toggle => { toggle.addEventListener('change', (e) => { const maId = e.target.value; const ma = this.movingAverages.find(m => m.id === maId); if (ma) { ma.enabled = e.target.checked; this.calculateIndicators(); this.drawCharts(); this.saveSettings() } }) }); const removeButtons = movingAveragesList.querySelectorAll('.sc-remove-ma-button'); removeButtons.forEach(button => { button.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); const maId = button.getAttribute('data-ma-id'); if (this.removeMovingAverage(maId)) { this.populateMovingAveragesUI(); this.setupMovingAverageToggleHandlers(); this.drawCharts() } }) }) }
    registerEventListeners() {
        this.timeframeButton = this.container.querySelector('.sc-timeframe-button'); this.timeframeDropdown = this.container.querySelector('.sc-timeframe-dropdown'); this.timeframeButton.addEventListener('click', (e) => { this.indicatorsDropdown.classList.remove('active'); this.indicatorsButton.classList.remove('active'); this.timeframeDropdown.classList.toggle('active'); this.timeframeButton.classList.toggle('active'); e.stopPropagation() }); const timeframeOptions = this.timeframeDropdown.querySelectorAll('.sc-timeframe-option'); this.updateTimeframeDropdownVisualState(); timeframeOptions.forEach(option => { option.addEventListener('click', (e) => { this.changeTimeframe(option.getAttribute('data-value')); this.timeframeDropdown.classList.remove('active'); this.timeframeButton.classList.remove('active'); e.stopPropagation(); this.saveSettings() }) }); document.addEventListener('click', (e) => {
            if (!this.timeframeDropdown.contains(e.target) && !this.timeframeButton.contains(e.target)) { this.timeframeDropdown.classList.remove('active'); this.timeframeButton.classList.remove('active') }
            if (!this.indicatorsDropdown.contains(e.target) && !this.indicatorsButton.contains(e.target)) { this.indicatorsDropdown.classList.remove('active'); this.indicatorsButton.classList.remove('active') }
            if (!this.activeTextInput && !this.textSettingsPanel.contains(e.target) && !this.textToolButton.contains(e.target) && !this.priceCanvas.contains(e.target)) { if (this.textMode && this.textSettingsPanel.style.display === 'block') { this.deactivateTextMode() } }
            if (!this.emoticonPanel.contains(e.target) && !this.emoticonToolButton.contains(e.target) && !this.priceCanvas.contains(e.target)) { if (this.emoticonMode && this.emoticonPanel.style.display === 'block') { this.deactivateEmoticonMode() } }
            if (!this.drawingToolsPanel.contains(e.target) && !this.drawingToolsButton.contains(e.target) && !this.priceCanvas.contains(e.target)) { if (this.drawingToolsMode && this.drawingToolsPanel.style.display === 'block') { this.deactivateDrawingToolsMode() } }
        }); const staticIndicatorToggles = this.indicatorsDropdown.querySelectorAll('input[type="checkbox"]:not([value^="ema_"]):not([value^="sma_"])'); staticIndicatorToggles.forEach(toggle => { toggle.addEventListener('change', (e) => { const indicatorType = e.target.value; if (this.indicators[indicatorType]) { this.indicators[indicatorType].enabled = e.target.checked; this.calculateIndicators(); this.drawCharts(); this.saveSettings() } }) }); this.lineToolButton.addEventListener('click', () => { if (this.lineDrawingMode) this.deactivateLineDrawingMode(); else this.activateLineDrawingMode() }); this.textToolButton.addEventListener('click', () => { if (this.textMode) this.deactivateTextMode(); else this.activateTextMode() }); this.fontSizeSlider.addEventListener('input', (e) => { this.textSettings.fontSize = parseInt(e.target.value); this.fontSizeDisplay.textContent = `${e.target.value}px` }); this.fontFamilySelect.addEventListener('change', (e) => { this.textSettings.fontFamily = e.target.value }); this.textColorPicker.addEventListener('change', (e) => { this.textSettings.color = e.target.value }); this.textBoldButton.addEventListener('click', () => { this.textSettings.fontWeight = this.textSettings.fontWeight === 'bold' ? 'normal' : 'bold'; this.textBoldButton.classList.toggle('active') }); this.textApplyButton.addEventListener('click', () => { this.applyTextSettingsToSelected() }); this.emoticonToolButton.addEventListener('click', () => { if (this.emoticonMode) this.deactivateEmoticonMode(); else this.activateEmoticonMode() }); this.fibonacciToolButton.addEventListener('click', () => { if (this.fibonacciMode) this.deactivateFibonacciMode(); else this.activateFibonacciMode() }); this.drawingToolsButton.addEventListener('click', () => { if (this.drawingToolsMode) this.deactivateDrawingToolsMode(); else this.activateDrawingToolsMode() }); const drawingToolOptions = this.container.querySelectorAll('.sc-drawing-tool-option'); drawingToolOptions.forEach(option => { option.addEventListener('click', () => { const tool = option.dataset.tool; this.selectDrawingTool(tool) }) }); const emoticonOptions = this.container.querySelectorAll('.sc-emoticon-option'); emoticonOptions.forEach(option => { option.addEventListener('click', () => { emoticonOptions.forEach(opt => opt.classList.remove('selected')); option.classList.add('selected'); this.selectedEmoticonType = option.dataset.emoticon }) }); this.emoticonSizeSlider.addEventListener('input', (e) => { this.emoticonSizeDisplay.textContent = `${e.target.value}px` }); this.indicatorsButton.addEventListener('click', (e) => { this.timeframeDropdown.classList.remove('active'); this.timeframeButton.classList.remove('active'); this.indicatorsDropdown.classList.toggle('active'); this.indicatorsButton.classList.toggle('active'); e.stopPropagation() }); this.indicatorsDropdown.addEventListener('click', (e) => e.stopPropagation()); this.darkModeButton.addEventListener('click', () => { this.chartContainer.classList.toggle('dark-mode'); this.config.darkMode = this.chartContainer.classList.contains('dark-mode'); this.updateDarkModeIcon(); this.updateConfig(); this.drawCharts() }); this.chartTypeButton.addEventListener('click', () => {
            if (this.config.chartType === 'candlestick') { this.config.chartType = 'line'; this.chartTypeButton.innerHTML = `<svg viewBox="0 0 24 24"><line x1="7" y1="2" x2="7" y2="6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="4" y="6" width="6" height="10" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="7" y1="16" x2="7" y2="20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="17" y1="4" x2="17" y2="8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="14" y="8" width="6" height="10" rx="0.5" fill="currentColor" stroke="currentColor" stroke-width="1.8"/><line x1="17" y1="18" x2="17" y2="22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` } else { this.config.chartType = 'candlestick'; this.chartTypeButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3,14 L8,8 L14,16 L21,6" stroke="currentColor" stroke-width="2" fill="none"/></svg>` }
            this.drawCharts()
        }); this.maximizeButton.addEventListener('click', () => {
            const isFull = this.chartContainer.classList.contains('fullscreen'); this.chartContainer.classList.toggle('fullscreen'); document.body.style.overflow = !isFull ? 'hidden' : ''; this.config.maxVisibleCandles = !isFull ? 200 : this.getMaxVisibleCandles(); if (isFull && this.config.visibleCandles > this.config.maxVisibleCandles) { const rightEdge = this.config.dataOffset + this.config.visibleCandles; this.config.visibleCandles = this.config.maxVisibleCandles; this.config.dataOffset = Math.max(0, rightEdge - this.config.visibleCandles) }
            this.resizeCanvases()
        }); document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete') { if (this.selectedLineIndex !== null) { this.deleteSelectedLine(); e.preventDefault() } else if (this.selectedTextIndex !== null) { this.deleteSelectedText(); e.preventDefault() } else if (this.selectedEmoticonIndex !== null) { this.deleteSelectedEmoticon(); e.preventDefault() } else if (this.selectedFibonacciIndex !== null) { this.deleteSelectedFibonacci(); e.preventDefault() } else if (this.selectedArrowIndex !== null) { this.deleteSelectedArrowUniversal(); e.preventDefault() } else if (this.selectedRectangleIndex !== null) { this.deleteSelectedRectangleUniversal(); e.preventDefault() } else if (this.selectedCircleIndex !== null) { this.deleteSelectedCircleUniversal(); e.preventDefault() } else if (this.selectedShapeIndex !== null && this.selectedDrawingTool === 'arrow') { this.deleteSelectedArrow(); e.preventDefault() } else if (this.selectedShapeIndex !== null && this.selectedDrawingTool === 'rectangle') { this.deleteSelectedRectangle(); e.preventDefault() } else if (this.selectedShapeIndex !== null && this.selectedDrawingTool === 'circle') { this.deleteSelectedCircle(); e.preventDefault() } }
            if (e.key === 'Escape') {
                if (this.lineDrawingMode) { this.deactivateLineDrawingMode() } else if (this.textMode) { this.deactivateTextMode() } else if (this.emoticonMode) { this.deactivateEmoticonMode() } else if (this.fibonacciMode) { this.deactivateFibonacciMode() } else if (this.drawingToolsMode) { this.deactivateDrawingToolsMode() } else if (this.draggedLine) { this.lines[this.draggedLine.index] = JSON.parse(JSON.stringify(this.draggedLine.originalLine)); this.draggedLine = null; this.drawCharts() } else if (this.chartContainer.classList.contains('fullscreen')) {
                    this.chartContainer.classList.remove('fullscreen'); document.body.style.overflow = ''; this.config.maxVisibleCandles = this.getMaxVisibleCandles(); if (this.config.visibleCandles > this.config.maxVisibleCandles) { const rightEdge = this.config.dataOffset + this.config.visibleCandles; this.config.visibleCandles = this.config.maxVisibleCandles; this.config.dataOffset = Math.max(0, rightEdge - this.config.visibleCandles) }
                    this.resizeCanvases()
                }
                e.preventDefault()
            }
        }); this.priceCanvas.addEventListener('dblclick', (e) => { if (this.lineDrawingMode) { this.deactivateLineDrawingMode(); e.preventDefault() } }); this.verticalScaleArea.addEventListener('mousedown', (e) => { this.scalingDragStartY = e.clientY; this.scalingActive = !0; e.preventDefault() }); this.verticalScaleArea.addEventListener('touchstart', (e) => { if (e.touches.length === 1) { this.scalingDragStartY = e.touches[0].clientY; this.scalingActive = !0; e.preventDefault() } }); document.addEventListener('mousemove', (e) => { if (this.scalingActive) { const dy = e.clientY - this.scalingDragStartY; this.scalingDragStartY = e.clientY; this.config.verticalScaleFactor *= (1 + (dy < 0 ? Math.abs(dy) : -dy) * 0.01); this.config.verticalScaleFactor = Math.max(0.1, this.config.verticalScaleFactor); this.drawCharts() } }); document.addEventListener('touchmove', (e) => { if (this.scalingActive && e.touches.length === 1) { const dy = e.touches[0].clientY - this.scalingDragStartY; this.scalingDragStartY = e.touches[0].clientY; this.config.verticalScaleFactor *= (1 + (dy < 0 ? Math.abs(dy) : -dy) * 0.01); this.config.verticalScaleFactor = Math.max(0.1, this.config.verticalScaleFactor); this.drawCharts(); e.preventDefault() } }); document.addEventListener('mouseup', () => this.scalingActive = !1); document.addEventListener('touchend', () => this.scalingActive = !1); this.priceCanvas.addEventListener('mousedown', (e) => {
            const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top;
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
            if (this.drawingToolsMode && this.selectedDrawingTool === 'arrow') { this.handleArrowMouseDown(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'rectangle') { this.handleRectangleMouseDown(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'circle') { this.handleCircleMouseDown(x, y, e); e.preventDefault(); return }
            if (this.fibonacciMode) { this.handleFibonacciMouseDown(x, y, e); e.preventDefault(); return }
            if (this.textMode) { const handledTextClick = this.addTextAnnotation(x, y); e.preventDefault(); return }
            if (this.emoticonMode) { this.addEmoticon(x, y); e.preventDefault(); return }
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
        }); this.priceCanvas.addEventListener('touchstart', (e) => { if (e.touches.length === 1) { const rect = this.priceCanvas.getBoundingClientRect(); const x = e.touches[0].clientX - rect.left; if (x < this.getCanvasWidth() - this.config.padding.right) { this.isDragging = !0; this.dragStartX = e.touches[0].clientX; this.dragStartY = e.touches[0].clientY; this.dragStartOffset = this.config.dataOffset; this.dragStartPriceOffset = this.config.priceOffset; this.priceCanvas.classList.add('dragging'); e.preventDefault() } } }); this.priceCanvas.addEventListener('contextmenu', (e) => { if (this.lineDrawingMode && this.drawingLine) { this.drawingLine = !1; this.currentLine = null; this.deactivateLineDrawingMode(); this.drawCharts(); e.preventDefault() } }); this.priceCanvas.addEventListener('mouseleave', () => { this.lastMouseX = null; this.lastMouseY = null; this.mouseIsOverChart = !1; if (!this.panelResizing) this.drawCharts() }); document.addEventListener('mousemove', (e) => {
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
            if (this.isDragging) {
                const distX = e.clientX - this.dragStartX; const pxPerCandle = this.calculateCandleWidth() + this.config.spacing; const totalShift = distX / pxPerCandle; const wholeCandleShift = Math.floor(totalShift); let newOffset = this.dragStartOffset - wholeCandleShift; newOffset = Math.max(0, newOffset); if (this.stockData.length > 0) { newOffset = Math.min(newOffset, this.stockData.length - 1) } else { newOffset = 0 }
                this.config.dataOffset = newOffset; if (newOffset === 0 && !this.isLoadingHistoricalData && this.onReachingStartCallback) { this.isLoadingHistoricalData = true; this.onReachingStartCallback(); } this.pixelOffset = (totalShift - wholeCandleShift) * pxPerCandle; if (this.stockData.length === 0) { this.isViewPinnedToRightEdge = !0 } else { const fullyScrolledRightOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.isViewPinnedToRightEdge = (this.config.dataOffset === fullyScrolledRightOffset) }
                const distY = e.clientY - this.dragStartY; const drawingH = this.getPriceChartHeight(); const raw = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); const expanded = this.applyVerticalScale(raw); const rng = expanded.max - expanded.min; const pricePerPixel = rng / drawingH; const dPrice = distY * pricePerPixel; this.config.priceOffset = this.dragStartPriceOffset + dPrice; this.drawCharts(); e.preventDefault()
            }
            if (this.draggingTextIndex !== null) { this.handleTextDrag(e) }
            if (this.draggingEmoticonIndex !== null) { this.handleEmoticonDrag(e) }
            if (this.draggingArrowIndex !== null) { this.handleArrowDrag(e) }
            if (this.draggingRectangleIndex !== null) { this.handleRectangleDrag(e) }
            if (this.draggingCircleIndex !== null) { this.handleCircleDrag(e) }
        }); document.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1) {
                const distX = e.touches[0].clientX - this.dragStartX; const pxPerCandle = this.calculateCandleWidth() + this.config.spacing; const totalShift = distX / pxPerCandle; const wholeCandleShift = Math.floor(totalShift); let newOffset = this.dragStartOffset - wholeCandleShift; newOffset = Math.max(0, newOffset); if (this.stockData.length > 0) { newOffset = Math.min(newOffset, this.stockData.length - 1) } else { newOffset = 0 }
                this.config.dataOffset = newOffset; if (newOffset === 0 && !this.isLoadingHistoricalData && this.onReachingStartCallback) { this.isLoadingHistoricalData = true; this.onReachingStartCallback(); } this.pixelOffset = (totalShift - wholeCandleShift) * pxPerCandle; if (this.stockData.length === 0) { this.isViewPinnedToRightEdge = !0 } else { const fullyScrolledRightOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.isViewPinnedToRightEdge = (this.config.dataOffset === fullyScrolledRightOffset) }
                const distY = e.touches[0].clientY - this.dragStartY; const drawH = this.getPriceChartHeight(); const raw = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); const exp = this.applyVerticalScale(raw); const rng = exp.max - exp.min; const pp = rng / drawH; const dPrice = distY * pp; this.config.priceOffset = this.dragStartPriceOffset + dPrice; this.drawCharts(); e.preventDefault()
            }
        }); document.addEventListener('mouseup', () => {
            if (this.panelResizing) { this.panelResizing = false; this.panelResizeKey = null; this.panelResizeAboveKey = null; this.priceCanvas.style.cursor = 'default'; this.drawCharts(); return }
            if (this.drawingArrow) this.endDrawingArrow(); if (this.drawingRectangle) this.endDrawingRectangle(); if (this.drawingCircle) this.endDrawingCircle(); if (this.drawingFibonacci) this.endDrawingFibonacci(); if (this.draggedLine) this.endDraggingLine(); if (this.isDragging) { this.isDragging = !1; this.pixelOffset = 0; this.priceCanvas.classList.remove('dragging'); this.drawCharts() }
            if (this.draggingTextIndex !== null) { this.endTextDrag() }
            if (this.draggingEmoticonIndex !== null) { this.endEmoticonDrag() }
            if (this.draggingArrowIndex !== null) { this.endArrowDrag() }
            if (this.draggingRectangleIndex !== null) { this.endRectangleDrag() }
            if (this.draggingCircleIndex !== null) { this.endCircleDrag() }
        }); document.addEventListener('touchend', () => { if (this.isDragging) { this.isDragging = !1; this.pixelOffset = 0; this.priceCanvas.classList.remove('dragging'); this.drawCharts() } }); this.priceCanvas.addEventListener('wheel', (e) => {
            const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; if (x >= this.getCanvasWidth() - this.config.padding.right) return; e.preventDefault(); const prevRight = this.config.dataOffset + this.config.visibleCandles; if (e.deltaY < 0) { if (this.config.visibleCandles > 10) this.config.visibleCandles = Math.floor(this.config.visibleCandles * 0.9); } else { let newVis = Math.min(this.config.maxVisibleCandles, Math.floor(this.config.visibleCandles * 1.1)); if (this.config.visibleCandles <= 10) newVis = 11; if (newVis <= this.config.maxVisibleCandles) this.config.visibleCandles = newVis }
            this.config.dataOffset = Math.max(0, prevRight - this.config.visibleCandles); if (this.stockData.length === 0) { this.isViewPinnedToRightEdge = !0 } else { const fullyScrolledRightOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.isViewPinnedToRightEdge = (this.config.dataOffset === fullyScrolledRightOffset) }
            this.drawCharts()
        }); let initialPinch = 0, initialCandleCount = 0; this.priceCanvas.addEventListener('touchstart', (e) => { if (e.touches.length === 2) { initialPinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); initialCandleCount = this.config.visibleCandles; e.preventDefault() } }); this.priceCanvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialPinch > 0) {
                const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); const factor = initialPinch / dist; const prevRight = this.config.dataOffset + this.config.visibleCandles; let newVis = Math.max(10, Math.min(this.config.maxVisibleCandles, Math.round(initialCandleCount * factor))); if (newVis !== this.config.visibleCandles) {
                    this.config.visibleCandles = newVis; this.config.dataOffset = Math.max(0, prevRight - this.config.visibleCandles); if (this.stockData.length === 0) { this.isViewPinnedToRightEdge = !0 } else { const fullyScrolledRightOffset = Math.max(0, this.stockData.length - this.config.visibleCandles); this.isViewPinnedToRightEdge = (this.config.dataOffset === fullyScrolledRightOffset) }
                    this.drawCharts()
                }
                e.preventDefault()
            }
        }); this.priceCanvas.addEventListener('touchend', (e) => { if (e.touches.length < 2) initialPinch = 0 }); this.priceCanvas.addEventListener('mousemove', (e) => {
            if (!this.priceCanvas) return; const rect = this.priceCanvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; if (this.lineDrawingMode && this.drawingLine) { this.handleLineDrawingMouseMove(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'arrow' && this.drawingArrow) { this.handleArrowMouseMove(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'rectangle' && this.drawingRectangle) { this.handleRectangleMouseMove(x, y, e); e.preventDefault(); return }
            if (this.drawingToolsMode && this.selectedDrawingTool === 'circle' && this.drawingCircle) { this.handleCircleMouseMove(x, y, e); e.preventDefault(); return }
            if (this.fibonacciMode && this.drawingFibonacci) { this.handleFibonacciMouseMove(x, y, e); e.preventDefault(); return }
            if (this.draggedLine) { this.handleLineDragging(x, y, e); e.preventDefault(); return }
            if (this.isDragging) return; this.lastMouseX = x; this.lastMouseY = y; const chartLeft = this.config.padding.left; const chartRight = this.getCanvasWidth() - this.config.padding.right; const chartTop = this.config.padding.top; const chartBottom = this.config.padding.top + this.getPriceChartHeight(); this.mouseIsOverChart = (x >= chartLeft && x <= chartRight && y >= chartTop && y <= chartBottom); if (!this.textMode && !this.lineDrawingMode && !this.emoticonMode && !this.draggingTextIndex && !this.draggingEmoticonIndex && !this.draggingArrowIndex && !this.draggingRectangleIndex && !this.draggingCircleIndex) { const closeHit = this.findPanelCloseButtonAt(x, y); if (closeHit) { this.priceCanvas.style.cursor = 'pointer' } else { const sepHit = this.findPanelSeparatorAtY(y); if (sepHit) { this.priceCanvas.style.cursor = 'row-resize' } else { const hoveredTextIndex = this.findClickedText(x, y); const hoveredEmoticonIndex = this.findClickedEmoticon(x, y); const hoveredArrowIndex = this.findClickedArrow(x, y); const hoveredRectangleIndex = this.findClickedRectangle(x, y); const hoveredCircleIndex = this.findClickedCircle(x, y); const hoveredFibonacciIndex = this.findClickedFibonacci(x, y); if (hoveredTextIndex !== -1 || hoveredEmoticonIndex !== -1 || hoveredArrowIndex !== null || hoveredRectangleIndex !== null || hoveredCircleIndex !== null || hoveredFibonacciIndex !== null) { this.priceCanvas.style.cursor = 'pointer' } else { this.priceCanvas.style.cursor = 'default' } } } }
            this.drawCharts()
        }); if (this.cameraButton) { this.cameraButton.addEventListener('click', () => this.copyChartToClipboard()) }
        if (this.fitViewButton) { this.fitViewButton.addEventListener('click', () => this.refreshChartWithLatestCandle()) }
        this.priceCanvas.addEventListener('touchmove', (e) => { if (this.isDragging || e.touches.length !== 1) return; const rect = this.priceCanvas.getBoundingClientRect(); const x = e.touches[0].clientX - rect.left; const y = e.touches[0].clientY - rect.top; this.drawCharts(); const chartLeft = this.config.padding.left; const chartTop = this.config.padding.top; const chartW = this.getCanvasWidth() - this.config.padding.left - this.config.padding.right; const chartH1 = this.getPriceChartHeight(); const chartBottom1 = chartTop + chartH1; if (x < chartLeft || x > chartLeft + chartW || y < chartTop || y > chartBottom1) return; if (x >= this.getCanvasWidth() - this.config.padding.right) return; if (x < this.config.padding.left) return; const cW = this.calculateCandleWidth(); const candleIndex = Math.floor((x - this.config.padding.left) / (cW + this.config.spacing)); if (candleIndex < 0 || candleIndex >= this.config.visibleCandles) return; const dataIndex = this.config.dataOffset + candleIndex; if (dataIndex < 0 || dataIndex >= this.stockData.length) return; const candle = this.stockData[dataIndex]; this.openEl.textContent = candle.open.toFixed(2); this.highEl.textContent = candle.high.toFixed(2); this.lowEl.textContent = candle.low.toFixed(2); this.closeEl.textContent = candle.close.toFixed(2); this.closeEl.style.color = candle.close >= candle.open ? '#26a69a' : '#ef5350'; const ctx = this.priceCtx; ctx.save(); ctx.strokeStyle = this.config.currentCrosshairColor; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.getCanvasHeight()); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, y); ctx.stroke(); ctx.setLineDash([]); const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const relY = (chartBottom - y) / chartH; const price = min + (max - min) * relY; const isDarkMode = this.chartContainer.classList.contains('dark-mode'); const priceText = price.toFixed(2); ctx.font = '12px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const txtW = ctx.measureText(priceText).width; const labelX = this.getCanvasWidth() - this.config.padding.right; const labelY = y; ctx.fillStyle = isDarkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)'; ctx.fillRect(labelX, labelY - 10, txtW + 10, 20); ctx.strokeStyle = this.config.currentCrosshairColor; ctx.lineWidth = 1; ctx.strokeRect(labelX, labelY - 10, txtW + 10, 20); ctx.fillStyle = this.config.currentTextColor; ctx.fillText(priceText, labelX + 5, labelY); const dateText = this.formatDetailTimestamp(candle.t, this.timeframe); const dateLabelY = chartBottom + 15; const dateW = ctx.measureText(dateText).width; ctx.fillStyle = isDarkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)'; ctx.fillRect(x - (dateW / 2) - 5, dateLabelY - 10, dateW + 10, 20); ctx.strokeRect(x - (dateW / 2) - 5, dateLabelY - 10, dateW + 10, 20); ctx.fillStyle = this.config.currentTextColor; ctx.fillText(dateText, x, dateLabelY); ctx.restore() })
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
    updateConfig() { const d = this.config.darkMode; this.config.currentTextColor = d ? this.config.darkModeColors.textColor : this.config.textColor; this.config.currentGridColor = d ? this.config.darkModeColors.gridColor : this.config.gridColor; this.config.currentCrosshairColor = d ? this.config.darkModeColors.crosshairColor : this.config.crosshairColor; this.config.currentBullColor = d ? this.config.darkModeColors.bullColor : this.config.bullColor; this.config.currentBearColor = d ? this.config.darkModeColors.bearColor : this.config.bearColor; if (this.chartInfoOverlayEl) this.chartInfoOverlayEl.style.color = this.config.currentTextColor }
    updateDarkModeIcon() { this.darkModeButton.innerHTML = this.config.darkMode ? `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9 M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2 M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7 M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17 M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7 M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17 M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" /></svg>` : `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" /></svg>` }
    calculateCandleWidth() { const w = this.getCanvasWidth() - this.config.padding.left - this.config.padding.right; const effectiveCandles = Math.min(this.config.visibleCandles, this.stockData.length || 1); return Math.max(2, (w / effectiveCandles) - this.config.spacing) }
    calculateRawPriceRange(data, off, cnt) {
        const v = data.slice(off, off + cnt);

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
    drawCharts() {
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
        this.drawAIPriceLevels(ctx);
        this.drawLimitOrders(ctx);
        if (this.mouseIsOverChart && this.lastMouseX !== null && this.lastMouseY !== null) {
            this.drawCrosshair(ctx, this.lastMouseX, this.lastMouseY);
        } else {
            this.updateOHLCOverlay();
        }
    }
    drawVolumeBars(ctx, visibleData, volumeHeight) { let maxVolume = 0; visibleData.forEach(candle => maxVolume = Math.max(maxVolume, candle.volume)); const cW = this.calculateCandleWidth(); const volumeBottomY = this.getCanvasHeight() - this.config.padding.bottom; visibleData.forEach((candle, i) => { const x = this.config.padding.left + i * (cW + this.config.spacing); const barHeight = (candle.volume / maxVolume) * volumeHeight; const isUp = candle.close >= candle.open; const baseColorHex = isUp ? this.config.currentBullColor : this.config.currentBearColor; const r = parseInt(baseColorHex.slice(1, 3), 16); const g = parseInt(baseColorHex.slice(3, 5), 16); const b = parseInt(baseColorHex.slice(5, 7), 16); ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`; ctx.fillRect(x, volumeBottomY - barHeight, cW, barHeight) }); if (this.indicators.volumeMA.enabled && this.indicators.volumeMA.data.length) { this.drawVolumeMA(ctx, volumeHeight, maxVolume) } }
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

        const visibleData = this.stockData.slice(this.config.dataOffset, this.config.dataOffset + this.config.visibleCandles);

        const raw = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
        let { min, max } = this.applyVerticalScale(raw);
        min += this.config.priceOffset;
        max += this.config.priceOffset;
        this.config.padding.right = max >= 10000 ? 80 : 60;

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

        // Draw grid lines
        const pxPerLine = this.config.targetPixelsPerLabel;
        let approxLines = Math.max(3, Math.min(Math.floor(priceChartH / pxPerLine), 20));
        const { min: nMin, max: nMax, tickSpacing } = this.calculateNiceScale(min, max, approxLines);
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        let lastGridLabel = null;
        for (let price = nMin; price <= nMax + 1e-8; price += tickSpacing) {
            const txt = price.toFixed(2);
            if (txt === lastGridLabel) continue;
            lastGridLabel = txt;
            const y = this.priceToYInRegion(price, min, max, priceChartH, chartTop);
            ctx.beginPath();
            ctx.moveTo(chartLeft, y);
            ctx.lineTo(chartLeft + chartW, y);
            ctx.stroke();
        }

        // Vertical grid lines
        const cW = this.calculateCandleWidth();
        for (let i = Math.floor(this.config.dataOffset / 10) * 10; i < this.config.dataOffset + this.config.visibleCandles; i += 10) {
            if (i >= this.config.dataOffset && i < this.stockData.length) {
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
        else this.drawCandles(ctx, min, max, chartW, priceChartH);

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
        const cW = this.calculateCandleWidth();
        const bottomY = topY + height;

        visibleData.forEach((candle, i) => {
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
        ctx.lineWidth = 1;
        ctx.beginPath();
        let started = false;

        for (let i = 0; i < this.config.visibleCandles; i++) {
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
        ctx.fillRect(leftX, topY, chartWidth, height);

        // Draw vertical gridlines extending into panel (matching price chart gridlines)
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        for (let i = Math.floor(this.config.dataOffset / 10) * 10; i < this.config.dataOffset + this.config.visibleCandles; i += 10) {
            if (i >= this.config.dataOffset && i < this.stockData.length) {
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
        ctx.moveTo(leftX, topY);
        ctx.lineTo(rightX, topY);
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
            ctx.moveTo(leftX, y);
            ctx.lineTo(rightX, y);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Draw RSI line
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < this.config.visibleCandles; i++) {
            const dataIndex = i + this.config.dataOffset;
            if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                const y = valueToY(data[dataIndex]);
                if (!started) { ctx.moveTo(x, y); started = true; }
                else { ctx.lineTo(x, y); }
            }
        }
        ctx.strokeStyle = this.indicators.rsi.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Close button and panel label (top left)
        const labelStartX = this.drawPanelCloseButton(ctx, topY, 'rsi');
        const labelText = 'RSI(14)';
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
        ctx.fillRect(leftX, topY, chartWidth, height);

        // Draw vertical gridlines extending into panel
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        for (let i = Math.floor(this.config.dataOffset / 10) * 10; i < this.config.dataOffset + this.config.visibleCandles; i += 10) {
            if (i >= this.config.dataOffset && i < this.stockData.length) {
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
        ctx.moveTo(leftX, topY);
        ctx.lineTo(rightX, topY);
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
        ctx.moveTo(leftX, zeroY);
        ctx.lineTo(rightX, zeroY);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw histogram bars
        const barWidth = Math.max(1, cW * 0.8);
        for (let i = 0; i < this.config.visibleCandles; i++) {
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
            for (let i = 0; i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < lineData.length && lineData[dataIndex] !== null) {
                    const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                    const y = valueToY(lineData[dataIndex]);
                    if (!started) { ctx.moveTo(x, y); started = true; }
                    else { ctx.lineTo(x, y); }
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        };

        drawLine(macdLine, '#2196F3', 1.5);    // MACD line - blue
        drawLine(signalLine, '#FF9800', 1.5);  // Signal line - orange

        // Close button and panel label (top left, TradingView style)
        const macdLabelX = this.drawPanelCloseButton(ctx, topY, 'macd');
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#2196F3';
        ctx.fillText('MACD(12,26,9)', macdLabelX, topY + 4);

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

            ctx.fillStyle = '#2196F3';
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
        ctx.fillRect(leftX, topY, chartWidth, height);

        // Draw vertical gridlines extending into panel
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        for (let i = Math.floor(this.config.dataOffset / 10) * 10; i < this.config.dataOffset + this.config.visibleCandles; i += 10) {
            if (i >= this.config.dataOffset && i < this.stockData.length) {
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
        ctx.moveTo(leftX, topY);
        ctx.lineTo(rightX, topY);
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
            ctx.moveTo(leftX, y);
            ctx.lineTo(rightX, y);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Draw %K and %D lines
        const drawLine = (lineData, color, lineWidth) => {
            ctx.beginPath();
            let started = false;
            for (let i = 0; i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < lineData.length && lineData[dataIndex] !== null) {
                    const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                    const y = valueToY(lineData[dataIndex]);
                    if (!started) { ctx.moveTo(x, y); started = true; }
                    else { ctx.lineTo(x, y); }
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
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
        ctx.fillText('Stoch(14,3,3)', stochLabelX, topY + 4);

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
        ctx.fillRect(leftX, topY, chartWidth, height);

        // Vertical gridlines
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        for (let i = Math.floor(this.config.dataOffset / 10) * 10; i < this.config.dataOffset + this.config.visibleCandles; i += 10) {
            if (i >= this.config.dataOffset && i < this.stockData.length) {
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
        ctx.moveTo(leftX, topY);
        ctx.lineTo(rightX, topY);
        ctx.stroke();

        // Horizontal reference lines
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        levels.forEach(level => {
            if (level >= scaleMin && level <= scaleMax) {
                const y = valueToY(level);
                ctx.beginPath();
                ctx.moveTo(leftX, y);
                ctx.lineTo(rightX, y);
                ctx.stroke();
            }
        });
        ctx.setLineDash([]);

        // Draw indicator line
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < this.config.visibleCandles; i++) {
            const dataIndex = i + this.config.dataOffset;
            if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                const y = valueToY(data[dataIndex]);
                if (!started) { ctx.moveTo(x, y); started = true; }
                else { ctx.lineTo(x, y); }
            }
        }
        ctx.strokeStyle = indicator.color;
        ctx.lineWidth = 1.5;
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
        ctx.fillRect(leftX, topY, chartWidth, height);

        // Vertical gridlines
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        for (let i = Math.floor(this.config.dataOffset / 10) * 10; i < this.config.dataOffset + this.config.visibleCandles; i += 10) {
            if (i >= this.config.dataOffset && i < this.stockData.length) {
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
        ctx.moveTo(leftX, topY);
        ctx.lineTo(rightX, topY);
        ctx.stroke();

        // Horizontal reference lines
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        levels.forEach(level => {
            const y = valueToY(level);
            ctx.beginPath();
            ctx.moveTo(leftX, y);
            ctx.lineTo(rightX, y);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Draw lines helper
        const drawLine = (data, color, lineWidth) => {
            ctx.beginPath();
            let started = false;
            for (let i = 0; i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                    const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                    const y = valueToY(data[dataIndex]);
                    if (!started) { ctx.moveTo(x, y); started = true; }
                    else { ctx.lineTo(x, y); }
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
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
        ctx.fillRect(leftX, topY, chartWidth, height);

        // Vertical gridlines
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        for (let i = Math.floor(this.config.dataOffset / 10) * 10; i < this.config.dataOffset + this.config.visibleCandles; i += 10) {
            if (i >= this.config.dataOffset && i < this.stockData.length) {
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
        ctx.moveTo(leftX, topY);
        ctx.lineTo(rightX, topY);
        ctx.stroke();

        // Horizontal reference lines
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        levels.forEach(level => {
            const y = valueToY(level);
            ctx.beginPath();
            ctx.moveTo(leftX, y);
            ctx.lineTo(rightX, y);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Draw K and D lines
        const drawLine = (data, color, lineWidth) => {
            ctx.beginPath();
            let started = false;
            for (let i = 0; i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                    const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                    const y = valueToY(data[dataIndex]);
                    if (!started) { ctx.moveTo(x, y); started = true; }
                    else { ctx.lineTo(x, y); }
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
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
        ctx.fillRect(leftX, topY, chartWidth, height);

        // Vertical gridlines
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        for (let i = Math.floor(this.config.dataOffset / 10) * 10; i < this.config.dataOffset + this.config.visibleCandles; i += 10) {
            if (i >= this.config.dataOffset && i < this.stockData.length) {
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
        ctx.moveTo(leftX, topY);
        ctx.lineTo(rightX, topY);
        ctx.stroke();

        // Zero line
        ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftX, zeroY);
        ctx.lineTo(rightX, zeroY);
        ctx.stroke();

        // Draw histogram bars
        const barWidth = Math.max(1, cW * 0.8);
        for (let i = 0; i < this.config.visibleCandles; i++) {
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
        ctx.fillRect(leftX, topY, chartWidth, height);

        // Vertical gridlines
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        for (let i = Math.floor(this.config.dataOffset / 10) * 10; i < this.config.dataOffset + this.config.visibleCandles; i += 10) {
            if (i >= this.config.dataOffset && i < this.stockData.length) {
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
        ctx.moveTo(leftX, topY);
        ctx.lineTo(rightX, topY);
        ctx.stroke();

        // Zero line
        if (0 >= scaleMin && 0 <= scaleMax) {
            ctx.strokeStyle = this.config.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
            ctx.setLineDash([2, 4]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(leftX, valueToY(0));
            ctx.lineTo(rightX, valueToY(0));
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw lines
        const drawLine = (data, color, lineWidth) => {
            ctx.beginPath();
            let started = false;
            for (let i = 0; i < this.config.visibleCandles; i++) {
                const dataIndex = i + this.config.dataOffset;
                if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) {
                    const x = leftX + i * (cW + this.config.spacing) + cW * 0.5;
                    const y = valueToY(data[dataIndex]);
                    if (!started) { ctx.moveTo(x, y); started = true; }
                    else { ctx.lineTo(x, y); }
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
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
        const visibleData = this.stockData.slice(this.config.dataOffset, this.config.dataOffset + this.config.visibleCandles);
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

        ctx.save();
        ctx.font = '12px Arial';

        // Draw high marker only if it's in the visible price+volume area (above panels)
        if (highestHighCandle) {
            const x = this.config.padding.left + highestHighIndexInVisible * (cW + this.config.spacing) + cW * 0.5;
            const y = this.priceToY(highestHigh, priceScaleMin, priceScaleMax, chartHeight, this.getCanvasHeight());
            // Only draw if Y is within the price chart area (not in indicator panels)
            if (y >= chartTop && y < panelsTopY) {
                ctx.beginPath();
                ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
                ctx.fillStyle = markerColor;
                ctx.fill();
                const isNearRightEdge = (numVisibleCandles - 1 - highestHighIndexInVisible) <= 3;
                const highText = highestHigh.toFixed(2);
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
            const x = this.config.padding.left + lowestLowIndexInVisible * (cW + this.config.spacing) + cW * 0.5;
            const y = this.priceToY(lowestLow, priceScaleMin, priceScaleMax, chartHeight, this.getCanvasHeight());
            // Only draw if Y is within the price chart area (not in indicator panels)
            if (y >= chartTop && y < panelsTopY) {
                ctx.beginPath();
                ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
                ctx.fillStyle = markerColor;
                ctx.fill();
                const isNearRightEdge = (numVisibleCandles - 1 - lowestLowIndexInVisible) <= 3;
                const lowText = lowestLow.toFixed(2);
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
    getTimeframeMinutes(tf) { switch (tf) { case '1min': return 1; case '2min': return 2; case '5min': return 5; case '15min': return 15; case '30min': return 30; case 'hour': case '1hour': case '60min': case '1h': return 60; case '4hour': return 240; case 'day': case '1day': return 1440; case 'week': case '1week': case '1W': return 10080; case 'month': case '1month': case '1M': return 43200; default: return 1 } }
    drawMarketHoursShading(ctx, visibleData) { if (typeof currentTimeframe === 'undefined' || currentTimeframe === null) var currentTimeframe = 1; if (!visibleData.length) return; const candleWidth = this.calculateCandleWidth(), spacing = this.config.spacing, candleFullWidth = candleWidth + spacing; const margins = this.config.padding, h = this.getCanvasHeight(); ctx.fillStyle = this.config.darkMode ? '#111622' : '#f3f3f3'; const timeframeMinutes = this.getTimeframeMinutes(this.timeframe); const shadingHeight = h - margins.top - margins.bottom; let regionStart = null; const flushRegion = (endIndex) => { if (regionStart !== null) { const startX = margins.left + regionStart * candleFullWidth; const endX = margins.left + endIndex * candleFullWidth; ctx.fillRect(Math.round(startX), margins.top, Math.round(endX - startX), shadingHeight); regionStart = null; } }; visibleData.forEach((candle, index) => { if (!candle.date || typeof candle.date !== 'string') return; const timePart = candle.date.split(' ').pop(); const [hours, minutes] = timePart.split(':').map(Number); const candleStartMinutes = hours * 60 + minutes; const candleEndMinutes = candleStartMinutes + currentTimeframe; const isPreMarket = candleEndMinutes <= 570; const isAfterHours = candleStartMinutes >= 960; if (isPreMarket || isAfterHours) { if (regionStart === null) regionStart = index; } else { flushRegion(index); } }); flushRegion(visibleData.length); }
    priceToY(val, pMin, pMax, chartH, canvasHeight) { const range = pMax - pMin; const chartTop = this.config.padding.top; return chartTop + chartH - ((val - pMin) / range) * chartH }
    drawLineChart(ctx, min, max, chartW, chartH) { const data = this.stockData.slice(this.config.dataOffset, this.config.dataOffset + this.config.visibleCandles); const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const cW = this.calculateCandleWidth(); const chartBottom = this.config.padding.top + chartH; ctx.beginPath(); let firstX, firstY, lastX, lastY; data.forEach((candle, i) => { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = this.priceToY(candle.close, min, max, chartH, h); if (i === 0) { ctx.moveTo(x, y); firstX = x; firstY = y } else ctx.lineTo(x, y); if (i === data.length - 1) { lastX = x; lastY = y } }); ctx.save(); const grad = ctx.createLinearGradient(0, this.config.padding.top, 0, chartBottom); grad.addColorStop(0, this.config.darkMode ? 'rgba(52,152,219,0.5)' : 'rgba(52,152,219,0.3)'); grad.addColorStop(1, this.config.darkMode ? 'rgba(52,152,219,0.05)' : 'rgba(52,152,219,0.02)'); ctx.lineTo(lastX, chartBottom); ctx.lineTo(firstX, chartBottom); ctx.closePath(); ctx.fillStyle = grad; ctx.fill(); ctx.restore(); ctx.beginPath(); data.forEach((candle, i) => { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW / 2; const y = this.priceToY(candle.close, min, max, chartH, h); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y) }); ctx.strokeStyle = '#3498db'; ctx.lineWidth = 2.5; ctx.stroke() }
    drawCandles(ctx, min, max, chartW, chartH) { const data = this.stockData.slice(this.config.dataOffset, this.config.dataOffset + this.config.visibleCandles); const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const cW = this.calculateCandleWidth(); data.forEach((candle, i) => { const isUp = candle.close >= candle.open; const color = isUp ? this.config.currentBullColor : this.config.currentBearColor; const x = this.config.padding.left + i * (cW + this.config.spacing); const yHigh = this.priceToY(candle.high, min, max, chartH, h); const yLow = this.priceToY(candle.low, min, max, chartH, h); const yOpen = this.priceToY(candle.open, min, max, chartH, h); const yClose = this.priceToY(candle.close, min, max, chartH, h); ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.moveTo(x + cW * 0.5, yHigh); ctx.lineTo(x + cW * 0.5, yLow); ctx.stroke(); ctx.fillStyle = color; const top = Math.min(yOpen, yClose), bot = Math.max(yOpen, yClose); const bodyH = Math.max(1, bot - top); ctx.fillRect(x, top, cW, bodyH) }) }
    drawPriceScale(ctx, min, max, nMin, nMax, spacing) { const w = this.getCanvasWidth(), h = this.getCanvasHeight(); ctx.fillStyle = this.config.currentTextColor; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '12px Arial'; const chartTop = this.config.padding.top; const chartH = this.getPriceChartHeight(); const chartBottom = chartTop + chartH; let lastLabel = null; for (let price = nMin; price <= nMax + 1e-8; price += spacing) { const y = this.priceToY(price, min, max, chartH, h); if (y < chartTop || y > chartBottom) continue; const txt = price.toFixed(2); if (txt === lastLabel) continue; ctx.fillText(txt, w - this.config.padding.right + 5, y); lastLabel = txt } }
    drawDateLabels(ctx) { const data = this.stockData.slice(this.config.dataOffset, this.config.dataOffset + this.config.visibleCandles); const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const cW = this.calculateCandleWidth(); ctx.fillStyle = this.config.currentTextColor; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = '12px Arial'; data.forEach((candle, i) => { const globalIdx = i + this.config.dataOffset; if (globalIdx % 10 === 0) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; ctx.fillText(this.formatTimestamp(candle.t, this.timeframe), x, h - this.config.padding.bottom + 5) } }) }
    drawLastPriceLabel(ctx, min, max) { if (!this.stockData.length) return; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const last = this.stockData[this.stockData.length - 1]; const currentPriceValue = last.close; const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const currentPriceY = this.priceToY(currentPriceValue, min, max, chartH, h); const chartLeft = this.config.padding.left, lineEndX = w - this.config.padding.right; const isUpCandle = last.close >= last.open; const baseColor = isUpCandle ? this.config.currentBullColor : this.config.currentBearColor; ctx.save(); ctx.setLineDash([1, 2]); ctx.strokeStyle = baseColor; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(chartLeft, currentPriceY); ctx.lineTo(lineEndX, currentPriceY); ctx.stroke(); ctx.restore(); let y = Math.max(this.config.padding.top + 10, Math.min(chartBottom - 10, currentPriceY)); const label = currentPriceValue.toFixed(2); ctx.font = '12px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const txtW = ctx.measureText(label).width; const x = w - this.config.padding.right; const labelHeight = 20, labelPadding = 5, borderRadius = 3; const rectX = x, rectY = y - labelHeight / 2; const labelWidth = txtW + 2 * labelPadding; ctx.fillStyle = baseColor; ctx.beginPath(); ctx.moveTo(rectX + borderRadius, rectY); ctx.lineTo(rectX + labelWidth - borderRadius, rectY); ctx.arcTo(rectX + labelWidth, rectY, rectX + labelWidth, rectY + borderRadius, borderRadius); ctx.lineTo(rectX + labelWidth, rectY + labelHeight - borderRadius); ctx.arcTo(rectX + labelWidth, rectY + labelHeight, rectX + labelWidth - borderRadius, rectY + labelHeight, borderRadius); ctx.lineTo(rectX + borderRadius, rectY + labelHeight); ctx.arcTo(rectX, rectY + labelHeight, rectX, rectY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rectX, rectY + borderRadius); ctx.arcTo(rectX, rectY, rectX + borderRadius, rectY, borderRadius); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.fillText(label, x + labelPadding, y) }
    drawIndicatorPriceLabels(ctx, priceScaleMin, priceScaleMax) { if (!this.stockData || !this.stockData.length) return; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const labelXPosition = w - this.config.padding.right; const labelHeight = 20, labelPadding = 5, labelFontSize = 12, borderRadius = 3; ctx.font = `${labelFontSize}px Arial`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; this.movingAverages.forEach(ma => { if (ma.enabled && ma.data && ma.data.length) { const data = ma.data; const indicatorColor = ma.color; const processValue = (val, bandName = '') => { if (val === null || val === undefined) return; const y = this.priceToY(val, priceScaleMin, priceScaleMax, chartH, h); const clampedY = Math.max(this.config.padding.top + labelHeight / 2, Math.min(y, chartBottom - labelHeight / 2)); const labelText = val.toFixed(2); const textWidth = ctx.measureText(labelText).width; const labelWidth = textWidth + 2 * labelPadding; const rectX = labelXPosition, rectY = clampedY - labelHeight / 2; ctx.fillStyle = indicatorColor; ctx.beginPath(); ctx.moveTo(rectX + borderRadius, rectY); ctx.lineTo(rectX + labelWidth - borderRadius, rectY); ctx.arcTo(rectX + labelWidth, rectY, rectX + labelWidth, rectY + borderRadius, borderRadius); ctx.lineTo(rectX + labelWidth, rectY + labelHeight - borderRadius); ctx.arcTo(rectX + labelWidth, rectY + labelHeight, rectX + labelWidth - borderRadius, rectY + labelHeight, borderRadius); ctx.lineTo(rectX + borderRadius, rectY + labelHeight); ctx.arcTo(rectX, rectY + labelHeight, rectX, rectY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rectX, rectY + borderRadius); ctx.arcTo(rectX, rectY, rectX + borderRadius, rectY, borderRadius); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.fillText(labelText, labelXPosition + labelPadding, clampedY) }; if (data && data.length > 0) { processValue(data[data.length - 1]) } } }); const staticIndicatorsToDraw = [{ key: 'vwap', name: 'VWAP' }, { key: 'bollinger', name: 'BB' }, { key: 'parabolicSAR', name: 'SAR' }]; staticIndicatorsToDraw.forEach(info => { if (this.indicators[info.key] && this.indicators[info.key].enabled) { const indicator = this.indicators[info.key]; const indicatorColor = indicator.color; const data = indicator.data; const processValue = (val, bandName = '') => { if (val === null || val === undefined) return; const y = this.priceToY(val, priceScaleMin, priceScaleMax, chartH, h); const clampedY = Math.max(this.config.padding.top + labelHeight / 2, Math.min(y, chartBottom - labelHeight / 2)); const labelText = val.toFixed(2); const textWidth = ctx.measureText(labelText).width; const labelWidth = textWidth + 2 * labelPadding; const rectX = labelXPosition, rectY = clampedY - labelHeight / 2; ctx.fillStyle = indicatorColor; ctx.beginPath(); ctx.moveTo(rectX + borderRadius, rectY); ctx.lineTo(rectX + labelWidth - borderRadius, rectY); ctx.arcTo(rectX + labelWidth, rectY, rectX + labelWidth, rectY + borderRadius, borderRadius); ctx.lineTo(rectX + labelWidth, rectY + labelHeight - borderRadius); ctx.arcTo(rectX + labelWidth, rectY + labelHeight, rectX + labelWidth - borderRadius, rectY + labelHeight, borderRadius); ctx.lineTo(rectX + borderRadius, rectY + labelHeight); ctx.arcTo(rectX, rectY + labelHeight, rectX, rectY + labelHeight - borderRadius, borderRadius); ctx.lineTo(rectX, rectY + borderRadius); ctx.arcTo(rectX, rectY, rectX + borderRadius, rectY, borderRadius); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.fillText(labelText, labelXPosition + labelPadding, clampedY) }; if (info.key === 'bollinger' && data && data.upper && data.middle && data.lower) { processValue(data.upper[data.upper.length - 1], 'BB Up'); processValue(data.middle[data.middle.length - 1], 'BB Mid'); processValue(data.lower[data.lower.length - 1], 'BB Low') } else if (data && data.length > 0) { processValue(data[data.length - 1]) } } }) }
    drawWatermark(ctx, w, h) { ctx.save(); const fontParts = this.config.watermark.font.split(' '); const sizeIndex = fontParts.findIndex(part => part.includes('px')); const mainFontSize = parseInt(fontParts[sizeIndex]); const verticalSpacing = mainFontSize * 0.4; ctx.font = this.config.watermark.font; ctx.fillStyle = this.config.darkMode ? `rgba(255,255,255,${this.config.watermark.opacity})` : `rgba(0,0,0,${this.config.watermark.opacity})`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(this.config.watermark.text, w * 0.5, h * 0.5 - verticalSpacing); const timeframeFontSize = Math.max(Math.floor(mainFontSize * 0.5), 12); ctx.font = this.config.watermark.font.replace(/\d+px/, `${timeframeFontSize}px`); ctx.fillText(this.timeframe, w * 0.5, h * 0.5 + verticalSpacing); ctx.restore() }
    drawBranding(ctx) { return; if (!this.config.branding.enabled) return; const w = this.getCanvasWidth(), h = this.getCanvasHeight(); ctx.save(); ctx.font = this.config.branding.font; ctx.fillStyle = this.config.darkMode ? `rgba(255,255,255,${this.config.branding.opacity})` : `rgba(100,100,100,${this.config.branding.opacity})`; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(this.config.branding.text, 10, h - 2); ctx.restore() }
    calculateNiceScale(min, max, ticks = 5) {
        if (Math.abs(max - min) < 1e-5) { min -= 1; max += 1 }
        const rng = this.niceNumber(max - min, !1); const spacing = this.niceNumber(rng / (ticks - 1), !0); return { min: Math.floor(min / spacing) * spacing, max: Math.ceil(max / spacing) * spacing, tickSpacing: spacing }
    }
    niceNumber(range, round) {
        if (range === 0) return 1; const exp = Math.floor(Math.log10(range)); const frac = range / Math.pow(10, exp); let nice; if (round) { if (frac < 1.5) nice = 1; else if (frac < 3) nice = 2; else if (frac < 7) nice = 5; else nice = 10 } else { if (frac <= 1) nice = 1; else if (frac <= 2) nice = 2; else if (frac <= 5) nice = 5; else nice = 10 }
        return nice * Math.pow(10, exp)
    }
    formatDetailTimestamp(ts, timeframe) { const d = new Date(ts); if (['1min', '5min', '15min', 'hour', '4hour'].includes(timeframe)) { const parts = d.toLocaleString('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }); return parts.replace(',', '') } else { return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}` } }
    detectTimeframe(data) { if (!data || data.length < 2) return 'day'; const diff = Math.abs(data[1].t - data[0].t); if (diff < 90000) return '1min'; if (diff < 300000) return '5min'; if (diff < 900000) return '15min'; if (diff < 3600000) return 'hour'; if (diff < 86400000) return '4hour'; if (diff < 604800000) return 'day'; return 'week' }
    formatTimestamp(ts, tf) { const d = new Date(ts); switch (tf) { case '1min': case '5min': case '15min': { const et = d.toLocaleString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false }); return et } case 'hour': case '4hour': { const et = d.toLocaleString('en-US', { timeZone: 'America/New_York', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }); return et.replace(',', '') } case 'day': return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`; case 'week': case 'month': return `${d.getUTCMonth() + 1}/${String(d.getUTCFullYear()).slice(-2)}`; default: return `${d.getUTCMonth() + 1}/${d.getUTCDate()}` } }
    pad(n) { return String(n).padStart(2, '0') }
    destroy() { window.removeEventListener('resize', this.debouncedResize) }
    updateOHLCOverlay() {
        if (this.stockData.length > 0) {
            const last = this.stockData[this.stockData.length - 1]; if (this.openEl) this.openEl.textContent = last.open.toFixed(2); if (this.highEl) this.highEl.textContent = last.high.toFixed(2); if (this.lowEl) this.lowEl.textContent = last.low.toFixed(2); if (this.closeEl) { this.closeEl.textContent = last.close.toFixed(2); this.closeEl.style.color = last.close >= last.open ? '#26a69a' : '#ef5350' }
            if (this.volEl) {
                let suffix = '', scaled = last.volume; if (scaled >= 1e9) { suffix = 'B'; scaled /= 1e9 } else if (scaled >= 1e6) { suffix = 'M'; scaled /= 1e6 } else if (scaled >= 1e3) { suffix = 'K'; scaled /= 1e3 }
                this.volEl.textContent = parseFloat(scaled.toFixed(2)) + suffix
            }
            this.updateIndicatorValuesDisplay(this.stockData.length - 1); this.updateATRDisplay()
        } else { if (this.openEl) this.openEl.textContent = ''; if (this.highEl) this.highEl.textContent = ''; if (this.lowEl) this.lowEl.textContent = ''; if (this.closeEl) this.closeEl.textContent = ''; if (this.volEl) this.volEl.textContent = ''; if (this.indicatorValuesDisplay) this.indicatorValuesDisplay.innerHTML = ''; this.updateATRDisplay() }
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
    setTickerInfo(info) {
        if (!info || !this.tickerInfoDisplay) return;
        const bullColor = this.config.darkMode ? this.config.darkModeColors.bullColor : this.config.bullColor;
        const bearColor = this.config.darkMode ? this.config.darkModeColors.bearColor : this.config.bearColor;
        const textColor = this.config.darkMode ? this.config.darkModeColors.textColor : this.config.textColor;
        const change = info.change || 0;
        const changePercent = info.changePercent || 0;
        const changeColor = change >= 0 ? bullColor : bearColor;
        if (this.tickerSymbolEl) this.tickerSymbolEl.textContent = info.symbol || '';
        if (this.companyNameEl) {
            const name = info.companyName || '';
            this.companyNameEl.textContent = name ? name : '';
            this.companyNameEl.style.display = name ? 'inline' : 'none';
        }
        if (this.currentPriceEl && info.price != null) {
            this.currentPriceEl.textContent = info.price.toFixed(2);
            this.currentPriceEl.style.color = changeColor;
        }
        if (this.dayChangeEl) {
            this.dayChangeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
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
    activateSelectedDrawingTool() { if (!this.drawingToolsMode) return; this.deactivateLineDrawingMode(); this.drawingArrow = !1; this.drawingRectangle = !1; this.drawingCircle = !1; if (this.selectedDrawingTool === 'line') { this.activateLineDrawingMode() } else if (this.selectedDrawingTool === 'arrow') { this.priceCanvas.style.cursor = 'crosshair'; console.log('Arrow tool activated - click and drag to draw arrows') } else if (this.selectedDrawingTool === 'rectangle') { this.priceCanvas.style.cursor = 'crosshair'; console.log('Rectangle tool activated - click and drag to draw rectangles') } else if (this.selectedDrawingTool === 'circle') { this.priceCanvas.style.cursor = 'crosshair'; console.log('Circle tool activated - click and drag to draw circles') } else { console.log(`${this.selectedDrawingTool} tool selected - implementation coming soon!`) } }
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
    timestampToScreen(timestamp) { const candleIndex = this.stockData.findIndex(candle => candle.t === timestamp); if (candleIndex === -1) return null; const visibleIndex = candleIndex - this.config.dataOffset; if (visibleIndex < 0 || visibleIndex >= this.config.visibleCandles) return null; const candleWidth = this.calculateCandleWidth(); const spacing = this.config.spacing; return this.config.padding.left + visibleIndex * (candleWidth + spacing) + candleWidth / 2 }
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
        if (!this.arrows.length && !this.currentArrow) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); this.arrows.forEach((arrow, index) => { const isSelected = (index === this.selectedShapeIndex) || (index === this.selectedArrowIndex); this.drawSingleArrow(ctx, arrow, isSelected) }); if (this.currentArrow && this.drawingArrow) { this.drawSingleArrow(ctx, this.currentArrow, !1, !0) }
        ctx.restore()
    }
    drawSingleArrow(ctx, arrow, isSelected = !1, isDrawing = !1) {
        const lineColor = isSelected ? '#00ff00' : (isDrawing ? '#ffaa00' : '#2196F3'); let startX, startY, endX, endY; if (isDrawing) { startX = arrow.startX; startY = arrow.startY; endX = arrow.endX; endY = arrow.endY } else { startX = this.timestampToScreen(arrow.startTimestamp); startY = this.priceToScreen(arrow.startPrice); endX = this.timestampToScreen(arrow.endTimestamp); endY = this.priceToScreen(arrow.endPrice); if (startX === null || endX === null) return }
        ctx.strokeStyle = lineColor; ctx.fillStyle = lineColor; ctx.lineWidth = isSelected ? 3 : 2; ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.stroke(); const angle = Math.atan2(endY - startY, endX - startX); const arrowLength = 12; const arrowAngle = Math.PI / 6; ctx.beginPath(); ctx.moveTo(endX, endY); ctx.lineTo(endX - arrowLength * Math.cos(angle - arrowAngle), endY - arrowLength * Math.sin(angle - arrowAngle)); ctx.lineTo(endX - arrowLength * Math.cos(angle + arrowAngle), endY - arrowLength * Math.sin(angle + arrowAngle)); ctx.closePath(); ctx.fill()
    }
    drawRectangles(ctx) {
        if (!this.rectangles.length && !this.currentRectangle) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); this.rectangles.forEach((rectangle, index) => { const isSelected = (index === this.selectedShapeIndex) || (index === this.selectedRectangleIndex); this.drawSingleRectangle(ctx, rectangle, isSelected) }); if (this.currentRectangle && this.drawingRectangle) { this.drawSingleRectangle(ctx, this.currentRectangle, !1, !0) }
        ctx.restore()
    }
    drawSingleRectangle(ctx, rectangle, isSelected = !1, isDrawing = !1) {
        const lineColor = isSelected ? '#00ff00' : (isDrawing ? '#ffaa00' : '#9C27B0'); let startX, startY, endX, endY; if (isDrawing) { startX = rectangle.startX; startY = rectangle.startY; endX = rectangle.endX; endY = rectangle.endY } else { startX = this.timestampToScreen(rectangle.startTimestamp); startY = this.priceToScreen(rectangle.startPrice); endX = this.timestampToScreen(rectangle.endTimestamp); endY = this.priceToScreen(rectangle.endPrice); if (startX === null || endX === null) return }
        const left = Math.min(startX, endX); const top = Math.min(startY, endY); const width = Math.abs(endX - startX); const height = Math.abs(endY - startY); ctx.strokeStyle = lineColor; ctx.lineWidth = isSelected ? 3 : 2; ctx.fillStyle = lineColor; ctx.strokeRect(left, top, width, height); ctx.globalAlpha = isSelected ? 0.15 : (isDrawing ? 0.1 : 0.05); ctx.fillRect(left, top, width, height); ctx.globalAlpha = 1.0
    }
    drawCircles(ctx) {
        if (!this.circles.length && !this.currentCircle) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); this.circles.forEach((circle, index) => { const isSelected = (index === this.selectedShapeIndex) || (index === this.selectedCircleIndex); this.drawSingleCircle(ctx, circle, isSelected) }); if (this.currentCircle && this.drawingCircle) { this.drawSingleCircle(ctx, this.currentCircle, !1, !0) }
        ctx.restore()
    }
    drawSingleCircle(ctx, circle, isSelected = !1, isDrawing = !1) {
        const lineColor = isSelected ? '#00ff00' : (isDrawing ? '#ffaa00' : '#FF5722'); let centerX, centerY, radiusX, radiusY; if (isDrawing) { centerX = circle.centerX; centerY = circle.centerY; radiusX = circle.radiusX; radiusY = circle.radiusY } else { centerX = this.timestampToScreen(circle.centerTimestamp); centerY = this.priceToScreen(circle.centerPrice); const leftX = this.timestampToScreen(circle.leftTimestamp); const rightX = this.timestampToScreen(circle.rightTimestamp); const topY = this.priceToScreen(circle.topPrice); const bottomY = this.priceToScreen(circle.bottomPrice); if (centerX === null) return; radiusX = leftX !== null && rightX !== null ? Math.abs(rightX - leftX) / 2 : 50; radiusY = topY !== null && bottomY !== null ? Math.abs(bottomY - topY) / 2 : 50 }
        ctx.strokeStyle = lineColor; ctx.lineWidth = isSelected ? 3 : 2; ctx.fillStyle = lineColor; ctx.beginPath(); ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI); ctx.stroke(); ctx.globalAlpha = isSelected ? 0.15 : (isDrawing ? 0.1 : 0.05); ctx.fill(); ctx.globalAlpha = 1.0
    }
    drawTextAnnotations(ctx) {
        if (!this.textAnnotations.length) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; this.textAnnotations.forEach((annotation, index) => {
            const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: priceMin, max: priceMax } = this.applyVerticalScale(rawRange); priceMin += this.config.priceOffset; priceMax += this.config.priceOffset; const candleIndex = this.stockData.findIndex(candle => candle.t === annotation.timestamp); if (candleIndex === -1) return; const visibleIndex = candleIndex - this.config.dataOffset; if (visibleIndex < 0 || visibleIndex >= this.config.visibleCandles) return; const cW = this.calculateCandleWidth(); const screenX = this.config.padding.left + visibleIndex * (cW + this.config.spacing) + cW / 2; const relY = (annotation.price - priceMin) / (priceMax - priceMin); const screenY = chartBottom - (relY * chartH); annotation.screenX = screenX; annotation.screenY = screenY; ctx.font = `${annotation.fontWeight} ${annotation.fontSize}px ${annotation.fontFamily}`; ctx.fillStyle = annotation.color; if (index === this.selectedTextIndex) { const lines = annotation.text.split('\n'); const lineHeight = annotation.fontSize * 1.2; let maxWidth = 0; lines.forEach(line => { const lineWidth = ctx.measureText(line).width; maxWidth = Math.max(maxWidth, lineWidth) }); const totalHeight = lines.length * lineHeight; ctx.save(); ctx.strokeStyle = this.textMode ? '#00ff00' : '#ffaa00'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]); ctx.strokeRect(screenX - 2, screenY - annotation.fontSize - 2, maxWidth + 4, totalHeight + 4); ctx.restore() }
            const lines = annotation.text.split('\n'); const lineHeight = annotation.fontSize * 1.2; lines.forEach((line, lineIndex) => { const yOffset = lineIndex * lineHeight; ctx.fillText(line, screenX, screenY + yOffset) })
        }); ctx.restore()
    }
    drawEmoticons(ctx) {
        if (!this.emoticons.length) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; this.emoticons.forEach((emoticon, index) => {
            const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min: priceMin, max: priceMax } = this.applyVerticalScale(rawRange); priceMin += this.config.priceOffset; priceMax += this.config.priceOffset; const candleIndex = this.stockData.findIndex(candle => candle.t === emoticon.timestamp); if (candleIndex === -1) return; const visibleIndex = candleIndex - this.config.dataOffset; if (visibleIndex < 0 || visibleIndex >= this.config.visibleCandles) return; const cW = this.calculateCandleWidth(); const screenX = this.config.padding.left + visibleIndex * (cW + this.config.spacing) + cW / 2; const relY = (emoticon.price - priceMin) / (priceMax - priceMin); const screenY = chartBottom - (relY * chartH); emoticon.screenX = screenX; emoticon.screenY = screenY; if (index === this.selectedEmoticonIndex) { const selectionSize = emoticon.size + 8; ctx.save(); ctx.strokeStyle = this.emoticonMode ? '#00ff00' : '#ffaa00'; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.strokeRect(screenX - selectionSize / 2, screenY - selectionSize / 2, selectionSize, selectionSize); ctx.restore() }
            ctx.font = `${emoticon.size}px Arial`; ctx.fillText(emoticon.emoji, screenX, screenY)
        }); ctx.restore()
    }
    drawFibonacciRetracements(ctx) {
        if (!this.fibonacciRetracements.length && !this.currentFibonacci) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); this.fibonacciRetracements.forEach((fib, index) => { this.drawSingleFibonacci(ctx, fib, index === this.selectedFibonacciIndex) }); if (this.currentFibonacci && this.drawingFibonacci) { this.drawSingleFibonacci(ctx, this.currentFibonacci, !1, !0) }
        if (this.fibonacciSnapPoint) { ctx.strokeStyle = '#00ff00'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(this.fibonacciSnapPoint.x, this.fibonacciSnapPoint.y, 6, 0, 2 * Math.PI); ctx.stroke() }
        ctx.restore()
    }
    drawSingleFibonacci(ctx, fib, isSelected = !1, isDrawing = !1) {
        const levels = this.calculateFibonacciLevels(fib.startPrice, fib.endPrice); const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const chartHeight = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartHeight; const chartLeft = this.config.padding.left; const chartRight = this.getCanvasWidth() - this.config.padding.right; const lineColor = isSelected ? '#00ff00' : (isDrawing ? '#ffaa00' : '#6a8ef5'); const textColor = this.config.darkMode ? '#ffffff' : '#333333'; const bgColor = this.config.darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'; levels.forEach((level, index) => {
            const levelY = this.priceToY(level.price, min, max, chartHeight, this.getCanvasHeight()); if (levelY < this.config.padding.top || levelY > chartBottom) { return }
            ctx.strokeStyle = lineColor; ctx.lineWidth = isSelected ? 2 : 1; if (index === 0 || index === levels.length - 1) { ctx.setLineDash([]) } else { ctx.setLineDash([5, 5]) }
            ctx.beginPath(); ctx.moveTo(chartLeft, levelY); ctx.lineTo(chartRight, levelY); ctx.stroke(); ctx.setLineDash([]); const labelText = `${level.label} (${level.price.toFixed(2)})`; ctx.font = '11px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const textWidth = ctx.measureText(labelText).width; const labelX = chartLeft + 5; const labelY = levelY; ctx.fillStyle = bgColor; ctx.fillRect(labelX - 2, labelY - 7, textWidth + 4, 14); ctx.fillStyle = textColor; ctx.fillText(labelText, labelX, labelY)
        }); ctx.setLineDash([])
    }
    findSnappingPoint(x, y) { if (!this.stockData || !this.stockData.length) return null; const snapThreshold = 15; let closestPoint = null, minDistance = snapThreshold; const chartH = this.getPriceChartHeight(); const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const visibleData = this.stockData.slice(this.config.dataOffset, this.config.dataOffset + this.config.visibleCandles); const cW = this.calculateCandleWidth(); visibleData.forEach((candle, i) => { const candleX = this.config.padding.left + i * (cW + this.config.spacing) + cW / 2;['high', 'low', 'open', 'close'].forEach(type => { const priceVal = candle[type]; const pointY = this.priceToY(priceVal, min, max, chartH, this.getCanvasHeight()); const dist = Math.hypot(x - candleX, y - pointY); if (dist < minDistance) { minDistance = dist; closestPoint = { x: candleX, y: pointY, price: priceVal, type } } }) }); return closestPoint }
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
        if (!this.lines.length || !this.stockData.length) return; const chartH = this.getPriceChartHeight(); const chartBottom = this.config.padding.top + chartH; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const cW = this.calculateCandleWidth(); const findCandleIndexByTime = ts => { if (ts === null) return -1; let bestIdx = -1, minDiff = Infinity; for (let i = 0; i < this.stockData.length; i++) { const diff = Math.abs(this.stockData[i].t - ts); if (diff < minDiff) { minDiff = diff; bestIdx = i } if (diff === 0) break } return bestIdx }; this.lines.forEach(line => {
            const currentStartIdx = findCandleIndexByTime(line.startTime); const currentEndIdx = findCandleIndexByTime(line.endTime); if (currentStartIdx === -1 || currentEndIdx === -1) { line.visible = !1; return }
            const startScreenIdx = currentStartIdx - this.config.dataOffset; const endScreenIdx = currentEndIdx - this.config.dataOffset; const isStartVis = startScreenIdx >= -1 && startScreenIdx <= this.config.visibleCandles; const isEndVis = endScreenIdx >= -1 && endScreenIdx <= this.config.visibleCandles; if (!isStartVis && !isEndVis && !((startScreenIdx < -1 && endScreenIdx > this.config.visibleCandles) || (startScreenIdx > this.config.visibleCandles && endScreenIdx < -1))) { line.visible = !1; return }
            line.startX = this.config.padding.left + startScreenIdx * (cW + this.config.spacing) + cW / 2; line.endX = this.config.padding.left + endScreenIdx * (cW + this.config.spacing) + cW / 2; const startRelY = (line.startPrice - min) / (max - min); const endRelY = (line.endPrice - min) / (max - min); line.startY = chartBottom - (startRelY * chartH); line.endY = chartBottom - (endRelY * chartH); line.visible = !0
        })
    }
    drawLines(ctx) {
        if (!this.lines.length && !this.currentLine) return; ctx.save(); ctx.beginPath(); ctx.rect(this.config.padding.left, this.config.padding.top, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, this.getPriceChartHeight()); ctx.clip(); this.lines.forEach((line, index) => {
            if (!line.visible) return; const isSelected = index === this.selectedLineIndex; ctx.save(); ctx.beginPath(); ctx.moveTo(line.startX, line.startY); ctx.lineTo(line.endX, line.endY); if (line.infiniteExtension) { const dx = line.endX - line.startX, dy = line.endY - line.startY; if (Math.abs(dx) > 0.001) { const slope = dy / dx, rightEdge = this.getCanvasWidth() - this.config.padding.right; if (line.endX > line.startX) { const extendedY = line.endY + (slope * (rightEdge - line.endX)); ctx.save(); ctx.setLineDash([5, 3]); ctx.moveTo(line.endX, line.endY); ctx.lineTo(rightEdge, extendedY); ctx.stroke(); ctx.restore() } } }
            ctx.strokeStyle = isSelected ? '#ff9800' : '#3498db'; ctx.lineWidth = isSelected ? 3 : 2; ctx.stroke(); const radius = isSelected ? 5 : 3; ctx.fillStyle = isSelected ? '#ff9800' : '#3498db'; ctx.beginPath(); ctx.arc(line.startX, line.startY, radius, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(line.endX, line.endY, radius, 0, Math.PI * 2); ctx.fill(); ctx.restore()
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
        if (this.indicators.bollinger.enabled) this.indicators.bollinger.data = this.calculateBollingerBands(20, 2);
        if (this.indicators.rsi && this.indicators.rsi.enabled) this.indicators.rsi.data = this.calculateRSI(14);
        if (this.indicators.macd && this.indicators.macd.enabled) this.indicators.macd.data = this.calculateMACD(12, 26, 9);
        if (this.indicators.parabolicSAR && this.indicators.parabolicSAR.enabled) this.indicators.parabolicSAR.data = this.calculateParabolicSAR();
        if (this.indicators.atr && this.indicators.atr.enabled) this.indicators.atr.data = this.calculateATR(this.indicators.atr.period);
        if (this.indicators.volumeMA && this.indicators.volumeMA.enabled) this.indicators.volumeMA.data = this.calculateVolumeMA(this.indicators.volumeMA.period);
        if (this.indicators.stochastic && this.indicators.stochastic.enabled) this.indicators.stochastic.data = this.calculateStochastic(14, 3, 3);

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
        if (!this.stockData || !this.stockData.length) return; const chartH = this.getPriceChartHeight(); const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const cW = this.calculateCandleWidth(); const drawIndicatorLine = (data, color, lineWidth = 1) => {
            if (!data || !data.length) return; let latestValue = null; for (let i = this.config.visibleCandles - 1; i >= 0; i--) { const dataIndex = i + this.config.dataOffset; if (data[dataIndex] !== null && data[dataIndex] !== undefined) { latestValue = data[dataIndex]; break } }
            const currentPrice = this.stockData[this.stockData.length - 1].close; const glowActive = latestValue !== null && Math.abs(currentPrice - latestValue) <= 0.01; ctx.beginPath(); let started = !1; for (let i = 0; i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < data.length && data[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = this.priceToY(data[dataIndex], min, max, chartH, this.getCanvasHeight()); if (!started) { ctx.moveTo(x, y); started = !0 } else ctx.lineTo(x, y) } }
            ctx.strokeStyle = color; ctx.lineWidth = lineWidth; if (glowActive) { ctx.save(); ctx.shadowColor = '#FFFFFF'; ctx.shadowBlur = 25; ctx.stroke(); ctx.restore() } else ctx.stroke()
        }; this.movingAverages.forEach(ma => { if (ma.enabled && ma.data && ma.data.length) { drawIndicatorLine(ma.data, ma.color) } }); if (this.indicators.vwap.enabled) drawIndicatorLine(this.indicators.vwap.data, this.indicators.vwap.color, 1); if (this.indicators.bollinger.enabled) {
            const bollingerUpperLowerColor = this.indicators.bollinger.color; const bollingerMiddleColor = '#E69500'; drawIndicatorLine(this.indicators.bollinger.data.upper, bollingerUpperLowerColor); drawIndicatorLine(this.indicators.bollinger.data.middle, bollingerMiddleColor); drawIndicatorLine(this.indicators.bollinger.data.lower, bollingerUpperLowerColor); const upperBandData = this.indicators.bollinger.data.upper; const lowerBandData = this.indicators.bollinger.data.lower; if (upperBandData && upperBandData.length && lowerBandData && lowerBandData.length) {
                ctx.beginPath(); let firstPoint = !0; for (let i = 0; i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < upperBandData.length && upperBandData[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = this.priceToY(upperBandData[dataIndex], min, max, chartH, this.getCanvasHeight()); if (firstPoint) { ctx.moveTo(x, y); firstPoint = !1 } else { ctx.lineTo(x, y) } } }
                for (let i = this.config.visibleCandles - 1; i >= 0; i--) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < lowerBandData.length && lowerBandData[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = this.priceToY(lowerBandData[dataIndex], min, max, chartH, this.getCanvasHeight()); ctx.lineTo(x, y) } }
                ctx.closePath(); ctx.fillStyle = 'rgba(30, 136, 229, 0.15)'; ctx.fill()
            }
        }
        if (this.indicators.parabolicSAR.enabled && this.indicators.parabolicSAR.data.length) { const sarData = this.indicators.parabolicSAR.data; const sarColor = this.indicators.parabolicSAR.color; ctx.fillStyle = sarColor; for (let i = 0; i < this.config.visibleCandles; i++) { const dataIndex = i + this.config.dataOffset; if (dataIndex >= 0 && dataIndex < sarData.length && sarData[dataIndex] !== null) { const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5; const y = this.priceToY(sarData[dataIndex], min, max, chartH, this.getCanvasHeight()); ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill() } } }

        // New overlay indicators
        if (this.indicators.wma && this.indicators.wma.enabled && this.indicators.wma.data && this.indicators.wma.data.length) {
            drawIndicatorLine(this.indicators.wma.data, this.indicators.wma.color, 1);
        }
        if (this.indicators.wema && this.indicators.wema.enabled && this.indicators.wema.data && this.indicators.wema.data.length) {
            drawIndicatorLine(this.indicators.wema.data, this.indicators.wema.color, 1);
        }
        if (this.indicators.typicalPrice && this.indicators.typicalPrice.enabled && this.indicators.typicalPrice.data && this.indicators.typicalPrice.data.length) {
            drawIndicatorLine(this.indicators.typicalPrice.data, this.indicators.typicalPrice.color, 1);
        }

        // Ichimoku Cloud overlay
        if (this.indicators.ichimoku && this.indicators.ichimoku.enabled && this.indicators.ichimoku.data) {
            const ich = this.indicators.ichimoku;
            const data = ich.data;
            const displacement = data.displacement || 26;

            // Draw Tenkan-sen (Conversion Line)
            if (data.tenkan && data.tenkan.length) {
                drawIndicatorLine(data.tenkan, ich.tenkanColor || '#0496ff', 1);
            }
            // Draw Kijun-sen (Base Line)
            if (data.kijun && data.kijun.length) {
                drawIndicatorLine(data.kijun, ich.kijunColor || '#991515', 1);
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
                for (let i = 0; i < this.config.visibleCandles; i++) {
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
        }; drawLine(macdLine, '#2196F3'); drawLine(signalLine, '#FF9800'); const macdLabelText = 'MACD'; ctx.font = '11px Arial'; const macdTextWidth = ctx.measureText(macdLabelText).width; const macdLabelX = this.config.padding.left + 5, macdLabelY = volumeTopY + 5; const macdLabelBgHeight = 15, macdLabelBgWidth = macdTextWidth + 10; ctx.fillStyle = this.config.darkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)'; ctx.fillRect(macdLabelX, macdLabelY, macdLabelBgWidth, macdLabelBgHeight); ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = this.config.darkMode ? '#2196F3' : '#1565C0'; ctx.fillText(macdLabelText, macdLabelX + 5, macdLabelY + 3); ctx.restore()
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
        if (!this.tradeMarkers.length) return; ctx.save(); const chartTop = this.config.padding.top; const panelsTopY = this.getPanelsTopY(); const chartH = this.getPriceChartHeight(); ctx.beginPath(); ctx.rect(this.config.padding.left, chartTop, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, chartH); ctx.clip(); let { min, max } = this.applyVerticalScale(this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles)); min += this.config.priceOffset; max += this.config.priceOffset; const cW = this.calculateCandleWidth(); this.tradeMarkers.forEach(marker => {
            const { price, type, quantity, timestamp } = marker; let localIndex = this.stockData.findIndex(candle => new Date(candle.date).getTime() <= timestamp && new Date(candle.date).getTime() + (currentTimeframe * 60000) > timestamp); localIndex -= this.config.dataOffset; if (localIndex < 0 || localIndex > this.config.visibleCandles) return; const x = this.config.padding.left + (localIndex * (cW + this.config.spacing)) + (cW / 2); const y = this.priceToY(price, min, max, chartH, this.getCanvasHeight()); if (y < chartTop || y >= panelsTopY) return; ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 5; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2; ctx.beginPath(); if (type === 'buy') { ctx.fillStyle = '#1E6124'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.moveTo(x - 10, y + 10); ctx.lineTo(x + 10, y + 10); ctx.lineTo(x, y); ctx.closePath() } else if (type === 'sell') { ctx.fillStyle = '#FF0000'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.moveTo(x - 10, y - 10); ctx.lineTo(x + 10, y - 10); ctx.lineTo(x, y); ctx.closePath() } else if (type === 'short') { ctx.fillStyle = '#0000FF'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.moveTo(x, y - 10); ctx.lineTo(x - 10, y); ctx.lineTo(x, y + 10); ctx.lineTo(x + 10, y); ctx.closePath() } else if (type === 'cover') { ctx.fillStyle = '#800080'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.moveTo(x, y - 10); ctx.lineTo(x - 10, y); ctx.lineTo(x, y + 10); ctx.lineTo(x + 10, y); ctx.closePath() } else { ctx.fillStyle = '#ff9900'; ctx.arc(x, y, 5, 0, 2 * Math.PI) }
            ctx.fill(); ctx.stroke(); ctx.restore()
        }); ctx.restore()
    }
    addLimitOrder(order) { this.limitOrders.push(order); this.drawCharts() }
    setLimitOrders(ordersArray) { this.limitOrders = ordersArray.slice(); this.drawCharts() }
    drawLimitOrders(ctx) { if (!this.limitOrders.length) return; ctx.save(); const chartTop = this.config.padding.top; const chartH = this.getPriceChartHeight(); const panelsTopY = this.getPanelsTopY(); ctx.beginPath(); ctx.rect(this.config.padding.left, chartTop, this.getCanvasWidth() - this.config.padding.left - this.config.padding.right, chartH); ctx.clip(); this.limitOrders.forEach(order => { const { action, price, quantity } = order; const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const y = this.priceToY(price, min, max, chartH, this.getCanvasHeight()); if (y < chartTop || y >= panelsTopY) return; ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = (action.toLowerCase() === 'buy') ? '#089981' : '#ff3333'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(this.config.padding.left, y); ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, y); ctx.stroke(); ctx.restore(); const labelText = `${action} ${quantity}`; ctx.font = '12px Arial'; const textMetrics = ctx.measureText(labelText); const textWidth = textMetrics.width; const labelPadding = 5; const badgeHeight = 20; const dynamicBadgeWidth = textWidth + 2 * labelPadding; const badgeX = this.config.padding.left + 5; const badgeY = y - badgeHeight / 2; const borderRadius = 3; ctx.save(); ctx.fillStyle = (action.toLowerCase() === 'buy') ? '#089981' : '#ff3333'; ctx.beginPath(); ctx.moveTo(badgeX + borderRadius, badgeY); ctx.lineTo(badgeX + dynamicBadgeWidth - borderRadius, badgeY); ctx.arcTo(badgeX + dynamicBadgeWidth, badgeY, badgeX + dynamicBadgeWidth, badgeY + borderRadius, borderRadius); ctx.lineTo(badgeX + dynamicBadgeWidth, badgeY + badgeHeight - borderRadius); ctx.arcTo(badgeX + dynamicBadgeWidth, badgeY + badgeHeight, badgeX + dynamicBadgeWidth - borderRadius, badgeY + badgeHeight, borderRadius); ctx.lineTo(badgeX + borderRadius, badgeY + badgeHeight); ctx.arcTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - borderRadius, borderRadius); ctx.lineTo(badgeX, badgeY + borderRadius); ctx.arcTo(badgeX, badgeY, badgeX + borderRadius, badgeY, borderRadius); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(labelText, badgeX + labelPadding, badgeY + badgeHeight / 2); ctx.restore() }); ctx.restore() }
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
    drawCrosshair(ctx, mouseX, mouseY) {
        if (!this.stockData.length) return; const chartLeft = this.config.padding.left, chartRight = this.getCanvasWidth() - this.config.padding.right; const chartTop = this.config.padding.top; const chartH = this.getPriceChartHeight(); const chartBottom = chartTop + chartH; if (mouseX < chartLeft || mouseX > chartRight || mouseY < chartTop || mouseY > chartBottom) return; ctx.save(); ctx.strokeStyle = this.config.currentCrosshairColor; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(mouseX, 0); ctx.lineTo(mouseX, this.getCanvasHeight()); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, mouseY); ctx.lineTo(chartRight, mouseY); ctx.stroke(); ctx.setLineDash([]); const cW = this.calculateCandleWidth(); const indexWithinView = Math.floor((mouseX - this.pixelOffset - chartLeft) / (cW + this.config.spacing)); const dataIndex = this.config.dataOffset + indexWithinView; if (dataIndex < 0 || dataIndex >= this.stockData.length) { ctx.restore(); return }
        const candle = this.stockData[dataIndex]; if (this.openEl) this.openEl.textContent = candle.open.toFixed(2); if (this.highEl) this.highEl.textContent = candle.high.toFixed(2); if (this.lowEl) this.lowEl.textContent = candle.low.toFixed(2); if (this.closeEl) { this.closeEl.textContent = candle.close.toFixed(2); this.closeEl.style.color = candle.close >= candle.open ? '#26a69a' : '#ef5350' }
        if (this.volEl) {
            let suffix = '', scaled = candle.volume; if (scaled >= 1e9) { suffix = 'B'; scaled /= 1e9 } else if (scaled >= 1e6) { suffix = 'M'; scaled /= 1e6 } else if (scaled >= 1e3) { suffix = 'K'; scaled /= 1e3 }
            this.volEl.textContent = parseFloat(scaled.toFixed(2)) + suffix
        }
        this.updateIndicatorValuesDisplay(dataIndex); const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles); let { min, max } = this.applyVerticalScale(rawRange); min += this.config.priceOffset; max += this.config.priceOffset; const relY = (chartBottom - mouseY) / chartH; const price = min + (max - min) * relY; const priceText = price.toFixed(2); ctx.font = '12px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const crosshairLabelBackgroundColor = 'rgba(60, 64, 67, 0.9)', crosshairLabelTextColor = '#F0F0F0'; const crosshairLabelBorderRadius = 3, crosshairLabelHeight = 20, crosshairLabelPadding = 5; const priceTxtW = ctx.measureText(priceText).width; const priceLabelWidth = priceTxtW + 2 * crosshairLabelPadding; const priceLabelX = chartRight, priceLabelY = mouseY - crosshairLabelHeight / 2; ctx.fillStyle = crosshairLabelBackgroundColor; ctx.beginPath(); ctx.moveTo(priceLabelX + crosshairLabelBorderRadius, priceLabelY); ctx.lineTo(priceLabelX + priceLabelWidth - crosshairLabelBorderRadius, priceLabelY); ctx.arcTo(priceLabelX + priceLabelWidth, priceLabelY, priceLabelX + priceLabelWidth, priceLabelY + crosshairLabelBorderRadius, crosshairLabelBorderRadius); ctx.lineTo(priceLabelX + priceLabelWidth, priceLabelY + crosshairLabelHeight - crosshairLabelBorderRadius); ctx.arcTo(priceLabelX + priceLabelWidth, priceLabelY + crosshairLabelHeight, priceLabelX + priceLabelWidth - crosshairLabelBorderRadius, priceLabelY + crosshairLabelHeight, crosshairLabelBorderRadius); ctx.lineTo(priceLabelX + crosshairLabelBorderRadius, priceLabelY + crosshairLabelHeight); ctx.arcTo(priceLabelX, priceLabelY + crosshairLabelHeight, priceLabelX, priceLabelY + crosshairLabelHeight - crosshairLabelBorderRadius, crosshairLabelBorderRadius); ctx.lineTo(priceLabelX, priceLabelY + crosshairLabelBorderRadius); ctx.arcTo(priceLabelX, priceLabelY, priceLabelX + crosshairLabelBorderRadius, priceLabelY, crosshairLabelBorderRadius); ctx.closePath(); ctx.fill(); ctx.fillStyle = crosshairLabelTextColor; ctx.fillText(priceText, priceLabelX + crosshairLabelPadding, mouseY); const dateText = this.formatDetailTimestamp(candle.t, this.timeframe); ctx.textAlign = 'center'; const dateTxtW = ctx.measureText(dateText).width; const dateLabelWidth = dateTxtW + 2 * crosshairLabelPadding; const dateLabelX = mouseX - dateLabelWidth / 2; const dateLabelY = chartBottom + crosshairLabelPadding; ctx.fillStyle = crosshairLabelBackgroundColor; ctx.beginPath(); ctx.moveTo(dateLabelX + crosshairLabelBorderRadius, dateLabelY); ctx.lineTo(dateLabelX + dateLabelWidth - crosshairLabelBorderRadius, dateLabelY); ctx.arcTo(dateLabelX + dateLabelWidth, dateLabelY, dateLabelX + dateLabelWidth, dateLabelY + crosshairLabelBorderRadius, crosshairLabelBorderRadius); ctx.lineTo(dateLabelX + dateLabelWidth, dateLabelY + crosshairLabelHeight - crosshairLabelBorderRadius); ctx.arcTo(dateLabelX + dateLabelWidth, dateLabelY + crosshairLabelHeight, dateLabelX + dateLabelWidth - crosshairLabelBorderRadius, dateLabelY + crosshairLabelHeight, crosshairLabelBorderRadius); ctx.lineTo(dateLabelX + crosshairLabelBorderRadius, dateLabelY + crosshairLabelHeight); ctx.arcTo(dateLabelX, dateLabelY + crosshairLabelHeight, dateLabelX, dateLabelY + crosshairLabelHeight - crosshairLabelBorderRadius, crosshairLabelBorderRadius); ctx.lineTo(dateLabelX, dateLabelY + crosshairLabelBorderRadius); ctx.arcTo(dateLabelX, dateLabelY, dateLabelX + crosshairLabelBorderRadius, dateLabelY, crosshairLabelBorderRadius); ctx.closePath(); ctx.fill(); ctx.fillStyle = crosshairLabelTextColor; ctx.fillText(dateText, mouseX, dateLabelY + crosshairLabelHeight / 2); ctx.restore()
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
        this.indicatorValuesDisplay.innerHTML = ''; const formatValue = val => (val === null || val === undefined) ? 'N/A' : (typeof val === 'number' ? (Math.abs(val) < 0.001 && val !== 0 ? val.toExponential(2) : val.toFixed(2)) : String(val)); const textColor = this.config.darkMode ? this.config.darkModeColors.textColor : this.config.textColor; this.movingAverages.forEach(ma => { if (ma.enabled && ma.data && dataIndex < ma.data.length && ma.data[dataIndex] !== null) { const item = document.createElement('div'); item.style.cssText = `display:flex;align-items:center;margin-right:10px;margin-bottom:2px;color:${textColor};font-size:12px;font-family:'Open Sans',Arial,sans-serif;font-weight:500;`; const dot = document.createElement('span'); dot.style.cssText = `background-color:${ma.color};width:8px;height:8px;border-radius:50%;margin-right:4px;display:inline-block;`; item.appendChild(dot); const name = document.createElement('span'); name.textContent = `${ma.type.toUpperCase()}${ma.period}: `; name.style.marginRight = '3px'; item.appendChild(name); const valSpan = document.createElement('span'); valSpan.textContent = formatValue(ma.data[dataIndex]); item.appendChild(valSpan); this.indicatorValuesDisplay.appendChild(item) } }); for (const key in this.indicators) {
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
        const settings = { timeframe: this.timeframe, indicators: {}, movingAverages: this.movingAverages.map(ma => ({ type: ma.type, period: ma.period, enabled: ma.enabled, id: ma.id, color: ma.color })) }; for (const key in this.indicators) settings.indicators[key] = this.indicators[key].enabled; try { localStorage.setItem('stockChartSettings', JSON.stringify(settings)) } catch (e) { console.error('Failed to save chart settings:', e) }
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
                const settings = JSON.parse(saved); if (!this.options.timeframe && settings.timeframe) this.timeframe = settings.timeframe; if (settings.movingAverages && Array.isArray(settings.movingAverages)) { this.movingAverages = settings.movingAverages.map((ma, index) => ({ ...ma, data: [], color: ma.color || this.colorPalette[index % this.colorPalette.length] })) }
                if (settings.indicators) {
                    for (const key in settings.indicators) { if (this.indicators[key]) { this.indicators[key].enabled = settings.indicators[key] } }
                    this.indicatorsDropdown.querySelectorAll('input[type="checkbox"]:not([value^="ema_"]):not([value^="sma_"])').forEach(toggle => { if (settings.indicators.hasOwnProperty(toggle.value) && this.indicators[toggle.value]) { toggle.checked = settings.indicators[toggle.value] } })
                }
                this.populateMovingAveragesUI(); this.setupMovingAverageToggleHandlers(); this.updateTimeframeDropdownVisualState(); this.calculateIndicators(); this.drawCharts(); this.updateWatermark()
            } else { this.indicatorsDropdown.querySelectorAll('input[type="checkbox"]:not([value^="ema_"]):not([value^="sma_"])').forEach(toggle => { if (this.indicators[toggle.value]) { this.indicators[toggle.value].enabled = toggle.checked } }); this.calculateIndicators(); this.updateTimeframeDropdownVisualState() }
        } catch (e) { console.error('Failed to load chart settings:', e); this.indicatorsDropdown.querySelectorAll('input[type="checkbox"]').forEach(t => { if (this.indicators[t.value]) this.indicators[t.value].enabled = t.checked }); this.calculateIndicators(); this.updateTimeframeDropdownVisualState() }
    }
    updateWatermark() { if (this.config.watermark.enabled) this.drawWatermark(this.priceCtx, this.getCanvasWidth(), this.getCanvasHeight()); }
    updateTimeframeDropdownVisualState() { if (!this.timeframeDropdown) this.timeframeDropdown = this.container.querySelector('.sc-timeframe-dropdown'); if (!this.timeframeDropdown) return; this.timeframeDropdown.querySelectorAll('.sc-timeframe-option').forEach(opt => { opt.classList.remove('selected'); if (opt.getAttribute('data-value') === this.timeframe) opt.classList.add('selected'); }) }
    _showNotification(message) {
        const existingNotifications = this.chartContainer.querySelectorAll('.chart-notification'); existingNotifications.forEach(notification => { notification.parentNode?.removeChild(notification) }); const n = document.createElement('div'); n.classList.add('chart-notification'); if (message.includes('<') && message.includes('>')) { n.innerHTML = message } else { n.textContent = message }
        n.style.cssText = `position:absolute;top:20px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:5px;z-index:10000;transition:opacity .5s ease-in-out;opacity:1;background-color:${this.config.darkMode ? 'black' : 'rgba(240,240,240,0.9)'};color:${this.config.darkMode ? '#e0e0e0' : '#333'};border:1px solid ${this.config.darkMode ? '#666' : '#ccc'};`; this.chartContainer.appendChild(n); setTimeout(() => { n.style.opacity = '0'; setTimeout(() => n.parentNode?.removeChild(n), 500) }, 5000)
    }
    async copyChartToClipboard() {
        if (!this.priceCanvas) { this._showNotification('Error: Chart canvas not available.'); return }
        const cssWidth = this.getCanvasWidth(); const cssHeight = this.getCanvasHeight();
        const tempCanvas = document.createElement('canvas'); tempCanvas.width = cssWidth; tempCanvas.height = cssHeight; const ctx = tempCanvas.getContext('2d'); ctx.fillStyle = this.config.darkMode ? '#0F0F0F' : '#FFFFFF'; ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height); ctx.drawImage(this.priceCanvas, 0, 0, this.priceCanvas.width, this.priceCanvas.height, 0, 0, cssWidth, cssHeight); const logo = new Image(); logo.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTc5IiB6b29tQW5kUGFuPSJtYWduaWZ5IiB2aWV3Qm94PSIwIDAgMTM0LjI1IDM2Ljc1MDAwMSIgaGVpZ2h0PSI0OSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgdmVyc2lvbj0iMS4wIj48ZGVmcz48ZmlsdGVyIHg9IjAlIiB5PSIwJSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgaWQ9IjcyNmQ0MGUyOGQiPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAxIDAgMCAwIDAgMSAwIDAgMCAwIDEgMCAwIDAgMSAwIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiLz48L2ZpbHRlcj48ZmlsdGVyIHg9IjAlIiB5PSIwJSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgaWQ9ImJiZjI1Zjk3ZTkiPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAxIDAgMCAwIDAgMSAwIDAgMCAwIDEgMC4yMTI2IDAuNzE1MiAwLjA3MjIgMCAwIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiLz48L2ZpbHRlcj48Zy8+PGNsaXBQYXRoIGlkPSIwYWI3N2MxNTZkIj48cGF0aCBkPSJNIDAuMDgyMDMxMiAzLjQzNzUgTCAzMSAzLjQzNzUgTCAzMSAyNS43ODUxNTYgTCAwLjA4MjAzMTIgMjUuNzg1MTU2IFogTSAwLjA4MjAzMTIgMy40Mzc1ICIgY2xpcC1ydWxlPSJub256ZXJvIi8+PC9jbGlwUGF0aD48aW1hZ2UgeD0iMCIgeT0iMCIgd2lkdGg9IjcwMCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFyd0FBQUg3Q0FBQUFBQUxaQlBXQUFBQUFtSkxSMFFBLzRlUHpMOEFBQTRMU1VSQlZIaWM3ZDE5cUdWVkdjZnhaKzI5Nzd3NHFZT3ZxVTFOWm1vNWxwS2xraFJGVVJTSklSVVdrcEFVaVlIbEg0cVFFQ2hCZ2pLVmFHcU9SbEZoTDRoQ0tiMElrdVZMbVRxR0dHSXZHbE5ONCtUNDF0bDdyNmMvenR5NTk5eDd6cm5ubkxsbjdmMjc4LzM4T1Z4WWUrQTcrejUzclROM21RSFRWdHh3aUlXbUh3SVlYMkdYK1hXV04vMFl3Tmh5TzkxclA5dUtwaDhFR0ZPdzFVOTR4N2UvMnJLbUh3VVlUMjdYZWNjN2ZnZFRMOFFVZHBaWE1YcnBGekk0UUVwbWgvM0xLNDllZTNrQ1A3UkJTYkRidmVQUm81ZitZTk1QQTR5aHNBdTg5QmpkbzNmOHF3d09rSkhibS83bnRVZDNqekZHZncrREEzVGM3NlZIZDNlUFh2blRyMkxMQVJvS3U5STdIcnZ4ZXZTT2Y0Zk5Ya2pJN1YzZGFXRjN2REZXZmc1akx3UUUyKzhwcjN5MlhmZm90ZTk4RGU5ZXRGOXVOM3RuWHJ2dTBVdS9tNmtYclZmWXg3MmFHeHE2ZzRPWGZqR0RBMW91c3lOMzdONGw4NTdCb1Q2Si9USzBXN0NmTHhnYVpnZUhSekltQjdSWllWL2NzOFBiT3poMC9HcGV2V2l4M041U0xSb2FkdStYMWY1QnhsNjBWakQ3UTc4WDcrNkR0cjhmeU9DQXRpcnNxajRENzl4QjIvZlo3RVZMNWZZK3IzdDN5WG9HaDlMUFkzQkFLd1U3NEc4OVIyc0xYNzIxdi9CNjNyMW9vOHkrTjNCb21OMHYrM1hURHduMFVkaTVYZzRhR3JxRGczZjhNZ1lIdEU1bXIzdSs3eTdaL0ZkdmRIOEh1NzFvbjE4TzJDWHJIUndlWDhWK0dkcWxzRXZtZlFCOWNMMGQveWF2WHJSS2JtL2JQUllNanpmRzJqL0MySXNXQ1ZZOHR1VFEwSDMxVnI3dEVQYkwwQjY1YlI1aGFKZ2RISDVDdkdpTndqNDArR2h0NGVEZ3BYK1d3UUV0RWV5Z2Z3dzVXbHY0NnEzOTVXTjU5NklkTXJ0dDZOSGF3bnBMdjYvcFJ3Yk16S3l3ODRjZnJTMGFIRHIrRlFZSHRFQm1iM2hwaWFPMWhmWEc2TzlrdHhkdGNPOUl1MlR6QjRmS24xekRRUnVhVnRpWHh4aDRaK3Z0K0EyOGV0R3czRTRmNVdodDBlQlFjZFVLR2haczlSTWo3NUxOZi9YV1hMV0NodVYyL2RoRFE3ZmVqdC9KMUlzR0ZmYlJoYi9iYWVSNlMvOENnd01hazlsaC81NWdhT2pHeTFVcmFOTHN0U21UaUY3NkEwMy9CYkRQbXJzMlpiSjZ1V29GVFpsM2JjcEU4WExWQ2hwMC81aEhhd3RmdlZ5MWdtWVVkc1dJSDBBZlhHL0hiK1hWaStSeWUvZjhhMU1taWpmR3lqL0oySXZFZ3ExN2FzSmRzdm12M3RwM2J1Q2dEV2t0dmpabHNucEx2NHVwRjBuMXVUWmxvbmlqZDdocUJVbjF2VFpsc2xjdlY2MGdyV0EvVzRhaG9WdHY2WC9rcWhVa1U5aEZlM0cwMWhzdlY2MGdwWUhYcGt4V2I2ejlBNHk5U0NKWUdIUnR5a1QxZXVYUHJHZHdRQXI1a0d0VEpxdTM0ejlnc3hjSkRMMDJaYUo0WXl6OTB3d09tTHBnQi94MXI0L1dGdFRMVlN0SVlxbHJVeWFydC9SN212NkxZY1ZiOHRxVUNldmxxaFZNMndqWHBrd1dMMWV0WVBxV3ZqWmxzbnBMLzlNTSsyV1ludEd1VFptczNvNWZ5NnNYVTVQYktlUC9icWNSNCtXcUZVeFRzSHkwYTFNbXF0Y3IzM1l3KzJXWWp0M1hwa3lsM2U3ZzhHUGl4VlNNY1czS1JQRnkxUXFtWmF4clV5YXFkOVNyVm5nN1kwekJ2blZFbWZ2MGRyT0NaOVdhTFJhWC9FTDJKRENlb2o3LzBxcVk4azVzWG03TTdpbVd6aGNZUTJiSGpIZHR5a1NEUTR6UnorRE5pdVUyN3JVcEU5WHJsZjk1TFFkdFdFNjdyMDJaZXJ4Y3RZTGxsdHRwMHpwYVcxanZDRmV0OEdMRzZJS3ZmdVM0ZXBvN0RYdDRpTmwvTm0zTGh2M1F4bFlaUnBmWjV1T211a3MySjNoV0hueVRlWUtsc0MrWS9OcVVpUWFISmE5YVlXekFxTEo0Mk5aRDB3d05adDNCb1R6NThid2UvRUJwSGdRcmdOdU5oeVlhR3N5NkIyMHp0OWpnZHRtTXdLaUtlTUdYcWhsUDk4MDZlRjV1V1BzTER0cXd0L2J5MnBUSnh0N2hWNjB3ODJKVXZ6dTFLcElORFdabTVxSE8vM0xpQzJIQW5nTXpMMFpTMkJXbmxrWGluYXZnZWJueFdpTEZYbG1HYTFNbUhCd3FQMmZRZmhsakEwWVFmTC9Iams2M1N6YkhROHordSttWi9nZHR2SkV4Z3N5dVBUcmhMdG1jNEZsMTRNMEREdHJZS3NQU2l2b1RWOVI1UTkrbjgrcU5MOTdYZDcrTXNRRkx5dUpSVzlmSHJJRVhyM1VIaDNqS3cvME8yaGdic0NTM205YVhEYlZyd2JNcTI1TFZmVlpuYk1CU2lualJoZFZNUSsxMjk4dU8zUC91bkErWVlXekxlbTNLaFB0bC9hOWFZZWJGY01IRDcwOU9mYlRXeTBPZFA3dHA1NktETm1aZURKZloxMDR1RzIzWGd1ZmxVZGZ6b3NXWWNudi9OSCszMDhpVFErbm5MUm9jcUJuREJEOWc2NFltanRaNmVZalppeWMrdmVDZ2piRUJ3d1M3YmtNalIyc0xIc096YXQyaTN3REZWaG1HS09wekwyL3NhSzFYWGg1ZDN0dDcwTmFDcDBKclpmRjFqKzNmMU5GYUx3OGU3TlFIZWc3YUdCc3dXTFNiOTY5YTBhNEZENVZ0bWVrNWFDTmVERlRZSmU5Ti9nSDBRWUlYNVp1djZRbTJEZitvMEU1NWZjcUQzVy9YcmVCbW5wMTVSMUh0K1pPV1BCamFKM2p4OEtabWo5WjZlYWp6ZjI3YVByZGZ4dGlBQVRLN2VsTnJoZ2F6N2tIYjRUZk0rd08yeXRCZlVYOTRjMnpITHRtY3ZEcGgyME43OXN0YTlXaG9qK0FIYlQyaSthTzFYaDVpOXNwYm41d2RIQmdiME5mVXIwMlp4SUtyVmhnYjBFOVJmK2JTcW1qaGQrYTgzQmhtcjFwcDNjT2hEYko0ektOcjIzRzAxc3ZOTEp6eG0rNUJHMk1EK29pMlpXMUxqdFo2QlF2UmJsblRQV2dqWGl4VzJPVm5OUHdCOUVHQzUrVXgzK2gyMjhiblE4UHkrdlQ3M0ZwenROYkx6V0wrc1I4VkZmRmlzZUNySHoyMmJidGtjenpFYk1jSjI3TEkySUJGTXR0OGJPdDJ5ZVlFejhxRGJqUm5xd3lMRlBWWlY3WGtBK2o5QmMrcjQzZmNYOFRXUGlFYWt2amFsRWw0aUZsMTB1TjVpeDhSalFoKys1bmx6TURQNDZUOXplZ0RuNklxSG5vN1l3TjY1ZkZ6RjcrU0QvNmY3aUhaSm9RSHJ3ZitWM2pydkhibVY3eDVNVjhXVC92dDhLOUlOMDhzdGRMWncyOG14cjdHN2NSYm54LzRJZDRRVjMxcXYzUnYzdktIencxK2xIcnQ4Yng1MFdQUXpUdXpuajB5SnRwZTlmRGl4dTFEdjRJM0wzcDRHTkptcUE1SWVUQVExbStmR1hLRG9CTXZldm1RKzFKdDJHV3F5ODlycTRaOUkrQ0VEYktJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0twaDhBUzh0VExsYW5YR3p2RUs4QW9aNlNJdDcybXpsdlhSMFNyUlU2MzkyVmFLbTlSN3h0RjN6TjE5Y2tYTyt1WGNFVExyYzNpTGZ0M1B5NUk4cEViMTR2bmhlYVVZaFhRRzU1c3JFaDJVckxnSGcxcEhyenBsbG1tYkRQQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbEYwdy9RVm5uS3hlcVVpNjBjeERzQVBiVWY4ZmEzNnZ4MXlmTE5YcmwxVjZxMVZoVGk3U2Y0bW10V0pWenZ6bDNCRXk2M1VoQnZmLzdjNFdWSXRGU3hNNlpaYWFVaDNnRnl5MVBGRzVMK2NMaUNFTzlncWVKTnM4d0t4RDR2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCVk5QOEI4U1IrbVNya1lwcUZWOGRJVHh0R21lRmQ5ZmwyZGFxM3M1Vy92U3JVV3BxUTk4UVpmZTAxSXVONVBkd1ZQdUJ5V1gzdmlOZlB0aDNZUzVlc3pPNUs5NURFdGJZclhjaXRTeFJ0U3JZVHBhVlc4WnBZcTNqVExZS3JZNTRVczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvV3Nva2k0bU5jSkY4T0tWMVJOUHdFd29lS3laRXQ1L3RLTnU1S3RocFd2dURMbGFyZnRDcDV5UGF4b1JabHNLWi9aSHBNdGhuMUFNWk5zcVJoUy9uQ0lsWSt0TXNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNqNlA2LytsY3NWQzc1a0FBQUFBRWxGVGtTdVFtQ0MiIGlkPSI1MWIyMTc1ZTNkIiBoZWlnaHQ9IjUwNyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIvPjxtYXNrIGlkPSJiODU2ZWNhZjBmIj48ZyBmaWx0ZXI9InVybCgjNzI2ZDQwZTI4ZCkiPjxnIGZpbHRlcj0idXJsKCNiYmYyNWY5N2U5KSIgdHJhbnNmb3JtPSJtYXRyaXgoMC4wNDQ2OTU5LCAwLCAwLCAwLjA0NDA3ODgsIDAuMDgxMDc5MywgMy40MzcwNzgpIj48aW1hZ2UgeD0iMCIgeT0iMCIgd2lkdGg9IjcwMCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFyd0FBQUg3Q0FBQUFBQUxaQlBXQUFBQUFtSkxSMFFBLzRlUHpMOEFBQTRMU1VSQlZIaWM3ZDE5cUdWVkdjZnhaKzI5Nzd3NHFZT3ZxVTFOWm1vNWxwS2xraFJGVVJTSklSVVdrcEFVaVlIbEg0cVFFQ2hCZ2pLVmFHcU9SbEZoTDRoQ0tiMElrdVZMbVRxR0dHSXZHbE5ONCtUNDF0bDdyNmMvenR5NTk5eDd6cm5ubkxsbjdmMjc4LzM4T1Z4WWUrQTcrejUzclROM21RSFRWdHh3aUlXbUh3SVlYMkdYK1hXV04vMFl3Tmh5TzkxclA5dUtwaDhFR0ZPdzFVOTR4N2UvMnJLbUh3VVlUMjdYZWNjN2ZnZFRMOFFVZHBaWE1YcnBGekk0UUVwbWgvM0xLNDllZTNrQ1A3UkJTYkRidmVQUm81ZitZTk1QQTR5aHNBdTg5QmpkbzNmOHF3d09rSkhibS83bnRVZDNqekZHZncrREEzVGM3NlZIZDNlUFh2blRyMkxMQVJvS3U5STdIcnZ4ZXZTT2Y0Zk5Ya2pJN1YzZGFXRjN2REZXZmc1akx3UUUyKzhwcjN5MlhmZm90ZTk4RGU5ZXRGOXVOM3RuWHJ2dTBVdS9tNmtYclZmWXg3MmFHeHE2ZzRPWGZqR0RBMW91c3lOMzdONGw4NTdCb1Q2Si9USzBXN0NmTHhnYVpnZUhSekltQjdSWllWL2NzOFBiT3poMC9HcGV2V2l4M041U0xSb2FkdStYMWY1QnhsNjBWakQ3UTc4WDcrNkR0cjhmeU9DQXRpcnNxajRENzl4QjIvZlo3RVZMNWZZK3IzdDN5WG9HaDlMUFkzQkFLd1U3NEc4OVIyc0xYNzIxdi9CNjNyMW9vOHkrTjNCb21OMHYrM1hURHduMFVkaTVYZzRhR3JxRGczZjhNZ1lIdEU1bXIzdSs3eTdaL0ZkdmRIOEh1NzFvbjE4TzJDWHJIUndlWDhWK0dkcWxzRXZtZlFCOWNMMGQveWF2WHJSS2JtL2JQUllNanpmRzJqL0MySXNXQ1ZZOHR1VFEwSDMxVnI3dEVQYkwwQjY1YlI1aGFKZ2RISDVDdkdpTndqNDArR2h0NGVEZ3BYK1d3UUV0RWV5Z2Z3dzVXbHY0NnEzOTVXTjU5NklkTXJ0dDZOSGF3bnBMdjYvcFJ3Yk16S3l3ODRjZnJTMGFIRHIrRlFZSHRFQm1iM2hwaWFPMWhmWEc2TzlrdHhkdGNPOUl1MlR6QjRmS24xekRRUnVhVnRpWHh4aDRaK3Z0K0EyOGV0R3czRTRmNVdodDBlQlFjZFVLR2haczlSTWo3NUxOZi9YV1hMV0NodVYyL2RoRFE3ZmVqdC9KMUlzR0ZmYlJoYi9iYWVSNlMvOENnd01hazlsaC81NWdhT2pHeTFVcmFOTHN0U21UaUY3NkEwMy9CYkRQbXJzMlpiSjZ1V29GVFpsM2JjcEU4WExWQ2hwMC81aEhhd3RmdlZ5MWdtWVVkc1dJSDBBZlhHL0hiK1hWaStSeWUvZjhhMU1taWpmR3lqL0oySXZFZ3ExN2FzSmRzdm12M3RwM2J1Q2dEV2t0dmpabHNucEx2NHVwRjBuMXVUWmxvbmlqZDdocUJVbjF2VFpsc2xjdlY2MGdyV0EvVzRhaG9WdHY2WC9rcWhVa1U5aEZlM0cwMWhzdlY2MGdwWUhYcGt4V2I2ejlBNHk5U0NKWUdIUnR5a1QxZXVYUHJHZHdRQXI1a0d0VEpxdTM0ejlnc3hjSkRMMDJaYUo0WXl6OTB3d09tTHBnQi94MXI0L1dGdFRMVlN0SVlxbHJVeWFydC9SN212NkxZY1ZiOHRxVUNldmxxaFZNMndqWHBrd1dMMWV0WVBxV3ZqWmxzbnBMLzlNTSsyV1ludEd1VFptczNvNWZ5NnNYVTVQYktlUC9icWNSNCtXcUZVeFRzSHkwYTFNbXF0Y3IzM1l3KzJXWWp0M1hwa3lsM2U3ZzhHUGl4VlNNY1czS1JQRnkxUXFtWmF4clV5YXFkOVNyVm5nN1kwekJ2blZFbWZ2MGRyT0NaOVdhTFJhWC9FTDJKRENlb2o3LzBxcVk4azVzWG03TTdpbVd6aGNZUTJiSGpIZHR5a1NEUTR6UnorRE5pdVUyN3JVcEU5WHJsZjk1TFFkdFdFNjdyMDJaZXJ4Y3RZTGxsdHRwMHpwYVcxanZDRmV0OEdMRzZJS3ZmdVM0ZXBvN0RYdDRpTmwvTm0zTGh2M1F4bFlaUnBmWjV1T211a3MySjNoV0hueVRlWUtsc0MrWS9OcVVpUWFISmE5YVlXekFxTEo0Mk5aRDB3d05adDNCb1R6NThid2UvRUJwSGdRcmdOdU5oeVlhR3N5NkIyMHp0OWpnZHRtTXdLaUtlTUdYcWhsUDk4MDZlRjV1V1BzTER0cXd0L2J5MnBUSnh0N2hWNjB3ODJKVXZ6dTFLcElORFdabTVxSE8vM0xpQzJIQW5nTXpMMFpTMkJXbmxrWGluYXZnZWJueFdpTEZYbG1HYTFNbUhCd3FQMmZRZmhsakEwWVFmTC9Iams2M1N6YkhROHordSttWi9nZHR2SkV4Z3N5dVBUcmhMdG1jNEZsMTRNMEREdHJZS3NQU2l2b1RWOVI1UTkrbjgrcU5MOTdYZDcrTXNRRkx5dUpSVzlmSHJJRVhyM1VIaDNqS3cvME8yaGdic0NTM205YVhEYlZyd2JNcTI1TFZmVlpuYk1CU2lualJoZFZNUSsxMjk4dU8zUC91bkErWVlXekxlbTNLaFB0bC9hOWFZZWJGY01IRDcwOU9mYlRXeTBPZFA3dHA1NktETm1aZURKZloxMDR1RzIzWGd1ZmxVZGZ6b3NXWWNudi9OSCszMDhpVFErbm5MUm9jcUJuREJEOWc2NFltanRaNmVZalppeWMrdmVDZ2piRUJ3d1M3YmtNalIyc0xIc096YXQyaTN3REZWaG1HS09wekwyL3NhSzFYWGg1ZDN0dDcwTmFDcDBKclpmRjFqKzNmMU5GYUx3OGU3TlFIZWc3YUdCc3dXTFNiOTY5YTBhNEZENVZ0bWVrNWFDTmVERlRZSmU5Ti9nSDBRWUlYNVp1djZRbTJEZitvMEU1NWZjcUQzVy9YcmVCbW5wMTVSMUh0K1pPV1BCamFKM2p4OEtabWo5WjZlYWp6ZjI3YVByZGZ4dGlBQVRLN2VsTnJoZ2F6N2tIYjRUZk0rd08yeXRCZlVYOTRjMnpITHRtY3ZEcGgyME43OXN0YTlXaG9qK0FIYlQyaSthTzFYaDVpOXNwYm41d2RIQmdiME5mVXIwMlp4SUtyVmhnYjBFOVJmK2JTcW1qaGQrYTgzQmhtcjFwcDNjT2hEYko0ektOcjIzRzAxc3ZOTEp6eG0rNUJHMk1EK29pMlpXMUxqdFo2QlF2UmJsblRQV2dqWGl4VzJPVm5OUHdCOUVHQzUrVXgzK2gyMjhiblE4UHkrdlQ3M0ZwenROYkx6V0wrc1I4VkZmRmlzZUNySHoyMmJidGtjenpFYk1jSjI3TEkySUJGTXR0OGJPdDJ5ZVlFejhxRGJqUm5xd3lMRlBWWlY3WGtBK2o5QmMrcjQzZmNYOFRXUGlFYWt2amFsRWw0aUZsMTB1TjVpeDhSalFoKys1bmx6TURQNDZUOXplZ0RuNklxSG5vN1l3TjY1ZkZ6RjcrU0QvNmY3aUhaSm9RSHJ3ZitWM2pydkhibVY3eDVNVjhXVC92dDhLOUlOMDhzdGRMWncyOG14cjdHN2NSYm54LzRJZDRRVjMxcXYzUnYzdktIencxK2xIcnQ4Yng1MFdQUXpUdXpuajB5SnRwZTlmRGl4dTFEdjRJM0wzcDRHTkptcUE1SWVUQVExbStmR1hLRG9CTXZldm1RKzFKdDJHV3F5ODlycTRaOUkrQ0VEYktJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0lGN0tJRjdLSUY3S0twaDhBUzh0VExsYW5YR3p2RUs4QW9aNlNJdDcybXpsdlhSMFNyUlU2MzkyVmFLbTlSN3h0RjN6TjE5Y2tYTyt1WGNFVExyYzNpTGZ0M1B5NUk4cEViMTR2bmhlYVVZaFhRRzU1c3JFaDJVckxnSGcxcEhyenBsbG1tYkRQQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbkVDMW5FQzFuRUMxbEYwdy9RVm5uS3hlcVVpNjBjeERzQVBiVWY4ZmEzNnZ4MXlmTE5YcmwxVjZxMVZoVGk3U2Y0bW10V0pWenZ6bDNCRXk2M1VoQnZmLzdjNFdWSXRGU3hNNlpaYWFVaDNnRnl5MVBGRzVMK2NMaUNFTzlncWVKTnM4d0t4RDR2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCRXZaQkV2WkJFdlpCVk5QOEI4U1IrbVNya1lwcUZWOGRJVHh0R21lRmQ5ZmwyZGFxM3M1Vy92U3JVV3BxUTk4UVpmZTAxSXVONVBkd1ZQdUJ5V1gzdmlOZlB0aDNZUzVlc3pPNUs5NURFdGJZclhjaXRTeFJ0U3JZVHBhVlc4WnBZcTNqVExZS3JZNTRVczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvVXM0b1VzNG9VczRvV3Nva2k0bU5jSkY4T0tWMVJOUHdFd29lS3laRXQ1L3RLTnU1S3RocFd2dURMbGFyZnRDcDV5UGF4b1JabHNLWi9aSHBNdGhuMUFNWk5zcVJoUy9uQ0lsWSt0TXNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNnaVhzZ2lYc2dpWHNqNlA2LytsY3NWQzc1a0FBQUFBRWxGVGtTdVFtQ0MiIGhlaWdodD0iNTA3IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ii8+PC9nPjwvZz48L21hc2s+PGltYWdlIHg9IjAiIHk9IjAiIHdpZHRoPSI3MDAiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBcndBQUFIN0NBSUFBQUNoYmR0ZEFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQWdBRWxFUVZSNG5PM2RUWk1reDMzZjhWLzJUUGZNem1CM0FYS1hJRUFDYk5CMmlBQWNJZHJTeVJlczNvRENCNEkzWC8wMlJMNE9SL2dGRURlRjc3djIyV0dHSTRRRkhhS3NoU2tKWEVBRWlhVjJaM29lT24zb3ArcDZ5TXJ1eXF6SzZ2cCtRZ0o3cXY5ZDlkOStxUHBYWmxhV0VRQUFxUERvc1NTZFREUzcwb09IR28vMXhZMysrd2Q2LzFNOS9iZGRKOWM2MDNVQ0FBQWs2dU5mNk9XWlhwM3J0ZGQwZGlvcldlbVBSdmVlNnRmL1N2ZGY2TWxmZEoxaXUwWmRKd0FBUUlxTTFhY2Y2UHlWN3QzUm5SUE56ZkpFKzc1MC9ZN3V2OUIwcXAvWnJyTnMxM0hYQ1FBQWtLTDNQOVZuSCtyTm1VN3ZhWElwSTFrckk4Mmw4VjJkdnEzcHUzclNkWkl0bzZVQkFJQzhSNDkxTXROUFB0SFJxYzRYRmNPNlI5L0tTbU9qbjB2NmNqbm9ZU0NPdWs0QUFJQzBMRG9kTHA5cjhtMjlkaXBaMlpHTWxUVXlScEtNMGZGTUQzNHY4L2M2ZTZrZi8wYzkvYVRibEZ0Q1N3TUFBRnVlU05PcFR0NlRPZE44cmtXZmhEVXlWdGJLR0ZrcldUMjQxZjJ4emw5MW5XNkxLQm9BQU5oNDlGajZVaitYSmtaSGkyNEpTVWJHU21aWk1SZ2pHWTJzeGllYVBkVExzNkYwVW5ESkpRQUFTK3RyTFBXV0h0eXNCai9tRHBXTDBRMkwzZ3JwK2twLytFWm5MM1grU3AvOHRKdTBXOFBWRXdBQWJKeS8wdVIxblZ4cnZpNFByS1JNNmJCdWJMQ1MwV1NpTjA1MS9KVSsvV0E1N3VHQTBUMEJBSUFrUFhxc2wyZTZmS2p4aVc3TmN0aWpsWXdwTkRZczZvYVJySldWanUvcTRzLzAyWWY2cUp2RTIwUFJBQUNBUHY2RnpsN3ExYmxHcjh1ZXlkaUt2Z2xKa3RHcXBXSDF0eG5ycjNUNFYyQlNOQUFBaG00OStlUDlFNTJjeU5qVjhFZG5YOFB5U2dvak85ZmtoWDcxSytucGdVOFR5WmdHQU1EUUxTWi8vTzRyblk4MHY5M1VDbFV0RFF2THpvdFZpWEIxcFpQM05QM0JJVThUU1VzREFHRFFzcE0vbnB5c2xwcWFpbUVWdGJ5TGxiRWFIV3R5Nk5ORU1pTWtBR0M0MXBNL25qelErVVRXTEljM0dpTWpyM2tKRm1HTHUxa2R6ZlR3b0tlSnBIc0NBREJjVDZSSFV6MGY2ZVJDdHpmTDBRekdyNWxoYlRIdjArSWwzN25SOFJ1Nk9kQXJNT21lQUFBTTFIcnl4L0ZJdHpmUzZub0lXemNFTXNlYXJSa2QvdVJQZGZHQlB2dFE3MzhhUHVkdUhWWUpCQUNBbi9Ya2ozWTErZVB5bGxSMnIyUGphcmJweFV5UnN4T2QvbEsvL2xlNi8wSlAvaUp3NWgyaXBRRUFNRGliYXl6SGVuQ3QwWHBhNlAwcUJrbUxheTlYTTB5Zlh1bjYrN3IvUXMrbW04c3JEZ0JGQXdCZ2NIN3dUSjk5cUgvOE54cWZhR1NrK2ZLV1ZFMkdJQ3huZkZxc3dXbzgwZWxVbjA4UGFwcElpZ1lBd0xCOC9BdTk4YlUrZXFMak85TFpwbmxnY1JGRUUxYXk4K1g4RGZaRVkzTm8wMFF5cGdFQU1DREc2djFQOWVGVDNid3JjNmJSYURXVUlkd21sak5GV2htcjQ3RysrSzJtVTAybitsbi9EN20wTkFBQUJ1UWo2Yk1QZGZubk92dTJ6S0ppV1B3MzBNaUQ5UTB3RjEwVk4xZDYreTFOcDJGVzNybitsejBBQVBoNTlGajZRSSsrbzEvK2d5YmZiSm9FbW5kTVpDMVh1QmdoWVhYblZGWTZQdGF6WjcyL2tvSVpJUUVBZzdDWS9QRVBmNnZMbVVhdmxtZk5pOXRlaHoyQlhxeHdQZG5EelkwdUx2VDgrU0ZNRThtTWtBQ0FvWmhPTmJ2VzdFWWpzNW5HTVd3enc1cFp6ZmdrbzhsRXI1OXEzUDlwSWlrYUFBQ0g3OUZqUFh1bW0yc2RqM1F6MzF3eHNkUE1qenV4bWRtaXJEUytxNi9mVzA0VCtUVFdOcVByYmJVREFJQ2Y5ZVNQOSsvcFpDeHJtczNqNU0xcVdaY3NhcFFYMHYybi9aNG1rcXNuQUFDSGJEMzU0MnRIbW93MU53SG1jZkxkZE9iZVY4YnFyblR6cnU2LzBIUzZIR0RSTzNSUEFBQU8yZnVmNnJNUDlmQ1BNcGU2c3lvVTRyY3lyRGEwdWdMVEdvMnNKbS9vaDIvcjNYZGEyWFlFdERRQUFBN1dvOGM2bWVrbm4ram9qaDU4WjUvYlhqZTAyTkI2Wk1QMTliSlkrYktmMDBReXBnRUFjSmlNMVErZWFmcE1yNS9xNkZ3anM3eGNvcldLWVdNOUl0TEl6SFU4MFJkZjlIS2FTRm9hQUFDSDZTUHA4NmxPMzlQNG5zeElXcHp4bTJDVFArN0FaSzZrTUpwYnZmMjlYazRUU2RFQUFEaEFqeDVMWCtxdnBQRkk5bmExZEI3M01rdVh4WXhQUmthNnZkWFJrZjcyMTNyMnJHZWRGTXdJQ1FBNE5PdkpIMmN6bVl2VlZRelpXMWQzWVRscnRXU01ydm81VFNSWFR3QUFEdEIwcXFzcjNWNnR6dTl0Wm9yR2pxd25iRmkwZGh4UDlLMHpIZlZxbWtpS0JnREFRVmxQL25nMDB0VmlpdWpWemE4N1B5NHY2NGFSTk5lUjBmbDM5RS9qUGswVDJma2JDQUJBTU5uSkg4ZGptZlhrajByb2lKZTl1K2EvakhUM2Izb3pUU1FESVFFQUIySTkrZU85TzVxTXRXeGJXTFQ4SjFNeGFEMVh4RWlTenVlNmZxYzMwMFRTUFFFQU9CQ0x5Ui9mbk9uMG5rNW1tM2tmVXlvWUpDM2JHT3g4T1ZuaytLNU8zOUwwQjNyU2RXSzFhR2tBQUJ5Q3plU1BwenEvWEJZTTFpNXVHNVVXazd0ZGx0VjRwSjlMU242YVNDNjVCQUQwM3FKaC8vSzVKdC9TK1dSNUJxL1ZSUk1weXRRTnh1am9TZysvbHZuNzFLL0FwS1VCQU5CN1Q2VHBWQ2Z2eVp4TFdvNFlTUDA2UnJNWkVXbXNIdHpxL2xqbnI3ck95b21pQVFEUWI0dkpIMzh1alkyT3pHcXU2UG55TXN1VW1VemRNTElhbitqeW9WNmVwZHRKa2ZqN0NRQ0F5L29hUzcybEJ6ZVNObmQ1Nk1zaHptcVo3Vnk2dWRJMzMranNwYzVmNlpPZmRwMVpBVmRQQUFENjdmeVZKcS9yNUZwekkydFhReUNUYjJiWXNNdi9qS3hPSm5yOVZPTlVwNG1rZXdJQTBGZVBIdXZsbVdZUE5ENVpWZ3hhdC9sM25kc08xbDBxMHEwMHZxdmZ2N2VjSmpJMWZYcFhBUUJZeTA3K09Ka3Nid1JsazcxY3dzMXV4a1VhNlEvUy9hY3BUaE5KU3dNQW9IL1drejkrNjBTVHNkVHJpa0hTYW01cFdjMnQ3aHZkSkRsTkpHTWFBQUQ5czVqODhYc1grdTVFbDZQTk9YcC9oajl1Vzk5WVM4dExQMDVlMDUzMHBvbWtwUUVBMERQWnlSOHZScXRLWWQ3YmltRmxVVEVzL2htM1NuR2F5RjYvdlFDQXdmbVoxYk5uZXZaTWI5elIrRnh6STdPb0dIcDB1WVRENm5yUnhVMjJ2anFTK1NLaEt6RHBuZ0FBOU1rVDZkRlV6MGM2dWRETmpZeGs1K3B6ejhRMnM1bG53bHA5eCtyNERkMGtjd1VtM1JNQWdON0lUdjU0ZTdXYzRXQXhHcUMvUXlEenRtZW0rcE0vMWNVSHFWeUJlVER2TVFEZ3dLMnZzYlJ2NmVITjhpYVdpK2tORHU5Z3RwNWVXa1pYSnpyNVpSSlhZTkxTQUFEb2dmVTFsdloxUGJoZVhXaWd2czNqNUMxN284N1RtYTYrci9zdjlHd3EwK2tWbUJRTkFJQWVXRnhqK1hjZjZILzhXQ096dkVaeGVibkJnVnFQaUp4Ym1UczZlVStmVC9WUnB5a2Q3cHNOQURnVUgvOUN2L20rM3ZrSC9iOGY2NTNaNnRZUzlsQ3VtS2l5R1Bsb1pZem0wdXl1L3Z4ZFBmbFNldHBaSjhVaHY5c0FnQU5nck43L1ZCOCtsZDdXN1QyTnpLYXovL0NQWWF2cHBXVTBrbzZPOU1Wdk5aMXFPdFhQdXZqSDB6MEJBRWphUjlKbkgrcnl6elY1VTZQUlpycm9ibnYzVzdKcWFUQldWcnE1MHR0dmFUcnRMQjJLQmdCQXVoYlhXUDZWWk1hNm5DMW5MMWkzTkF5Q2taYlhsa29qSFIzcDE3L1dzMmZkVEJONTFNRTJBUUR3c0xoWDB4LytWcGN6alY1SjYyR1A1cERIUHhabDY2U2JHMTFjNlBsem5iM1VqLytqbm43U2FpYk1DQWtBU05kMHF0bTFaamNhclpybzE5Y2lEc2RtREllVk5acE05TzJKUmwxTUUwblJBQUJJMGFQSGV2Wk1OOWM2R3Vsb3ZqMHh3NUFxaHFYTTlOSno2ZHNuK255Nm5DYnlhYXRaQUFDUW1QWGtqL2Z1YVRLV1RPYW8yWFZ1WFZrTWExak1NRzJsbDNPOTlxdTJwNGxrSUNRQUlDM3J5UjlmdHhwUFZpTVkxcmVaR0NxenFoaGtKYXV6a2E3ZTBmMFhtazZYZ3o5YVFORUFBRWpMWXZMSHI5L1MrSjgxMHVidUVwM2Y0N0Z6ZGpHNFliUnNkeG05cnZkKzJPb1ZtQlFOQUlDRVBIcXNrNWwrOG9tT3ptUS9sQmFqSG9mZE1iRm0xdU5Bcll6UjhlMXllTWVYWDdaMEJTWWZBUUFnRmNicUI4ODBmYWJYNytqb25zeDhPZkp4RUpNL2VsdmNvMnM1dzdUVjhiaTlhU0pwYVFBQXBPSWo2Zk9wVG4rbzhWMlorYW9MbjRwaG16R2JlMUpZby9sTTMydHJta2lLQmdCQUV0YVRQNDRYRTBVdkxoT1lVekdVTUhZem5mYjhXS08ycG9sa1JrZ0FRUGZXa3ovT1pqSVgwbXJrNDNvVUpMYVlyV2tpYjI5Ym1pYVN5WjBBQUVtWVRuVjFwZXNiR1NNN1gwM01vRUZPNWVUQmJOY05rNGxlSDJ2OEt1NDBrUlFOQUlDT0xTZC92TkhSa2E2dUpLM3VCMDNGNExTY0gzTzByTEhHSTMzOWc3alRSUEpwQUFDNnRKNzg4ZjQ5blp6SURuYWk2SDB0M3k0cmEvVGlWdmYvVDhScEloa0lDUURvekhyeXg3dDNkSFNzZWVZR0UvQmsxak0rV2QwOTBuWE1hU0xwbmdBQWRHWXgrZU9iTTUzZTArbHMxVWxQTS9ndWxtL2FmSEYxcWtaM2RmcTJwdS9xU1lSdDBkSUFBT2pHWnZMSEU5MjlYQzFkWEd3SmI1c1JrY3UvTlRiNnVhUUkwMFJ5eVNVQW9BT0x4dlBMNXhwL1M2OU5aQ1dOVnBkTGlLYUczU3ltbGw1V0Q5TFJsUjUrTGZQMzRhL0FwS1VCQU5DQko5SjBxcFAzTkRyZjNGZGlNVEVERmNQT3pLYTlZWEZuaWdlM3VqL1crYXZBMjZGb0FBQzBiVEg1NDgrbGlkSHgwZXBFMlVwMFREU3d2b2JDV0kyc3hpZTZmS2lYWnlFN0tTam5BQUN0V2w5amFkL1N3eHRKcTlzb2NLVmxZK3ZKTFJZelBsMWY2WnR2ZFBaUzU2LzB5VThEckorckp3QUFiVHQvcGNuck9yblc3V3E2YUNxR0lCYnY0WHFteUpPSlhqL1YrS3RnMDBUU1BRRUFhTStqeDNwNXB0bERqVTgwWHh6RHpQTDJTd2hpTTdKQnVwWEdkL1gxZTh0cElwdmpVd0lBdEdReitlTjlUVTZXdDdLMDNQazZOS3ROajQra0YwYjNuNGFaSnBLV0JnQkFHOWFUUDk2ZmFISzhIT1MvYUdaQVdHWjkrZVZJTXJvclhYMC96RFNSakdrQUFMUmhNZm5qZDEvcGZDUTdrbG5NZkR5bnlUdUs5YkFHWXlXam8zT2R2SzNwRDVwT0UwbExBd0FndXMza2o2YzZQZDFjR1JqcERzNVl6c2E5bWl4ck5OSWt4RFNSekFnSkFJaHJQZm5qNUZzNlAxa1ZDbWJaNzQ1SXpHcXlyRVhkTUo3cHdlK2JUaE5KU3dNQUlLNG4wblNxMC9jMFB0dlVDbHd4MFFKalYvY0xOWm9iUGJqVlcyL28vTlh5Q3N3OVVEUUFBQ0phVC80NE5yTEhXdC9Da282Sk5oZ1pzN3pWdUpGR1ZuL3lwN3I0WVA4ck1QblFBQUN4RkNkL1hJNWpvSm1oUll2WkljMXFkT1RsaVU1L3VlY1ZtTFEwQUFDaVdGOWphVi9YZyt0bGw0U2xZNkoxeTNkKzllZGt0cndDODlsMDUwNEtpZ1lBUUJTTGF5ei83Z1A5ang5clpHVG5xL1BkcmhNYm9rWHJ6a2pXYWlTWk96cDVUNTlQOWRIdXF3RUFJTENQZjZIZmZGL3YvSU4rOCsvMC9hdmxWRTdMNlkwNThuUm5mWStQeTd2NnMzZjE1RXZwNlE2ZEZIeDBBSURBak5YN24rckRwOUxiMG4xcFVTcHdWNnF1MmUyN2lSNGY2WXZmYWpyVmRLcWYrWDB1ZEU4QUFBTDdTUHJzUTEzK3VTWnZhbTZXZDVld29tTG9tREZiOTZTNHVkTGJiMms2M1dVTmNSSURBQXpVbzhmU0IzcjBIZjJ2ZjlENEc0Mnk5MTNrbU5PMTFhd055N3JoenFtc2RIeXNaOCs4T2ltWUVSSUFFTXhpOHNjLy9LMHVaeHE5Mmt6bFJNZEVJb3cyMTE0YTZmcEdGeGQ2L3R4M21raHVXQVVBQ0drNjFleGFzeHNkVVRHa3lXN21scGJSWktJSEU1bXZsdE5FdWlmZG9tZ0FBSVR4NkxHZVBkUE50WTVHT3BvdjV4U2lWeUk1aTJKT3l6a3paUFN0RTMwK1hVNFQrYlR1cFFBQU5MV2UvUEhlUFUzR01tWnpIMHVPTkFsYURtNVlOUzI4bk91MVg5VlBFOG5WRXdDQXB0YVRQNzUycFBGazNYTk94WkF1bzJVemc2eU0xZGxJTisvcS9ndE5wOHVCS2FYb25nQUFOTFdZL1BIaEgyVXVkVWVTNFlxSkhyRHJhU0xuR2ttVE4vVER0L1R1dTY2WDBOSUFBR2prMFdPZHpQU1RUM1I4Unc4ZVNPdEpoRVRGa0xSRmU5QmlmSU9rbTZ2bGVOVXZ2OVNqeDVVdkFRQmdUOGJxQjg4MGZhYlhUelYrYlRQem8raVk2SW5OTkpHU3RScFA5TVVYbGRORTB0SUFBTmpmUjlMblU1MytVT043cTVrZnpmSzJpdWlGNWVXWGkvK09OTGY2M3ZjcXA0bWthQUFBN09uUlkrbEwvWlUwTWN0YlVzbEk2NHN0MFJQR2J0b2I1cmNhSGVuWHY5YXpaeVdkRk13SUNRRFl4M3J5eDlsaThzZk1MYW1ZeXFsbnpOWWNYTmZYZWxVeFRTUlhUd0FBOWpTZDZ1cEsxemV5bzh6WktxME0vYlM4Mk1WS1JzY1RmZXRNUjRWcElpa2FBQUE3MjB6K2VLU3JheG03dW9rbE0wYjNWK2FERzFtOTloMzkwM0YrbWtnK1d3REFidGFUUDk2L3A4bDQxY3dncnBqb1A3dVpXOXBhL2N0SWR6L2RtaWFTZ1pBQWdCMnNKMys4ZDBlVHNUUmFqbjgwbkliMjMzcm03OFZuZWRmcStwMnRhU0xwbmdBQTdHQXgrZU9iTTUzZTA4bE1kaldsSUwwU0IyQngzOHQxWjVPVnhuZDErcmFtNytySk9nQUFBQitQSHV1YmUvclhmNmZmZjZqWDU1dEpnVGlZSEJTN21tRmFza2F6ZS9wdjcraWpMNlduWEhJSkFQQ3phS0MrZks3eHQzVjJ1cHFCMkhCWHFvT3pHdGF3K0ZpUHIvWHdhNW0vMTlsTHhqUUFBUHc4a2FaVG5ieW4wWmxHODlXOWptaGxPRWpyMjVvYnllckJyZTZQZGY2S2xnWUFnSWVQZjZIYmUvcXY5L1grSHpXNVh0MnFRQkpGdzRGYVgwWWhxNUUwc2pMSEZBMEFnRHFMam9uYlgrcTcwbXRYa3BhOTNWcmZ6WElsVzBtVUxpOE5XOXdxU2RVQnhUWGtlSWJ0cE1rV3U4eS9ySWh6di8rVlllc2JXUm1aWTlsekNrUUFRSjFIVm8ray8vbC9OWmxwTkY4MVhGdEorZTZKOVo5Vnk4dkRURDVpUGFWeDFRb1hpOWJES1hKaFc4R0ZzRnk5a3N1cCtHdzJ6SkdZWjFqcy9MZUNDaytXeG00dHoyekEya3lZa2JWY2Nna0E4UEJ6NlQrOG9lLzlrK2J6MWN5UGt2WXJHcmFQUnBMc3ZHU0w2N1lIMXdtOTNTek1oZG15c09JWnRqc3N0L0pjWXZJTGF6Ly9rZFh0OXMybEhPOS9iVzFudGFrUmFXa0FBTlJZMytmNjMvK2RIdnhCOTE0RVcvUE5zZXl4ekptT2o3ZzNaaGpqaWV5VjlFcjJXdk9yQUN0Y2ZQZ245M1I4d3VjREFQQ3dyaHQrOG9remJuZGZQZFMzN3V2T1hjMHVBNjk1bU14SWY1em8zVy8wKy84YmVNMGZmc3dsbHdBQUQ0djdITDcvcVg3ei9aQ3JuWjNvN0tXT3pQTG0yZ2pnUm44YzY3LzhtVDcvVWNpMTN2dSt2dnlVbGdZQVFOZiswLytXcEl2RmFheG5KMFhZTUIrZEpMWjcvbWF1VDkvVVoyOUsydHpTT2hRR1FnSUEwbEE2bnRBblBraFkrMXRzUC8vRzZKNEFBQUJlS0JvQUFJQVhpZ1lBQU9DRk1RMEFnRFNVenNXb3NubVJza3NjTXpDN1ozak9MWEhQcUZ3VlZwUkkvbkZRTkFBQVVsS2M2YkI0TEN4OTFoMVd1emE3VjFqVitqdlBQdzY2SndBQVNhZzZ6dHJxQTJMQXNHTE5FQ3Fzay93am9hVUJBSkFLeC9tNXp3RzFZVmpEVS8wOXRoZzJiTjNMRVE4dERRQUF3QXN0RFFDQU5LUTBpMUdQeFd4cW9LVUJBQUI0b1dnQUFBQmVLQm9BQUlBWGlnWUFRREoydW9kVGNZWUQ5MlVNcFdHN3JzU3hwR3BoVlZpay9HTmlJQ1FBSUNVcEhIZDdYVGN3RUJJQUFIU09vZ0VBQUhpaGFBQUFBRjRZMHdBQVNJS2RkNTBCNnREU0FBQUF2RkEwQUFBQUx4UU5BQURBQzBVREFBRHd3a0JJQUVBYXVNdGw4bWhwQUFBQVhpZ2FBQUNBRjRvR0FBQU9TN1FaTHhqVEFBQklnMTNkYkNuN1FKSXBESGZJaHRuTXdtS1lMVHhRUlZodWk1NWhqc1M2eXY5UzhWQTBBQUNTNGI2TFkvTXd4ejBrM2F2eURFc2gvOU9JUTBvcEdnQUFDYWs2M3JuUHlXdGY0b2h4Yk5SblZaNkp0Wk8va1hRWjhUSVVpZ1lBUUJMY2g3cmFob0JkVnhocVZaNkp0WmIvcFRTUFZqVXdFQklBZ0lOQ1N3TUE0R0JkU3FkaWNxY2VvS1VCQU5DOTUxMG5BQjhVRFFDQWpsMUtiM2FkQTN4UU5BQUF1a2RMUXk5UU5BQUFPalpiL0k5akVnTDNrdUpDNnplbFFkVW9DcCt3blNaUmNDOHBMbXlZZnpRTWhBUUFKQ1BnY2RjZGxuN2Q0QTdycUc2Z3BRRUFBSGloYUFBQUFGNG9HZ0FBcVN2ZTlxRTJPRlJZd0cwbG1QK3VHTk1BQUVqQzNDN3ZwRkFxMmVOdVVuVkQ3RXFDbGdZQUFPQ0ZvZ0VBQUhpaGFBQUFBRjRvR2dBQVE1TGdzSWlkZEhwYkx3WkNBZ0RTME5yaDhMRHJCc2RvMHNab2FRQUFBRjRvR2dBQWdCZUtCZ0FBNElVeERRQ0FORmpKK0EwUjJDbXNOamhnV0FyNU02WUJBREFJTVlZbzFnWUhERXM1L3hCb2FRQUFwS0xUeXdsUmo1WUdBQURnaGFJQkFBQjRvWHNDQUpBR09pZVNSMHNEQUtCcmwxMG5BRDhVRFFDQUJQeTI2d1RnZ2FJQkFOQzFTK203WGVkd1NPYXhWc3lZQmdCQUFuNHJuUmZPWk8xcXFxTGNjQWNUTHN3eEZaSWpySVhFUE1PSytjZnM2NkZvQUFCMGJYMmNLNDZGTEIwZEdUQnM3K21ZWWlmbUdWYXNNMDRqRGltbGV3SUFnQU1TczZXQm9nRUFnTU1TcmFXQjdna0FRQkljOTJZeWhYNzh2Y05LUndYVWhqbTI2Qm5XY3Y2UlVEUUFBRkpoU3crU05uOVFMRGxHZW9jVk4rRXpuS0RxcUJ3d3NURDVSeTRmNko0QUFDUXN4bjBqMjlUMy9MZFJOQUFBQUM4VURRQUF3QXRGQXdBQThNSkFTQUJBR3JydXNFY3RXaG9BQUlBWGlnWUFBT0NGb2dFQUFIaGhUQU1BSUEzK1l4cmFuQVJ4cHkyR0RVc1BMUTBBZ05UbHAwcjBPK0tHdk1Ga3hSYjNDMnNoLzBob2FRQUFKTUY5OFBPYzE5bG5uWHZmbU5wL0U3VmhMZVFmQTBVRGdNUDM4Uys2enVDQWZQTFRyak5BZCtpZUFBQUFYbWhwQUhEZy92UC8xTDljNkhhdTI3bWs2QzI1dlIzaXR1VEkzNDVsai9XWHY5SmYveWpPdG52OXhnMERSUU9BZzJXc0pEMzlmL3JnSy8zdVZFYVNrWjFMMHBGMHV4MWNYSkpkV0h4UStzTEZZL2VxUExjWU5xeDUvaVBKU0xPeHZqaGZ2ckhXRklKdzZDZ2FBQnk0eVkxKys1b20xNUlrcThXUmJpN2xEbm5GSmRtRnhRZWxMMXc4ZHEvS2M0dGh3NXJuYnlVakhWL3ArbDdoT1F3R1l4b0FITGlia1U1dXVrN2lJRmhKeDdyaXVERmdmUGdBRHBZMXNrWnZ2dXc2andNeW1aVTBRZ1JqVi8rbjdRZlpQNVZaNkE0cnJrcmJ3WTZ3WW5CdFlyazFwNUIvQkhSUEFCZ0dCdGtGWWxwNEo2dU9rYVhIWGM4d3gzRzM2cldPTlpjdUx6MmkxeWJtR2VhZmY4eXhKclEwQUFBQUx4UU5BQURBQzkwVEFJWWhjck10bXFNSEtZaW9YM09LQmdDRHdVRXBjWXNQcU8vVFkzVXVadFZBMFFCZ0tIS0hKTE85ZkwzRVpoNW8rM0ZWV05XcTFzL1didEV6c1JUeW53dkRSZEVBWUJDcUJxRzdZenpESERHZGhNWEwvNUpXZ0dHamFBQXdEQnpyQXVHTkhES3VuZ0FBQUY1b2FRQUFwS0YwMmlLa2hKWUdBQURnaFpZR0FNUEErU3ZRR0MwTkFBQWNsbWpYeGRMU0FBQklBNjFCUWNTOExwYWlBY0FnV0cwbUtqSkdOak9sa1ZIbXo4d01TdG13Wll4a3pHcFZ5anlsN1ZWcDlWcDVoNjIzbU1uWko3SFc4cy84Ynl5NUkxM3B6SkRGaGZuOHc0WDVMd2tWMWp6L3hVS0tCZ0JvSmpNeTMyNlAwcmRiLzFNZXRwbmdxQmhXMk1nK1lYYjdUKy9FV3N0LytiOHQzcitqOU1EWDVqeGEva3RDaFRYUFB6YkdOQUFBQUM4VURRQUF3QXZkRXdBR2czRjJ6VVh0bnVBRFNoNHREUUNHZ1FNUzBCaEZBd0FBOEVMUkFHQXdQQnNiQXJaSmhOMWlzdmxqTUJqVEFHQVlkcm9aRW5WRGpGVTEzMVoyTG9vbVlXWTFhVWVvTUFWS3pEUE1NN0VJS0JvQURBTG56TTIxT0VkRGhWQTFrMmNGdVZPWWo1YnpqNER1Q1FDQWwrVkJLdHA5RFpBK1dob0FETU04aFRQbC9vdDVYd05iK0lpeWJmQ21Jc2I5d3IzRFNwL2FPN0UyODQrS29nRUFzSXVZcmVLTzZaUGRjeWZIbU96Wi9RL2ROYkUyODQrSG9nRUFrQVphZzVMSG1BWUFBT0NGbGdZQWgyNG1uVWppQ29yR2VBTUhqNVlHQUlkdUpuM1ZkUTdBUWFCb0FBQ2twR3JFb00zOG55Tk1tWmpTWjB2RHFyYTRSMWlIK2J2alE2QjdBc0FBUEpSOXVYcGN2R290dTl4NmhHWDN5NllpUnRIQ09zOC9xdG9EcW4rWXozRzMrR3pWbnp1RmRaaC9aQlFOQUFiZ0srbHM5ZGk5SDYvNmM2ZXdHTmYvdVdQQ2huVitZUjlTUmZjRWdFTTM2em9CNEZCUU5BQUFjRkRpTlF6UlBRRmdHR2hnNzRWMlBpYlQ4KytETS8rWm9XZ0FBQnc2dTlleHpyTUEyQXFyZmtINzVVVHcvSjNQTjBYM0JBQ2d4endQa0dIREF1cFgvclEwQUJpR3hkN1VmZVBDTlo4dzkxV0k3WWQxa2o4R2hxSUJ3SkJVbklqWjNNSFJKNnlWTThSOUV2TU1TK1RVOVREa1A0Q0RSZEVBWUJCcWozM0pIa09UYXI2T2UyVHNkWUdTVHZJeFB5VEdOQUFBQUMrME5BQVloblJPQkh0dEdJM3dxRUpMQXdBQThFSkxBd0FnRGJuV0lMTWFZRmk2M0IxV2VsK3VnR0hXdWJ6Yi9HT2lhQUFBSkNsM0s4amNjbmRZa0p0VkJnbnJKUDlvS0JvQURBTmpHb0pnVE1Pd1VUUUFBSkpRck91eWt5SVhKMGd1N1NYd0NTdWRhM25kUytEWW9uOVl0L25IdzBCSUFBUGlibTZvYWdOT0p5ekJ4S0t5MjJuNHRObjdoQlZqbEhtSGc0UjFtTDhrelNzU2FveVdCZ0NEWUZkblllNjdJbGwxRjJZOWp1S200L3laM0trSFpoSGZTWW9HQUlQaHVTZnRlMWduaVNFcDBUNDF1aWNBQUlBWGlnWUF3QzZpOVpjamZYUlBBQmdHbXRtRHVJei9UbVl2VGpDRnAxUjR0alRNRkI3N2hHWFg3OGluOUNvRm43QVc4bzk4K1FSRkF3QmdGL0dLaHRMckJQWUxzMldQbTRjMVQ4d3piTy84STVkMGRFOEFBQUF2RkEwQUJzTlduTUJwK3l5dDZqSjU5K1BjYTZ1dXdTK210Rk5pcWVXUGdhRjdBc0F3ckE1NDFtWTZnbTJtdjdqNnVGc1NWbHlWcE1XZmR0V3o3TnlpNUJXV1Q2enIvREZ3RkEwQWhzSjk4dXcraTY0S3EvcHpqN045LzhTNnpUOGl1L1d3dGxMeEhQYTNGVmE4NTJTVHRUVUw2eVQvaGlnYUFBd0NMZXZwMjZOUzhmeFliY21qRUd0ckhOWkovazFRTkFBWUJxb0dvREVHUWdJQUFDOFVEUUFBd0F2ZEV3Q0FOTkNGbER5S0JnRER3QUVKYUl6dUNRQUE0SVdXQmdDRFVHeG95TjdmeDY2VzVDS0x0eFpTNWxKNVUzaGg5aXI2MGpCYjJJcFBXREd4VHZJSEtCb0FETWIyVVRFL2Q2S1JMUndiclpZdktRMnplNFhaN2NOeStjVE4yMkhGeERySlA3clNza2dWQ3gxRmphTkV5cFZGKzRXVmJycTBaT3NrLzVnb0dnQkFVdld4MFhQS29UM0NIRWRqejdCZHQ5ZzhyRTJsT1pRWFdkVXZ6SVZWdmJFN2haVnUycDFHMVlacVg3aEgvakhyQnNZMEFBQUFMN1EwQUFDU2tFTHJCdHdvR2dBTXcxd1N4NlhHdU4vbHNGRTBBQURTUUVrWEJHTWFBQUJBNTJocEFEQU14UXZTM0hNZ1pNTk01bkZwVERiTXNTclBNUC9FUE1NQzVyL3E1OEV3VVRRQUdBcXJ6UkZ4YzdsN2NVbHhvZnZhdWZVbDlIWnpIQzlkbGZ6Q2RraXMzZnl0ZEdub1F4ZzBpZ2FncVk5LzBYVUdCK1NUbjdhMG9WMHZxdmRabStQQys5Sm5QYmNZTnF6VVR2bTNwR29HcEdJRHlmclo0c1JIMmJDcWFTOTNEY3MxOE5TR2RaSi9OQlFOQUFCZnA3RTNVRFhIbEU5RjR6blZVcmRocmVVZkIwVUQwTWpIZnlQN1FycVZycmtZYlUvTEhlWlk5a2gvK1N2OTlZOWliZ2JOWEhhZEFMcEYwUURzeVZoSitzZC8xUGRXL2NFY2x2WmpKR3Mwc3BwTjlQeHMrY2JhY0NYWVREb0p0akx3TlI4MGlnYWdrY3NqVFU0MHU1UVY4OTQwWW8zT0xuUjlOL3lhWjlJTDZiWHdLd1lHaDZJQmFPUmlyRC9lYXRKMUdvZmhkcXpaVWRkSm9GYThheTduVXRsUXY2cWhoN25iUTFiZGdTQlI5SW9BQUNBQVNVUkJWTEwwUHBIdUc1RTNEK3NzZnlzVDgwZEUwUUEwTW5lUGI4Sk9UTWhlaWF5SDBnVWZVQkNYY2IvcWpoR0J0V01LcTY0QnNXVUJwUXZqaGJXWmYxVE1DQW5nOEgzVmRRSUhoZkpyd0docEFIRGdacEk4MnRSTjlkR3d0TFU1U0poUFBydkdCMG1zTkl4Qk82Qm9BRUpnWnQzbVloK1I2ZzY4anVmZEY4WTNDZlBKWjlkNDkxUE53OUFEMFQ0L2lnWWdnRGtuWVNFWWNiQWFxa3ZwbEU4L2tNdUlwekVVRFVBSTdPeWFzOUlWYlRaRGRTbDlJNTEzbmNiQmlMWkhZaUFrZ0pSUWZnM1RyT3NFNEllV0JpQUVTLzlFOGloSGdNWW9Hb0JBT0NZQkRlVitSTTJ2RzVIM1ZTakZ5WnZjWWMwVDh3emJOZi9JT3lLS0JnQkFrcHBmTjVKOTFpZXNkb3M3VGFXVVlQNk5VVFFBSWRpS1g2dlpCRlFxemk1YkdtVldUenIzQzU1aFhvbDVoZ1hLUDNyM2pxMDRteXorYWJlWGwwNGduSDJjZlZBYVZqeC9OV1VKMUlZVnQ5NVYvdkhsRXZjSnJuM1dNeXhJWXNubTN4QkZBeENUejM3VzcwekMrdTJ5UGNOQ25pb0Z5bjhlZVdDMlZjWFpXTldmdVFkVmt4ajRoQlgvN1FIRFdzdy9kdG1RdTNRbTRGbjlUcWZybnR0cXMxVmlwL3lqbGc1Y1BRRTBjOXQxQWdEUUZsb2FnR1p1cEgrVzduU2RCbkFBMnUwQndSNG9Hb0JtYUdub0N3NUlRR04wVHdBQUFDKzBOQUFoY0JZTFlBQW9Hb0FBcUJsNklIZU5vanV5K1hWeU80VjVqbnIzRDJzNS83QWNsNHlXaGhVdkdhMEtjMXk1V0h6V0o4eHhiV3FIK2NkRTBRQ0VRTlVRUkRzSHA1MnVJKzFwV0x3dFJ2Mk1QSzhGTFgySlQ1ajd5c1dxcTFYOXd4TEpQeWJHTkFBQUFDKzBOQUJJU0x5VEpScURnT1lvR29BUU9DS0ZjR0h5Y3dLR3hHZlVuSldPdXM0Qm5hSm9BSkFRanV4RDVqc0p1cmZTMjZFVUY0WU5DMmpQeEdLT082Rm9BQUt3dVlIUTJ2N2RGc2VSK1lRVmR3enVzTnpvYTBmWVZ1b2VZYTNsRHdUbE9WNHdiRmhBVFJLTGhLSUJDS2QwN0xRanhqK3NLcks0UmMrdzJvMTJsWDhNTStrazJzcUJJYUZvQUhEb1p0SUw2UTZOR1VCVEZBMUFDSFRGcDJ6V2RRTHdWenB6VWV5d2dQcWVmeDJLQmdBcG9meEtYN3hMWE53VEhKVUdod29McVBQOEdRZ0o5SU43bmxkSC9ONWhubHNNRythVG1HZVkzUjVaZVJIemdLVE0vamZxa1BlZE5yRmZXSWY1WDFMWURScEZBeENDWFI3K3JGMGRINnQzck9zckxYSmh1VVAyMXFIV0VWYXh4YkJoYmVSZnQ5MkdiT1VmTFd3dmRGaDMrWnQydG81VVVUUUFBZGpDZnoxZlVyWFF2YXBPd3FwZTFkb1dBWFNPb2dFSVlaN2NlQ1dnZjZnZmswZlJBR0FZT0NBQmpYR1hTd0JBUXF6ZlRJaE53b29MQTRhbGszOE10RFFBZ1hBaUN6UmpLeDQ3RmlZYmxrNWlZZEhTQUdBWTNFZWs3SmxhOFlFanJQWk0wQ2ZNRnBhVVpyNVRZaTNrajJSRis3Qm9hUUFDcUw4N1h3c1gxdThuN0hRQ2lmTS9rM1VjZHlPRjFkWTBYU1ZXR3hiUUFYekhVbkFaY2I0VFdocUFWaVM3Ti9STUxObjhkMUY3Q1dpOFRhUVExdktxMENWYUdnQ2dpZUw1ZlBIWmdCdEtNNno1cXJpeWVPQW9Hb0FRT0VGTEg1OFIwQmpkRXdDQWxOanRJYUxaTmlLN1kxZzJSb1VIN3JEU1YxVnRNYW44WTZLbEFRaGs4WXV0YmIzMUNWdi8rUE8zY0dnUUZpUXh6N0N3K1dNNGNqT3JsaDRqYTBlSmxvYlZIbmZkejNxRzdaR1laOWl1K1VkRDBRQ0VZRmUvVml0dDM3aHhiZXY2ZzUzQ2JOMnV3Q2RzOVZ6eE1vajlFL01NODg0LzNickJNN2RPd255MHYwVWNLSW9HSUFDZmN0OXhnckZIbU04TFBjUENKaFk3Ly8wMTNFRHNqNkZKV0pwYnhDR2lhQUJDWUZjYkJLZTVnMmN6TFZpT3IwT01zQ0FkZE9ubjN4QkZBd0FnQ1ZhWm5yNjZVcnlUc0dKODdDM3VGeFp0YmllS0JnQURZZGYvS1RrYnk1M0pWZjI1UHFVck9mOHpzcllrTEwvRlZkaDZ1ZnMwMFQrc3RmeVJ1TXVZVFo4VURVQUlkRThrejFZOHJscm9IcjFlY3Y1bmc0YVZiZDBkMWxMKzZJTjRueGZ6TkFBQUFDKzBOQUFCMkd3amNsSFltMElGREVza3NXeUxlYnpPV1BTTGUreGZqRlYxRXVaajl5M0c2MFNpYUFEaVMvWnF2ZFFTaTlvWlN3dDdFRkhITkxpN1dBS3VPYW13MEZzOERiZlpJcm9uQUtTRVF6dlF6R1hNbGRQU0FJU1FHemFHbmZEdUFVRXhFQklBUWloZUQrQytyS0kwdmxqbDJPMm5tb1RaaXJCMDhzZUEwZElBQkpLL250MjVodzBZbHV0ajlnbHJKekhQc05hdSt3OTQzSlh6Z0JvcExKSDhvMnAvV0c1QW5Rd3JiaDFGQXhDQUxkM2h1bDRRTGl6bEVWNDc1dC9tR0x1b2UvalNWeFh2NytVWkZqQXh6ekJIWXQyci92ZlliSkx0SDNFYi95ZzZ6dDhQUlFPQUlZcGFIWlcreXRFRTBIeUxZY05xRW90MldleTZYV1B2QXNYL1VKdG11MER3L0lPamFBQkNTUFcwQUJ0OFJrRkV2U3kyUlowVVp3RjE5U0V3RUJJQXNJdURLQnF3SDFvYWdCQ2F0S2p1dmJhd0d3Mm83L21qSzVRalFjVDhXVkUwQU0zY3JoNkUzZDhsMnlycXFlLzVBeWhEMFFBMGN5djlUdlpzYTF4UzFaMkxyVnhocFRGaHcvWkxySlA4dzZOQUFScWphQUNhV2JRMDJKcEw1ZGNMZmE2b3J4M0t2bmZZM29sNWhqWE0zOUJiQWFTTm9nRUFrSWJTQmlpNy9hQW9PN1ZGcmltczJKWlZPZ0hGZm1HbGlTV1NmelFVRFFBR3dWYnRzbmVVeU8zRTk5WjhpM0h2WGw3VlR1Vkl1cXI1eTJmMmllWmg3cGQza2o4RElZSFV6YmtRSUlRK3ZJZWRYTjhmY0R4R3d5MGV5alFOMkJQek5BQUFka0RSTUdTME5BQUJXTW5rTGlvb1htbVEyOWVXaGhVVnc2cHVER0FySHBTdVNuNWg3ZWVQQWN1MjVlZDY4RTNaUXUwU1Z2cWxheDdtR052UVNmNnhVVFFBWWRqaUk1OHJEVXFmY29jNXJtMXdoelZKckxYOG82SXVTWnd0ZmJqNTAvRTEzQ21zYXVFZVlUdU5iZWdrLzdEb25nQUFBRjVvYVFCQzRCUVd3QURRMGdBZ0lmT28xL090RzMrTEQxVFdVdXdJczg0dzZ3ekx4cFF1ZEd5cjgvelJDOUUrTElvR0lKeXFIMnB1aHhzMnJDcllwOSsxS2l4SVlydm5mM2tSODhnMDM4NnFlQ1JlNTJZOXd1UU1rek9zdGgvYnNhMFU4bTlIMWIrM0dLTzZWRXZmOElaaHRSdnFNUDlaMmJZQ29Yc0NDTUZucitwelFOMHZ6R2RKdzdvaGF0aHF5YWtpemh6RWVYSnpiZDhmWkkvamJsVjhYK29HbjlYV2J2RWs0dGVkb2dFSW9QZ0xOZFZQRmNOcVk2ekhOWW5CdytTWG0wL01UbHRFc2lpOCtvR1dCaUIxaGIycDUrN1ZKNnkwU2J1ZHNGcGg4NDg3MnlCSHZDQW83bm9oMnJlZE1RMEFFc0tSSFVnWkxRMEFnRFI0MW95N3poL2EvQ1pkM2Q1L3JQM2JtbFdqYUVqZG84ZGRaM0JBbnZ4RnRGVnpnbndBYktIdHZiaWthcUhQMmtwakZEU3M1ZnpqY0d4NStaU3R5YzVtUnRzczRwdUcyWnJFTnFIcDVSOFdSUU9BWWZBZmYxSDdxb0FqUHNLR3RaQi96RXJDZloyQmYweFhZY1g0MkZ2Y05iSG1LQnFTOXZIZmFIYXB1ZFg4dHJycHFmU0dKMVZoMmk2RDNZUCsyMm1SaTUzL1lzbVJ6RWgvK1N2OTlZODhVdDFQb0Y5dDh1ZUJOZnFlUHdBSGlvWkVMVnJEZnZOTTcyalpsaVVyalZaWHNZOHlsN012QnJObWw3dkQxakVxdXlhK0dGWjYzZnpJWTR1ZVlTM2tieVNqcTJOOThkcXFtVEgwOGNvR3JmUERucUMycisvNW8zdkpGcFdETDRvcEdwSjJNNUYrSjNzaXFYRFAxTnpaZHU0R3hJNndiQk5DYVg5bkxxejBxMjg5dHVnWjFrNytWc2R6WFIvb3p4ZytscFUzVW1ZckhpZGwyRVV4UlVQU0xzZWEzTmZzb3VzOERzTzFydUo5M3c5MEIzRlErSXlBeHBpbklXbUczVnc0azFIZ1RnUUFHQnBhR3RKMksvMU85bzVVYUxEUGpWTTAydzN6cFErS0MwdFg1UmxXZkZ5YldJZjVXK25DUk81bHpIV21WRjM4VnRXVkV5TnNIYXpxc0tyT29IVHlSMnFpM29rVWFhTm9TTnV0cE9WT2YzMVFMRDV3UCtzSUs0M3hEQ3MrRHBpWVo5aXUrVWZjMStXMlZNeEpkZisyU0dHT2VQZFRuZVFmdTZwRGMxSG4raTZlS09SVW5iZzRPQzdJOGxsVkoyRlZMMm00cWhBb0dvQXdPQ1JoS0dKLzF4M3JkOWUxTzYzTmMxV2RoRlc5cE9HcVFxQm82QU1PUituak13cUNIZ29nYlJRTlBXQ1ZQeVl0MjZJeVhmZkdiaStwQ0hPMS9qbWZMUzR6cG1SY1lUN015RWpXMWljV08vOGwrbUtIekxPd2E5aG83Qk1XZGhOUlY5NWl1emQ2Z2FLaER3by9XcHRiYmd0TEtzS3FWbGo3YkVrSHQwK1lkMkt4ODVla2k0UGUvY1VlRUJCYk92azNiRFQyQ1F1N2lhZ3JiLzBuNDk1Z3dGTEhIZU56RGhJcE1jOHc5OENKZUNnYWV1S0FqM1p0aXRmU2tNSUhsRUlPVGNUUDM2WlVuS0NvMktwYUV1QzVubVl4dGVjZ2Uyd3hiSmdySnVaWG5Ia2FBS1FrV3VsQTN4VFFIQzBOU1Z0ZWNWbTl0MnUvdzVFTzAzS3JlOTJ1bXpSWGk3Y2VhL1hzSG1HNVUrVDl3cW9tWWlnT0d1a20vOHREYncwQ2VvNmlJV20zMHRmU2FmWE9ydjNkWU04N1RHTlpIT2xLbXpSTGhvUHNHK1k1bHNNUkZpa3h6ekN2L0EvbU93RWNJcm9ua25iYmRRSUEwRDEzZlZyN0VzZHluekRIRnNPR1ZiM0VzYnoxSXB1V2hqN2czQ3Q5ZkViTnRUQkEwV2NZWks3cnBiVXduMzkrc3ZtSDR1aWNvbTZvV2w0TWkvbDVVVFQwQUxkWkNvTkI4d05YN0tHcERXNHpMTm5FL01Nd0FCUU5RR2lsd3dKVmZRdW9zR0c1L2J2N0xsYWxZZDNtRHlCaEZBMTlRSmtmUk94alVtM3pvMk9zWUp0aHBYd2FiR01ueGpXUlFQSW9Hb0FBcU91U05wTk9wTlhFbzN4WSt6T1JhMjgrbStSUk5QUUFZeHA2Z0xQa2xNMmtGOUpaMTJuQVczSDhaZW1JekdLbmxuOVlzZnF4Zmx2MFRNd3pMRjcra1ZBMDlBRkZROEp1dWs0QTlXWmRKd0EvdGIxa0FidklFdWxDalBIQ3FLVUQ4elJnU09LVVg3K0xzdGFWdmcrRFR6WXhBTHVqcGFFUDJKOEdjUkdsRStGVytyYjBLdXBuUk4wUUJMK2o1cmpJWmZBb0ducGdibGUvMDlpM2F0ajdqaEdsTC9RTUM4aXgvc1Y3R0sybDRVNlVGUU1EUTJIWG5KV09JcTZlb3FGWEVqa1ZDOXZ2RjFBWGU1ejFWTjk3akZmdCsyMjlndWR2T0lzRjBrYlIwQWRwSGpHUXNkOFZMb2swMisrdFovbXY4MGkvWWN3ZDFtMytGSGJEeGtESXZsbGZhZTRlWjd4cldPbFczR0dscndxZVdNRDhNV3liNzVUZFdySjhZTGUrSnFWaHhUOXRiaVhlWVhiMXlKYTlwSmhZZGttMythTWZvbDBFVGt0REgyenZEcngrNWJ1R2hhb2JnaWZtR1ZhWHY3VlJ1L25ZcHdZUytTeTIvS2ljZWREQ1Y3VzRyZnE2d1R1c2hmeWpOelNVL3BSTVp2TSt2eldmc05KcDE1dUVPV0phenY4eTRoNkpvcUVQT0NBQk9HeVgwcW5IZVlqbnp0QW5MT0NxYXNQYXo1K2lBVWphK2llNk9FWEluVmdVLzVSZldPblpTZFdmUHEvYWI5T3Q1UjhiOVhmS25rdm5YZWVBT2hRTmFWc016V2RQRjBUOHB1L05WWjNiSnhaMmRkR3N6VjM1dVd2WTlwOWJXNnphdENSSFlwSlpiZG9WMW1iK0dLWkw2VTNwWHdLdjFmcjk3c09HQlpSZ1loUU5hYnVWdnBZOTJ6NXZ3MDVpbjhqZVNCVTl5bG1lUjhZWXJaanVzTktlY2tkWTFQd1ptRDlvejJVanREUzAyUXNSUTJxSlVUU2s3YlkrQkIyN2xmNloyWjE2d203M3NPU1dGSHRlYXNNV3NxOVM1aW4vTUZ1b2Joc21GaTkveFJtWlA5dmVGbEpGMGRBSGk1OG9QNmY5Wk4rM0dEczdDcnV3NG4zUHM3K2pZZ05MV2I5TWZaaTIvNnhhN2hOVzBlbXpaMkx4OG84NU1oL3BvMmpvaWRMdWlleDVRSEZzV2pZbUc1WjdVRnhWOFZsM21Ec3h6N0FXOG1kbmx6Z2I2LzRnQ0l6ZjBZQlJOUFNBcmVvd0wrMk9ibkt1VS9Xbk84eWRtR2RZSi9rSHhHNDBsR2p2WkxIeFhvWDIrMko4YmRoNnVTTXN0K25pY25kWU1hVU84OGZBVVRUMEFiOVVvTG5NSkdtbHhhZWpySFdIbFQ0VnRnY2pGOUJoL25FVm15ZUx6K1phS0p1RUZjZDhGSU5MdzNMRlhmREVHdVlmRTBVREVNQis5NTRBVUs2cWVUSzNzR0dZbzdHenFvRHlyTm82eno4YWlvWSs0SUFVQ0c4a0FEUkIwZEFEbk1VR3dSZzdBR2lJb2dFREVySDZvckJMSDU4UjBCaEZReCt3c3dNd0JFMzJkWjV6NWlZN3RXNVA4cWRvNklNMHYrSzlFM1ZRTVo4UkVFTHUrb25pNDV6TlU3WnBXSEh5bDlvd3g1V29YZVZ2cGFPS2xRUkIwZEFESEkvU2w3dEl5bFEvVlJ0VzNCL2xKcmpTOXRWVnVhdkFxc0p5Vzk4anNkYnlqNlg0UTlyNzNLNzBoYkhEZkJMekRHdVNXRnVxcmt1SUYyYWRmOGJZWXRpd2RqNHJpb1krb0dvSUl2cEJTZlBxTXcvUGE2TjJEYk9GL3pyQ1N0Y1dLVEhQc01XRHhmczJqM3lHVkN4VHFrN2E4dk9PRnNOc1NkanlmcUVlWWZrdFpzSTJsZFoyV0dtWjFVbitHRGlLQm1SNG51NkZEUXVvL1MxbU40MCt5QlZZcFo5YjhWbWZzTnJ6UDUrd3FpMVdyYVQ5L0RGd0ZBMDlZTzMraDhLZGorL09IWU5uMk5ZTG1nbWJQNENrOGZzTkl1YTVFMFZESHhUYk0zZDdkUWRoQVNXYldJMWl2Vk5WQWVXVzd4MW10OXU0L2ROWXR6Nm5rSDg4eVgxRmdQNmhhTUNReEp2ZHlkMys2dzRyTHQ4N3JMU2gyVE1ObjdEWStRTklHMFZESDdCdkRlS0NkN0lIbUxVVFNCbEZRdzlZdXpXQXVTWjRGYlkxRXJzc3pGUThLQTF6TDlrcE1jK3dzUGt2cCtLT2RrU3l5LytuTE5uVDRuMjdNREhmd053MUFLYXdzUFpDeEZ4WThhbnNxNHBiVk9HMVZXdndDZXNxLzloeS80U0FWNmo2aC9tOHF2MHJiSGNLaTRhaW9SOTJIY0NjYTZWMnQwWjdoam1XN0pxWVoxaWsvSkd5NkMwTnBWK1gwbTZkMnJEaVU0NVhsVzY5U1ZoWCtiYzg3cVNUSGRCK1cweG5CeG9UUlVNZkpQQkZBWUFGdXBDR2pLTGhVQVE4QS9CY1ZTZGhQcW82S3FKaVA1bzhuMGJpb2s3Q2ZIU1YvNlZIMkI0dXBkUFY0OUorRXBONTFsU0VaZG50MTFydk1QZCtLQmRXdTdOcFAvK0ZlRHNraW9ZZXNLdkoybFQ0OGluN2ZiSWwzK0JpbDJYcEQ2TzRLcFg5aXZZT0svMk50WmsvalRYSWZRbGlkS2lGQ210L2kvNWhwOUhHbmZ4V09pL2JZdTZCeXJKMU4vbVhycVFxclBaZjUrams4Y21oOUNVQjg1ZDBHWE9QUjlIUUIzT3Z6a2YzTjk0bnJPbzc2dDZpWjFqVjk3NzkvR09oTUFtQ05wdTB4V3RwK0s3MFIzNUVnVkEwQUVtelpiL1JZaU5rcVZBTnlEczFxL2lFdFp5L0ZQa1VDWUhFK0loT0sxb2FrQnFLaGo1Z054cEVDMWVMYld1NUFYbW5aaFdmc0c1YTV2bTJEOUt5cGFIck5BNUd2TDBkUlVNUEZNOWk5N3YwdCtwVUwyQlkxRXVYbStiZjhxVmlTQTJmVWNKb2FRam90RDVrZjZPWUswZGp0K1dMZHgxSDQ0Z0pHN1pmWXA1aERmTUhrS3hGUzRPMFBTTEpGdjZzV3U0WjVuNGNOcXlyL0tPTk8xbWdwU0Z0dDlMWDBwMnUwMEF0NjJ3UXpENWJqTXlPUktoZFNUYXNkS1ByTU1jVy9jUGF6eC9waXpOWWRkUFM0RGdQcUhyc0dSWndWWjJFZVQrT2QrNUUwWkMyZFV1RExkdlA1aHJsc3h4aFZRY0FtNGtwUGhVcXJQUDg0M0gvVEIwN2krd1N6NVc0NDIzaHFTWmh4YWNpNVI5dlA5Zk8rZ2Npem1EVnFDZkhDSWlpb1Fkc2J1ZWUrY1Z1K3U4ZCsvRmlXTVdlZWhsV3QwUDNDU3RKck92OFRlbFdJdkFwVVJ5bjVVRk8vdmRPekRPc2svd2JxdjN3dzE1NEVtcFZuWVRWeEZCK3BTL2FwY3NVRFgxUS9SUDEvUEcySDVaaVloY3hiMWkxdmUyR0NRYzUrZDlwaTJIRDR1VWYxWUYvLzNjSlMrSGp3UDVpdHR0UU5HQkkyQmNDS1dOcXJ5Qk9JKzdyS0JyNmdFTWQwQnkvb3o3Z1V3cUFsb2FCSzUxdGNHOUJic1N3OTN3TXpTVjZJNGtVY3dKNmhwOVJNTkhlU3VacEdKd2czeVhuc01YQTIycGhuUUFBSDdRMDlBSEh5ZlR4R1FVUjlTS0t1VFNxL3FTeVRWaU81aXlmTVArYmRxekQzRnYwREdzNS82aEtyNmdKY3YzUFR0ZnE3TDNGUlBLUGdLS2hENnArMkFFdnd3cW9rOHZJdXRhSEhCSGlXZzZmc0QwdVkyZ25NYyt3RHIvTnRla0Z1VVJrcDMvZzNsdE1KUC9RS0JwNm9Qd2JFdll5cklBNnVZd01BQkFmUlVNZmNPQU1naHRXcFM5eXV5dWZFdEFRUlFPQVFiQ2lhZ0Nhb21qb0EvWjBRWmlZTThjNFBxUHNYWm9jbDZYNmhOV084QWdiMW43K0FOK1F0RkUwOUVEWWVSb0dLODU5ZGp6WXdnUDNzNDZ3Mm45QTJMQmNQaTNrajRIakc1STg1bW5BZ01UYkk5bUtvMmYyV0dtM2wxUWRiV3ZEdEh0WThhbmNRVHlkL052UVNRVlcvUGVYeHVUZWkzUXFTQTdua0VSTFF6L01PNzR3Ri9YcytqOWJEMVMyVDNhY25IdUdGYlpjRTdaM1lwNWhZZk9QeGYydmNyeWt6YnFoK05UQTZnYWI2bjFFL1dmZmFEa3gvN0FnS0JwNmdqSy9vY1VieU8xd2dJUjVWaStlTVdIRDJ0OWk4TEFnS0JwNllKNFpSb1pkYmQ2M2k1UnFMOCtQTTlsUFBWNytGSFpEbHM0dkZCVW9HdnFBSDFJbzhRNUllM3hHQ1o1RTdDUkcvbEVMdTFVWFVzQnFwLzJ3N2hOTHM0cEZXNDRmUGU0NmhaNDdtZW5vUnVldjlNbFBPOHFndGIySTNiNXd6aDNtdjlGTzlvSklWclRDYnRmQkU4bUdKWnNZaG9DV2hxWm1KM3I0SXRiS2J4Zi9FMnFBVXZNd1cvaHY3UnFTM1F1R2NpT0p3YW9BQnVINDdLenJGSHJ1NkVaWDcrakk2aTkvcGIvK1VlQ1YzMHBmUzZkMmgvRkJLSXI3dnQxSy95eDdKK28yaHFLbHVxdnZyVlo5ejc5VzFSVVV1VGJPMHJDcWUwc1d3M0x2VDhDd2J2T1AvS0ZUTkRSbVpPYWFUZlQ4WEdiUmFScnVNN3NOdGlaRXc0ZlVGN3MyZ1BtSHRhL0QvTnU1aDR2bmhhYkZNTWNMM2FzS0c5WmgvcEhyaHVOMGZ4VjlZV1dsczJ0ZHg1c29pOCtvRi9pWUFCeTZZOHNGVGlIY1NyT2phR3ZuYUJSRVQ1dHFBU0FabWFMQmZUY2FKMk8yNzQ5Z0pGdlpDMU1hdG5uS3lOaVNzUHpEK3JXM2xQL1NLT0lkSXFnWmVzRG5ReHJDdEhOaDh3K3J5UmFUZmNNOUpUaXpJUG9wMHozaDJaVlNHbFhXczFMZldaTUpzNW1GcFdINWgzdDNCWlZHTmNoL0k2azVBRkRVZVV0RHNoZVNCQXpyKzFpQktzbSs0WjU2OHJsWTY3cVVlOEVVbGhkSEZsWU5FNndOcTlxaVo1aERPL2t2LzR3NnBvSHVpUUNzTkl0NUw4ckZtazNGRWx0NGtJMEpHMWFjZ01FZGxscitNZmx2d1hFNlo3Yi9RUUhEQW9xWGYrd3hkcldqeTkzUDdoUlcrbE53ck1venNkVHlENjcyRytzK25iT0YvKzRhVnJYRlBSTHpEQXViZit4ZEhVVkRHQmZTUE1ZN21SMlo3L2l1RlI5RUNpdCtiV3ZESEF2Ynp6K2VYYmJsaUMxOWc0T0VCZFJhL3NINTdQMzMzdlh2SGViNWhkMDF6SE9qdTRZWk1kWDNvSEgxUkRCUjNzaGI2V3ZaMHhpckhwek9leWZRTWZaMVFWenlUZzRhTFExcFl3NkFzS0oySVhYU2todXFNZG8vTEtCTzNqUTBsMnpSVU95VUxQMkM3UmZXZ3JENXgwSFJFRWk4U1JxVThFKzBYeTRpTjZ0MjhqRzEzNWdlVm02TDFCQUQxL3diNk5uRHYxOVlDOExtSDhIMjFSTStrMUQ2anlhcUhVaXphMWp6eER6RDlzaC9GUGtzRmtId1RtSXR0eXNvM1RPc2R3S2VZVlVyenk1MDVGQWFsdHQwVXZsamVMWmJHbnlHQ1htR3hSamJFeVF4ejdCZDg0OTVGc3VScmprcnhadDhhN0VCbnoycXU3bXg2dWhRRytiWXQyY1BCNDRNYXl2a2x2S1BmZmxFNlJKYjhlZCtZVld2OHN6QnNhcmFUYlNRUHdhUDdvbG1UUFh2T1NCK3Q4bGIvSXg4UGloM2MyUHR0NmtxYkwrRGptZHVQakZoOHc5c0pwMUUzUUF3Rk1mNTgrUGNHVXFWMHJEaWRkbE53cW8ydWtkaW5tSE44NDlrN3gycTUzWDZrY0thenhJUU5qRU0xa3g2SVhGenZ2VHhRdzRsV25QQWNlbGtpUFZLdzJyYnUzWUs4OXhvd0ZVMXlOL0U3K3B6dDM2WHR3d1hVbzBVbGwrNi9TRFhLTjFaL2xHeHMwdlpURkorK3JWY0Y3OHF6a3B5L1NsTndvcWRNaXFyZUl1SmVZYTFrVC9mODE2SWVWa3MzUk5obUtPWVl4cm15MSt3Wjl0eUoyRnVQdDJqbmVTUHdmTHNJaWwrZGZjT0s5MVF3TEIyOG1jb1pEL0VLeG9XaDdyU0dyTTBqZEpTdEdwRXNHTlYvbUhyNEYwVDh3d0xrcjltekpJMmJOUW1vZkJPRGhnZmZoQlJDN3ROOTBSdEtlb0k4eXlXSFd2YjZZUzE5cW4yODY4UGJZZ2ZVM09jSXFYdk12S04zL2dPOUpUblo1ZnNSOXozL0RQb251Z0R1Mm5WY0RTbzVMNXYyZDdRMnJEaUYzV25zTnFXbmlUeWovbHJwS2dMSmVLTjM4VG5sRHpQRTc3OTF0Q3R2dWUvc2l3YUhNUFBIWU54U3A5cVB1RGRQZnduWUZpay9JT3poZitxOExocWlXZlkzaS8wVE13ekxIYitFU1gvVSsrRnFBME5BSm83MWx3eUh1V2RMUW56Yk9wM3JiYnVxZjBTOHd3TG1iK0p1YlBqZ0JRS1I2VGs4V1VIVW5ac2JmK2JUUkxJLzlWUm5GdGpMeVQ3enZlSWxhN2pqenN4bWYrcTdFclQzUEpzaDAzVU1GTjRTVEY1ZFpkLzlzOElMcVhUMnZXSGJXTU1HRlo2aVdUVUxmcUhZWGhTSE5QUXkyLzFWZHkrV0x1OTYzQmM4TzNlVVJjRGNtRSsvMVhoejlLWEsvTUJsUjZ6V3M1ZjBqemVaMlFML3kzKzZSTWNLY3o5WittcWluL0dTTXlSVEZCZlNxKzVJOEtlZXdRTVN6YXhHT2FaWC90YTZlKzhxTFRrTFZYYzc3aTM2QmxXVmQ2MW4zOU1xeHRXNVVwK0ZYSXFQVkdJRTJhTGIrNStZYTNsdnp3aUZWNFN5S0ljeVg0eFN2ZkF4VjMwZm1FKy95MytXUlZXVEtDci9DKzYyeE9pYzkrUlhxNGVPL2JlMlNYK1lWVjc3MTNESEcwSyt5VVdQUC9pZnJFTnRYWG5UbUc1cDByRHF2WnVVUk1MbUg5TVpUZXN5bW4vZlNrKzJ6eXMvYzgxdUlBL1djOVZWWVhsbGpjTTI4TysrVWZzUWRyK0pwU2VDYmgzeXNVWHVzUDJmdUd1WWUza0w4bTA5V3R5L0h4TDk4YXRoZTE2bU9na2Z3eGNpdDBUdldNVXVRS1BVYU40cnNwZFBJVUsyMFBEL0NQYlk2ZGN0U1QyQzJ2RDJzbS9hbUVRaTF0UG5IUGNDNktiMWdha29uRERLdXpuS09ZK3oyN1dYZHFTV1R3WHJCcFk0QjlXR3F6QzQ5b3d4NE9XODQ4cllEc0tRcHQxblFCd01BbzNyTUx1cktTTG1HTWF5aDY3RjlwQ3pLNWhWY0h1VllVTkM1dC9kUHlVZ01ZY1BYMVZTK1RmQmRaNldQdjV4ejU1b1hzaURLTzRMUTBBZ3NudHdyTnRYOXB1cDhxRlpXTVVOTXh4SkhHSHRaOS96SU5TKzExZ3NjTTYyV0xVdW9IdWlUNmdhQWlpblhFbmFDTDJXWkpqcDF2YTlwVmJVdFgyMVR6TWNZandTY3d6TEZUK0dMRGo5VzJYYStvVDIxMVlzb2xKMXNvWXFhMTlYVXZkOHhtZVd3d2JGbEJyVzR4YTNjYytkWWl0Ny9rRFdOdWVFZEs5Ziswd0xObkV0T3FCR3ptRG15bTlFMms3UExjWU5peWdyUzFHUG5CRi9kZjEvV1N2Ny9takd3RlA5bkluWGo1aFNaMnMrdWNmZVVlWDc1NG9ickUwUTUrdzJpVzI0aDJvQ2d1VldQajhGNHVpZHZUa3ZsVzJrRm54aW9MU2YyUnRXUEUzMHpBczl4bDNtSDlVcFRQWllWZFIzOFA1NWx1d1g5dFlreGExcXZFRFBxLzEzRVJ0V1BQOGJkenpvN0lOYzdLNmExamtmVjJtZTJLOXhiSmpveTNzd2ZOTFNzTnM1cGk2WHBMWm9kdlNzTVdxbEEvYkliR1c4NTlMc3pqM25yaGQ1YWJDMXlYM3pTaDl0dllYNkE1emIzRy94RHpEWXVRUHJIaCtJNnErcEh1czNQRmREcldKMnJDdytXT1lxbTlZWlF1UGE3LzFBY01jdTN1ZnhEekR3dVYvb1RqM25yaVZ2cGE5RTJITmlLUjRabGRzSFhHRTVZS3pNUW9hVnBwQTUva0RTTnZ5a3N2Y0Q3bFVhVnV2bzgzTkp5eTMvM0dFdVhjc0tlUWZwWGZpTnNaS0J5eDJGMUxwa3AwYWJLcks1YXFWTkF6elQ4d3pyR0ZpN1ZqL2ROMExQY044TmxIMXFvQmhiZWJQTlhjRHRoelRZTFZxbksrMmZISTdyUEswM0IyMjZnakliZEV6ckR5M2J2T1AyaGZMcVZnUTNMRnE0R3pGWThkQ3o3RGF6VGxlRlRDc25meG5NWDlIckc1SGl3QUFBcTVKUkVGVXJmMUNvdzRlYVlIUEtYSWNtUmtoOS9zbTdSZFdkY3F5WDVqUEZzT0dGUk9MUElDTFFYWmhSTDRUYVNSOWI4TDMzL0dpSDNyOWRWem81TEFTVUhjZkFUTkNCaktLMjJSM0FEOVM3SzN2bjM2eU8xNGtLTnZ0NitpcjJTbHM4ZFZxRWxhYVlmUEVPc20vSVdhRURDUm0wN2NWTzlUKzJLOWJ1bW9YMHFUUHU3YVR1elNzOC95amZ0WDVIYVV0MTRicjdxdHBPYXo0a2tRUzJ5UC9Kanh1V0ZYMU8rODhMTFhFNHBWZjY4K29kTUJuY2FGbldIWjVWWmhqTUh4dFdISG9hYmY1UjJVckhsZkZPUDcwRFBOWmVUSFlKNnpEL0dQZStJMktJUlRPTklmTXIzdkM4OGZXZmxneWliWFVIZXZZeFJjUFdrR09JdTRqZ1R1czZ0a1U4a2V5SW45U1BxdHZjNUNjNXdWaTdTZFdGWFlaOVNQaWR4cEUxSUdRRkkxaHRES05OSnFJVzlqeEdTWFBmMWZYNXNsSVZURWNiNHZOdy9peUQ5bDI5MFN1RGJtSzNXNTVEaEpXMjRacy9SSlROL2t6OEh2Z2luMHlLbnhyY2pHcStHWkZEYXY2blhXZXYvdEhGZ2JIT3FDeHN1NEpuOUxYczlVM1JsanRMNytUL0kvb2kwMWVLNVZkYWYvTUhqRXBoMFhhSWw5eklIMTBUd1R5S3VZK2o3MXBFRkdMQmo0am9MbHNBMVJ4ckVmVk9PamEwUm4rSTBmMjIyTFlzSWI1eitOMmw5Y05oR3gvNEUyMmVUUklXR3Y1eDVzNEtOYUtoNFV1cEtHemZ2dU5xcGphQzN4MkNpdStKR0JZeS9uSFVOcGdYRXdqWVBOejZTWTh0eGcyckNxclBmS1BvTzZTUzg4TUFvYTF2OFhHWVlzZmFjUW1HNnFHOVBudjlOMTJxbC9iUHhyRnk3K2RJMU9UWFZDeHU2VTAwak9zK0pLd1llN2xZZlBIa0dUdVBTR3BibEJTOExEc21FWDMybllkeHRWeS9xOUdNWDlaN3JNQmg3QmhQbEs0SnF5VWxZNDhWdFhFM252elhXUFdZWWtjalhhTktkMGlSeWFnRC9MZEU3YndvRlNvTU9zWEp1L2RTeWY1enlXTjJoMGMwa2xEUy90YmJEOS9BTW1yT3BHTEdoWlFyL1AvLzVKbnp0aCtzRkpzQUFBQUFFbEZUa1N1UW1DQyIgaWQ9ImMxNTA3ODgyMjgiIGhlaWdodD0iNTA3IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ii8+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCMwYWI3N2MxNTZkKSI+PGcgbWFzaz0idXJsKCNiODU2ZWNhZjBmKSI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMC4wNDQ2OTU5LCAwLCAwLCAwLjA0NDA3ODgsIDAuMDgxMDc5MywgMy40MzcwNzgpIj48aW1hZ2UgeD0iMCIgeT0iMCIgd2lkdGg9IjcwMCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFyd0FBQUg3Q0FJQUFBQ2hiZHRkQUFBQUJtSkxSMFFBL3dEL0FQK2d2YWVUQUFBZ0FFbEVRVlI0bk8zZFRaTWt4MzNmOFYvMlRQZk16bUIzQVhLWElFQUNiTkIyaUFBY0lkclN5UmVzM29EQ0I0STNYLzAyUkw0T1IvZ0ZFRGVGNzd2MjJXR0dJNFFGSGFLc2hTa0pYRUFFaWFWMlozb2VPbjNvcCtwNnlNcnV5cXpLNnZwK1FnSjdxdjlkOWQ5K3FQcFhabGFXRVFBQXFQRG9zU1NkVERTNzBvT0hHby8xeFkzKyt3ZDYvMU05L2JkZEo5YzYwM1VDQUFBazZ1TmY2T1daWHAzcnRkZDBkaW9yV2VtUFJ2ZWU2dGYvU3ZkZjZNbGZkSjFpdTBaZEp3QUFRSXFNMWFjZjZQeVY3dDNSblJQTnpmSkUrNzUwL1k3dXY5QjBxcC9acnJOczEzSFhDUUFBa0tMM1A5Vm5IK3JObVU3dmFYSXBJMWtySTgybDhWMmR2cTNwdTNyU2RaSXRvNlVCQUlDOFI0OTFNdE5QUHRIUnFjNFhGY082UjkvS1NtT2puMHY2Y2pub1lTQ091azRBQUlDMExEb2RMcDlyOG0yOWRpcFoyWkdNbFRVeVJwS00wZkZNRDM0djgvYzZlNmtmLzBjOS9hVGJsRnRDU3dNQUFGdWVTTk9wVHQ2VE9kTjhya1dmaERVeVZ0YktHRmtyV1QyNDFmMnh6bDkxblc2TEtCb0FBTmg0OUZqNlVqK1hKa1pIaTI0SlNVYkdTbVpaTVJnakdZMnN4aWVhUGRUTHM2RjBVbkRKSlFBQVMrdHJMUFdXSHR5c0JqL21EcFdMMFEyTDNncnAra3AvK0VabkwzWCtTcC84dEp1MFc4UFZFd0FBYkp5LzB1UjFuVnhydmk0UHJLUk02YkJ1YkxDUzBXU2lOMDUxL0pVKy9XQTU3dUdBMFQwQkFJQWtQWHFzbDJlNmZLanhpVzdOY3RpamxZd3BORFlzNm9hUnJKV1ZqdS9xNHMvMDJZZjZxSnZFMjBQUkFBQ0FQdjZGemw3cTFibEdyOHVleWRpS3ZnbEprdEdxcFdIMXR4bnJyM1Q0VjJCU05BQUFobTQ5K2VQOUU1MmN5TmpWOEVkblg4UHlTZ29qTzlma2hYNzFLK25wZ1U4VHlaZ0dBTURRTFNaLy9PNHJuWTgwdjkzVUNsVXREUXZMem90VmlYQjFwWlAzTlAzQklVOFRTVXNEQUdEUXNwTS9ucHlzbHBxYWltRVZ0YnlMbGJFYUhXdHk2Tk5FTWlNa0FHQzQxcE0vbmp6UStVVFdMSWMzR2lNanIza0pGbUdMdTFrZHpmVHdvS2VKcEhzQ0FEQmNUNlJIVXowZjZlUkN0emZMMFF6R3I1bGhiVEh2MCtJbDM3blI4UnU2T2RBck1PbWVBQUFNMUhyeXgvRkl0emZTNm5vSVd6Y0VNc2VhclJrZC91UlBkZkdCUHZ0UTczOGFQdWR1SFZZSkJBQ0FuL1hrajNZMStlUHlsbFIycjJQamFyYnB4VXlSc3hPZC9sSy8vbGU2LzBKUC9pSnc1aDJpcFFFQU1EaWJheXpIZW5DdDBYcGE2UDBxQmttTGF5OVhNMHlmWHVuNis3ci9RcyttbThzckRnQkZBd0JnY0g3d1RKOTlxSC84TnhxZmFHU2srZktXVkUyR0lDeG5mRnFzd1dvODBlbFVuMDhQYXBwSWlnWUF3TEI4L0F1OThiVStlcUxqTzlMWnBubGdjUkZFRTFheTgrWDhEZlpFWTNObzAwUXlwZ0VBTUNERzZ2MVA5ZUZUM2J3cmM2YlJhRFdVSWR3bWxqTkZXaG1yNDdHKytLMm1VMDJuK2xuL0Q3bTBOQUFBQnVRajZiTVBkZm5uT3Z1MnpLSmlXUHczME1pRDlRMHdGMTBWTjFkNit5MU5wMkZXM3JuK2x6MEFBUGg1OUZqNlFJKytvMS8rZ3liZmJKb0VtbmRNWkMxWHVCZ2hZWFhuVkZZNlB0YXpaNzIva29JWklRRUFnN0NZL1BFUGY2dkxtVWF2bG1mTmk5dGVoejJCWHF4d1BkbkR6WTB1THZUOCtTRk1FOG1Na0FDQW9aaE9OYnZXN0VZanM1bkdNV3d6dzVwWnpmZ2tvOGxFcjU5cTNQOXBJaWthQUFDSDc5RmpQWHVtbTJzZGozUXozMXd4c2RQTWp6dXhtZG1pckRTK3E2L2ZXMDRUK1RUV05xUHJiYlVEQUlDZjllU1A5Ky9wWkN4cm1zM2o1TTFxV1pjc2FwUVgwdjJuL1o0bWtxc25BQUNIYkQzNTQydEhtb3cxTndIbWNmTGRkT2JlVjhicXJuVHpydTYvMEhTNkhHRFJPM1JQQUFBTzJmdWY2ck1QOWZDUE1wZTZzeW9VNHJjeXJEYTB1Z0xUR28yc0ptL29oMi9yM1hkYTJYWUV0RFFBQUE3V284YzZtZWtubitqb2poNThaNS9iWGplMDJOQjZaTVAxOWJKWStiS2YwMFF5cGdFQWNKaU0xUStlYWZwTXI1L3E2Rndqczd4Y29yV0tZV005SXRMSXpIVTgwUmRmOUhLYVNGb2FBQUNINlNQcDg2bE8zOVA0bnN4SVdwenhtMkNUUCs3QVpLNmtNSnBidmYyOVhrNFRTZEVBQURoQWp4NUxYK3F2cFBGSTluYTFkQjczTWt1WHhZeFBSa2E2dmRYUmtmNzIxM3IyckdlZEZNd0lDUUE0Tk92SkgyY3ptWXZWVlF6WlcxZDNZVGxydFdTTXJ2bzVUU1JYVHdBQUR0QjBxcXNyM1Y2dHp1OXRab3JHanF3bmJGaTBkaHhQOUswekhmVnFta2lLQmdEQVFWbFAvbmcwMHRWaWl1alZ6YTg3UHk0djY0YVJOTmVSMGZsMzlFL2pQazBUMmZrYkNBQkFNTm5KSDhkam1mWGtqMHJvaUplOXUrYS9qSFQzYjNvelRTUURJUUVBQjJJOStlTzlPNXFNdFd4YldMVDhKMU14YUQxWHhFaVN6dWU2ZnFjMzAwVFNQUUVBT0JDTHlSL2ZuT24wbms1bW0za2ZVeW9ZSkMzYkdPeDhPVm5rK0s1TzM5TDBCM3JTZFdLMWFHa0FBQnlDemVTUHB6cS9YQllNMWk1dUc1VVdrN3RkbHRWNHBKOUxTbjZhU0M2NUJBRDAzcUpoLy9LNUp0L1MrV1I1QnEvVlJSTXB5dFFOeHVqb1NnKy9sdm43MUsvQXBLVUJBTkI3VDZUcFZDZnZ5WnhMV280WVNQMDZSck1aRVdtc0h0enEvbGpucjdyT3lvbWlBUURRYjR2SkgzOHVqWTJPekdxdTZQbnlNc3VVbVV6ZE1MSWFuK2p5b1Y2ZXBkdEprZmo3Q1FDQXkvb2FTNzJsQnplU05uZDU2TXNoem1xWjdWeTZ1ZEkzMytqc3BjNWY2Wk9mZHAxWkFWZFBBQUQ2N2Z5VkpxL3I1RnB6STJ0WFF5Q1RiMmJZc012L2pLeE9KbnI5Vk9OVXA0bWtld0lBMEZlUEh1dmxtV1lQTkQ1WlZneGF0L2wzbmRzTzFsMHEwcTAwdnF2ZnY3ZWNKakkxZlhwWEFRQll5MDcrT0prc2J3UmxrNzFjd3MxdXhrVWE2US9TL2FjcFRoTkpTd01Bb0gvV2t6OSs2MFNUc2RUcmlrSFNhbTVwV2MydDdodmRKRGxOSkdNYUFBRDlzNWo4OFhzWCt1NUVsNlBOT1hwL2hqOXVXOTlZUzh0TFAwNWUwNTMwcG9ta3BRRUEwRFBaeVI4dlJxdEtZZDdiaW1GbFVURXMvaG0zU25HYXlGNi92UUNBd2ZtWjFiTm5ldlpNYjl6UitGeHpJN09vR0hwMHVZVEQ2bnJSeFUyMnZqcVMrU0toS3pEcG5nQUE5TWtUNmRGVXowYzZ1ZEROall4azUrcHp6OFEyczVsbndscDl4K3I0RGQwa2N3VW0zUk1BZ043SVR2NTRlN1djNFdBeEdxQy9ReUR6dG1lbStwTS8xY1VIcVZ5QmVURHZNUURnd0sydnNiUnY2ZUhOOGlhV2kra05EdTlndHA1ZVdrWlhKenI1WlJKWFlOTFNBQURvZ2ZVMWx2WjFQYmhlWFdpZ3ZzM2o1QzE3bzg3VG1hNityL3N2OUd3cTAra1ZtQlFOQUlBZVdGeGorWGNmNkgvOFdDT3p2RVp4ZWJuQmdWcVBpSnhibVRzNmVVK2ZUL1ZScHlrZDdwc05BRGdVSC85Q3YvbSszdmtIL2I4ZjY1M1o2dFlTOWxDdW1LaXlHUGxvWll6bTB1eXUvdnhkUGZsU2V0cFpKOFVodjlzQWdBTmdyTjcvVkI4K2xkN1c3VDJOekthei8vQ1BZYXZwcFdVMGtvNk85TVZ2TloxcU90WFB1dmpIMHowQkFFamFSOUpuSCtyeXp6VjVVNlBSWnJyb2JudjNXN0pxYVRCV1ZycTUwdHR2YVRydExCMktCZ0JBdWhiWFdQNlZaTWE2bkMxbkwxaTNOQXlDa1piWGxrb2pIUjNwMTcvV3MyZmRUQk41MU1FMkFRRHdzTGhYMHgvK1ZwY3pqVjVKNjJHUDVwREhQeFpsNjZTYkcxMWM2UGx6bmIzVWovK2pubjdTYWliTUNBa0FTTmQwcXRtMVpqY2FyWnJvMTljaURzZG1ESWVWTlpwTTlPMkpSbDFNRTBuUkFBQkkwYVBIZXZaTU45YzZHdWxvdmoweHc1QXFocVhNOU5KejZkc24rbnk2bkNieWFhdFpBQUNRbVBYa2ovZnVhVEtXVE9hbzJYVnVYVmtNYTFqTU1HMmxsM085OXF1MnA0bGtJQ1FBSUMzcnlSOWZ0eHBQVmlNWTFyZVpHQ3F6cWhoa0phdXprYTdlMGYwWG1rNlhnejlhUU5FQUFFakxZdkxIcjkvUytKODEwdWJ1RXAzZjQ3Rnpkakc0WWJSc2R4bTlydmQrMk9vVm1CUU5BSUNFUEhxc2s1bCs4b21Pem1RL2xCYWpIb2ZkTWJGbTF1TkFyWXpSOGUxeWVNZVhYN1owQlNZZkFRQWdGY2JxQjg4MGZhYlg3K2pvbnN4OE9mSnhFSk0vZWx2Y28yczV3N1RWOGJpOWFTSnBhUUFBcE9JajZmT3BUbitvOFYyWithb0xuNHBobXpHYmUxSllvL2xNMzJ0cm1raUtCZ0JBRXRhVFA0NFhFMFV2TGhPWVV6R1VNSFl6bmZiOFdLTzJwb2xrUmtnQVFQZldrei9PWmpJWDBtcms0M29VSkxhWXJXa2liMjlibWlhU3laMEFBRW1ZVG5WMXBlc2JHU003WDAzTW9FRk81ZVRCYk5jTms0bGVIMnY4S3U0MGtSUU5BSUNPTFNkL3ZOSFJrYTZ1SkszdUIwM0Y0TFNjSDNPMHJMSEdJMzM5ZzdqVFJQSnBBQUM2dEo3ODhmNDluWnpJRG5haTZIMHQzeTRyYS9UaVZ2Zi9UOFJwSWhrSUNRRG96SHJ5eDd0M2RIU3NlZVlHRS9CazFqTStXZDA5MG5YTWFTTHBuZ0FBZEdZeCtlT2JNNTNlMCtsczFVbFBNL2d1bG0vYWZIRjFxa1ozZGZxMnB1L3FTWVJ0MGRJQUFPakdadkxIRTkyOVhDMWRYR3dKYjVzUmtjdS9OVGI2dWFRSTAwUnl5U1VBb0FPTHh2UEw1eHAvUzY5TlpDV05WcGRMaUthRzNTeW1sbDVXRDlMUmxSNStMZlAzNGEvQXBLVUJBTkNCSjlKMHFwUDNORHJmM0ZkaU1URURGY1BPekthOVlYRm5pZ2UzdWovVythdkEyNkZvQUFDMGJUSDU0OCtsaWRIeDBlcEUyVXAwVERTd3ZvYkNXSTJzeGllNmZLaVhaeUU3S1NqbkFBQ3RXbDlqYWQvU3d4dEpxOXNvY0tWbFkrdkpMUll6UGwxZjZadHZkUFpTNTYvMHlVOERySitySndBQWJUdC9wY25yT3JuVzdXcTZhQ3FHSUJidjRYcW15Sk9KWGovVitLdGcwMFRTUFFFQWFNK2p4M3A1cHRsRGpVODBYeHpEelBMMlN3aGlNN0pCdXBYR2QvWDFlOHRwSXB2alV3SUF0R1F6K2VOOVRVNld0N0swM1BrNk5LdE5qNCtrRjBiM240YVpKcEtXQmdCQUc5YVRQOTZmYUhLOEhPUy9hR1pBV0daOStlVklNcm9yWFgwL3pEU1JqR2tBQUxSaE1mbmpkMS9wZkNRN2tsbk1mRHlueVR1SzliQUdZeVdqbzNPZHZLM3BENXBPRTBsTEF3QWd1czNrajZjNlBkMWNHUmpwRHM1WXpzYTltaXhyTk5Ja3hEU1J6QWdKQUloclBmbmo1RnM2UDFrVkNtYlo3NDVJekdxeXJFWGRNSjdwd2UrYlRoTkpTd01BSUs0bjBuU3EwL2MwUHR2VUNsd3gwUUpqVi9jTE5ab2JQYmpWVzIvby9OWHlDc3c5VURRQUFDSmFULzQ0TnJMSFd0L0NrbzZKTmhnWnM3elZ1SkZHVm4veXA3cjRZUDhyTVBuUUFBQ3hGQ2QvWEk1am9KbWhSWXZaSWMxcWRPVGxpVTUvdWVjVm1MUTBBQUNpV0Y5amFWL1hnK3RsbDRTbFk2SjF5M2QrOWVka3Ryd0M4OWwwNTA0S2lnWUFRQlNMYXl6LzdnUDlqeDlyWkdUbnEvUGRyaE1ib2tYcnpraldhaVNaT3pwNVQ1OVA5ZEh1cXdFQUlMQ1BmNkhmZkYvdi9JTis4Ky8wL2F2bFZFN0w2WTA1OG5SbmZZK1B5N3Y2czNmMTVFdnA2UTZkRkh4MEFJREFqTlg3bityRHA5TGIwbjFwVVNwd1Y2cXUyZTI3aVI0ZjZZdmZhanJWZEtxZitYMHVkRThBQUFMN1NQcnNRMTMrdVNadmFtNldkNWV3b21Mb21ERmI5NlM0dWRMYmIyazYzV1VOY1JJREFBelVvOGZTQjNyMEhmMnZmOUQ0RzQyeTkxM2ttTk8xMWF3Tnk3cmh6cW1zZEh5c1o4KzhPaW1ZRVJJQUVNeGk4c2MvL0swdVp4cTkya3psUk1kRUlvdzIxMTRhNmZwR0Z4ZDYvdHgzbWtodVdBVUFDR2s2MWV4YXN4c2RVVEdreVc3bWxwYlJaS0lIRTVtdmx0TkV1aWZkb21nQUFJVHg2TEdlUGRQTnRZNUdPcG92NXhTaVZ5STVpMkpPeXprelpQU3RFMzArWFU0VCtiVHVwUUFBTkxXZS9QSGVQVTNHTW1aekgwdU9OQWxhRG01WU5TMjhuT3UxWDlWUEU4blZFd0NBcHRhVFA3NTJwUEZrM1hOT3haQXVvMlV6ZzZ5TTFkbElOKy9xL2d0TnA4dUJLYVhvbmdBQU5MV1kvUEhoSDJVdWRVZVM0WXFKSHJEcmFTTG5Ha21UTi9URHQvVHV1NjZYME5JQUFHamswV09kelBTVFQzUjhSdzhlU090SmhFVEZrTFJGZTlCaWZJT2ttNnZsZU5VdnY5U2p4NVV2QVFCZ1Q4YnFCODgwZmFiWFR6VitiVFB6bytpWTZJbk5OSkdTdFJwUDlNVVhsZE5FMHRJQUFOamZSOUxuVTUzK1VPTjdxNWtmemZLMml1aUY1ZVdYaS8rT05MZjYzdmNxcDRta2FBQUE3T25SWStsTC9aVTBNY3RiVXNsSTY0c3QwUlBHYnRvYjVyY2FIZW5Ydjlhelp5V2RGTXdJQ1FEWXgzcnl4OWxpOHNmTUxhbVl5cWxuek5ZY1hOZlhlbFV4VFNSWFR3QUE5alNkNnVwSzF6ZXlvOHpaS3EwTS9iUzgyTVZLUnNjVGZldE1SNFZwSWlrYUFBQTcyMHorZUtTcmF4bTd1b2tsTTBiM1YrYURHMW05OWgzOTAzRitta2crV3dEQWJ0YVRQOTYvcDhsNDFjd2dycGpvUDd1Wlc5cGEvY3RJZHovZG1pYVNnWkFBZ0Iyc0ozKzhkMGVUc1RSYWpuODBuSWIyMzNybTc4Vm5lZGZxK3AydGFTTHBuZ0FBN0dBeCtlT2JNNTNlMDhsTWRqV2xJTDBTQjJCeDM4dDFaNU9WeG5kMStyYW03K3JKT2dBQUFCK1BIdXViZS9yWGY2ZmZmNmpYNTV0SmdUaVlIQlM3bW1GYXNrYXplL3B2Nytpakw2V25YSElKQVBDemFLQytmSzd4dDNWMnVwcUIySEJYcW9Pekd0YXcrRmlQci9Yd2E1bS8xOWxMeGpRQUFQdzhrYVpUbmJ5bjBabEc4OVc5am1obE9FanIyNW9ieWVyQnJlNlBkZjZLbGdZQWdJZVBmNkhiZS9xdjkvWCtIelc1WHQycVFCSkZ3NEZhWDBZaHE1RTBzakxIRkEwQWdEcUxqb25iWCtxNzBtdFhrcGE5M1ZyZnpYSWxXMG1VTGk4Tlc5d3FTZFVCeFRYa2VJYnRwTWtXdTh5L3JJaHp2LytWWWVzYldSbVpZOWx6Q2tRQVFKMUhWbytrLy9sL05abHBORjgxWEZ0SitlNko5WjlWeTh2RFRENWlQYVZ4MVFvWGk5YkRLWEpoVzhHRnNGeTlrc3VwK0d3MnpKR1laMWpzL0xlQ0NrK1d4bTR0ejJ6QTJreVlrYlZjY2drQThQQno2VCs4b2UvOWsrYnoxY3lQa3ZZckdyYVBScExzdkdTTDY3WUgxd205M1N6TWhkbXlzT0ladGpzc3QvSmNZdklMYXovL2tkWHQ5czJsSE85L2JXMW50YWtSYVdrQUFOUlkzK2Y2My8rZEh2eEI5MTRFVy9QTnNleXh6Sm1PajdnM1poamppZXlWOUVyMld2T3JBQ3RjZlBnbjkzUjh3dWNEQVBDd3JodCs4b2t6Ym5kZlBkUzM3dXZPWGMwdUE2OTVtTXhJZjV6bzNXLzArLzhiZU0wZmZzd2xsd0FBRDR2N0hMNy9xWDd6L1pDcm5aM283S1dPelBMbTJnamdSbjhjNjcvOG1UNy9VY2kxM3Z1K3Z2eVVsZ1lBUU5mKzAvK1dwSXZGYWF4bkowWFlNQitkSkxaNy9tYXVUOS9VWjI5SzJ0elNPaFFHUWdJQTBsQTZudEFuUGtoWSsxdHNQLy9HNko0QUFBQmVLQm9BQUlBWGlnWUFBT0NGTVEwQWdEU1V6c1dvc25tUnNrc2NNekM3WjNqT0xYSFBxRndWVnBSSS9uRlFOQUFBVWxLYzZiQjRMQ3g5MWgxV3V6YTdWMWpWK2p2UFB3NjZKd0FBU2FnNnp0cnFBMkxBc0dMTkVDcXNrL3dqb2FVQkFKQUt4L201endHMVlWakRVLzA5dGhnMmJOM0xFUTh0RFFBQXdBc3REUUNBTktRMGkxR1B4V3hxb0tVQkFBQjRvV2dBQUFCZUtCb0FBSUFYaWdZQVFESjJ1b2RUY1lZRDkyVU1wV0c3cnNTeHBHcGhWVmlrL0dOaUlDUUFJQ1VwSEhkN1hUY3dFQklBQUhTT29nRUFBSGloYUFBQUFGNFkwd0FBU0lLZGQ1MEI2dERTQUFBQXZGQTBBQUFBTHhRTkFBREFDMFVEQUFEd3drQklBRUFhdU10bDhtaHBBQUFBWGlnYUFBQ0FGNG9HQUFBT1M3UVpMeGpUQUFCSWcxM2RiQ243UUpJcERIZklodG5Nd21LWUxUeFFSVmh1aTU1aGpzUzZ5djlTOFZBMEFBQ1M0YjZMWS9Nd3h6MGszYXZ5REVzaC85T0lRMG9wR2dBQUNhazYzcm5QeVd0ZjRvaHhiTlJuVlo2SnRaTy9rWFFaOFRJVWlnWUFRQkxjaDdyYWhvQmRWeGhxVlo2SnRaYi9wVFNQVmpVd0VCSUFnSU5DU3dNQTRHQmRTcWRpY3FjZW9LVUJBTkM5NTEwbkFCOFVEUUNBamwxS2IzYWRBM3hRTkFBQXVrZExReTlRTkFBQU9qWmIvSTlqRWdMM2t1SkM2emVsUWRVb0NwK3duU1pSY0M4cExteVlmelFNaEFRQUpDUGdjZGNkbG43ZDRBN3JxRzZncFFFQUFIaWhhQUFBQUY0b0dnQUFxU3ZlOXFFMk9GUll3RzBsbVArdUdOTUFBRWpDM0M3dnBGQXEyZU51VW5WRDdFcUNsZ1lBQU9DRm9nRUFBSGloYUFBQUFGNG9HZ0FBUTVMZ3NJaWRkSHBiTHdaQ0FnRFMwTnJoOExEckJzZG8wc1pvYVFBQUFGNG9HZ0FBZ0JlS0JnQUE0SVV4RFFDQU5GakorQTBSMkNtc05qaGdXQXI1TTZZQkFEQUlNWVlvMWdZSERFczUveEJvYVFBQXBLTFR5d2xSajVZR0FBRGdoYUlCQUFCNG9Yc0NBSkFHT2llU1Iwc0RBS0JybDEwbkFEOFVEUUNBQlB5MjZ3VGdnYUlCQU5DMVMrbTdYZWR3U09heFZzeVlCZ0JBQW40cm5SZk9aTzFxcXFMY2NBY1RMc3d4RlpJanJJWEVQTU9LK2NmczY2Rm9BQUIwYlgyY0s0NkZMQjBkR1RCczcrbVlZaWZtR1Zhc00wNGpEaW1sZXdJQWdBTVNzNldCb2dFQWdNTVNyYVdCN2drQVFCSWM5Mll5aFg3OHZjTktSd1hVaGptMjZCbldjdjZSVURRQUFGSmhTdytTTm45UUxEbEdlb2NWTitFem5LRHFxQnd3c1RENVJ5NGY2SjRBQUNRc3huMGoyOVQzL0xkUk5BQUFBQzhVRFFBQXdBdEZBd0FBOE1KQVNBQkFHcnJ1c0VjdFdob0FBSUFYaWdZQUFPQ0ZvZ0VBQUhoaFRBTUFJQTMrWXhyYW5BUnhweTJHRFVzUExRMEFnTlRscDByME8rS0d2TUZreFJiM0Myc2gvMGhvYVFBQUpNRjk4UE9jMTlsbm5YdmZtTnAvRTdWaExlUWZBMFVEZ01QMzhTKzZ6dUNBZlBMVHJqTkFkK2llQUFBQVhtaHBBSERnL3ZQLzFMOWM2SGF1MjdtazZDMjV2UjNpdHVUSTM0NWxqL1dYdjlKZi95ak90bnY5eGcwRFJRT0FnMldzSkQzOWYvcmdLLzN1VkVhU2taMUwwcEYwdXgxY1hKSmRXSHhRK3NMRlkvZXFQTGNZTnF4NS9pUEpTTE94dmpoZnZySFdGSUp3NkNnYUFCeTR5WTErKzVvbTE1SWtxOFdSYmk3bERubkZKZG1GeFFlbEwxdzhkcS9LYzR0aHc1cm5ieVVqSFYvcCtsN2hPUXdHWXhvQUhMaWJrVTV1dWs3aUlGaEp4N3JpdURGZ2ZQZ0FEcFkxc2tadnZ1dzZqd015bVpVMFFnUmpWLytuN1FmWlA1Vlo2QTRycmtyYndZNndZbkJ0WXJrMXA1Qi9CSFJQQUJnR0J0a0ZZbHA0SjZ1T2thWEhYYzh3eDNHMzZyV09OWmN1THoyaTF5Ym1HZWFmZjh5eEpyUTBBQUFBTHhRTkFBREFDOTBUQUlZaGNyTXRtcU1IS1lpb1gzT0tCZ0NEd1VFcGNZc1BxTy9UWTNVdVp0VkEwUUJnS0hLSEpMTzlmTDNFWmg1byszRlZXTldxMXMvV2J0RXpzUlR5bnd2RFJkRUFZQkNxQnFHN1l6ekRIREdkaE1YTC81SldnR0dqYUFBd0RCenJBdUdOSERLdW5nQUFBRjVvYVFBQXBLRjAyaUtraEpZR0FBRGdoWllHQU1QQStTdlFHQzBOQUFBY2xtalh4ZExTQUFCSUE2MUJRY1M4THBhaUFjQWdXRzBtS2pKR05qT2xrVkhtejh3TVN0bXdaWXhrekdwVnlqeWw3VlZwOVZwNWg2MjNtTW5aSjdIVzhzLzhieXk1STEzcHpKREZoZm44dzRYNUx3a1YxanoveFVLS0JnQm9Kak15MzI2UDByZGIvMU1ldHBuZ3FCaFcyTWcrWVhiN1QrL0VXc3QvK2I4dDNyK2o5TURYNWp4YS9rdENoVFhQUHpiR05BQUFBQzhVRFFBQXdBdmRFd0FHZzNGMnpVWHRudUFEU2g0dERRQ0dnUU1TMEJoRkF3QUE4RUxSQUdBd1BCc2JBclpKaE4xaXN2bGpNQmpUQUdBWWRyb1pFblZEakZVMTMxWjJMb29tWVdZMWFVZW9NQVZLekRQTU03RUlLQm9BREFMbnpNMjFPRWREaFZBMWsyY0Z1Vk9ZajViemo0RHVDUUNBbCtWQkt0cDlEWkErV2hvQURNTThoVFBsL290NVh3TmIrSWl5YmZDbUlzYjl3cjNEU3AvYU83RTI4NCtLb2dFQXNJdVlyZUtPNlpQZGN5ZkhtT3paL1EvZE5iRTI4NCtIb2dFQWtBWmFnNUxIbUFZQUFPQ0ZsZ1lBaDI0bW5VamlDb3JHZUFNSGo1WUdBSWR1Sm4zVmRRN0FRYUJvQUFDa3BHckVvTTM4bnlOTW1aalNaMHZEcXJhNFIxaUgrYnZqUTZCN0FzQUFQSlI5dVhwY3ZHb3R1OXg2aEdYM3k2WWlSdEhDT3M4L3F0b0RxbitZejNHMytHelZuenVGZFpoL1pCUU5BQWJnSytsczlkaTlINi82YzZld0dOZi91V1BDaG5WK1lSOVNSZmNFZ0VNMzZ6b0I0RkJRTkFBQWNGRGlOUXpSUFFGZ0dHaGc3NFYyUGliVDgrK0RNLytab1dnQUFCdzZ1OWV4enJNQTJBcXJma0g3NVVUdy9KM1BOMFgzQkFDZ3h6d1BrR0hEQXVwWC9yUTBBQmlHeGQ3VWZlUENOWjh3OTFXSTdZZDFrajhHaHFJQndKQlVuSWpaM01IUko2eVZNOFI5RXZNTVMrVFU5VERrUDRDRFJkRUFZQkJxajMzSkhrT1RhcjZPZTJUc2RZR1NUdkl4UHlUR05BQUFBQyswTkFBWWhuUk9CSHR0R0kzd3FFSkxBd0FBOEVKTEF3QWdEYm5XSUxNYVlGaTYzQjFXZWwrdWdHSFd1YnpiL0dPaWFBQUFKQ2wzSzhqY2NuZFlrSnRWQmduckpQOW9LQm9BREFOakdvSmdUTU93VVRRQUFKSlFyT3V5a3lJWEowZ3U3U1h3Q1N1ZGEzbmRTK0RZb245WXQvbkh3MEJJQUFQaWJtNm9hZ05PSnl6QnhLS3kyMm40dE5uN2hCVmpsSG1IZzRSMW1MOGt6U3NTYW95V0JnQ0RZRmRuWWU2N0lsbDFGMlk5anVLbTQveVozS2tIWmhIZlNZb0dBSVBodVNmdGUxZ25pU0VwMFQ0MXVpY0FBSUFYaWdZQXdDNmk5WmNqZlhSUEFCZ0dtdG1EdUl6L1RtWXZUakNGcDFSNHRqVE1GQjc3aEdYWDc4aW45Q29GbjdBVzhvOTgrUVJGQXdCZ0YvR0todExyQlBZTHMyV1BtNGMxVDh3emJPLzhJNWQwZEU4QUFBQXZGQTBBQnNOV25NQnAreXl0NmpKNTkrUGNhNnV1d1MrbXRGTmlxZVdQZ2FGN0FzQXdyQTU0MW1ZNmdtMm12N2o2dUZzU1ZseVZwTVdmZHRXejdOeWk1QldXVDZ6ci9ERndGQTBBaHNKOTh1dytpNjRLcS9wemo3TjkvOFM2elQ4aXUvV3d0bEx4SFBhM0ZWYTg1MlNUdFRVTDZ5VC9oaWdhQUF3Q0xldnAyNk5TOGZ4WWJjbWpFR3RySE5aSi9rMVFOQUFZQnFvR29ERUdRZ0lBQUM4VURRQUF3QXZkRXdDQU5OQ0ZsRHlLQmdERHdBRUphSXp1Q1FBQTRJV1dCZ0NEVUd4b3lON2Z4NjZXNUNLTHR4WlM1bEo1VTNoaDlpcjYwakJiMklwUFdER3hUdklIS0JvQURNYjJVVEUvZDZLUkxSd2JyWll2S1EyemU0WFo3Y055K2NUTjIySEZ4RHJKUDdyU3NrZ1ZDeDFGamFORXlwVkYrNFdWYnJxMFpPc2svNWdvR2dCQVV2V3gwWFBLb1QzQ0hFZGp6N0JkdDlnOHJFMmxPWlFYV2RVdnpJVlZ2YkU3aFpWdTJwMUcxWVpxWDdoSC9qSHJCc1kwQUFBQUw3UTBBQUNTa0VMckJ0d29HZ0FNdzF3U3g2WEd1Ti9sc0ZFMEFBRFNRRWtYQkdNYUFBQkE1MmhwQURBTXhRdlMzSE1nWk1OTTVuRnBURGJNc1NyUE1QL0VQTU1DNXIvcTU4RXdVVFFBR0FxcnpSRnhjN2w3Y1VseG9mdmF1ZlVsOUhaekhDOWRsZnpDZGtpczNmeXRkR25vUXhnMGlnYWdxWTkvMFhVR0IrU1RuN2Ewb1YwdnF2ZFptK1BDKzlKblBiY1lOcXpVVHZtM3BHb0dwR0lEeWZyWjRzUkgyYkNxYVM5M0RjczE4TlNHZFpKL05CUU5BQUJmcDdFM1VEWEhsRTlGNHpuVlVyZGhyZVVmQjBVRDBNakhmeVA3UXJxVnJya1liVS9MSGVaWTlraC8rU3Y5OVk5aWJnYk5YSGFkQUxwRjBRRHN5VmhKK3NkLzFQZFcvY0VjbHZaakpHczBzcHBOOVB4cytjYmFjQ1hZVERvSnRqTHdOUjgwaWdhZ2tjc2pUVTQwdTVRVjg5NDBZbzNPTG5SOU4veWFaOUlMNmJYd0t3WUdoNklCYU9SaXJEL2VhdEoxR29maGRxelpVZGRKb0ZhOGF5N25VdGxRdjZxaGg3bmJRMWJkZ1NCUjlJb0FBQ0FBU1VSQlZMTDBQcEh1RzVFM0Qrc3NmeXNUODBkRTBRQTBNbmVQYjhKT1RNaGVpYXlIMGdVZlVCQ1hjYi9xamhHQnRXTUtxNjRCc1dVQnBRdmpoYldaZjFUTUNBbmc4SDNWZFFJSGhmSnJ3R2hwQUhEZ1pwSTgydFJOOWRHd3RMVTVTSmhQUHJ2R0IwbXNOSXhCTzZCb0FFSmdadDNtWWgrUjZnNjhqdWZkRjhZM0NmUEpaOWQ0OTFQTnc5QUQwVDQvaWdZZ2dEa25ZU0VZY2JBYXFrdnBsRTgva011SXB6RVVEVUFJN095YXM5SVZiVFpEZFNsOUk1MTNuY2JCaUxaSFlpQWtnSlJRZmczVHJPc0U0SWVXQmlBRVMvOUU4aWhIZ01Zb0dvQkFPQ1lCRGVWK1JNMnZHNUgzVlNqRnladmNZYzBUOHd6Yk5mL0lPeUtLQmdCQWtwcGZONUo5MWllc2RvczdUYVdVWVA2TlVUUUFJZGlLWDZ2WkJGUXF6aTViR21WV1R6cjNDNTVoWG9sNWhnWEtQM3IzanEwNG15eithYmVYbDA0Z25IMmNmVkFhVmp4L05XVUoxSVlWdDk1Vi92SGxFdmNKcm4zV015eElZc25tM3hCRkF4Q1R6MzdXNzB6Qyt1MnlQY05DbmlvRnluOGVlV0MyVmNYWldOV2Z1UWRWa3hqNGhCWC83UUhEV3N3L2R0bVF1M1FtNEZuOVRxZnJudHRxczFWaXAveWpsZzVjUFFFMGM5dDFBZ0RRRmxvYWdHWnVwSCtXN25TZEJuQUEydTBCd1I0b0dvQm1hR25vQ3c1SVFHTjBUd0FBQUMrME5BQWhjQllMWUFBb0dvQUFxQmw2SUhlTm9qdXkrWFZ5TzRWNWpucjNEMnM1LzdBY2w0eVdoaFV2R2EwS2MxeTVXSHpXSjh4eGJXcUgrY2RFMFFDRVFOVVFSRHNIcDUydUkrMXBXTHd0UnYyTVBLOEZMWDJKVDVqN3lzV3FxMVg5d3hMSlB5YkdOQUFBQUMrME5BQklTTHlUSlJxRGdPWW9Hb0FRT0NLRmNHSHljd0tHeEdmVW5KV091czRCbmFKb0FKQVFqdXhENWpzSnVyZlMyNkVVRjRZTkMyalB4R0tPTzZGb0FBS3d1WUhRMnY3ZEZzZVIrWVFWZHd6dXNOem9hMGZZVnVvZVlhM2xEd1RsT1Y0d2JGaEFUUktMaEtJQkNLZDA3TFFqeGorc0tySzRSYyt3Mm8xMmxYOE1NK2trMnNxQklhRm9BSERvWnRJTDZRNk5HVUJURkExQUNIVEZwMnpXZFFMd1Z6cHpVZXl3Z1BxZWZ4MktCZ0Fwb2Z4S1g3eExYTndUSEpVR2h3b0xxUFA4R1FnSjlJTjdubGRIL041aG5sc01HK2FUbUdlWTNSNVplUkh6Z0tUTS9qZnFrUGVkTnJGZldJZjVYMUxZRFJwRkF4Q0NYUjcrckYwZEg2dDNyT3NyTFhKaHVVUDIxcUhXRVZheHhiQmhiZVJmdDkyR2JPVWZMV3d2ZEZoMytadDJ0bzVVVVRRQUFkakNmejFmVXJYUXZhcE93cXBlMWRvV0FYU09vZ0VJWVo3Y2VDV2dmNmdmazBmUkFHQVlPQ0FCalhHWFN3QkFRcXpmVEloTndvb0xBNGFsazM4TXREUUFnWEFpQ3pSakt4NDdGaVlibGs1aVlkSFNBR0FZM0VlazdKbGE4WUVqclBaTTBDZk1GcGFVWnI1VFlpM2tqMlJGKzdCb2FRQUNxTDg3WHdzWDF1OG43SFFDaWZNL2szVWNkeU9GMWRZMFhTVldHeGJRQVh6SFVuQVpjYjRUV2hxQVZpUzdOL1JNTE5uOGQxRjdDV2k4VGFRUTF2S3EwQ1ZhR2dDZ2llTDVmUEhaZ0J0S002ejVxcml5ZU9Bb0dvQVFPRUZMSDU4UjBCamRFd0NBbE5qdElhTFpOaUs3WTFnMlJvVUg3ckRTVjFWdE1hbjhZNktsQVFoazhZdXRiYjMxQ1Z2LytQTzNjR2dRRmlReHo3Q3crV000Y2pPcmxoNGphMGVKbG9iVkhuZmR6M3FHN1pHWVo5aXUrVWREMFFDRVlGZS9WaXR0MzdoeGJldjZnNTNDYk4ydXdDZHM5Vnp4TW9qOUUvTU04ODQvM2JyQk03ZE93bnkwdjBVY0tJb0dJQUNmY3Q5eGdyRkhtTThMUGNQQ0poWTcvLzAxM0VEc2o2RkpXSnBieENHaWFBQkNZRmNiQktlNWcyY3pMVmlPcjBPTXNDQWRkT25uM3hCRkF3QWdDVmFabnI2NlVyeVRzR0o4N0MzdUZ4WnRiaWVLQmdBRFlkZi9LVGtieTUzSlZmMjVQcVVyT2Y4enNyWWtMTC9GVmRoNnVmczAwVCtzdGZ5UnVNdVlUWjhVRFVBSWRFOGt6MVk4cmxyb0hyMWVjdjVuZzRhVmJkMGQxbEwrNklONG54ZnpOQUFBQUMrME5BQUIyR3dqY2xIWW0wSUZERXNrc1d5TGViek9XUFNMZSt4ZmpGVjFFdVpqOXkzRzYwU2lhQURpUy9acXZkUVNpOW9aU3d0N0VGSEhOTGk3V0FLdU9hbXcwRnM4RGJmWklyb25BS1NFUXp2UXpHWE1sZFBTQUlTUUd6YUduZkR1QVVFeEVCSUFRaWhlRCtDK3JLSTB2bGpsMk8ybm1vVFppckIwOHNlQTBkSUFCSksvbnQyNWh3MFlsdXRqOWdsckp6SFBzTmF1K3c5NDNKWHpnQm9wTEpIOG8ycC9XRzVBblF3cmJoMUZBeENBTGQzaHVsNFFMaXpsRVY0NzV0L21HTHVvZS9qU1Z4WHY3K1VaRmpBeHp6QkhZdDJyL3ZmWWJKTHRIM0ViL3lnNnp0OFBSUU9BSVlwYUhaVyt5dEVFMEh5TFljTnFFb3QyV2V5NlhXUHZBc1gvVUp0bXUwRHcvSU9qYUFCQ1NQVzBBQnQ4UmtGRXZTeTJSWjBVWndGMTlTRXdFQklBc0l1REtCcXdIMW9hZ0JDYXRLanV2YmF3R3cybzcvbWpLNVFqUWNUOFdWRTBBTTNjcmg2RTNkOGwyeXJxcWUvNUF5aEQwUUEwY3l2OVR2WnNhMXhTMVoyTHJWeGhwVEZody9aTHJKUDh3Nk5BQVJxamFBQ2FXYlEwMkpwTDVkY0xmYTZvcngzS3ZuZlkzb2w1aGpYTTM5QmJBYVNOb2dFQWtJYlNCaWk3L2FBb083VkZyaW1zMkpaVk9nSEZmbUdsaVNXU2Z6UVVEUUFHd1ZidHNuZVV5TzNFOTlaOGkzSHZYbDdWVHVWSXVxcjV5MmYyaWVaaDdwZDNrajhESVlIVXpia1FJSVErdkllZFhOOGZjRHhHd3kwZXlqUU4yQlB6TkFBQWRrRFJNR1MwTkFBQldNbmtMaW9vWG1tUTI5ZVdoaFVWdzZwdURHQXJIcFN1U241aDdlZVBBY3UyNWVkNjhFM1pRdTBTVnZxbGF4N21HTnZRU2Y2eFVUUUFZZGppSTU4ckRVcWZjb2M1cm0xd2h6VkpyTFg4bzZJdVNad3RmYmo1MC9FMTNDbXNhdUVlWVR1TmJlZ2svN0RvbmdBQUFGNW9hUUJDNEJRV3dBRFEwZ0FnSWZPbzEvT3RHMytMRDFUV1V1d0lzODR3Nnd6THhwUXVkR3lyOC96UkM5RStMSW9HSUp5cUgycHVoeHMyckNyWXA5KzFLaXhJWXJ2bmYza1I4OGcwMzg2cWVDUmU1Mlk5d3VRTWt6T3N0aC9ic2EwVThtOUgxYiszR0tPNlZFdmY4SVpodFJ2cU1QOVoyYllDb1hzQ0NNRm5yK3B6UU4wdnpHZEp3N29oYXRocXlha2l6aHpFZVhKemJkOGZaSS9qYmxWOFgrb0duOVhXYnZFazR0ZWRvZ0VJb1BnTE5kVlBGY05xWTZ6SE5ZbkJ3K1NYbTAvTVRsdEVzaWk4K29HV0JpQjFoYjJwNSs3Vko2eTBTYnVkc0ZwaDg0ODcyeUJIdkNBbzdub2gycmVkTVEwQUVzS1JIVWdaTFEwQWdEUjQxb3k3emgvYS9DWmQzZDUvclAzYm1sV2phRWpkbzhkZFozQkFudnhGdEZWemdud0FiS0h0dmJpa2FxSFAya3BqRkRTczVmempjR3g1K1pTdHljNW1SdHNzNHB1RzJackVOcUhwNVI4V1JRT0FZZkFmZjFIN3FvQWpQc0tHdFpCL3pFckNmWjJCZjB4WFljWDQyRnZjTmJIbUtCcVM5dkhmYUhhcHVkWDh0cnJwcWZTR0oxVmgyaTZEM1lQKzIybVJpNTMvWXNtUnpFaC8rU3Y5OVk4OFV0MVBvRjl0OHVlQk5mcWVQd0FIaW9aRUxWckRmdk5NNzJqWmxpVXJqVlpYc1k4eWw3TXZCck5tbDd2RDFqRXF1eWErR0ZaNjNmeklZNHVlWVMza2J5U2pxMk45OGRxcW1USDA4Y29HcmZQRG5xQzJyKy81bzN2SkZwV0RMNG9wR3BKMk01RitKM3NpcVhEUDFOelpkdTRHeEk2d2JCTkNhWDluTHF6MHEyODl0dWdaMWs3K1ZzZHpYUi9venhnK2xwVTNVbVlySGlkbDJFVXhSVVBTTHNlYTNOZnNvdXM4RHNPMXJ1SjkzdzkwQjNGUStJeUF4cGluSVdtRzNWdzRrMUhnVGdRQUdCcGFHdEoySy8xTzlvNVVhTERQalZNMDJ3M3pwUStLQzB0WDVSbFdmRnliV0lmNVcrbkNSTzVsekhXbVZGMzhWdFdWRXlOc0hhenFzS3JPb0hUeVIycWkzb2tVYWFOb1NOdXRwT1ZPZjMxUUxENXdQK3NJSzQzeERDcytEcGlZWjlpdStVZmMxK1cyVk14SmRmKzJTR0dPZVBkVG5lUWZ1NnBEYzFIbitpNmVLT1JVbmJnNE9DN0k4bGxWSjJGVkwybTRxaEFvR29Bd09DUmhLR0ovMXgzcmQ5ZTFPNjNOYzFXZGhGVzlwT0dxUXFCbzZBTU9SK25qTXdxQ0hnb2diUlFOUFdDVlB5WXQyNkl5WGZmR2JpK3BDSE8xL2ptZkxTNHpwbVJjWVQ3TXlFalcxaWNXTy84bCttS0h6TE93YTlobzdCTVdkaE5SVjk1aXV6ZDZnYUtoRHdvL1dwdGJiZ3RMS3NLcVZsajdiRWtIdDArWWQyS3g4NWVraTRQZS9jVWVFQkJiT3ZrM2JEVDJDUXU3aWFncmIvMG40OTVnd0ZMSEhlTnpEaElwTWM4dzk4Q0plQ2dhZXVLQWozWnRpdGZTa01JSGxFSU9UY1RQMzZaVW5LQ28yS3BhRXVDNW5tWXh0ZWNnZTJ3eGJKZ3JKdVpYbkhrYUFLUWtXdWxBM3hUUUhDME5TVnRlY1ZtOXQydS93NUVPMDNLcmU5MnVtelJYaTdjZWEvWHNIbUc1VStUOXdxb21ZaWdPR3VrbS84dERidzBDZW82aUlXbTMwdGZTYWZYT3J2M2RZTTg3VEdOWkhPbEttelJMaG9Qc0crWTVsc01SRmlreHp6Q3YvQS9tT3dFY0lyb25rbmJiZFFJQTBEMTNmVnI3RXNkeW56REhGc09HVmIzRXNiejFJcHVXaGo3ZzNDdDlmRWJOdFRCQTBXY1laSzdycGJVd24zOStzdm1INHVpY29tNm9XbDRNaS9sNVVUVDBBTGRaQ29OQjh3Tlg3S0dwRFc0ekxObkUvTU13QUJRTlFHaWx3d0pWZlF1b3NHRzUvYnY3TGxhbFlkM21EeUJoRkExOVFKa2ZST3hqVW0zem8yT3NZSnRocFh3YWJHTW54aldSUVBJb0dvQUFxT3VTTnBOT3BOWEVvM3hZK3pPUmEyOCttK1JSTlBRQVl4cDZnTFBrbE0ya0Y5SloxMm5BVzNIOFplbUl6R0tubG45WXNmcXhmbHYwVE13ekxGNytrVkEwOUFGRlE4SnV1azRBOVdaZEp3QS90YjFrQWJ2SUV1bENqUEhDcUtVRDh6UmdTT0tVWDcrTHN0YVZ2ZytEVHpZeEFMdWpwYUVQMko4R2NSR2xFK0ZXK3JiMEt1cG5STjBRQkwrajVyaklaZkFvR25wZ2JsZS8wOWkzYXRqN2poR2xML1FNQzhpeC9zVjdHSzJsNFU2VUZRTURRMkhYbkpXT0lxNmVvcUZYRWprVkM5dnZGMUFYZTV6MVZOOTdqRmZ0KzIyOWd1ZHZPSXNGMGtiUjBBZHBIakdRc2Q4VkxvazAyKyt0Wi9tdjgwaS9ZY3dkMW0zK0ZIYkR4a0RJdmxsZmFlNGVaN3hyV09sVzNHR2xyd3FlV01EOE1XeWI3NVRkV3JKOFlMZStKcVZoeFQ5dGJpWGVZWGIxeUphOXBKaFlka20zK2FNZm9sMEVUa3RESDJ6dkRyeCs1YnVHaGFvYmdpZm1HVmFYdjdWUnUvbllwd1lTK1N5Mi9LaWNlZERDVjdXNHJmcTZ3VHVzaGZ5ak56U1UvcFJNWnZNK3Z6V2ZzTkpwMTV1RU9XSmF6djh5NGg2Sm9xRVBPQ0FCT0d5WDBxbkhlWWpuenRBbkxPQ3Fhc1BhejUraUFVamEraWU2T0VYSW5WZ1UvNVJmV09uWlNkV2ZQcS9hYjlPdDVSOGI5WGZLbmt2blhlZUFPaFFOYVZzTXpXZFBGMFQ4cHUvTlZaM2JKeFoyZGRHc3pWMzV1V3ZZOXA5Ylc2emF0Q1JIWXBKWmJkb1YxbWIrR0taTDZVM3BYd0t2MWZyOTdzT0dCWlJnWWhRTmFidVZ2cFk5Mno1dncwNWluOGplU0JVOXlsbWVSOFlZclpqdXNOS2Vja2RZMVB3Wm1EOW96MlVqdERTMDJRc1JRMnFKVVRTazdiWStCQjI3bGY2WjJaMTZ3bTczc09TV0ZIdGVhc01Xc3E5UzVpbi9NRnVvYmhzbUZpOS94Um1aUDl2ZUZsSkYwZEFIaTU4b1A2ZjlaTiszR0RzN0NydXc0bjNQczcrallnTkxXYjlNZlppMi82eGE3aE5XMGVteloyTHg4bzg1TWgvcG8yam9pZEx1aWV4NVFIRnNXalltRzVaN1VGeFY4VmwzbURzeHo3QVc4bWRubHpnYjYvNGdDSXpmMFlCUk5QU0FyZW93TCsyT2JuS3VVL1duTzh5ZG1HZFlKL2tIeEc0MGxHanZaTEh4WG9YMisySjhiZGg2dVNNc3QrbmljbmRZTWFVTzg4ZkFVVFQwQWI5VW9Mbk1KR21seGFlanJIV0hsVDRWdGdjakY5QmgvbkVWbXllTHorWmFLSnVFRmNkOEZJTkx3M0xGWGZERUd1WWZFMFVERU1CKzk1NEFVSzZxZVRLM3NHR1lvN0d6cW9EeXJObzZ6ejhhaW9ZKzRJQVVDRzhrQURSQjBkQURuTVVHd1JnN0FHaUlvZ0VERXJINm9yQkxINThSMEJoRlF4K3dzd013QkUzMmRaNXo1aVk3dFc1UDhxZG82SU0wditLOUUzVlFNWjhSRUVMdStvbmk0NXpOVTdacFdISHlsOW93eDVXb1hlVnZwYU9LbFFSQjBkQURISS9TbDd0SXlsUS9WUnRXM0IvbEpyalM5dFZWdWF2QXFzSnlXOThqc2RieWo2WDRROXI3M0s3MGhiSERmQkx6REd1U1dGdXFya3VJRjJhZGY4YllZdGl3ZGo0cmlvWStvR29JSXZwQlNmUHFNdy9QYTZOMkRiT0YvenJDU3RjV0tUSFBzTVdEeGZzMmozeUdWQ3hUcWs3YTh2T09Gc05zU2RqeWZxRWVZZmt0WnNJMmxkWjJXR21aMVVuK0dEaUtCbVI0bnU2RkRRdW8vUzFtTjQwK3lCVllwWjliOFZtZnNOcnpQNSt3cWkxV3JhVDkvREZ3RkEwOVlPMytoOEtkaisvT0hZTm4yTllMbWdtYlA0Q2s4ZnNOSXVhNUUwVkRIeFRiTTNkN2RRZGhBU1diV0kxaXZWTlZBZVdXN3gxbXQ5dTQvZE5ZdHo2bmtIODh5WDFGZ1A2aGFNQ1F4SnZkeWQzKzZ3NHJMdDg3ckxTaDJUTU5uN0RZK1FOSUcwVkRIN0J2RGVLQ2Q3SUhtTFVUU0JsRlF3OVl1eldBdVNaNEZiWTFFcnNzekZROEtBMXpMOWtwTWMrd3NQa3ZwK0tPZGtTeXkvK25MTm5UNG4yN01ESGZ3TncxQUthd3NQWkN4RnhZOGFuc3E0cGJWT0cxVld2d0Nlc3EvOWh5LzRTQVY2ajZoL204cXYwcmJIY0tpNGFpb1I5MkhjQ2NhNlYydDBaN2hqbVc3SnFZWjFpay9KR3k2QzBOcFYrWDBtNmQyckRpVTQ1WGxXNjlTVmhYK2JjODdxU1RIZEIrVzB4bkJ4b1RSVU1mSlBCRkFZQUZ1cENHaktMaFVBUThBL0JjVlNkaFBxbzZLcUppUDVvOG4wYmlvazdDZkhTVi82VkgyQjR1cGRQVjQ5SitFcE41MWxTRVpkbnQxMXJ2TVBkK0tCZFd1N05wUC8rRmVEc2tpb1llc0t2SjJsVDQ4aW43ZmJJbDMrQmlsMlhwRDZPNEtwWDlpdllPSy8yTnRaay9qVFhJZlFsaWRLaUZDbXQvaS81aHA5SEduZnhXT2kvYll1NkJ5ckoxTi9tWHJxUXFyUFpmNStqazhjbWg5Q1VCODVkMEdYT1BSOUhRQjNPdnprZjNOOTRuck9vNzZ0NmlaMWpWOTc3OS9HT2hNQW1DTnB1MHhXdHArSzcwUjM1RWdWQTBBRW16WmIvUllpTmtxVkFOeURzMXEvaUV0WnkvRlBrVUNZSEUrSWhPSzFvYWtCcUtoajVnTnhwRUMxZUxiV3U1QVhtblpoV2ZzRzVhNXZtMkQ5S3lwYUhyTkE1R3ZMMGRSVU1QRk05aTk3djB0K3BVTDJCWTFFdVhtK2JmOHFWaVNBMmZVY0pvYVFqb3RENWtmNk9ZSzBkanQrV0xkeDFINDRnSkc3WmZZcDVoRGZNSGtLeEZTNE8wUFNMSkZ2NnNXdTRaNW40Y05xeXIvS09OTzFtZ3BTRnR0OUxYMHAydTAwQXQ2MndRekQ1YmpNeU9SS2hkU1Rhc2RLUHJNTWNXL2NQYXp4L3Bpek5ZZGRQUzREZ1BxSHJzR1Jad1ZaMkVlVCtPZCs1RTBaQzJkVXVETGR2UDVocmxzeHhoVlFjQW00a3BQaFVxclBQODQzSC9UQjA3aSt3U3o1VzQ0MjNocVNaaHhhY2k1Ujl2UDlmTytnY2l6bURWcUNmSENJaWlvUWRzYnVlZStjVnUrdThkKy9GaVdNV2VlaGxXdDBQM0NTdEpyT3Y4VGVsV0l2QXBVUnluNVVGTy92ZE96RE9zay93YnF2M3d3MTU0RW1wVm5ZVFZ4RkIrcFMvYXBjc1VEWDFRL1JQMS9QRzJINVppWWhjeGIxaTF2ZTJHQ1FjNStkOXBpMkhENHVVZjFZRi8vM2NKUytIandQNWl0dHRRTkdCSTJCY0NLV05xcnlCT0krN3JLQnI2Z0VNZDBCeS9vejdnVXdxQWxvYUJLNTF0Y0c5QmJzU3c5M3dNelNWNkk0a1Vjd0o2aHA5Uk1OSGVTdVpwR0p3ZzN5WG5zTVhBMjJwaG5RQUFIN1EwOUFISHlmVHhHUVVSOVNLS3VUU3EvcVN5VFZpTzVpeWZNUCtiZHF6RDNGdjBER3M1LzZoS3I2Z0pjdjNQVHRmcTdMM0ZSUEtQZ0tLaEQ2cCsyQUV2d3dxb2s4dkl1dGFISEJIaVdnNmZzRDB1WTJnbk1jK3dEci9OdGVrRnVVUmtwMy9nM2x0TUpQL1FLQnA2b1B3YkV2WXlySUE2dVl3TUFCQWZSVU1mY09BTWdodFdwUzl5dXl1ZkV0QVFSUU9BUWJDaWFnQ2FvbWpvQS9aMFFaaVlNOGM0UHFQc1hab2NsNlg2aE5XTzhBZ2IxbjcrQU4rUXRGRTA5RURZZVJvR0s4NTlkanpZd2dQM3M0NncybjlBMkxCY1BpM2tqNEhqRzVJODVtbkFnTVRiSTltS28yZjJXR20zbDFRZGJXdkR0SHRZOGFuY1FUeWQvTnZRU1FWVy9QZVh4dVRlaTNRcVNBN25rRVJMUXovTU83NHdGL1hzK2o5YkQxUzJUM2Fjbkh1R0ZiWmNFN1ozWXA1aFlmT1B4ZjJ2Y3J5a3picWgrTlRBNmdhYjZuMUUvV2ZmYURreC83QWdLQnA2Z2pLL29jVWJ5TzF3Z0lSNVZpK2VNV0hEMnQ5aThMQWdLQnA2WUo0WlJvWmRiZDYzaTVScUw4K1BNOWxQUFY3K0ZIWkRsczR2RkJVb0d2cUFIMUlvOFE1SWUzeEdDWjVFN0NSRy9sRUx1MVVYVXNCcXAvMnc3aE5MczRwRlc0NGZQZTQ2aFo0N21lbm9SdWV2OU1sUE84cWd0YjJJM2I1d3poM212OUZPOW9KSVZyVENidGZCRThtR0pac1lob0NXaHFabUozcjRJdGJLYnhmL0UycUFVdk13Vy9odjdScVMzUXVHY2lPSndhb0FCdUg0N0t6ckZIcnU2RVpYNytqSTZpOS9wYi8rVWVDVjMwcGZTNmQyaC9GQktJcjd2dDFLL3l4N0orbzJocUtsdXF2dnJWWjl6NzlXMVJVVXVUYk8wckNxZTBzV3czTHZUOEN3YnZPUC9LRlRORFJtWk9hYVRmVDhYR2JSYVJydU03c050aVpFdzRmVUY3czJnUG1IdGEvRC9OdTVoNHZuaGFiRk1NY0wzYXNLRzlaaC9wSHJodU4wZnhWOVlXV2xzMnRkeDVzb2k4K29GL2lZQUJ5Nlk4c0ZUaUhjU3JPamFHdm5hQlJFVDV0cUFTQVptYUxCZlRjYUoyTzI3NDlnSkZ2WkMxTWF0bm5LeU5pU3NQekQrclczbFAvU0tPSWRJcWdaZXNEblF4ckN0SE5oOHcrcnlSYVRmY005SlRpeklQb3AwejNoMlpWU0dsWFdzMUxmV1pNSnM1bUZwV0g1aDN0M0JaVkdOY2gvSTZrNUFGRFVlVXREc2hlU0JBenIrMWlCS3NtKzRaNTY4cmxZNjdxVWU4RVVsaGRIRmxZTkU2d05xOXFpWjVoRE8va3YvNHc2cG9IdWlRQ3NOSXQ1TDhyRm1rM0ZFbHQ0a0kwSkcxYWNnTUVkbGxyK01mbHZ3WEU2WjdiL1FRSERBb3FYZit3eGRyV2p5OTNQN2hSVytsTndyTW96c2RUeUQ2NzJHK3MrbmJPRi8rNGFWclhGUFJMekRBdWJmK3hkSFVWREdCZlNQTVk3bVIyWjcvaXVGUjlFQ2l0K2JXdkRIQXZienorZVhiYmxpQzE5ZzRPRUJkUmEvc0g1N1AzMzN2WHZIZWI1aGQwMXpIT2p1NFlaTWRYM29ISDFSREJSM3NoYjZXdloweGlySHB6T2V5ZlFNZloxUVZ6eVRnNGFMUTFwWXc2QXNLSjJJWFhTa2h1cU1kby9MS0JPM2pRMGwyelJVT3lVTFAyQzdSZldnckQ1eDBIUkVFaThTUnFVOEUrMFh5NGlONnQyOGpHMTM1Z2VWbTZMMUJBRDEvd2I2Tm5EdjE5WUM4TG1IOEgyMVJNK2sxRDZqeWFxSFVpemExanp4RHpEOXNoL0ZQa3NGa0h3VG1JdHR5c28zVE9zZHdLZVlWVXJ6eTUwNUZBYWx0dDBVdmxqZUxaYkdueUdDWG1HeFJqYkV5UXh6N0JkODQ5NUZzdVJyamtyeFp0OGE3RUJuejJxdTdteDZ1aFFHK2JZdDJjUEI0NE1heXZrbHZLUGZmbEU2UkpiOGVkK1lWV3Y4c3pCc2FyYVRiU1FQd2FQN29sbVRQWHZPU0IrdDhsYi9JeDhQaWgzYzJQdHQ2a3FiTCtEam1kdVBqRmg4dzlzSnAxRTNRQXdGTWY1OCtQY0dVcVYwckRpZGRsTndxbzJ1a2Rpbm1ITjg0OWs3eDJxNTNYNmtjS2F6eElRTmpFTTFreDZJWEZ6dnZUeFF3NGxXblBBY2Vsa2lQVkt3MnJidTNZSzg5eG93RlUxeU4vRTcrcHp0MzZYdHd3WFVvMFVsbCs2L1NEWEtOMVovbEd4czB2WlRGSisrclZjRjc4cXprcHkvU2xOd29xZE1pcXJlSXVKZVlhMWtUL2Y4MTZJZVZrczNSTmhtS09ZWXhybXkxK3daOXR5SjJGdVB0MmpuZVNQd2ZMc0lpbCtkZmNPSzkxUXdMQjI4bWNvWkQvRUt4b1doN3JTR3JNMGpkSlN0R3BFc0dOVi9tSHI0RjBUOHd3TGtyOW16SkkyYk5RbW9mQk9EaGdmZmhCUkM3dE45MFJ0S2VvSTh5eVdIV3ZiNllTMTlxbjI4NjhQYllnZlUzT2NJcVh2TXZLTjMvZ085SlRuWjVmc1I5ejMvRFBvbnVnRHUyblZjRFNvNUw1djJkN1EyckRpRjNXbnNOcVduaVR5ai9scnBLZ0xKZUtOMzhUbmxEelBFNzc5MXRDdHZ1ZS9zaXdhSE1QUEhZTnhTcDlxUHVEZFBmd25ZRmlrL0lPemhmK3E4TGhxaVdmWTNpLzBUTXd6TEhiK0VTWC9VKytGcUEwTkFKbzcxbHd5SHVXZExRbnpiT3AzcmJidXFmMFM4d3dMbWIrSnViUGpnQlFLUjZUazhXVUhVblpzYmYrYlRSTEkvOVZSbkZ0akx5VDd6dmVJbGE3amp6c3htZitxN0VyVDNQSnNoMDNVTUZONFNURjVkWmQvOXM4SUxxWFQydldIYldNTUdGWjZpV1RVTGZxSFlYaFNITlBReTIvMVZkeStXTHU5NjNCYzhPM2VVUmNEY21FKy8xWGh6OUtYSy9NQmxSNnpXczVmMGp6ZVoyUUwveTMrNlJNY0tjejlaK21xaW4vR1NNeVJURkJmU3ErNUk4S2Vld1FNU3pheEdPYVpYL3RhNmUrOHFMVGtMVlhjNzdpMzZCbFdWZDYxbjM5TXF4dFc1VXArRlhJcVBWR0lFMmFMYis1K1lhM2x2endpRlY0U3lLSWN5WDR4U3ZmQXhWMzBmbUUrL3kzK1dSVldUS0NyL0MrNjJ4T2ljOStSWHE0ZU8vYmUyU1grWVZWNzcxM0RIRzBLK3lVV1BQL2lmckVOdFhYblRtRzVwMHJEcXZadVVSTUxtSDlNWlRlc3ltbi9mU2srMnp5cy9jODF1SUEvV2M5VlZZWGxsamNNMjhPKytVZnNRZHIrSnBTZUNiaDN5c1VYdXNQMmZ1R3VZZTNrTDhtMDlXdHkvSHhMOThhdGhlMTZtT2drZnd4Y2l0MFR2V01VdVFLUFVhTjRyc3BkUElVSzIwUEQvQ1BiWTZkY3RTVDJDMnZEMnNtL2FtRVFpMXRQbkhQY0M2S2IxZ2Frb25EREt1em5LT1krejI3V1hkcVNXVHdYckJwWTRCOVdHcXpDNDlvd3g0T1c4NDhyWURzS1FwdDFuUUJ3TUFvM3JNTHVyS1NMbUdNYXloNjdGOXBDeks1aFZjSHVWWVVOQzV0L2RQeVVnTVljUFgxVlMrVGZCZFo2V1B2NXh6NTVvWHNpREtPNExRMEFnc250d3JOdFg5cHVwOHFGWldNVU5NeHhKSEdIdFo5L3pJTlMrMTFnc2NNNjJXTFV1b0h1aVQ2Z2FBaWluWEVuYUNMMldaSmpwMXZhOXBWYlV0WDIxVHpNY1lqd1Njd3pMRlQrR0xEajlXMlhhK29UMjExWXNvbEoxc29ZcWExOVhVdmQ4eG1lV3d3YkZsQnJXNHhhM2NjK2RZaXQ3L2tEV051ZUVkSzlmKzB3TE5uRXRPcUJHem1EbXltOUUyazdQTGNZTml5Z3JTMUdQbkJGL2RmMS9XU3Y3L21qR3dGUDluSW5YajVoU1oycyt1Y2ZlVWVYNzU0b2JyRTBRNSt3MmlXMjRoMm9DZ3VWV1BqOEY0dWlkdlRrdmxXMmtGbnhpb0xTZjJSdFdQRTMwekFzOXhsM21IOVVwVFBaWVZkUjM4UDU1bHV3WDl0WWt4YTFxdkVEUHEvMTNFUnRXUFA4YmR6em83SU5jN0s2YTFqa2ZWMm1lMks5eGJKam95M3N3Zk5MU3NOczVwaTZYcExab2R2U3NNV3FsQS9iSWJHVzg1OUxzemozbnJoZDVhYkMxeVgzelNoOXR2WVg2QTV6YjNHL3hEekRZdVFQckhoK0k2cStwSHVzM1BGZERyV0oyckN3K1dPWXFtOVlaUXVQYTcvMUFjTWN1M3VmeER6RHd1Vi9vVGozbnJpVnZwYTlFMkhOaUtSNFpsZHNIWEdFNVlLek1Rb2FWcHBBNS9rRFNOdnlrc3ZjRDdsVWFWdXZvODNOSnl5My8zR0V1WGNzS2VRZnBYZmlOc1pLQnl4MkYxTHBrcDBhYktySzVhcVZOQXp6VDh3enJHRmk3VmovZE4wTFBjTjhObEgxcW9CaGJlYlBOWGNEdGh6VFlMVnFuSysyZkhJN3JQSzAzQjIyNmdqSWJkRXpyRHkzYnZPUDJoZkxxVmdRM0xGcTRHekZZOGRDejdEYXpUbGVGVENzbmZ4bk1YOUhyRzVIaXdBQUFxNUpSRUZVcmYxQ293NGVhWUhQS1hJY21Sa2g5L3NtN1JkV2RjcXlYNWpQRnNPR0ZST0xQSUNMUVhaaFJMNFRhU1I5YjhMMzMvR2lIM3I5ZFZ6bzVMQVNVSGNmQVROQ0JqS0syMlIzQUQ5UzdLM3ZuMzZ5TzE0a0tOdnQ2K2lyMlNsczhkVnFFbGFhWWZQRU9zbS9JV2FFRENSbTA3Y1ZPOVQrMks5YnVtb1gwcVRQdTdhVHV6U3M4L3lqZnRYNUhhVXQxNGJyN3F0cE9hejRra1FTMnlQL0pqeHVXRlgxTys4OExMWEU0cFZmNjgrb2RNQm5jYUZuV0haNVZaaGpNSHh0V0hIb2FiZjVSMlVySGxmRk9QNzBEUE5aZVRIWUo2ekQvR1BlK0kyS0lSVE9OSWZNcjN2Qzg4ZldmbGd5aWJYVUhldll4UmNQV2tHT0l1NGpnVHVzNnRrVThrZXlJbjlTUHF0dmM1Q2M1d1ZpN1NkV0ZYWVo5U1BpZHhwRTFJR1FGSTFodERLTk5KcUlXOWp4R1NYUGYxZlg1c2xJVlRFY2I0dk53L2l5RDlsMjkwU3VEYm1LM1c1NURoSlcyNFpzL1JKVE4va3o4SHZnaW4weUtueHJjakdxK0daRkRhdjZuWFdldi90SEZnYkhPcUN4c3U0Sm45TFhzOVUzUmxqdEw3K1QvSS9vaTAxZUs1VmRhZi9NSGpFcGgwWGFJbDl6SUgxMFR3VHlLdVkrajcxcEVGR0xCajRqb0xsc0ExUnhyRWZWT09qYTBSbitJMGYyMjJMWXNJYjV6K04ybDljTmhHeC80RTIyZVRSSVdHdjV4NXM0S05hS2g0VXVwS0d6ZnZ1TnFwamFDM3gyQ2l1K0pHQll5L25IVU5wZ1hFd2pZUE56NlNZOHR4ZzJyQ3FyUGZLUG9PNlNTODhNQW9hMXY4WEdZWXNmYWNRbUc2cUc5UG52OU4xMnFsL2JQeHJGeTcrZEkxT1RYVkN4dTZVMDBqT3MrSkt3WWU3bFlmUEhrR1R1UFNHcGJsQlM4TERzbUVYMzJuWWR4dFZ5L3E5R01YOVo3ck1CaDdCaFBsSzRKcXlVbFk0OFZ0WEUzbnZ6WFdQV1lZa2NqWGFOS2QwaVJ5YWdEL0xkRTdid29GU29NT3NYSnUvZFN5ZjV6eVdOMmgwYzBrbERTL3RiYkQ5L0FNbXJPcEdMR2haUXIvUC8vNUpuenRoK3NGSnNBQUFBQUVsRlRrU3VRbUNDIiBoZWlnaHQ9IjUwNyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIvPjwvZz48L2c+PC9nPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzMuNTQxMTQ5LCAyNS4xMzU2NTEpIj48Zz48cGF0aCBkPSJNIDUuMTA5Mzc1IDAuMTU2MjUgQyA0LjIwMzEyNSAwLjE1NjI1IDMuMzE2NDA2IDAuMDQ2ODc1IDIuNDUzMTI1IC0wLjE3MTg3NSBDIDEuNTk3NjU2IC0wLjM5MDYyNSAwLjkxNDA2MiAtMC42NzE4NzUgMC40MDYyNSAtMS4wMTU2MjUgTCAxLjQ1MzEyNSAtMy4yNjU2MjUgQyAxLjk0MTQwNiAtMi45NjA5MzggMi41MjM0MzggLTIuNzEwOTM4IDMuMjAzMTI1IC0yLjUxNTYyNSBDIDMuODkwNjI1IC0yLjMxNjQwNiA0LjU2NjQwNiAtMi4yMTg3NSA1LjIzNDM3NSAtMi4yMTg3NSBDIDYuNTY2NDA2IC0yLjIxODc1IDcuMjM0Mzc1IC0yLjU0Njg3NSA3LjIzNDM3NSAtMy4yMDMxMjUgQyA3LjIzNDM3NSAtMy41MTU2MjUgNy4wNTA3ODEgLTMuNzM4MjgxIDYuNjg3NSAtMy44NzUgQyA2LjMyMDMxMiAtNC4wMDc4MTIgNS43NTc4MTIgLTQuMTI1IDUgLTQuMjE4NzUgQyA0LjExMzI4MSAtNC4zNTE1NjIgMy4zNzg5MDYgLTQuNTA3ODEyIDIuNzk2ODc1IC00LjY4NzUgQyAyLjIyMjY1NiAtNC44NjMyODEgMS43MjI2NTYgLTUuMTcxODc1IDEuMjk2ODc1IC01LjYwOTM3NSBDIDAuODc4OTA2IC02LjA1NDY4OCAwLjY3MTg3NSAtNi42OTE0MDYgMC42NzE4NzUgLTcuNTE1NjI1IEMgMC42NzE4NzUgLTguMjAzMTI1IDAuODY3MTg4IC04LjgxMjUgMS4yNjU2MjUgLTkuMzQzNzUgQyAxLjY2MDE1NiAtOS44NzUgMi4yMzgyODEgLTEwLjI4NTE1NiAzIC0xMC41NzgxMjUgQyAzLjc1NzgxMiAtMTAuODY3MTg4IDQuNjU2MjUgLTExLjAxNTYyNSA1LjY4NzUgLTExLjAxNTYyNSBDIDYuNDU3MDMxIC0xMS4wMTU2MjUgNy4yMjI2NTYgLTEwLjkyOTY4OCA3Ljk4NDM3NSAtMTAuNzY1NjI1IEMgOC43NDIxODggLTEwLjU5NzY1NiA5LjM3NSAtMTAuMzY3MTg4IDkuODc1IC0xMC4wNzgxMjUgTCA4LjgyODEyNSAtNy44MjgxMjUgQyA3Ljg2NzE4OCAtOC4zNjcxODggNi44MjAzMTIgLTguNjQwNjI1IDUuNjg3NSAtOC42NDA2MjUgQyA1LjAxOTUzMSAtOC42NDA2MjUgNC41MTU2MjUgLTguNTQ2ODc1IDQuMTcxODc1IC04LjM1OTM3NSBDIDMuODM1OTM4IC04LjE3MTg3NSAzLjY3MTg3NSAtNy45MjU3ODEgMy42NzE4NzUgLTcuNjI1IEMgMy42NzE4NzUgLTcuMjg5MDYyIDMuODUxNTYyIC03LjA1NDY4OCA0LjIxODc1IC02LjkyMTg3NSBDIDQuNTgyMDMxIC02Ljc4NTE1NiA1LjE2MDE1NiAtNi42NjAxNTYgNS45NTMxMjUgLTYuNTQ2ODc1IEMgNi44MzU5MzggLTYuMzkwNjI1IDcuNTYyNSAtNi4yMjY1NjIgOC4xMjUgLTYuMDYyNSBDIDguNjk1MzEyIC01Ljg5NDUzMSA5LjE5MTQwNiAtNS41ODU5MzggOS42MDkzNzUgLTUuMTQwNjI1IEMgMTAuMDIzNDM4IC00LjcwMzEyNSAxMC4yMzQzNzUgLTQuMDg1OTM4IDEwLjIzNDM3NSAtMy4yOTY4NzUgQyAxMC4yMzQzNzUgLTIuNjE3MTg4IDEwLjAzMTI1IC0yLjAxNTYyNSA5LjYyNSAtMS40ODQzNzUgQyA5LjIyNjU2MiAtMC45NjA5MzggOC42NDA2MjUgLTAuNTU0Njg4IDcuODU5Mzc1IC0wLjI2NTYyNSBDIDcuMDg1OTM4IDAuMDE1NjI1IDYuMTcxODc1IDAuMTU2MjUgNS4xMDkzNzUgMC4xNTYyNSBaIE0gNS4xMDkzNzUgMC4xNTYyNSAiLz48L2c+PC9nPjwvZz48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ0LjI1OTY3NiwgMjUuMTM1NjUxKSI+PGc+PHBhdGggZD0iTSAxLjQ1MzEyNSAtMTAuODU5Mzc1IEwgNC42MDkzNzUgLTEwLjg1OTM3NSBMIDQuNjA5Mzc1IDAgTCAxLjQ1MzEyNSAwIFogTSAzLjAxNTYyNSAtMTIuMzc1IEMgMi40NDE0MDYgLTEyLjM3NSAxLjk3MjY1NiAtMTIuNTM5MDYyIDEuNjA5Mzc1IC0xMi44NzUgQyAxLjI0MjE4OCAtMTMuMjE4NzUgMS4wNjI1IC0xMy42MzI4MTIgMS4wNjI1IC0xNC4xMjUgQyAxLjA2MjUgLTE0LjYyNSAxLjI0MjE4OCAtMTUuMDM5MDYyIDEuNjA5Mzc1IC0xNS4zNzUgQyAxLjk3MjY1NiAtMTUuNzE4NzUgMi40NDE0MDYgLTE1Ljg5MDYyNSAzLjAxNTYyNSAtMTUuODkwNjI1IEMgMy41OTc2NTYgLTE1Ljg5MDYyNSA0LjA3MDMxMiAtMTUuNzI2NTYyIDQuNDM3NSAtMTUuNDA2MjUgQyA0LjgwMDc4MSAtMTUuMDgyMDMxIDQuOTg0Mzc1IC0xNC42NzU3ODEgNC45ODQzNzUgLTE0LjE4NzUgQyA0Ljk4NDM3NSAtMTMuNjY0MDYyIDQuODAwNzgxIC0xMy4yMzQzNzUgNC40Mzc1IC0xMi44OTA2MjUgQyA0LjA3MDMxMiAtMTIuNTQ2ODc1IDMuNTk3NjU2IC0xMi4zNzUgMy4wMTU2MjUgLTEyLjM3NSBaIE0gMy4wMTU2MjUgLTEyLjM3NSAiLz48L2c+PC9nPjwvZz48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwLjMzNTUzMywgMjUuMTM1NjUxKSI+PGc+PHBhdGggZD0iTSAxNS4zNTkzNzUgLTExLjAxNTYyNSBDIDE2LjcyMjY1NiAtMTEuMDE1NjI1IDE3LjgwMDc4MSAtMTAuNjEzMjgxIDE4LjU5Mzc1IC05LjgxMjUgQyAxOS4zOTQ1MzEgLTkuMDE5NTMxIDE5Ljc5Njg3NSAtNy44MjAzMTIgMTkuNzk2ODc1IC02LjIxODc1IEwgMTkuNzk2ODc1IDAgTCAxNi42NTYyNSAwIEwgMTYuNjU2MjUgLTUuNzM0Mzc1IEMgMTYuNjU2MjUgLTYuNTk3NjU2IDE2LjQ3MjY1NiAtNy4yMzgyODEgMTYuMTA5Mzc1IC03LjY1NjI1IEMgMTUuNzUzOTA2IC04LjA4MjAzMSAxNS4yNSAtOC4yOTY4NzUgMTQuNTkzNzUgLTguMjk2ODc1IEMgMTMuODUxNTYyIC04LjI5Njg3NSAxMy4yNjU2MjUgLTguMDU0Njg4IDEyLjgyODEyNSAtNy41NzgxMjUgQyAxMi4zOTg0MzggLTcuMDk3NjU2IDEyLjE4NzUgLTYuMzkwNjI1IDEyLjE4NzUgLTUuNDUzMTI1IEwgMTIuMTg3NSAwIEwgOS4wNDY4NzUgMCBMIDkuMDQ2ODc1IC01LjczNDM3NSBDIDkuMDQ2ODc1IC03LjQ0MTQwNiA4LjM1OTM3NSAtOC4yOTY4NzUgNi45ODQzNzUgLTguMjk2ODc1IEMgNi4yNTM5MDYgLTguMjk2ODc1IDUuNjc1NzgxIC04LjA1NDY4OCA1LjI1IC03LjU3ODEyNSBDIDQuODIwMzEyIC03LjA5NzY1NiA0LjYwOTM3NSAtNi4zOTA2MjUgNC42MDkzNzUgLTUuNDUzMTI1IEwgNC42MDkzNzUgMCBMIDEuNDUzMTI1IDAgTCAxLjQ1MzEyNSAtMTAuODU5Mzc1IEwgNC40Njg3NSAtMTAuODU5Mzc1IEwgNC40Njg3NSAtOS42MDkzNzUgQyA0Ljg2MzI4MSAtMTAuMDY2NDA2IDUuMzUxNTYyIC0xMC40MTQwNjIgNS45Mzc1IC0xMC42NTYyNSBDIDYuNTMxMjUgLTEwLjg5NDUzMSA3LjE3NTc4MSAtMTEuMDE1NjI1IDcuODc1IC0xMS4wMTU2MjUgQyA4LjY0NDUzMSAtMTEuMDE1NjI1IDkuMzM1OTM4IC0xMC44NjMyODEgOS45NTMxMjUgLTEwLjU2MjUgQyAxMC41NjY0MDYgLTEwLjI1NzgxMiAxMS4wNjY0MDYgLTkuODIwMzEyIDExLjQ1MzEyNSAtOS4yNSBDIDExLjg5MDYyNSAtOS44MTI1IDEyLjQ0NTMxMiAtMTAuMjQyMTg4IDEzLjEyNSAtMTAuNTQ2ODc1IEMgMTMuODEyNSAtMTAuODU5Mzc1IDE0LjU1NDY4OCAtMTEuMDE1NjI1IDE1LjM1OTM3NSAtMTEuMDE1NjI1IFogTSAxNS4zNTkzNzUgLTExLjAxNTYyNSAiLz48L2c+PC9nPjwvZz48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcxLjUxMDE4NCwgMjUuMTM1NjUxKSI+PGc+PHBhdGggZD0iTSAxMi4zOTA2MjUgLTEwLjg1OTM3NSBMIDEyLjM5MDYyNSAwIEwgOS40MDYyNSAwIEwgOS40MDYyNSAtMS4yOTY4NzUgQyA4Ljk4ODI4MSAtMC44MTY0MDYgOC40ODgyODEgLTAuNDUzMTI1IDcuOTA2MjUgLTAuMjAzMTI1IEMgNy4zMzIwMzEgMC4wMzUxNTYyIDYuNzA3MDMxIDAuMTU2MjUgNi4wMzEyNSAwLjE1NjI1IEMgNC42MDE1NjIgMC4xNTYyNSAzLjQ3MjY1NiAtMC4yNSAyLjY0MDYyNSAtMS4wNjI1IEMgMS44MDQ2ODggLTEuODgyODEyIDEuMzkwNjI1IC0zLjEwMTU2MiAxLjM5MDYyNSAtNC43MTg3NSBMIDEuMzkwNjI1IC0xMC44NTkzNzUgTCA0LjU0Njg3NSAtMTAuODU5Mzc1IEwgNC41NDY4NzUgLTUuMTg3NSBDIDQuNTQ2ODc1IC0zLjQzNzUgNS4yODEyNSAtMi41NjI1IDYuNzUgLTIuNTYyNSBDIDcuNSAtMi41NjI1IDguMTAxNTYyIC0yLjgwNDY4OCA4LjU2MjUgLTMuMjk2ODc1IEMgOS4wMTk1MzEgLTMuNzg1MTU2IDkuMjUgLTQuNTE1NjI1IDkuMjUgLTUuNDg0Mzc1IEwgOS4yNSAtMTAuODU5Mzc1IFogTSAxMi4zOTA2MjUgLTEwLjg1OTM3NSAiLz48L2c+PC9nPjwvZz48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg1LjM3NzY2MiwgMjUuMTM1NjUxKSI+PGc+PHBhdGggZD0iTSAxLjQ1MzEyNSAtMTQuOTg0Mzc1IEwgNC42MDkzNzUgLTE0Ljk4NDM3NSBMIDQuNjA5Mzc1IDAgTCAxLjQ1MzEyNSAwIFogTSAxLjQ1MzEyNSAtMTQuOTg0Mzc1ICIvPjwvZz48L2c+PC9nPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJidXR0IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjU4MjQ1LCAwLCAwLCAwLjU4MjQ1LCA5MS40NzMwOTgsIDMuODI2MzE1KSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgZD0iTSAxNy45NTk0NzEgMjMuMjQ4MTI0IEMgMTkuMTU5OTQ5IDIzLjg0NTAxIDIwLjA3MjA0NCAyNC42Mjk2OCAyMC43MDkxNyAyNS42MDIxMzUgQyAyMS4zNDYyOTUgMjYuNTY3ODgzIDIxLjY2MTUwNCAyNy42OTQ1ODggMjEuNjYxNTA0IDI4Ljk2ODgzOSBDIDIxLjY2MTUwNCAzMC40NzExMTQgMjEuMjMyMjgzIDMxLjc3ODg5NyAyMC4zNzM4NCAzMi45MDU2MDMgQyAxOS41MjIxMDQgMzQuMDE4ODk2IDE4LjMyMTYyNiAzNC44ODQwNDUgMTYuNzcyNDA1IDM1LjUwMTA1MSBDIDE1LjIyMzE4NSAzNi4xMTEzNSAxMy40MzkyMzQgMzYuNDEzMTQ2IDExLjQwNzEzOSAzNi40MTMxNDYgQyA5LjM2ODMzOCAzNi40MTMxNDYgNy41ODQzODcgMzYuMTExMzUgNi4wNDE4NzMgMzUuNTAxMDUxIEMgNC41MDYwNjUgMzQuODg0MDQ1IDMuMzE5IDM0LjAxODg5NiAyLjQ3Mzk3MSAzMi45MDU2MDMgQyAxLjYyODk0MSAzMS43Nzg4OTcgMS4yMTMxMzMgMzAuNDcxMTE0IDEuMjEzMTMzIDI4Ljk2ODgzOSBDIDEuMjEzMTMzIDI3LjY5NDU4OCAxLjUyODM0MyAyNi41Njc4ODMgMi4xNjU0NjggMjUuNjAyMTM1IEMgMi44MDI1OTMgMjQuNjI5NjggMy43MTQ2ODkgMjMuODQ1MDEgNC44ODgzNDEgMjMuMjQ4MTI0IEMgMy45ODk2NTkgMjIuNjkxNDc4IDMuMjkyMTc0IDIxLjk4NzI4NiAyLjgwOTMgMjEuMTQ4OTY0IEMgMi4zMjY0MjYgMjAuMzAzOTM0IDIuMDc4MjgyIDE5LjMzODE4NiAyLjA3ODI4MiAxOC4yNTg0MjYgQyAyLjA3ODI4MiAxNi44NDMzMzcgMi40NzM5NzEgMTUuNjIyNzM5IDMuMjU4NjQxIDE0LjU4MzIxOSBDIDQuMDQzMzExIDEzLjUzNjk5MiA1LjEzNjQ4NCAxMi43MzIyMDIgNi41NTE1NzMgMTIuMTY4ODQ5IEMgNy45NTk5NTYgMTEuNjA1NDk2IDkuNTc2MjQyIDExLjMyMzgyIDExLjQwNzEzOSAxMS4zMjM4MiBDIDEzLjI1MTQ0OSAxMS4zMjM4MiAxNC44ODc4NTYgMTEuNjA1NDk2IDE2LjMwMjk0NSAxMi4xNjg4NDkgQyAxNy43MjQ3NCAxMi43MzIyMDIgMTguODMxMzI2IDEzLjUzNjk5MiAxOS42MTU5OTcgMTQuNTgzMjE5IEMgMjAuNDA3MzczIDE1LjYyMjczOSAyMC43OTYzNTUgMTYuODQzMzM3IDIwLjc5NjM1NSAxOC4yNTg0MjYgQyAyMC43OTYzNTUgMTkuMzM4MTg2IDIwLjU1NDkxOCAyMC4zMDM5MzQgMjAuMDcyMDQ0IDIxLjE0ODk2NCBDIDE5LjU4OTE3IDIxLjk4NzI4NiAxOC44NzgyNzIgMjIuNjkxNDc4IDE3Ljk1OTQ3MSAyMy4yNDgxMjQgWiBNIDExLjQwNzEzOSAxNS40NDgzNjggQyAxMC4yNzM3MjcgMTUuNDQ4MzY4IDkuMzYxNjMxIDE1LjcxNjYzMiA4LjY4NDI2NyAxNi4yNjY1NzEgQyA4LjAwMDE5NSAxNi44MDk4MDUgNy42NTgxNTkgMTcuNTU0MjM1IDcuNjU4MTU5IDE4LjQ5OTg2MyBDIDcuNjU4MTU5IDE5LjQxODY2NSA3Ljk5MzQ4OCAyMC4xNDk2ODMgOC42NjQxNDcgMjAuNjg2MjA5IEMgOS4zMzQ4MDUgMjEuMjE2MDI5IDEwLjI0NjkgMjEuNDc3NTg2IDExLjQwNzEzOSAyMS40Nzc1ODYgQyAxMi41NjA2NzEgMjEuNDc3NTg2IDEzLjQ3OTQ3MyAyMS4yMTYwMjkgMTQuMTc2OTU4IDIwLjY4NjIwOSBDIDE0Ljg2NzczNiAyMC4xNDk2ODMgMTUuMjE2NDc4IDE5LjQxODY2NSAxNS4yMTY0NzggMTguNDk5ODYzIEMgMTUuMjE2NDc4IDE3LjU1NDIzNSAxNC44Njc3MzYgMTYuODA5ODA1IDE0LjE3Njk1OCAxNi4yNjY1NzEgQyAxMy40Nzk0NzMgMTUuNzE2NjMyIDEyLjU2MDY3MSAxNS40NDgzNjggMTEuNDA3MTM5IDE1LjQ0ODM2OCBaIE0gMTEuNDA3MTM5IDMyLjI5NTMwNCBDIDEyLjgwODgxNSAzMi4yOTUzMDQgMTMuOTIyMTA4IDMxLjk3MzM4OCAxNC43NDAzMTEgMzEuMzM2MjYzIEMgMTUuNTY1MjIxIDMwLjY5OTEzOCAxNS45NzQzMjIgMjkuODU0MTA4IDE1Ljk3NDMyMiAyOC43ODc3NjIgQyAxNS45NzQzMjIgMjcuNzI4MTIxIDE1LjU2NTIyMSAyNi44ODk3OTkgMTQuNzQwMzExIDI2LjI1OTM4IEMgMTMuOTIyMTA4IDI1LjYzNTY2OCAxMi44MDg4MTUgMjUuMzIwNDU4IDExLjQwNzEzOSAyNS4zMjA0NTggQyAxMC4wMTg4NzYgMjUuMzIwNDU4IDguOTE4OTk3IDI1LjYzNTY2OCA4LjEwNzUgMjYuMjU5MzggQyA3LjMwMjcxIDI2Ljg4OTc5OSA2Ljg5MzYwOSAyNy43MjgxMjEgNi44OTM2MDkgMjguNzg3NzYyIEMgNi44OTM2MDkgMjkuODgwOTM1IDcuMzAyNzEgMzAuNzM5Mzc3IDguMTA3NSAzMS4zNjMwODkgQyA4LjkxODk5NyAzMS45ODAwOTUgMTAuMDE4ODc2IDMyLjI5NTMwNCAxMS40MDcxMzkgMzIuMjk1MzA0IFogTSAxMS40MDcxMzkgMzIuMjk1MzA0ICIgc3Ryb2tlPSIjNTNkMDAwIiBzdHJva2Utd2lkdGg9IjEuMzAwMDAxIiBzdHJva2Utb3BhY2l0eT0iMSIgc3Ryb2tlLW1pdGVybGltaXQ9IjQiLz48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwNS4yODA5MDEsIDI1LjEzNTY3NCkiPjxnPjxwYXRoIGQ9Ik0gNi42MjUgMC4xNTYyNSBDIDUuNDc2NTYyIDAuMTU2MjUgNC40NTMxMjUgLTAuMDc4MTI1IDMuNTQ2ODc1IC0wLjU0Njg3NSBDIDIuNjQwNjI1IC0xLjAyMzQzOCAxLjkyNTc4MSAtMS42ODc1IDEuNDA2MjUgLTIuNTMxMjUgQyAwLjg5NDUzMSAtMy4zODI4MTIgMC42NDA2MjUgLTQuMzUxNTYyIDAuNjQwNjI1IC01LjQzNzUgQyAwLjY0MDYyNSAtNi41MDc4MTIgMC44OTQ1MzEgLTcuNDY4NzUgMS40MDYyNSAtOC4zMTI1IEMgMS45MjU3ODEgLTkuMTY0MDYyIDIuNjQwNjI1IC05LjgyODEyNSAzLjU0Njg3NSAtMTAuMjk2ODc1IEMgNC40NTMxMjUgLTEwLjc3MzQzOCA1LjQ3NjU2MiAtMTEuMDE1NjI1IDYuNjI1IC0xMS4wMTU2MjUgQyA3Ljc2OTUzMSAtMTEuMDE1NjI1IDguNzg5MDYyIC0xMC43NzM0MzggOS42ODc1IC0xMC4yOTY4NzUgQyAxMC41OTM3NSAtOS44MjgxMjUgMTEuMzAwNzgxIC05LjE2NDA2MiAxMS44MTI1IC04LjMxMjUgQyAxMi4zMjAzMTIgLTcuNDY4NzUgMTIuNTc4MTI1IC02LjUwNzgxMiAxMi41NzgxMjUgLTUuNDM3NSBDIDEyLjU3ODEyNSAtNC4zNTE1NjIgMTIuMzIwMzEyIC0zLjM4MjgxMiAxMS44MTI1IC0yLjUzMTI1IEMgMTEuMzAwNzgxIC0xLjY4NzUgMTAuNTkzNzUgLTEuMDIzNDM4IDkuNjg3NSAtMC41NDY4NzUgQyA4Ljc4OTA2MiAtMC4wNzgxMjUgNy43Njk1MzEgMC4xNTYyNSA2LjYyNSAwLjE1NjI1IFogTSA2LjYyNSAtMi40MjE4NzUgQyA3LjQyNTc4MSAtMi40MjE4NzUgOC4wODU5MzggLTIuNjkxNDA2IDguNjA5Mzc1IC0zLjIzNDM3NSBDIDkuMTI4OTA2IC0zLjc4NTE1NiA5LjM5MDYyNSAtNC41MTk1MzEgOS4zOTA2MjUgLTUuNDM3NSBDIDkuMzkwNjI1IC02LjM0Mzc1IDkuMTI4OTA2IC03LjA2NjQwNiA4LjYwOTM3NSAtNy42MDkzNzUgQyA4LjA4NTkzOCAtOC4xNjAxNTYgNy40MjU3ODEgLTguNDM3NSA2LjYyNSAtOC40Mzc1IEMgNS44MTI1IC04LjQzNzUgNS4xNDA2MjUgLTguMTYwMTU2IDQuNjA5Mzc1IC03LjYwOTM3NSBDIDQuMDg1OTM4IC03LjA2NjQwNiAzLjgyODEyNSAtNi4zNDM3NSAzLjgyODEyNSAtNS40Mzc1IEMgMy44MjgxMjUgLTQuNTE5NTMxIDQuMDg1OTM4IC0zLjc4NTE1NiA0LjYwOTM3NSAtMy4yMzQzNzUgQyA1LjE0MDYyNSAtMi42OTE0MDYgNS44MTI1IC0yLjQyMTg3NSA2LjYyNSAtMi40MjE4NzUgWiBNIDYuNjI1IC0yLjQyMTg3NSAiLz48L2c+PC9nPjwvZz48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExOC41MDI0NDYsIDI1LjEzNTY3NCkiPjxnPjxwYXRoIGQ9Ik0gNC40Njg3NSAtOS40MjE4NzUgQyA0Ljg0Mzc1IC05Ljk1MzEyNSA1LjM0NzY1NiAtMTAuMzQ3NjU2IDUuOTg0Mzc1IC0xMC42MDkzNzUgQyA2LjYxNzE4OCAtMTAuODc4OTA2IDcuMzU5Mzc1IC0xMS4wMTU2MjUgOC4yMDMxMjUgLTExLjAxNTYyNSBMIDguMjAzMTI1IC04LjEwOTM3NSBDIDcuODQ3NjU2IC04LjE0MDYyNSA3LjYwOTM3NSAtOC4xNTYyNSA3LjQ4NDM3NSAtOC4xNTYyNSBDIDYuNTg1OTM4IC04LjE1NjI1IDUuODgyODEyIC03Ljg5ODQzOCA1LjM3NSAtNy4zOTA2MjUgQyA0Ljg2MzI4MSAtNi44OTA2MjUgNC42MDkzNzUgLTYuMTMyODEyIDQuNjA5Mzc1IC01LjEyNSBMIDQuNjA5Mzc1IDAgTCAxLjQ1MzEyNSAwIEwgMS40NTMxMjUgLTEwLjg1OTM3NSBMIDQuNDY4NzUgLTEwLjg1OTM3NSBaIE0gNC40Njg3NSAtOS40MjE4NzUgIi8+PC9nPjwvZz48L2c+PC9zdmc+'; try { await new Promise((res, rej) => { logo.onload = res; logo.onerror = () => rej(new Error('Logo failed to load.')) }); const extPad = 15, intPad = 10, pillH = logo.height + 2 * intPad, pillW = logo.width + 2 * intPad, pillR = pillH / 2; const pillX = extPad, pillY = tempCanvas.height - pillH - extPad; ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.beginPath(); ctx.moveTo(pillX + pillR, pillY); ctx.lineTo(pillX + pillW - pillR, pillY); ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + pillR, pillR); ctx.lineTo(pillX + pillW, pillY + pillH - pillR); ctx.arcTo(pillX + pillW, pillY + pillH, pillX + pillW - pillR, pillY + pillH, pillR); ctx.lineTo(pillX + pillR, pillY + pillH); ctx.arcTo(pillX, pillY + pillH, pillX, pillY + pillH - pillR, pillR); ctx.lineTo(pillX, pillY + pillR); ctx.arcTo(pillX, pillY, pillX + pillR, pillY, pillR); ctx.closePath(); ctx.fill(); ctx.drawImage(logo, pillX + intPad, pillY + intPad) } catch (e) { this._showNotification('Error: Could not load logo.') }
        tempCanvas.toBlob(async blob => {
            if (!blob) { this._showNotification('Error: Could not generate image.'); return }
            if (navigator.clipboard && navigator.clipboard.write) { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); this._showNotification('Chart Image Copied to Clipboard') } catch (err) { this._showNotification('Error: Failed to copy image.') } } else this._showNotification('Clipboard API not available.')
        }, 'image/png')
    }
    addAIPriceLevel(level) {
        if (!level.color) { const labelLower = level.label.toLowerCase(); if (labelLower.includes('entry') || labelLower.includes('buy')) { level.color = '#00C851' } else if (labelLower.includes('stop') || labelLower.includes('loss')) { level.color = '#FF4444' } else if (labelLower.includes('target') || labelLower.includes('exit') || labelLower.includes('take')) { level.color = '#33B5E5' } else { level.color = '#FF8800' } }
        this.aiPriceLevels.push(level); this.drawCharts()
    }
    setAIPriceLevels(levelsArray) { this.aiPriceLevels = levelsArray.slice(); this.aiPriceLevels.forEach(level => { if (!level.color) { const labelLower = level.label.toLowerCase(); if (labelLower.includes('entry') || labelLower.includes('buy')) { level.color = '#00C851' } else if (labelLower.includes('stop') || labelLower.includes('loss')) { level.color = '#FF4444' } else if (labelLower.includes('target') || labelLower.includes('exit') || labelLower.includes('take')) { level.color = '#33B5E5' } else { level.color = '#FF8800' } } }); this.drawCharts() }
    clearAIPriceLevels() { this.aiPriceLevels = []; this.drawCharts() }
    removeAIPriceLevelsByLabel(labelFilter) { this.aiPriceLevels = this.aiPriceLevels.filter(level => !level.label.toLowerCase().includes(labelFilter.toLowerCase())); this.drawCharts() }
    drawAIPriceLevels(ctx) {
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
        this.aiPriceLevels.forEach(level => {
            const { label, price, color } = level;
            const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
            let { min, max } = this.applyVerticalScale(rawRange);
            min += this.config.priceOffset;
            max += this.config.priceOffset;
            const rawY = this.priceToY(price, min, max, chartH, this.getCanvasHeight());
            if (rawY < chartTop || rawY >= panelsTopY) return;
            const y = snap(rawY);
            ctx.save();
            ctx.setLineDash([8, 4]);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.config.padding.left, y);
            ctx.lineTo(this.getCanvasWidth() - this.config.padding.right, y);
            ctx.stroke();
            ctx.restore();
            const labelText = `${label} ${price.toFixed(2)}`;
            ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
            const textMetrics = ctx.measureText(labelText);
            const textWidth = textMetrics.width;
            const labelPadding = 6;
            const badgeHeight = 22;
            const dynamicBadgeWidth = textWidth + 2 * labelPadding;
            const badgeX = snap(this.config.padding.left + 5);
            const badgeY = snap(y - badgeHeight / 2);
            const borderRadius = 2;
            ctx.save();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(badgeX + borderRadius, badgeY);
            ctx.lineTo(badgeX + dynamicBadgeWidth - borderRadius, badgeY);
            ctx.arcTo(badgeX + dynamicBadgeWidth, badgeY, badgeX + dynamicBadgeWidth, badgeY + borderRadius, borderRadius);
            ctx.lineTo(badgeX + dynamicBadgeWidth, badgeY + badgeHeight - borderRadius);
            ctx.arcTo(badgeX + dynamicBadgeWidth, badgeY + badgeHeight, badgeX + dynamicBadgeWidth - borderRadius, badgeY + badgeHeight, borderRadius);
            ctx.lineTo(badgeX + borderRadius, badgeY + badgeHeight);
            ctx.arcTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - borderRadius, borderRadius);
            ctx.lineTo(badgeX, badgeY + borderRadius);
            ctx.arcTo(badgeX, badgeY, badgeX + borderRadius, badgeY, borderRadius);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, snap(badgeX + labelPadding), snap(badgeY + badgeHeight / 2));
            ctx.restore();
        });
        ctx.restore();
    }
}