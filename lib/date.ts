/** Formats a Date as a local-timezone "YYYY-MM-DD" string (unlike toISOString, which converts to UTC). */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function todayIsoDate(): string {
  return toIsoDate(new Date());
}
