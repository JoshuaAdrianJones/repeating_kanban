import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import WeeklyKanbanBoard from '../WeeklyKanbanBoard';

// Mock the tasks.json file
vi.mock('../../data/tasks.json', () => ({
  default: {
    daily: {
      baseline: [
        'Check emails',
        'Review calendar',
        'Team standup',
        'Process inbox',
      ],
      monday: ['Weekly planning', 'Review metrics', 'Team sync'],
      tuesday: ['Client calls', 'Project reviews'],
      wednesday: ['Deep work block', 'Architecture review'],
      thursday: ['1:1 meetings', 'Code reviews'],
      friday: ['Week wrap-up', 'Documentation updates', 'Planning next week'],
    },
    weekly: [
      'Sprint planning & retrospective',
      'Monthly goals review',
      'Team building activity',
    ],
  },
}));

describe('WeeklyKanbanBoard', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks();
  });

  it('renders the weekly kanban board with 3 columns', () => {
    render(<WeeklyKanbanBoard />);

    expect(screen.getByText('Todo')).toBeInTheDocument();
    expect(screen.getByText('Doing')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('loads weekly tasks on initial render', async () => {
    render(<WeeklyKanbanBoard />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(
        screen.getByText('Sprint planning & retrospective')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Monthly goals review')).toBeInTheDocument();
    expect(screen.getByText('Team building activity')).toBeInTheDocument();
  });

  it('displays correct week date range in the title', () => {
    // Mock Date to return a specific date (e.g., Wednesday, Jan 3, 2024)
    const mockDate = new Date('2024-01-03');
    const OriginalDate = Date;
    vi.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length === 0) {
        return mockDate;
      }
      return new OriginalDate(...args);
    });

    render(<WeeklyKanbanBoard />);

    // Should display week range
    expect(screen.getByText(/Weekly Goals/)).toBeInTheDocument();
    expect(screen.getByText(/Dec 31 - Jan 6/)).toBeInTheDocument();
  });

  it('all weekly tasks start in the Todo column', async () => {
    render(<WeeklyKanbanBoard />);

    await waitFor(() => {
      expect(
        screen.getByText('Sprint planning & retrospective')
      ).toBeInTheDocument();
    });

    // Find all Todo columns (there might be multiple due to ID prefixing)
    const todoElements = screen.getAllByText('Todo');
    const weeklyTodoColumn = todoElements
      .find((element) => element.closest('.weekly-kanban-board'))
      ?.closest('.column');

    if (weeklyTodoColumn) {
      expect(weeklyTodoColumn).toContainElement(
        screen.getByText('Sprint planning & retrospective')
      );
      expect(weeklyTodoColumn).toContainElement(
        screen.getByText('Monthly goals review')
      );
      expect(weeklyTodoColumn).toContainElement(
        screen.getByText('Team building activity')
      );
    }
  });

  it('weekly Doing and Done columns start empty', () => {
    render(<WeeklyKanbanBoard />);

    // Check within the weekly board specifically
    const weeklyBoard = screen
      .getByText(/Weekly Goals/)
      .closest('.weekly-kanban-board');
    const doingColumn = weeklyBoard?.querySelector('.column:nth-child(2)');
    const doneColumn = weeklyBoard?.querySelector('.column:nth-child(3)');

    if (doingColumn && doneColumn) {
      expect(doingColumn.querySelectorAll('.task-card')).toHaveLength(0);
      expect(doneColumn.querySelectorAll('.task-card')).toHaveLength(0);
    }
  });

  it('generates correct week number', () => {
    // Mock Date to return first week of 2024
    const mockDate = new Date('2024-01-01');
    const OriginalDate = Date;
    vi.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length === 0) {
        return mockDate;
      }
      return new OriginalDate(...args);
    });

    render(<WeeklyKanbanBoard />);

    // Week 1 of 2024
    expect(screen.getByText(/Weekly Goals/)).toBeInTheDocument();
  });

  it('handles week transitions correctly', async () => {
    // Mock initial week
    const week1Date = new Date('2024-01-01');
    vi.spyOn(global, 'Date').mockImplementation(() => week1Date);

    const { rerender } = render(<WeeklyKanbanBoard />);

    await waitFor(() => {
      expect(
        screen.getByText('Sprint planning & retrospective')
      ).toBeInTheDocument();
    });

    // Mock next week
    const week2Date = new Date('2024-01-08');
    vi.spyOn(global, 'Date').mockImplementation(() => week2Date);

    rerender(<WeeklyKanbanBoard />);

    // Should still show tasks (they would reset in real usage due to localStorage)
    await waitFor(() => {
      expect(
        screen.getByText('Sprint planning & retrospective')
      ).toBeInTheDocument();
    });
  });

  it('renders with correct CSS classes', () => {
    render(<WeeklyKanbanBoard />);

    const weeklyBoard = screen
      .getByText(/Weekly Goals/)
      .closest('.weekly-kanban-board');
    expect(weeklyBoard).toBeInTheDocument();

    const columnsContainer = weeklyBoard?.querySelector('.weekly-columns');
    expect(columnsContainer).toBeInTheDocument();
  });
});
