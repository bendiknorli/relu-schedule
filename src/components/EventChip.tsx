import * as React from "react";
import { type Event, type EventType } from "../types";
import { Popover, PopoverContent } from "./ui/popover";

function getEventChipClass(type: EventType): string {
    switch (type) {
        case "KICKOFF":
            return "event-chip kickoff";
        case "WORK WEEKEND":
            return "event-chip work-weekend";
        case "BOOTCAMP":
            return "event-chip bootcamp";
        case "EDUCATION":
            return "event-chip education";
        case "TOWN HALL":
            return "event-chip town-hall";
        case "DEMO":
            return "event-chip demo";
        default:
            return "event-chip";
    }
}

function getTypeLabelClass(type: EventType): string {
    switch (type) {
        case "KICKOFF":
            return "event-type-label kickoff";
        case "WORK WEEKEND":
            return "event-type-label work-weekend";
        case "BOOTCAMP":
            return "event-type-label bootcamp";
        case "EDUCATION":
            return "event-type-label education";
        case "TOWN HALL":
            return "event-type-label town-hall";
        case "DEMO":
            return "event-type-label demo";
        default:
            return "event-type-label";
    }
}

export function EventChip({ event }: { event: Event }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);

    const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = (e) => {
        setPos({ x: e.clientX, y: e.clientY });
        if (event.subtopics) setOpen(true);
    };
    const onMouseLeave = () => setOpen(false);

    return (
        <Popover>
            <div
                ref={ref}
                tabIndex={0}
                aria-label={`${event.type}: ${event.topic}`}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onFocus={() => event.subtopics && setOpen(true)}
                onBlur={() => setOpen(false)}
                className={getEventChipClass(event.type)}
            >
                <span className={getTypeLabelClass(event.type)}>
                    {event.type}
                </span>
                <div className="font-semibold">{event.topic}</div>
            </div>

            {open && event.subtopics && (
                <PopoverContent
                    className="popover"
                    style={{
                        left: (pos?.x ?? 0) + 8,
                        top: (pos?.y ?? 0) + 8,
                    }}
                >
                    <div>{formatSubtopics(event.subtopics)}</div>
                </PopoverContent>
            )}
        </Popover>
    );
}

function formatSubtopics(text: string) {
    const parts = text
        .split(/;|\n/g)
        .map((s) => s.trim())
        .filter(Boolean);
    return parts.join("\n");
}
