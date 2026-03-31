import { useCallback } from "react";
import { useStudy } from "../context/StudyContext.jsx";

export function useTasks() {
  const { tasks, setTasks } = useStudy();

  const addTask = useCallback(
    (task) => {
      const id = crypto.randomUUID();
      setTasks((prev) => [...prev, { ...task, id }]);
    },
    [setTasks],
  );

  const editTask = useCallback(
    (id, updates) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      );
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (id) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks],
  );

  return {
    tasks,
    addTask,
    editTask,
    deleteTask,
  };
}
