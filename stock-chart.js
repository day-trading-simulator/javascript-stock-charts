class StockChart {
    constructor(container, options = {}) {
        this.container = typeof container === 'string'
            ? document.getElementById(container)
            : container;
        if (!this.container) throw new Error('Container not found');
        this.options = options;
        this.isDragging = false;
        this.scalingActive = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragStartOffset = 0;
        this.dragStartPriceOffset = 0;
        this.scalingDragStartY = 0;
        this.screenSize = this.getScreenSizeCategory();
        this.config = {
            padding: { top: 30, right: 60, bottom: 30, left: 10 },
            candleWidth: 10,
            spacing: 4,
            visibleCandles: this.getInitialVisibleCandles(),
            maxVisibleCandles: this.getMaxVisibleCandles(),
            dataOffset: 0,
            chartType: options.chartType || 'line',
            darkMode: options.darkMode || false,
            bullColor: '#26a69a',
            bearColor: '#ef5350',
            gridColor: '#d0d0d0',
            textColor: '#888',
            crosshairColor: 'rgba(0,0,0,0.3)',
            verticalScaleFactor: 1.0,
            verticalPadding: 0.1,
            priceOffset: 0,
            watermark: {
                enabled: true,
                text: options.ticker || 'NVDA',
                font: this.getFontSize('watermark'),
                opacity: 0.1
            },
            branding: {
                enabled: options.hideBranding !== true,
                text: 'Powered by simul8or',
                font: this.getFontSize('branding'),
                opacity: 0.3,
                url: 'https://simul8or.com'
            },
            darkModeColors: {
                bullColor: '#4caf50',
                bearColor: '#f44336',
                gridColor: '#444',
                textColor: '#e0e0e0',
                crosshairColor: 'rgba(255,255,255,0.4)',
            }
        };
        this.createDOM();
        this.chartContainer = this.container.querySelector('.sc-chart-container');
        const overlay = this.chartContainer.querySelector('.sc-chart-controls-overlay');
        this.openEl = overlay.querySelector('.open-value');
        this.highEl = overlay.querySelector('.high-value');
        this.lowEl = overlay.querySelector('.low-value');
        this.closeEl = overlay.querySelector('.close-value');
        this.volEl = overlay.querySelector('.vol-value');
        if (this.config.darkMode) {
            this.chartContainer.classList.add('dark-mode');
        }
        this.updateDarkModeIcon();
        this.registerEventListeners();
        this.updateConfig();
        this.stockData = options.data || [];
        if (!this.stockData.length) {
            console.warn("No OHLC data provided.");
        } else {
            this.timeframe = options.timeframe || this.detectTimeframe(this.stockData);
        }
        this.config.dataOffset = Math.max(0, this.stockData.length - this.config.visibleCandles);
        this.updateOHLCOverlay();
        this.calculateOverlayWidths();
        this.applyOverlayWidths();
        this.resizeCanvases();
        this.debouncedResize = this.debounce(() => {
            const newSize = this.getScreenSizeCategory();
            if (newSize !== this.screenSize) {
                this.screenSize = newSize;
                this.updateResponsiveConfig();
            }
            this.resizeCanvases();
            this.drawCharts();
        }, 250);
        window.addEventListener('resize', this.debouncedResize);
    }
    getScreenSizeCategory() {
        const w = window.innerWidth;
        if (w < 576) return 'xs';
        if (w < 768) return 'sm';
        if (w < 992) return 'md';
        if (w < 1200) return 'lg';
        return 'xl';
    }
    getInitialVisibleCandles() {
        switch (this.getScreenSizeCategory()) {
            case 'xs': return 20;
            case 'sm': return 30;
            case 'md': return 40;
            case 'lg': return 50;
            case 'xl': return 60;
            default: return 50;
        }
    }
    getMaxVisibleCandles() {
        switch (this.getScreenSizeCategory()) {
            case 'xs': return 50;
            case 'sm': return 70;
            case 'md': return 80;
            case 'lg': return 90;
            case 'xl': return 100;
            default: return 100;
        }
    }
    getFontSize(type) {
        const s = this.getScreenSizeCategory();
        if (type === 'watermark') {
            if (s === 'xs') return 'bold 40px Arial';
            if (s === 'sm') return 'bold 50px Arial';
            if (s === 'md') return 'bold 60px Arial';
            if (s === 'lg') return 'bold 70px Arial';
            if (s === 'xl') return 'bold 80px Arial';
            return 'bold 60px Arial';
        } else if (type === 'branding') {
            if (s === 'xs') return '9px Arial';
            if (s === 'sm') return '10px Arial';
            if (s === 'md') return '12px Arial';
            return '12px Arial';
        }
        return '11px Arial';
    }
    updateResponsiveConfig() {
        this.config.visibleCandles = this.getInitialVisibleCandles();
        this.config.maxVisibleCandles = this.getMaxVisibleCandles();
        this.config.watermark.font = this.getFontSize('watermark');
        this.config.branding.font = this.getFontSize('branding');
        if (this.screenSize === 'xs' || this.screenSize === 'sm') {
            this.config.padding.right = 50;
            this.config.spacing = 2;
            this.config.candleWidth = 8;
        } else {
            this.config.padding.right = 60;
            this.config.spacing = 4;
            this.config.candleWidth = 10;
        }
        this.config.dataOffset = Math.max(0, this.stockData.length - this.config.visibleCandles);
    }
    debounce(fn, wait) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }
    createDOM() {
        this.container.innerHTML = `
            <div class="sc-chart-container">
              <div class="sc-price-chart-container">
                <canvas class="sc-price-chart"></canvas>
                <div class="sc-vertical-scale-area"></div>
                <div class="sc-chart-controls-overlay">
                  <button class="sc-overlay-button sc-chart-type-button" title="Toggle chart type">
                    <svg viewBox="0 0 24 24">
                      <path d="M3,14 L8,8 L14,16 L21,6" stroke="#3498db" stroke-width="2" fill="none"/>
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
                  <div class="sc-ohlcv-label">
                    <span class="label-open">O: <span class="open-value"></span></span>
                    <span class="label-high">H: <span class="high-value"></span></span>
                    <span class="label-low">L: <span class="low-value"></span></span>
                    <span class="label-close">C: <span class="close-value"></span></span>
                    <span class="label-volume">V: <span class="vol-value"></span></span>
                  </div>
                </div>
              </div>
            </div>`;
        this.chartContainer = this.container.querySelector('.sc-chart-container');
        this.priceCanvas = this.container.querySelector('.sc-price-chart');
        this.priceCtx = this.priceCanvas.getContext('2d');
        this.verticalScaleArea = this.container.querySelector('.sc-vertical-scale-area');
        this.chartTypeButton = this.container.querySelector('.sc-chart-type-button');
        this.darkModeButton = this.container.querySelector('.sc-dark-mode-button');
        this.maximizeButton = this.container.querySelector('.sc-maximize-button');
    }
    registerEventListeners() {
        this.darkModeButton.addEventListener('click', () => {
            this.chartContainer.classList.toggle('dark-mode');
            this.config.darkMode = this.chartContainer.classList.contains('dark-mode');
            this.updateDarkModeIcon();
            this.updateConfig();
            this.drawCharts();
        });
        this.chartTypeButton.addEventListener('click', () => {
            if (this.config.chartType === 'candlestick') {
                // Switch the chart to line
                this.config.chartType = 'line';
                // But show the candlestick icon on the button
                // (because that's what you'd click to switch back)
                this.chartTypeButton.innerHTML = `
                      <svg viewBox="0 0 24 24">
                        <rect x="5" y="7" width="6" height="10" fill="#ef5350"/>
                        <rect x="13" y="5" width="6" height="14" fill="#26a69a"/>
                        <line x1="8" y1="4" x2="8" y2="20" stroke="#ef5350" stroke-width="2"/>
                        <line x1="16" y1="2" x2="16" y2="22" stroke="#26a69a" stroke-width="2"/>
                      </svg>`;
            } else {
                // Switch the chart to candlestick
                this.config.chartType = 'candlestick';
                // But show the line icon on the button
                this.chartTypeButton.innerHTML = `
                      <svg viewBox="0 0 24 24">
                        <path d="M3,14 L8,8 L14,16 L21,6"
                              stroke="#3498db" stroke-width="2" fill="none"/>
                      </svg>`;
            }

            this.drawCharts();
        });
        this.maximizeButton.addEventListener('click', () => {
            const isFull = this.chartContainer.classList.contains('fullscreen');
            this.chartContainer.classList.toggle('fullscreen');
            if (!isFull) {
                document.body.style.overflow = 'hidden';
                this.config.maxVisibleCandles = 200;
            } else {
                document.body.style.overflow = '';
                this.config.maxVisibleCandles = this.getMaxVisibleCandles();
                if (this.config.visibleCandles > this.config.maxVisibleCandles) {
                    const rightEdge = this.config.dataOffset + this.config.visibleCandles;
                    this.config.visibleCandles = this.config.maxVisibleCandles;
                    this.config.dataOffset = Math.max(0, rightEdge - this.config.visibleCandles);
                }
            }
            this.resizeCanvases();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.chartContainer.classList.contains('fullscreen')) {
                this.chartContainer.classList.remove('fullscreen');
                document.body.style.overflow = '';
                this.config.maxVisibleCandles = this.getMaxVisibleCandles();
                if (this.config.visibleCandles > this.config.maxVisibleCandles) {
                    const rightEdge = this.config.dataOffset + this.config.visibleCandles;
                    this.config.visibleCandles = this.config.maxVisibleCandles;
                    this.config.dataOffset = Math.max(0, rightEdge - this.config.visibleCandles);
                }
                this.resizeCanvases();
            }
        });
        this.verticalScaleArea.addEventListener('mousedown', (e) => {
            this.scalingDragStartY = e.clientY;
            this.scalingActive = true;
            e.preventDefault();
        });
        this.verticalScaleArea.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.scalingDragStartY = e.touches[0].clientY;
                this.scalingActive = true;
                e.preventDefault();
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (this.scalingActive) {
                const dy = e.clientY - this.scalingDragStartY;
                this.scalingDragStartY = e.clientY;
                if (dy < 0) {
                    this.config.verticalScaleFactor *= (1 + Math.abs(dy) * 0.01);
                } else if (dy > 0) {
                    this.config.verticalScaleFactor /= (1 + dy * 0.01);
                    this.config.verticalScaleFactor = Math.max(0.1, this.config.verticalScaleFactor);
                }
                this.drawCharts();
            }
        });
        document.addEventListener('touchmove', (e) => {
            if (this.scalingActive && e.touches.length === 1) {
                const dy = e.touches[0].clientY - this.scalingDragStartY;
                this.scalingDragStartY = e.touches[0].clientY;
                if (dy < 0) {
                    this.config.verticalScaleFactor *= (1 + Math.abs(dy) * 0.01);
                } else if (dy > 0) {
                    this.config.verticalScaleFactor /= (1 + dy * 0.01);
                    this.config.verticalScaleFactor = Math.max(0.1, this.config.verticalScaleFactor);
                }
                this.drawCharts();
                e.preventDefault();
            }
        });
        document.addEventListener('mouseup', () => { this.scalingActive = false; });
        document.addEventListener('touchend', () => { this.scalingActive = false; });
        this.priceCanvas.addEventListener('mouseleave', () => { this.drawCharts(); });
        this.priceCanvas.addEventListener('mousedown', (e) => {
            const rect = this.priceCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < this.priceCanvas.width - this.config.padding.right) {
                this.isDragging = true;
                this.dragStartX = e.clientX;
                this.dragStartY = e.clientY;
                this.dragStartOffset = this.config.dataOffset;
                this.dragStartPriceOffset = this.config.priceOffset;
                this.priceCanvas.classList.add('dragging');
                e.preventDefault();
            }
        });
        this.priceCanvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const rect = this.priceCanvas.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                if (x < this.priceCanvas.width - this.config.padding.right) {
                    this.isDragging = true;
                    this.dragStartX = e.touches[0].clientX;
                    this.dragStartY = e.touches[0].clientY;
                    this.dragStartOffset = this.config.dataOffset;
                    this.dragStartPriceOffset = this.config.priceOffset;
                    this.priceCanvas.classList.add('dragging');
                    e.preventDefault();
                }
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const distX = e.clientX - this.dragStartX;
                const pxPerCandle = this.calculateCandleWidth() + this.config.spacing;
                const cShift = Math.round(distX / pxPerCandle);
                let newOffset = this.dragStartOffset - cShift;
                newOffset = Math.max(0, newOffset);
                newOffset = Math.min(this.stockData.length - this.config.visibleCandles, newOffset);
                this.config.dataOffset = newOffset;
                const distY = e.clientY - this.dragStartY;
                const drawingH = this.priceCanvas.height - this.config.padding.top - this.config.padding.bottom;
                const raw = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
                const expanded = this.applyVerticalScale(raw);
                const rng = expanded.max - expanded.min;
                const pricePerPixel = rng / drawingH;
                const dPrice = distY * pricePerPixel;
                this.config.priceOffset = this.dragStartPriceOffset + dPrice;
                this.drawCharts();
                e.preventDefault();
            }
        });
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1) {
                const distX = e.touches[0].clientX - this.dragStartX;
                const pxPerCandle = this.calculateCandleWidth() + this.config.spacing;
                const cShift = Math.round(distX / pxPerCandle);
                let newOffset = this.dragStartOffset - cShift;
                newOffset = Math.max(0, newOffset);
                newOffset = Math.min(this.stockData.length - this.config.visibleCandles, newOffset);
                this.config.dataOffset = newOffset;
                const distY = e.touches[0].clientY - this.dragStartY;
                const drawH = this.priceCanvas.height - this.config.padding.top - this.config.padding.bottom;
                const raw = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
                const exp = this.applyVerticalScale(raw);
                const rng = exp.max - exp.min;
                const pp = rng / drawH;
                const dPrice = distY * pp;
                this.config.priceOffset = this.dragStartPriceOffset + dPrice;
                this.drawCharts();
                e.preventDefault();
            }
        });
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.priceCanvas.classList.remove('dragging');
                this.drawCharts();
            }
        });
        document.addEventListener('touchend', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.priceCanvas.classList.remove('dragging');
                this.drawCharts();
            }
        });
        this.priceCanvas.addEventListener('wheel', (e) => {
            const rect = this.priceCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x >= this.priceCanvas.width - this.config.padding.right) return;
            e.preventDefault();
            const prevRight = this.config.dataOffset + this.config.visibleCandles;
            if (e.deltaY < 0) {
                if (this.config.visibleCandles > 10) {
                    this.config.visibleCandles = Math.floor(this.config.visibleCandles * 0.9);
                }
            } else {
                let newVis = Math.min(this.config.maxVisibleCandles, Math.floor(this.config.visibleCandles * 1.1));
                if (this.config.visibleCandles <= 10) newVis = 11;
                if (newVis <= this.config.maxVisibleCandles) {
                    this.config.visibleCandles = newVis;
                }
            }
            this.config.dataOffset = Math.max(0, prevRight - this.config.visibleCandles);
            this.drawCharts();
        });
        let initialPinch = 0, initialCandleCount = 0;
        this.priceCanvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialPinch = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                initialCandleCount = this.config.visibleCandles;
                e.preventDefault();
            }
        });
        this.priceCanvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialPinch > 0) {
                const dist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const factor = initialPinch / dist;
                const prevRight = this.config.dataOffset + this.config.visibleCandles;
                let newVis = Math.max(10, Math.min(this.config.maxVisibleCandles, Math.round(initialCandleCount * factor)));
                if (newVis !== this.config.visibleCandles) {
                    this.config.visibleCandles = newVis;
                    this.config.dataOffset = Math.max(0, prevRight - this.config.visibleCandles);
                    this.drawCharts();
                }
                e.preventDefault();
            }
        });
        this.priceCanvas.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) initialPinch = 0;
        });
        this.priceCanvas.addEventListener('click', (e) => {
            if (!this.config.branding.enabled) return;
            const rect = this.priceCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const padX = 10, padY = 2;
            const brandY = this.priceCanvas.height - padY;
            this.priceCtx.save();
            this.priceCtx.font = this.config.branding.font;
            const txtW = this.priceCtx.measureText(this.config.branding.text).width;
            this.priceCtx.restore();
            if (x >= padX && x <= padX + txtW + 5 && y >= brandY - 15 && y <= brandY + 5) {
                window.open(this.config.branding.url, '_blank');
            }
        });
        this.priceCanvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) return;
            this.drawCharts();
            const rect = this.priceCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Check if mouse is over the branding area:
            if (this.config.branding.enabled) {
                const padX = 10, padY = 2;
                const brandY = this.priceCanvas.height - padY;
                this.priceCtx.save();
                this.priceCtx.font = this.config.branding.font;
                const txtW = this.priceCtx.measureText(this.config.branding.text).width;
                this.priceCtx.restore();
                if (x >= padX && x <= padX + txtW + 5 && y >= brandY - 15 && y <= brandY + 5) {
                    this.priceCanvas.style.cursor = 'pointer';
                } else {
                    this.priceCanvas.style.cursor = 'default';
                }
            } else {
                this.priceCanvas.style.cursor = 'default';
            }
            const chartLeft = this.config.padding.left;
            const chartTop = this.config.padding.top;
            const chartW = this.priceCanvas.width - this.config.padding.left - this.config.padding.right;
            const chartH1 = this.priceCanvas.height - this.config.padding.top - this.config.padding.bottom;
            if (x < chartLeft || x > chartLeft + chartW || y < chartTop || y > chartTop + chartH1) return;
            if (x >= this.priceCanvas.width - this.config.padding.right) return;
            if (x < this.config.padding.left) return;
            const cW = this.calculateCandleWidth();
            const candleIndex = Math.floor((x - this.config.padding.left) / (cW + this.config.spacing));
            if (candleIndex < 0 || candleIndex >= this.config.visibleCandles) return;
            const dataIndex = this.config.dataOffset + candleIndex;
            if (dataIndex < 0 || dataIndex >= this.stockData.length) return;
            const candle = this.stockData[dataIndex];
            this.openEl.textContent = candle.open.toFixed(2);
            this.highEl.textContent = candle.high.toFixed(2);
            this.lowEl.textContent = candle.low.toFixed(2);
            this.closeEl.textContent = candle.close.toFixed(2);
            if (candle.close >= candle.open) {
                this.closeEl.style.color = '#26a69a';
            } else {
                this.closeEl.style.color = '#ef5350';
            }
            let suffix = '';
            let scaled = candle.volume;
            let vol = candle.volume;
            if (vol >= 1e9) {
                suffix = 'B';
                scaled = vol / 1e9;
            } else if (vol >= 1e6) {
                suffix = 'M';
                scaled = vol / 1e6;
            } else if (vol >= 1e3) {
                suffix = 'K';
                scaled = vol / 1e3;
            }
            let str = scaled.toFixed(2);
            str = parseFloat(str).toString();
            this.volEl.textContent = str + suffix;
            const ctx = this.priceCtx;
            ctx.save();
            ctx.strokeStyle = this.config.currentCrosshairColor;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.priceCanvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.priceCanvas.width - this.config.padding.right, y);
            ctx.stroke();
            ctx.setLineDash([]);
            const chartH = this.priceCanvas.height - this.config.padding.top - this.config.padding.bottom;
            const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
            let { min, max } = this.applyVerticalScale(rawRange);
            min += this.config.priceOffset;
            max += this.config.priceOffset;
            const relY = (this.priceCanvas.height - this.config.padding.bottom - y) / chartH;
            const price = min + (max - min) * relY;
            const isDarkMode = this.chartContainer.classList.contains('dark-mode');
            const priceText = price.toFixed(2);
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const txtW = ctx.measureText(priceText).width;
            const labelX = this.priceCanvas.width - this.config.padding.right;
            const labelY = y;
            ctx.fillStyle = isDarkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)';
            ctx.fillRect(labelX, labelY - 10, txtW + 10, 20);
            ctx.strokeStyle = this.config.currentCrosshairColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(labelX, labelY - 10, txtW + 10, 20);
            ctx.fillStyle = this.config.currentTextColor;
            ctx.fillText(priceText, labelX + 5, labelY);
            const dateText = this.formatDetailTimestamp(candle.t, this.timeframe);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const dateLabelY = this.priceCanvas.height - this.config.padding.bottom + 15;
            const dateW = ctx.measureText(dateText).width;
            ctx.fillStyle = isDarkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)';
            ctx.fillRect(x - (dateW / 2) - 5, dateLabelY - 10, dateW + 10, 20);
            ctx.strokeStyle = this.config.currentCrosshairColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(x - (dateW / 2) - 5, dateLabelY - 10, dateW + 10, 20);
            ctx.fillStyle = this.config.currentTextColor;
            ctx.fillText(dateText, x, dateLabelY);
            ctx.restore();
        });
        this.priceCanvas.addEventListener('touchmove', (e) => {
            if (this.isDragging || e.touches.length !== 1) return;
            const rect = this.priceCanvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            this.drawCharts();
            const chartLeft = this.config.padding.left;
            const chartTop = this.config.padding.top;
            const chartW = this.priceCanvas.width - this.config.padding.left - this.config.padding.right;
            const chartH1 = this.priceCanvas.height - this.config.padding.top - this.config.padding.bottom;
            if (x < chartLeft || x > chartLeft + chartW || y < chartTop || y > chartTop + chartH1) return;
            if (x >= this.priceCanvas.width - this.config.padding.right) return;
            if (x < this.config.padding.left) return;
            const cW = this.calculateCandleWidth();
            const candleIndex = Math.floor((x - this.config.padding.left) / (cW + this.config.spacing));
            if (candleIndex < 0 || candleIndex >= this.config.visibleCandles) return;
            const dataIndex = this.config.dataOffset + candleIndex;
            if (dataIndex < 0 || dataIndex >= this.stockData.length) return;
            const candle = this.stockData[dataIndex];
            this.openEl.textContent = candle.open.toFixed(2);
            this.highEl.textContent = candle.high.toFixed(2);
            this.lowEl.textContent = candle.low.toFixed(2);
            this.closeEl.textContent = candle.close.toFixed(2);
            if (candle.close >= candle.open) {
                this.closeEl.style.color = '#26a69a';
            } else {
                this.closeEl.style.color = '#ef5350';
            }
            const ctx = this.priceCtx;
            ctx.save();
            ctx.strokeStyle = this.config.currentCrosshairColor;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.priceCanvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.priceCanvas.width - this.config.padding.right, y);
            ctx.stroke();
            ctx.setLineDash([]);
            const chartH = this.priceCanvas.height - this.config.padding.top - this.config.padding.bottom;
            const rawRange = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
            let { min, max } = this.applyVerticalScale(rawRange);
            min += this.config.priceOffset;
            max += this.config.priceOffset;
            const relY = (this.priceCanvas.height - this.config.padding.bottom - y) / chartH;
            const price = min + (max - min) * relY;
            const isDarkMode = this.chartContainer.classList.contains('dark-mode');
            const priceText = price.toFixed(2);
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const txtW = ctx.measureText(priceText).width;
            const labelX = this.priceCanvas.width - this.config.padding.right;
            const labelY = y;
            ctx.fillStyle = isDarkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)';
            ctx.fillRect(labelX, labelY - 10, txtW + 10, 20);
            ctx.strokeStyle = this.config.currentCrosshairColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(labelX, labelY - 10, txtW + 10, 20);
            ctx.fillStyle = this.config.currentTextColor;
            ctx.fillText(priceText, labelX + 5, labelY);
            const dateText = this.formatDetailTimestamp(candle.t, this.timeframe);
            const dateLabelY = this.priceCanvas.height - this.config.padding.bottom + 15;
            const dateW = ctx.measureText(dateText).width;
            ctx.fillStyle = isDarkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)';
            ctx.fillRect(x - (dateW / 2) - 5, dateLabelY - 10, dateW + 10, 20);
            ctx.strokeRect(x - (dateW / 2) - 5, dateLabelY - 10, dateW + 10, 20);
            ctx.fillStyle = this.config.currentTextColor;
            ctx.fillText(dateText, x, dateLabelY);
            ctx.restore();
        });
    }
    resizeCanvases() {
        if (this.chartContainer.classList.contains('fullscreen')) {
            this.priceCanvas.style.height = 'calc(100vh - 10px)';
            setTimeout(() => {
                this.priceCanvas.width = window.innerWidth;
                this.priceCanvas.height = this.priceCanvas.clientHeight;
                this.drawCharts();
            }, 50);
        } else {
            this.priceCanvas.style.height = '100%';
            this.priceCanvas.width = this.container.clientWidth;
            this.priceCanvas.height = this.priceCanvas.clientHeight;
            this.drawCharts();
        }
    }
    updateConfig() {
        const d = this.config.darkMode;
        if (d) {
            this.config.currentTextColor = this.config.darkModeColors.textColor;
            this.config.currentGridColor = this.config.darkModeColors.gridColor;
            this.config.currentCrosshairColor = this.config.darkModeColors.crosshairColor;
            this.config.currentBullColor = this.config.darkModeColors.bullColor;
            this.config.currentBearColor = this.config.darkModeColors.bearColor;
        } else {
            this.config.currentTextColor = this.config.textColor;
            this.config.currentGridColor = this.config.gridColor;
            this.config.currentCrosshairColor = this.config.crosshairColor;
            this.config.currentBullColor = this.config.bullColor;
            this.config.currentBearColor = this.config.bearColor;
        }
    }
    updateDarkModeIcon() {
        if (this.config.darkMode) {
            this.darkModeButton.innerHTML = `
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9
                M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2
                M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7
                M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17
                M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7
                M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17
                M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" />
              </svg>
            `;
        } else {
            this.darkModeButton.innerHTML = `
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" />
              </svg>
            `;
        }
    }
    calculateCandleWidth() {
        const w = this.priceCanvas.width - this.config.padding.left - this.config.padding.right;
        return Math.max(2, (w / this.config.visibleCandles) - this.config.spacing);
    }
    calculateRawPriceRange(data, off, cnt) {
        const v = data.slice(off, off + cnt);
        let mn = Number.MAX_VALUE, mx = -Number.MAX_VALUE;
        v.forEach(c => {
            mn = Math.min(mn, c.low);
            mx = Math.max(mx, c.high);
        });
        return { min: mn, max: mx };
    }
    applyVerticalScale({ min, max }) {
        const mid = (min + max) * 0.5;
        let rng = (max - min) / this.config.verticalScaleFactor;
        rng *= (1 + this.config.verticalPadding * 2);
        return { min: mid - rng * 0.5, max: mid + rng * 0.5 };
    }
    drawCharts() {
        this.drawPriceChart();
    }
    drawVolumeBars(ctx, visibleData, volumeHeight) {
        // Find maximum volume among visible candles
        let maxVolume = 0;
        visibleData.forEach(candle => {
            maxVolume = Math.max(maxVolume, candle.volume);
        });
        const cW = this.calculateCandleWidth();
        // Define the bottom of the volume area (using the canvas height minus padding)
        const volumeBottomY = this.priceCanvas.height - this.config.padding.bottom;
        visibleData.forEach((candle, i) => {
            const x = this.config.padding.left + i * (cW + this.config.spacing);
            // Calculate bar height proportional to the maximum volume
            const barHeight = (candle.volume / maxVolume) * volumeHeight;
            // Draw the volume bar so that its bottom aligns with the bottom of the canvas
            ctx.fillStyle = this.config.darkMode
                ? 'rgba(52,152,219,0.3)'
                : 'rgba(52,152,219,0.2)';
            ctx.fillRect(x, volumeBottomY - barHeight, cW, barHeight);
        });
    }
    drawPriceChart() {
        const ctx = this.priceCtx;
        const w = this.priceCanvas.width, h = this.priceCanvas.height;
        ctx.clearRect(0, 0, w, h);

        const raw = this.calculateRawPriceRange(this.stockData, this.config.dataOffset, this.config.visibleCandles);
        let { min, max } = this.applyVerticalScale(raw);
        min += this.config.priceOffset;
        max += this.config.priceOffset;

        // Adjust right padding based on max price threshold (e.g., 10,000)
        if (max >= 10000) {
            this.config.padding.right = 80; // expanded padding for large values
        } else {
            this.config.padding.right = 60; // default padding for smaller prices
        }

        const chartLeft = this.config.padding.left;
        const chartTop = this.config.padding.top;
        const chartW = w - this.config.padding.left - this.config.padding.right;
        const chartH = h - this.config.padding.top - this.config.padding.bottom;

        if (this.config.watermark.enabled) {
            this.drawWatermark(ctx, w, h);
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(chartLeft, chartTop, chartW, chartH);
        ctx.clip();

        const chartH2 = h - this.config.padding.top - this.config.padding.bottom;
        const pxPerLine = 60;
        let approxLines = Math.floor(chartH2 / pxPerLine);
        approxLines = Math.max(3, Math.min(approxLines, 15));

        const { min: nMin, max: nMax, tickSpacing } = this.calculateNiceScale(min, max, approxLines);
        ctx.strokeStyle = this.config.currentGridColor;
        ctx.lineWidth = 0.5;
        for (let price = nMin; price <= nMax + 1e-8; price += tickSpacing) {
            const y = this.priceToY(price, min, max, chartH2, h);
            ctx.beginPath();
            ctx.moveTo(chartLeft, y);
            ctx.lineTo(chartLeft + chartW, y);
            ctx.stroke();
        }

        const cW = this.calculateCandleWidth();
        for (let i = Math.floor(this.config.dataOffset / 10) * 10; i < this.config.dataOffset + this.config.visibleCandles; i += 10) {
            if (i >= this.config.dataOffset && i < this.stockData.length) {
                const idx = i - this.config.dataOffset;
                const x = chartLeft + idx * (cW + this.config.spacing) + cW * 0.5;
                ctx.beginPath();
                ctx.moveTo(x, chartTop);
                ctx.lineTo(x, chartTop + chartH);
                ctx.stroke();
            }
        }

        if (this.config.chartType === 'line') {
            this.drawLineChart(ctx, min, max, chartW, chartH);
        } else {
            this.drawCandles(ctx, min, max, chartW, chartH);
        }

        ctx.restore();

        // Draw volume bars, price scale, date labels, last price, and branding
        const visibleData = this.stockData.slice(
            this.config.dataOffset,
            this.config.dataOffset + this.config.visibleCandles
        );
        const volumeHeight = 40; // Adjust this value as desired
        this.drawVolumeBars(ctx, visibleData, volumeHeight);

        this.drawPriceScale(ctx, min, max, nMin, nMax, tickSpacing);
        this.drawDateLabels(ctx);
        this.drawLastPriceLabel(ctx, min, max);
        this.drawBranding(ctx);
    }
    priceToY(val, pMin, pMax, chartH, canvasHeight) {
        const range = pMax - pMin;
        return (this.priceCanvas.height - this.config.padding.bottom) - ((val - pMin) / range) * chartH;
    }
    drawLineChart(ctx, min, max, chartW, chartH) {
        const data = this.stockData.slice(this.config.dataOffset, this.config.dataOffset + this.config.visibleCandles);
        const w = this.priceCanvas.width, h = this.priceCanvas.height;
        const cW = this.calculateCandleWidth();
        ctx.beginPath();
        let firstX, firstY, lastX, lastY;
        data.forEach((candle, i) => {
            const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5;
            const y = this.priceToY(candle.close, min, max, chartH, h);
            if (i === 0) { ctx.moveTo(x, y); firstX = x; firstY = y; }
            else { ctx.lineTo(x, y); }
            if (i === data.length - 1) { lastX = x; lastY = y; }
        });
        ctx.save();
        const grad = ctx.createLinearGradient(0, this.config.padding.top, 0, h - this.config.padding.bottom);
        if (this.config.darkMode) {
            grad.addColorStop(0, 'rgba(52,152,219,0.5)');
            grad.addColorStop(1, 'rgba(52,152,219,0.05)');
        } else {
            grad.addColorStop(0, 'rgba(52,152,219,0.3)');
            grad.addColorStop(1, 'rgba(52,152,219,0.02)');
        }
        ctx.lineTo(lastX, h - this.config.padding.bottom);
        ctx.lineTo(firstX, h - this.config.padding.bottom);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        data.forEach((candle, i) => {
            const x = this.config.padding.left + i * (cW + this.config.spacing) + cW / 2;
            const y = this.priceToY(candle.close, min, max, chartH, h);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }
    drawCandles(ctx, min, max, chartW, chartH) {
        const data = this.stockData.slice(this.config.dataOffset, this.config.dataOffset + this.config.visibleCandles);
        const w = this.priceCanvas.width, h = this.priceCanvas.height;
        const cW = this.calculateCandleWidth();
        data.forEach((candle, i) => {
            const isUp = candle.close >= candle.open;
            const color = isUp ? this.config.currentBullColor : this.config.currentBearColor;
            const x = this.config.padding.left + i * (cW + this.config.spacing);
            const yHigh = this.priceToY(candle.high, min, max, chartH, h);
            const yLow = this.priceToY(candle.low, min, max, chartH, h);
            const yOpen = this.priceToY(candle.open, min, max, chartH, h);
            const yClose = this.priceToY(candle.close, min, max, chartH, h);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.moveTo(x + cW * 0.5, yHigh);
            ctx.lineTo(x + cW * 0.5, yLow);
            ctx.stroke();
            ctx.fillStyle = color;
            const top = Math.min(yOpen, yClose);
            const bot = Math.max(yOpen, yClose);
            const bodyH = Math.max(1, bot - top);
            ctx.fillRect(x, top, cW, bodyH);
        });
    }
    drawPriceScale(ctx, min, max, nMin, nMax, spacing) {
        const w = this.priceCanvas.width;
        const h = this.priceCanvas.height;

        ctx.fillStyle = this.config.currentTextColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = '12px Arial';

        // Determine the chart’s drawable vertical boundaries
        const chartTop = this.config.padding.top;
        const chartBottom = h - this.config.padding.bottom;

        // Calculate the drawable height
        const chartH = chartBottom - chartTop;

        for (let price = nMin; price <= nMax + 1e-8; price += spacing) {
            const y = this.priceToY(price, min, max, chartH, h);

            // Skip labels that would appear outside the chart’s visible area
            if (y < chartTop || y > chartBottom) {
                continue;
            }

            const txt = price.toFixed(2);
            const labelX = w - this.config.padding.right + 5;
            ctx.fillText(txt, labelX, y);
        }
    }
    drawDateLabels(ctx) {
        const data = this.stockData.slice(this.config.dataOffset, this.config.dataOffset + this.config.visibleCandles);
        const w = this.priceCanvas.width, h = this.priceCanvas.height;
        const cW = this.calculateCandleWidth();
        ctx.fillStyle = this.config.currentTextColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = '12px Arial';
        data.forEach((candle, i) => {
            const globalIdx = i + this.config.dataOffset;
            if (globalIdx % 10 === 0) {
                const x = this.config.padding.left + i * (cW + this.config.spacing) + cW * 0.5;
                const label = this.formatTimestamp(candle.t, this.timeframe);
                ctx.fillText(label, x, h - this.config.padding.bottom + 5);
            }
        });
    }
    drawLastPriceLabel(ctx, min, max) {
        if (!this.stockData.length) return;
        const w = this.priceCanvas.width, h = this.priceCanvas.height;
        const last = this.stockData[this.stockData.length - 1];
        const close = last.close;
        const chartH = h - this.config.padding.top - this.config.padding.bottom;
        let y = this.priceToY(close, min, max, chartH, h);
        const topLim = this.config.padding.top + 10;
        const botLim = h - this.config.padding.bottom - 10;
        y = Math.max(topLim, Math.min(botLim, y));
        const label = close.toFixed(2);
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const txtW = ctx.measureText(label).width;
        const x = w - this.config.padding.right;
        ctx.fillStyle = this.config.darkMode ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.8)';
        ctx.fillRect(x, y - 10, txtW + 10, 20);
        ctx.strokeStyle = this.config.currentCrosshairColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y - 10, txtW + 10, 20);
        ctx.fillStyle = this.config.currentTextColor;
        ctx.fillText(label, x + 5, y);
    }
    drawWatermark(ctx, w, h) {
        ctx.save();
        ctx.font = this.config.watermark.font;
        ctx.fillStyle = this.config.darkMode
            ? `rgba(255,255,255,${this.config.watermark.opacity})`
            : `rgba(0,0,0,${this.config.watermark.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.config.watermark.text, w * 0.5, h * 0.5);
        ctx.restore();
    }
    drawBranding(ctx) {
        if (!this.config.branding.enabled) return;
        const w = this.priceCanvas.width, h = this.priceCanvas.height;
        ctx.save();
        ctx.font = this.config.branding.font;
        ctx.fillStyle = this.config.darkMode
            ? `rgba(255,255,255,${this.config.branding.opacity})`
            : `rgba(100,100,100,${this.config.branding.opacity})`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        const padX = 10, padY = 2;
        ctx.fillText(this.config.branding.text, padX, h - padY);
        ctx.restore();
    }
    calculateNiceScale(min, max, ticks = 5) {
        if (Math.abs(max - min) < 1e-5) { min -= 1; max += 1; }
        const rng = this.niceNumber(max - min, false);
        const spacing = this.niceNumber(rng / (ticks - 1), true);
        const niceMin = Math.floor(min / spacing) * spacing;
        const niceMax = Math.ceil(max / spacing) * spacing;
        return { min: niceMin, max: niceMax, tickSpacing: spacing };
    }
    niceNumber(range, round) {
        if (range === 0) return 1;
        const exp = Math.floor(Math.log10(range));
        const frac = range / Math.pow(10, exp);
        let nice;
        if (round) {
            if (frac < 1.5) nice = 1;
            else if (frac < 3) nice = 2;
            else if (frac < 7) nice = 5;
            else nice = 10;
        } else {
            if (frac <= 1) nice = 1;
            else if (frac <= 2) nice = 2;
            else if (frac <= 5) nice = 5;
            else nice = 10;
        }
        return nice * Math.pow(10, exp);
    }
    formatDetailTimestamp(ts, timeframe) {
        const d = new Date(ts);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        if (['1min', '5min', '15min', 'hour', '4hour'].includes(timeframe)) {
            return `${month}/${day}/${year} ${hh}:${mm}`;
        }
        return `${month}/${day}/${year}`;
    }
    detectTimeframe(data) {
        if (!data || data.length < 2) return 'day';
        const diff = Math.abs(data[1].t - data[0].t);
        if (diff < 90000) return '1min';
        if (diff < 300000) return '5min';
        if (diff < 900000) return '15min';
        if (diff < 3600000) return 'hour';
        if (diff < 86400000) return '4hour';
        if (diff < 604800000) return 'day';
        return 'week';
    }
    formatTimestamp(ts, tf) {
        const d = new Date(ts);
        switch (tf) {
            case '1min': case '5min': case '15min':
                return `${this.pad(d.getHours())}:${this.pad(d.getMinutes())}`;
            case 'hour': case '4hour':
                return `${(d.getMonth() + 1)}/${d.getDate()} ${this.pad(d.getHours())}:${this.pad(d.getMinutes())}`;
            case 'day':
                return `${(d.getMonth() + 1)}/${d.getDate()}`;
            case 'week': case 'month':
                return `${(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)}`;
            default:
                return `${(d.getMonth() + 1)}/${d.getDate()}`;
        }
    }
    pad(n) { return String(n).padStart(2, '0'); }
    destroy() {
        window.removeEventListener('resize', this.debouncedResize);
    }
    updateOHLCOverlay() {
        if (this.stockData.length) {
            const last = this.stockData[this.stockData.length - 1];
            this.openEl.textContent = last.open.toFixed(2);
            this.highEl.textContent = last.high.toFixed(2);
            this.lowEl.textContent = last.low.toFixed(2);
            this.closeEl.textContent = last.close.toFixed(2);

            let suffix = '';
            let scaled = last.volume;
            if (last.volume >= 1e9) {
                suffix = 'B';
                scaled = last.volume / 1e9;
            } else if (last.volume >= 1e6) {
                suffix = 'M';
                scaled = last.volume / 1e6;
            } else if (last.volume >= 1e3) {
                suffix = 'K';
                scaled = last.volume / 1e3;
            }
            let str = scaled.toFixed(2);
            str = parseFloat(str).toString();
            this.volEl.textContent = str + suffix;
        }
    }
    calculateOverlayWidths() {
        if (!this.stockData || !this.stockData.length) return;

        // Find the largest numeric values
        const maxOpen = Math.max(...this.stockData.map(d => d.open));
        const maxHigh = Math.max(...this.stockData.map(d => d.high));
        const maxLow = Math.max(...this.stockData.map(d => d.low));
        const maxClose = Math.max(...this.stockData.map(d => d.close));
        const maxVol = Math.max(...this.stockData.map(d => d.volume));

        // Convert each to the final text form that appears in the overlay
        const sampleLabels = [
            maxOpen.toFixed(2),
            maxHigh.toFixed(2),
            maxLow.toFixed(2),
            maxClose.toFixed(2),
            this.formatVolume(maxVol)  // e.g., "41.24B"
        ];

        // Measure them with the same font used in the overlay
        this.priceCtx.save();
        this.priceCtx.font = '14px Arial';  // or whatever font you actually use
        let widest = 0;
        sampleLabels.forEach(text => {
            const w = this.priceCtx.measureText(text).width;
            if (w > widest) widest = w;
        });
        this.priceCtx.restore();

        // Add a little padding so numbers don’t bump into label edges
        this.overlayLabelWidth = Math.ceil(widest + 10);
    }
    applyOverlayWidths() {
        // If you used classes like .open-value, .high-value, etc.
        const fields = this.chartContainer.querySelectorAll(
            '.open-value, .high-value, .low-value, .close-value, .vol-value'
        );
        fields.forEach(el => {
            el.style.display = 'inline-block';
            el.style.width = this.overlayLabelWidth + 'px';
            el.style.textAlign = 'left';
        });
    }
    formatVolume(vol) {
        let suffix = '';
        let scaled = vol;
        if (vol >= 1e9) {
            suffix = 'B';
            scaled = vol / 1e9;
        } else if (vol >= 1e6) {
            suffix = 'M';
            scaled = vol / 1e6;
        } else if (vol >= 1e3) {
            suffix = 'K';
            scaled = vol / 1e3;
        }
        // Keep two decimals, remove trailing zeros
        let str = scaled.toFixed(2);
        return parseFloat(str).toString() + suffix;
    }

}