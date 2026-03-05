import React, { useState } from 'react';
import { Match, Prediction } from '../../types';
import { Target, TrendingUp, AlertCircle, ChevronRight, BarChart2 } from 'lucide-react';
import { MatchStatsModal } from './MatchStatsModal';

interface PredictiveMatchCardProps {
    key?: string | number;
    match: Match;
    prediction?: Prediction;
    onAnalyze: (match: Match) => void;
    isAnalyzing: boolean;
}

export function PredictiveMatchCard({ match, prediction, onAnalyze, isAnalyzing }: PredictiveMatchCardProps) {
    const hasAnalysis = !!prediction;
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    // We first try to use the new 'advanced' API format, fallback to legacy simulation
    const advancedData = prediction?.advanced;
    const bestMarket = advancedData?.topTeamPredictions?.[0] || (hasAnalysis ? {
        selection: prediction?.suggestedBet || 'Over 2.5 Goals',
        probability: (prediction?.confidence || 0),
        impliedOdds: parseFloat((100 / (prediction?.confidence || 50)).toFixed(2)),
        marketOdds: parseFloat(((100 / (prediction?.confidence || 50)) + 0.15).toFixed(2))
    } : null);

    const homeName = typeof match.homeTeam === 'string' ? match.homeTeam : match.homeTeam.name;
    const awayName = typeof match.awayTeam === 'string' ? match.awayTeam : match.awayTeam.name;
    const leagueName = typeof match.league === 'string' ? match.league : match.league?.name || 'Liga Top';

    return (
        <div className="bg-[#12141a] border border-[#232733] hover:border-bet-green/50 transition-all rounded-2xl p-5 flex flex-col group relative overflow-hidden h-[300px]">
            {/* Top bar: Time & League */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-300 bg-[#1a1d24] px-3 py-1.5 rounded-md border border-[#2a2e39] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-bet-green animate-pulse"></span>
                    {match.time || '14:00'}
                </span>
                <span className="text-[10px] font-black uppercase text-bet-green tracking-widest bg-bet-green/10 px-2 py-1 rounded">
                    {leagueName}
                </span>
            </div>

            {/* Teams */}
            <div className="flex flex-col gap-3 mb-6 relative z-10">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        <span className="font-bold text-white text-lg block truncate">{homeName}</span>
                    </div>
                    <span className="text-xs font-black text-gray-600 px-3">VS</span>
                    <div className="flex-1 text-right">
                        <span className="font-bold text-white text-lg block truncate">{awayName}</span>
                    </div>
                </div>
            </div>

            {/* Predictive Core */}
            <div className="flex-1 flex flex-col justify-end relative z-10">
                {hasAnalysis && bestMarket ? (
                    <div className="bg-[#0b0c10] rounded-xl p-4 border border-bet-border/50 mb-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Mejor Oportunidad (Edge)</p>
                                <p className="text-sm font-bold text-white flex items-center gap-1">
                                    <Target size={14} className="text-bet-green" />
                                    {bestMarket.selection}
                                </p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-lg font-black text-bet-green">{bestMarket.probability}%</span>
                                <span className="text-[10px] text-gray-400 font-medium">Cuota: <span className="text-white">{bestMarket.marketOdds || bestMarket.impliedOdds}</span></span>
                            </div>
                        </div>
                        {/* Probability Bar */}
                        <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gray-800"></div>
                            <div
                                className="relative bg-gradient-to-r from-emerald-600 to-bet-green h-1.5 rounded-full shadow-[0_0_10px_rgba(0,255,136,0.5)] transition-all duration-1000 ease-out"
                                style={{ width: `${bestMarket.probability}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#1a1d24]/50 border border-[#2a2e39] border-dashed rounded-xl p-4 mb-4 flex items-center justify-center flex-col gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <AlertCircle size={20} className="text-gray-500" />
                        <p className="text-xs text-gray-400 text-center font-medium">Analítica avanzada disponible</p>
                    </div>
                )}

                <button
                    onClick={() => hasAnalysis ? setIsStatsOpen(true) : onAnalyze(match)}
                    disabled={isAnalyzing}
                    className={`w-full py-3.5 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all
            ${isAnalyzing
                            ? 'bg-bet-green/20 text-bet-green cursor-wait'
                            : hasAnalysis
                                ? 'bg-white text-black hover:bg-gray-200 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.25)] hover:-translate-y-0.5'
                                : 'bg-bet-green text-black hover:bg-[#00e67a] shadow-[0_4px_20px_rgba(0,255,136,0.25)] hover:shadow-[0_6px_25px_rgba(0,255,136,0.35)] hover:-translate-y-0.5'
                        }`}
                >
                    {isAnalyzing ? (
                        <span className="animate-pulse flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-bet-green border-t-transparent rounded-full animate-spin"></div>
                            Computando Data...
                        </span>
                    ) : hasAnalysis ? (
                        <>
                            <BarChart2 size={16} />
                            Estadísticas Detalladas
                        </>
                    ) : (
                        <>
                            <TrendingUp size={16} />
                            Analizar Incidencias
                        </>
                    )}
                </button>
            </div>

            {/* Decorative gradient blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-bet-green/5 rounded-full blur-3xl pointer-events-none group-hover:bg-bet-green/10 transition-all duration-700"></div>

            {/* Detailed Stats Modal render condition */}
            {isStatsOpen && prediction && (
                <MatchStatsModal
                    match={match}
                    prediction={prediction}
                    onClose={() => setIsStatsOpen(false)}
                />
            )}
        </div>
    );
}
