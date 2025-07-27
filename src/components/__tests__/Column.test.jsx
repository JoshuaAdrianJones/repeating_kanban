import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Column from '../Column'

// Mock @dnd-kit modules
vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({
    setNodeRef: () => {},
  })
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }) => children,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  })
}))

describe('Column', () => {
  const mockTasks = [
    { id: 'task-1', content: 'Test task 1' },
    { id: 'task-2', content: 'Test task 2' }
  ]

  it('renders column title correctly', () => {
    render(<Column id="todo" title="Todo" tasks={[]} onAddTask={() => {}} />)
    
    expect(screen.getByText('Todo')).toBeInTheDocument()
  })

  it('renders add task button', () => {
    render(<Column id="todo" title="Todo" tasks={[]} onAddTask={() => {}} />)
    
    const addButton = screen.getByRole('button', { name: '+' })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toHaveClass('add-task-btn')
  })

  it('renders all tasks in the column', () => {
    render(<Column id="todo" title="Todo" tasks={mockTasks} onAddTask={() => {}} />)
    
    expect(screen.getByText('Test task 1')).toBeInTheDocument()
    expect(screen.getByText('Test task 2')).toBeInTheDocument()
  })

  it('renders empty column when no tasks provided', () => {
    render(<Column id="todo" title="Todo" tasks={[]} onAddTask={() => {}} />)
    
    expect(screen.getByText('Todo')).toBeInTheDocument()
    expect(screen.queryByText('Test task 1')).not.toBeInTheDocument()
  })

  it('calls onAddTask when add button is clicked', () => {
    const mockOnAddTask = vi.fn()
    render(<Column id="todo" title="Todo" tasks={[]} onAddTask={mockOnAddTask} />)
    
    const addButton = screen.getByRole('button', { name: '+' })
    addButton.click()
    
    expect(mockOnAddTask).toHaveBeenCalledTimes(1)
  })
})