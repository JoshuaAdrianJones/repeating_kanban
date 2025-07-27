import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TaskCard from '../TaskCard'

// Mock @dnd-kit/sortable since it requires a DndContext
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  })
}))

describe('TaskCard', () => {
  it('renders task content correctly', () => {
    const taskContent = 'Test task content'
    render(<TaskCard id="test-1" content={taskContent} />)
    
    expect(screen.getByText(taskContent)).toBeInTheDocument()
  })

  it('applies correct CSS class', () => {
    const taskContent = 'Test task'
    render(<TaskCard id="test-1" content={taskContent} />)
    
    const taskElement = screen.getByText(taskContent)
    expect(taskElement).toHaveClass('task-card')
  })

  it('renders multiple task cards with different content', () => {
    const { rerender } = render(<TaskCard id="test-1" content="First task" />)
    expect(screen.getByText('First task')).toBeInTheDocument()

    rerender(<TaskCard id="test-2" content="Second task" />)
    expect(screen.getByText('Second task')).toBeInTheDocument()
  })
})