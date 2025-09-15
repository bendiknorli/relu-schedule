export interface ScheduleEntry {
  week?: string;
  type?: string;
  topic?: string;
  subtopics?: string;
}

export interface ProcessedScheduleEntry extends ScheduleEntry {
  week: string; // Guaranteed to be present after processing
}

export interface GoogleSheetsResponse {
  values?: string[][];
}