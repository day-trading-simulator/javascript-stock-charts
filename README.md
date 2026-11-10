# JavaScript Stock Charts

**[View Live Demo on simul8or.com](https://simul8or.com/javascript-stock-chart.php)** - See the full capabilities in action with interactive examples and documentation.

![JavaScript Stock Chart](javascript-stock-chart1.png)

A lightweight, zero-dependency JavaScript stock chart library for financial data visualization. Built on HTML5 Canvas with HiDPI support, technical indicators, candlestick pattern detection, and real-time interactivity.

## What's new in v3.0

- **Key levels** - Day high and low, premarket range and prior close, drawn as dashed lines with tags
- **Undo for drawings** - Ctrl+Z steps back through every line and drawing; one click clears them all
- **Indicator colors** - Click any color dot in the Indicators menu to restyle that line
- **Change & range in the legend** - Hover any candle to see its move from the prior close and its high-low range
- **Measure tool**, a **30-minute timeframe**, and many rendering fixes
- **Live data ready** - Update the last candle or append new ones and redraw (see [Live Data](#live-data))
- **`tickerLogoUrl`** and **`padding`** options (see [Configuration Options](#configuration-options))

Upgrading from v2? v3 keeps the same API, so it's a drop-in replacement. Need v2? Use the [`v2.0` tag](https://github.com/day-trading-simulator/javascript-stock-charts/tree/v2.0).

## Features

### Core
- **Candlestick & Line Charts** - Toggle between chart types with a single click
- **HiDPI Rendering** - Crisp visuals on Retina and high-DPI displays
- **Dark/Light Mode** - Built-in theme switching
- **Responsive Design** - Adapts to any screen size, mobile-friendly with touch/pinch support
- **Volume Panel** - Toggleable volume bars below price data
- **Fullscreen Mode** - Expand charts with one click
- **Screenshot to Clipboard** - Copy chart as PNG with embedded branding

  ![Chart Types and Dark Mode](javascript-stock-chart2.png)

### Technical Indicators
Built-in support for popular indicators via the included `indicators.js` module:

- **RSI** - Relative Strength Index
- **MACD** - Moving Average Convergence Divergence
- **Bollinger Bands** - Volatility bands around a moving average
- **Stochastic** - Momentum oscillator
- **ATR** - Average True Range
- **OBV** - On-Balance Volume
- **ADX** - Average Directional Index
- **CCI** - Commodity Channel Index
- **Williams %R** - Momentum indicator
- **MFI** - Money Flow Index
- **Moving Averages** - Customizable SMA/EMA with color picker
- And more

### Pattern Detection
Automatic candlestick pattern recognition via the included `patterns.js` module:

- Engulfing (bullish/bearish)
- Doji, Hammer, Shooting Star
- Morning/Evening Star
- And more

### Interactive Controls
- **Drag** - Pan horizontally and vertically
- **Mouse Wheel** - Zoom in/out
- **Pinch** - Zoom on touch devices
- **Hover** - Crosshair with real-time OHLC data
- **Price Scale Drag** - Adjust vertical scaling
- **Timeframe Selector** - Switch between 1min, 5min, 15min, 30min, 1hour, 4hour, daily, weekly
- **Drawing Tools** - Trendlines and Fibonacci retracements
- **AI Price Levels** - Overlay support/resistance levels programmatically

## Installation

Include the source files in your HTML. Keep `simul8or-logo.svg` next to `stock-chart.js`.

```html
<link rel="stylesheet" href="stock-chart.css">
<script src="indicators.js"></script>
<script src="patterns.js"></script>
<script src="stock-chart.js"></script>
```

Or load it from the jsDelivr CDN. Pin a version so updates never change your chart unexpectedly:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/day-trading-simulator/javascript-stock-charts@v3.0/stock-chart.css">
<script src="https://cdn.jsdelivr.net/gh/day-trading-simulator/javascript-stock-charts@v3.0/indicators.js"></script>
<script src="https://cdn.jsdelivr.net/gh/day-trading-simulator/javascript-stock-charts@v3.0/patterns.js"></script>
<script src="https://cdn.jsdelivr.net/gh/day-trading-simulator/javascript-stock-charts@v3.0/stock-chart.js"></script>
```

## Quick Start

```html
<div id="chart-container" style="width: 100%; height: 500px;"></div>

<script>
  const data = [
    { t: 1675209600000, open: 180.68, high: 187.12, low: 179.26, close: 185.38, volume: 4235600 },
    { t: 1675296000000, open: 186.12, high: 194.32, low: 185.21, close: 188.74, volume: 5127800 },
    // ... more data points
  ];

  const chart = new StockChart('chart-container', {
    data: data,
    ticker: 'AAPL',
    darkMode: true,
    chartType: 'candlestick',
    timeframe: '1day'
  });
</script>
```

## Configuration Options

```javascript
const chart = new StockChart('container', {
  // Required
  data: ohlcData,           // Array of { t, open, high, low, close, volume }
  ticker: 'NVDA',           // Stock symbol (displayed as watermark)

  // Optional
  chartType: 'candlestick', // 'candlestick' or 'line'
  darkMode: false,          // Enable dark mode
  timeframe: '1day',        // '1min', '2min', '5min', '15min', '30min', '1hour', '4hour', '1day', '1week', '1month'
  padding: { top: 90 },     // Space above the price area for the toolbar and legend (default 90)
  tickerLogoUrl: (symbol) => `https://your-cdn.example/logos/${symbol}.png`, // Logo next to the ticker (off unless set)

  // Indicators (enable/disable programmatically)
  indicators: {
    rsi: true,
    macd: false,
    bollingerBands: false
  },

  // Moving averages
  movingAverages: [
    { type: 'sma', period: 20, enabled: true, color: '#2196F3' },
    { type: 'ema', period: 50, enabled: true, color: '#FF9800' }
  ]
});
```

## API Methods

```javascript
// Redraw the chart
chart.drawCharts();

// Destroy the chart and clean up
chart.destroy();

// Update configuration
chart.config.darkMode = true;
chart.drawCharts();

// AI price level overlays
chart.addAIPriceLevel({ label: 'Entry', price: 185.50, color: '#00C851' });
chart.setAIPriceLevels([
  { label: 'Stop Loss', price: 178.00 },
  { label: 'Target', price: 195.00 }
]);
chart.clearAIPriceLevels();

// Handle container resize
window.addEventListener('resize', () => chart.resizeCanvases());
```

## Live Data

Feed new prices by updating the last candle (or pushing a new one) and redrawing. This example streams live BTC candles from Hyperliquid's free public API, with no key needed. `test.html` runs the full version.

```javascript
const toBar = c => ({ t: c.t, open: +c.o, high: +c.h, low: +c.l, close: +c.c, volume: +c.v });

// 1. Load the last 300 one-minute candles
const res = await fetch('https://api.hyperliquid.xyz/info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'candleSnapshot', req: {
    coin: 'BTC', interval: '1m', startTime: Date.now() - 300 * 60000, endTime: Date.now() } })
});
const chart = new StockChart('chart-container', {
  data: (await res.json()).map(toBar),
  ticker: 'BTC', timeframe: '1min', chartType: 'candlestick', darkMode: true
});

// 2. Stream updates over a WebSocket
const ws = new WebSocket('wss://api.hyperliquid.xyz/ws');
ws.onopen = () => ws.send(JSON.stringify({ method: 'subscribe',
  subscription: { type: 'candle', coin: 'BTC', interval: '1m' } }));
ws.onmessage = e => {
  const msg = JSON.parse(e.data);
  if (msg.channel !== 'candle') return;
  const bar = toBar(msg.data), data = chart.stockData, last = data[data.length - 1];
  if (last && last.t === bar.t) Object.assign(last, bar);
  else {
    data.push(bar);
    if (chart.isViewPinnedToRightEdge)   // keep the newest candle in view
      chart.config.dataOffset = Math.max(0, data.length - chart.config.visibleCandles);
  }
  chart.calculateIndicators();
  chart.drawCharts();
};
```

## Browser Support

- Modern browsers with HTML5 Canvas support
- Chrome, Firefox, Safari, Edge
- Mobile browsers on iOS and Android

## Performance

- Canvas-based rendering (not SVG/DOM) for large datasets
- HiDPI-aware with devicePixelRatio scaling
- Debounced resize handling
- Optimized for both desktop and mobile

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License with an attribution requirement - the built-in branding link to simul8or.com must remain visible and functional. See the LICENSE file for details.

---

Powered by [simul8or](https://simul8or.com)
