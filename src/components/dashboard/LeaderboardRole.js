import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- CONFIGURACIÓN DE IMÁGENES Y COLORES ---
const ROLE_AGENTS = {
    Duelist: { id: 'add6443a-41bd-e414-f6ad-e58d267f4e95', bgPos: '120% center', bgSize: '120%' },
    Initiator: { id: '6f2a04ca-43e0-be17-7f36-b3908627744d', bgPos: 'left', bgSize: '140%' },
    Sentinel: { id: '1e58de9c-4950-5125-93e9-a0aee9f98746', bgPos: '1% center', bgSize: '150%' },
    Controller: { id: '8e253930-4c05-31dd-1b6c-968525494517', bgPos: 'center', bgSize: 'cover' },
    Smoker: { id: '707eab51-4836-f488-046a-cda6bf494859', bgPos: 'right', bgSize: '110%' },
    Flex: { id: '601dbbe7-43ce-be57-2a40-4abd24953621', bgPos: 'left', bgSize: '120%' },
    Sixth: { id: '320b2a48-4d9b-a075-30f1-1f93a9b638fa', bgPos: 'center', bgSize: '130%' }
};

const ROLE_COLORS = {
    Duelist: '#fca5a5',
    Initiator: '#519284',
    Sentinel: '#8E843A',
    Controller: '#fcd34d',
    Smoker: '#86efac',
    Flex: '#d8b4fe',
    Sixth: '#94a3b8'
};

// CACHE DE ANIMACIONES
const loadedRoles = new Set();

export default function LeaderboardRole({ role, candidates, voters = [] }) {
    const isAlreadyLoaded = loadedRoles.has(role);
    const [mounted, setMounted] = useState(isAlreadyLoaded);

    useEffect(() => {
        if (!isAlreadyLoaded) {
            const timer = setTimeout(() => {
                setMounted(true);
                loadedRoles.add(role);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [role, isAlreadyLoaded]);

    const color = ROLE_COLORS[role] || '#fff'; 
    const agentConfig = ROLE_AGENTS[role] || ROLE_AGENTS['Flex'];
    const agentUuid = agentConfig.id;
    const bgPosition = agentConfig.bgPos || 'center';
    const bgSize = agentConfig.bgSize || 'cover';

    const agentImage = `https://media.valorant-api.com/agents/${agentUuid}/fullportrait.png`;
    const agentBackground = `https://media.valorant-api.com/agents/${agentUuid}/background.png`;
    
    // CÁLCULO DE VOTOS
    let roleTotalVotes = 0;
    if (voters && voters.length > 0) {
        roleTotalVotes = voters.reduce((count, vote) => {
            const hasRole = vote.team && vote.team.some(pick => pick.endsWith(`|${role}`));
            return count + (hasRole ? 1 : 0);
        }, 0);
    } else {
        roleTotalVotes = candidates.reduce((acc, curr) => acc + (Number(curr.votes) || 0), 0);
    }
    
    const safeTotal = roleTotalVotes > 0 ? roleTotalVotes : 1;
    const topCandidates = candidates.slice(0, 5);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col md:flex-row bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.03] transition-colors h-[320px] md:h-[280px] group relative"
        >
            {/* IZQUIERDA */}
            <div className="relative w-full md:w-80 h-32 md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5 bg-[#0f1923]">
                <div className="absolute inset-0 bg-no-repeat brightness-[0.3] group-hover:brightness-[0.5] transition-all duration-700 z-0" style={{ backgroundImage: `url(${agentBackground})`, backgroundPosition: bgPosition, backgroundSize: bgSize }}></div>
                <div className="absolute inset-0 opacity-10 mix-blend-overlay z-10" style={{ backgroundColor: color }}></div>
                <img src={agentImage} alt={role} className="absolute inset-0 w-full h-full object-cover object-[center_15%] scale-[1.8] translate-y-14 brightness-[0.5] saturate-[0.5] group-hover:brightness-[0.8] group-hover:saturate-[0.8] transition-all duration-700 drop-shadow-2xl z-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/40 to-transparent opacity-90 z-30 pointer-events-none"></div>
                
                <div className="absolute bottom-0 left-0 p-6 w-full z-40">
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-6 rounded-full opacity-100 shadow-sm" style={{ backgroundColor: color }}></span>
                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">{role}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* DERECHA */}
            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center gap-2">
                {topCandidates.length > 0 ? (
                    topCandidates.map((candidate, index) => {
                        const v = Number(candidate.votes) || 0;
                        const rawPercent = (v / safeTotal) * 100;
                        const safePercent = Math.round(rawPercent);
                        const isTop = index === 0;

                        return (
                            <div key={candidate.name} className="flex items-center gap-3 relative h-8 md:h-9">
                                <span className={`text-[10px] font-mono font-bold w-6 text-right transition-colors duration-500 ${isTop ? 'text-[#f87171] group-hover:text-[#ef4444]' : 'text-slate-700'}`}>0{index + 1}</span>
                                <div className="flex-1 h-full bg-white/[0.03] rounded border border-white/5 relative overflow-hidden flex items-center px-3 transition-colors">
                                    <motion.div 
                                        initial={{ width: isAlreadyLoaded ? `${safePercent}%` : 0 }}
                                        animate={{ width: isAlreadyLoaded ? `${safePercent}%` : (mounted ? `${safePercent}%` : 0) }}
                                        transition={{ duration: isAlreadyLoaded ? 0 : 0.4, delay: isAlreadyLoaded ? 0 : index * 0.03, ease: "easeOut" }}
                                        className={`absolute left-0 top-0 bottom-0 h-full transition-all duration-500 ${isTop ? 'bg-[#f87171] group-hover:bg-[#ef4444] opacity-10 group-hover:opacity-25' : 'bg-white opacity-5'}`}
                                    ></motion.div>
                                    
                                    <span className={`relative z-10 text-xs font-bold uppercase tracking-wide truncate ${isTop ? 'text-white' : 'text-slate-400'}`}>{candidate.name}</span>
                                    
                                    {/* --- AQUI ESTÁ EL CAMBIO --- */}
                                    <div className="absolute right-3 top-0 bottom-0 flex items-center gap-2 z-10">
                                        {/* Número de votos */}
                                        <span className={`text-[9px] uppercase tracking-wider font-medium ${isTop ? 'text-white/70' : 'text-slate-500/70'}`}>
                                            {v} Votes
                                        </span>
                                        {/* Separador vertical sutil */}
                                        <div className={`w-px h-2 ${isTop ? 'bg-white/20' : 'bg-slate-700/20'}`}></div>
                                        {/* Porcentaje */}
                                        <span className={`text-xs font-mono font-bold ${isTop ? 'text-white' : 'text-slate-500'}`}>
                                            {safePercent}%
                                        </span>
                                    </div>
                                    {/* --------------------------- */}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center h-full opacity-20">
                        <span className="text-[10px] font-mono uppercase tracking-widest">Scanning Sector...</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}