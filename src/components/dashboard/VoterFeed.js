import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { ROLE_COLORS } from '@/lib/constants';

const ROW_HEIGHT = 52;

// Prioridad de Roles
const ROLE_PRIORITY = {
    'Duelist': 1,
    'Initiator': 2,
    'Sentinel': 3,
    'Controller': 4,
    'Smoker': 4,
    'Flex': 5,
    'Sixth': 6
};

// --- AGENTE MINIMALISTA ---
const AgentMinimal = ({ name, role }) => {
    const color = ROLE_COLORS[role] || '#555';
    
    return (
        <div 
            className="flex flex-col gap-0.5 group/agent cursor-default" // Sin ? en el cursor
            title={role.toUpperCase()} 
        >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover/agent:text-slate-200 transition-colors">
                {name}
            </span>
            {/* Línea sutil (opacity 0.4) */}
            <div 
                className="h-[2px] w-full rounded-full transition-opacity" 
                style={{ backgroundColor: color, opacity: 0.4 }} 
            />
        </div>
    );
};

// --- FILA (Optimized) ---
const VoterRow = React.memo(({ vote, style, index }) => {
    const timeStr = vote.timestamp 
        ? new Date(vote.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : '--:--';

    const sortedTeam = useMemo(() => {
        return [...vote.team].sort((a, b) => {
            const roleA = a.split('|')[1];
            const roleB = b.split('|')[1];
            return (ROLE_PRIORITY[roleA] || 99) - (ROLE_PRIORITY[roleB] || 99);
        });
    }, [vote.team]);

    return (
        <div 
            style={style} 
            className="flex items-center px-6 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
        >
            {/* Usuario */}
            <div className="w-[240px] flex items-center gap-4 border-r border-white/[0.04] pr-4 mr-6 h-full">
                <span className="font-mono text-[9px] text-slate-700">
                    {String(index + 1).padStart(3, '0')}
                </span>
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-white/10">
                    {vote.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                    <span className="text-sm font-medium text-slate-200 truncate group-hover:text-[#ff4655] transition-colors">
                        {vote.username}
                    </span>
                    <span className="text-[9px] font-mono text-slate-600">
                        {timeStr}
                    </span>
                </div>
            </div>

            {/* Squad */}
            <div className="flex-1 flex items-center gap-6 overflow-hidden">
                {sortedTeam.map((pick, i) => {
                    const [name, role] = pick.split('|');
                    return <AgentMinimal key={i} name={name} role={role} />;
                })}
            </div>
        </div>
    );
});
VoterRow.displayName = 'VoterRow';

// --- MAIN FEED ---
export default function VoterFeed({ voters, allCandidates = [] }) {
    const [searchVoter, setSearchVoter] = useState('');
    const [targetPlayer, setTargetPlayer] = useState('');
    const [sortNewest, setSortNewest] = useState(true);
    
    // Estado para la altura dinámica
    const [containerHeight, setContainerHeight] = useState(600);

    const filteredData = useMemo(() => {
        let result = [...voters];
        if (searchVoter) result = result.filter(v => v.username.toLowerCase().includes(searchVoter.toLowerCase()));
        if (targetPlayer) result = result.filter(v => v.team.some(pick => pick.toUpperCase().startsWith(`${targetPlayer.toUpperCase()}|`)));
        result.sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return sortNewest ? dateB - dateA : dateA - dateB;
        });
        return result;
    }, [voters, searchVoter, targetPlayer, sortNewest]);

    const candidateNames = useMemo(() => {
        const names = allCandidates.map(p => p.name);
        return [...new Set(names)].sort((a, b) => a.localeCompare(b));
    }, [allCandidates]);

    const parentRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);
    const totalHeight = filteredData.length * ROW_HEIGHT;

    // SENSOR DE REDIMENSIONAMIENTO (Para que la virtualización no se rompa al cambiar tamaño)
    useEffect(() => {
        if (!parentRef.current) return;
        const resizeObserver = new ResizeObserver(() => {
            if (parentRef.current) {
                setContainerHeight(parentRef.current.clientHeight);
            }
        });
        resizeObserver.observe(parentRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const onScroll = (e) => setScrollTop(e.currentTarget.scrollTop);
    
    // Cálculo virtual basado en la altura REAL actual (containerHeight)
    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2);
    const endIndex = Math.min(
        filteredData.length,
        Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + 2
    );

    const visibleItems = useMemo(() => {
        const items = [];
        for (let i = startIndex; i < endIndex; i++) {
            const vote = filteredData[i];
            items.push(
                <VoterRow 
                    key={vote.id || i}
                    vote={vote} 
                    index={i}
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: `${ROW_HEIGHT}px`,
                        transform: `translateY(${i * ROW_HEIGHT}px)`,
                    }} 
                />
            );
        }
        return items;
    }, [startIndex, endIndex, filteredData, containerHeight]); // Añadimos containerHeight a dependencias

    const clearFilters = () => {
        setSearchVoter('');
        setTargetPlayer('');
    };

    return (
        // CLASE RESPONSIVE:
        // h-[500px]: Altura base para móviles/pantallas pequeñas.
        // lg:h-[calc(100vh-240px)]: En escritorio, ocupa todo el alto disponible menos el header (aprox 240px).
        <div className="flex flex-col font-sans h-[500px] lg:h-[calc(100vh-240px)] transition-all duration-300">
            
            {/* Header */}
            <div className="pb-4 flex flex-col gap-4 border-b border-white/[0.06] mb-2 shrink-0">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white tracking-widest uppercase opacity-80">
                        Incoming Intel
                        <span className="ml-2 text-[10px] text-slate-600 font-mono align-middle">
                            // {filteredData.length} SIGNALS
                        </span>
                    </h3>
                    {(searchVoter || targetPlayer) && (
                        <button onClick={clearFilters} className="text-[10px] uppercase font-bold text-[#f43f5e] hover:text-white transition-colors flex items-center gap-1">
                            <X size={12}/> Reset Feed
                        </button>
                    )}
                </div>

                <div className="flex gap-6 items-center">
                    <div className="relative group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-white transition-colors" size={14} />
                        <input 
                            type="text" 
                            placeholder="FILTER BY USER ID" 
                            value={searchVoter}
                            onChange={(e) => setSearchVoter(e.target.value)}
                            className="bg-transparent border-b border-white/10 py-1 pl-6 pr-4 w-48 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#f43f5e] transition-colors placeholder:text-slate-700"
                        />
                    </div>
                    <div className="relative group flex items-center">
                        <Filter className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-white transition-colors" size={14} />
                        <select 
                            value={targetPlayer}
                            onChange={(e) => setTargetPlayer(e.target.value)}
                            className="bg-transparent border-b border-white/10 py-1 pl-6 pr-8 w-48 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#f43f5e] transition-colors appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-black">ALL AGENTS</option>
                            {candidateNames.map(name => (
                                <option key={name} value={name} className="bg-[#09090b] text-slate-300">{name}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={() => setSortNewest(!sortNewest)}
                        className="ml-auto text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-white transition-colors"
                    >
                        {sortNewest ? 'SORT: NEWEST' : 'SORT: OLDEST'}
                    </button>
                </div>
            </div>

            {/* LISTA (Flexible height) */}
            <div className="flex-1 relative" ref={parentRef} onScroll={onScroll} style={{ overflowY: 'auto' }}>
                <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                    {filteredData.length > 0 ? visibleItems : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <span className="text-xs font-mono tracking-[0.5em] text-white">NO SIGNAL DETECTED</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}