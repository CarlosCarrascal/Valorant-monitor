import { useState, useEffect, useCallback } from 'react';
import { calculatePremierTeam } from '@/lib/calculate-team';

export function useVotingData(composition) {
    const [data, setData] = useState({
        votesMap: {},       // AHORA: Votos individuales para calcular ganadores
        leaderboard: {},    // Ranking completo por rol
        voters: [],         // Lista de votantes
        rawVotesCount: 0,
        playersList: [],
        session: null,
        team: [],
        loading: true
    });

    const fetchData = useCallback(async () => {
        setData(prev => ({ ...prev, loading: true }));
        try {
            const [votesRes, sessionRes, playersRes] = await Promise.all([
                fetch('/api/votes'),
                fetch('/api/session'),
                fetch('/api/players')
            ]);

            const votesData = await votesRes.json();
            const sessionData = await sessionRes.json();
            const playersData = await playersRes.json(); 
            
            const rawVotes = votesData.votes || [];
            const players = playersData.players || [];

            // --- CORRECCIÓN CLAVE AQUÍ ---
            const playerVoteCounts = {}; // { "SANTIPATICO|Duelist": 150, ... }
            
            const votersList = rawVotes.map(vote => {
                let teamSelection = [];
                
                // 1. Normalizar la selección del equipo
                if (vote.player_names && Array.isArray(vote.player_names)) {
                    teamSelection = vote.player_names;
                } else if (vote.team_hash) {
                    // Soporte para formato nuevo (||) y antiguo (|)
                    const sep = vote.team_hash.includes('||') ? '||' : '|';
                    const parts = vote.team_hash.split(sep);
                    
                    // Si es formato legacy (Nombre|Rol alternados), reconstruir pares
                    if (sep === '|') {
                        for (let i = 0; i < parts.length; i += 2) {
                            if (parts[i+1]) teamSelection.push(`${parts[i]}|${parts[i+1]}`);
                        }
                    } else {
                        teamSelection = parts;
                    }
                }
                
                // 2. Contar votos individuales para el algoritmo de selección
                teamSelection.forEach(key => {
                    // key debe ser "Nombre|Rol"
                    if (key.includes('|')) {
                        playerVoteCounts[key] = (playerVoteCounts[key] || 0) + 1;
                    }
                });

                return {
                    id: vote.id,
                    username: vote.username,
                    avatar: vote.avatar || null,
                    team: teamSelection,
                    timestamp: vote.voted_at
                };
            });

            // 3. Construir Leaderboard
            const roles = ['Duelist', 'Smoker', 'Sentinel', 'Initiator', 'Flex'];
            const leaderboard = {};

            roles.forEach(role => {
                const playersInRole = players.filter(p => p.role === role).map(p => {
                    // Contar votos exactos para este rol
                    const key = `${p.name}|${role}`;
                    // También sumar si el jugador recibió votos en este rol aunque no sea su principal (opcional)
                    const votes = playerVoteCounts[key] || 0;
                    
                    return {
                        ...p,
                        votes,
                        key
                    };
                });
                
                leaderboard[role] = playersInRole.sort((a, b) => b.votes - a.votes);
            });

            setData({
                votesMap: playerVoteCounts, // <--- AQUÍ ESTABA EL ERROR (antes pasábamos hashes)
                rawVotesCount: rawVotes.length,
                playersList: players,
                session: sessionData,
                leaderboard,
                voters: votersList,
                loading: false,
                team: [] // Se calculará en el useEffect
            });

        } catch (error) {
            console.error("Error fetching data:", error);
            setData(prev => ({ ...prev, loading: false }));
        }
    }, []);

    // Calcular "Dream Team" (Equipo Final)
    useEffect(() => {
        if (!data.loading && Object.keys(data.votesMap).length > 0) {
            // Ahora calculatePremierTeam recibe el mapa correcto: { "Jugador|Rol": 50, ... }
            const calculatedTeam = calculatePremierTeam(data.votesMap, composition);
            
            const enrichedTeam = calculatedTeam.map(member => {
                const meta = data.playersList.find(p => p.name.toUpperCase() === member.name.toUpperCase()) || {};
                
                // Recalcular dominancia con los datos correctos
                const totalVotesForRole = Object.entries(data.votesMap)
                    .filter(([k]) => k.endsWith(`|${member.role}`))
                    .reduce((acc, [, val]) => acc + val, 0);

                return {
                    ...member,
                    ...meta,
                    dominance: totalVotesForRole > 0 
                        ? Math.round((member.votes / totalVotesForRole) * 100) 
                        : 0
                };
            });

            setData(prev => ({ ...prev, team: enrichedTeam }));
        }
    }, [data.votesMap, composition, data.loading, data.playersList]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return { ...data, refresh: fetchData };
}