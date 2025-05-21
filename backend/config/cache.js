// config/cache.js
const cache = new Map();

// Define different cache durations based on data type
const CACHE_DURATION_MS = {
    DAILY_STOCK: 5 * 60 * 1000,         // 5 minutes for daily stock data
    SECTOR_PERFORMANCE: 60 * 60 * 1000, // 1 hour for sector performance
    TOP_LISTS: 15 * 60 * 1000           // 15 minutes for top gainers/losers
};

/**
 * Retrieves data from cache if available and not expired.
 * @param {string} key - The unique key for the cached data.
 * @param {string} durationKey - The key from CACHE_DURATION_MS to determine expiry.
 * @returns {any | null} Cached data if valid, otherwise null.
 */
const getCachedData = (key, durationKey) => {
    if (!CACHE_DURATION_MS[durationKey]) {
        console.warn(`Invalid durationKey: ${durationKey}. Using default CACHE_DURATION_MS.DAILY_STOCK.`);
        durationKey = 'DAILY_STOCK'; // Fallback to a default
    }

    if (cache.has(key)) {
        const { data, timestamp } = cache.get(key);
        if (Date.now() - timestamp < CACHE_DURATION_MS[durationKey]) {
            console.log(`Cache hit for ${key}`);
            return data;
        } else {
            console.log(`Cache expired for ${key}`);
            cache.delete(key); // Invalidate expired cache
        }
    }
    console.log(`Cache miss for ${key}`);
    return null;
};

/**
 * Stores data in the cache with a timestamp.
 * @param {string} key - The unique key for the data.
 * @param {any} data - The data to cache.
 */
const setCacheData = (key, data) => {
    cache.set(key, { data, timestamp: Date.now() });
    console.log(`Data cached for ${key}`);
};

module.exports = {
    getCachedData,
    setCacheData
};