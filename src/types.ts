export type EventType =
    | "KICKOFF"
    | "WORK WEEKEND"
    | "BOOTCAMP"
    | "TOWN HALL"
    | "EDUCATION"
    | "DEMO";

export type Event = {
    week: number; // ISO week number
    type: EventType;
    topic: string;
    subtopics?: string;
};

export type WeekGroup = {
    week: number;
    events: Event[];
};

// Legacy/processing helpers (used internally by API transformation)
export interface ScheduleEntry {
    week?: string;
    type?: string;
    topic?: string;
    subtopics?: string;
}

export interface GoogleSheetsResponse {
    values?: string[][];
}

export const EVENT_ORDER: EventType[] = [
    "KICKOFF",
    "BOOTCAMP",
    "TOWN HALL",
    "EDUCATION",
    "WORK WEEKEND",
    "DEMO",
];
