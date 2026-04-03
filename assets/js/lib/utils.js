export function safeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function uniqueSorted(values = []) {
  return [...new Set(values)].sort((a, b) => String(a).localeCompare(String(b)));
}

export function sortByPriority(values, priority = []) {
  return [
    ...priority.filter((item) => values.includes(item)),
    ...values.filter((item) => !priority.includes(item))
  ];
}

export function monthYear(ym) {
  if (!ym || ym === "present") return "Present";
  const [year, month] = String(ym).split("-").map(Number);
  if (!year || !month) return ym;
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
    year: "numeric"
  });
}

export function dateRange(start, end) {
  return `${monthYear(start)} – ${monthYear(end)}`;
}
