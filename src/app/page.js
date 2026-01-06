"use client";
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Hooks
import { useVotingData } from '@/hooks/useVotingData';

// Components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SidebarControls from '@/components/dashboard/SidebarControls';
import PlayerCard from '@/components/dashboard/PlayerCard';
import Countdown from '@/components/dashboard/Countdown';

export default function DashboardPage() {
  
    // Estado local solo para UI Inputs
    const [comp, setComp] = useState({ 
        Duelist: 1, Smoker: 1, Sentinel: 1, Initiator: 1, Flex: 1, Sixth: 1 
    });

    // Custom Hook
    const { 
        team, 
        rawVotesCount, 
        playersList, 
        session, 
        loading, 
        refresh 
    } = useVotingData(comp);

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto text-slate-200">
            
            <DashboardHeader 
                session={session}
                totalVotes={rawVotesCount}
                totalCandidates={playersList.length}
                loading={loading}
                onRefresh={refresh}
            />

            <div className="grid grid-cols-12 gap-6 lg:gap-10">
                
                {/* Left Column: Controls */}
                <aside className="col-span-12 lg:col-span-3 space-y-6">
                    <SidebarControls 
                        composition={comp} 
                        setComposition={setComp}
                        teamSize={team.length}
                    />
                    
                    {session?.endTime && (
                         <Countdown target={session.endTime} />
                    )}
                </aside>

                {/* Right Column: Team Grid */}
                <main className="col-span-12 lg:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <AnimatePresence mode='popLayout'>
                            {team.map((player, i) => (
                                <PlayerCard 
                                    key={`${player.name}-${player.role}`} 
                                    player={player} 
                                    index={i} 
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    
                    {!loading && team.length === 0 && (
                        <div className="h-64 flex flex-col items-center justify-center tech-panel border-dashed opacity-50 gap-2">
                            <span className="font-mono text-xl font-bold text-slate-500">SYSTEM IDLE</span>
                            <p className="font-mono text-xs text-slate-600">NO DATA OR COMPOSITION INVALID</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}