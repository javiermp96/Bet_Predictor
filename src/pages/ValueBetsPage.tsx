import React, { useState, useEffect } from 'react';
import { Target, AlertCircle } from 'lucide-react';
import { Match, PredictionMarket } from '../types';
import { getValueBets } from '../services/apiFootballService';

interface ValueBetItem {
    match: Match;
    market: PredictionMarket;
}

export function ValueBetsPage() {
    const [valueBets, setValueBets] = useState<ValueBetItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBets() {
            try {
                const bets = await getValueBets();
                setValueBets(bets);
            } catch (error) {
                console.error("Error fetching value bets:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBets();
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#0f1115] p-6 rounded-2xl border border-bet-border/50 shadow-lg mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
                        <Target className="text-bet-green" size={32} />
                        Value Bets Scanner
                    </h2>
                    <p className="text-gray-400">
                        Escaneo en tiempo real de discrepancias entre probabilidad IA y cuotas de casas de apuestas.
                    </p>
                </div>
                {!loading && valueBets.length > 0 && (
                    <div className="text-right bg-bet-green/10 border border-bet-green/20 px-4 py-2 rounded-xl">
                        <span className="text-xs font-bold uppercase text-bet-green block mb-1">Oportunidades</span>
                        <span className="text-3xl font-black text-white">{valueBets.length}</span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-[#12141a] rounded-2xl border border-[#232733] min-h-[300px]">
                    <div className="w-10 h-10 border-4 border-bet-green border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-bet-green font-bold animate-pulse text-sm">Escaneando cuotas globales...</p>
                </div>
            ) : valueBets.length === 0 ? (
                <div className="bg-[#12141a] border border-[#232733] rounded-2xl p-12 text-center flex flex-col items-center">
                    <AlertCircle size={48} className="text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Sin Value Bets Actuales</h3>
                    <p className="text-gray-400 font-medium max-w-md">El mercado está eficiente en este momento. Las cuotas de las casas de apuestas están alineadas con nuestras probabilidades matemáticas. Vuelve a intentarlo más tarde.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {valueBets.map((item, i) => (
                        <div key={i} className="bg-[#12141a] p-6 rounded-2xl border border-bet-green/30 relative overflow-hidden group hover:border-bet-green/80 transition-all">
                            <div className="absolute top-0 right-0 bg-bet-green text-[#0b0c10] font-black text-xs px-3 py-1.5 rounded-bl-xl shadow-lg">
                                EDGE +{item.market.edge}%
                            </div>

                            <div className="text-xs font-bold text-gray-500 mb-4 bg-[#1a1d24] inline-block px-3 py-1 rounded border border-[#232733]">
                                {typeof item.match.league === 'string' ? item.match.league : item.match.league?.name} • {item.match.time}
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <div className="font-bold text-lg text-white">{typeof item.match.homeTeam === 'string' ? item.match.homeTeam : item.match.homeTeam.name}</div>
                                <div className="text-xs font-black text-gray-600 px-2">VS</div>
                                <div className="font-bold text-lg text-white text-right">{typeof item.match.awayTeam === 'string' ? item.match.awayTeam : item.match.awayTeam.name}</div>
                            </div>

                            <div className="bg-[#0b0c10] rounded-xl p-4 border border-[#232733]">
                                <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Mercado Detectado</div>
                                <div className="flex justify-between items-end">
                                    <div className="text-xl font-black text-bet-green">{item.market.selection}</div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 mb-1">Cuota Justa IA: <span className="text-white">{item.market.impliedOdds}</span></div>
                                        <div className="text-sm font-bold text-gray-300">Cuota Mercado: <span className="text-bet-green text-lg">{item.market.marketOdds}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
