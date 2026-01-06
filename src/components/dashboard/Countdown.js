import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Countdown({ target }) {
    const [timeLeft, setTimeLeft] = useState('CALCULATING...');

    useEffect(() => {
        if (!target) return;
        
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = target - now;
            
            if (distance < 0) {
                setTimeLeft("SESSION ENDED");
                clearInterval(interval);
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            // Formato más técnico: 1D 12H 30M
            const dayStr = days > 0 ? `${days}D ` : '';
            setTimeLeft(`${dayStr}${hours}H ${minutes}M`);
        }, 1000);

        return () => clearInterval(interval);
    }, [target]);

    return (
        <div className="tech-panel p-6 rounded-sm border-t-2 border-t-[#00d4aa]">
            <h2 className="tech-label mb-2 flex items-center gap-2">
                <Clock size={14} /> Voting Ends In
            </h2>
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
                {timeLeft}
            </div>
        </div>
    );
}