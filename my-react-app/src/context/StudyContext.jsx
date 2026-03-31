import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEYS = {
  subjects: "study-companion-subjects",
  topics: "study-companion-topics",
  tasks: "study-companion-tasks",
};

function loadParsedArray(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw == null || raw === "") return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

const today = new Date();
const todayNoon = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  12,
  0,
  0,
  0,
);
const tomorrowNoon = new Date(todayNoon);
tomorrowNoon.setDate(tomorrowNoon.getDate() + 1);

const MOCK_SUBJECTS = [
  {
    id: "sub-1",
    name: "Mathematics",
    description: "Algebra, calculus, and problem sets for the semester.",
    color: "#3b82f6",
  },
  {
    id: "sub-2",
    name: "Physics",
    description: "Mechanics, waves, and lab prep.",
    color: "#a855f7",
  },
];

const MOCK_TOPICS = [
  {
    id: "top-1",
    subjectId: "sub-1",
    name: "Calculus",
    difficulty: "medium",
    status: "Needs Revision",
    notes: "Focus on derivatives and related rates this week.",
    revisionDate: todayNoon.toISOString(),
  },
  {
    id: "top-2",
    subjectId: "sub-1",
    name: "Linear Algebra",
    difficulty: "hard",
    status: "not-started",
    notes: "Review matrices before the next lecture.",
    revisionDate: tomorrowNoon.toISOString(),
  },
  {
    id: "top-3",
    subjectId: "sub-2",
    name: "Mechanics",
    difficulty: "easy",
    status: "completed",
    notes: "Newton’s laws — done; revisit friction problems before exam.",
  },
];

const MOCK_TASKS = [
  {
    id: "task-1",
    title: "Finish calculus problem set 4",
    subject: "Mathematics",
    topic: "Calculus",
    deadline: "2025-04-12T23:59:00.000Z",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "task-2",
    title: "Read linear algebra chapter 2",
    subject: "Mathematics",
    topic: "Linear Algebra",
    deadline: "2025-04-15T18:00:00.000Z",
    priority: "medium",
    status: "Needs Revision",
    revisionDate: todayNoon.toISOString(),
  },
  {
    id: "task-3",
    title: "Physics lab report draft",
    subject: "Physics",
    topic: "Mechanics",
    deadline: "2025-04-10T12:00:00.000Z",
    priority: "high",
    status: "todo",
  },
  {
    id: "task-4",
    title: "Review mechanics quiz mistakes",
    subject: "Physics",
    topic: "Mechanics",
    deadline: "2025-04-08T09:00:00.000Z",
    priority: "low",
    status: "done",
  },
  {
    id: "task-5",
    title: "Calculus exam formula sheet",
    subject: "Mathematics",
    topic: "Calculus",
    deadline: "2025-04-20T08:00:00.000Z",
    priority: "medium",
    status: "todo",
    revisionDate: tomorrowNoon.toISOString(),
  },
  {
    id: "task-6",
    title: "Peer review essay outline",
    subject: "Mathematics",
    topic: "Calculus",
    deadline: todayNoon.toISOString(),
    priority: "low",
    status: "todo",
  },
];

export const StudyContext = createContext(null);

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) {
    throw new Error("useStudy must be used within StudyProvider");
  }
  return ctx;
}

export function StudyProvider({ children }) {
  const [subjects, setSubjects] = useState(() =>
    loadParsedArray(STORAGE_KEYS.subjects, MOCK_SUBJECTS),
  );
  const [topics, setTopics] = useState(() =>
    loadParsedArray(STORAGE_KEYS.topics, MOCK_TOPICS),
  );
  const [tasks, setTasks] = useState(() =>
    loadParsedArray(STORAGE_KEYS.tasks, MOCK_TASKS),
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.subjects,
        JSON.stringify(subjects),
      );
      localStorage.setItem(STORAGE_KEYS.topics, JSON.stringify(topics));
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    } catch {
      // Quota, private mode, or serialization edge cases
    }
  }, [subjects, topics, tasks]);

  const value = useMemo(
    () => ({
      subjects,
      setSubjects,
      topics,
      setTopics,
      tasks,
      setTasks,
    }),
    [subjects, topics, tasks],
  );

  return (
    <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
  );
}
