import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Activity, Check } from 'lucide-react';
import { ROLE_COLORS } from '@/lib/constants';

const ROW_HEIGHT = 52;

// --- COMPONENTE: CUSTOM DROPDOWN (INTACTO) ---
const CustomSelect = ({ options, value, onChange, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative flex-1 min-w-[180px] max-w-xs" ref={containerRef}>
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10 ${value || isOpen ? 'text-[#f43f5e]' : 'text-slate-500'}`} size={14} />
            
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left bg-white/5 border rounded-lg py-2 pl-9 pr-10 text-xs font-mono transition-all hover:bg-white/10 
                    ${isOpen ? 'border-[#f43f5e] ring-1 ring-[#f43f5e]/50' : 'border-white/10 text-slate-200'}
                `}
            >
                <span className={`block truncate ${value ? "text-slate-200" : "text-slate-500"}`}>
                    {value || placeholder}
                </span>
                <ChevronDown 
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} 
                    size={14} 
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-[240px] overflow-y-auto py-1 custom-scrollbar-thin">
                        <div 
                            onClick={() => { onChange(""); setIsOpen(false); }}
                            className="px-4 py-2 text-xs font-mono text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer transition-colors border-b border-white/5"
                        >
                            ALL AGENTS
                        </div>
                        {options.map((option) => (
                            <div
                                key={option}
                                onClick={() => { onChange(option); setIsOpen(false); }}
                                className={`px-4 py-2 text-xs font-mono cursor-pointer transition-colors flex items-center justify-between
                                    ${value === option ? 'bg-[#f43f5e]/10 text-[#f43f5e]' : 'text-slate-300 hover:bg-white/10 hover:text-white'}
                                `}
                            >
                                {option}
                                {value === option && <Check size={12} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- AGENTE MINIMALISTA (INTACTO) ---
const AgentMinimal = ({ name, role, isSelected }) => {
    const color = ROLE_COLORS[role] || '#555';
    
    return (
        <div className="flex flex-col gap-0.5 group/agent cursor-default" title={role.toUpperCase()}>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300
                ${isSelected ? 'text-white' : 'text-slate-500 group-hover/agent:text-slate-200'}
            `}>
                {name}
            </span>
            <div 
                className={`h-[2px] w-full rounded-full transition-all duration-300
                    ${isSelected 
                        ? 'opacity-100 shadow-[0_0_8px_currentColor] brightness-125' 
                        : 'opacity-40 group-hover/agent:opacity-100'
                    }
                `} 
                style={{ backgroundColor: color, color: color }} 
            />
        </div>
    );
};

// --- FILA DE LA LISTA (INTACTO) ---
const VoterRow = React.memo(({ vote, style, index, targetPlayer }) => {
    const timeStr = vote.timestamp 
        ? new Date(vote.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : '--:--';

    const ROLE_PRIORITY = { 'Duelist': 1, 'Initiator': 2, 'Sentinel': 3, 'Controller': 4, 'Smoker': 4, 'Flex': 5, 'Sixth': 6 };

    const sortedTeam = useMemo(() => {
        return [...vote.team].sort((a, b) => {
            const roleA = a.split('|')[1];
            const roleB = b.split('|')[1];
            return (ROLE_PRIORITY[roleA] || 99) - (ROLE_PRIORITY[roleB] || 99);
        });
    }, [vote.team]);

    return (
        <div style={style} className="flex items-center px-6 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
            <div className="w-[240px] flex items-center gap-4 border-r border-white/[0.04] pr-4 mr-6 h-full">
                <span className="font-mono text-[9px] text-slate-700">{String(index + 1).padStart(3, '0')}</span>
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-white/10">
                    {vote.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                    <span className="text-sm font-medium text-slate-200 truncate group-hover:text-[#ff4655] transition-colors">
                        {vote.username}
                    </span>
                    <span className="text-[9px] font-mono text-slate-600">{timeStr}</span>
                </div>
            </div>
            <div className="flex-1 flex items-center gap-6 overflow-hidden">
                {sortedTeam.map((pick, i) => {
                    const [name, role] = pick.split('|');
                    const isSelected = targetPlayer && name.toUpperCase() === targetPlayer.toUpperCase();
                    
                    return (
                        <AgentMinimal 
                            key={i} 
                            name={name} 
                            role={role} 
                            isSelected={isSelected} 
                        />
                    );
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
    // Usamos altura base para server-side render, luego se ajusta
    const [containerHeight, setContainerHeight] = useState(600);
    const parentRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);

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

    const totalHeight = filteredData.length * ROW_HEIGHT;

    // Detectar altura real disponible
    useEffect(() => {
        if (!parentRef.current) return;
        
        // Creamos un ResizeObserver para ser precisos
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setContainerHeight(entry.contentRect.height);
            }
        });
        
        resizeObserver.observe(parentRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const onScroll = (e) => setScrollTop(e.currentTarget.scrollTop);
    
    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2);
    const endIndex = Math.min(filteredData.length, Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + 2);

    const visibleItems = useMemo(() => {
        const items = [];
        for (let i = startIndex; i < endIndex; i++) {
            const vote = filteredData[i];
            items.push(
                <VoterRow 
                    key={vote.id || i} 
                    vote={vote} 
                    index={i}
                    targetPlayer={targetPlayer}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${ROW_HEIGHT}px`, transform: `translateY(${i * ROW_HEIGHT}px)` }} 
                />
            );
        }
        return items;
    }, [startIndex, endIndex, filteredData, targetPlayer]);

    const clearFilters = () => { setSearchVoter(''); setTargetPlayer(''); };

    return (
        /* CAMBIO CLAVE 1: Agregado 'overflow-hidden' aquí. 
           Mantiene tus clases originales de altura: h-[500px] lg:h-[calc(100vh-240px)]
        */
        <div className="flex flex-col font-sans h-[500px] lg:h-[calc(100vh-240px)] transition-all duration-300 overflow-hidden">
            
            {/* HEADER INTACTO */}
            <div className="pb-4 flex flex-col gap-4 border-b border-white/[0.06] mb-2 shrink-0">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white tracking-widest uppercase opacity-80">
                        Incoming Intel
                        <span className="ml-2 text-[10px] text-slate-600 font-mono align-middle">// {filteredData.length} SIGNALS</span>
                    </h3>
                    {(searchVoter || targetPlayer) && (
                        <button onClick={clearFilters} className="text-[10px] uppercase font-bold text-[#f43f5e] hover:text-white transition-colors flex items-center gap-1">
                            <X size={12}/> Reset Feed
                        </button>
                    )}
                </div>

                <div className="flex gap-4 items-center flex-wrap z-20">
                    {/* Buscador */}
                    <div className="relative group flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#f43f5e] transition-colors" size={14} />
                        <input 
                            type="text" 
                            placeholder="SEARCH USER ID..." 
                            value={searchVoter}
                            onChange={(e) => setSearchVoter(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 w-full text-xs font-mono text-slate-200 focus:outline-none focus:border-[#f43f5e] focus:bg-white/10 transition-all placeholder:text-slate-600"
                        />
                    </div>

                    {/* Dropdown */}
                    <CustomSelect 
                        options={candidateNames} 
                        value={targetPlayer} 
                        onChange={setTargetPlayer} 
                        placeholder="ALL AGENTS"
                    />

                    {/* Sort */}
                    <button onClick={() => setSortNewest(!sortNewest)} className="ml-auto text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded-lg border border-transparent hover:border-white/10">
                        {sortNewest ? 'SORT: NEWEST' : 'SORT: OLDEST'}
                    </button>
                </div>
            </div>

            {/* --- AREA LISTA --- */}
            {/* CAMBIO CLAVE 2: 
               - Agregado 'min-h-0': Evita que el contenedor flexible empuje al padre si el contenido es grande.
               - Mantenido 'flex-1 relative'.
            */}
            <div className="flex-1 relative min-h-0">
                {filteredData.length > 0 ? (
                    <div 
                        ref={parentRef} 
                        onScroll={onScroll} 
                        /* CAMBIO CLAVE 3:
                           Aseguramos que el div scrolleable tome el 100% de la altura disponible del padre flex-1
                        */
                        style={{ overflowY: 'auto', height: '100%' }} 
                        className="custom-scrollbar-thin"
                    >
                        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                            {visibleItems}
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-40 select-none">
                        <Activity size={48} className="mb-4 text-[#f43f5e] stroke-[1]" />
                        <span className="text-xs font-mono tracking-[0.3em] text-white/60 uppercase">No signal detected</span>
                        <span className="text-[10px] text-slate-600 mt-2 font-mono">Adjust filters to scan again</span>
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                .custom-scrollbar-thin::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar-thin::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}