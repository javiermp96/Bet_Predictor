import React, { useState, useEffect } from 'react';
import { Match } from '../types';
import { getUpcomingFixtures } from '../services/apiFootballService';
import { CalendarRange, Activity } from 'lucide-react';

export function UpcomingMatchesPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMatches() {
            setLoading(true);
            const data = await getUpcomingFixtures();
            setMatches(data);
            setLoading(false);
        }
        loadMatches();
    }, []);

    const groupedMatches = matches.reduce((acc, match) => {
        const date = match.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(match);
        return acc;
    }, {} as Record<string, Match[]>);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="bg-[#0f1115] p-6 rounded-2xl border border-bet-border/50 shadow-lg mb-8">
                <h2 className="text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
                    <CalendarRange className="text-blue-500" size={32} />
                    Próximos Partidos
                </h2>
                <p className="text-gray-400 max-w-2xl">
                    Agenda semanal filtrada a las principales ligas Europeas. Este módulo es puramente informativo, las cuotas IA se reservan exclusivamente para la jornada en vivo actual y las pre-match de las previas 24h.
                </p>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-[#0f1115] border border-[#2a2e39] rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : matches.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-[#12141a] rounded-xl border border-[#232733]">
                    <Activity size={32} className="text-gray-600 mb-4" />
                    <h3 className="text-white font-bold text-lg mb-1">Sin Partidos Programados</h3>
                    <p className="text-gray-500 text-sm">No hay actividad TOP 6 registrada en los próximos 7 días.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.keys(groupedMatches).sort().map(dateStr => (
                        <div key={dateStr} className="bg-[#12141a] rounded-xl border border-[#232733] overflow-hidden">
                            <div className="bg-[#1a1d24] px-6 py-3 border-b border-[#232733] font-bold text-white tracking-wide">
                                {new Date(dateStr).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                            </div>

                            <div className="divide-y divide-[#232733]">
                                {groupedMatches[dateStr].map((match, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-5 hover:bg-white/5 transition-colors group">

                                        <div className="flex items-center gap-4 w-full md:w-1/3 mb-4 md:mb-0">
                                            <div className="w-10 h-10 bg-[#0f1115] rounded-full flex items-center justify-center border border-[#2a2e39] p-1.5 shrink-0">
                                                {match.league?.logo && <img src={match.league.logo} className="object-cover" alt="logo" />}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                                                    {typeof match.league === 'string' ? match.league : match.league?.name}
                                                </h4>
                                                <span className="text-xs text-blue-500 font-black">{match.time} HS</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-6 w-full md:w-1/3">
                                            <span className="text-base font-bold text-white text-right w-1/3 truncate">
                                                {typeof match.homeTeam === 'string' ? match.homeTeam : match.homeTeam.name}
                                            </span>
                                            <span className="text-xl font-black text-gray-700">VS</span>
                                            <span className="text-base font-bold text-white text-left w-1/3 truncate">
                                                {typeof match.awayTeam === 'string' ? match.awayTeam : match.awayTeam.name}
                                            </span>
                                        </div>

                                        <div className="w-full md:w-1/3 flex justify-end">
                                            <div className="px-3 py-1 rounded bg-[#0f1115] border border-[#232733] text-xs font-bold text-gray-500 uppercase">
                                                No Analizado
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
