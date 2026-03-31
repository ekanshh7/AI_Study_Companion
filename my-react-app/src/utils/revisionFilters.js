import { isSameDay, parseISO } from "date-fns";

function toDate(value) {
  if (value == null || value === "") return null;
  try {
    const d = typeof value === "string" ? parseISO(value) : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

/**
 * Tasks or topics whose status is "Needs Revision", or whose deadline
 * or revisionDate falls on the selected calendar day.
 */
export function matchesRevisionSchedule(item, selectedDate) {
  if (String(item.status ?? "") === "Needs Revision") return true;
  const deadline = toDate(item.deadline);
  if (deadline && isSameDay(deadline, selectedDate)) return true;
  const revisionDate = toDate(item.revisionDate);
  if (revisionDate && isSameDay(revisionDate, selectedDate)) return true;
  return false;
}
