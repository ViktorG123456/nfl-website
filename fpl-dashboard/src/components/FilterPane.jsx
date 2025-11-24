import React from 'react';

const FilterPane = ({
    teams,
    selectedTeam,
    onTeamChange,
    players,
    selectedPlayer,
    onPlayerChange
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
        </div>
    );
};

export default FilterPane;
