import React from 'react';
import { Calendar } from 'lucide-react';

interface DateSelectorProps {
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

export function DateSelector({ selectedDate, onSelectDate }: DateSelectorProps) {
    const dates = [
        { label: 'Hoy', value: 'today', isHighlight: true },
        { label: 'Mañana', value: 'tomorrow' },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date) => (
                <button
                    key={date.value}
                    onClick={() => onSelectDate(date.value)}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
            ${selectedDate === date.value
                            ? 'bg-bet-green text-[#0b0c10] shadow-[0_0_12px_rgba(0,255,136,0.3)]'
                            : 'bg-[#151820] text-gray-400 hover:bg-[#1f232e] hover:text-white border border-[#232733]'
                        }`}
                >
                    {date.label}
                </button>
            ))}
        </div>
    );
}
