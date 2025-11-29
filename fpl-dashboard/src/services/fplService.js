import { supabase } from '../supabaseClient';

export const fetchFPLData = async () => {
    try {
        // 1. Fetch Players
        const { data: playersData, error: playersError } = await supabase
            .schema('dbo')
            .from('dim_players')
            .select('*')
            .range(0, 9999);

        if (playersError) {
            console.error('Error fetching players:', playersError);
            return { players: [], stats: [] };
        }

        // 2. Fetch Teams
        const { data: teamsData, error: teamsError } = await supabase
            .schema('dbo')
            .from('dim_teams')
            .select('*')
            .range(0, 9999);

        if (teamsError) {
            console.error('Error fetching teams:', teamsError);
        }

        // 3. Fetch Stats
        const statsData = await fetchStats();

        return processData(playersData, statsData, teamsData || []);

    } catch (error) {
        console.error('Error in fetchFPLData:', error);
        return { players: [], stats: [] };
    }
};

export const fetchFixtures = async () => {
    const { data, error } = await supabase
        .schema('dbo')
        .from('dim_fixtures')
        .select('teamid, opponentteam, gameweek, teamdifficulty, ishome')
        .eq('finished', false)
        .order('gameweek', { ascending: true });

    if (error) {
        console.error('Error fetching fixtures:', error);
        return [];
    }
    return data;
};

const fetchStats = async () => {
    const { data, error } = await supabase
        .schema('dbo')
        .from('fact_stats')
        .select('*')
        .range(0, 9999);

    if (error) throw error;
    return data;
};

const processData = (players, stats, teams) => {
    const teamMap = {};
    teams.forEach(t => {
        teamMap[t.teamkey] = t.teamshortname || t.teamfullname;
    });

    const playerTeamKeyMap = {};
    stats.forEach(s => {
        if (s.teamkey) playerTeamKeyMap[s.playerkey] = s.teamkey;
    });

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

    const formattedStats = stats.map(s => ({
        playerId: s.playerkey,
        gameweek: s.gameweek,
        xG: Number(s.expectedgoals || 0),
        xA: Number(s.expectedassists || 0),
        goals: Number(s.goalsscored || 0),
        assists: Number(s.assists || 0)
    }));

    return {
        players: formattedPlayers,
        players: formattedPlayers,
        stats: formattedStats,
        teams: teams.map(t => ({ id: t.teamkey, name: t.teamshortname || t.teamfullname }))
    };
};
