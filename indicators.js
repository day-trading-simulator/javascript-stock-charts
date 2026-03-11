/**
 * Technical Indicators Library
 * All indicator calculation functions for the StockChart
 *
 * Usage: Include this file before stockchart.js
 * All functions are attached to window.TechnicalIndicators
 */

window.TechnicalIndicators = (function() {
    'use strict';

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    /**
     * Calculate Simple Moving Average
     * @param {number[]} data - Array of values
     * @param {number} period - Number of periods
     * @returns {number[]} - Array with SMA values (nulls for initial periods)
     */
    function SMA(data, period) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                result.push(null);
            } else {
                let sum = 0;
                for (let j = 0; j < period; j++) {
                    sum += data[i - j];
                }
                result.push(sum / period);
            }
        }
        return result;
    }

    /**
     * Calculate Exponential Moving Average
     * @param {number[]} data - Array of values
     * @param {number} period - Number of periods
     * @returns {number[]} - Array with EMA values (nulls for initial periods)
     */
    function EMA(data, period) {
        const result = [];
        const k = 2 / (period + 1);
        let ema = null;

        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                result.push(null);
            } else if (i === period - 1) {
                // First EMA is SMA
                let sum = 0;
                for (let j = 0; j < period; j++) {
                    sum += data[i - j];
                }
                ema = sum / period;
                result.push(ema);
            } else {
                ema = data[i] * k + ema * (1 - k);
                result.push(ema);
            }
        }
        return result;
    }

    /**
     * Calculate Weighted Moving Average
     * @param {number[]} data - Array of values
     * @param {number} period - Number of periods
     * @returns {number[]} - Array with WMA values
     */
    function WMA(data, period) {
        const result = [];
        const weightSum = (period * (period + 1)) / 2;

        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                result.push(null);
            } else {
                let sum = 0;
                for (let j = 0; j < period; j++) {
                    sum += data[i - j] * (period - j);
                }
                result.push(sum / weightSum);
            }
        }
        return result;
    }

    /**
     * Calculate Wilder's Smoothed Moving Average (WEMA)
     * Used in RSI, ATR, ADX calculations
     * @param {number[]} data - Array of values
     * @param {number} period - Number of periods
     * @returns {number[]} - Array with WEMA values
     */
    function WEMA(data, period) {
        const result = [];
        let wema = null;

        for (let i = 0; i < data.length; i++) {
            if (data[i] === null) {
                result.push(null);
                continue;
            }
            if (wema === null) {
                // Find first non-null values for initial SMA
                let sum = 0;
                let count = 0;
                for (let j = i; j < Math.min(i + period, data.length); j++) {
                    if (data[j] !== null) {
                        sum += data[j];
                        count++;
                    }
                }
                if (count === period) {
                    wema = sum / period;
                    result.push(wema);
                } else {
                    result.push(null);
                }
            } else {
                wema = (wema * (period - 1) + data[i]) / period;
                result.push(wema);
            }
        }
        return result;
    }

    /**
     * Find highest value in period
     */
    function highestHigh(data, index, period) {
        let highest = -Infinity;
        for (let i = 0; i < period && (index - i) >= 0; i++) {
            if (data[index - i].high > highest) {
                highest = data[index - i].high;
            }
        }
        return highest;
    }

    /**
     * Find lowest value in period
     */
    function lowestLow(data, index, period) {
        let lowest = Infinity;
        for (let i = 0; i < period && (index - i) >= 0; i++) {
            if (data[index - i].low < lowest) {
                lowest = data[index - i].low;
            }
        }
        return lowest;
    }

    // ============================================
    // MOMENTUM INDICATORS
    // ============================================

    /**
     * Calculate Relative Strength Index (RSI)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} period - RSI period (default 14)
     * @returns {number[]} - Array with RSI values (0-100)
     */
    function RSI(stockData, period = 14) {
        if (!stockData || stockData.length < period + 1) return [];

        const result = Array(period).fill(null);
        let gains = 0, losses = 0;

        // Calculate initial average gains and losses
        for (let i = 1; i <= period; i++) {
            const change = stockData[i].close - stockData[i - 1].close;
            if (change > 0) gains += change;
            else losses += Math.abs(change);
        }

        let avgGain = gains / period;
        let avgLoss = losses / period;
        let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        result.push(100 - (100 / (1 + rs)));

        // Smooth subsequent RSI values
        for (let i = period + 1; i < stockData.length; i++) {
            const change = stockData[i].close - stockData[i - 1].close;
            const currentGain = change > 0 ? change : 0;
            const currentLoss = change < 0 ? Math.abs(change) : 0;

            avgGain = ((avgGain * (period - 1)) + currentGain) / period;
            avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;
            rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            result.push(100 - (100 / (1 + rs)));
        }
        return result;
    }

    /**
     * Calculate MACD (Moving Average Convergence Divergence)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} fastPeriod - Fast EMA period (default 12)
     * @param {number} slowPeriod - Slow EMA period (default 26)
     * @param {number} signalPeriod - Signal line period (default 9)
     * @returns {Object} - { macdLine, signalLine, histogram }
     */
    function MACD(stockData, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        if (!stockData || stockData.length < slowPeriod + signalPeriod) {
            return { macdLine: [], signalLine: [], histogram: [] };
        }

        const closes = stockData.map(d => d.close);
        const fastEMA = EMA(closes, fastPeriod);
        const slowEMA = EMA(closes, slowPeriod);

        // MACD Line = Fast EMA - Slow EMA
        const macdLine = [];
        for (let i = 0; i < stockData.length; i++) {
            if (fastEMA[i] !== null && slowEMA[i] !== null) {
                macdLine.push(fastEMA[i] - slowEMA[i]);
            } else {
                macdLine.push(null);
            }
        }

        // Signal Line = EMA of MACD Line
        const validMacd = macdLine.filter(v => v !== null);
        const signalEMA = EMA(validMacd, signalPeriod);

        const signalLine = [];
        const histogram = [];
        let signalIdx = 0;

        for (let i = 0; i < macdLine.length; i++) {
            if (macdLine[i] !== null) {
                if (signalIdx < signalEMA.length && signalEMA[signalIdx] !== null) {
                    signalLine.push(signalEMA[signalIdx]);
                    histogram.push((macdLine[i] - signalEMA[signalIdx]) * 3.0);
                } else {
                    signalLine.push(null);
                    histogram.push(null);
                }
                signalIdx++;
            } else {
                signalLine.push(null);
                histogram.push(null);
            }
        }

        return { macdLine, signalLine, histogram };
    }

    /**
     * Calculate Stochastic Oscillator
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} kPeriod - %K period (default 14)
     * @param {number} dPeriod - %D period (default 3)
     * @param {number} slowing - Slowing period (default 3)
     * @returns {Object} - { k, d }
     */
    function Stochastic(stockData, kPeriod = 14, dPeriod = 3, slowing = 3) {
        if (!stockData || stockData.length < kPeriod) {
            return { k: [], d: [] };
        }

        const kValues = [];

        // Calculate raw %K values
        for (let i = 0; i < stockData.length; i++) {
            if (i < kPeriod - 1) {
                kValues.push(null);
            } else {
                const hh = highestHigh(stockData, i, kPeriod);
                const ll = lowestLow(stockData, i, kPeriod);
                const k = hh === ll ? 50 : ((stockData[i].close - ll) / (hh - ll)) * 100;
                kValues.push(k);
            }
        }

        // Smooth %K
        let smoothedK = [...kValues];
        if (slowing > 1) {
            smoothedK = [];
            for (let i = 0; i < kValues.length; i++) {
                if (kValues[i] === null || i < kPeriod + slowing - 2) {
                    smoothedK.push(null);
                } else {
                    let sum = 0, count = 0;
                    for (let j = 0; j < slowing; j++) {
                        if (kValues[i - j] !== null) {
                            sum += kValues[i - j];
                            count++;
                        }
                    }
                    smoothedK.push(count > 0 ? sum / count : null);
                }
            }
        }

        // Calculate %D as SMA of smoothed %K
        const dValues = [];
        for (let i = 0; i < smoothedK.length; i++) {
            if (smoothedK[i] === null || i < dPeriod - 1) {
                dValues.push(null);
            } else {
                let sum = 0, count = 0;
                for (let j = 0; j < dPeriod; j++) {
                    if (smoothedK[i - j] !== null) {
                        sum += smoothedK[i - j];
                        count++;
                    }
                }
                dValues.push(count === dPeriod ? sum / dPeriod : null);
            }
        }

        return { k: smoothedK, d: dValues };
    }

    /**
     * Calculate Williams %R
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} period - Period (default 14)
     * @returns {number[]} - Array with Williams %R values (-100 to 0)
     */
    function WilliamsR(stockData, period = 14) {
        if (!stockData || stockData.length < period) return [];

        const result = [];
        for (let i = 0; i < stockData.length; i++) {
            if (i < period - 1) {
                result.push(null);
            } else {
                const hh = highestHigh(stockData, i, period);
                const ll = lowestLow(stockData, i, period);
                const wr = hh === ll ? -50 : ((hh - stockData[i].close) / (hh - ll)) * -100;
                result.push(wr);
            }
        }
        return result;
    }

    /**
     * Calculate Rate of Change (ROC)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} period - Period (default 12)
     * @returns {number[]} - Array with ROC values (percentage)
     */
    function ROC(stockData, period = 12) {
        if (!stockData || stockData.length < period + 1) return [];

        const result = Array(period).fill(null);
        for (let i = period; i < stockData.length; i++) {
            const prevClose = stockData[i - period].close;
            if (prevClose !== 0) {
                result.push(((stockData[i].close - prevClose) / prevClose) * 100);
            } else {
                result.push(null);
            }
        }
        return result;
    }

    /**
     * Calculate Commodity Channel Index (CCI)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} period - Period (default 20)
     * @returns {number[]} - Array with CCI values
     */
    function CCI(stockData, period = 20) {
        if (!stockData || stockData.length < period) return [];

        const typicalPrices = stockData.map(d => (d.high + d.low + d.close) / 3);
        const result = [];

        for (let i = 0; i < stockData.length; i++) {
            if (i < period - 1) {
                result.push(null);
            } else {
                // Calculate SMA of typical price
                let sum = 0;
                for (let j = 0; j < period; j++) {
                    sum += typicalPrices[i - j];
                }
                const sma = sum / period;

                // Calculate mean deviation
                let meanDev = 0;
                for (let j = 0; j < period; j++) {
                    meanDev += Math.abs(typicalPrices[i - j] - sma);
                }
                meanDev = meanDev / period;

                // CCI = (TP - SMA) / (0.015 * Mean Deviation)
                const cci = meanDev === 0 ? 0 : (typicalPrices[i] - sma) / (0.015 * meanDev);
                result.push(cci);
            }
        }
        return result;
    }

    /**
     * Calculate Stochastic RSI
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} rsiPeriod - RSI period (default 14)
     * @param {number} stochPeriod - Stochastic period (default 14)
     * @param {number} kPeriod - %K smoothing (default 3)
     * @param {number} dPeriod - %D smoothing (default 3)
     * @returns {Object} - { k, d }
     */
    function StochasticRSI(stockData, rsiPeriod = 14, stochPeriod = 14, kPeriod = 3, dPeriod = 3) {
        const rsiValues = RSI(stockData, rsiPeriod);
        if (rsiValues.length < stochPeriod) {
            return { k: [], d: [] };
        }

        const stochRSI = [];
        for (let i = 0; i < rsiValues.length; i++) {
            if (rsiValues[i] === null || i < stochPeriod - 1) {
                stochRSI.push(null);
            } else {
                let highest = -Infinity, lowest = Infinity;
                for (let j = 0; j < stochPeriod; j++) {
                    if (rsiValues[i - j] !== null) {
                        highest = Math.max(highest, rsiValues[i - j]);
                        lowest = Math.min(lowest, rsiValues[i - j]);
                    }
                }
                if (highest === lowest) {
                    stochRSI.push(50);
                } else {
                    stochRSI.push(((rsiValues[i] - lowest) / (highest - lowest)) * 100);
                }
            }
        }

        // Smooth %K
        const kValues = SMA(stochRSI.map(v => v === null ? NaN : v).map(v => isNaN(v) ? null : v), kPeriod);
        // %D is SMA of %K
        const dValues = SMA(kValues.map(v => v === null ? NaN : v).map(v => isNaN(v) ? null : v), dPeriod);

        return { k: stochRSI, d: dValues };
    }

    /**
     * Calculate TRIX (Triple Exponential Average)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} period - Period (default 15)
     * @returns {number[]} - Array with TRIX values
     */
    function TRIX(stockData, period = 15) {
        if (!stockData || stockData.length < period * 3) return [];

        const closes = stockData.map(d => d.close);
        const ema1 = EMA(closes, period);
        const ema2 = EMA(ema1.filter(v => v !== null), period);
        const ema3 = EMA(ema2.filter(v => v !== null), period);

        const result = [];
        const offset = (period - 1) * 3;

        for (let i = 0; i < stockData.length; i++) {
            if (i < offset || i === 0) {
                result.push(null);
            } else {
                const idx3 = i - offset;
                if (idx3 > 0 && ema3[idx3] && ema3[idx3 - 1] && ema3[idx3 - 1] !== 0) {
                    result.push(((ema3[idx3] - ema3[idx3 - 1]) / ema3[idx3 - 1]) * 100);
                } else {
                    result.push(null);
                }
            }
        }
        return result;
    }

    /**
     * Calculate Awesome Oscillator (AO)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @returns {number[]} - Array with AO values
     */
    function AwesomeOscillator(stockData) {
        if (!stockData || stockData.length < 34) return [];

        const midpoints = stockData.map(d => (d.high + d.low) / 2);
        const sma5 = SMA(midpoints, 5);
        const sma34 = SMA(midpoints, 34);

        const result = [];
        for (let i = 0; i < stockData.length; i++) {
            if (sma5[i] !== null && sma34[i] !== null) {
                result.push(sma5[i] - sma34[i]);
            } else {
                result.push(null);
            }
        }
        return result;
    }

    // ============================================
    // TREND INDICATORS
    // ============================================

    /**
     * Calculate Average Directional Index (ADX)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} period - Period (default 14)
     * @returns {Object} - { adx, pdi, mdi }
     */
    function ADX(stockData, period = 14) {
        if (!stockData || stockData.length < period * 2) {
            return { adx: [], pdi: [], mdi: [] };
        }

        const tr = [], plusDM = [], minusDM = [];

        for (let i = 0; i < stockData.length; i++) {
            if (i === 0) {
                tr.push(stockData[i].high - stockData[i].low);
                plusDM.push(0);
                minusDM.push(0);
            } else {
                // True Range
                const hl = stockData[i].high - stockData[i].low;
                const hc = Math.abs(stockData[i].high - stockData[i - 1].close);
                const lc = Math.abs(stockData[i].low - stockData[i - 1].close);
                tr.push(Math.max(hl, hc, lc));

                // Directional Movement
                const upMove = stockData[i].high - stockData[i - 1].high;
                const downMove = stockData[i - 1].low - stockData[i].low;

                if (upMove > downMove && upMove > 0) {
                    plusDM.push(upMove);
                } else {
                    plusDM.push(0);
                }

                if (downMove > upMove && downMove > 0) {
                    minusDM.push(downMove);
                } else {
                    minusDM.push(0);
                }
            }
        }

        // Smooth TR, +DM, -DM using Wilder's smoothing
        const smoothedTR = WEMA(tr, period);
        const smoothedPlusDM = WEMA(plusDM, period);
        const smoothedMinusDM = WEMA(minusDM, period);

        // Calculate +DI and -DI
        const pdi = [], mdi = [], dx = [];
        for (let i = 0; i < stockData.length; i++) {
            if (smoothedTR[i] && smoothedTR[i] !== 0) {
                pdi.push((smoothedPlusDM[i] / smoothedTR[i]) * 100);
                mdi.push((smoothedMinusDM[i] / smoothedTR[i]) * 100);

                const diSum = pdi[i] + mdi[i];
                if (diSum !== 0) {
                    dx.push((Math.abs(pdi[i] - mdi[i]) / diSum) * 100);
                } else {
                    dx.push(0);
                }
            } else {
                pdi.push(null);
                mdi.push(null);
                dx.push(null);
            }
        }

        // ADX is smoothed DX
        const adx = WEMA(dx, period);

        return { adx, pdi, mdi };
    }

    // ============================================
    // VOLATILITY INDICATORS
    // ============================================

    /**
     * Calculate Average True Range (ATR)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} period - Period (default 14)
     * @returns {number[]} - Array with ATR values
     */
    function ATR(stockData, period = 14) {
        if (!stockData || stockData.length < period + 1) return [];

        const result = [];
        const trueRanges = [];

        for (let i = 0; i < stockData.length; i++) {
            if (i === 0) {
                trueRanges.push(stockData[i].high - stockData[i].low);
                result.push(null);
            } else {
                const tr = Math.max(
                    stockData[i].high - stockData[i].low,
                    Math.abs(stockData[i].high - stockData[i - 1].close),
                    Math.abs(stockData[i].low - stockData[i - 1].close)
                );
                trueRanges.push(tr);

                if (i < period) {
                    result.push(null);
                } else if (i === period) {
                    let sum = 0;
                    for (let j = 0; j <= period; j++) {
                        sum += trueRanges[j];
                    }
                    result.push(sum / (period + 1));
                } else {
                    const prevATR = result[i - 1];
                    result.push((prevATR * (period - 1) + tr) / period);
                }
            }
        }
        return result;
    }

    /**
     * Calculate Bollinger Bands
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} period - Period (default 20)
     * @param {number} stdDev - Standard deviations (default 2)
     * @returns {Object} - { upper, middle, lower }
     */
    function BollingerBands(stockData, period = 20, stdDev = 2) {
        if (!stockData || stockData.length < period) {
            return { upper: [], middle: [], lower: [] };
        }

        const closes = stockData.map(d => d.close);
        const middle = SMA(closes, period);
        const upper = [], lower = [];

        for (let i = 0; i < stockData.length; i++) {
            if (middle[i] === null) {
                upper.push(null);
                lower.push(null);
            } else {
                let sumSq = 0;
                for (let j = 0; j < period; j++) {
                    sumSq += Math.pow(closes[i - j] - middle[i], 2);
                }
                const std = Math.sqrt(sumSq / period);
                upper.push(middle[i] + stdDev * std);
                lower.push(middle[i] - stdDev * std);
            }
        }

        return { upper, middle, lower };
    }

    // ============================================
    // VOLUME INDICATORS
    // ============================================

    /**
     * Calculate On Balance Volume (OBV)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @returns {number[]} - Array with OBV values
     */
    function OBV(stockData) {
        if (!stockData || stockData.length === 0) return [];

        const result = [0];
        for (let i = 1; i < stockData.length; i++) {
            const prevClose = stockData[i - 1].close;
            const currClose = stockData[i].close;
            const volume = stockData[i].volume || 0;

            if (currClose > prevClose) {
                result.push(result[i - 1] + volume);
            } else if (currClose < prevClose) {
                result.push(result[i - 1] - volume);
            } else {
                result.push(result[i - 1]);
            }
        }
        return result;
    }

    /**
     * Calculate Accumulation/Distribution Line (ADL)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @returns {number[]} - Array with ADL values
     */
    function ADL(stockData) {
        if (!stockData || stockData.length === 0) return [];

        const result = [];
        let adl = 0;

        for (let i = 0; i < stockData.length; i++) {
            const high = stockData[i].high;
            const low = stockData[i].low;
            const close = stockData[i].close;
            const volume = stockData[i].volume || 0;

            // Money Flow Multiplier
            const mfm = high === low ? 0 : ((close - low) - (high - close)) / (high - low);
            // Money Flow Volume
            const mfv = mfm * volume;
            adl += mfv;
            result.push(adl);
        }
        return result;
    }

    /**
     * Calculate Money Flow Index (MFI)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} period - Period (default 14)
     * @returns {number[]} - Array with MFI values (0-100)
     */
    function MFI(stockData, period = 14) {
        if (!stockData || stockData.length < period + 1) return [];

        const typicalPrices = stockData.map(d => (d.high + d.low + d.close) / 3);
        const result = Array(period).fill(null);

        for (let i = period; i < stockData.length; i++) {
            let positiveFlow = 0, negativeFlow = 0;

            for (let j = 0; j < period; j++) {
                const idx = i - j;
                const moneyFlow = typicalPrices[idx] * (stockData[idx].volume || 0);

                if (idx > 0) {
                    if (typicalPrices[idx] > typicalPrices[idx - 1]) {
                        positiveFlow += moneyFlow;
                    } else if (typicalPrices[idx] < typicalPrices[idx - 1]) {
                        negativeFlow += moneyFlow;
                    }
                }
            }

            if (negativeFlow === 0) {
                result.push(100);
            } else {
                const mfr = positiveFlow / negativeFlow;
                result.push(100 - (100 / (1 + mfr)));
            }
        }
        return result;
    }

    /**
     * Calculate Force Index
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} period - EMA period (default 13)
     * @returns {number[]} - Array with Force Index values
     */
    function ForceIndex(stockData, period = 13) {
        if (!stockData || stockData.length < 2) return [];

        const rawForce = [null];
        for (let i = 1; i < stockData.length; i++) {
            const change = stockData[i].close - stockData[i - 1].close;
            const volume = stockData[i].volume || 0;
            rawForce.push(change * volume);
        }

        return EMA(rawForce.map(v => v === null ? 0 : v), period);
    }

    /**
     * Calculate Know Sure Thing (KST)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @returns {Object} - { kst, signal }
     */
    function KST(stockData) {
        if (!stockData || stockData.length < 45) {
            return { kst: [], signal: [] };
        }

        const closes = stockData.map(d => d.close);

        // ROC calculations
        const roc10 = [], roc15 = [], roc20 = [], roc30 = [];
        for (let i = 0; i < stockData.length; i++) {
            roc10.push(i >= 10 ? ((closes[i] - closes[i - 10]) / closes[i - 10]) * 100 : null);
            roc15.push(i >= 15 ? ((closes[i] - closes[i - 15]) / closes[i - 15]) * 100 : null);
            roc20.push(i >= 20 ? ((closes[i] - closes[i - 20]) / closes[i - 20]) * 100 : null);
            roc30.push(i >= 30 ? ((closes[i] - closes[i - 30]) / closes[i - 30]) * 100 : null);
        }

        // Smooth ROC values
        const smaRoc10 = SMA(roc10.map(v => v === null ? 0 : v), 10);
        const smaRoc15 = SMA(roc15.map(v => v === null ? 0 : v), 10);
        const smaRoc20 = SMA(roc20.map(v => v === null ? 0 : v), 10);
        const smaRoc30 = SMA(roc30.map(v => v === null ? 0 : v), 15);

        // KST = weighted sum
        const kst = [];
        for (let i = 0; i < stockData.length; i++) {
            if (smaRoc10[i] !== null && smaRoc15[i] !== null && smaRoc20[i] !== null && smaRoc30[i] !== null) {
                kst.push(smaRoc10[i] * 1 + smaRoc15[i] * 2 + smaRoc20[i] * 3 + smaRoc30[i] * 4);
            } else {
                kst.push(null);
            }
        }

        // Signal line
        const signal = SMA(kst.map(v => v === null ? 0 : v), 9);

        return { kst, signal };
    }

    /**
     * Calculate VWAP (Volume Weighted Average Price)
     * @param {Object[]} stockData - Array of OHLCV objects
     * @returns {number[]} - Array with VWAP values
     */
    function VWAP(stockData) {
        if (!stockData || stockData.length === 0) return [];

        const result = [];
        let cumulativeTPV = 0;
        let cumulativeVolume = 0;

        for (let i = 0; i < stockData.length; i++) {
            const tp = (stockData[i].high + stockData[i].low + stockData[i].close) / 3;
            const volume = stockData[i].volume || 0;
            cumulativeTPV += tp * volume;
            cumulativeVolume += volume;

            if (cumulativeVolume === 0) {
                result.push(tp);
            } else {
                result.push(cumulativeTPV / cumulativeVolume);
            }
        }
        return result;
    }

    // ============================================
    // OVERLAY INDICATORS
    // ============================================

    /**
     * Calculate Parabolic SAR
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} step - Acceleration factor step (default 0.02)
     * @param {number} max - Maximum acceleration factor (default 0.2)
     * @returns {number[]} - Array with PSAR values
     */
    function ParabolicSAR(stockData, step = 0.02, max = 0.2) {
        if (!stockData || stockData.length < 2) return [];

        const result = [];
        let isUptrend = stockData[1].close > stockData[0].close;
        let af = step;
        let ep = isUptrend ? stockData[0].high : stockData[0].low;
        let sar = isUptrend ? stockData[0].low : stockData[0].high;

        result.push(sar);

        for (let i = 1; i < stockData.length; i++) {
            const prevSar = sar;

            // Calculate new SAR
            sar = prevSar + af * (ep - prevSar);

            if (isUptrend) {
                // Ensure SAR is not above prior two lows
                if (i >= 2) {
                    sar = Math.min(sar, stockData[i - 1].low, stockData[i - 2].low);
                } else {
                    sar = Math.min(sar, stockData[i - 1].low);
                }

                // Check for reversal
                if (stockData[i].low < sar) {
                    isUptrend = false;
                    sar = ep;
                    ep = stockData[i].low;
                    af = step;
                } else {
                    if (stockData[i].high > ep) {
                        ep = stockData[i].high;
                        af = Math.min(af + step, max);
                    }
                }
            } else {
                // Ensure SAR is not below prior two highs
                if (i >= 2) {
                    sar = Math.max(sar, stockData[i - 1].high, stockData[i - 2].high);
                } else {
                    sar = Math.max(sar, stockData[i - 1].high);
                }

                // Check for reversal
                if (stockData[i].high > sar) {
                    isUptrend = true;
                    sar = ep;
                    ep = stockData[i].high;
                    af = step;
                } else {
                    if (stockData[i].low < ep) {
                        ep = stockData[i].low;
                        af = Math.min(af + step, max);
                    }
                }
            }

            result.push(sar);
        }
        return result;
    }

    /**
     * Calculate Ichimoku Cloud
     * @param {Object[]} stockData - Array of OHLCV objects
     * @param {number} conversionPeriod - Tenkan-sen period (default 9)
     * @param {number} basePeriod - Kijun-sen period (default 26)
     * @param {number} spanBPeriod - Senkou Span B period (default 52)
     * @param {number} displacement - Cloud displacement (default 26)
     * @returns {Object} - { tenkan, kijun, senkouA, senkouB, chikou }
     */
    function IchimokuCloud(stockData, conversionPeriod = 9, basePeriod = 26, spanBPeriod = 52, displacement = 26) {
        if (!stockData || stockData.length < spanBPeriod) {
            return { tenkan: [], kijun: [], senkouA: [], senkouB: [], chikou: [] };
        }

        const tenkan = [], kijun = [], senkouA = [], senkouB = [], chikou = [];

        for (let i = 0; i < stockData.length; i++) {
            // Tenkan-sen (Conversion Line)
            if (i >= conversionPeriod - 1) {
                const hh = highestHigh(stockData, i, conversionPeriod);
                const ll = lowestLow(stockData, i, conversionPeriod);
                tenkan.push((hh + ll) / 2);
            } else {
                tenkan.push(null);
            }

            // Kijun-sen (Base Line)
            if (i >= basePeriod - 1) {
                const hh = highestHigh(stockData, i, basePeriod);
                const ll = lowestLow(stockData, i, basePeriod);
                kijun.push((hh + ll) / 2);
            } else {
                kijun.push(null);
            }

            // Senkou Span A (Leading Span A) - shifted forward
            if (tenkan[i] !== null && kijun[i] !== null) {
                senkouA.push((tenkan[i] + kijun[i]) / 2);
            } else {
                senkouA.push(null);
            }

            // Senkou Span B (Leading Span B) - shifted forward
            if (i >= spanBPeriod - 1) {
                const hh = highestHigh(stockData, i, spanBPeriod);
                const ll = lowestLow(stockData, i, spanBPeriod);
                senkouB.push((hh + ll) / 2);
            } else {
                senkouB.push(null);
            }

            // Chikou Span (Lagging Span) - current close, will be plotted shifted back
            chikou.push(stockData[i].close);
        }

        return { tenkan, kijun, senkouA, senkouB, chikou, displacement };
    }

    /**
     * Calculate Typical Price
     * @param {Object[]} stockData - Array of OHLCV objects
     * @returns {number[]} - Array with typical price values
     */
    function TypicalPrice(stockData) {
        if (!stockData || stockData.length === 0) return [];
        return stockData.map(d => (d.high + d.low + d.close) / 3);
    }

    // ============================================
    // EXPORT PUBLIC API
    // ============================================

    return {
        // Helpers
        SMA,
        EMA,
        WMA,
        WEMA,

        // Momentum
        RSI,
        MACD,
        Stochastic,
        WilliamsR,
        ROC,
        CCI,
        StochasticRSI,
        TRIX,
        AwesomeOscillator,

        // Trend
        ADX,

        // Volatility
        ATR,
        BollingerBands,

        // Volume
        OBV,
        ADL,
        MFI,
        ForceIndex,
        KST,
        VWAP,

        // Overlays
        ParabolicSAR,
        IchimokuCloud,
        TypicalPrice
    };
})();
