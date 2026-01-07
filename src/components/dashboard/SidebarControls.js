import { useState, useEffect } from 'react';
import { Users, Database, Clock } from 'lucide-react';

export default function SidebarControls({ voters = [], totalCandidates = 0, sessionEnd }) {
    
    const calculateTimeLeft = (end) => {
        if (!end) return "--:--:--:--";
        const now = new Date().getTime();
        const target = new Date(Number(end)).getTime();
        const distance = target - now;

        if (distance < 0) return "SESSION CLOSED";

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds.toString().padStart(2, '0')}s`;
    };

    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(sessionEnd));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(sessionEnd));
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionEnd]);

    return (
        // CONTENEDOR GLASS "APPLE STYLE"
        // bg-white/[0.03]: Fondo casi invisible
        // backdrop-blur-2xl: Desenfoque muy suave y premium
        // border-white/[0.08]: Borde sutil, apenas perceptible
        <div className="flex flex-col gap-6 p-8 rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl shadow-2xl">
            
            {/* 1. TIMER SECTION */}
            <div>
                <span className="text-[11px] font-medium text-white/40 tracking-[0.2em] uppercase mb-4 block flex items-center gap-2">
                    <Clock size={12} className="text-white/40" />
                    Time Remaining
                </span>
                
                {/* Reloj Monocromático: Blanco puro, sin colores extraños */}
                <div className="text-4xl xl:text-5xl font-light text-white tracking-tight leading-none font-mono whitespace-nowrap">
                    {timeLeft}
                </div>
            </div>

            {/* Separador Sutil */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* 2. DATA METRICS */}
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <span className="text-[11px] font-medium text-white/40 tracking-widest uppercase mb-1 block">
                        Live Votes
                    </span>
                    <div className="flex items-center gap-3">
                        <Users size={16} className="text-white/80" />
                        <span className="text-2xl font-light text-white font-mono">
                            {voters.length}
                        </span>
                    </div>
                </div>

                {/* Borde izquierdo sutil para separar */}
                <div className="pl-8 border-l border-white/5">
                    <span className="text-[11px] font-medium text-white/40 tracking-widest uppercase mb-1 block">
                        Candidates
                    </span>
                    <div className="flex items-center gap-3">
                        <Database size={16} className="text-white/80" />
                        <span className="text-2xl font-light text-white font-mono">
                            {totalCandidates}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}