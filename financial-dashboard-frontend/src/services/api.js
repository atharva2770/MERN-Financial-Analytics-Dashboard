// src/services/api.js
import axios from 'axios';

// Get the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create Axios instance with fallback
const apiClient = axios.create({
    baseURL: API_BASE_URL || 'http://localhost:5000/api', // Fallback URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add optional environment check (only in development)
if (import.meta.env.DEV && !API_BASE_URL) {
    console.warn('VITE_API_BASE_URL is not defined - using fallback URL');
}

// Add request interceptor for debugging
apiClient.interceptors.request.use(config => {
    console.log('Requesting:', config.url);
    return config;
});

// Add response interceptor
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
    }
);

// API functions
export const getDailyStockData = async (symbol) => {
    try {
        const response = await apiClient.get(`/stock/daily/${symbol}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching daily stock data for ${symbol}:`, error);
        throw error;
    }
};

export const getSectorPerformance = async () => {
    try {
        const response = await apiClient.get('/sector-performance');
        return response.data;
    } catch (error) {
        console.error('Error fetching sector performance data:', error);
        throw error;
    }
};

export const getMarketMovers = async () => {
    try {
        const response = await apiClient.get('/market-movers');
        return response.data;
    } catch (error) {
        console.error('Error fetching market movers data:', error);
        throw error;
    }
};

export const getStockScore = async (symbol) => {
    try {
        const response = await apiClient.get(`/stock/score/${symbol}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching stock score for ${symbol}:`, error);
        throw error;
    }
};