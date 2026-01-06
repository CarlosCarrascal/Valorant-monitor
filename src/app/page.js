"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Trophy, Users, Clock, Shield, Sword, Zap, Cloud, Activity } from 'lucide-react';

// Configuración de Roles
const ROLES_CONFIG = {
  'Duelist': { color: 'bg-rose-500', text: 'text-rose-400', icon: <Sword size={18} />, label: 'Duelistas' },
  'Initiator': { color: 'bg-amber-400', text: 'text-amber-400', icon: <Zap size={18} />, label: 'Iniciadores' },
  'Sentinel': { color: 'bg-emerald-400', text: 'text-emerald-400', icon: <Shield size={18} />, label: 'Centinelas' },
  'Smoker': { color: 'bg-violet-400', text: 'text-violet-400', icon: <Cloud size={18} />, label: 'Controladores' },
  'Flex': { color: 'bg-orange-400', text: 'text-orange-400', icon: <Activity size={18} />, label: 'Flex' },
  'Sixth': { color: 'bg-slate-400', text: 'text-slate-400', icon: <Users size={18} />, label: 'Sexto Jugador' }
};

export default function Home() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Llamamos a NUESTRO proxy, no a Rastry directo
      const res = await fetch('/api/votes');
      const data = await res.json();
      if (data.votes) {
        setVotes(data.votes);
        setLastUpdate(new Date());
      }
    } catch (e) {
      console.error("Error fetching:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Actualizar cada 10s
    return () => clearInterval(interval);
  }, []);

  // Procesamiento de datos (Lógica robusta para formato nuevo y viejo)
  const stats = {};
  Object.keys(ROLES_CONFIG).forEach(r => stats[r] = {});

  votes.forEach(vote => {
    if (!vote.team_hash) return;
    const sep = vote.team_hash.includes('||') ? '||' : '|';
    const parts = vote.team_hash.split(sep);

    if (sep === '||') {
      parts.forEach(p => {
        const [name, role] = p.split('|');
        if (stats[role]) stats[role][name] = (stats[role][name] || 0) + 1;
      });
    } else {
      // Soporte legacy
      for (let i = 0; i < parts.length; i += 2) {
        if (stats[parts[i + 1]]) stats[parts[i + 1]][parts[i]] = (stats[parts[i + 1]][parts[i]] || 0) + 1;
      }
    }
  });

  return (
    <main className="min-h-screen relative p-4 md:p-8">
      {/* Fondo Decorativo Cyberpunk */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]" />
      <div className="fixed inset-0 z-[-1] opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-val-red animate-pulse"></span>
              <span className="text-val-red font-mono text-xs uppercase tracking-widest">Live Monitor</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              VCT <span className="text-transparent bg-clip-text bg-gradient-to-r from-val-red to-orange-600">PREMIER</span>
            </h1>
          </div>

          <div className="flex gap-4 items-center">
            <div className="glass px-4 py-2 rounded-lg text-right hidden sm:block">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Total Votos</div>
              <div className="text-2xl font-mono font-bold text-white">{votes.length}</div>
            </div>

            <button
              onClick={fetchData}
              className="glass glass-hover p-3 rounded-xl group active:scale-95 transition-transform"
            >
              <RefreshCw className={`text-white group-hover:text-val-red ${loading ? "animate-spin" : ""}`} size={20} />
            </button>
          </div>
        </header>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.keys(ROLES_CONFIG).map((role) => {
            const config = ROLES_CONFIG[role];
            // Ordenar y tomar Top 5
            const players = Object.entries(stats[role]).sort((a, b) => b[1] - a[1]).slice(0, 5);
            const maxVotes = players[0]?.[1] || 1;

            return (
              <div key={role} className="glass glass-hover rounded-2xl flex flex-col h-full overflow-hidden">
                {/* Card Header */}
                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md bg-opacity-10 ${config.color.replace('bg-', 'bg-opacity-10 ')}`}>
                      <span className={config.text}>{config.icon}</span>
                    </div>
                    <h2 className="font-bold uppercase tracking-wider text-sm text-slate-200">{config.label}</h2>
                  </div>
                  <span className="text-xs font-mono text-slate-500">TOP 5</span>
                </div>

                {/* Player List */}
                <div className="p-5 flex-1 space-y-5">
                  {players.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 opacity-50">
                      <Clock size={24} />
                      <span className="text-xs uppercase tracking-widest">Esperando votos</span>
                    </div>
                  ) : (
                    players.map(([name, count], idx) => {
                      const percentage = (count / maxVotes) * 100;
                      return (
                        <div key={name} className="group relative">
                          <div className="flex justify-between items-end mb-1.5 relative z-10">
                            <span className={`text-sm font-medium flex items-center gap-2 ${idx === 0 ? 'text-white' : 'text-slate-400'}`}>
                              {idx === 0 && <Trophy size={13} className="text-yellow-400" />}
                              <span className={idx === 0 ? "font-bold" : ""}>
                                {idx + 1}. {name}
                              </span>
                            </span>
                            <span className="text-xs font-mono text-slate-500 group-hover:text-white transition-colors">
                              {count}
                            </span>
                          </div>

                          {/* Barra de fondo */}
                          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            {/* Barra animada */}
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, ease: "circOut" }}
                              className={`h-full rounded-full ${config.color} ${idx === 0 ? 'opacity-100 shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'opacity-60'}`}
                            />
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer info */}
        <div className="text-center text-slate-600 text-xs font-mono py-8">
          ACTUALIZADO: {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
        </div>
      </div>
    </main>
  );
}