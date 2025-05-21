// src/components/PieChartCard.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0088', '#8A2BE2', '#40E0D0', '#FFA500', '#DAA520'];

const PieChartCard = ({ data, title, dataKey, nameKey }) => {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>No data available for {title} chart.</div>;
    }

    // Filter out sectors with 0 or NaN performance to avoid charting issues
    const filteredData = data.filter(item => item[dataKey] && !isNaN(item[dataKey]) && item[dataKey] !== 0);

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
                <PieChart>
                    <Pie
                        data={filteredData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey={dataKey}
                        nameKey={nameKey}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {filteredData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartCard;