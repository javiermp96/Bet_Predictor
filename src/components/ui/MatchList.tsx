import React from 'react';
import { Match, Prediction } from '../../types';
import { PredictiveMatchCard } from './PredictiveMatchCard';
import { Trophy } from 'lucide-react';

interface MatchListProps {
    matches: Match[];
    predictions: Record<string, Prediction>;
    analyzingIds: Set<string>;
    onAnalyze: (match: Match) => void;
}

export function MatchList({ matches, predictions, analyzingIds, onAnalyze }: MatchListProps) {
    // Group matches by league
    const groupedMatches: Record<string, Match[]> = {};

    for (const match of matches) {
        const leagueName = typeof match.league === 'string' ? match.league : match.league?.name || 'Otras Ligas';
        if (!groupedMatches[leagueName]) {
            groupedMatches[leagueName] = [];
        }
        groupedMatches[leagueName].push(match);
    }

    const leagues = Object.keys(groupedMatches).sort();

    if (matches.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-[#0f1115] rounded-2xl border border-[#232733] mt-4">
                <Trophy size={48} className="text-gray-600 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">No hay partidos disponibles</h3>
                <p className="text-gray-400 text-center max-w-md text-sm">No se encontraron encuentros deportivos que coincidan con los filtros y ligas seleccionadas actuales.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 mt-6">
            {leagues.map(league => (
                <div key={league} className="flex flex-col gap-5">
                    <div className="flex items-center gap-3 border-b border-[#232733] pb-3">
                        <div className="w-8 h-8 rounded flex items-center justify-center bg-[#1a1d24] border border-[#2a2e39]">
                            <Trophy size={16} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight">{league}</h3>
                        <span className="text-xs font-bold text-gray-400 bg-[#1a1d24] border border-[#2a2e39] px-2.5 py-0.5 rounded-full ml-auto">
                            {groupedMatches[league].length} partidos
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {groupedMatches[league].map(match => (
                            <PredictiveMatchCard
                                key={match.id}
                                match={match}
                                prediction={predictions[match.id] || undefined}
                                onAnalyze={onAnalyze}
                                isAnalyzing={analyzingIds.has(match.id)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
