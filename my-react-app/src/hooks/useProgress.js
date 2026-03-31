import { useMemo } from "react";
import { useStudy } from "../context/StudyContext.jsx";

function isCompletedStatus(status) {
  if (status == null) return false;
  const s = String(status).toLowerCase();
  return s === "done" || s === "completed";
}

function isRevisionStatus(status) {
  if (status == null) return false;
  const s = String(status).toLowerCase();
  return (
    s === "revision" ||
    s === "review" ||
    s === "needs revision"
  );
}

export function useProgress() {
  const { tasks } = useStudy();

  return useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => isCompletedStatus(t.status))
      .length;
    const pendingTasks = totalTasks - completedTasks;
    const revisionTasks = tasks.filter((t) => isRevisionStatus(t.status))
      .length;
    const completionPercentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      revisionTasks,
      completionPercentage,
    };
  }, [tasks]);
}
