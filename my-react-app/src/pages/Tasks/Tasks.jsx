import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TaskCard from "../../components/TaskCard/TaskCard.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import { useTasks } from "../../hooks/useTasks.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import "./Tasks.css";

const TABS = [
  { id: "all", label: "All Tasks" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
  { id: "overdue", label: "Overdue" },
];

const taskSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(200, "Title must be at most 200 characters"),
  subject: yup.string().required("Subject is required").max(120),
  topic: yup.string().required("Topic is required").max(120),
  deadline: yup
    .string()
    .required("Deadline is required")
    .test("valid-date", "Enter a valid date and time", (value) => {
      if (!value) return false;
      const d = new Date(value);
      return !Number.isNaN(d.getTime());
    }),
  priority: yup
    .string()
    .oneOf(["high", "medium", "low"], "Select a priority")
    .required(),
});

function defaultDeadlineLocal() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 16);
}

function isCompletedTask(task) {
  const s = String(task.status ?? "").toLowerCase();
  return s === "done" || s === "completed";
}

function isOverdueTask(task) {
  if (isCompletedTask(task)) return false;
  const d = new Date(task.deadline);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() < Date.now();
}

const SORT_OPTIONS = [
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "subjectName", label: "Subject Name" },
];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function Tasks() {
  const { tasks, addTask, editTask, deleteTask } = useTasks();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const [tab, setTab] = useState("all");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  const defaultDeadline = useMemo(() => defaultDeadlineLocal(), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: "",
      subject: "",
      topic: "",
      deadline: defaultDeadline,
      priority: "medium",
    },
  });

  const onSubmit = (data) => {
    const deadlineIso = new Date(data.deadline).toISOString();
    addTask({
      title: data.title.trim(),
      subject: data.subject.trim(),
      topic: data.topic.trim(),
      deadline: deadlineIso,
      priority: data.priority,
      status: "todo",
    });
    reset({
      title: "",
      subject: "",
      topic: "",
      deadline: defaultDeadlineLocal(),
      priority: "medium",
    });
  };

  const subjectOptions = useMemo(() => {
    const names = new Set(
      tasks.map((t) => t.subject).filter((s) => s != null && String(s).trim() !== ""),
    );
    return Array.from(names).sort((a, b) =>
      String(a).localeCompare(String(b), undefined, { sensitivity: "base" }),
    );
  }, [tasks]);

  const statusOptions = useMemo(() => {
    const values = new Set(
      tasks.map((t) => t.status).filter((s) => s != null && String(s).trim() !== ""),
    );
    return Array.from(values).sort((a, b) =>
      String(a).localeCompare(String(b), undefined, { sensitivity: "base" }),
    );
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    let list = tasks.filter((t) => {
      if (q && !String(t.title).toLowerCase().includes(q)) return false;
      if (tab === "all") return true;
      if (tab === "completed") return isCompletedTask(t);
      if (tab === "pending") return !isCompletedTask(t);
      if (tab === "overdue") return isOverdueTask(t);
      return true;
    });

    if (filterSubject) {
      list = list.filter((t) => t.subject === filterSubject);
    }
    if (filterPriority) {
      list = list.filter(
        (t) =>
          String(t.priority ?? "").toLowerCase() === filterPriority.toLowerCase(),
      );
    }
    if (filterStatus) {
      list = list.filter(
        (t) =>
          String(t.status ?? "").toLowerCase() === filterStatus.toLowerCase(),
      );
    }

    const sorted = [...list].sort((a, b) => {
      if (sortBy === "dueDate") {
        const ta = new Date(a.deadline).getTime();
        const tb = new Date(b.deadline).getTime();
        const na = Number.isNaN(ta) ? 0 : ta;
        const nb = Number.isNaN(tb) ? 0 : tb;
        return na - nb;
      }
      if (sortBy === "priority") {
        const pa =
          PRIORITY_ORDER[String(a.priority ?? "").toLowerCase()] ?? 99;
        const pb =
          PRIORITY_ORDER[String(b.priority ?? "").toLowerCase()] ?? 99;
        return pa - pb;
      }
      if (sortBy === "subjectName") {
        return String(a.subject ?? "").localeCompare(
          String(b.subject ?? ""),
          undefined,
          { sensitivity: "base" },
        );
      }
      return 0;
    });

    return sorted;
  }, [
    tasks,
    debouncedSearch,
    tab,
    filterSubject,
    filterPriority,
    filterStatus,
    sortBy,
  ]);

  const handleMarkComplete = (id) => {
    editTask(id, { status: "done" });
  };

  return (
    <div className="tasks-page">
      <header className="tasks-page__header">
        <h1 className="tasks-page__title">Tasks</h1>
        <p className="tasks-page__intro">
          Add tasks, use tabs and the bar below to filter and sort, and search by
          title.
        </p>
      </header>

      <section className="tasks-page__form-section" aria-labelledby="new-task-heading">
        <h2 id="new-task-heading" className="tasks-page__section-title">
          New task
        </h2>
        <form className="task-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="task-form__row task-form__row--full">
            <label className="task-form__label" htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              className="task-form__input"
              type="text"
              autoComplete="off"
              {...register("title")}
            />
            {errors.title && (
              <p className="task-form__error" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="task-form__grid">
            <div className="task-form__field">
              <label className="task-form__label" htmlFor="task-subject">
                Subject
              </label>
              <input
                id="task-subject"
                className="task-form__input"
                type="text"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="task-form__error" role="alert">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div className="task-form__field">
              <label className="task-form__label" htmlFor="task-topic">
                Topic
              </label>
              <input
                id="task-topic"
                className="task-form__input"
                type="text"
                {...register("topic")}
              />
              {errors.topic && (
                <p className="task-form__error" role="alert">
                  {errors.topic.message}
                </p>
              )}
            </div>
          </div>

          <div className="task-form__grid">
            <div className="task-form__field">
              <label className="task-form__label" htmlFor="task-deadline">
                Deadline
              </label>
              <input
                id="task-deadline"
                className="task-form__input"
                type="datetime-local"
                {...register("deadline")}
              />
              {errors.deadline && (
                <p className="task-form__error" role="alert">
                  {errors.deadline.message}
                </p>
              )}
            </div>
            <div className="task-form__field">
              <label className="task-form__label" htmlFor="task-priority">
                Priority
              </label>
              <select
                id="task-priority"
                className="task-form__input"
                {...register("priority")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <p className="task-form__error" role="alert">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <div className="task-form__actions">
            <button type="submit" className="task-form__submit">
              Add task
            </button>
          </div>
        </form>
      </section>

      <div className="tasks-page__toolbar">
        <div
          className="tasks-page__tabs"
          role="tablist"
          aria-label="Filter tasks"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              className={`tasks-page__tab${tab === t.id ? " tasks-page__tab--active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div
        className="tasks-page__control-bar"
        role="group"
        aria-label="Filter and sort tasks"
      >
        <div className="tasks-page__control-bar__filters">
          <span className="tasks-page__control-bar__heading">Filter</span>
          <div className="tasks-page__control-bar__row">
            <label className="tasks-page__control-bar__label" htmlFor="filter-subject">
              Subject
            </label>
            <select
              id="filter-subject"
              className="tasks-page__control-bar__select"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All subjects</option>
              {subjectOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="tasks-page__control-bar__row">
            <label className="tasks-page__control-bar__label" htmlFor="filter-priority">
              Priority
            </label>
            <select
              id="filter-priority"
              className="tasks-page__control-bar__select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="tasks-page__control-bar__row">
            <label className="tasks-page__control-bar__label" htmlFor="filter-status">
              Status
            </label>
            <select
              id="filter-status"
              className="tasks-page__control-bar__select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="tasks-page__control-bar__sort">
          <span className="tasks-page__control-bar__heading">Sort</span>
          <div className="tasks-page__control-bar__row">
            <label className="tasks-page__control-bar__label" htmlFor="sort-by">
              Sort by
            </label>
            <select
              id="sort-by"
              className="tasks-page__control-bar__select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <section
        className="tasks-page__list-section"
        aria-labelledby="task-list-heading"
        role="tabpanel"
        aria-label={`${TABS.find((x) => x.id === tab)?.label ?? "Tasks"} list`}
      >
        <h2 id="task-list-heading" className="visually-hidden">
          Task list
        </h2>
        {filteredAndSortedTasks.length === 0 ? (
          <p className="tasks-page__empty">No tasks match your filters.</p>
        ) : (
          <ul className="tasks-page__list">
            {filteredAndSortedTasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  onDelete={deleteTask}
                  onMarkComplete={handleMarkComplete}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
