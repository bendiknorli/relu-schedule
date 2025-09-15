import React from 'react';
import type { ProcessedScheduleEntry } from '../types';
import './ScheduleGrid.css';

interface ScheduleGridProps {
  entries: ProcessedScheduleEntry[];
  loading: boolean;
  error: string | null;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ entries, loading, error }) => {
  if (loading) {
    return (
      <div className="schedule-loading">
        <div className="loading-spinner"></div>
        <p>Loading schedule data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schedule-error">
        <h3>Error loading schedule</h3>
        <p>{error}</p>
        <p>Showing mock data for demonstration purposes.</p>
      </div>
    );
  }

  // Group entries by week for better organization
  const entriesByWeek = entries.reduce((acc, entry) => {
    if (!acc[entry.week]) {
      acc[entry.week] = [];
    }
    acc[entry.week].push(entry);
    return acc;
  }, {} as Record<string, ProcessedScheduleEntry[]>);

  const weeks = Object.keys(entriesByWeek).sort();

  return (
    <div className="schedule-container">
      <header className="schedule-header">
        <h1>ReLU NTNU — Education Schedule (Fall 2025)</h1>
        <p>Interactive schedule showing weekly topics and activities</p>
      </header>

      <div className="schedule-grid">
        {weeks.map(week => (
          <div key={week} className="week-section">
            <div className="week-header">
              <h2>{week}</h2>
            </div>
            <div className="week-content">
              {entriesByWeek[week].map((entry, index) => (
                <div key={index} className={`schedule-card ${entry.type?.toLowerCase() || 'default'}`}>
                  {entry.type && (
                    <div className="card-type">{entry.type}</div>
                  )}
                  {entry.topic && (
                    <div className="card-topic">{entry.topic}</div>
                  )}
                  {entry.subtopics && (
                    <div className="card-subtopics">{entry.subtopics}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="no-data">
          <p>No schedule data available.</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleGrid;