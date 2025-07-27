import { useState, useEffect, useCallback } from 'react';
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
} from '@dnd-kit/sortable';
import Column from './Column';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import tasksData from '../data/tasks.json';

const WeeklyKanbanBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: [],
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

  const getWeekNumber = (date = new Date()) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const getWeekDateRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    };

    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  const loadWeeklyTasks = () => {
    const weeklyTasksList = tasksData.weekly || [];

    const allTasks = weeklyTasksList.map((task, index) => ({
      id: `weekly-baseline-${index}`,
      content: task,
      isBaseline: true,
    }));

    setTasks({
      todo: allTasks,
      doing: [],
      done: [],
    });
  };

  const checkForNewWeek = useCallback(() => {
    const lastWeekReset = localStorage.getItem('lastWeekReset');
    const currentWeek = getWeekNumber();

    if (lastWeekReset !== currentWeek.toString()) {
      loadWeeklyTasks();
      localStorage.setItem('lastWeekReset', currentWeek.toString());
    }
  }, []);

  useEffect(() => {
    loadWeeklyTasks(); // Load tasks immediately on mount
    checkForNewWeek();
    // Check for new week once per day
    const interval = setInterval(checkForNewWeek, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkForNewWeek]);

  const findContainer = (id) => {
    // Handle prefixed column IDs (e.g., "weekly-todo" -> "todo")
    const cleanId = id.startsWith('weekly-') ? id.replace('weekly-', '') : id;

    if (cleanId in tasks) {
      return cleanId;
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

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setTasks((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id === over.id);

      let newIndex;
      const cleanOverId = over.id.startsWith('weekly-')
        ? over.id.replace('weekly-', '')
        : over.id;
      if (cleanOverId in prev) {
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

    const activeIndex = tasks[activeContainer].findIndex(
      (item) => item.id === active.id
    );
    const overIndex = tasks[overContainer].findIndex(
      (item) => item.id === over.id
    );

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
      id: `weekly-custom-${Date.now()}`,
      content,
      isBaseline: false,
    };

    setTasks((prev) => ({
      ...prev,
      [column]: [...prev[column], newTask],
    }));
  };

  const openModal = (column) => {
    setModalColumn(column);
    setShowModal(true);
  };

  return (
    <div className="weekly-kanban-board">
      <h2>Weekly Goals - {getWeekDateRange()}</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="columns weekly-columns">
          {Object.keys(tasks).map((columnId) => (
            <Column
              key={columnId}
              id={`weekly-${columnId}`}
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
              isBaseline={
                Object.values(tasks)
                  .flat()
                  .find((task) => task.id === activeId)?.isBaseline || false
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

export default WeeklyKanbanBoard;
