"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings2, Trophy, RefreshCw } from 'lucide-react';
import { calculatePremierTeam } from '@/lib/calculate-team';
import { ROLES_CONFIG, ROLE_COLORS, PLAYER_METADATA } from '@/lib/constants';

export default function Home() {
    const [rawVotes, setRawVotes] = useState([]);
    const [votes, setVotes] = useState({});
    const [loading, setLoading] = useState(true);
    const [comp, setComp] = useState({ Duelist: 1, Smoker: 1, Sentinel: 1, Initiator: 1, Flex: 1, Sixth: 1 });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/votes');
            const data = await res.json();
            if (data.votes) {
                setRawVotes(data.votes);
                const processed = {};
                data.votes.forEach(v => {
                    const sep = v.team_hash.includes('||') ? '||' : '|';
                    v.team_hash.split(sep).forEach((k, i, arr) => {
                        const key = sep === '||' ? k : (i % 2 === 0 ? `${k}|${arr[i+1]}` : null);
                        if (key) processed[key] = (processed[key] || 0) + 1;
                    });
                });
                setVotes(processed);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const team = calculatePremierTeam(votes, comp);

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter italic">VCT_PREMIER.DASH</h1>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Total Votos: {rawVotes.length}</p>
                </div>
                <button onClick={fetchData} className="p-3 bento-card rounded-xl">
                    <RefreshCw className={loading ? "animate-spin" : ""} size={20} />
                </button>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <aside className="col-span-12 lg:col-span-3 space-y-4">
                    <div className="bento-card p-6 rounded-2xl">
                        <h2 className="text-xs font-bold uppercase text-zinc-500 mb-6 flex items-center gap-2">
                            <Settings2 size={14} /> Ajustar Composición
                        </h2>
                        {Object.keys(comp).map(role => (
                            <div key={role} className="flex justify-between items-center mb-3">
                                <span className="text-xs font-mono text-zinc-400">{role}</span>
                                <input type="number" value={comp[role]} onChange={e => setComp({...comp, [role]: parseInt(e.target.value)||0})} 
                                className="bg-zinc-900 border border-zinc-800 w-12 text-center text-sm rounded py-1"/>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.map((player, i) => (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={i} className="bento-card p-6 rounded-2xl relative group">
                            <div className="flex justify-between mb-4">
                                <span className="text-[10px] font-mono text-zinc-600">POS_{i+1}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase text-white" 
                                style={{ backgroundColor: ROLE_COLORS[player.role] }}>{player.isSixth ? 'Sixth' : player.role}</span>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">{PLAYER_METADATA[player.name]?.name || player.name}</h3>
                            <p className="text-xs text-zinc-500 font-mono mb-6">{player.votes} VOTOS</p>
                            {PLAYER_METADATA[player.name]?.clip && (
                                <button onClick={() => window.open(PLAYER_METADATA[player.name].clip, '_blank')} 
                                className="w-full py-2 bg-zinc-800/50 hover:bg-rose-500/10 border border-zinc-700 hover:border-rose-500/50 rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold uppercase transition-all">
                                    <Play size={12} fill="currentColor" /> Watch Highlight
                                </button>
                            )}
                        </motion.div>
                    ))}
                </main>
            </div>
        </div>
    );
}