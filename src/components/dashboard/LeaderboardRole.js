import { motion } from 'framer-motion';
import { Play, Trophy, Medal } from 'lucide-react';
import { ROLE_COLORS } from '@/lib/constants';

export default function LeaderboardRole({ role, candidates }) {
    const color = ROLE_COLORS[role] || '#fff';
    const totalVotesInRole = candidates.reduce((acc, curr) => acc + curr.votes, 0);
    
    // Separamos al Top 1 del resto
    const winner = candidates[0];
    const rest = candidates.slice(1);

    return (
        <div className="tech-panel rounded-sm flex flex-col overflow-hidden h-full border-t-4" style={{ borderColor: color }}>
            {/* --- HEADER --- */}
            <div className="p-4 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-black text-2xl italic uppercase tracking-tighter text-white">
                        {role}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-1 rounded">
                        {candidates.length} CANDIDATES
                    </span>
                </div>
            </div>

            {/* --- MVP SECTION (TOP 1) --- */}
            {winner && (
                <div className="relative p-6 bg-gradient-to-b from-black/40 to-transparent flex flex-col items-center text-center border-b border-white/10 group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy size={64} color={color} />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="text-[10px] font-mono font-bold text-yellow-500 mb-1 flex items-center justify-center gap-1">
                            <Trophy size={12} /> CURRENT LEADER
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-1">
                            {winner.name}
                        </h2>
                        <div className="flex items-center justify-center gap-3 text-sm font-mono text-slate-400">
                            <span className="text-white font-bold">{winner.votes}</span> VOTES
                            <span className="h-1 w-1 bg-slate-600 rounded-full"></span>
                            <span style={{ color }}>
                                {totalVotesInRole > 0 ? ((winner.votes / totalVotesInRole) * 100).toFixed(0) : 0}% SHARE
                            </span>
                        </div>
                    </div>
                    
                    {/* Barra de progreso MVP */}
                    <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(winner.votes / totalVotesInRole) * 100}%` }}
                            className="h-full"
                            style={{ backgroundColor: color }}
                        />
                    </div>
                </div>
            )}

            {/* --- THE REST (LIST) --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 max-h-[400px]">
                {rest.map((player, idx) => {
                    // Ajustamos el índice porque 'rest' empieza desde el 2do lugar
                    const rank = idx + 2; 
                    const percentage = totalVotesInRole > 0 ? (player.votes / totalVotesInRole) * 100 : 0;
                    
                    return (
                        <div key={player.name} className="relative group p-2 hover:bg-white/5 rounded-sm transition-colors flex items-center gap-3">
                            {/* Rango */}
                            <div className={`font-mono font-bold w-6 text-center text-sm ${rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-700' : 'text-slate-600'}`}>
                                {rank === 2 ? <Medal size={16} className="mx-auto" /> : rank === 3 ? <Medal size={16} className="mx-auto" /> : `#${rank}`}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-bold text-sm text-slate-200 truncate pr-2">
                                        {player.name}
                                    </span>
                                    <span className="font-mono text-xs text-slate-500">
                                        {player.votes}
                                    </span>
                                </div>
                                
                                {/* Mini barra de progreso */}
                                <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full opacity-50" 
                                        style={{ width: `${percentage}%`, backgroundColor: color }}
                                    ></div>
                                </div>
                            </div>

                            {/* Actions */}
                            {player.clipUrl && (
                                <a 
                                    href={player.clipUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-600 hover:text-white hover:bg-white/10 rounded transition-all"
                                >
                                    <Play size={12} />
                                </a>
                            )}
                        </div>
                    );
                })}

                {rest.length === 0 && (
                    <div className="p-4 text-center text-xs font-mono text-slate-600">
                        NO MORE CANDIDATES
                    </div>
                )}
            </div>
        </div>
    );
}