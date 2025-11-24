import React from 'react';

const DataTable = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#666' }}>No data available for the selected filters.</p>
            </div>
        );
    }

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
                            <th>xG</th>
                            <th>xA</th>
                            <th>Goals</th>
                            <th>Assists</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td style={{ fontWeight: 600 }}>{row.name}</td>
                                <td>{row.team}</td>
                                <td>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        backgroundColor: row.position === 'FWD' ? '#e90052' :
                                            row.position === 'MID' ? '#00ff87' :
                                                row.position === 'DEF' ? '#00ff87' : '#e7e7e7',
                                        color: row.position === 'FWD' ? 'white' : '#37003c',
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
