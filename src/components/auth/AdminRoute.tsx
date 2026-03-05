import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AdminRoute() {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-bet-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If no user or NOT admin, boot to dashboard
    if (!user || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
