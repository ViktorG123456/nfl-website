import React, { useState, useMemo } from 'react';

const FixtureAnalyzer = ({ teams, fixtures }) => {
    const [selectedTeam, setSelectedTeam] = useState('All');

    const upcomingFixtures = useMemo(() => {
        if (selectedTeam === 'All') return [];

        const team = teams.find(t => String(t.id) === String(selectedTeam));
        if (!team) return [];

        // Filter fixtures for this team
        // dim_fixtures has teamkey which matches team.id (teamkey)
        const teamFixtures = fixtures.filter(f => String(f.teamkey) === String(team.id));

        // Sort by gameweek (already sorted by API but good to be safe)
        // and take next 3
        return teamFixtures.slice(0, 3);
    }, [selectedTeam, fixtures, teams]);

    return (
        <div className="card">
            <h2 className="card-title">Fixture Analyzer</h2>
            <div className="form-group">
                <label className="label">Select Team</label>
                <select
                    className="select"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                >
                    <option value="All">Select a team...</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTeam !== 'All' && (
                <div className="fixtures-list">
                    <h3>Next 3 Fixtures</h3>
                    {upcomingFixtures.length > 0 ? (
                        <div className="fixtures-grid">
                            {upcomingFixtures.map((fixture, index) => (
                                <div key={index} className="fixture-card" style={{
                                    padding: '1rem',
                                    marginBottom: '1rem',
                                    background: 'white',
                                    borderRadius: '8px',
                                    borderLeft: `5px solid ${fixture.teamdifficulty <= 2 ? '#00ff87' : fixture.teamdifficulty <= 4 ? '#e90052' : '#37003c'}`,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>GW {fixture.gameweek}</span>
                                        <span style={{
                                            background: fixture.ishome ? '#eafff4' : '#fff0f5',
                                            color: fixture.ishome ? '#008f4c' : '#d9004b',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {fixture.ishome ? 'HOME' : 'AWAY'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                        vs {fixture.opponentteam}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                        Difficulty: <span style={{ fontWeight: 'bold' }}>{fixture.teamdifficulty}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                            No upcoming fixtures found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FixtureAnalyzer;
