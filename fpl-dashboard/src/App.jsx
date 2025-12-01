import React, { useState, useMemo, useEffect } from 'react';
import FilterPane from './components/FilterPane';
import DataTable from './components/DataTable';
import FixtureAnalyzer from './components/FixtureAnalyzer';
import PlayerDetailsModal from './components/PlayerDetailsModal';
import { fetchFPLData, fetchFixtures } from './services/fplService';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [teams, setTeams] = useState([]);
  const [gameweeks, setGameweeks] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedPlayer, setSelectedPlayer] = useState('All');
  const [viewingPlayer, setViewingPlayer] = useState(null);
  const [startGw, setStartGw] = useState(1);
  const [endGw, setEndGw] = useState(38);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { players: fetchedPlayers, stats: fetchedStats, teams: fetchedTeams } = await fetchFPLData();
      const fetchedFixtures = await fetchFixtures();

      setPlayers(fetchedPlayers);
      setStats(fetchedStats);
      setFixtures(fetchedFixtures);
      setTeams(fetchedTeams);

      // Extract unique teams
      // const uniqueTeams = [...new Set(fetchedPlayers.map(p => p.team))].sort();
      // setTeams(uniqueTeams);

      // Extract unique gameweeks
      const uniqueGameweeks = [...new Set(fetchedStats.map(s => s.gameweek))].sort((a, b) => a - b);
      setGameweeks(uniqueGameweeks);

      // Set initial gameweek range
      if (uniqueGameweeks.length > 0) {
        setStartGw(Math.min(...uniqueGameweeks));
        setEndGw(Math.max(...uniqueGameweeks));
      }

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

    // 1. Filter stats by gameweek range
    const filteredStats = stats.filter(s => s.gameweek >= startGw && s.gameweek <= endGw);

    // 2. Aggregate by player
    const playerStatsMap = {};

    filteredStats.forEach(stat => {
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

    // 3. Combine with player info and filter
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
  }, [selectedTeam, selectedPlayer, startGw, endGw, players, stats, loading]);

  return (
    <div className="app">
      <header className="header">
        <div className="container header-content">
          <div className="logo">FPL Analysis</div>
          <nav className="nav-links">
            <button
              className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`nav-btn ${currentPage === 'fixtures' ? 'active' : ''}`}
              onClick={() => setCurrentPage('fixtures')}
            >
              Fixture Analyzer
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#37003c' }}>Loading data from Supabase...</div>
          </div>
        ) : currentPage === 'dashboard' ? (
          <div className="dashboard-grid">
            <aside>
              <FilterPane
                teams={teams.map(t => t.name)}
                selectedTeam={selectedTeam}
                onTeamChange={setSelectedTeam}
                players={filteredPlayersList}
                selectedPlayer={selectedPlayer}
                onPlayerChange={setSelectedPlayer}
                minGameweek={gameweeks.length > 0 ? Math.min(...gameweeks) : 1}
                maxGameweek={gameweeks.length > 0 ? Math.max(...gameweeks) : 38}
                startGw={startGw}
                endGw={endGw}
                onStartGwChange={setStartGw}
                onEndGwChange={setEndGw}
              />
            </aside>

            <section>
              <DataTable
                data={aggregatedData}
                onRowClick={setViewingPlayer}
              />
            </section>
          </div>
        ) : (
          <FixtureAnalyzer teams={teams} fixtures={fixtures} />
        )}

        {viewingPlayer && (
          <PlayerDetailsModal
            player={viewingPlayer}
            stats={stats}
            fixtures={fixtures}
            onClose={() => setViewingPlayer(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
