import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isSameDay } from "date-fns";
import RevisionList from "../../components/RevisionList/RevisionList.jsx";
import { useSubjects } from "../../hooks/useSubjects.js";
import { useTasks } from "../../hooks/useTasks.js";
import { matchesRevisionSchedule } from "../../utils/revisionFilters.js";
import "./Revision.css";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Revision() {
  const [selectedDate, setSelectedDate] = useState(startOfToday);
  const { tasks } = useTasks();
  const { subjects, topics } = useSubjects();

  const subjectById = useMemo(() => {
    const m = new Map();
    for (const s of subjects) {
      m.set(s.id, s);
    }
    return m;
  }, [subjects]);

  const scheduleEntries = useMemo(() => {
    const out = [];
    for (const t of tasks) {
      if (matchesRevisionSchedule(t, selectedDate)) {
        out.push({ kind: "task", item: t });
      }
    }
    for (const t of topics) {
      if (matchesRevisionSchedule(t, selectedDate)) {
        out.push({ kind: "topic", item: t });
      }
    }
    return out;
  }, [tasks, topics, selectedDate]);

  const handleCalendarChange = (value) => {
    if (value instanceof Date) {
      const d = new Date(value);
      d.setHours(0, 0, 0, 0);
      setSelectedDate(d);
      return;
    }
    if (Array.isArray(value) && value[0] instanceof Date) {
      const d = new Date(value[0]);
      d.setHours(0, 0, 0, 0);
      setSelectedDate(d);
    }
  };

  return (
    <div className="revision-page">
      <header className="revision-page__header">
        <h1 className="revision-page__title">Revision</h1>
        <p className="revision-page__intro">
          Pick a date to see tasks and topics that need revision or are due
          that day.
        </p>
      </header>

      <div className="revision-page__layout">
        <div className="revision-page__col revision-page__col--calendar">
          <h2 className="revision-page__section-title">Calendar</h2>
          <div className="revision-page__calendar-wrap">
            <Calendar
              value={selectedDate}
              onChange={handleCalendarChange}
              locale="en-US"
            />
          </div>
        </div>

        <div className="revision-page__col revision-page__col--schedule">
          <h2 className="revision-page__section-title">Revision schedule</h2>
          <p className="revision-page__schedule-hint">
            Showing items for{" "}
            <strong>
              {isSameDay(selectedDate, new Date())
                ? "today"
                : format(selectedDate, "MMMM d, yyyy")}
            </strong>{" "}
            — status &quot;Needs Revision&quot;, or matching deadline / revision
            date.
          </p>
          <RevisionList
            entries={scheduleEntries}
            subjectById={subjectById}
          />
        </div>
      </div>
    </div>
  );
}
