// src/components/HeatmapCard.jsx
import React from 'react';

const getColorForChange = (changePercentage) => {
    // Define color scale: Green for positive, Red for negative
    // Normalize percentage to a 0-1 scale for color intensity
    const normalizedChange = Math.min(1, Math.abs(changePercentage) / 5); // Assuming max change of 5% for intensity
    const intensity = Math.round(normalizedChange * 255); // Scale to 0-255 RGB value

    if (changePercentage > 0) {
        return `rgb(${255 - intensity}, 255, ${255 - intensity})`; // Lighter green for smaller changes, darker for larger
    } else if (changePercentage < 0) {
        return `rgb(255, ${255 - intensity}, ${255 - intensity})`; // Lighter red for smaller changes, darker for larger
    } else {
        return '#f0f0f0'; // Gray for no change
    }
};

const HeatmapCard = ({ data, title }) => {
    // Combine top gainers and top losers for the heatmap
    // Prioritize gainers then losers, ensuring unique tickers
    const combinedData = [];
    const seenTickers = new Set();

    if (data && data.topGainers) {
        data.topGainers.forEach(item => {
            if (!seenTickers.has(item.ticker)) {
                combinedData.push(item);
                seenTickers.add(item.ticker);
            }
        });
    }

    if (data && data.topLosers) {
        data.topLosers.forEach(item => {
            if (!seenTickers.has(item.ticker)) {
                combinedData.push(item);
                seenTickers.add(item.ticker);
            }
        });
    }

    // Sort by absolute change percentage to put most significant movers first
    combinedData.sort((a, b) => Math.abs(b.changePercentage) - Math.abs(a.changePercentage));

    if (combinedData.length === 0) {
        return (
            <div style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                textAlign: 'center',
                color: '#555',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                No data available for {title || "this heatmap"}.
            </div>
        );
    }

    return (
        <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
        }}>
            {title && <h4 style={{ marginBottom: '15px' }}>{title}</h4>}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', // Responsive grid
                gap: '10px'
            }}>
                {combinedData.slice(0, 50).map(item => ( // Limit to top 50 movers
                    <div
                        key={item.ticker}
                        style={{
                            backgroundColor: getColorForChange(item.changePercentage),
                            padding: '10px',
                            borderRadius: '5px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: '#333',
                            fontSize: '0.9em',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div>{item.ticker}</div>
                        <div style={{ fontSize: '0.8em', color: item.changePercentage > 0 ? '#1a751a' : '#cc0000' }}>
                            {item.changePercentage.toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeatmapCard;