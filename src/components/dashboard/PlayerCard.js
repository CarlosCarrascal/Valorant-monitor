import { motion } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';
import { ROLE_COLORS } from '@/lib/constants';

export default function PlayerCard({ player, index }) {
    const roleColor = ROLE_COLORS[player.role] || '#fff';
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            layoutId={player.name}
            className="group relative tech-panel overflow-hidden hover:border-white/30 transition-all duration-300"
        >
            <div className="h-1 w-full" style={{ backgroundColor: roleColor }}></div>
            
            <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-500 mb-1">ROLE_SELECT</span>
                        <span className="text-xs px-2 py-1 rounded-sm font-bold uppercase text-black" 
                              style={{ backgroundColor: roleColor }}>
                            {player.isSixth ? 'Sixth Man' : player.role}
                        </span>
                    </div>
                    <span className="text-4xl font-black text-white/5 absolute right-4 top-4">
                        0{index + 1}
                    </span>
                </div>

                <h3 className="text-2xl font-black tracking-tight text-white mb-1 truncate">
                    {player.name}
                </h3>
                
                <div className="flex items-end gap-2 mb-6">
                    <div className="text-sm font-mono text-slate-400">
                        <span className="text-white font-bold">{player.votes}</span> VOTOS
                    </div>
                    <div className="h-4 w-[1px] bg-white/20 mb-1"></div>
                    <div className="text-xs font-mono text-[#00d4aa]">
                        {player.dominance}% SHARE
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    {player.clipUrl ? (
                        <button onClick={() => window.open(player.clipUrl, '_blank')} 
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-[#ff4655] transition-colors group/btn">
                            <div className="p-1.5 bg-white/5 rounded-full group-hover/btn:bg-[#ff4655] group-hover/btn:text-white transition-all">
                                <Play size={10} fill="currentColor" />
                            </div>
                            Watch Clip
                        </button>
                    ) : (
                        <span className="text-[10px] text-slate-600 font-mono uppercase">No Media Data</span>
                    )}
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl"></div>
        </motion.div>
    );
}