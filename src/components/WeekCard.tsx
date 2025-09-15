import { type WeekGroup } from "../types";
import { EventChip } from "./EventChip";
import { formatRange } from "../lib/dates";

export function WeekCard({ group }: { group: WeekGroup }) {
    const count = group.events.length;
    const range = formatRange(2025, group.week, "en-GB");

    return (
        <div className="week-card">
            <div className="flex items-start gap-3 mb-3">
                <div className="week-number">{group.week}</div>
                <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                        Week {group.week}
                    </div>
                    <div className="text-xs text-gray-500">{range}</div>
                    <div className="text-xs text-gray-400 mt-1">
                        {count} event{count === 1 ? "" : "s"} scheduled
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {group.events.map((ev, i) => (
                    <EventChip key={i} event={ev} />
                ))}
            </div>
        </div>
    );
}
