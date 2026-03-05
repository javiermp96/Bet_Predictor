import React from 'react';
import { DateSelector } from './DateSelector';
import { LeagueTabs } from './LeagueTabs';

interface MatchFilterZoneProps {
    selectedDate: string;
    onSelectDate: (date: string) => void;
    currentLeague: string;
    onSelectLeague: (league: string) => void;
}

export function MatchFilterZone({
    selectedDate,
    onSelectDate,
    currentLeague,
    onSelectLeague
}: MatchFilterZoneProps) {
    return (
        <div className="flex flex-col gap-3 mb-6 bg-[#0f1115] p-5 rounded-2xl border border-bet-border/50 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white mb-1 flex items-center gap-2">
                        Panel de <span className="text-bet-green">Pronósticos</span>
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">
                        Mostrando las oportunidades con mayor Edge matemático.
                    </p>
                </div>
                <DateSelector selectedDate={selectedDate} onSelectDate={onSelectDate} />
            </div>
            <div className="h-[1px] w-full bg-bet-border/50 my-1"></div>
            <LeagueTabs currentLeague={currentLeague} onSelectLeague={onSelectLeague} />
        </div>
    );
}
