import React, { useState, useEffect } from 'react';
import { fetchPlayerFutureFixtures } from '../services/fplService';

const PlayerDetailsModal = ({ player, stats, fixtures, onClose }) => {
    const [activeTab, setActiveTab] = useState('performance');
    const [futureFixtures, setFutureFixtures] = useState([]);
    const [loadingFixtures, setLoadingFixtures] = useState(false);

    if (!player) return null;

    // Filter stats for this player and sort by gameweek
    const playerStats = stats
        .filter(s => String(s.playerId) === String(player.id))
        .sort((a, b) => a.gameweek - b.gameweek);

    // Load future fixtures when tab is switched
    useEffect(() => {
        if (activeTab === 'fixtures' && player.teamKey && futureFixtures.length === 0) {
            setLoadingFixtures(true);
            fetchPlayerFutureFixtures(player.teamKey)
                .then(data => {
                    setFutureFixtures(data);
                    setLoadingFixtures(false);
                })
                .catch(err => {
                    console.error('Error loading fixtures:', err);
                    setLoadingFixtures(false);
                });
        }
    }, [activeTab, player.teamKey]);

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

                {/* Tab Navigation */}
                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('performance')}
                    >
                        Season Performance
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'fixtures' ? 'active' : ''}`}
                        onClick={() => setActiveTab('fixtures')}
                    >
                        Future Fixtures
                    </button>
                </div>

                <div className="modal-body">
                    {/* Performance Tab */}
                    {activeTab === 'performance' && (
                        <>
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
                        </>
                    )}

                    {/* Future Fixtures Tab */}
                    {activeTab === 'fixtures' && (
                        <>
                            <h3>Upcoming Fixtures</h3>
                            {loadingFixtures ? (
                                <p>Loading fixtures...</p>
                            ) : futureFixtures.length > 0 ? (
                                <div className="stats-table-container">
                                    <table className="stats-table">
                                        <thead>
                                            <tr>
                                                <th>GW</th>
                                                <th>Opponent</th>
                                                <th>Venue</th>
                                                <th>Difficulty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {futureFixtures.map((fixture, index) => (
                                                <tr key={index}>
                                                    <td>{fixture.gameweek}</td>
                                                    <td>{fixture.opponentteam}</td>
                                                    <td>{fixture.ishome ? 'Home' : 'Away'}</td>
                                                    <td>
                                                        <span className={`difficulty-badge diff-${fixture.teamdifficulty}`}>
                                                            {fixture.teamdifficulty}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No upcoming fixtures available.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerDetailsModal;
