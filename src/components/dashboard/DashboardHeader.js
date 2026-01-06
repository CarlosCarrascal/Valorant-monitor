import { Activity, Users, RefreshCw } from 'lucide-react';

export default function DashboardHeader({ session, totalVotes, totalCandidates, loading, onRefresh }) {
    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/10 pb-6 gap-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className={`h-2 w-2 rounded-full ${session?.active ? 'bg-red-500 live-dot' : 'bg-slate-600'}`}></span>
                    <span className={`${session?.active ? 'text-red-500' : 'text-slate-500'} font-mono text-xs font-bold tracking-widest uppercase`}>
                        {session?.active ? 'Live Voting' : 'Voting Closed'}
                    </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic text-white leading-none">
                    VCT<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4655] to-white">_PREMIER</span>
                </h1>
                <p className="font-mono text-sm text-slate-500 mt-2 flex gap-4">
                    <span>SYS.VER.2.0.26</span>
                    <span>//</span>
                    <span>REGION: LATAM</span>
                </p>
            </div>

            <div className="flex gap-4 items-center">
                <StatBox label="Total Votes" value={totalVotes} icon={<Activity size={14}/>} />
                <StatBox label="Candidates" value={totalCandidates || '--'} icon={<Users size={14}/>} />
                
                <button 
                    onClick={onRefresh} 
                    disabled={loading}
                    className="p-4 tech-panel hover:bg-white/5 transition-colors rounded-none border-l-2 border-l-[#ff4655] group"
                >
                    <RefreshCw className={`text-slate-400 group-hover:text-white transition-colors ${loading ? "animate-spin text-[#ff4655]" : ""}`} size={20} />
                </button>
            </div>
        </header>
    );
}

function StatBox({ label, value, icon }) {
    return (
        <div className="hidden md:block tech-panel px-5 py-3 rounded-sm border-l-2 border-l-slate-600">
            <div className="flex items-center gap-2 text-slate-500 mb-1 tech-label">
                {icon} {label}
            </div>
            <div className="text-xl font-bold font-mono leading-none text-white">{value}</div>
        </div>
    );
}