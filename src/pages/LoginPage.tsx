import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function LoginPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                // Succesful login redirects to home by the ProtectedRoute evaluation 
                navigate('/');
            } else {
                const { data: authData, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;

                alert("!Registro exitoso! Ya puedes iniciar sesión.");
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message || 'Error de autenticación ocurrido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-bet-green/10 blur-[120px] rounded-full mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
            </div>

            <div className="w-full max-w-md bg-[#12141a]/90 backdrop-blur-xl border border-[#232733] rounded-3xl p-8 shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-bet-green to-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)] mb-4">
                        <Trophy size={32} className="text-[#0f1115] fill-current" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase text-center flex flex-col items-center">
                        Futbol<span className="text-bet-green">Predictor</span>
                        <span className="text-xs tracking-widest text-gray-500 font-bold mt-1 bg-white/5 py-1 px-3 rounded-full border border-white/10">ACCESO AUTORIZADO</span>
                    </h1>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium p-4 rounded-xl mb-6 text-center animate-pulse flex items-center justify-center gap-2">
                        <Activity size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2 block">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0b0c10] border-2 border-[#232733] text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bet-green transition-colors font-medium placeholder:text-gray-600"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2 block">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0b0c10] border-2 border-[#232733] text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bet-green transition-colors font-medium placeholder:text-gray-600"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-bet-green hover:bg-emerald-500 text-[#0b0c10] font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-[#0b0c10] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                </form>

                <div className="mt-8 text-center pt-6 border-t border-[#232733]">
                    <p className="text-gray-500 text-sm">
                        {isLogin ? "¿No tienes una cuenta?" : "¿Ya estás registrado?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-bet-green font-bold ml-2 hover:underline tracking-wide"
                        >
                            {isLogin ? "Regístrate" : "Ingresa aquí"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
