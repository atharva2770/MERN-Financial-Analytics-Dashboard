// utils/alphaVantage.js
const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY; // Ensure .env is loaded in server.js

// Helper function to check for Alpha Vantage API errors/notes
const handleAlphaVantageError = (data) => {
    if (data["Error Message"] || data["Note"]) {
        const errorMessage = data["Error Message"] || data["Note"];
        console.warn('Alpha Vantage API warning/error:', errorMessage);
        // We'll throw an error to be caught by the controller
        throw new Error(errorMessage);
    }
};

// Helper function to normalize daily time series data for frontend
const normalizeDailyTimeSeries = (apiData) => {
    const timeSeries = apiData["Time Series (Daily)"];
    if (!timeSeries) return [];

    const normalizedData = [];
    for (const date in timeSeries) {
        normalizedData.push({
            date: date,
            open: parseFloat(timeSeries[date]["1. open"]),
            high: parseFloat(timeSeries[date]["2. high"]),
            low: parseFloat(timeSeries[date]["3. low"]),
            close: parseFloat(timeSeries[date]["4. close"]),
            volume: parseInt(timeSeries[date]["5. volume"])
        });
    }
    // Sort by date ascending for charting
    normalizedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    return normalizedData;
};

// Function to fetch and normalize daily stock time series
const fetchDailyStockData = async (symbol) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await axios.get(url);
    handleAlphaVantageError(response.data); // Check for API-specific errors
    return normalizeDailyTimeSeries(response.data);
};

// Function to fetch and normalize sector performance data
const fetchSectorPerformanceData = async () => {
    const url = `https://www.alphavantage.co/query?function=SECTOR&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await axios.get(url);
    handleAlphaVantageError(response.data);

    const apiData = response.data;
    const normalizedData = [];
    const realtimePerformance = apiData["Rank A: Realtime Performance"];

    if (realtimePerformance) {
        for (const sector in realtimePerformance) {
            normalizedData.push({
                sector: sector,
                performance: parseFloat(realtimePerformance[sector].replace('%', ''))
            });
        }
    }
    return normalizedData;
};

// Function to fetch and normalize top gainers, losers, and most actively traded stocks
const fetchMarketMoversData = async () => {
    const url = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await axios.get(url);
    handleAlphaVantageError(response.data);

    const apiData = response.data;
    const normalizedData = {
        topGainers: [],
        topLosers: [],
        mostActivelyTraded: []
    };

    if (apiData.top_gainers) {
        normalizedData.topGainers = apiData.top_gainers.map(item => ({
            ticker: item.ticker,
            price: parseFloat(item.price),
            changeAmount: parseFloat(item.change_amount),
            changePercentage: parseFloat(item.change_percentage.replace('%', '')),
            volume: parseInt(item.volume)
        }));
    }

    if (apiData.top_losers) {
        normalizedData.topLosers = apiData.top_losers.map(item => ({
            ticker: item.ticker,
            price: parseFloat(item.price),
            changeAmount: parseFloat(item.change_amount),
            changePercentage: parseFloat(item.change_percentage.replace('%', '')),
            volume: parseInt(item.volume)
        }));
    }

    if (apiData.most_actively_traded) {
        normalizedData.mostActivelyTraded = apiData.most_actively_traded.map(item => ({
            ticker: item.ticker,
            price: parseFloat(item.price),
            changeAmount: parseFloat(item.change_amount),
            changePercentage: parseFloat(item.change_percentage.replace('%', '')),
            volume: parseInt(item.volume)
        }));
    }
    return normalizedData;
};

module.exports = {
    fetchDailyStockData,
    fetchSectorPerformanceData,
    fetchMarketMoversData
};