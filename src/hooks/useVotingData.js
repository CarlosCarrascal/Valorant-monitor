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

    // Referencia para evitar bucles infinitos en el fetch
    const isFetching = useRef(false);

    const fetchData = useCallback(async (isAutoRefresh = false) => {
        if (isFetching.current) return;
        isFetching.current = true;

        // Solo mostramos loading la primera vez, no en los refrescos automáticos
        if (!isAutoRefresh) setData(prev => ({ ...prev, loading: true }));
        
        try {
            // Usamos Promise.allSettled para que si una falla, no rompa todo
            const [votesRes, sessionRes, playersRes] = await Promise.allSettled([
                fetch('/api/votes'),
                fetch('/api/session'),
                fetch('/api/players')
            ]);

            // Función helper para sacar datos seguros
            const getJson = async (res) => (res.status === 'fulfilled' && res.value.ok) ? await res.value.json() : null;

            const votesData = await getJson(votesRes);
            const sessionData = await getJson(sessionRes);
            // Si players falla, usamos lo que ya teníamos o array vacío
            const playersData = await getJson(playersRes); 
            
            const rawVotes = votesData?.votes || [];
            const players = playersData?.players || data.playersList || []; // Fallback seguro

            // --- PROCESAMIENTO (Igual que antes) ---
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
                teamSelection.forEach(key => {
                    if (key.includes('|')) playerVoteCounts[key] = (playerVoteCounts[key] || 0) + 1;
                });
                return {
                    id: vote.id,
                    username: vote.username,
                    avatar: vote.avatar || null,
                    team: teamSelection,
                    timestamp: vote.voted_at
                };
            });

            // Leaderboard
            const roles = ['Duelist', 'Smoker', 'Sentinel', 'Initiator', 'Flex'];
            const leaderboard = {};
            roles.forEach(role => {
                const playersInRole = players.filter(p => p.role === role).map(p => {
                    const key = `${p.name}|${role}`;
                    const votes = playerVoteCounts[key] || 0;
                    return { ...p, votes, key };
                });
                leaderboard[role] = playersInRole.sort((a, b) => b.votes - a.votes);
            });

            setData(prev => ({
                ...prev,
                votesMap: playerVoteCounts,
                rawVotesCount: rawVotes.length,
                playersList: players,
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

    // 1. Fetch Inicial
    useEffect(() => { fetchData(); }, [fetchData]);

    // 2. AUTO-REFRESH (Polling cada 5 segundos)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchData(true); // true = silencioso (sin spinner)
        }, 5000); // 5000ms = 5 segundos
        return () => clearInterval(interval);
    }, [fetchData]);

    // 3. Cálculo de Equipo (Se mantiene reactivo)
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

    return data; // Ya no devolvemos 'refresh' porque es automático
}