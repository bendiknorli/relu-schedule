import axios from 'axios';
import type { GoogleSheetsResponse, ScheduleEntry, ProcessedScheduleEntry } from './types';

const SPREADSHEET_ID = '1dc8Sylk1wYQhdFOhvQqmm1MANii94PKAPjUTh8mb6g8';
const SHEET_GID = '1826657223';
const RANGE = 'A1:Z1000';

// Google Sheets API v4 endpoint for public sheets
const SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}`;

/**
 * Fetch data from Google Sheets API
 */
export async function fetchScheduleData(): Promise<ProcessedScheduleEntry[]> {
  try {
    // For public sheets, we can use the API without authentication
    // If the sheet is private, you would need to add ?key=YOUR_API_KEY
    const response = await axios.get<GoogleSheetsResponse>(SHEETS_API_URL);
    
    if (!response.data.values || response.data.values.length === 0) {
      throw new Error('No data found in the spreadsheet');
    }

    return processSheetData(response.data.values);
  } catch (error) {
    console.error('Error fetching schedule data:', error);
    
    // Fallback: try with a public access approach
    try {
      const publicUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
      const csvResponse = await axios.get(publicUrl);
      return processCsvData(csvResponse.data);
    } catch (csvError) {
      console.error('Error with CSV fallback:', csvError);
      // Return mock data for development
      return getMockData();
    }
  }
}

/**
 * Process raw sheet data into structured format
 */
function processSheetData(values: string[][]): ProcessedScheduleEntry[] {
  if (values.length === 0) return [];

  // Find column indices (case-insensitive)
  const headers = values[0].map(h => h?.toLowerCase().trim() || '');
  const weekIndex = headers.findIndex(h => h.includes('week'));
  const typeIndex = headers.findIndex(h => h.includes('type'));
  const topicIndex = headers.findIndex(h => h.includes('topic'));
  const subtopicsIndex = headers.findIndex(h => h.includes('subtopic'));

  console.log('Column indices:', { weekIndex, typeIndex, topicIndex, subtopicsIndex });

  const entries: ScheduleEntry[] = [];
  
  // Process data rows (skip header)
  for (let i = 1; i < values.length; i++) {
    const row = values[i] || [];
    
    // Skip empty rows
    if (row.every(cell => !cell?.trim())) continue;

    const entry: ScheduleEntry = {
      week: weekIndex >= 0 ? row[weekIndex]?.trim() : undefined,
      type: typeIndex >= 0 ? row[typeIndex]?.trim() : undefined,
      topic: topicIndex >= 0 ? row[topicIndex]?.trim() : undefined,
      subtopics: subtopicsIndex >= 0 ? row[subtopicsIndex]?.trim() : undefined,
    };

    entries.push(entry);
  }

  return forwardFillWeeks(entries);
}

/**
 * Process CSV data as fallback
 */
function processCsvData(csvData: string): ProcessedScheduleEntry[] {
  const lines = csvData.split('\n').map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
  return processSheetData(lines);
}

/**
 * Forward-fill missing Week values from the last seen row
 */
function forwardFillWeeks(entries: ScheduleEntry[]): ProcessedScheduleEntry[] {
  let lastWeek = '';
  
  return entries.map(entry => {
    if (entry.week && entry.week.trim()) {
      lastWeek = entry.week.trim();
    }
    
    return {
      ...entry,
      week: lastWeek,
    } as ProcessedScheduleEntry;
  }).filter(entry => entry.week); // Only include entries with a week value
}

/**
 * Mock data for development/fallback
 */
function getMockData(): ProcessedScheduleEntry[] {
  return [
    {
      week: 'Week 1',
      type: 'Lecture',
      topic: 'Introduction to Machine Learning',
      subtopics: 'Overview, History, Applications'
    },
    {
      week: 'Week 1',
      type: 'Lab',
      topic: 'Python Basics',
      subtopics: 'NumPy, Pandas, Matplotlib'
    },
    {
      week: 'Week 2',
      type: 'Lecture',
      topic: 'Linear Regression',
      subtopics: 'Theory, Implementation, Evaluation'
    },
    {
      week: 'Week 2',
      type: 'Assignment',
      topic: 'Implement Linear Regression',
      subtopics: 'From scratch, Scikit-learn comparison'
    },
    {
      week: 'Week 3',
      type: 'Lecture',
      topic: 'Neural Networks',
      subtopics: 'Perceptron, Backpropagation, ReLU'
    },
    {
      week: 'Week 3',
      type: 'Lab',
      topic: 'Neural Network Implementation',
      subtopics: 'TensorFlow, PyTorch basics'
    },
  ];
}