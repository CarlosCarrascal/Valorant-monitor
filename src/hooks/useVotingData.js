import { useState, useEffect, useCallback } from 'react';
import { calculatePremierTeam } from '@/lib/calculate-team';

export function useVotingData(composition) {
    const [data, setData] = useState({
        votesMap: {},
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

            // Procesar Votos
            const processedVotes = {};
            const rawVotes = votesData.votes || [];
            
            rawVotes.forEach(v => {
                const sep = v.team_hash.includes('||') ? '||' : '|';
                const parts = v.team_hash.split(sep);
                
                parts.forEach((k, i) => {
                    // Soporte para formato nuevo y legacy
                    if (k.includes('|')) {
                        processedVotes[k] = (processedVotes[k] || 0) + 1;
                    } else if (i % 2 === 0 && parts[i+1]) {
                        const key = `${k}|${parts[i+1]}`;
                        processedVotes[key] = (processedVotes[key] || 0) + 1;
                    }
                });
            });

            setData({
                votesMap: processedVotes,
                rawVotesCount: rawVotes.length,
                playersList: playersData.players || [],
                session: sessionData,
                loading: false,

                team: [] 
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setData(prev => ({ ...prev, loading: false }));
        }
    }, []);

    // Calcular equipo cuando cambian los votos o la composición
    useEffect(() => {
        if (!data.loading && Object.keys(data.votesMap).length > 0) {
            const calculatedTeam = calculatePremierTeam(data.votesMap, composition);
            
            // (Dominancia, Info extra)
            const enrichedTeam = calculatedTeam.map(member => {
                const meta = data.playersList.find(p => p.name === member.name) || {};
                
                // Calcular % de Dominancia (Share)
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

    // Fetch inicial
    useEffect(() => { fetchData(); }, [fetchData]);

    return { ...data, refresh: fetchData };
}