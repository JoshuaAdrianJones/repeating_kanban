import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskCard from '../TaskCard';

// Mock @dnd-kit/sortable since it requires a DndContext
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

describe('TaskCard', () => {
  it('renders task content correctly', () => {
    const taskContent = 'Test task content';
    render(<TaskCard id="test-1" content={taskContent} />);

    expect(screen.getByText(taskContent)).toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const taskContent = 'Test task';
    render(<TaskCard id="test-1" content={taskContent} />);

    const taskContentElement = screen.getByText(taskContent);
    const taskCardElement = taskContentElement.closest('.task-card');
    expect(taskCardElement).toHaveClass('task-card');
    expect(taskContentElement).toHaveClass('task-card__content');
  });

  it('renders multiple task cards with different content', () => {
    const { rerender } = render(<TaskCard id="test-1" content="First task" />);
    expect(screen.getByText('First task')).toBeInTheDocument();

    rerender(<TaskCard id="test-2" content="Second task" />);
    expect(screen.getByText('Second task')).toBeInTheDocument();
  });
});
