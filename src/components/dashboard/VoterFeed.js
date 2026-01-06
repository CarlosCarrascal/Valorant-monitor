import { useState, useMemo } from 'react';
import { Search, User, Filter, ArrowUpDown, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLE_COLORS } from '@/lib/constants';

export default function VoterFeed({ voters, allCandidates = [] }) {
    // Filtros
    const [searchVoter, setSearchVoter] = useState('');
    const [targetPlayer, setTargetPlayer] = useState(''); // Filtrar por "Votó por..."
    const [sortNewest, setSortNewest] = useState(true);

    // Lógica de Filtrado y Ordenamiento
    const filteredData = useMemo(() => {
        let result = [...voters];

        // 1. Filtrar por nombre del votante
        if (searchVoter) {
            result = result.filter(v => 
                v.username.toLowerCase().includes(searchVoter.toLowerCase())
            );
        }

        // 2. Filtrar por "Votó por X jugador"
        if (targetPlayer) {
            result = result.filter(v => 
                v.team.some(pick => pick.toUpperCase().startsWith(`${targetPlayer.toUpperCase()}|`))
            );
        }

        // 3. Ordenar por fecha
        result.sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return sortNewest ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [voters, searchVoter, targetPlayer, sortNewest]);

    // Obtener lista única de nombres para el dropdown
    const candidateNames = useMemo(() => {
        return allCandidates
            .map(p => p.name)
            .sort((a, b) => a.localeCompare(b));
    }, [allCandidates]);

    const clearFilters = () => {
        setSearchVoter('');
        setTargetPlayer('');
        setSortNewest(true);
    };

    const hasFilters = searchVoter || targetPlayer;

    return (
        <div className="tech-panel rounded-sm h-[650px] flex flex-col overflow-hidden border-t-4 border-t-slate-600">
            
            {/* --- CONTROL BAR --- */}
            <div className="p-4 border-b border-white/10 bg-black/20 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="tech-label text-slate-300 flex items-center gap-2 text-sm font-bold">
                        <User size={16} className="text-[#ff4655]"/> 
                        INTEL FEED <span className="text-slate-600">// {filteredData.length} RECORDS</span>
                    </h3>
                    
                    {/* Botón Reset */}
                    {hasFilters && (
                        <button 
                            onClick={clearFilters}
                            className="text-[10px] flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors uppercase font-mono"
                        >
                            <X size={12} /> Clear Filters
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Input: Buscar Votante */}
                    <div className="col-span-12 md:col-span-5 relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search voter username..." 
                            value={searchVoter}
                            onChange={(e) => setSearchVoter(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-2 pl-9 pr-4 text-xs font-mono text-white focus:outline-none focus:border-[#ff4655] focus:bg-white/5 transition-all"
                        />
                    </div>

                    {/* Select: Votó por... */}
                    <div className="col-span-12 md:col-span-5 relative group">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={14} />
                        <select 
                            value={targetPlayer}
                            onChange={(e) => setTargetPlayer(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-sm py-2 pl-9 pr-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#ff4655] focus:bg-white/5 appearance-none transition-all cursor-pointer"
                        >
                            <option value="">Filter by: Voted For...</option>
                            {candidateNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/10 pl-2">
                            <span className="text-[10px] text-slate-500">▼</span>
                        </div>
                    </div>

                    {/* Botón: Sort */}
                    <button 
                        onClick={() => setSortNewest(!sortNewest)}
                        className="col-span-12 md:col-span-2 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-xs font-mono text-slate-300 transition-colors"
                    >
                        <ArrowUpDown size={12} />
                        {sortNewest ? 'Newest' : 'Oldest'}
                    </button>
                </div>
            </div>

            {/* --- DATA LIST --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-black/20 to-transparent">
                {filteredData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                        <Search size={32} className="opacity-20" />
                        <p className="font-mono text-xs">NO INTEL FOUND MATCHING CRITERIA</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        <AnimatePresence initial={false}>
                            {filteredData.map((vote) => (
                                <motion.div 
                                    key={vote.id || Math.random()}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                                        {/* User Info */}
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                                {vote.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-200 group-hover:text-[#ff4655] transition-colors">
                                                    {vote.username}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                                                    <Clock size={10} />
                                                    {vote.timestamp ? new Date(vote.timestamp).toLocaleString() : 'Unknown Time'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Team Grid */}
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                        {vote.team.map((pick, i) => {
                                            const [name, role] = pick.split('|');
                                            if (!name) return null;
                                            
                                            // Highlight si coincide con el filtro
                                            const isTarget = targetPlayer && name.toUpperCase() === targetPlayer.toUpperCase();
                                            const roleColor = ROLE_COLORS[role] || '#666';

                                            return (
                                                <div 
                                                    key={i} 
                                                    className={`
                                                        relative overflow-hidden rounded-sm border p-1.5 flex flex-col gap-1
                                                        ${isTarget ? 'bg-[#ff4655]/20 border-[#ff4655]' : 'bg-black/40 border-white/5'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: roleColor }}></div>
                                                        <span className="text-[9px] font-mono text-slate-500 uppercase truncate">
                                                            {role}
                                                        </span>
                                                    </div>
                                                    <span className={`text-xs font-bold truncate ${isTarget ? 'text-white' : 'text-slate-300'}`}>
                                                        {name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}