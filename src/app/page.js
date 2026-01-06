"use client";
import { useState } from 'react';
import { LayoutGrid, List, Activity } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Hooks
import { useVotingData } from '@/hooks/useVotingData';

// Components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SidebarControls from '@/components/dashboard/SidebarControls';
import PlayerCard from '@/components/dashboard/PlayerCard';
import Countdown from '@/components/dashboard/Countdown';
import LeaderboardRole from '@/components/dashboard/LeaderboardRole';
import VoterFeed from '@/components/dashboard/VoterFeed';

export default function Page() {
  // Estado de la navegación (Tabs)
  const [activeTab, setActiveTab] = useState('squad'); // 'squad' | 'leaderboard' | 'feed'

  // Estado de la composición táctica
  const [comp, setComp] = useState({
    Duelist: 1, Smoker: 1, Sentinel: 1, Initiator: 1, Flex: 1, Sixth: 1
  });

  // Hook inteligente que trae toda la data
  const {
    team,
    leaderboard,
    voters,
    rawVotesCount,
    playersList,
    session,
    loading,
    refresh
  } = useVotingData(comp);

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-[1800px] mx-auto text-slate-200">

      {/* --- HEADER --- */}
      <DashboardHeader
        session={session}
        totalVotes={rawVotesCount}
        totalCandidates={playersList.length}
        loading={loading}
        onRefresh={refresh}
      />

      <div className="grid grid-cols-12 gap-6">

        {/* --- LEFT SIDEBAR (Controles & Timer) --- */}
        <aside className="col-span-12 xl:col-span-3 space-y-6">
          <SidebarControls
            composition={comp}
            setComposition={setComp}
            teamSize={team.length}
          />

          {session?.endTime && (
            <Countdown target={session.endTime} />
          )}
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="col-span-12 xl:col-span-9 space-y-6">

          {/* Navigation Tabs (Menú de pestañas) */}
          <div className="flex flex-wrap gap-2 md:gap-4 border-b border-white/10 pb-1">
            <NavButton
              active={activeTab === 'squad'}
              onClick={() => setActiveTab('squad')}
              icon={<LayoutGrid size={16} />}
            >
              FINAL TEAM
            </NavButton>

            <NavButton
              active={activeTab === 'leaderboard'}
              onClick={() => setActiveTab('leaderboard')}
              icon={<List size={16} />}
            >
              ROLE RANKINGS
            </NavButton>

            <NavButton
              active={activeTab === 'feed'}
              onClick={() => setActiveTab('feed')}
              icon={<Activity size={16} />}
            >
              VOTER INTEL
            </NavButton>
          </div>

          {/* VISTA 1: FINAL TEAM SQUAD (El equipo ganador) */}
          {activeTab === 'squad' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[500px] content-start">
              <AnimatePresence mode='popLayout'>
                {team.map((player, i) => (
                  <PlayerCard
                    key={`${player.name}-${i}`}
                    player={player}
                    index={i}
                  />
                ))}
              </AnimatePresence>

              {/* Estado vacío o de carga */}
              {team.length === 0 && !loading && (
                <div className="col-span-full h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-sm bg-white/5">
                  <p className="text-slate-400 font-mono font-bold mb-2">WAITING FOR TACTICAL DATA...</p>
                  <p className="text-slate-600 text-xs font-mono">ADJUST COMPOSITION OR WAIT FOR VOTES</p>
                </div>
              )}
            </div>
          )}

          {/* VISTA 2: FULL LEADERBOARDS (Rankings por Rol) */}
          {activeTab === 'leaderboard' && (
            /* FIX DE UI: Usamos xl:grid-cols-3 para dar mucho espacio a cada tarjeta */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
              {['Duelist', 'Initiator', 'Sentinel', 'Smoker', 'Flex'].map(role => (
                <LeaderboardRole
                  key={role}
                  role={role}
                  candidates={leaderboard[role] || []}
                />
              ))}
            </div>
          )}

          {/* VISTA 3: VOTER FEED (Tabla de votantes en vivo) */}
          {activeTab === 'feed' && (
            <VoterFeed voters={voters}
              allCandidates={playersList} />
          )}
        </main>
      </div>
    </div>
  );
}

// Sub-componente para los botones de navegación
function NavButton({ children, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 md:px-6 py-3 font-bold uppercase tracking-wider text-xs transition-all duration-200
                ${active
          ? 'text-[#ff4655] border-b-2 border-[#ff4655] bg-white/5'
          : 'text-slate-500 hover:text-white hover:bg-white/5 border-b-2 border-transparent'
        }`}
    >
      {icon}
      {children}
    </button>
  );
}