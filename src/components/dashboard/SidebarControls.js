import { Settings2, Plus, Minus } from 'lucide-react';

export default function SidebarControls({ composition, setComposition, teamSize }) {
    const handleAdjust = (role, delta) => {
        const current = composition[role] || 0;
        const newValue = Math.max(0, Math.min(5, current + delta)); // Max 5 por rol
        setComposition(prev => ({ ...prev, [role]: newValue }));
    };

    return (
        <div className="tech-panel p-6 rounded-sm relative overflow-hidden">
            <h2 className="tech-label mb-6 flex items-center gap-2 text-white border-b border-white/10 pb-4">
                <Settings2 size={14} /> TACTICAL COMPOSITION
            </h2>
            
            <div className="space-y-4">
                {Object.keys(composition).map(role => (
                    <div key={role} className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-24">
                            {role}
                        </span>
                        
                        <div className="flex items-center gap-3 bg-black/40 p-1 rounded-sm border border-white/5">
                            <button 
                                onClick={() => handleAdjust(role, -1)}
                                className="p-1 hover:bg-red-500/20 hover:text-red-500 text-slate-500 transition-colors rounded"
                            >
                                <Minus size={14} />
                            </button>
                            
                            <span className={`font-mono font-bold w-4 text-center ${composition[role] > 0 ? 'text-white' : 'text-slate-700'}`}>
                                {composition[role]}
                            </span>
                            
                            <button 
                                onClick={() => handleAdjust(role, 1)}
                                className="p-1 hover:bg-[#00d4aa]/20 hover:text-[#00d4aa] text-slate-500 transition-colors rounded"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-sm border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400">SQUAD SIZE</span>
                    <span className={`text-xl font-black font-mono ${teamSize > 6 ? "text-red-500" : "text-[#00d4aa]"}`}>
                        {teamSize}<span className="text-slate-600 text-sm">/6</span>
                    </span>
                </div>
            </div>
        </div>
    );
}