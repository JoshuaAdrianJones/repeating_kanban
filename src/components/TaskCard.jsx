import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ id, content, isBaseline = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cardClass = `task-card ${isBaseline ? 'task-card--baseline' : 'task-card--custom'}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cardClass}
    >
      <div className="task-card__content">
        {content}
      </div>
      {isBaseline && (
        <div className="task-card__badge">
          regular
        </div>
      )}
    </div>
  );
};

export default TaskCard;