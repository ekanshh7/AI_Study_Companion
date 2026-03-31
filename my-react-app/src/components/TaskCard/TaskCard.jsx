import { format } from "date-fns";
import { MdDeleteOutline, MdCheckCircle } from "react-icons/md";
import "./TaskCard.css";

function isCompletedStatus(status) {
  if (status == null) return false;
  const s = String(status).toLowerCase();
  return s === "done" || s === "completed";
}

export default function TaskCard({ task, onDelete, onMarkComplete }) {
  const completed = isCompletedStatus(task.status);
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const deadlineLabel =
    deadlineDate && !Number.isNaN(deadlineDate.getTime())
      ? format(deadlineDate, "MMM d, yyyy · h:mm a")
      : "—";

  return (
    <article className={`task-card${completed ? " task-card--done" : ""}`}>
      <div className="task-card__main">
        <h3 className="task-card__title">{task.title}</h3>
        <p className="task-card__meta">
          <span>{task.subject}</span>
          <span className="task-card__sep">·</span>
          <span>{task.topic}</span>
        </p>
        <p className="task-card__deadline">
          <span className="task-card__deadline-label">Due</span> {deadlineLabel}
        </p>
        <div className="task-card__tags">
          <span className={`task-card__pill task-card__pill--${task.priority}`}>
            {task.priority}
          </span>
          <span className="task-card__pill task-card__pill--status">
            {task.status}
          </span>
        </div>
      </div>
      <div className="task-card__actions">
        {!completed && (
          <button
            type="button"
            className="task-card__btn task-card__btn--primary"
            onClick={() => onMarkComplete(task.id)}
            aria-label="Mark complete"
          >
            <MdCheckCircle aria-hidden />
            <span>Complete</span>
          </button>
        )}
        <button
          type="button"
          className="task-card__btn task-card__btn--danger"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <MdDeleteOutline aria-hidden />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
}
