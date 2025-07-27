# Daily Kanban Task Manager

A React-based kanban board for managing daily tasks with automatic day-of-week task loading and daily reset functionality.

## Features

- **3-Column Kanban Board**: Todo, Doing, Done
- **Day-of-Week Task Loading**: Automatically loads baseline tasks + day-specific tasks
- **Daily Reset**: Board resets automatically each day
- **Drag & Drop**: Move tasks between columns
- **Custom Tasks**: Add custom tasks to any column via modal
- **Responsive Design**: Works on desktop and mobile

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

## Customizing Tasks

Edit `src/data/tasks.json` to customize your daily tasks:

```json
{
  "baseline": ["Daily task 1", "Daily task 2"],
  "monday": ["Monday specific task"],
  "tuesday": ["Tuesday specific task"],
  ...
}
```

The app will automatically load baseline tasks + current day's tasks each morning.

## How It Works

- Tasks are loaded based on the current day of the week
- The board automatically resets at midnight
- You can add custom tasks during the day using the + button
- Drag and drop tasks between columns to track progress
- All progress resets the next day for a fresh start
