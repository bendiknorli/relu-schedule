import * as React from "react";
import type { WeekGroup } from "../types";
import { WeekCard } from "./WeekCard";
import { formatBreadcrumb } from "../lib/dates";

interface ScheduleGridProps {
    groups: WeekGroup[];
    loading: boolean;
    error: string | null;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
    groups,
    loading,
    error,
}) => {
    const breadcrumbs = React.useMemo(() => {
        if (!groups.length) return "";
        const first = groups[0]?.week;
        const last = groups[groups.length - 1]?.week;
        const a = formatBreadcrumb(2025, first, "en-GB");
        const b = formatBreadcrumb(2025, last, "en-GB");
        return `• ${a}     —     • ${b}`;
    }, [groups]);

    return (
        <div className="container py-6">
            <header className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Education Schedule ReLU NTNU
                </h1>
                <p className="text-sm text-gray-500 mt-3">{breadcrumbs}</p>
            </header>

            {error && (
                <div
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-6 text-gray-500">
                    Loading schedule...
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                    No schedule data available.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {groups.map((g) => (
                        <WeekCard key={g.week} group={g} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScheduleGrid;
