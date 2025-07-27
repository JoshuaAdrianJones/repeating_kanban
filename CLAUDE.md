# Daily Kanban Task Manager - Claude Instructions

## Project Overview
This is a React + Vite kanban board application for managing daily tasks with automatic day-of-week task loading and daily reset functionality.

## Key Features
- 3-column kanban board (Todo, Doing, Done)
- Day-of-week specific task loading (baseline + daily tasks)
- Automatic daily reset at midnight
- Drag & drop functionality using @dnd-kit
- Custom task creation via modal
- Clean light theme design
- Responsive layout

## Project Structure
```
src/
├── components/
│   ├── KanbanBoard.jsx    # Main kanban component with drag/drop logic
│   ├── Column.jsx         # Individual column component
│   ├── TaskCard.jsx       # Draggable task card component
│   └── AddTaskModal.jsx   # Modal for adding custom tasks
├── data/
│   └── tasks.json         # Task configuration file
├── App.jsx                # Main app component
├── App.css               # Application styles
└── index.css             # Global styles
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
- **Styling**: Main styles in `src/App.css`, global styles in `src/index.css`
- **Daily Reset**: Uses localStorage to track last reset date

## Dependencies
- React 18+ with Vite
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities for drag & drop
- Standard Vite React template dependencies

## Testing
- **Framework**: Vitest with jsdom environment
- **Libraries**: @testing-library/react, @testing-library/jest-dom
- **Coverage**: Tests for task loading, day-of-week logic, component rendering
- **Test Files**: `src/components/__tests__/`

## Notes
- Uses Vite v5 for better Node.js compatibility
- Light theme with blue accent colors (#3498db, #2c3e50)
- Mobile responsive design
- Task cards have proper contrast (dark text on white background)
- Board automatically resets each new day based on system date
- Tasks load immediately on component mount and check for daily reset