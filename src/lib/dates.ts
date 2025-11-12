const DEFAULT_LOCALE = "en-US";

// Week 5 starts on Monday, January 26, 2026
const WEEK_5_START = new Date(Date.UTC(2026, 0, 26)); // January 26, 2026 (Monday)

export function startOfISOWeek(week: number): Date {
  // Custom week calculation: Week 5 = Monday, January 26, 2026
  const weekOffset = week - 5;
  const start = new Date(WEEK_5_START);
  start.setUTCDate(WEEK_5_START.getUTCDate() + weekOffset * 7);
  return start;
}

export function endOfISOWeek(week: number): Date {
  const start = startOfISOWeek(week);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6); // Sunday (6 days after Monday start)
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

export function formatRange(week: number, locale: string = DEFAULT_LOCALE) {
  const start = startOfISOWeek(week);
  const end = endOfISOWeek(week);
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
  week: number,
  locale: string = DEFAULT_LOCALE
) {
  const start = startOfISOWeek(week);
  const startStr = formatDate(
    start,
    { month: "short", day: "numeric" },
    locale
  );
  return `Week ${week} (${startStr})`;
}
