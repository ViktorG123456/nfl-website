import React from 'react';

const PlayerDetailsModal = ({ player, stats, fixtures, onClose }) => {
    if (!player) return null;

    // Filter stats for this player and sort by gameweek
    const playerStats = stats
        .filter(s => String(s.playerId) === String(player.id))
        .sort((a, b) => a.gameweek - b.gameweek);



    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2>{player.name}</h2>
                    <div className="player-badges">
                        <span className="badge team-badge">{player.team}</span>
                        <span className={`badge pos-badge pos-${player.position}`}>{player.position}</span>
                    </div>
                </div>

                <div className="modal-body">
                    <h3>Season Performance</h3>
                    {playerStats.length > 0 ? (
                        <div className="stats-table-container">
                            <table className="stats-table">
                                <thead>
                                    <tr>
                                        <th>GW</th>
                                        <th>Opponent</th>
                                        <th>Pts</th>
                                        <th>xG</th>
                                        <th>xA</th>
                                        <th>G</th>
                                        <th>A</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playerStats.map((stat, index) => (
                                        <tr key={index}>
                                            <td>{stat.gameweek}</td>
                                            <td>{stat.opponent}</td>
                                            <td className="font-bold">{stat.points}</td>
                                            <td>{stat.xG.toFixed(2)}</td>
                                            <td>{stat.xA.toFixed(2)}</td>
                                            <td>{stat.goals}</td>
                                            <td>{stat.assists}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr style={{ fontWeight: 'bold', background: '#f8f9fa', borderTop: '2px solid #dee2e6' }}>
                                        <td colSpan="2" style={{ textAlign: 'right' }}>Total</td>
                                        <td>{playerStats.reduce((sum, s) => sum + s.points, 0)}</td>
                                        <td>{playerStats.reduce((sum, s) => sum + s.xG, 0).toFixed(2)}</td>
                                        <td>{playerStats.reduce((sum, s) => sum + s.xA, 0).toFixed(2)}</td>
                                        <td>{playerStats.reduce((sum, s) => sum + s.goals, 0)}</td>
                                        <td>{playerStats.reduce((sum, s) => sum + s.assists, 0)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <p>No stats available for this player.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerDetailsModal;
