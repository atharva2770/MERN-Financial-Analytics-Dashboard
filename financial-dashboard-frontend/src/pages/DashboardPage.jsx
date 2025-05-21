// src/pages/DashboardPage.jsx
import React, { useState, useCallback, useMemo } from 'react';
import useFetchData from '../hooks/useFetchData';
import { getDailyStockData, getSectorPerformance, getMarketMovers, getStockScore } from '../services/api';

// Import our components
import LineChartCard from '../components/LineChartCard';
import PieChartCard from '../components/PieChartCard';
import BarChartCard from '../components/BarChartCard';
import TableComponent from '../components/TableComponent';
import HeatmapCard from '../components/HeatmapCard'; // Import the new HeatmapCard

// Import react-select for dropdowns
import Select from 'react-select';
import { format } from 'date-fns';

// Define default options for symbols and time ranges
const stockSymbols = [
    { value: 'IBM', label: 'IBM' },
    { value: 'AAPL', label: 'Apple Inc.' },
    { value: 'MSFT', label: 'Microsoft Corp.' },
    { value: 'GOOGL', label: 'Alphabet Inc.' },
    { value: 'AMZN', label: 'Amazon.com Inc.' },
    { value: 'TSLA', label: 'Tesla Inc.' },
    // Add more symbols as needed for testing
];

const timeRangeOptions = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: 'ALL', label: 'All Time' },
];

const DashboardPage = () => {
    // State for user selections
    const [selectedSymbol, setSelectedSymbol] = useState(stockSymbols[0]); // Default to IBM
    const [selectedTimeRange, setSelectedTimeRange] = useState(timeRangeOptions[3]); // Default to 1 Year

    // Memoize fetch functions based on selectedSymbol
    const fetchDailyDataFn = useCallback(
        () => getDailyStockData(selectedSymbol.value),
        [selectedSymbol.value]
    );
    const fetchStockScoreFn = useCallback(
        () => getStockScore(selectedSymbol.value),
        [selectedSymbol.value]
    );

    // Filter daily data based on selected time range
    const filterDailyDataByTimeRange = useCallback((data, range) => {
        if (!data || data.length === 0) return [];
        const now = new Date();
        let startDate;

        switch (range) {
            case '1M':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case '3M':
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case '6M':
                startDate = new Date(now.setMonth(now.getMonth() - 6));
                break;
            case '1Y':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            case 'ALL':
            default:
                return data; // No filtering needed for 'All Time'
        }

        // Data is sorted ascending by date (oldest first) by our backend's normalizeDailyTimeSeries
        return data.filter(item => new Date(item.date) >= startDate);
    }, []);

    // Fetching data using useFetchData hook
    const { data: rawIbmDailyData, loading: ibmLoading, error: ibmError } = useFetchData(
        fetchDailyDataFn,
        [selectedSymbol.value]
    );

    // Apply time range filter to raw data
    const ibmDailyData = useMemo(() => {
        return filterDailyDataByTimeRange(rawIbmDailyData, selectedTimeRange.value);
    }, [rawIbmDailyData, selectedTimeRange.value, filterDailyDataByTimeRange]);


    const { data: sectorData, loading: sectorLoading, error: sectorError } = useFetchData(
        getSectorPerformance,
        []
    );

    const { data: moversData, loading: moversLoading, error: moversError } = useFetchData(
        getMarketMovers,
        []
    );

    const { data: ibmScore, loading: scoreLoading, error: scoreError } = useFetchData(
        fetchStockScoreFn,
        [selectedSymbol.value]
    );

    // Define columns for the Most Actively Traded table
    const mostActiveColumns = useMemo(() => [
        { header: 'Ticker', accessor: 'ticker' },
        { header: 'Price', accessor: 'price', formatter: (val) => `$${val.toFixed(2)}` },
        { header: 'Change', accessor: 'changeAmount', formatter: (val) => `${val > 0 ? '+' : ''}${val.toFixed(2)}` },
        { header: '% Change', accessor: 'changePercentage', formatter: (val) => `${val.toFixed(2)}%` },
        { header: 'Volume', accessor: 'volume', formatter: (val) => val.toLocaleString() },
    ], []);

    // Define columns for the Selected Stock Details table
    const selectedStockDetailColumns = useMemo(() => [
        { header: 'Date', accessor: 'date', formatter: (val) => format(new Date(val), 'MMM dd, yyyy') },
        { header: 'Open', accessor: 'open', formatter: (val) => `$${val.toFixed(2)}` },
        { header: 'High', accessor: 'high', formatter: (val) => `$${val.toFixed(2)}` },
        { header: 'Low', accessor: 'low', formatter: (val) => `$${val.toFixed(2)}` },
        { header: 'Close', accessor: 'close', formatter: (val) => `$${val.toFixed(2)}` },
        { header: 'Volume', accessor: 'volume', formatter: (val) => val.toLocaleString() },
    ], []);


    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Financial Analytics Dashboard</h1>
            <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666' }}>Real-time insights for better decisions.</p>
            <hr style={{ margin: '30px 0' }} />

            {/* Controls Section: Symbol Selector and Time Range Filter */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ width: '250px' }}>
                    <label htmlFor="stock-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Stock:</label>
                    <Select
                        id="stock-select"
                        options={stockSymbols}
                        value={selectedSymbol}
                        onChange={setSelectedSymbol}
                        isSearchable
                        placeholder="Search for a stock..."
                    />
                </div>
                <div style={{ width: '200px' }}>
                    <label htmlFor="time-range-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time Range:</label>
                    <Select
                        id="time-range-select"
                        options={timeRangeOptions}
                        value={selectedTimeRange}
                        onChange={setSelectedTimeRange}
                        isSearchable={false}
                    />
                </div>
            </div>
            <hr style={{ margin: '30px 0' }} />

            {/* Daily Stock Data for Selected Symbol (Line Chart) */}
            <h3>{selectedSymbol.label} Daily Stock Price Trend ({selectedTimeRange.label})</h3>
            {ibmLoading && <p>Loading {selectedSymbol.label} daily stock data...</p>}
            {ibmError && <p style={{ color: 'red' }}>Error loading {selectedSymbol.label} daily data: {ibmError.message}</p>}
            {!ibmLoading && !ibmError && ibmDailyData && Array.isArray(ibmDailyData) && ibmDailyData.length > 0 ? (
                <LineChartCard
                    data={ibmDailyData}
                    title={`${selectedSymbol.label} Daily Stock Price Trend`}
                    dataKey="close"
                    tooltipLabel="Close Price"
                />
            ) : (
                !ibmLoading && !ibmError && <p>No daily data available for {selectedSymbol.label} to display chart.</p>
            )}
            <hr />

            {/* Sector Performance (Pie Chart) */}
            <h3>Sector Performance (Realtime)</h3>
            {sectorLoading && <p>Loading sector performance data...</p>}
            {sectorError && <p style={{ color: 'red' }}>Error loading sector data: {sectorError.message}</p>}
            {!sectorLoading && !sectorError && sectorData && Array.isArray(sectorData) && sectorData.length > 0 ? (
                <PieChartCard
                    data={sectorData}
                    title="Sector Realtime Performance Distribution"
                    dataKey="performance"
                    nameKey="sector"
                />
            ) : (
                !sectorLoading && !sectorError && <p>No sector performance data available to display chart.</p>
            )}
            <hr />

            {/* Market Movers (Bar Charts) */}
            <h3>Market Movers</h3>
            {moversLoading && <p>Loading market movers...</p>}
            {moversError && <p style={{ color: 'red' }}>Error loading market movers: {moversError.message}</p>}
            {!moversLoading && !moversError && moversData ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {moversData.topGainers && Array.isArray(moversData.topGainers) && moversData.topGainers.length > 0 ? (
                        <BarChartCard
                            data={moversData.topGainers.slice(0, 10)} // Show top 10 gainers
                            title="Top 10 Gainers (%)"
                            barKey="changePercentage"
                            nameKey="ticker"
                            barColor="#4CAF50" // Green for gainers
                        />
                    ) : (
                        <p>No top gainers data available to display chart.</p>
                    )}

                    {moversData.topLosers && Array.isArray(moversData.topLosers) && moversData.topLosers.length > 0 ? (
                        <BarChartCard
                            data={moversData.topLosers.slice(0, 10)} // Show top 10 losers
                            title="Top 10 Losers (%)"
                            barKey="changePercentage"
                            nameKey="ticker"
                            barColor="#F44336" // Red for losers
                        />
                    ) : (
                        <p>No top losers data available to display chart.</p>
                    )}
                </div>
            ) : (
                !moversLoading && !moversError && <p>No market movers data available to display charts.</p>
            )}
            <hr />

            {/* Heatmap for Top Movers */}
            <h3>Market Performance Heatmap (Top/Bottom Movers)</h3>
            {moversLoading && <p>Loading heatmap data...</p>}
            {moversError && <p style={{ color: 'red' }}>Error loading heatmap data: {moversError.message}</p>}
            {!moversLoading && !moversError && moversData ? (
                <HeatmapCard
                    data={moversData} // Pass the entire moversData to the HeatmapCard
                    title="Top/Bottom Market Movers"
                />
            ) : (
                !moversLoading && !moversError && <p>No heatmap data available.</p>
            )}
            <hr />


            {/* Stock Score for Selected Symbol (Score View) */}
            <h3>{selectedSymbol.label} Stock Score</h3>
            {scoreLoading && <p>Calculating {selectedSymbol.label} score...</p>}
            {scoreError && <p style={{ color: 'red' }}>Error calculating {selectedSymbol.label} score: {scoreError.message}</p>}
            {!scoreLoading && !scoreError && ibmScore && ibmScore.metrics ? (
                <div style={{
                    background: '#e0f7fa',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '150px'
                }}>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#00796b' }}>
                        Composite Score: <span style={{ fontSize: '2em', color: '#004d40' }}>{ibmScore.score}</span>
                    </p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.9em', color: '#333' }}>
                        <p>Volatility: {ibmScore.metrics.volatility}</p>
                        <p>Growth Rate: {ibmScore.metrics.growthRate}</p>
                        <p>Average Volume: {ibmScore.metrics.averageVolume}</p>
                    </div>
                </div>
            ) : (
                !scoreLoading && !scoreError && <p>No stock score available for {selectedSymbol.label} (Insufficient data or calculation error).</p>
            )}
            <hr />

            {/* Table View: Most Actively Traded Stocks */}
            {moversLoading && <p>Loading most actively traded data for table...</p>}
            {moversError && <p style={{ color: 'red' }}>Error loading most actively traded data: {moersError.message}</p>}
            {!moversLoading && !moversError && moversData && moversData.mostActivelyTraded && Array.isArray(moversData.mostActivelyTraded) && moversData.mostActivelyTraded.length > 0 ? (
                <TableComponent
                    data={moversData.mostActivelyTraded.slice(0, 15)} // Show top 15 actively traded
                    columns={mostActiveColumns}
                    title="Most Actively Traded Stocks"
                />
            ) : (
                !moversLoading && !moversError && <p>No most actively traded data available for table.</p>
            )}
            <hr />

            {/* Table View: Selected Stock Daily Details (Latest Day) */}
            {ibmLoading && <p>Loading {selectedSymbol.label} details for table...</p>}
            {ibmError && <p style={{ color: 'red' }}>Error loading {selectedSymbol.label} details: {ibmError.message}</p>}
            {!ibmLoading && !ibmError && ibmDailyData && Array.isArray(ibmDailyData) && ibmDailyData.length > 0 ? (
                <TableComponent
                    data={[ibmDailyData[ibmDailyData.length - 1]]} // Show only the latest day's data
                    columns={selectedStockDetailColumns}
                    title={`${selectedSymbol.label} Latest Daily Details`}
                />
            ) : (
                !ibmLoading && !ibmError && <p>No latest daily details available for {selectedSymbol.label}.</p>
            )}

        </div>
    );
};

export default DashboardPage;