# ReLU NTNU — Education Schedule (Fall 2025)

A responsive React + TypeScript application built with Vite that displays the ReLU NTNU education schedule in a calendar-like grid format.

## Features

- 📅 **Responsive Calendar Grid**: Displays schedule data in an organized weekly view
- 🔗 **Google Sheets Integration**: Fetches live data from Google Sheets API v4
- 📱 **Mobile-First Design**: Fully responsive design that works on all devices
- 🎨 **Color-Coded Activities**: Different activity types (Lecture, Lab, Assignment, etc.) are visually distinguished
- 🔄 **Graceful Fallback**: Shows mock data when Google Sheets API is unavailable
- ⚡ **Fast Performance**: Built with Vite for optimal development and production performance

## Data Source

- **Spreadsheet ID**: `1dc8Sylk1wYQhdFOhvQqmm1MANii94PKAPjUTh8mb6g8`
- **Sheet GID**: `1826657223`
- **Range**: `A1:Z1000`
- **Columns**: Week, Type, Topic, Subtopics (case-insensitive)

The application automatically forward-fills missing Week values from the last seen row.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

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

- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API requests
- **CSS3**: Custom responsive styling with CSS Grid and Flexbox

## Project Structure

```
src/
├── components/
│   ├── ScheduleGrid.tsx    # Main schedule grid component
│   └── ScheduleGrid.css    # Styling for the grid
├── api.ts                  # Google Sheets API integration
├── types.ts               # TypeScript type definitions
├── App.tsx                # Main application component
├── App.css                # Application styles
├── index.css              # Global styles
└── main.tsx               # Application entry point
```

## API Integration

The application attempts to fetch data from Google Sheets using multiple approaches:

1. **Primary**: Google Sheets API v4 (requires public access or API key)
2. **Fallback**: CSV export from Google Sheets
3. **Development**: Mock data for offline development

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.
