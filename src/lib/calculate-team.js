export function calculatePremierTeam(playerRoleVotes, composition) {
    const premierTeam = [];
    const usedPlayers = new Set();
    const ROLES = ['Duelist', 'Smoker', 'Sentinel', 'Initiator', 'Flex', 'Sixth'];

    // Procesar según composición
    Object.entries(composition).forEach(([role, count]) => {
        if (count === 0) return;
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
    });

    return premierTeam;
}