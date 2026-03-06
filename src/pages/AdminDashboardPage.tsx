import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { ShieldCheck, Mail, Calendar, Users, Activity, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserRecord {
    id: string;
    email: string;
    created_at: string;
    role?: string;
    last_sign_in_at?: string;
}

export function AdminDashboardPage() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterDate, setFilterDate] = useState<string>('');
    const [apiLimit, setApiLimit] = useState<{ remaining: number; limit: number } | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            setError(null);
            try {
                // Lectura directa desde la colección 'users'
                const { data, error } = await supabase.from('users').select('*');

                if (error) {
                    console.error("Error al leer la colección 'users' en Supabase:", error);
                    setError(`Error de base de datos (${error.code}): ${error.message}. Verifica las políticas RLS.`);
                    setUsers([]);
                } else if (data) {
                    setUsers(data);
                }

            } catch (err: any) {
                console.error("Excepción inesperada al consultar la capa de usuarios:", err);
                setError(err.message || "Un error desconocido ha ocurrido.");
            } finally {
                setLoading(false);
            }
        }

        async function fetchApiLimit() {
            const { data, error } = await supabase.from('api_cache').select('data').eq('id', 'api_limits').maybeSingle();
            if (!error && data?.data) {
                setApiLimit(data.data as { remaining: number; limit: number });
            }
        }

        fetchUsers();
        fetchApiLimit();

        // Listen to active local triggers across the page
        const handleLocalUpdate = () => fetchApiLimit();
        window.addEventListener('api-limit-updated', handleLocalUpdate);

        return () => window.removeEventListener('api-limit-updated', handleLocalUpdate);
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">

            {/* Header Admin */}
            <div className="bg-gradient-to-r from-[#0f1115] to-[#1a1d24] p-8 rounded-3xl border border-bet-border/50 shadow-2xl relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-bet-green/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-2 relative z-10">
                    <div className="w-12 h-12 bg-bet-green/10 rounded-xl flex items-center justify-center border border-bet-green/20">
                        <ShieldCheck size={28} className="text-bet-green" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Panel de Control <span className="text-bet-green">Admin</span></h1>
                        <p className="text-gray-400 font-medium">Control de accesos y monitorización de la plataforma predictiva.</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-orange-500/10 border border-orange-500/30 text-orange-400 p-4 rounded-xl mb-6 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 1. Traffic API Monitor widget */}
                <div className={`p-6 rounded-2xl border transition-all ${apiLimit?.remaining === 0 ? 'bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)] border-red-500/20' : 'bg-[#12141a] border-[#232733]'
                    }`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">
                                Peticiones API
                            </p>
                            <h3 className={`text-4xl font-black tracking-tight ${apiLimit?.remaining === 0 ? 'text-red-500' : 'text-white'
                                }`}>
                                {apiLimit ? `${apiLimit.remaining}` : '--'}
                                <span className="text-lg text-gray-500 font-bold tracking-normal">/{apiLimit?.limit || '--'}</span>
                            </h3>
                            <p className={`text-xs mt-2 font-medium ${apiLimit?.remaining === 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                Límite reinicia a las 00:00 UTC (01:00 ES)
                            </p>
                        </div>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${apiLimit?.remaining === 0 ? 'bg-red-500/10' : 'bg-bet-green/10'
                            }`}>
                            <Activity size={20} className={apiLimit?.remaining === 0 ? 'text-red-500' : 'text-bet-green'} />
                        </div>
                    </div>
                </div>

                <div className="bg-[#12141a] border border-[#232733] p-6 rounded-2xl flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Usuarios Registrados</p>
                            <h3 className="text-4xl font-black text-white">{users.length}</h3>
                        </div>
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#12141a] border border-[#232733] p-6 rounded-2xl flex flex-col justify-between items-start">
                    <div className="flex justify-between items-start w-full">
                        <div>
                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">Control Manual</p>
                            <h3 className="text-lg font-bold text-white mb-2">Refrescar Partidos</h3>
                        </div>
                        <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                            <RefreshCw size={20} className="text-orange-500" />
                        </div>
                    </div>

                    <button
                        disabled={apiLimit?.remaining === 0 || loading}
                        onClick={() => window.location.reload()}
                        className="w-full bg-[#232733] hover:bg-[#2a2f3d] disabled:opacity-50 text-white py-2 rounded-lg text-sm font-bold mt-2 transition-colors border border-gray-700"
                    >
                        {apiLimit?.remaining === 0 ? 'Bloqueado (Límite 429)' : 'Forzar Actualización UI'}
                    </button>
                </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-[#12141a] border border-[#232733] rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-5 border-b border-[#232733] flex justify-between items-center bg-[#1a1d24]">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Users size={18} className="text-gray-400" />
                        Cuentas Registradas
                    </h3>
                    <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-gray-400 hidden sm:block" />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="bg-[#0b0c10] border border-[#232733] text-gray-300 text-sm rounded-lg focus:ring-bet-green focus:border-bet-green block px-3 py-1.5 focus:outline-none"
                        />
                        {filterDate && (
                            <button onClick={() => setFilterDate('')} className="text-xs text-gray-400 hover:text-white transition-colors">Limpiar</button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0b0c10]/50 border-b border-[#232733]">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario / Correo</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Último Acceso</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#232733]">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-bet-green border-t-transparent rounded-full animate-spin"></div>
                                            Obteniendo datos de Supabase...
                                        </div>
                                    </td>
                                </tr>
                            ) : users.filter(u => filterDate ? new Date(u.created_at).toISOString().split('T')[0] === filterDate : true).length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No se encontraron usuarios para la fecha seleccionada.
                                    </td>
                                </tr>
                            ) : users.filter(u => filterDate ? new Date(u.created_at).toISOString().split('T')[0] === filterDate : true).map((u) => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shrink-0">
                                                <Mail size={14} className="text-gray-400" />
                                            </div>
                                            <span className="font-medium text-white group-hover:text-bet-green transition-colors">{u.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-medium">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-medium">
                                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(u.role === 'admin' || u.email === 'parajuegos670@gmail.com') ? (
                                            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 flex items-center gap-1 rounded text-xs font-bold w-max uppercase tracking-wider">
                                                <ShieldCheck size={12} /> Admin
                                            </span>
                                        ) : (
                                            <span className="bg-[#232733] text-gray-300 border border-gray-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                                Usuario
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
