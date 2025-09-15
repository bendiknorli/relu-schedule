# ReLU NTNU — Education Schedule (Fall 2025)

A responsive React + TypeScript application (Vite) that displays the ReLU NTNU education schedule in a calendar-like grid, sourced from Google Sheets.

## Features

-   📅 **Responsive Calendar Grid**: Displays schedule data in an organized weekly view
-   🔗 **Google Sheets Integration**: Fetches live data from Google Sheets API v4
-   📱 **Mobile-First Design**: Fully responsive design that works on all devices
-   🎨 **Color-Coded Activities**: Chip labels by type (Kickoff, Bootcamp, Town Hall, Education, Work Weekend, Demo)
-   🔄 **Graceful Fallback**: Uses a small mock when Google Sheets API key is missing/unavailable
-   ⚡ **Fast Performance**: Built with Vite for optimal development and production performance

## Data Source

-   **Spreadsheet ID**: `1dc8Sylk1wYQhdFOhvQqmm1MANii94PKAPjUTh8mb6g8`
-   **Sheet GID**: `1826657223`
-   **Range**: `A1:Z1000`
-   **Columns**: Week, Type, Topic, Subtopics (case-insensitive)

The application forward-fills missing Week values from the last seen row.

## Getting Started

### Prerequisites

-   Node.js (version 16 or higher)
-   npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/bendiknorli/relu-schedule.git
cd relu-schedule
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Environment

Copy `.env.example` to `.env` and add your Google Sheets API key:

```
VITE_GOOGLE_SHEETS_API_KEY=your_key_here
```

If missing, the app will render a minimal mock schedule.

### Building for Production

```bash
npm run build
```

The built files will be available in the `dist` directory.

### Linting

```bash
npm run lint
```

## Technology Stack

-   **React 19**: Modern React with hooks
-   **TypeScript**: Type-safe development
-   **Vite**: Fast build tool and development server
-   **Axios**: HTTP client for API requests
-   **TailwindCSS**: Utility-first styling with responsive grid

## Project Structure

```
src/
├── api/
│   └── googleSheets.ts      # Fetch/transform from Google Sheets
├── components/
│   ├── EventChip.tsx        # Event chip with hover/focus popover
│   ├── Legend.tsx           # Type color keys
│   ├── WeekCard.tsx         # Week card with events
│   ├── ScheduleGrid.tsx     # Grid + title + breadcrumbs
│   └── ui/
│       ├── badge.tsx
│       ├── card.tsx
│       └── popover.tsx
├── lib/
│   └── utils.ts             # cn helper
├── types.ts                 # Event types and ordering
├── App.tsx                  # App + filter input
├── index.css                # Tailwind setup
└── main.tsx                 # App entry
```

## API Integration

The application attempts to fetch data from Google Sheets using multiple approaches:

1. **Primary**: Google Sheets API v4 (API key via `VITE_GOOGLE_SHEETS_API_KEY`)
2. **Fallback**: A minimal mock dataset for offline/no-key use

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.
