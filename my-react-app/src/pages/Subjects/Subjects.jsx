import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SubjectCard from "../../components/SubjectCard/SubjectCard.jsx";
import { useSubjects } from "../../hooks/useSubjects.js";
import "./Subjects.css";

const subjectSchema = yup.object({
  name: yup.string().required("Name is required").max(120),
  description: yup.string().required("Description is required").max(500),
  color: yup.string().required("Pick a color"),
});

const topicSchema = yup.object({
  subjectId: yup.string().required("Choose a subject"),
  name: yup.string().required("Topic name is required").max(120),
  difficulty: yup
    .string()
    .oneOf(["easy", "medium", "hard"], "Select difficulty")
    .required(),
  status: yup
    .string()
    .oneOf(
      [
        "not-started",
        "in-progress",
        "completed",
        "revision",
        "Needs Revision",
      ],
      "Select status",
    )
    .required(),
  notes: yup.string().max(2000).default(""),
});

export default function Subjects() {
  const {
    subjects,
    topics,
    addSubject,
    addTopic,
    deleteSubject,
    deleteTopic,
  } = useSubjects();

  const [expandedId, setExpandedId] = useState(null);

  const topicsBySubject = useMemo(() => {
    const map = new Map();
    for (const s of subjects) {
      map.set(s.id, []);
    }
    for (const t of topics) {
      const list = map.get(t.subjectId);
      if (list) list.push(t);
    }
    return map;
  }, [subjects, topics]);

  const {
    register: registerSubject,
    handleSubmit: handleSubmitSubject,
    reset: resetSubject,
    formState: { errors: subjectErrors },
  } = useForm({
    resolver: yupResolver(subjectSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3b82f6",
    },
  });

  const {
    register: registerTopic,
    handleSubmit: handleSubmitTopic,
    reset: resetTopic,
    formState: { errors: topicErrors },
  } = useForm({
    resolver: yupResolver(topicSchema),
    defaultValues: {
      subjectId: "",
      name: "",
      difficulty: "medium",
      status: "not-started",
      notes: "",
    },
  });

  const onAddSubject = (data) => {
    addSubject({
      name: data.name.trim(),
      description: data.description.trim(),
      color: data.color,
    });
    resetSubject({
      name: "",
      description: "",
      color: data.color,
    });
  };

  const onAddTopic = (data) => {
    addTopic({
      subjectId: data.subjectId,
      name: data.name.trim(),
      difficulty: data.difficulty,
      status: data.status,
      notes: (data.notes ?? "").trim(),
    });
    resetTopic({
      subjectId: data.subjectId,
      name: "",
      difficulty: "medium",
      status: "not-started",
      notes: "",
    });
  };

  const toggleSubject = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDeleteSubject = (id) => {
    deleteSubject(id);
    setExpandedId((prev) => (prev === id ? null : prev));
  };

  return (
    <div className="subjects-page">
      <header className="subjects-page__header">
        <h1 className="subjects-page__title">Subjects</h1>
        <p className="subjects-page__intro">
          Create subjects and topics, then expand a subject to see its topics.
        </p>
      </header>

      <div className="subjects-page__forms">
        <section
          className="subjects-page__card"
          aria-labelledby="subject-form-heading"
        >
          <h2 id="subject-form-heading" className="subjects-page__card-title">
            New subject
          </h2>
          <form
            className="subjects-form"
            onSubmit={handleSubmitSubject(onAddSubject)}
            noValidate
          >
            <div className="subjects-form__field">
              <label className="subjects-form__label" htmlFor="subject-name">
                Name
              </label>
              <input
                id="subject-name"
                className="subjects-form__input"
                type="text"
                {...registerSubject("name")}
              />
              {subjectErrors.name && (
                <p className="subjects-form__error" role="alert">
                  {subjectErrors.name.message}
                </p>
              )}
            </div>
            <div className="subjects-form__field">
              <label
                className="subjects-form__label"
                htmlFor="subject-description"
              >
                Description
              </label>
              <textarea
                id="subject-description"
                className="subjects-form__input subjects-form__textarea"
                rows={3}
                {...registerSubject("description")}
              />
              {subjectErrors.description && (
                <p className="subjects-form__error" role="alert">
                  {subjectErrors.description.message}
                </p>
              )}
            </div>
            <div className="subjects-form__field subjects-form__field--color">
              <label className="subjects-form__label" htmlFor="subject-color">
                Color
              </label>
              <input
                id="subject-color"
                className="subjects-form__color"
                type="color"
                {...registerSubject("color")}
              />
              {subjectErrors.color && (
                <p className="subjects-form__error" role="alert">
                  {subjectErrors.color.message}
                </p>
              )}
            </div>
            <button type="submit" className="subjects-form__submit">
              Add subject
            </button>
          </form>
        </section>

        <section
          className="subjects-page__card"
          aria-labelledby="topic-form-heading"
        >
          <h2 id="topic-form-heading" className="subjects-page__card-title">
            New topic
          </h2>
          <form
            className="subjects-form"
            onSubmit={handleSubmitTopic(onAddTopic)}
            noValidate
          >
            <div className="subjects-form__field">
              <label className="subjects-form__label" htmlFor="topic-subject">
                Subject
              </label>
              <select
                id="topic-subject"
                className="subjects-form__input"
                {...registerTopic("subjectId")}
                disabled={subjects.length === 0}
              >
                <option value="">
                  {subjects.length === 0
                    ? "Add a subject first"
                    : "Select a subject"}
                </option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {topicErrors.subjectId && (
                <p className="subjects-form__error" role="alert">
                  {topicErrors.subjectId.message}
                </p>
              )}
            </div>
            <div className="subjects-form__field">
              <label className="subjects-form__label" htmlFor="topic-name">
                Topic name
              </label>
              <input
                id="topic-name"
                className="subjects-form__input"
                type="text"
                {...registerTopic("name")}
              />
              {topicErrors.name && (
                <p className="subjects-form__error" role="alert">
                  {topicErrors.name.message}
                </p>
              )}
            </div>
            <div className="subjects-form__grid">
              <div className="subjects-form__field">
                <label
                  className="subjects-form__label"
                  htmlFor="topic-difficulty"
                >
                  Difficulty
                </label>
                <select
                  id="topic-difficulty"
                  className="subjects-form__input"
                  {...registerTopic("difficulty")}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                {topicErrors.difficulty && (
                  <p className="subjects-form__error" role="alert">
                    {topicErrors.difficulty.message}
                  </p>
                )}
              </div>
              <div className="subjects-form__field">
                <label
                  className="subjects-form__label"
                  htmlFor="topic-status"
                >
                  Status
                </label>
                <select
                  id="topic-status"
                  className="subjects-form__input"
                  {...registerTopic("status")}
                >
                  <option value="not-started">Not started</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                  <option value="revision">Revision</option>
                  <option value="Needs Revision">Needs Revision</option>
                </select>
                {topicErrors.status && (
                  <p className="subjects-form__error" role="alert">
                    {topicErrors.status.message}
                  </p>
                )}
              </div>
            </div>
            <div className="subjects-form__field">
              <label className="subjects-form__label" htmlFor="topic-notes">
                Notes
              </label>
              <textarea
                id="topic-notes"
                className="subjects-form__input subjects-form__textarea"
                rows={2}
                placeholder="Optional notes"
                {...registerTopic("notes")}
              />
              {topicErrors.notes && (
                <p className="subjects-form__error" role="alert">
                  {topicErrors.notes.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="subjects-form__submit"
              disabled={subjects.length === 0}
            >
              Add topic
            </button>
          </form>
        </section>
      </div>

      <section className="subjects-page__list" aria-label="Subjects list">
        {subjects.length === 0 ? (
          <p className="subjects-page__empty">
            No subjects yet. Add one above to get started.
          </p>
        ) : (
          <ul className="subjects-page__grid">
            {subjects.map((subject) => (
              <li key={subject.id} className="subjects-page__item">
                <SubjectCard
                  subject={subject}
                  topics={topicsBySubject.get(subject.id) ?? []}
                  isExpanded={expandedId === subject.id}
                  onToggle={() => toggleSubject(subject.id)}
                  onDeleteSubject={handleDeleteSubject}
                  onDeleteTopic={deleteTopic}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
