export function calculatePremierTeam(playerRoleVotes, composition) {
    const premierTeam = [];
    const usedPlayers = new Set();
    const ROLES = ['Duelist', 'Smoker', 'Sentinel', 'Initiator', 'Flex', 'Sixth'];

    // Identificar ganadores absolutos para evitar duplicados
    const roleWinners = new Set();
    ROLES.forEach(r => {
        const top = Object.entries(playerRoleVotes)
            .filter(([key]) => key.endsWith(`|${r}`))
            .sort(([, a], [, b]) => b - a)[0];
        if (top) roleWinners.add(top[0].split('|')[0]);
    });

    // Procesar según composición
    Object.entries(composition).forEach(([role, count]) => {
        if (count === 0) return;

        if (role === 'Sixth') {

            let secondPlaces = [];
            ROLES.forEach(r => {
                const players = Object.entries(playerRoleVotes)
                    .filter(([key]) => key.endsWith(`|${r}`))
                    .map(([key, v]) => ({ 
                        name: key.split('|')[0], 
                        votes: v, 
                        role: r,           
                        originalRole: r    
                    }))
                    .sort((a, b) => b.votes - a.votes);

                if (players.length > 1 && !roleWinners.has(players[1].name)) {
                    secondPlaces.push(players[1]);
                }
            });

            secondPlaces.sort((a, b) => b.votes - a.votes)
                .slice(0, count)
                .forEach(p => {
                    if (!usedPlayers.has(p.name)) {
                        premierTeam.push({ 
                            ...p, 
                            isSixth: true 
                        });
                        usedPlayers.add(p.name);
                    }
                });
        } else {
            // Lógica Standard (Duelist, Flex, etc.)
            const players = Object.entries(playerRoleVotes)
                .filter(([key]) => key.endsWith(`|${role}`))
                .map(([key, v]) => ({ 
                    name: key.split('|')[0], 
                    votes: v, 
                    role: role,        
                    originalRole: role 
                }))
                .sort((a, b) => b.votes - a.votes);

            players.slice(0, count).forEach(p => {
                if (!usedPlayers.has(p.name)) {
                    premierTeam.push(p);
                    usedPlayers.add(p.name);
                }
            });
        }
    });

    return premierTeam;
}