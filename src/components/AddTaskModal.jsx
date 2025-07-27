import { useState } from 'react';

const AddTaskModal = ({ onClose, onAdd, column }) => {
  const [taskContent, setTaskContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskContent.trim()) {
      onAdd(taskContent.trim());
      setTaskContent('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add Task to {column.charAt(0).toUpperCase() + column.slice(1)}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            placeholder="Enter task name..."
            autoFocus
          />
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={!taskContent.trim()}>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
