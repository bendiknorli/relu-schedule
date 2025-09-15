import { useState, useEffect, useMemo } from "react";
import ScheduleGrid from "./components/ScheduleGrid";
import { fetchWeekGroups } from "./api/googleSheets";
import type { WeekGroup } from "./types";

function App() {
    const [groups, setGroups] = useState<WeekGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const loadScheduleData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchWeekGroups();
                setGroups(data);
            } catch (err) {
                console.error("Failed to load schedule data:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load schedule data"
                );
                const mockData = await fetchWeekGroups();
                setGroups(mockData);
            } finally {
                setLoading(false);
            }
        };

        loadScheduleData();
    }, []);

    const filtered = useMemo(() => {
        if (!query.trim()) return groups;
        const q = query.trim().toLowerCase();
        return groups
            .map((g) => ({
                week: g.week,
                events: g.events.filter(
                    (ev) =>
                        ev.type.toLowerCase().includes(q) ||
                        ev.topic.toLowerCase().includes(q) ||
                        ev.subtopics?.toLowerCase().includes(q) ||
                        ev.week.toString().includes(q)
                ),
            }))
            .filter((g) => g.events.length > 0);
    }, [groups, query]);

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            <div className="container pt-4 pb-2">
                <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="filter"
                >
                    Filter by type or topic
                </label>
                <input
                    id="filter"
                    aria-label="Filter by type or topic"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm"
                    style={{ maxWidth: "24rem" }}
                    placeholder="e.g., Education, Bootcamp, Intro"
                />
            </div>
            <ScheduleGrid groups={filtered} loading={loading} error={error} />
        </div>
    );
}

export default App;
