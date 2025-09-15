const DEFAULT_LOCALE = "en-US";

export function startOfISOWeek(year: number, week: number): Date {
    // ISO week: week 1 is the week with Jan 4 and starts on Monday
    const simple = new Date(Date.UTC(year, 0, 4)); // Jan 4
    const dayOfWeek = simple.getUTCDay() || 7; // 1..7 (Mon..Sun)
    const mondayOfWeek1 = new Date(simple);
    mondayOfWeek1.setUTCDate(simple.getUTCDate() - dayOfWeek + 1);
    const target = new Date(mondayOfWeek1);
    target.setUTCDate(mondayOfWeek1.getUTCDate() + (week - 1) * 7);
    return target;
}

export function endOfISOWeek(year: number, week: number): Date {
    const start = startOfISOWeek(year, week);
    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 6); // Sunday
    return end;
}

export function formatDate(
    d: Date,
    opts?: Intl.DateTimeFormatOptions,
    locale: string = DEFAULT_LOCALE
) {
    return d.toLocaleDateString(
        locale,
        opts ?? { month: "short", day: "numeric" }
    );
}

export function formatRange(
    year: number,
    week: number,
    locale: string = DEFAULT_LOCALE
) {
    const start = startOfISOWeek(year, week);
    const end = endOfISOWeek(year, week);
    const startStr = formatDate(
        start,
        { month: "short", day: "numeric" },
        locale
    );
    const endStr = formatDate(
        end,
        { month: "short", day: "numeric", year: "numeric" },
        locale
    );
    return `${startStr} - ${endStr}`;
}

export function formatBreadcrumb(
    year: number,
    week: number,
    locale: string = DEFAULT_LOCALE
) {
    const start = startOfISOWeek(year, week);
    const startStr = formatDate(
        start,
        { month: "short", day: "numeric" },
        locale
    );
    return `Week ${week} (${startStr})`;
}
