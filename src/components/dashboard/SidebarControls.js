import { useState, useEffect } from 'react';
import { Users, Database, Clock } from 'lucide-react';

export default function SidebarControls({ voters = [], totalCandidates = 0, sessionEnd }) {

    const calculateTimeLeft = (end) => {
        if (!end) return { d: '--', h: '--', m: '--', s: '--' };

        const now = new Date().getTime();
        const target = new Date(Number(end)).getTime();
        const distance = target - now;

        if (distance < 0) return { d: '00', h: '00', m: '00', s: '00' };

        return {
            d: Math.floor(distance / (1000 * 60 * 60 * 24)).toString(),
            h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
            m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
            s: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0')
        };
    };

    const [time, setTime] = useState(() => calculateTimeLeft(sessionEnd));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(calculateTimeLeft(sessionEnd));
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionEnd]);

    return (
        <div className="flex flex-col gap-8 p-8 rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl shadow-2xl">

            {/* TIMER SECTION */}
            <div>
                <span className="text-[11px] font-medium text-white/40 tracking-[0.2em] uppercase mb-6 block flex items-center gap-2">
                    <Clock size={12} className="text-white/40" />
                    Time Remaining
                </span>

                {/* Split en 4 columnas */}
                <div className="flex justify-between items-start">

                    {/* DAYS */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl xl:text-5xl font-light text-white font-mono leading-none mb-2">
                            {time.d}
                        </span>
                        <span className="text-[9px] font-medium text-white/30 tracking-widest uppercase">
                            Days
                        </span>
                    </div>

                    {/* Separador vertical */}
                    <div className="w-[1px] h-10 bg-white/5 mt-1"></div>

                    {/* HOURS */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl xl:text-5xl font-light text-white font-mono leading-none mb-2">
                            {time.h}
                        </span>
                        <span className="text-[9px] font-medium text-white/30 tracking-widest uppercase">
                            Hours
                        </span>
                    </div>

                    <div className="w-[1px] h-10 bg-white/5 mt-1"></div>

                    {/* MIN */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl xl:text-5xl font-light text-white font-mono leading-none mb-2">
                            {time.m}
                        </span>
                        <span className="text-[9px] font-medium text-white/30 tracking-widest uppercase">
                            Min
                        </span>
                    </div>

                    <div className="w-[1px] h-10 bg-white/5 mt-1"></div>

                    {/* SEC */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl xl:text-5xl font-light text-white font-mono leading-none mb-2 tabular-nums">
                            {time.s}
                        </span>
                        <span className="text-[9px] font-medium text-white/30 tracking-widest uppercase">
                            Sec
                        </span>
                    </div>
                </div>
            </div>

            {/* Separador Horizontal */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* DATA METRICS */}
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <span className="text-[11px] font-medium text-white/40 tracking-widest uppercase mb-2 block">
                        Live Votes
                    </span>
                    <div className="flex items-center gap-3">
                        <Users size={18} className="text-white/80" />
                        <span className="text-2xl font-light text-white font-mono">
                            {voters.length}
                        </span>
                    </div>
                </div>

                {/* Borde izquierdo */}
                <div className="pl-8 border-l border-white/5">
                    <span className="text-[11px] font-medium text-white/40 tracking-widest uppercase mb-2 block">
                        Candidates
                    </span>
                    <div className="flex items-center gap-3">
                        <Database size={18} className="text-white/80" />
                        <span className="text-2xl font-light text-white font-mono">
                            {totalCandidates}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}