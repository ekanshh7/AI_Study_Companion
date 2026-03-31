import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTasks } from "../../hooks/useTasks.js";
import "./ProgressChart.css";

function bucketTaskStatus(status) {
  const s = String(status ?? "").toLowerCase();
  if (s === "done" || s === "completed") return "completed";
  if (s === "in-progress") return "inProgress";
  if (s === "revision" || s === "review" || s === "needs revision") {
    return "revision";
  }
  if (s === "todo") return "todo";
  return "other";
}

const STATUS_ORDER = [
  { key: "completed", name: "Completed", fill: "#22c55e" },
  { key: "inProgress", name: "In progress", fill: "#3b82f6" },
  { key: "todo", name: "Todo", fill: "#94a3b8" },
  { key: "revision", name: "Revision", fill: "#a855f7" },
  { key: "other", name: "Other", fill: "#f59e0b" },
];

const PRIORITY_ORDER = [
  { key: "high", name: "High", fill: "#ef4444" },
  { key: "medium", name: "Medium", fill: "#f59e0b" },
  { key: "low", name: "Low", fill: "#22c55e" },
  { key: "other", name: "Other", fill: "#64748b" },
];

function normalizePriority(priority) {
  const p = String(priority ?? "").toLowerCase();
  if (p === "high" || p === "medium" || p === "low") return p;
  return "other";
}

export default function ProgressChart() {
  const { tasks } = useTasks();

  const statusBarData = useMemo(() => {
    const counts = {
      completed: 0,
      inProgress: 0,
      todo: 0,
      revision: 0,
      other: 0,
    };
    for (const t of tasks) {
      const b = bucketTaskStatus(t.status);
      counts[b] += 1;
    }
    return STATUS_ORDER.map((row) => ({
      name: row.name,
      count: counts[row.key] ?? 0,
      fill: row.fill,
    }));
  }, [tasks]);

  const priorityPieData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0, other: 0 };
    for (const t of tasks) {
      const k = normalizePriority(t.priority);
      counts[k] += 1;
    }
    return PRIORITY_ORDER.map((row) => ({
      name: row.name,
      value: counts[row.key] ?? 0,
      fill: row.fill,
    })).filter((d) => d.value > 0);
  }, [tasks]);

  const tickStyle = { fill: "var(--text)", fontSize: 12 };
  const axisLine = { stroke: "var(--border)" };

  return (
    <div className="progress-chart">
      <div className="progress-chart__panel">
        <h2 className="progress-chart__title">Task completion status</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusBarData}
              margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={tickStyle}
                axisLine={axisLine}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={tickStyle}
                axisLine={axisLine}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-h)",
                }}
                cursor={{ fill: "var(--accent-bg)" }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={56}>
                {statusBarData.map((row) => (
                  <Cell key={row.name} fill={row.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="progress-chart__panel">
        <h2 className="progress-chart__title">Tasks by priority</h2>
        {priorityPieData.length === 0 ? (
          <div style={{ width: "100%", height: 300 }}>
            <p className="progress-chart__empty">No tasks yet</p>
          </div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="42%"
                  outerRadius="72%"
                  paddingAngle={3}
                >
                  {priorityPieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-h)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="progress-chart__legend-label">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
