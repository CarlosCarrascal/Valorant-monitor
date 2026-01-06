import { Settings2 } from 'lucide-react';

export default function SidebarControls({ composition, setComposition, teamSize }) {
    const handleChange = (role, value) => {
        setComposition(prev => ({
            ...prev,
            [role]: Math.max(0, parseInt(value) || 0)
        }));
    };

    return (
        <div className="tech-panel p-6 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-700"></div>
            
            <h2 className="tech-label mb-6 flex items-center gap-2 text-white">
                <Settings2 size={14} /> Team Composition
            </h2>
            
            <div className="space-y-3">
                {Object.keys(composition).map(role => (
                    <div key={role} className="flex justify-between items-center group">
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-tight">
                            {role}
                        </span>
                        <div className="flex items-center bg-black/40 border border-white/10 rounded px-1 hover:border-white/30 transition-colors">
                            <input 
                                type="number" 
                                min="0"
                                max="5"
                                value={composition[role]} 
                                onChange={(e) => handleChange(role, e.target.value)} 
                                className="bg-transparent w-8 text-center text-sm font-mono focus:outline-none py-1 text-white"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>TOTAL SLOTS</span>
                    <span className={teamSize > 6 ? "text-red-500 font-bold" : "text-[#00d4aa]"}>
                        {teamSize}/6
                    </span>
                </div>
            </div>
        </div>
    );
}