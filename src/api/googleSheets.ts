import axios from "axios";
import {
    type Event,
    type EventType,
    type WeekGroup,
    EVENT_ORDER,
    type ScheduleEntry,
} from "../types";

const SPREADSHEET_ID = "1dc8Sylk1wYQhdFOhvQqmm1MANii94PKAPjUTh8mb6g8";
const SHEET_GID = 1788585293; // Sheet 2 in the Google Sheets (0-indexed, so 0 = first sheet, 1 = second sheet, etc.)

export async function fetchWeekGroups(): Promise<WeekGroup[]> {
    console.log("Starting Google Sheets data fetch...");

    try {
        // Method 1: Try CSV export (most reliable for public sheets)
        console.log("Attempting CSV export access...");
        try {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
            console.log("CSV URL:", csvUrl);
            const response = await axios.get(csvUrl, {
                headers: {
                    Accept: "text/csv",
                },
                timeout: 10000,
            });
            console.log("CSV export successful!");
            const csvData = parseCsvData(response.data);
            const events = processSheet(csvData);
            const weekGroups = buildWeekGroups(events);

            // Export processed data for inspection
            exportProcessedData(csvData, events, weekGroups);

            return weekGroups;
        } catch (error) {
            console.log("CSV export failed:", error);
        }
    } catch (error) {
        console.log("All Google Sheets fetch methods failed:", error);
        console.log("Using mock data as fallback");
        const mockEvents = mockEntries();
        const mockWeekGroups = buildWeekGroups(mockEvents);

        // Export mock data for inspection
        exportProcessedData([], mockEvents, mockWeekGroups);

        return mockWeekGroups;
    }
    return [];
}

// CSV → rows of fields, supports quoted multiline fields and "" escaping
function parseCsvData(csvText: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const c = csvText[i];

        if (c === '"') {
            // handle escaped quote ""
            if (inQuotes && csvText[i + 1] === '"') {
                field += '"';
                i++; // skip second quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (c === "," && !inQuotes) {
            row.push(field.trim());
            field = "";
        } else if ((c === "\n" || c === "\r") && !inQuotes) {
            // finish row on newline (ignore lone \r)
            if (c === "\r" && csvText[i + 1] === "\n") i++; // consume CRLF
            row.push(field.trim());
            rows.push(row);
            row = [];
            field = "";
        } else {
            field += c;
        }
    }

    // push last field/row if any
    if (field.length || row.length) {
        row.push(field.trim());
        rows.push(row);
    }
    return rows;
}

function processSheet(values: string[][]): Event[] {
    if (values.length < 2) return [];

    const headers = values[0].map((h) => (h ?? "").trim().toLowerCase());
    const idx = {
        week: headers.findIndex((h) => h === "week" || h.includes("week")),
        type: headers.findIndex((h) => h === "type"),
        topic: headers.findIndex((h) => h === "topic"),
        subtopics: headers.findIndex(
            (h) => h === "subtopics" || h === "subtopic"
        ),
        presenters: headers.findIndex((h) =>
            [
                "paper of the week presenters",
                "paper presenters",
                "presenters",
            ].includes(h)
        ),
    };

    const rows: ScheduleEntry[] = [];
    for (let i = 1; i < values.length; i++) {
        const row = values[i] ?? [];
        if (row.every((c) => !(c ?? "").trim())) continue;

        const entry: ScheduleEntry = {
            week: idx.week >= 0 ? row[idx.week]?.trim() : undefined,
            type: idx.type >= 0 ? row[idx.type]?.trim() : undefined,
            topic: idx.topic >= 0 ? row[idx.topic]?.trim() : undefined,
            subtopics:
                idx.subtopics >= 0 ? row[idx.subtopics]?.trim() : undefined,
            presenters:
                idx.presenters >= 0 ? row[idx.presenters]?.trim() : undefined,
        };

        rows.push(entry);
    }

    // forward-fill weeks
    let lastWeek = "";
    const filled = rows
        .map((r) => {
            const w = (r.week ?? "").trim();
            if (w) lastWeek = w;
            return { ...r, week: lastWeek } as Required<ScheduleEntry>;
        })
        .filter((r) => r.week);

    // map to Events with coercions and filtering
    const events: Event[] = [];
    for (const r of filled) {
        const weekNum = coerceWeekNumber(r.week);
        const type = normalizeType(r.type ?? "");
        const topic = (r.topic ?? "").trim();
        const subtopics = (r.subtopics ?? "").trim();
        const presenters = (r.presenters ?? "").trim();

        if (!weekNum || !type || !topic) {
            console.log(
                `Skipping row - week: ${weekNum}, type: ${type}, topic: "${topic}"`
            );
            continue;
        }

        events.push({
            week: weekNum,
            type,
            topic,
            subtopics: subtopics || undefined,
            presenters: presenters || undefined,
        });
    }

    console.log(`Final events: ${events.length}`);
    return events;
}

function coerceWeekNumber(input: string): number {
    // Accept forms like "36", "Week 36", "Uke 36", etc.
    const m = (input || "").match(/(\d{1,2})/);
    const num = m ? parseInt(m[1], 10) : NaN;
    return Number.isFinite(num) ? num : 0;
}

function normalizeType(input: string): EventType | null {
    const raw = (input || "").trim().toUpperCase();
    const norm = raw.replace(/\s+/g, " ").trim();

    const candidates: Record<string, EventType> = {
        KICKOFF: "KICKOFF",
        "WORK WEEKEND": "WORK WEEKEND",
        WORKWEEKEND: "WORK WEEKEND",
        "BOOT CAMP": "BOOTCAMP",
        BOOTCAMP: "BOOTCAMP",
        BOOTCAMPEN: "BOOTCAMP",
        "TOWN HALL": "TOWN HALL",
        TOWNHALL: "TOWN HALL",
        EDUCATION: "EDUCATION",
        LECTURE: "EDUCATION",
        DEMO: "DEMO",
        // Add more flexible matching for the exact types in the sheet
        WORKSHOP: "EDUCATION",
        SEMINAR: "EDUCATION",
        PRESENTATION: "DEMO",
        PROJECT: "WORK WEEKEND",
        ASSIGNMENT: "EDUCATION",
        // Handle variations
        "FUN INTRO": "BOOTCAMP",
        "BIG PICTURE": "BOOTCAMP",
        PITFALLS: "BOOTCAMP",
    };

    // First try exact match
    if (candidates[norm]) {
        return candidates[norm];
    }

    // Then try partial matches
    for (const [key, value] of Object.entries(candidates)) {
        if (norm.includes(key) || key.includes(norm)) {
            return value;
        }
    }

    console.log(`Unknown event type: "${input}" (normalized: "${norm}")`);
    return null;
}

function buildWeekGroups(events: Event[]): WeekGroup[] {
    const byWeek = new Map<number, Event[]>();
    for (const ev of events) {
        if (!byWeek.has(ev.week)) byWeek.set(ev.week, []);
        byWeek.get(ev.week)!.push(ev);
    }
    const groups: WeekGroup[] = Array.from(byWeek.entries()).map(
        ([week, evs]) => {
            evs.sort(
                (a, b) =>
                    EVENT_ORDER.indexOf(a.type) - EVENT_ORDER.indexOf(b.type)
            );
            return { week, events: evs };
        }
    );
    groups.sort((a, b) => a.week - b.week);
    return groups;
}

function mockEntries(): Event[] {
    return [
        {
            week: 36,
            type: "KICKOFF",
            topic: "Welcome + Intro",
            subtopics: "About ReLU; Meet the team",
        },
    ];
}

function exportProcessedData(
    rawData: string[][],
    events: Event[],
    weekGroups: WeekGroup[]
) {
    console.log("=== EXPORTING PROCESSED DATA ===");

    const exportData = {
        timestamp: new Date().toISOString(),
        rawDataInfo: {
            totalRows: rawData.length,
            firstFewRows: rawData.slice(0, 10),
        },
        processedEvents: events,
        finalWeekGroups: weekGroups,
        summary: {
            totalEvents: events.length,
            totalWeeks: weekGroups.length,
            eventsByType: events.reduce((acc, event) => {
                acc[event.type] = (acc[event.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            weekRange:
                weekGroups.length > 0
                    ? {
                          first: Math.min(...weekGroups.map((g) => g.week)),
                          last: Math.max(...weekGroups.map((g) => g.week)),
                      }
                    : null,
        },
    };

    // Log to console
    console.log("PROCESSED DATA EXPORT:", exportData);

    // Also create a simple table view
    console.log("\n=== SIMPLE TABLE VIEW ===");
    console.log("Week | Type | Topic | Presenters | Subtopics");
    console.log("-----|------|-------|------------|----------");
    events.forEach((event) => {
        console.log(
            `${event.week} | ${event.type} | ${event.topic} | ${
                (event as any).presenters || ""
            } | ${event.subtopics || ""}`
        );
    });
}
