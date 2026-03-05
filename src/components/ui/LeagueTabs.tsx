import React from 'react';

interface LeagueTabsProps {
    currentLeague: string;
    onSelectLeague: (league: string) => void;
}

export function LeagueTabs({ currentLeague, onSelectLeague }: LeagueTabsProps) {
    const leagues = ['Todas', 'Champions League', 'Premier League', 'LaLiga', 'Serie A', 'Bundesliga', 'Ligue 1'];

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide pt-2">
            {leagues.map((league) => (
                <button
                    key={league}
                    onClick={() => onSelectLeague(league)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border
            ${currentLeague === league
                            ? 'bg-white text-[#0b0c10] border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                            : 'bg-transparent text-gray-400 border-[#232733] hover:border-gray-500 hover:text-gray-200'
                        }`}
                >
                    {league}
                </button>
            ))}
        </div>
    );
}
