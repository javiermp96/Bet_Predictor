import React, { useState, useEffect } from 'react';
import { Match, Prediction } from '../../types';
import { X, Activity, CircleDot, Flag, Users, User, Target } from 'lucide-react';
import { getPlayerStats } from '../../services/apiFootballService';

interface MatchStatsModalProps {
    match: Match;
    prediction: Prediction;
    onClose: () => void;
}

export function MatchStatsModal({ match, prediction, onClose }: MatchStatsModalProps) {
    const homeName = typeof match.homeTeam === 'string' ? match.homeTeam : match.homeTeam.name;
    const awayName = typeof match.awayTeam === 'string' ? match.awayTeam : match.awayTeam.name;
    const [players, setPlayers] = useState<any[]>([]);
    const [loadingPlayers, setLoadingPlayers] = useState(true);

    useEffect(() => {
        async function fetchPlayers() {
            try {
                const data = await getPlayerStats(match.id.toString());
                setPlayers(data);
            } catch (e) {
                console.error("Failed to load player stats", e);
            } finally {
                setLoadingPlayers(false);
            }
        }
        fetchPlayers();
    }, [match.id]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <div
                className="absolute inset-0 bg-[#0b0c10]/80 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#12141a] border border-[#232733] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-[#232733] bg-[#0f1115]">
                    <h3 className="text-xl font-black text-white">Análisis Matemático Detallado</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-[#232733] rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">

                    {/* Teams Matchup Header */}
                    <div className="flex justify-between items-center mb-8 px-8">
                        <div className="text-center w-1/3">
                            <span className="text-2xl font-black text-white block">{homeName}</span>
                            <span className="text-xl font-bold text-bet-green">{prediction.probability.home}%</span>
                        </div>
                        <div className="text-center w-1/3">
                            <span className="text-xs font-bold text-gray-500 block">EMPATE</span>
                            <span className="text-lg font-bold text-gray-400">{prediction.probability.draw}%</span>
                        </div>
                        <div className="text-center w-1/3">
                            <span className="text-2xl font-black text-white block">{awayName}</span>
                            <span className="text-xl font-bold text-emerald-500">{prediction.probability.away}%</span>
                        </div>
                    </div>

                    {/* Veredicto IA */}
                    <div className="bg-bet-green/10 border border-bet-green/20 rounded-xl p-5 mb-8">
                        <div className="text-xs font-bold uppercase text-bet-green mb-2 flex items-center gap-2">
                            <Activity size={14} />
                            Justificación del Algoritmo
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed font-medium">
                            {prediction.reasoning}
                        </p>
                    </div>

                    {/* Advanced Metrics Grid */}
                    <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Métricas de Juego (xG & Stats)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                        <div className="bg-[#1a1d24] border border-[#232733] p-4 rounded-xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <CircleDot size={20} className="text-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-gray-500 mb-1">PROBABILIDAD OVER 2.5 GOLES</div>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-black text-white">{prediction.events?.over2_5}%</span>
                                    {/* Small visual bar */}
                                    <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden mb-1.5">
                                        <div className="h-full bg-emerald-500" style={{ width: `${prediction.events?.over2_5}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a1d24] border border-[#232733] p-4 rounded-xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Users size={20} className="text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-gray-500 mb-1">AMBOS ANOTAN (BTTS)</div>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-black text-white">{prediction.events?.btts}%</span>
                                    <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden mb-1.5">
                                        <div className="h-full bg-blue-500" style={{ width: `${prediction.events?.btts}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a1d24] border border-[#232733] p-4 rounded-xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                <Flag size={20} className="text-orange-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-gray-500 mb-1">MÁS DE 9.5 CORNERS</div>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-black text-white">{prediction.events?.cornersOver9_5}%</span>
                                    <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden mb-1.5">
                                        <div className="h-full bg-orange-500" style={{ width: `${prediction.events?.cornersOver9_5}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a1d24] border border-[#232733] p-4 rounded-xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                                <div className="w-4 h-5 border border-yellow-500 bg-yellow-500/20 rounded-sm"></div>
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-gray-500 mb-1">MÁS DE 4.5 TARJETAS</div>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-black text-white">{prediction.events?.cardsOver4_5}%</span>
                                    <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden mb-1.5">
                                        <div className="h-full bg-yellow-500" style={{ width: `${prediction.events?.cardsOver4_5}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* All Computed Markets List */}
                    {prediction.advanced?.topTeamPredictions && prediction.advanced.topTeamPredictions.length > 0 && (
                        <>
                            <h4 className="text-sm font-bold text-white mb-4 mt-8 uppercase tracking-wider flex items-center gap-2">
                                <Target size={16} className="text-bet-green" />
                                Oportunidades de Mercado (Value Bets)
                            </h4>
                            <div className="bg-[#1a1d24] border border-[#232733] rounded-xl overflow-hidden mb-8">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#0b0c10]/50 border-b border-[#232733]">
                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Mercado</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Selección</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Probabilidad</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Cuota Justa</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#232733]">
                                        {prediction.advanced.topTeamPredictions.slice(0, 10).map((market, idx) => (
                                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-3 text-xs font-medium text-gray-400">
                                                    {market.market === '1X2' ? 'Ganador del Partido' :
                                                        market.market === 'DOUBLE_CHANCE' ? 'Doble Oportunidad' :
                                                            market.market === 'ASIAN_HANDICAP' ? 'Hándicap Asiático' :
                                                                market.market === 'OVER_UNDER' ? 'Goles Totales' :
                                                                    market.market === 'BTTS' ? 'Ambos Anotan' :
                                                                        market.market === 'CORNERS' ? 'Córners Totales' :
                                                                            market.market === 'CARDS' ? 'Tarjetas' : market.market}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-bold text-white">
                                                    {market.selection}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                            <div className={`h-full ${market.probability > 65 ? 'bg-bet-green' : market.probability > 45 ? 'bg-yellow-500' : 'bg-orange-500'}`} style={{ width: `${market.probability}%` }}></div>
                                                        </div>
                                                        <span className="font-black text-sm text-white w-8 text-right">{market.probability}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="font-bold text-gray-300">
                                                        {market.impliedOdds.toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* Player Props Section */}
                    <h4 className="text-sm font-bold text-white mb-4 mt-8 uppercase tracking-wider flex items-center gap-2">
                        <User size={16} className="text-bet-green" />
                        Rendimiento Individual (Player Props)
                    </h4>

                    {loadingPlayers ? (
                        <div className="flex justify-center p-8 border border-[#232733] border-dashed rounded-xl">
                            <div className="w-6 h-6 border-2 border-bet-green border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : players.length === 0 ? (
                        <div className="text-center p-8 border border-[#232733] border-dashed rounded-xl text-gray-500 text-sm">
                            Datos individuales no disponibles para esta liga o partido.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {players.map((p, idx) => (
                                <div key={idx} className="bg-[#1a1d24] border border-[#232733] p-4 rounded-xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden border border-[#2a2e39]">
                                            <img src={p.photo} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://media.api-sports.io/football/players/1.png' }} />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-white text-sm">{p.name}</h5>
                                            <span className="text-[10px] text-gray-500 bg-[#12141a] px-2 py-0.5 rounded uppercase">{p.teamName}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {p.props.map((prop: any, j: number) => (
                                            <div key={j} className="flex items-center justify-between text-xs">
                                                <span className="text-gray-400">{prop.name} <span className="text-white font-medium">{prop.val}</span></span>
                                                <div className="flex items-center gap-2 w-1/2 justify-end">
                                                    <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                                                        <div className={`h-full ${prop.prob > 70 ? 'bg-bet-green' : 'bg-gray-500'}`} style={{ width: `${prop.prob}%` }}></div>
                                                    </div>
                                                    <span className={`font-bold w-8 text-right ${prop.prob > 70 ? 'text-bet-green' : 'text-gray-400'}`}>{prop.prob}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
