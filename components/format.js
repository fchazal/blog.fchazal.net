const FR_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const FR_MONTH = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Formate une date `YYYY-MM-DD` (ou une Date) en français. */
export function formatDateFr(value) {
  if (!value) return "";
  const date =
    value instanceof Date
      ? value
      : /^\d{4}-\d{2}-\d{2}$/.test(String(value))
        ? new Date(`${value}T00:00:00Z`)
        : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return FR_DATE.format(date);
}

/** Formate un mois `YYYY-MM` en français (« mai 2026 »). */
export function formatMonthFr(value) {
  if (!value) return "";
  const date = new Date(`${value}-01T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return String(value);
  return FR_MONTH.format(date);
}

const FR_MONTH_ONLY = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  timeZone: "UTC",
});

/** Décompose une date `YYYY-MM-DD` en { day, month, year } pour une fiche calendrier. */
export function dateParts(value) {
  const date =
    value instanceof Date ? value : new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return { day: "", month: "", year: "" };
  }
  return {
    day: String(date.getUTCDate()).padStart(2, "0"),
    month: FR_MONTH_ONLY.format(date),
    year: String(date.getUTCFullYear()),
  };
}
