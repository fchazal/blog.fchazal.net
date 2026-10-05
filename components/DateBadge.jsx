import { dateParts } from "./format.js";

/**
 * Date façon « fiche de calendrier » : jour en gros, mois en petit, année plus petite.
 * Microformat `dt-published` conservé.
 */
export function DateBadge({ date }) {
  const { day, month, year } = dateParts(date);

  return (
    <time className="date-badge dt-published" dateTime={date}>
      <span className="date-badge-day">{day}</span>
      <span className="date-badge-month">{month}</span>
      <span className="date-badge-year">{year}</span>
    </time>
  );
}
