import { format } from "date-fns";
import "./RevisionList.css";

function formatWhen(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return format(d, "MMM d, yyyy · h:mm a");
  } catch {
    return "—";
  }
}

export default function RevisionList({ entries, subjectById }) {
  if (!entries.length) {
    return (
      <div className="revision-list revision-list--empty">
        <p className="revision-list__empty">
          Nothing scheduled for this filter. Pick another date or add tasks
          with deadlines or revision dates.
        </p>
      </div>
    );
  }

  return (
    <ul className="revision-list">
      {entries.map(({ kind, item }) => {
        const key = kind === "task" ? `task-${item.id}` : `topic-${item.id}`;

        if (kind === "task") {
          return (
            <li key={key} className="revision-list__item">
              <div className="revision-list__row">
                <span className="revision-list__badge revision-list__badge--task">
                  Task
                </span>
                <span className="revision-list__badge revision-list__badge--status">
                  {item.status}
                </span>
              </div>
              <h3 className="revision-list__title">{item.title}</h3>
              <p className="revision-list__meta">
                {item.subject} · {item.topic}
              </p>
              <dl className="revision-list__dl">
                <div>
                  <dt>Deadline</dt>
                  <dd>{formatWhen(item.deadline)}</dd>
                </div>
                <div>
                  <dt>Revision</dt>
                  <dd>{formatWhen(item.revisionDate)}</dd>
                </div>
              </dl>
            </li>
          );
        }

        const subjectName = subjectById?.get(item.subjectId)?.name ?? "Subject";

        return (
          <li key={key} className="revision-list__item">
            <div className="revision-list__row">
              <span className="revision-list__badge revision-list__badge--topic">
                Topic
              </span>
              <span className="revision-list__badge revision-list__badge--status">
                {item.status}
              </span>
            </div>
            <h3 className="revision-list__title">{item.name}</h3>
            <p className="revision-list__meta">{subjectName}</p>
            {item.notes ? (
              <p className="revision-list__notes">{item.notes}</p>
            ) : null}
            <dl className="revision-list__dl">
              <div>
                <dt>Revision date</dt>
                <dd>{formatWhen(item.revisionDate)}</dd>
              </div>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}
