export const FINANCIAL_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
export const FINANCIAL_PERIOD = /^\d{4}-(0[1-9]|1[0-2])$/;
export function isFinancialDate(value: unknown): value is string {
  if (typeof value !== "string" || !FINANCIAL_DATE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  return utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day;
}
export const periodOf = (date: string) => isFinancialDate(date) ? date.slice(0, 7) : "";
export function localFinancialDate(now = new Date()) {
  const year = now.getFullYear(); const month = String(now.getMonth() + 1).padStart(2, "0"); const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function formatFinancialDate(date: string, locale = "es-PE") {
  if (!isFinancialDate(date)) return "Fecha inválida";
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}
export function daysInMonth(period: string) { if (!FINANCIAL_PERIOD.test(period)) return 0; const [y,m]=period.split("-").map(Number); return new Date(Date.UTC(y,m,0)).getUTCDate(); }
