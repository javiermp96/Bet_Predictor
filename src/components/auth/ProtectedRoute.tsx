import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-bet-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If there's no active user session, kick them back to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated, render the child routes (e.g., DashboardLayout)
    return <Outlet />;
}
