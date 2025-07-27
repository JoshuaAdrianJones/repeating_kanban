import { describe, it, expect } from 'vitest';

// Simulate the findContainer function logic
const simulateFindContainer = (id, tasks) => {
  // Handle prefixed column IDs (e.g., "weekly-todo" -> "todo")
  const cleanId = id.startsWith('weekly-') ? id.replace('weekly-', '') : id;

  if (cleanId in tasks) {
    return cleanId;
  }

  return Object.keys(tasks).find((key) =>
    tasks[key].find((task) => task.id === id)
  );
};

describe('findContainer Logic', () => {
  const mockTasks = {
    todo: [
      { id: 'weekly-task-0', content: 'Test task 1' },
      { id: 'weekly-task-1', content: 'Test task 2' },
    ],
    doing: [],
    done: [],
  };

  it('handles weekly prefixed column IDs correctly', () => {
    // Test column ID resolution
    expect(simulateFindContainer('weekly-todo', mockTasks)).toBe('todo');
    expect(simulateFindContainer('weekly-doing', mockTasks)).toBe('doing');
    expect(simulateFindContainer('weekly-done', mockTasks)).toBe('done');
  });

  it('handles task IDs correctly', () => {
    // Test task ID resolution
    expect(simulateFindContainer('weekly-task-0', mockTasks)).toBe('todo');
    expect(simulateFindContainer('weekly-task-1', mockTasks)).toBe('todo');
  });

  it('handles non-prefixed IDs correctly', () => {
    // Test fallback for non-prefixed IDs
    expect(simulateFindContainer('todo', mockTasks)).toBe('todo');
    expect(simulateFindContainer('doing', mockTasks)).toBe('doing');
    expect(simulateFindContainer('done', mockTasks)).toBe('done');
  });

  it('returns undefined for invalid IDs', () => {
    expect(simulateFindContainer('invalid-id', mockTasks)).toBeUndefined();
    expect(simulateFindContainer('weekly-invalid', mockTasks)).toBeUndefined();
  });
});
