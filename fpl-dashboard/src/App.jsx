import React, { useState, useMemo, useEffect } from 'react';
import FilterPane from './components/FilterPane';
import DataTable from './components/DataTable';
import { fetchFPLData } from './services/fplService';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [teams, setTeams] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedPlayer, setSelectedPlayer] = useState('All');

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { players: fetchedPlayers, stats: fetchedStats } = await fetchFPLData();

      setPlayers(fetchedPlayers);
      setStats(fetchedStats);

      // Extract unique teams
      const uniqueTeams = [...new Set(fetchedPlayers.map(p => p.team))].sort();
      setTeams(uniqueTeams);

      setLoading(false);
    };

    loadData();
  }, []);

  // Filter players based on selected team
  const filteredPlayersList = useMemo(() => {
    if (selectedTeam === 'All') return players;
    return players.filter(p => p.team === selectedTeam);
  }, [selectedTeam, players]);

  // Reset selected player if team changes
  useEffect(() => {
    if (selectedTeam !== 'All' && selectedPlayer !== 'All') {
      const player = players.find(p => p.id === Number(selectedPlayer)); // Ensure ID types match
      if (player && player.team !== selectedTeam) {
        setSelectedPlayer('All');
      }
    }
  }, [selectedTeam, players]);

  // Aggregate stats based on filters
  const aggregatedData = useMemo(() => {
    if (loading) return [];

    // 1. Aggregate by player (no gameweek filtering)
    const playerStatsMap = {};

    stats.forEach(stat => {
      if (!playerStatsMap[stat.playerId]) {
        playerStatsMap[stat.playerId] = {
          xG: 0,
          xA: 0,
          goals: 0,
          assists: 0
        };
      }
      playerStatsMap[stat.playerId].xG += stat.xG;
      playerStatsMap[stat.playerId].xA += stat.xA;
      playerStatsMap[stat.playerId].goals += stat.goals;
      playerStatsMap[stat.playerId].assists += stat.assists;
    });

    // 2. Combine with player info and filter
    let result = players.map(player => {
      const pStats = playerStatsMap[player.id] || { xG: 0, xA: 0, goals: 0, assists: 0 };
      return {
        ...player,
        ...pStats
      };
    });

    if (selectedTeam !== 'All') {
      result = result.filter(p => p.team === selectedTeam);
    }

    if (selectedPlayer !== 'All') {
      // Handle potential type mismatch (string vs number) for selectedPlayer
      result = result.filter(p => String(p.id) === String(selectedPlayer));
    }

    // Filter out players with 0 stats if desired, or keep them. 
    // For now, we keep them but maybe sort by xG descending
    return result.sort((a, b) => b.xG - a.xG);
  }, [selectedTeam, selectedPlayer, players, stats, loading]);

  return (
    <div className="app">
      <header className="header">
        <div className="container header-content">
          <div className="logo">FPL Analysis</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Season 2024/25</div>
        </div>
      </header>

      <main className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#37003c' }}>Loading data from Supabase...</div>
          </div>
        ) : (
          <div className="dashboard-grid">
            <aside>
              <FilterPane
                teams={teams}
                selectedTeam={selectedTeam}
                onTeamChange={setSelectedTeam}
                players={filteredPlayersList}
                selectedPlayer={selectedPlayer}
                onPlayerChange={setSelectedPlayer}
              />
            </aside>

            <section>
              <DataTable data={aggregatedData} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
