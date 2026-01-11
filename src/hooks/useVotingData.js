import { useState, useEffect, useCallback, useRef } from 'react';
import { calculatePremierTeam } from '@/lib/calculate-team';

export function useVotingData(composition) {
    const [data, setData] = useState({
        votesMap: {},
        leaderboard: {},
        voters: [],
        rawVotesCount: 0,
        playersList: [],
        session: null,
        team: [],
        loading: true
    });

    const isFetching = useRef(false);

    const fetchData = useCallback(async (isAutoRefresh = false) => {
        if (isFetching.current) return;
        isFetching.current = true;

        if (!isAutoRefresh) setData(prev => ({ ...prev, loading: true }));
        
        try {
            const [votesRes, sessionRes, playersRes] = await Promise.allSettled([
                fetch('/api/votes'),
                fetch('/api/session'),
                fetch('/api/players')
            ]);

            const getJson = async (res) => (res.status === 'fulfilled' && res.value.ok) ? await res.value.json() : null;

            const votesData = await getJson(votesRes);
            const sessionData = await getJson(sessionRes);
            const playersData = await getJson(playersRes); 
            
            const rawVotes = votesData?.votes || [];
            let rawPlayers = playersData?.players || data.playersList || [];

            // --- CORRECCIÓN 1: DEDUPLICACIÓN DE JUGADORES ---
            // Si la API devuelve el mismo nombre dos veces, nos quedamos solo con uno.
            // Esto evita que salgan repetidos en las cards.
            const uniquePlayersMap = new Map();
            rawPlayers.forEach(p => {
                // Normalizamos el nombre (trim) para evitar duplicados por espacios
                const nameKey = p.name.trim().toUpperCase();
                if (!uniquePlayersMap.has(nameKey)) {
                    uniquePlayersMap.set(nameKey, p);
                }
            });
            const players = Array.from(uniquePlayersMap.values());


            // --- PROCESAMIENTO DE VOTOS ---
            const playerVoteCounts = {};
            const votersList = rawVotes.map(vote => {
                let teamSelection = [];
                if (vote.player_names && Array.isArray(vote.player_names)) {
                    teamSelection = vote.player_names;
                } else if (vote.team_hash) {
                    const sep = vote.team_hash.includes('||') ? '||' : '|';
                    const parts = vote.team_hash.split(sep);
                    if (sep === '|') {
                        for (let i = 0; i < parts.length; i += 2) {
                            if (parts[i+1]) teamSelection.push(`${parts[i]}|${parts[i+1]}`);
                        }
                    } else {
                        teamSelection = parts;
                    }
                }
                
                // Contamos los votos individuales
                teamSelection.forEach(key => {
                    if (key.includes('|')) {
                        // key es "Nombre|Rol"
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

            // --- LEADERBOARD ---
            // Incluimos todos los roles, incluido 'Sixth'
            const roles = ['Duelist', 'Smoker', 'Sentinel', 'Initiator', 'Flex', 'Sixth'];
            const leaderboard = {};

            roles.forEach(role => {
                // Usamos la lista depurada 'players'
                const playersInRole = players
                    .map(p => {
                        // Construimos la clave específica para ESTE rol
                        // Si un jugador recibió votos como Duelist, tendrá votos aquí.
                        // Si recibió votos como Sixth, tendrá votos allá.
                        const key = `${p.name}|${role}`;
                        const votes = playerVoteCounts[key] || 0;
                        return { ...p, votes, key };
                    })
                    // FILTRO: Solo incluimos al jugador en esta lista si:
                    // A) Tiene votos para este rol (> 0)
                    // B) O su rol nativo es este (p.role === role)
                    .filter(p => p.votes > 0 || p.role === role)
                    .sort((a, b) => b.votes - a.votes);

                leaderboard[role] = playersInRole;
            });

            setData(prev => ({
                ...prev,
                votesMap: playerVoteCounts,
                rawVotesCount: rawVotes.length,
                playersList: players, // Guardamos la lista limpia
                session: sessionData || prev.session,
                leaderboard,
                voters: votersList,
                loading: false
            }));

        } catch (error) {
            console.error("Error fetching data:", error);
            setData(prev => ({ ...prev, loading: false }));
        } finally {
            isFetching.current = false;
        }
    }, [data.playersList]);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData(true);
        }, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    useEffect(() => {
        if (!data.loading && Object.keys(data.votesMap).length > 0) {
            const calculatedTeam = calculatePremierTeam(data.votesMap, composition);
            const enrichedTeam = calculatedTeam.map(member => {
                const meta = data.playersList.find(p => p.name.toUpperCase() === member.name.toUpperCase()) || {};
                const totalVotesForRole = Object.entries(data.votesMap)
                    .filter(([k]) => k.endsWith(`|${member.role}`))
                    .reduce((acc, [, val]) => acc + val, 0);
                return {
                    ...member,
                    ...meta,
                    dominance: totalVotesForRole > 0 ? Math.round((member.votes / totalVotesForRole) * 100) : 0
                };
            });
            setData(prev => ({ ...prev, team: enrichedTeam }));
        }
    }, [data.votesMap, composition, data.loading, data.playersList]);

    return data;
}