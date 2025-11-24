import { supabase } from '../supabaseClient';

export const fetchFPLData = async () => {
    try {
        // 1. Fetch Players
        const { data: playersData, error: playersError } = await supabase
            .schema('dim')
            .from('players')
            .select('*')
            .range(0, 9999); // Fetch up to 10,000 rows

        if (playersError) {
            console.error('Error fetching players:', playersError);
            return { players: [], stats: [] };
        }

        // 2. Fetch Teams
        const { data: teamsData, error: teamsError } = await supabase
            .schema('dim')
            .from('teams')
            .select('*')
            .range(0, 9999); // Fetch up to 10,000 rows

        if (teamsError) {
            console.error('Error fetching teams:', teamsError);
            // Continue without teams if error, will default to Unknown
        }

        // 3. Fetch Stats
        const statsData = await fetchStats();

        return processData(playersData, statsData, teamsData || []);

    } catch (error) {
        console.error('Error in fetchFPLData:', error);
        return { players: [], stats: [] };
    }
};

const fetchStats = async () => {
    const { data, error } = await supabase
        .schema('fact')
        .from('stats')
        .select('*')
        .range(0, 9999); // Fetch up to 10,000 rows

    if (error) throw error;
    return data;
};

const processData = (players, stats, teams) => {
    // Helper to find team name
    const teamMap = {};
    teams.forEach(t => {
        teamMap[t.teamkey] = t.teamshortname || t.teamfullname;
    });

    // Helper to find team key for a player from stats (since dim.players lacks it)
    const playerTeamKeyMap = {};
    stats.forEach(s => {
        if (s.teamkey) playerTeamKeyMap[s.playerkey] = s.teamkey;
    });

    // Map players
    const formattedPlayers = players.map(p => {
        const teamKey = playerTeamKeyMap[p.playerkey];
        const teamName = teamMap[teamKey] || 'Unknown';

        return {
            id: p.playerkey,
            name: p.fullname,
            team: teamName,
            position: p.position
        };
    });

    // Map stats
    const formattedStats = stats.map(s => ({
        playerId: s.playerkey,
        xG: Number(s.expectedgoals || 0),
        xA: Number(s.expectedassists || 0),
        goals: Number(s.goalsscored || 0),
        assists: Number(s.assists || 0)
    }));

    return {
        players: formattedPlayers,
        stats: formattedStats
    };
};
