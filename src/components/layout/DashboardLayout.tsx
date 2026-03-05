import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0b0c10] text-gray-100 font-sans selection:bg-bet-green/30 selection:text-white">
            <TopNavbar />
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
