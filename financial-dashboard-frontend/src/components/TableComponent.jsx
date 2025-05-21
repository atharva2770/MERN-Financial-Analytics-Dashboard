// src/components/TableComponent.jsx
import React from 'react';

const TableComponent = ({ data, columns, title }) => {
    if (!data || data.length === 0 || !columns || columns.length === 0) {
        return (
            <div style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                textAlign: 'center',
                color: '#555'
            }}>
                No data available for {title || "this table"}.
            </div>
        );
    }

    return (
        <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            overflowX: 'auto' // Ensures table is scrollable on small screens
        }}>
            {title && <h4 style={{ marginBottom: '15px' }}>{title}</h4>}
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left'
            }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        {columns.map((col, index) => (
                            <th key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{ borderBottom: '1px solid #eee' }}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} style={{ padding: '10px' }}>
                                    {col.formatter ? col.formatter(row[col.accessor]) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableComponent;