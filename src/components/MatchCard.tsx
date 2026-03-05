import React from 'react';
import { Match, Prediction } from '../types';
import { TrendingUp, Shield, Zap, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface MatchCardProps {
  match: Match;
  prediction?: Prediction;
  onAnalyze: (match: Match) => void;
  isAnalyzing: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, prediction, onAnalyze, isAnalyzing }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bet-card border border-bet-border rounded-xl overflow-hidden hover:border-bet-green/50 transition-all duration-300 shadow-lg"
    >
      <div className="p-4 border-b border-bet-border flex justify-between items-center bg-white/5">
        <span className="text-xs font-bold text-bet-green uppercase tracking-wider">{match.league}</span>
        <span className="text-xs text-gray-400">{match.time}</span>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl font-bold">{match.homeTeam[0]}</span>
            </div>
            <span className="text-sm font-semibold text-center">{match.homeTeam}</span>
          </div>

          <div className="px-4 flex flex-col items-center">
            <span className="text-xs text-gray-500 font-mono mb-1">VS</span>
            <div className="h-px w-8 bg-bet-border"></div>
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-xl font-bold">{match.awayTeam[0]}</span>
            </div>
            <span className="text-sm font-semibold text-center">{match.awayTeam}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-bet-dark p-2 rounded border border-bet-border text-center">
            <div className="text-[10px] text-gray-500 uppercase mb-1">1</div>
            <div className="font-mono text-bet-green">{match.odds.home.toFixed(2)}</div>
          </div>
          <div className="bg-bet-dark p-2 rounded border border-bet-border text-center">
            <div className="text-[10px] text-gray-500 uppercase mb-1">X</div>
            <div className="font-mono text-bet-green">{match.odds.draw.toFixed(2)}</div>
          </div>
          <div className="bg-bet-dark p-2 rounded border border-bet-border text-center">
            <div className="text-[10px] text-gray-500 uppercase mb-1">2</div>
            <div className="font-mono text-bet-green">{match.odds.away.toFixed(2)}</div>
          </div>
        </div>

        {!prediction ? (
          <button
            onClick={() => onAnalyze(match)}
            disabled={isAnalyzing}
            className="w-full py-3 bg-bet-green text-black font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Analizando...
              </>
            ) : (
              <>
                <Zap size={18} />
                Obtener Pronóstico IA
              </>
            )}
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bet-green/10 border border-bet-green/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-bet-green">
                <Shield size={16} />
                <span className="text-xs font-bold uppercase">Pronóstico IA</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold">{prediction.confidence}%</span>
                <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-bet-green"
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="text-sm font-bold mb-1">{prediction.suggestedBet}</div>
            <p className="text-[11px] text-gray-400 leading-tight mb-3">
              {prediction.reasoning.substring(0, 100)}...
            </p>

            <div className="flex gap-2">
              <div className="flex-1 bg-black/40 p-1.5 rounded text-center">
                <div className="text-[9px] text-gray-500 uppercase">Prob. Local</div>
                <div className="text-xs font-mono">{prediction.probability.home}%</div>
              </div>
              <div className="flex-1 bg-black/40 p-1.5 rounded text-center">
                <div className="text-[9px] text-gray-500 uppercase">Empate</div>
                <div className="text-xs font-mono">{prediction.probability.draw}%</div>
              </div>
              <div className="flex-1 bg-black/40 p-1.5 rounded text-center">
                <div className="text-[9px] text-gray-500 uppercase">Visitante</div>
                <div className="text-xs font-mono">{prediction.probability.away}%</div>
              </div>
            </div>

            {/* Advanced Events Section */}
            {prediction.events && (
              <div className="mt-4 pt-4 border-t border-bet-green/20">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Eventos del Partido</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/40 p-2 rounded flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">Ambos Marcan</span>
                    <span className="text-xs font-bold text-bet-green">{prediction.events.btts}%</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">+2.5 Goles</span>
                    <span className="text-xs font-bold text-bet-green">{prediction.events.over2_5}%</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">+9.5 Córners</span>
                    <span className="text-xs font-bold text-bet-green">{prediction.events.cornersOver9_5}%</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">+4.5 Tarjetas</span>
                    <span className="text-xs font-bold text-bet-green">{prediction.events.cardsOver4_5}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Key Players Section */}
            {prediction.keyPlayers && prediction.keyPlayers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-bet-green/20">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Jugadores Clave</div>
                <div className="flex flex-col gap-1.5">
                  {prediction.keyPlayers.map((player, idx) => (
                    <div key={idx} className="bg-black/40 p-2 rounded flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Zap size={10} className="text-bet-green" />
                        <span className="text-xs font-medium text-gray-200">{player.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{player.event}</span>
                        <span className="text-xs font-bold text-bet-green bg-bet-green/10 px-1 rounded">{player.probability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
