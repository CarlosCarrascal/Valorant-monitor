import { motion } from 'framer-motion';
import { Play, ChevronRight, Activity } from 'lucide-react';

const ROLE_COLORS = {
    Duelist: '#fca5a5',
    Initiator: '#86efac',
    Sentinel: '#93c5fd',
    Controller: '#fcd34d',
    Smoker: '#fcd34d',
    Flex: '#d8b4fe',
    Sixth: '#ffffff',
    'Sixth Man': '#ffffff'
};

export default function PlayerCard({ player, index }) {
    const realRoleName = player.originalRole || player.role || 'AGENT';
    const isSixthMan = index === 5;
    const displayLabel = isSixthMan ? 'Sixth Man' : realRoleName;
    const colorKey = isSixthMan ? 'Sixth' : realRoleName;
    const roleColor = ROLE_COLORS[colorKey] || ROLE_COLORS[displayLabel] || '#fff';
    const voteCount = player.votes || 0;
    const dominance = player.dominance || 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            layoutId={player.name}
            className="group relative flex flex-col justify-between h-full min-h-[200px] rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
        >
            <div className="p-6 relative z-10 flex flex-col h-full justify-between">

                {/* HEADER */}
                <div>
                    <div className="flex justify-between items-start mb-2">
                        {/* IZQUIERDA: Rol */}
                        <div className="flex flex-col gap-1 pt-1">
                            <span
                                className="text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase text-black tracking-widest w-fit"
                                style={{ backgroundColor: roleColor }}
                            >
                                {displayLabel}
                            </span>
                        </div>

                        {/* DERECHA: GHOST STATS */}
                        <div className="flex flex-col items-end select-none">
                            <span className="text-3xl font-black text-white/10 tracking-tighter leading-none group-hover:text-white/20 transition-colors">
                                {dominance}%
                            </span>
                            <span className="text-[9px] font-bold text-white/10 tracking-[0.3em] uppercase leading-none mt-1 mr-0.5 group-hover:text-white/20 transition-colors">
                                Share
                            </span>
                        </div>
                    </div>

                    {/* NOMBRE DEL JUGADOR */}
                    <h3 className="text-2xl font-black tracking-tight text-white mb-2 truncate max-w-[12ch]">
                        {player.name}
                    </h3>

                    {/* INFO DE VOTOS */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="text-xs font-mono text-slate-500 group-hover:text-slate-400 transition-colors">
                            <span className="text-white/40 font-bold group-hover:text-white transition-colors">{voteCount}</span> TOTAL VOTES
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                    {player.clip_url ? (
                        <button
                            onClick={() => window.open(player.clip_url, '_blank')}
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-[#ff4655] transition-colors group/btn"
                        >
                            <div className="p-1.5 bg-white/5 rounded-full group-hover/btn:bg-[#ff4655] group-hover/btn:text-white transition-all">
                                <Play size={10} fill="currentColor" />
                            </div>
                            Watch Clip
                        </button>
                    ) : (
                        <span className="flex items-center gap-2 text-[10px] text-slate-700 font-mono uppercase">
                            <Activity size={12} /> No Media Data
                        </span>
                    )}

                    <ChevronRight size={16} className="text-slate-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
            </div>

            {/* Decoración de fondo */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        </motion.div>
    );
}