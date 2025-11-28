import React from 'react';

const FilterPane = ({
    teams,
    selectedTeam,
    onTeamChange,
    players,
    selectedPlayer,
    onPlayerChange,
    minGameweek,
    maxGameweek,
    startGw,
    endGw,
    onStartGwChange,
    onEndGwChange
}) => {
    return (
        <div className="card">
            <h2 className="card-title">Filters</h2>

            <div className="form-group">
                <label className="label">Team</label>
                <select
                    className="select"
                    value={selectedTeam}
                    onChange={(e) => onTeamChange(e.target.value)}
                >
                    <option value="All">All Teams</option>
                    {teams.map(team => (
                        <option key={team} value={team}>{team}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="label">Player</label>
                <select
                    className="select"
                    value={selectedPlayer}
                    onChange={(e) => onPlayerChange(e.target.value)}
                    disabled={players.length === 0}
                >
                    <option value="All">All Players</option>
                    {players.map(player => (
                        <option key={player.id} value={player.id}>{player.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="label">Gameweek Range</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '0.25rem' }}>From</label>
                        <input
                            type="number"
                            min={minGameweek}
                            max={maxGameweek}
                            className="select"
                            value={startGw}
                            onChange={(e) => onStartGwChange(Number(e.target.value))}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '0.25rem' }}>To</label>
                        <input
                            type="number"
                            min={minGameweek}
                            max={maxGameweek}
                            className="select"
                            value={endGw}
                            onChange={(e) => onEndGwChange(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="range-labels" style={{ marginTop: '0.5rem' }}>
                    <span>GW {startGw}</span>
                    <span>GW {endGw}</span>
                </div>
            </div>
        </div>
    );
};

export default FilterPane;
