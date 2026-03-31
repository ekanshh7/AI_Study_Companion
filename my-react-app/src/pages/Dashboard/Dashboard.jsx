import { useProgress } from "../../hooks/useProgress.js";
import ProgressChart from "../../components/ProgressChart/ProgressChart.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    revisionTasks,
  } = useProgress();

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="dashboard__subtitle">
          Overview of your tasks and study progress
        </p>
      </header>

      <section className="dashboard__summary" aria-label="Task summary">
        <article className="summary-card">
          <span className="summary-card__label">Total tasks</span>
          <span className="summary-card__value">{totalTasks}</span>
        </article>
        <article className="summary-card summary-card--success">
          <span className="summary-card__label">Completed</span>
          <span className="summary-card__value">{completedTasks}</span>
        </article>
        <article className="summary-card summary-card--pending">
          <span className="summary-card__label">Pending</span>
          <span className="summary-card__value">{pendingTasks}</span>
        </article>
        <article className="summary-card summary-card--revision">
          <span className="summary-card__label">Revision tasks</span>
          <span className="summary-card__value">{revisionTasks}</span>
        </article>
      </section>

      <section className="dashboard__charts" aria-label="Charts">
        <ProgressChart />
      </section>
    </div>
  );
}
