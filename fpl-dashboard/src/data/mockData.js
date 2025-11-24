export const TEAMS = [
    "Arsenal",
    "Aston Villa",
    "Chelsea",
    "Liverpool",
    "Man City",
    "Man Utd",
    "Newcastle",
    "Spurs"
];

export const PLAYERS = [
    { id: 1, name: "Erling Haaland", team: "Man City", position: "FWD" },
    { id: 2, name: "Mohamed Salah", team: "Liverpool", position: "MID" },
    { id: 3, name: "Bukayo Saka", team: "Arsenal", position: "MID" },
    { id: 4, name: "Ollie Watkins", team: "Aston Villa", position: "FWD" },
    { id: 5, name: "Cole Palmer", team: "Chelsea", position: "MID" },
    { id: 6, name: "Son Heung-min", team: "Spurs", position: "MID" },
    { id: 7, name: "Bruno Fernandes", team: "Man Utd", position: "MID" },
    { id: 8, name: "Alexander Isak", team: "Newcastle", position: "FWD" },
    { id: 9, name: "Kevin De Bruyne", team: "Man City", position: "MID" },
    { id: 10, name: "Trent Alexander-Arnold", team: "Liverpool", position: "DEF" },
    { id: 11, name: "William Saliba", team: "Arsenal", position: "DEF" },
    { id: 12, name: "Emiliano Martínez", team: "Aston Villa", position: "GK" }
];

// Generate stats for 10 gameweeks
export const GAMEWEEK_STATS = [];

PLAYERS.forEach(player => {
    for (let gw = 1; gw <= 10; gw++) {
        // Random stats generation logic
        const isHaaland = player.name === "Erling Haaland";
        const xG = isHaaland ? Math.random() * 1.5 : Math.random() * 0.8;
        const xA = Math.random() * 0.5;
        const goals = Math.random() > (isHaaland ? 0.4 : 0.7) ? Math.floor(Math.random() * 3) : 0;
        const assists = Math.random() > 0.8 ? 1 : 0;

        GAMEWEEK_STATS.push({
            playerId: player.id,
            gameweek: gw,
            xG: parseFloat(xG.toFixed(2)),
            xA: parseFloat(xA.toFixed(2)),
            goals: goals,
            assists: assists
        });
    }
});
