import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const Column = ({ id, title, tasks, onAddTask }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="column">
      <div className="column-header">
        <h3>{title}</h3>
        <button className="add-task-btn" onClick={onAddTask}>
          +
        </button>
      </div>

      <div ref={setNodeRef} className="column-content">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              content={task.content}
              isBaseline={task.isBaseline}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default Column;
