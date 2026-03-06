import React from 'react';
import { Search, X } from 'lucide-react';

interface MatchSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    placeholder?: string;
}

export function MatchSearchBar({ searchQuery, onSearchChange, placeholder = "Buscar por equipo (Ej: Real Madrid)..." }: MatchSearchBarProps) {
    return (
        <div className="relative w-full mb-6 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500 group-focus-within:text-bet-green transition-colors" />
            </div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 bg-[#12141a] border border-[#232733] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-bet-green focus:border-bet-green transition-all shadow-sm"
                placeholder={placeholder}
            />
            {searchQuery && (
                <button
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <X className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
                </button>
            )}
        </div>
    );
}
