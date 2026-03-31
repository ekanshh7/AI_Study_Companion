import { useCallback } from "react";
import { useStudy } from "../context/StudyContext.jsx";

export function useSubjects() {
  const { subjects, setSubjects, topics, setTopics, setTasks } = useStudy();

  const addSubject = useCallback(
    (subject) => {
      const id = crypto.randomUUID();
      setSubjects((prev) => [...prev, { ...subject, id }]);
    },
    [setSubjects],
  );

  const editSubject = useCallback(
    (id, updates) => {
      const prev = subjects.find((s) => s.id === id);
      const prevName = prev?.name;
      setSubjects((s) =>
        s.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      );
      if (prevName != null && updates.name != null && updates.name !== prevName) {
        setTasks((t) =>
          t.map((task) =>
            task.subject === prevName ? { ...task, subject: updates.name } : task,
          ),
        );
      }
    },
    [setSubjects, setTasks, subjects],
  );

  const deleteSubject = useCallback(
    (id) => {
      const sub = subjects.find((s) => s.id === id);
      if (!sub) return;
      setSubjects((s) => s.filter((item) => item.id !== id));
      setTopics((t) => t.filter((topic) => topic.subjectId !== id));
      setTasks((t) => t.filter((task) => task.subject !== sub.name));
    },
    [subjects, setSubjects, setTopics, setTasks],
  );

  const addTopic = useCallback(
    (topic) => {
      const id = crypto.randomUUID();
      setTopics((prev) => [...prev, { ...topic, id }]);
    },
    [setTopics],
  );

  const editTopic = useCallback(
    (id, updates) => {
      const prevTopic = topics.find((t) => t.id === id);
      const subjectName = prevTopic
        ? subjects.find((s) => s.id === prevTopic.subjectId)?.name
        : undefined;
      setTopics((t) =>
        t.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      );
      if (
        prevTopic &&
        subjectName &&
        updates.name != null &&
        updates.name !== prevTopic.name
      ) {
        setTasks((t) =>
          t.map((task) =>
            task.subject === subjectName && task.topic === prevTopic.name
              ? { ...task, topic: updates.name }
              : task,
          ),
        );
      }
    },
    [setTopics, setTasks, topics, subjects],
  );

  const deleteTopic = useCallback(
    (id) => {
      const topic = topics.find((t) => t.id === id);
      if (!topic) return;
      const subjectName = subjects.find((s) => s.id === topic.subjectId)?.name;
      setTopics((t) => t.filter((item) => item.id !== id));
      if (subjectName) {
        setTasks((t) =>
          t.filter(
            (task) =>
              !(task.subject === subjectName && task.topic === topic.name),
          ),
        );
      }
    },
    [topics, subjects, setTopics, setTasks],
  );

  return {
    subjects,
    topics,
    addSubject,
    editSubject,
    deleteSubject,
    addTopic,
    editTopic,
    deleteTopic,
  };
}
