import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskCard from '../TaskCard';

describe('TaskCard Styling', () => {
  it('renders baseline tasks with correct styling', () => {
    render(<TaskCard id="test-1" content="Baseline task" isBaseline={true} />);

    const taskContent = screen.getByText('Baseline task');
    const taskCard = taskContent.closest('.task-card');
    const badge = screen.getByText('Routine');

    expect(taskCard).toHaveClass('task-card--baseline');
    expect(badge).toHaveClass('task-card__badge');
    expect(badge).toBeInTheDocument();
  });

  it('renders custom tasks without badge', () => {
    render(<TaskCard id="test-1" content="Custom task" isBaseline={false} />);

    const taskContent = screen.getByText('Custom task');
    const taskCard = taskContent.closest('.task-card');

    expect(taskCard).toHaveClass('task-card--custom');
    expect(screen.queryByText('regular')).not.toBeInTheDocument();
  });

  it('defaults to custom task when isBaseline not provided', () => {
    render(<TaskCard id="test-1" content="Default task" />);

    const taskContent = screen.getByText('Default task');
    const taskCard = taskContent.closest('.task-card');

    expect(taskCard).toHaveClass('task-card--custom');
    expect(screen.queryByText('regular')).not.toBeInTheDocument();
  });

  it('has correct structure with content and badge', () => {
    render(<TaskCard id="test-1" content="Test content" isBaseline={true} />);

    const taskCard = screen.getByText('Test content').closest('.task-card');
    const content = taskCard?.querySelector('.task-card__content');
    const badge = taskCard?.querySelector('.task-card__badge');

    expect(content).toBeInTheDocument();
    expect(badge).toBeInTheDocument();
    expect(content).toHaveTextContent('Test content');
    expect(badge).toHaveTextContent('Routine');
  });
});
