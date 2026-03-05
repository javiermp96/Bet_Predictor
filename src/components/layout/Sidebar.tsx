import React from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutGrid, Target, TrendingUp, History, CalendarRange } from 'lucide-react';

export function Sidebar() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentLeague = searchParams.get('league') || 'Todas';
    const getNavClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${isActive
            ? 'bg-bet-green/10 text-bet-green shadow-[inset_2px_0_0_0_#00ff88]'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`;

    return (
        <aside className="w-64 border-r border-[#232733] hidden lg:flex flex-col p-4 gap-2 bg-[#0b0c10]/80 backdrop-blur">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Navegación</div>
            <NavLink to="/" className={getNavClass}>
                <LayoutGrid size={18} />
                Dashboard AI
            </NavLink>
            <NavLink to="/value-bets" className={getNavClass}>
                <Target size={18} />
                Value Bets
            </NavLink>
            <NavLink to="/trends" className={getNavClass}>
                <TrendingUp size={18} />
                Tendencias
            </NavLink>


            <div className="mt-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Competiciones Top 6</div>
            <div className="flex flex-col gap-1">
                {['Champions League', 'Premier League', 'LaLiga', 'Serie A', 'Bundesliga', 'Ligue 1'].map(league => (
                    <button
                        key={league}
                        onClick={() => navigate(`/?league=${encodeURIComponent(league)}`)}
                        className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors group ${currentLeague === league
                                ? 'bg-bet-green/10 text-bet-green shadow-[inset_2px_0_0_0_#00ff88]'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <span className="truncate">{league}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${currentLeague === league
                                ? 'bg-bet-green text-[#0b0c10]'
                                : 'bg-white/5 group-hover:bg-bet-green/20 group-hover:text-bet-green'
                            }`}>En vivo</span>
                    </button>
                ))}
            </div>
        </aside>
    );
}
