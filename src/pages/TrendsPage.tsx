import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { getLiveFixtures, getMatchPredictionStats } from '../services/apiFootballService';
import { PredictionMarket } from '../types';

interface TrendItem {
    teamName: string;
    marketName: string;
    probability: number;
    streakText: string;
}

export function TrendsPage() {
    const [trends, setTrends] = useState<TrendItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTrends() {
            try {
                const todayStr = new Date().toISOString().split('T')[0];
                const todayMatches = await getLiveFixtures(todayStr);

                if (todayMatches.length === 0) {
                    setLoading(false);
                    return;
                }

                const dynamicTrends: TrendItem[] = [];
                const matchesToScan = todayMatches.slice(0, 4); // Limit to top 4 matches for performance/rate limits

                for (const match of matchesToScan) {
                    const predictionData = await getMatchPredictionStats(match.id.toString());
                    if (predictionData && predictionData.events) {

                        // Look for extreme probabilities to qualify as a "Trend"
                        if (predictionData.events.over2_5 > 70) {
                            dynamicTrends.push({
                                teamName: typeof match.homeTeam === 'string' ? match.homeTeam : match.homeTeam.name,
                                marketName: 'Más de 2.5 Goles',
                                probability: predictionData.events.over2_5,
                                streakText: 'Alto promedio goleador combinado'
                            });
                        }

                        if (predictionData.events.btts > 70) {
                            dynamicTrends.push({
                                teamName: typeof match.awayTeam === 'string' ? match.awayTeam : match.awayTeam.name,
                                marketName: 'Ambos Equipos Anotan',
                                probability: predictionData.events.btts,
                                streakText: 'Defensas permisivas en H2H'
                            });
                        }

                        if (predictionData.events.cornersOver9_5 > 70) {
                            dynamicTrends.push({
                                teamName: `${typeof match.homeTeam === 'string' ? match.homeTeam.substring(0, 3) : match.homeTeam.shortCode} vs ${typeof match.awayTeam === 'string' ? match.awayTeam.substring(0, 3) : match.awayTeam.shortCode}`,
                                marketName: '+9.5 Tiros de Esquina',
                                probability: predictionData.events.cornersOver9_5,
                                streakText: 'Equipos con fuerte juego exterior'
                            });
                        }
                    }
                }

                // Sort by highest probability
                const sortedTrends = dynamicTrends.sort((a, b) => b.probability - a.probability).slice(0, 6);
                setTrends(sortedTrends);

            } catch (error) {
                console.error("Error fetching dynamic trends:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTrends();
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#0f1115] p-6 rounded-2xl border border-bet-border/50 shadow-lg mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <TrendingHotIcon />
                    <h2 className="text-3xl font-black tracking-tight text-white">Tendencias Estadísticas</h2>
                </div>
                <p className="text-gray-400 mb-8 max-w-2xl">
                    Visualiza las métricas en vivo (H2H) de los equipos que juegan hoy, detectando rachas reales y patrones analíticos procesados por nuestra IA.
                </p>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 min-h-[200px]">
                        <div className="w-8 h-8 border-4 border-bet-green border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-bet-green font-bold animate-pulse text-sm">Computando rendimientos históricos...</p>
                    </div>
                ) : trends.length === 0 ? (
                    <div className="bg-[#12141a] border border-[#232733] rounded-2xl p-12 text-center flex flex-col items-center">
                        <AlertCircle size={48} className="text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Sin Tendencias Notables</h3>
                        <p className="text-gray-400 font-medium">Para los partidos de Europa actuales, no se detectan rachas matemáticas por encima del umbral de seguridad (+70%).</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trends.map((trend, i) => (
                            <div key={i} className="p-5 bg-[#12141a] border border-[#232733] rounded-xl flex flex-col gap-4 group hover:border-emerald-500/50 transition-colors">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Patrón Detectado</span>
                                    <Activity size={16} className={`text-emerald-500 ${trend.probability > 75 ? 'animate-pulse' : ''}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white truncate">{trend.teamName}</h3>
                                    <p className="text-sm font-medium text-emerald-400 mb-1">{trend.marketName}</p>
                                </div>
                                <div className="text-4xl font-black text-white">{trend.probability}%</div>
                                <div className="text-xs text-gray-500 mt-auto pt-3 border-t border-[#232733] bg-[#1a1d24] px-3 py-2 rounded-lg -mx-1">
                                    {trend.streakText}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TrendingHotIcon() {
    return (
        <div className="relative flex items-center justify-center">
            <TrendingUp size={28} className="text-bet-green relative z-10" />
            <div className="absolute inset-0 bg-bet-green rounded-full blur-md opacity-30"></div>
        </div>
    );
}
