import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import KanbanBoard from '../KanbanBoard'

// Mock the tasks.json file
vi.mock('../../data/tasks.json', () => ({
  default: {
    baseline: ['Check emails', 'Review calendar', 'Team standup', 'Process inbox'],
    monday: ['Weekly planning', 'Review metrics', 'Team sync'],
    tuesday: ['Client calls', 'Project reviews'],
    wednesday: ['Deep work block', 'Architecture review'],
    thursday: ['1:1 meetings', 'Code reviews'],
    friday: ['Week wrap-up', 'Documentation updates', 'Planning next week']
  }
}))

describe('KanbanBoard', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks()
  })

  it('renders the kanban board with 3 columns', () => {
    render(<KanbanBoard />)
    
    expect(screen.getByText('Todo')).toBeInTheDocument()
    expect(screen.getByText('Doing')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('loads baseline tasks on initial render', async () => {
    render(<KanbanBoard />)

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Check emails')).toBeInTheDocument()
    })

    expect(screen.getByText('Review calendar')).toBeInTheDocument()
    expect(screen.getByText('Team standup')).toBeInTheDocument()
    expect(screen.getByText('Process inbox')).toBeInTheDocument()
  })

  it('loads Monday tasks when it is Monday', async () => {
    // Mock Date to return Monday (day 1)
    const mockDate = new Date('2024-01-01') // This is a Monday
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate)

    render(<KanbanBoard />)

    await waitFor(() => {
      // Should have baseline tasks
      expect(screen.getByText('Check emails')).toBeInTheDocument()
      expect(screen.getByText('Review calendar')).toBeInTheDocument()
      expect(screen.getByText('Team standup')).toBeInTheDocument()
      expect(screen.getByText('Process inbox')).toBeInTheDocument()
      
      // Should also have Monday-specific tasks
      expect(screen.getByText('Weekly planning')).toBeInTheDocument()
      expect(screen.getByText('Review metrics')).toBeInTheDocument()
      expect(screen.getByText('Team sync')).toBeInTheDocument()
    })
  })

  it('loads Tuesday tasks when it is Tuesday', async () => {
    // Mock Date to return Tuesday (day 2)
    const mockDate = new Date('2024-01-02') // This is a Tuesday
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate)

    render(<KanbanBoard />)

    await waitFor(() => {
      // Should have baseline tasks
      expect(screen.getByText('Check emails')).toBeInTheDocument()
      
      // Should also have Tuesday-specific tasks
      expect(screen.getByText('Client calls')).toBeInTheDocument()
      expect(screen.getByText('Project reviews')).toBeInTheDocument()
    })
  })

  it('loads Friday tasks when it is Friday', async () => {
    // Mock Date to return Friday (day 5)
    const mockDate = new Date('2024-01-05') // This is a Friday
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate)

    render(<KanbanBoard />)

    await waitFor(() => {
      // Should have baseline tasks
      expect(screen.getByText('Check emails')).toBeInTheDocument()
      
      // Should also have Friday-specific tasks
      expect(screen.getByText('Week wrap-up')).toBeInTheDocument()
      expect(screen.getByText('Documentation updates')).toBeInTheDocument()
      expect(screen.getByText('Planning next week')).toBeInTheDocument()
    })
  })

  it('displays correct day in the title', () => {
    // Mock Date to return Wednesday
    const mockDate = new Date('2024-01-03') // This is a Wednesday
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate)

    render(<KanbanBoard />)

    expect(screen.getByText('Daily Kanban - Wednesday')).toBeInTheDocument()
  })

  it('all tasks start in the Todo column', async () => {
    render(<KanbanBoard />)

    await waitFor(() => {
      expect(screen.getByText('Check emails')).toBeInTheDocument()
    })

    // Find the Todo column
    const todoColumn = screen.getByText('Todo').closest('.column')
    
    // Check that baseline tasks are in the Todo column
    expect(todoColumn).toContainElement(screen.getByText('Check emails'))
    expect(todoColumn).toContainElement(screen.getByText('Review calendar'))
    expect(todoColumn).toContainElement(screen.getByText('Team standup'))
    expect(todoColumn).toContainElement(screen.getByText('Process inbox'))
  })

  it('Doing and Done columns start empty', () => {
    render(<KanbanBoard />)

    const doingColumn = screen.getByText('Doing').closest('.column')
    const doneColumn = screen.getByText('Done').closest('.column')

    // These columns should only contain their headers and add buttons
    expect(doingColumn.querySelectorAll('.task-card')).toHaveLength(0)
    expect(doneColumn.querySelectorAll('.task-card')).toHaveLength(0)
  })

  it('handles weekend days gracefully', async () => {
    // Mock Date to return Saturday (day 6)
    const mockDate = new Date('2024-01-06') // This is a Saturday
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate)

    render(<KanbanBoard />)

    await waitFor(() => {
      // Should still have baseline tasks even on weekends
      expect(screen.getByText('Check emails')).toBeInTheDocument()
      expect(screen.getByText('Review calendar')).toBeInTheDocument()
      expect(screen.getByText('Team standup')).toBeInTheDocument()
      expect(screen.getByText('Process inbox')).toBeInTheDocument()
    })

    // Should not have any specific weekday tasks
    expect(screen.queryByText('Weekly planning')).not.toBeInTheDocument()
    expect(screen.queryByText('Client calls')).not.toBeInTheDocument()
  })
})