"use client";
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useVotingData } from '@/hooks/useVotingData';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SidebarControls from '@/components/dashboard/SidebarControls';
import PlayerCard from '@/components/dashboard/PlayerCard';
import LeaderboardRole from '@/components/dashboard/LeaderboardRole';
import VoterFeed from '@/components/dashboard/VoterFeed';
import Footer from '@/components/dashboard/Footer';

export default function Page() {
    const [activeTab, setActiveTab] = useState('squad');
    const [comp] = useState({ Duelist: 1, Smoker: 1, Sentinel: 1, Initiator: 1, Flex: 1, Sixth: 1 });

    const { team, leaderboard, voters, playersList, session, loading } = useVotingData(comp);

    return (
        <div className="min-h-screen p-6 max-w-[1800px] mx-auto flex flex-col font-sans text-slate-200">
            <DashboardHeader />

            <div className="grid grid-cols-12 gap-8 lg:gap-16 flex-1 items-start">

                <aside className="col-span-12 xl:col-span-3 min-w-[340px] pt-2 sticky top-6 z-10">
                    <SidebarControls voters={voters} totalCandidates={playersList.length} sessionEnd={session?.end_time} />
                </aside>

                <main className="col-span-12 xl:col-span-9 space-y-10 min-w-0">

                    <div className="flex gap-12 border-b border-white/5 pb-px overflow-x-auto">
                        <NavButton active={activeTab === 'squad'} onClick={() => setActiveTab('squad')}>Final Protocol</NavButton>
                        <NavButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')}>Role Analysis</NavButton>
                        <NavButton active={activeTab === 'feed'} onClick={() => setActiveTab('feed')}>Live Feed</NavButton>
                    </div>

                    <div className="min-h-[600px]">
                        {activeTab === 'squad' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence mode='popLayout'>
                                    {team.map((player, i) => (
                                        <PlayerCard key={`${player.name}-${i}`} player={player} index={i} />
                                    ))}
                                </AnimatePresence>
                                {team.length === 0 && !loading && (
                                    <div className="col-span-full py-32 flex flex-col items-center justify-center opacity-30">
                                        <Activity size={64} className="mb-6 stroke-1 text-white" />
                                        <p className="font-mono text-xs tracking-[0.3em] text-white">SYSTEM WAITING FOR DATA</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'leaderboard' && (
                            <div className="flex flex-col gap-6 pb-12">
                                {/* AÑADIDO 'Sixth' A LA LISTA */}
                                {['Duelist', 'Initiator', 'Sentinel', 'Smoker', 'Flex', 'Sixth'].map(role => (
                                    <LeaderboardRole
                                        key={role}
                                        role={role}
                                        candidates={leaderboard[role] || []}
                                        voters={voters}
                                    />
                                ))}
                            </div>
                        )}

                        {activeTab === 'feed' && (
                            <VoterFeed voters={voters} allCandidates={playersList} />
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

function NavButton({ children, active, onClick }) {
    return (
        <button onClick={onClick} className={`pb-4 text-[11px] font-medium uppercase tracking-[0.15em] transition-all duration-500 whitespace-nowrap ${active ? 'text-white border-b border-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-white/30 hover:text-white border-b border-transparent'}`}>
            {children}
        </button>
    );
}   