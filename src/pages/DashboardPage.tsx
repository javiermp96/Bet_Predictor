import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Match, Prediction } from '../types';
import { getLiveFixtures, getMatchPredictionStats } from '../services/apiFootballService';
import { MatchFilterZone } from '../components/ui/MatchFilterZone';
import { MatchList } from '../components/ui/MatchList';

export function DashboardPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
    const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState('today');
    const [searchParams, setSearchParams] = useSearchParams();
    const currentLeague = searchParams.get('league') || 'Todas';
    const setCurrentLeague = (league: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('league', league);
        setSearchParams(params);
    };

    const [errorStatus, setErrorStatus] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLiveGames() {
            try {
                setLoading(true);
                setErrorStatus(null);

                let dateFilter = new Date().toISOString().split('T')[0];
                if (selectedDate === 'yesterday') {
                    const d = new Date(); d.setDate(d.getDate() - 1);
                    dateFilter = d.toISOString().split('T')[0];
                } else if (selectedDate === 'tomorrow') {
                    const d = new Date(); d.setDate(d.getDate() + 1);
                    dateFilter = d.toISOString().split('T')[0];
                }

                // Cero Mocks: Hit the real API Football service
                const liveMatches = await getLiveFixtures(dateFilter);

                if (liveMatches.length === 0) {
                    setErrorStatus('No se encontraron partidos para las ligas Top Europeas en esta fecha, o falta la API Key en .env.local');
                }

                setMatches(liveMatches);
            } catch (error) {
                console.error("Error fetching live fixtures:", error);
                setErrorStatus('Error de conexión con la API de deportes.');
            } finally {
                setLoading(false);
            }
        }
        fetchLiveGames();
    }, [selectedDate]);

    const handleAnalyze = async (match: Match) => {
        if (analyzingIds.has(match.id.toString())) return;

        setAnalyzingIds(prev => new Set(prev).add(match.id.toString()));
        try {
            // Hit real prediction logic API
            const predictionResponse = await getMatchPredictionStats(match.id.toString());
            if (predictionResponse) {
                setPredictions(prev => ({ ...prev, [match.id.toString()]: predictionResponse }));
            } else {
                alert("Análisis matemático no disponible para este partido.");
            }
        } catch (error) {
            console.error("Error analyzing match stats:", error);
        } finally {
            setAnalyzingIds(prev => {
                const next = new Set(prev);
                next.delete(match.id.toString());
                return next;
            });
        }
    };

    const filteredMatches = matches.filter(match => {
        let matchLeagueName = typeof match.league === 'string' ? match.league : match.league?.name || '';
        matchLeagueName = matchLeagueName.replace(/\s+/g, '').toLowerCase(); // Normalize "La Liga" to "laliga"

        const filterStr = currentLeague.replace(/\s+/g, '').toLowerCase();

        if (currentLeague !== 'Todas' && currentLeague !== 'Top 6') {
            if (!matchLeagueName.includes(filterStr)) return false;
        }
        return true;
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MatchFilterZone
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                currentLeague={currentLeague}
                onSelectLeague={setCurrentLeague}
            />

            {errorStatus && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 font-medium text-sm">
                    {errorStatus}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-[300px] bg-[#0f1115] border border-[#2a2e39] rounded-2xl animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <MatchList
                    matches={filteredMatches}
                    predictions={predictions}
                    analyzingIds={analyzingIds}
                    onAnalyze={handleAnalyze}
                />
            )}
        </div>
    );
}
