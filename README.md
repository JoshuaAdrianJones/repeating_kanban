# Daily Kanban Task Manager

A React-based dual kanban board application for managing both daily tasks and weekly goals with automatic reset functionality.

## Features

- **Dual Board Layout**: Daily and weekly kanban boards in one viewport
- **Daily Kanban Board**: 3-column board (Todo, Doing, Done) with day-of-week specific task loading
- **Weekly Kanban Board**: Separate 3-column board for weekly goals and long-term tasks
- **Automatic Resets**: Daily board resets each day, weekly board resets each week
- **Day-of-Week Task Loading**: Automatically loads baseline tasks + day-specific tasks
- **Drag & Drop**: Full drag and drop functionality using @dnd-kit for both boards
- **Custom Tasks**: Add custom tasks to any column via modal on both boards
- **Clean Light Theme**: Professional design with blue accent colors
- **Responsive Design**: Works on desktop and mobile devices

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

## Development

### Linting & Formatting

```bash
# Run ESLint to check code quality
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check
```

### Testing

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Customizing Tasks

Edit `src/data/tasks.json` to customize both daily and weekly tasks:

```json
{
  "daily": {
    "baseline": ["Daily task 1", "Daily task 2"],
    "monday": ["Monday specific task"],
    "tuesday": ["Tuesday specific task"],
    ...
  },
  "weekly": [
    "Weekly goal 1",
    "Weekly goal 2",
    "Weekly goal 3"
  ]
}
```

- **Daily tasks**: Baseline tasks load every day + current day's specific tasks
- **Weekly tasks**: Load at the beginning of each week and persist until week reset

## How It Works

### Daily Board

- Tasks are loaded based on the current day of the week
- Automatically resets at midnight for a fresh start each day
- Combines baseline tasks (appear every day) + day-specific tasks

### Weekly Board

- Tasks load at the beginning of each week
- Automatically resets each Monday for new weekly goals
- Persists throughout the week to track longer-term objectives

### Interaction

- Drag and drop tasks between columns on both boards
- Add custom tasks using the + button in any column
- Both boards fit in one viewport for complete task overview
- Mobile responsive with stacked layout on smaller screens
