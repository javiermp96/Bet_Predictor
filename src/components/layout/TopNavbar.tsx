import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Trophy, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function TopNavbar() {
    const { user, signOut, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };
    return (
        <header className="h-16 border-b border-bet-border bg-[#0f1115]/90 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-bet-green to-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                    <Trophy size={20} className="text-[#0f1115] fill-current" />
                </div>
                <h1 className="text-xl font-black tracking-tighter">
                    FUTBOL<span className="text-bet-green">PREDICTOR</span> <span className="text-xs text-bet-green px-1 py-0.5 border border-bet-green/30 rounded ml-1 bg-bet-green/10">PRO</span>
                </h1>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <nav className="flex items-center gap-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `text-sm font-medium tracking-wide relative transition-colors ${isActive ? 'text-bet-green font-semibold' : 'text-gray-400 hover:text-white'}`}
                    >
                        {({ isActive }) => (
                            <>
                                En Vivo
                                {isActive && <span className="absolute -bottom-[21px] left-0 w-full h-[2px] bg-bet-green shadow-[0_0_8px_rgba(0,255,136,0.8)]"></span>}
                            </>
                        )}
                    </NavLink>
                    <NavLink
                        to="/upcoming"
                        className={({ isActive }) => `text-sm font-medium tracking-wide relative transition-colors ${isActive ? 'text-bet-green font-semibold' : 'text-gray-400 hover:text-white'}`}
                    >
                        {({ isActive }) => (
                            <>
                                Próximos
                                {isActive && <span className="absolute -bottom-[21px] left-0 w-full h-[2px] bg-bet-green shadow-[0_0_8px_rgba(0,255,136,0.8)]"></span>}
                            </>
                        )}
                    </NavLink>
                    <NavLink
                        to="/results"
                        className={({ isActive }) => `text-sm font-medium tracking-wide relative transition-colors ${isActive ? 'text-bet-green font-semibold' : 'text-gray-400 hover:text-white'}`}
                    >
                        {({ isActive }) => (
                            <>
                                Resultados
                                {isActive && <span className="absolute -bottom-[21px] left-0 w-full h-[2px] bg-bet-green shadow-[0_0_8px_rgba(0,255,136,0.8)]"></span>}
                            </>
                        )}
                    </NavLink>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Search size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors relative group">
                    <Bell size={20} className="group-hover:animate-swing" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0f1115]"></span>
                </button>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`ml-2 w-9 h-9 rounded-full bg-gradient-to-br border flex items-center justify-center text-white font-bold text-xs shadow-lg transition-colors ${isAdmin
                                ? 'from-red-900 to-red-950 border-red-500/50 hover:border-red-500'
                                : 'from-gray-800 to-gray-900 border-bet-border hover:border-bet-green/50'
                            }`}
                        title={user?.email || 'Usuario'}
                    >
                        {isAdmin ? <ShieldCheck size={16} className="text-red-400" /> : <UserIcon size={16} className="text-gray-300" />}
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-[#1a1d24] border border-[#232733] rounded-xl shadow-2xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-2 border-b border-[#232733] mb-2">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Conectado como:</p>
                                <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                                {isAdmin && <span className="mt-1 inline-block bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Administrador</span>}
                            </div>

                            {isAdmin && (
                                <button
                                    onClick={() => { navigate('/admin'); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                >
                                    <ShieldCheck size={16} className="text-red-400" />
                                    Panel de Control
                                </button>
                            )}

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2 mt-1"
                            >
                                <LogOut size={16} />
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
