# Daily Kanban Task Manager - Claude Instructions

## Project Overview
This is a React + Vite kanban board application for managing daily tasks with automatic day-of-week task loading and daily reset functionality.

## Key Features
- **Daily Kanban Board**: 3-column kanban (Todo, Doing, Done) with day-of-week specific task loading
- **Weekly Kanban Board**: Separate 3-column board for weekly goals and tasks
- **Dual Board Layout**: Both boards fit in one viewport for complete task overview
- **Automatic Resets**: Daily board resets each day, weekly board resets each week
- **Drag & Drop**: Full drag and drop functionality using @dnd-kit for both boards
- **Custom Task Creation**: Add custom tasks to any column via modal
- **Clean Light Theme**: Professional design with blue accent colors
- **Responsive Layout**: Works on desktop and mobile devices

## Project Structure
```
src/
├── components/
│   ├── KanbanBoard.jsx       # Daily kanban component with drag/drop logic
│   ├── WeeklyKanbanBoard.jsx # Weekly kanban component
│   ├── Column.jsx            # Individual column component (shared)
│   ├── TaskCard.jsx          # Draggable task card component (shared)
│   ├── AddTaskModal.jsx      # Modal for adding custom tasks (shared)
│   └── __tests__/            # Test files for all components
├── data/
│   └── tasks.json            # Task configuration file (daily + weekly)
├── App.jsx                   # Main app component
├── App.css                  # Application styles
└── index.css                # Global styles
```

## Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui
```

## Configuration
- **Task Data**: Edit `src/data/tasks.json` to customize daily/weekly tasks
  - `daily.baseline`: Tasks that appear every day
  - `daily.monday` through `daily.friday`: Day-specific tasks
  - `weekly`: Weekly goals/tasks (2-3 recommended)
- **Styling**: Main styles in `src/App.css`, global styles in `src/index.css`
- **Reset Logic**: 
  - Daily board resets each day using localStorage tracking
  - Weekly board resets each week using week number calculation

## Dependencies
- React 18+ with Vite
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities for drag & drop
- Standard Vite React template dependencies

## Testing
- **Framework**: Vitest with jsdom environment
- **Libraries**: @testing-library/react, @testing-library/jest-dom
- **Coverage**: 25 tests covering both daily and weekly kanban functionality
  - Task loading and rendering
  - Day-of-week and week number logic
  - Component interactions and drag/drop
  - Data structure changes and edge cases
- **Test Files**: `src/components/__tests__/`

## Notes
- Uses Vite v5 for better Node.js compatibility
- Light theme with blue accent colors (#3498db, #2c3e50)
- **Dual Board Layout**: Both daily and weekly boards fit in one viewport height
- Mobile responsive with stacked layout on smaller screens
- Task cards have proper contrast (dark text on white background)
- **Smart Reset Logic**: 
  - Daily board resets each new day based on system date
  - Weekly board resets each new week based on week number calculation
- Tasks load immediately on component mount
- Shared components (Column, TaskCard, AddTaskModal) for code reusability