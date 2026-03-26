/**
 * Get date range for a given month (inclusive start, exclusive end)
 */
export function getMonthRange(year: number, month: number): { gte: Date; lt: Date } {
  const gte = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const lt = new Date(year, month, 1, 0, 0, 0, 0);
  return { gte, lt };
}

/**
 * Get current month and year
 */
export function getCurrentMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

/**
 * Format month label in Vietnamese
 */
export function formatMonthLabel(year: number, month: number): string {
  return `Tháng ${month}/${year}`;
}

/**
 * Parse month/year from query params with fallback to current month
 */
export function parseMonthParams(
  searchParams: URLSearchParams
): { year: number; month: number } {
  const current = getCurrentMonth();
  const year = parseInt(searchParams.get("year") ?? "") || current.year;
  const month = parseInt(searchParams.get("month") ?? "") || current.month;
  return { year, month };
}
