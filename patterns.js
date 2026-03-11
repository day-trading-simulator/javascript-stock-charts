/**
 * Candlestick Pattern Detection Library
 * All pattern recognition functions for the StockChart
 *
 * Usage: Include this file before stockchart.js
 * All functions are attached to window.CandlestickPatterns
 */

window.CandlestickPatterns = (function() {
    'use strict';

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    /**
     * Check if candle is bullish (close > open)
     */
    function isBullish(candle) {
        return candle.close > candle.open;
    }

    /**
     * Check if candle is bearish (close < open)
     */
    function isBearish(candle) {
        return candle.close < candle.open;
    }

    /**
     * Get candle body size
     */
    function bodySize(candle) {
        return Math.abs(candle.close - candle.open);
    }

    /**
     * Get candle full range (high - low)
     */
    function candleRange(candle) {
        return candle.high - candle.low;
    }

    /**
     * Get upper shadow size
     */
    function upperShadow(candle) {
        return candle.high - Math.max(candle.open, candle.close);
    }

    /**
     * Get lower shadow size
     */
    function lowerShadow(candle) {
        return Math.min(candle.open, candle.close) - candle.low;
    }

    /**
     * Get body midpoint
     */
    function bodyMid(candle) {
        return (candle.open + candle.close) / 2;
    }

    /**
     * Check if body is small relative to range (for doji detection)
     */
    function hasSmallBody(candle, threshold = 0.1) {
        const range = candleRange(candle);
        if (range === 0) return true;
        return bodySize(candle) / range < threshold;
    }

    /**
     * Check if candle has long upper shadow
     */
    function hasLongUpperShadow(candle, threshold = 2) {
        const body = bodySize(candle);
        return body === 0 ? upperShadow(candle) > 0 : upperShadow(candle) > body * threshold;
    }

    /**
     * Check if candle has long lower shadow
     */
    function hasLongLowerShadow(candle, threshold = 2) {
        const body = bodySize(candle);
        return body === 0 ? lowerShadow(candle) > 0 : lowerShadow(candle) > body * threshold;
    }

    /**
     * Check if candle has no upper shadow (or very small)
     */
    function hasNoUpperShadow(candle, threshold = 0.05) {
        const range = candleRange(candle);
        if (range === 0) return true;
        return upperShadow(candle) / range < threshold;
    }

    /**
     * Check if candle has no lower shadow (or very small)
     */
    function hasNoLowerShadow(candle, threshold = 0.05) {
        const range = candleRange(candle);
        if (range === 0) return true;
        return lowerShadow(candle) / range < threshold;
    }

    /**
     * Check if there's a gap up between two candles
     */
    function isGapUp(candle1, candle2) {
        return Math.min(candle2.open, candle2.close) > Math.max(candle1.open, candle1.close);
    }

    /**
     * Check if there's a gap down between two candles
     */
    function isGapDown(candle1, candle2) {
        return Math.max(candle2.open, candle2.close) < Math.min(candle1.open, candle1.close);
    }

    /**
     * Check if in downtrend (simple check: close below SMA)
     */
    function isDowntrend(data, index, period = 5) {
        if (index < period) return false;
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[index - i].close;
        }
        return data[index].close < sum / period;
    }

    /**
     * Check if in uptrend
     */
    function isUptrend(data, index, period = 5) {
        if (index < period) return false;
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[index - i].close;
        }
        return data[index].close > sum / period;
    }

    // ============================================
    // SINGLE CANDLE PATTERNS
    // ============================================

    /**
     * Detect Doji
     * A candle where open and close are nearly equal
     */
    function isDoji(candle) {
        return hasSmallBody(candle, 0.1);
    }

    /**
     * Detect Dragonfly Doji
     * Doji with long lower shadow and no upper shadow
     */
    function isDragonflyDoji(candle) {
        return isDoji(candle) &&
               hasLongLowerShadow(candle, 2) &&
               hasNoUpperShadow(candle, 0.1);
    }

    /**
     * Detect Gravestone Doji
     * Doji with long upper shadow and no lower shadow
     */
    function isGravestoneDoji(candle) {
        return isDoji(candle) &&
               hasLongUpperShadow(candle, 2) &&
               hasNoLowerShadow(candle, 0.1);
    }

    /**
     * Detect Bullish Marubozu
     * Strong bullish candle with no shadows
     */
    function isBullishMarubozu(candle) {
        return isBullish(candle) &&
               hasNoUpperShadow(candle, 0.05) &&
               hasNoLowerShadow(candle, 0.05) &&
               bodySize(candle) > 0;
    }

    /**
     * Detect Bearish Marubozu
     * Strong bearish candle with no shadows
     */
    function isBearishMarubozu(candle) {
        return isBearish(candle) &&
               hasNoUpperShadow(candle, 0.05) &&
               hasNoLowerShadow(candle, 0.05) &&
               bodySize(candle) > 0;
    }

    /**
     * Detect Bullish Spinning Top
     * Small body with shadows on both sides
     */
    function isBullishSpinningTop(candle) {
        const range = candleRange(candle);
        if (range === 0) return false;
        const body = bodySize(candle);
        return isBullish(candle) &&
               body / range < 0.3 &&
               upperShadow(candle) > body * 0.5 &&
               lowerShadow(candle) > body * 0.5;
    }

    /**
     * Detect Bearish Spinning Top
     */
    function isBearishSpinningTop(candle) {
        const range = candleRange(candle);
        if (range === 0) return false;
        const body = bodySize(candle);
        return isBearish(candle) &&
               body / range < 0.3 &&
               upperShadow(candle) > body * 0.5 &&
               lowerShadow(candle) > body * 0.5;
    }

    /**
     * Detect Hammer
     * Small body at top with long lower shadow (bullish reversal in downtrend)
     */
    function isHammer(candle, data, index) {
        const range = candleRange(candle);
        if (range === 0) return false;
        const body = bodySize(candle);

        return body / range < 0.35 &&
               lowerShadow(candle) > body * 2 &&
               upperShadow(candle) < body * 0.5 &&
               isDowntrend(data, index);
    }

    /**
     * Detect Inverted Hammer
     * Small body at bottom with long upper shadow (bullish reversal in downtrend)
     */
    function isInvertedHammer(candle, data, index) {
        const range = candleRange(candle);
        if (range === 0) return false;
        const body = bodySize(candle);

        return body / range < 0.35 &&
               upperShadow(candle) > body * 2 &&
               lowerShadow(candle) < body * 0.5 &&
               isDowntrend(data, index);
    }

    /**
     * Detect Hanging Man
     * Same shape as Hammer but in uptrend (bearish reversal)
     */
    function isHangingMan(candle, data, index) {
        const range = candleRange(candle);
        if (range === 0) return false;
        const body = bodySize(candle);

        return body / range < 0.35 &&
               lowerShadow(candle) > body * 2 &&
               upperShadow(candle) < body * 0.5 &&
               isUptrend(data, index);
    }

    /**
     * Detect Shooting Star
     * Same shape as Inverted Hammer but in uptrend (bearish reversal)
     */
    function isShootingStar(candle, data, index) {
        const range = candleRange(candle);
        if (range === 0) return false;
        const body = bodySize(candle);

        return body / range < 0.35 &&
               upperShadow(candle) > body * 2 &&
               lowerShadow(candle) < body * 0.5 &&
               isUptrend(data, index);
    }

    // ============================================
    // TWO CANDLE PATTERNS
    // ============================================

    /**
     * Detect Bullish Engulfing
     * Bearish candle followed by larger bullish candle that engulfs it
     */
    function isBullishEngulfing(data, index) {
        if (index < 1) return false;
        const prev = data[index - 1];
        const curr = data[index];

        return isBearish(prev) &&
               isBullish(curr) &&
               curr.open < prev.close &&
               curr.close > prev.open &&
               bodySize(curr) > bodySize(prev);
    }

    /**
     * Detect Bearish Engulfing
     * Bullish candle followed by larger bearish candle that engulfs it
     */
    function isBearishEngulfing(data, index) {
        if (index < 1) return false;
        const prev = data[index - 1];
        const curr = data[index];

        return isBullish(prev) &&
               isBearish(curr) &&
               curr.open > prev.close &&
               curr.close < prev.open &&
               bodySize(curr) > bodySize(prev);
    }

    /**
     * Detect Bullish Harami
     * Large bearish candle followed by small bullish candle contained within it
     */
    function isBullishHarami(data, index) {
        if (index < 1) return false;
        const prev = data[index - 1];
        const curr = data[index];

        return isBearish(prev) &&
               isBullish(curr) &&
               curr.open > prev.close &&
               curr.close < prev.open &&
               bodySize(curr) < bodySize(prev) * 0.5;
    }

    /**
     * Detect Bearish Harami
     * Large bullish candle followed by small bearish candle contained within it
     */
    function isBearishHarami(data, index) {
        if (index < 1) return false;
        const prev = data[index - 1];
        const curr = data[index];

        return isBullish(prev) &&
               isBearish(curr) &&
               curr.open < prev.close &&
               curr.close > prev.open &&
               bodySize(curr) < bodySize(prev) * 0.5;
    }

    /**
     * Detect Bullish Harami Cross
     * Harami where second candle is a Doji
     */
    function isBullishHaramiCross(data, index) {
        if (index < 1) return false;
        const prev = data[index - 1];
        const curr = data[index];

        return isBearish(prev) &&
               isDoji(curr) &&
               curr.open > prev.close &&
               curr.close < prev.open;
    }

    /**
     * Detect Bearish Harami Cross
     */
    function isBearishHaramiCross(data, index) {
        if (index < 1) return false;
        const prev = data[index - 1];
        const curr = data[index];

        return isBullish(prev) &&
               isDoji(curr) &&
               curr.open < prev.close &&
               curr.close > prev.open;
    }

    /**
     * Detect Dark Cloud Cover
     * Bullish candle followed by bearish that opens above prior high
     * and closes below midpoint of prior body
     */
    function isDarkCloudCover(data, index) {
        if (index < 1) return false;
        const prev = data[index - 1];
        const curr = data[index];

        return isBullish(prev) &&
               isBearish(curr) &&
               curr.open > prev.high &&
               curr.close < bodyMid(prev) &&
               curr.close > prev.open;
    }

    /**
     * Detect Piercing Line
     * Bearish candle followed by bullish that opens below prior low
     * and closes above midpoint of prior body
     */
    function isPiercingLine(data, index) {
        if (index < 1) return false;
        const prev = data[index - 1];
        const curr = data[index];

        return isBearish(prev) &&
               isBullish(curr) &&
               curr.open < prev.low &&
               curr.close > bodyMid(prev) &&
               curr.close < prev.open;
    }

    /**
     * Detect Tweezer Top
     * Two candles with same highs at market top
     */
    function isTweezerTop(data, index) {
        if (index < 1) return false;
        const prev = data[index - 1];
        const curr = data[index];
        const tolerance = candleRange(prev) * 0.05;

        return Math.abs(prev.high - curr.high) < tolerance &&
               isBullish(prev) &&
               isBearish(curr) &&
               isUptrend(data, index - 1);
    }

    /**
     * Detect Tweezer Bottom
     * Two candles with same lows at market bottom
     */
    function isTweezerBottom(data, index) {
        if (index < 1) return false;
        const prev = data[index - 1];
        const curr = data[index];
        const tolerance = candleRange(prev) * 0.05;

        return Math.abs(prev.low - curr.low) < tolerance &&
               isBearish(prev) &&
               isBullish(curr) &&
               isDowntrend(data, index - 1);
    }

    // ============================================
    // THREE CANDLE PATTERNS
    // ============================================

    /**
     * Detect Morning Star
     * Bearish candle, small body/doji, bullish candle
     */
    function isMorningStar(data, index) {
        if (index < 2) return false;
        const first = data[index - 2];
        const second = data[index - 1];
        const third = data[index];

        return isBearish(first) &&
               bodySize(first) > bodySize(second) * 2 &&
               isBullish(third) &&
               bodySize(third) > bodySize(second) * 2 &&
               third.close > bodyMid(first) &&
               isDowntrend(data, index - 2);
    }

    /**
     * Detect Morning Doji Star
     * Morning Star where middle candle is Doji
     */
    function isMorningDojiStar(data, index) {
        if (index < 2) return false;
        const first = data[index - 2];
        const second = data[index - 1];
        const third = data[index];

        return isBearish(first) &&
               isDoji(second) &&
               isBullish(third) &&
               third.close > bodyMid(first) &&
               isDowntrend(data, index - 2);
    }

    /**
     * Detect Evening Star
     * Bullish candle, small body/doji, bearish candle
     */
    function isEveningStar(data, index) {
        if (index < 2) return false;
        const first = data[index - 2];
        const second = data[index - 1];
        const third = data[index];

        return isBullish(first) &&
               bodySize(first) > bodySize(second) * 2 &&
               isBearish(third) &&
               bodySize(third) > bodySize(second) * 2 &&
               third.close < bodyMid(first) &&
               isUptrend(data, index - 2);
    }

    /**
     * Detect Evening Doji Star
     * Evening Star where middle candle is Doji
     */
    function isEveningDojiStar(data, index) {
        if (index < 2) return false;
        const first = data[index - 2];
        const second = data[index - 1];
        const third = data[index];

        return isBullish(first) &&
               isDoji(second) &&
               isBearish(third) &&
               third.close < bodyMid(first) &&
               isUptrend(data, index - 2);
    }

    /**
     * Detect Three White Soldiers
     * Three consecutive bullish candles with higher closes
     */
    function isThreeWhiteSoldiers(data, index) {
        if (index < 2) return false;
        const first = data[index - 2];
        const second = data[index - 1];
        const third = data[index];

        return isBullish(first) && isBullish(second) && isBullish(third) &&
               second.close > first.close &&
               third.close > second.close &&
               second.open > first.open && second.open < first.close &&
               third.open > second.open && third.open < second.close &&
               !hasLongUpperShadow(first) &&
               !hasLongUpperShadow(second) &&
               !hasLongUpperShadow(third);
    }

    /**
     * Detect Three Black Crows
     * Three consecutive bearish candles with lower closes
     */
    function isThreeBlackCrows(data, index) {
        if (index < 2) return false;
        const first = data[index - 2];
        const second = data[index - 1];
        const third = data[index];

        return isBearish(first) && isBearish(second) && isBearish(third) &&
               second.close < first.close &&
               third.close < second.close &&
               second.open < first.open && second.open > first.close &&
               third.open < second.open && third.open > second.close &&
               !hasLongLowerShadow(first) &&
               !hasLongLowerShadow(second) &&
               !hasLongLowerShadow(third);
    }

    /**
     * Detect Bullish Abandoned Baby
     * Bearish, doji with gap, bullish with gap
     */
    function isBullishAbandonedBaby(data, index) {
        if (index < 2) return false;
        const first = data[index - 2];
        const second = data[index - 1];
        const third = data[index];

        return isBearish(first) &&
               isDoji(second) &&
               isBullish(third) &&
               second.high < first.low &&  // Gap down
               second.high < third.low;     // Gap up
    }

    /**
     * Detect Bearish Abandoned Baby
     */
    function isBearishAbandonedBaby(data, index) {
        if (index < 2) return false;
        const first = data[index - 2];
        const second = data[index - 1];
        const third = data[index];

        return isBullish(first) &&
               isDoji(second) &&
               isBearish(third) &&
               second.low > first.high &&  // Gap up
               second.low > third.high;     // Gap down
    }

    /**
     * Detect Downside Tasuki Gap
     * Bearish, bearish with gap down, bullish that fills gap partially
     */
    function isDownsideTasukiGap(data, index) {
        if (index < 2) return false;
        const first = data[index - 2];
        const second = data[index - 1];
        const third = data[index];

        return isBearish(first) &&
               isBearish(second) &&
               isBullish(third) &&
               isGapDown(first, second) &&
               third.open > second.open &&
               third.close < first.close &&
               third.close > second.open;
    }

    /**
     * Detect Upside Tasuki Gap
     */
    function isUpsideTasukiGap(data, index) {
        if (index < 2) return false;
        const first = data[index - 2];
        const second = data[index - 1];
        const third = data[index];

        return isBullish(first) &&
               isBullish(second) &&
               isBearish(third) &&
               isGapUp(first, second) &&
               third.open < second.close &&
               third.close > first.close &&
               third.close < second.open;
    }

    // ============================================
    // PATTERN SCANNER
    // ============================================

    /**
     * Scan all patterns at a given index
     * @param {Object[]} data - Array of OHLCV objects
     * @param {number} index - Index to check
     * @returns {Object[]} - Array of detected patterns
     */
    function scanPatterns(data, index) {
        if (!data || index < 0 || index >= data.length) return [];

        const patterns = [];
        const candle = data[index];

        // Single candle patterns
        if (isDoji(candle)) {
            patterns.push({ name: 'Doji', type: 'neutral', index });
        }
        if (isDragonflyDoji(candle)) {
            patterns.push({ name: 'Dragonfly Doji', type: 'bullish', index });
        }
        if (isGravestoneDoji(candle)) {
            patterns.push({ name: 'Gravestone Doji', type: 'bearish', index });
        }
        if (isBullishMarubozu(candle)) {
            patterns.push({ name: 'Bullish Marubozu', type: 'bullish', index });
        }
        if (isBearishMarubozu(candle)) {
            patterns.push({ name: 'Bearish Marubozu', type: 'bearish', index });
        }
        if (isBullishSpinningTop(candle)) {
            patterns.push({ name: 'Bullish Spinning Top', type: 'neutral', index });
        }
        if (isBearishSpinningTop(candle)) {
            patterns.push({ name: 'Bearish Spinning Top', type: 'neutral', index });
        }
        if (isHammer(candle, data, index)) {
            patterns.push({ name: 'Hammer', type: 'bullish', index });
        }
        if (isInvertedHammer(candle, data, index)) {
            patterns.push({ name: 'Inverted Hammer', type: 'bullish', index });
        }
        if (isHangingMan(candle, data, index)) {
            patterns.push({ name: 'Hanging Man', type: 'bearish', index });
        }
        if (isShootingStar(candle, data, index)) {
            patterns.push({ name: 'Shooting Star', type: 'bearish', index });
        }

        // Two candle patterns
        if (isBullishEngulfing(data, index)) {
            patterns.push({ name: 'Bullish Engulfing', type: 'bullish', index });
        }
        if (isBearishEngulfing(data, index)) {
            patterns.push({ name: 'Bearish Engulfing', type: 'bearish', index });
        }
        if (isBullishHarami(data, index)) {
            patterns.push({ name: 'Bullish Harami', type: 'bullish', index });
        }
        if (isBearishHarami(data, index)) {
            patterns.push({ name: 'Bearish Harami', type: 'bearish', index });
        }
        if (isBullishHaramiCross(data, index)) {
            patterns.push({ name: 'Bullish Harami Cross', type: 'bullish', index });
        }
        if (isBearishHaramiCross(data, index)) {
            patterns.push({ name: 'Bearish Harami Cross', type: 'bearish', index });
        }
        if (isDarkCloudCover(data, index)) {
            patterns.push({ name: 'Dark Cloud Cover', type: 'bearish', index });
        }
        if (isPiercingLine(data, index)) {
            patterns.push({ name: 'Piercing Line', type: 'bullish', index });
        }
        if (isTweezerTop(data, index)) {
            patterns.push({ name: 'Tweezer Top', type: 'bearish', index });
        }
        if (isTweezerBottom(data, index)) {
            patterns.push({ name: 'Tweezer Bottom', type: 'bullish', index });
        }

        // Three candle patterns
        if (isMorningStar(data, index)) {
            patterns.push({ name: 'Morning Star', type: 'bullish', index });
        }
        if (isMorningDojiStar(data, index)) {
            patterns.push({ name: 'Morning Doji Star', type: 'bullish', index });
        }
        if (isEveningStar(data, index)) {
            patterns.push({ name: 'Evening Star', type: 'bearish', index });
        }
        if (isEveningDojiStar(data, index)) {
            patterns.push({ name: 'Evening Doji Star', type: 'bearish', index });
        }
        if (isThreeWhiteSoldiers(data, index)) {
            patterns.push({ name: 'Three White Soldiers', type: 'bullish', index });
        }
        if (isThreeBlackCrows(data, index)) {
            patterns.push({ name: 'Three Black Crows', type: 'bearish', index });
        }
        if (isBullishAbandonedBaby(data, index)) {
            patterns.push({ name: 'Bullish Abandoned Baby', type: 'bullish', index });
        }
        if (isBearishAbandonedBaby(data, index)) {
            patterns.push({ name: 'Bearish Abandoned Baby', type: 'bearish', index });
        }
        if (isDownsideTasukiGap(data, index)) {
            patterns.push({ name: 'Downside Tasuki Gap', type: 'bearish', index });
        }
        if (isUpsideTasukiGap(data, index)) {
            patterns.push({ name: 'Upside Tasuki Gap', type: 'bullish', index });
        }

        return patterns;
    }

    /**
     * Scan entire dataset for all patterns
     * @param {Object[]} data - Array of OHLCV objects
     * @param {Object} options - { bullish: true, bearish: true, neutral: true }
     * @returns {Object[]} - Array of all detected patterns
     */
    function scanAll(data, options = { bullish: true, bearish: true, neutral: true }) {
        if (!data || data.length === 0) return [];

        const allPatterns = [];
        for (let i = 0; i < data.length; i++) {
            const patterns = scanPatterns(data, i);
            for (const pattern of patterns) {
                if ((pattern.type === 'bullish' && options.bullish) ||
                    (pattern.type === 'bearish' && options.bearish) ||
                    (pattern.type === 'neutral' && options.neutral)) {
                    allPatterns.push(pattern);
                }
            }
        }
        return allPatterns;
    }

    /**
     * Get bullish patterns only
     */
    function scanBullish(data) {
        return scanAll(data, { bullish: true, bearish: false, neutral: false });
    }

    /**
     * Get bearish patterns only
     */
    function scanBearish(data) {
        return scanAll(data, { bullish: false, bearish: true, neutral: false });
    }

    // ============================================
    // EXPORT PUBLIC API
    // ============================================

    return {
        // Single candle
        isDoji,
        isDragonflyDoji,
        isGravestoneDoji,
        isBullishMarubozu,
        isBearishMarubozu,
        isBullishSpinningTop,
        isBearishSpinningTop,
        isHammer,
        isInvertedHammer,
        isHangingMan,
        isShootingStar,

        // Two candle
        isBullishEngulfing,
        isBearishEngulfing,
        isBullishHarami,
        isBearishHarami,
        isBullishHaramiCross,
        isBearishHaramiCross,
        isDarkCloudCover,
        isPiercingLine,
        isTweezerTop,
        isTweezerBottom,

        // Three candle
        isMorningStar,
        isMorningDojiStar,
        isEveningStar,
        isEveningDojiStar,
        isThreeWhiteSoldiers,
        isThreeBlackCrows,
        isBullishAbandonedBaby,
        isBearishAbandonedBaby,
        isDownsideTasukiGap,
        isUpsideTasukiGap,

        // Scanners
        scanPatterns,
        scanAll,
        scanBullish,
        scanBearish,

        // Helpers (exposed for custom pattern creation)
        helpers: {
            isBullish,
            isBearish,
            bodySize,
            candleRange,
            upperShadow,
            lowerShadow,
            hasSmallBody,
            hasLongUpperShadow,
            hasLongLowerShadow,
            isGapUp,
            isGapDown,
            isDowntrend,
            isUptrend
        }
    };
})();
