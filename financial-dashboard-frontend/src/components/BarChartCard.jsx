// src/components/BarChartCard.jsx
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const BarChartCard = ({ data, title, barKey, nameKey, barColor }) => {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>No data available for {title} chart.</div>;
    }

    // Ensure data is in a suitable format for the bar chart
    // For gainers/losers, data should be an array of objects with ticker and changePercentage
    const formattedData = data.map(item => ({
        ...item,
        [barKey]: parseFloat(item[barKey].toFixed(2)) // Ensure percentage is a number
    }));

    return (
        <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
        }}>
            <h4>{title}</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={formattedData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey={nameKey} />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, nameKey]} />
                    <Legend />
                    <Bar dataKey={barKey} fill={barColor} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartCard;