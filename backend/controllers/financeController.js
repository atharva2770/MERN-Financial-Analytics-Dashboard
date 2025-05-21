// controllers/financeController.js
const { getCachedData, setCacheData } = require('../config/cache.js');
const alphaVantage = require('../utils/alphaVantage.js');
const { calculateStockScore } = require('../utils/stockScoreCalculator.js');

// Controller for daily stock data
const getDailyStockData = async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const cacheKey = `daily_stock_${symbol}`;

    try {
        const cachedData = getCachedData(cacheKey, 'DAILY_STOCK');
        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await alphaVantage.fetchDailyStockData(symbol);
        setCacheData(cacheKey, data);
        res.json(data);

    } catch (error) {
        console.error(`Error in getDailyStockData for ${symbol}:`, error.message);
        // Respond with 400 for API specific errors, 500 for others
        const statusCode = error.message.includes("Alpha Vantage API") ? 400 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};

// Controller for sector performance
const getSectorPerformance = async (req, res) => {
    const cacheKey = 'sector_performance';

    try {
        const cachedData = getCachedData(cacheKey, 'SECTOR_PERFORMANCE');
        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await alphaVantage.fetchSectorPerformanceData();
        setCacheData(cacheKey, data);
        res.json(data);

    } catch (error) {
        console.error('Error in getSectorPerformance:', error.message);
        const statusCode = error.message.includes("Alpha Vantage API") ? 400 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};

// Controller for market movers (gainers, losers, active)
const getMarketMovers = async (req, res) => {
    const cacheKey = 'market_movers';

    try {
        const cachedData = getCachedData(cacheKey, 'TOP_LISTS');
        if (cachedData) {
            return res.json(cachedData);
        }

        const data = await alphaVantage.fetchMarketMoversData();
        setCacheData(cacheKey, data);
        res.json(data);

    } catch (error) {
        console.error('Error in getMarketMovers:', error.message);
        const statusCode = error.message.includes("Alpha Vantage API") ? 400 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};

// NEW Controller for stock score
const getStockScore = async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const cacheKey = `stock_score_${symbol}`;

    try {
        const cachedData = getCachedData(cacheKey, 'DAILY_STOCK'); // Use DAILY_STOCK duration for score as it depends on daily data
        if (cachedData) {
            return res.json(cachedData);
        }

        const dailyData = await alphaVantage.fetchDailyStockData(symbol);

        if (!dailyData || dailyData.length === 0) {
            return res.status(404).json({ error: "No daily data available for this symbol to calculate score." });
        }

        const scoreResult = calculateStockScore(dailyData);

        if (!scoreResult) {
            return res.status(500).json({ error: "Failed to calculate stock score due to insufficient data or calculation error." });
        }

        setCacheData(cacheKey, scoreResult);
        res.json(scoreResult);

    } catch (error) {
        console.error(`Error in getStockScore for ${symbol}:`, error.message);
        const statusCode = error.message.includes("Alpha Vantage API") ? 400 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};

module.exports = {
    getDailyStockData,
    getSectorPerformance,
    getMarketMovers,
    getStockScore
};