import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Column from './Column';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import tasksData from '../data/tasks.json';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: []
  });
  const [activeId, setActiveId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalColumn, setModalColumn] = useState('todo');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const loadTodaysTasks = () => {
    const today = getDayOfWeek();
    const baselineTasks = tasksData.baseline || [];
    const daySpecificTasks = tasksData[today] || [];
    
    const allTasks = [...baselineTasks, ...daySpecificTasks].map((task, index) => ({
      id: `task-${index}`,
      content: task
    }));

    setTasks({
      todo: allTasks,
      doing: [],
      done: []
    });
  };

  const checkForNewDay = () => {
    const lastResetDate = localStorage.getItem('lastResetDate');
    const today = new Date().toDateString();
    
    if (lastResetDate !== today || !lastResetDate) {
      loadTodaysTasks();
      localStorage.setItem('lastResetDate', today);
    }
  };

  useEffect(() => {
    loadTodaysTasks(); // Load tasks immediately on mount
    checkForNewDay();
    const interval = setInterval(checkForNewDay, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const findContainer = (id) => {
    if (id in tasks) {
      return id;
    }

    return Object.keys(tasks).find((key) =>
      tasks[key].find((task) => task.id === id)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setTasks((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.findIndex((item) => item.id === active.id);
      const overIndex = overItems.findIndex((item) => item.id === over.id);

      let newIndex;
      if (over.id in prev) {
        newIndex = overItems.length;
      } else {
        const isBelowLastItem = over.data.current?.sortable?.index > overIndex;
        newIndex = overIndex + (isBelowLastItem ? 1 : 0);
      }

      return {
        ...prev,
        [activeContainer]: activeItems.filter((item) => item.id !== active.id),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeItems[activeIndex],
          ...overItems.slice(newIndex),
        ],
      };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    const activeIndex = tasks[activeContainer].findIndex((item) => item.id === active.id);
    const overIndex = tasks[overContainer].findIndex((item) => item.id === over.id);

    if (activeContainer === overContainer) {
      setTasks((prev) => ({
        ...prev,
        [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
      }));
    }

    setActiveId(null);
  };

  const addCustomTask = (content, column) => {
    const newTask = {
      id: `custom-${Date.now()}`,
      content
    };

    setTasks(prev => ({
      ...prev,
      [column]: [...prev[column], newTask]
    }));
  };

  const openModal = (column) => {
    setModalColumn(column);
    setShowModal(true);
  };

  return (
    <div className="kanban-board">
      <h1>Daily Kanban - {getDayOfWeek().charAt(0).toUpperCase() + getDayOfWeek().slice(1)}</h1>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="columns">
          {Object.keys(tasks).map((columnId) => (
            <Column
              key={columnId}
              id={columnId}
              title={columnId.charAt(0).toUpperCase() + columnId.slice(1)}
              tasks={tasks[columnId]}
              onAddTask={() => openModal(columnId)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard
              id={activeId}
              content={
                Object.values(tasks)
                  .flat()
                  .find((task) => task.id === activeId)?.content || ''
              }
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onAdd={(content) => {
            addCustomTask(content, modalColumn);
            setShowModal(false);
          }}
          column={modalColumn}
        />
      )}
    </div>
  );
};

export default KanbanBoard;