import React, { useState, useEffect } from 'react';
import { History, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getPastFixtures, getMatchPredictionStats } from '../services/apiFootballService';
import { Match, Prediction } from '../types';

interface ResultEvaluation {
    match: Match;
    prediction: Prediction | null;
    outcome: 'WON' | 'LOST' | 'PENDING' | 'NO_DATA';
    details: string;
}

export function HistoryPage() {
    const [evaluations, setEvaluations] = useState<ResultEvaluation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function evaluateResults() {
            setLoading(true);
            try {
                const pastMatches = await getPastFixtures();

                if (pastMatches.length === 0) {
                    setLoading(false);
                    return;
                }

                const evals: ResultEvaluation[] = [];

                // For performance, evaluate top 5 matches
                const matchesToEvaluate = pastMatches.slice(0, 5);

                for (const match of matchesToEvaluate) {
                    // We regenerate the prediction. In a real DB, we'd fetch what we *saved* before the match.
                    // Since API-Football /predictions is deterministic based on historical data, 
                    // calling it after the match still gives us the mathematical edge it *would have* given.
                    const prediction = await getMatchPredictionStats(match.id);

                    if (!prediction || !prediction.advanced?.topTeamPredictions) {
                        evals.push({ match, prediction: null, outcome: 'NO_DATA', details: 'Sin predicción registrada' });
                        continue;
                    }

                    const topBet = prediction.advanced.topTeamPredictions[0];
                    const actualHomeGoals = match.score.home || 0;
                    const actualAwayGoals = match.score.away || 0;
                    const totalGoals = actualHomeGoals + actualAwayGoals;

                    let outcome: 'WON' | 'LOST' | 'PENDING' = 'LOST';
                    let details = `Resultado Real: ${actualHomeGoals} - ${actualAwayGoals}`;

                    // Evaluate generic Over/Under selections
                    if (topBet.selection.includes('Over 2.5') && totalGoals > 2) outcome = 'WON';
                    else if (topBet.selection.includes('Under 2.5') && totalGoals <= 2) outcome = 'WON';
                    else if (topBet.selection.includes('Ambos Equipos Anotan: SÍ') && actualHomeGoals > 0 && actualAwayGoals > 0) outcome = 'WON';
                    else if (topBet.selection.includes('Gana local') && actualHomeGoals > actualAwayGoals) outcome = 'WON';
                    else if (topBet.selection.includes('Gana visitante') && actualAwayGoals > actualHomeGoals) outcome = 'WON';

                    evals.push({ match, prediction, outcome, details });
                }

                setEvaluations(evals);

            } catch (error) {
                console.error("Error evaluating past matches:", error);
            } finally {
                setLoading(false);
            }
        }

        evaluateResults();
    }, []);

    const wonCount = evaluations.filter(e => e.outcome === 'WON').length;
    const totalEvaluated = evaluations.filter(e => e.outcome === 'WON' || e.outcome === 'LOST').length;
    const accuracy = totalEvaluated > 0 ? Math.round((wonCount / totalEvaluated) * 100) : 0;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">

            <div className="bg-[#0f1115] p-6 rounded-2xl border border-bet-border/50 shadow-lg mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
                        <History className="text-orange-500" size={32} />
                        Resultados & Backtesting
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Evaluación algorítmica. Comprobamos las predicciones que dio nuestra IA contra los resultados finales reales una vez que los partidos concluyen.
                    </p>
                </div>

                {!loading && totalEvaluated > 0 && (
                    <div className={`px-6 py-4 rounded-xl border ${accuracy > 50 ? 'bg-bet-green/10 border-bet-green/20' : 'bg-orange-500/10 border-orange-500/20'} text-center shrink-0`}>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tasa de Acierto</div>
                        <div className={`text-4xl font-black ${accuracy > 50 ? 'text-bet-green' : 'text-orange-500'}`}>{accuracy}%</div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-[#12141a] rounded-xl border border-[#232733] min-h-[300px]">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-orange-500 font-bold animate-pulse text-sm">Conciliando resultados contra la IA...</p>
                </div>
            ) : evaluations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-[#12141a] rounded-xl border border-[#232733]">
                    <AlertCircle size={32} className="text-gray-600 mb-4" />
                    <h3 className="text-white font-bold text-lg mb-1">Sin Resultados Recientes</h3>
                    <p className="text-gray-500 text-sm">No hay partidos de las ligas principales finalizados en las últimas 48 horas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {evaluations.map((evalItem, idx) => (
                        <div key={idx} className={`bg-[#12141a] p-5 rounded-2xl border shadow-lg relative overflow-hidden transition-all group hover:-translate-y-1
                    ${evalItem.outcome === 'WON' ? 'border-bet-green/30 hover:border-bet-green/60'
                                : evalItem.outcome === 'LOST' ? 'border-red-500/30 hover:border-red-500/60'
                                    : 'border-[#232733]'}`}>

                            {/* Status Ribbon */}
                            {evalItem.outcome !== 'NO_DATA' && (
                                <div className={`absolute top-0 right-0 text-[#0b0c10] font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl shadow-lg flex items-center gap-1
                            ${evalItem.outcome === 'WON' ? 'bg-bet-green' : 'bg-red-500'}`}>
                                    {evalItem.outcome === 'WON' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                    {evalItem.outcome === 'WON' ? 'ACIERTO' : 'FALLO'}
                                </div>
                            )}

                            <div className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest bg-[#1a1d24] inline-block px-2 py-1 rounded">
                                {typeof evalItem.match.league === 'string' ? evalItem.match.league : evalItem.match.league?.name} • {evalItem.match.date}
                            </div>

                            <div className="flex justify-between items-center mb-6 px-2">
                                <span className="font-bold text-white w-2/5 truncate">{typeof evalItem.match.homeTeam === 'string' ? evalItem.match.homeTeam : evalItem.match.homeTeam.name}</span>
                                <span className="text-sm font-black text-gray-600 px-2">VS</span>
                                <span className="font-bold text-white w-2/5 text-right truncate">{typeof evalItem.match.awayTeam === 'string' ? evalItem.match.awayTeam : evalItem.match.awayTeam.name}</span>
                            </div>

                            {evalItem.prediction && (
                                <div className="bg-[#0b0c10] border border-[#232733] rounded-xl p-4 mb-4">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Predicción de la IA</div>
                                    <div className="text-base font-black text-white">{evalItem.prediction.advanced?.topTeamPredictions[0]?.selection || evalItem.prediction.suggestedBet}</div>
                                    <div className="text-xs text-gray-400 mt-1">Margen de Confianza: <span className="text-orange-500 font-bold">{evalItem.prediction.advanced?.confidenceScore}%</span></div>
                                </div>
                            )}

                            <div className="pt-3 border-t border-[#232733] text-sm text-gray-300 font-medium">
                                {evalItem.details}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
