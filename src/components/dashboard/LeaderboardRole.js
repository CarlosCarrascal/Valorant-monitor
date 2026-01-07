import { motion } from 'framer-motion';

// CONFIGURACIÓN MAESTRA DE IMÁGENES
const ROLE_AGENTS = {
    Duelist: { 
        id: 'add6443a-41bd-e414-f6ad-e58d267f4e95', // Jett
        bgPos: '120% center',     
        bgSize: '120%'       
    },
    Initiator: { 
        id: '6f2a04ca-43e0-be17-7f36-b3908627744d', // Skye
        bgPos: 'left',  
        bgSize: '140%'        
    },
    Sentinel: { 
        id: '1e58de9c-4950-5125-93e9-a0aee9f98746', // Cypher
        bgPos: '1% center', 
        bgSize: '150%' 
    },
    Controller: { 
        id: '8e253930-4c05-31dd-1b6c-968525494517', // Viper
        bgPos: 'center', 
        bgSize: 'cover'
    },
    Smoker: { 
        id: '707eab51-4836-f488-046a-cda6bf494859', // Viper
        bgPos: 'right', 
        bgSize: '110%'
    },
    Flex: { 
        id: '601dbbe7-43ce-be57-2a40-4abd24953621', // KAY/O
        bgPos: 'left', 
        bgSize: '120%'       
    }
};

const ROLE_COLORS = {
    Duelist: '#fca5a5',
    Initiator: '#86efac',
    Sentinel: '#93c5fd',
    Controller: '#fcd34d',
    Smoker: '#fcd34d',
    Flex: '#d8b4fe'
};

export default function LeaderboardRole({ role, candidates }) {
    const color = ROLE_COLORS[role] || '#fff';
    
    const agentConfig = ROLE_AGENTS[role] || ROLE_AGENTS['Flex'];
    const agentUuid = agentConfig.id;
    const bgPosition = agentConfig.bgPos || 'center';
    const bgSize = agentConfig.bgSize || 'cover';

    const agentImage = `https://media.valorant-api.com/agents/${agentUuid}/fullportrait.png`;
    const agentBackground = `https://media.valorant-api.com/agents/${agentUuid}/background.png`;
    
    const totalVotes = candidates.reduce((acc, curr) => acc + (curr.votes || 0), 0);
    const topCandidates = candidates.slice(0, 5);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col md:flex-row bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.03] transition-colors h-[320px] md:h-[280px] group relative"
        >
            {/* --- SECCIÓN IZQUIERDA: VISUAL --- */}
            <div className="relative w-full md:w-80 h-32 md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-white/5 bg-[#0f1923]">
                
                {/* 1. FONDO (Layer 0) */}
                <div 
                    className="absolute inset-0 bg-no-repeat brightness-[0.3] group-hover:brightness-[0.5] transition-all duration-700 z-0"
                    style={{ 
                        backgroundImage: `url(${agentBackground})`,
                        backgroundPosition: bgPosition,
                        backgroundSize: bgSize 
                    }}
                ></div>
                
                {/* 2. TINTE (Layer 1) */}
                <div 
                    className="absolute inset-0 opacity-10 mix-blend-overlay z-10"
                    style={{ backgroundColor: color }}
                ></div>

                {/* 3. RETRATO (Layer 2) */}
                <img 
                    src={agentImage} 
                    alt={role}
                    className="absolute inset-0 w-full h-full object-cover object-[center_15%] scale-[1.8] translate-y-14 
                               brightness-[0.5] saturate-[0.5] 
                               group-hover:brightness-[0.8] group-hover:saturate-[0.8] 
                               transition-all duration-700 drop-shadow-2xl z-20"
                />

                {/* 4. GRADIENTE (Layer 3) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/40 to-transparent opacity-90 z-30 pointer-events-none"></div>

                {/* 5. TEXTO (Layer 4 - Máxima Prioridad) */}
                {/* z-40 asegura que esté por encima de TODO */}
                <div className="absolute bottom-0 left-0 p-6 w-full z-40">
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-3">
                            
                            {/* Barra sólida visible */}
                            <span 
                                className="w-1.5 h-6 rounded-full opacity-100 shadow-sm"
                                style={{ backgroundColor: color }}
                            ></span>

                            {/* Título visible */}
                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                                {role}
                            </h3>
                        </div>
                        <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest pl-4 drop-shadow-md">
                            {totalVotes} Votes Recorded
                        </span>
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN DERECHA: LISTA --- */}
            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center gap-2">
                {topCandidates.length > 0 ? (
                    topCandidates.map((candidate, index) => {
                        const rawPercent = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
                        const safePercent = Math.round(rawPercent);
                        const isTop = index === 0;

                        return (
                            <div key={candidate.name} className="group/item flex items-center gap-3 relative h-8 md:h-9">
                                
                                <span className={`text-[10px] font-mono font-bold w-6 text-right ${isTop ? 'text-[#ff4655]' : 'text-slate-700'}`}>
                                    0{index + 1}
                                </span>

                                <div className="flex-1 h-full bg-white/[0.03] rounded border border-white/5 relative overflow-hidden flex items-center px-3 group-hover/item:bg-white/[0.05] transition-colors">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${safePercent}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
                                        className="absolute left-0 top-0 bottom-0 h-full opacity-10"
                                        style={{ backgroundColor: isTop ? color : '#fff' }}
                                    ></motion.div>

                                    <span className={`relative z-10 text-xs font-bold uppercase tracking-wide truncate ${isTop ? 'text-white' : 'text-slate-400'}`}>
                                        {candidate.name}
                                    </span>

                                    <div className="absolute right-3 top-0 bottom-0 flex items-center gap-3 z-10">
                                        <span className={`text-xs font-mono font-bold ${isTop ? 'text-white' : 'text-slate-500'}`}>
                                            {safePercent}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center h-full opacity-20">
                        <span className="text-[10px] font-mono uppercase tracking-widest">
                            Scanning Sector...
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}