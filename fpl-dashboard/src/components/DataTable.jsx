import React, { useState } from 'react';

const DataTable = ({ data }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'xG', direction: 'desc' });

    if (!data || data.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#666' }}>No data available for the selected filters.</p>
            </div>
        );
    }

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (sortConfig.direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    const SortableHeader = ({ column, label }) => (
        <th
            onClick={() => handleSort(column)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
        >
            {label} {sortConfig.key === column && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </th>
    );

    return (
        <div className="card">
            <h2 className="card-title">Player Statistics</h2>
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Team</th>
                            <th>Pos</th>
                            <SortableHeader column="xG" label="xG" />
                            <SortableHeader column="xA" label="xA" />
                            <SortableHeader column="goals" label="Goals" />
                            <SortableHeader column="assists" label="Assists" />
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, index) => (
                            <tr key={index}>
                                <td style={{ fontWeight: 600 }}>{row.name}</td>
                                <td>{row.team}</td>
                                <td>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        backgroundColor:
                                            row.position === 'FWD' ? '#e90052' :
                                                row.position === 'MID' ? '#00a0e9' :
                                                    row.position === 'DEF' ? '#00ff87' :
                                                        '#6c757d',
                                        color:
                                            row.position === 'DEF' ? '#37003c' :
                                                'white',
                                        fontWeight: 'bold'
                                    }}>
                                        {row.position}
                                    </span>
                                </td>
                                <td className="stat-cell">{row.xG.toFixed(2)}</td>
                                <td className="stat-cell">{row.xA.toFixed(2)}</td>
                                <td className="stat-cell highlight">{row.goals}</td>
                                <td className="stat-cell highlight">{row.assists}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
