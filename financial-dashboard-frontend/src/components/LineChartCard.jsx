// src/components/LineChartCard.jsx
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const LineChartCard = ({ data, title, dataKey, tooltipLabel }) => {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>No data available for {title} chart.</div>;
    }

    // Filter to show a reasonable number of data points, e.g., last 90 days if more are available
    const displayData = data.slice(-90); // Display last 90 days for clarity

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
                <LineChart
                    data={displayData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        reversed={true} // Alpha Vantage data is newest first, so reverse XAxis
                    />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip
                        labelFormatter={(label) => `Date: ${format(new Date(label), 'MMM dd, yyyy')}`}
                        formatter={(value) => [`${value.toFixed(2)}`, tooltipLabel]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey={dataKey} stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartCard;