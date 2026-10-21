import { dateParts } from "./format.js";

/**
 * Date façon « fiche de calendrier » : jour en gros, mois en petit, année plus petite.
 * Microformat `dt-published` conservé.
 */
export function DateBadge({ date }) {
  const { day, month, year } = dateParts(date);

  return (
    <time
      className="dt-published inline-flex w-[60px] flex-col items-center justify-center rounded-card border border-line bg-surface px-1.5 pb-[7px] pt-2 leading-none shadow-[0_2px_8px_rgba(0,0,0,0.07)]"
      dateTime={date}
    >
      <span className="font-display text-[1.9rem] font-bold text-fg">{day}</span>
      <span className="mt-[3px] font-ui text-[0.6rem] font-black uppercase tracking-[1px] text-fg">
        {month}
      </span>
      <span className="mt-px font-ui text-[0.52rem] tracking-[1px] text-muted-2">
        {year}
      </span>
    </time>
  );
}
