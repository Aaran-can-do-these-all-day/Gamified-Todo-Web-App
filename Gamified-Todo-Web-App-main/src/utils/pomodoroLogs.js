const LOG_KEY = "pomodoroLogs";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    return [];
  }
};

export const loadLogs = () => {
  if (typeof window === "undefined") return [];
  return Array.isArray(safeParse(localStorage.getItem(LOG_KEY)))
    ? safeParse(localStorage.getItem(LOG_KEY))
    : [];
};

export const saveLog = (log) => {
  if (typeof window === "undefined") return;
  const existing = loadLogs();
  const next = [...existing, log];
  localStorage.setItem(LOG_KEY, JSON.stringify(next));
};

export const clearLogs = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOG_KEY);
};

export const removeLogAtIndex = (index) => {
  if (typeof window === "undefined") return;
  const existing = loadLogs();
  const next = existing.filter((_, i) => i !== index);
  localStorage.setItem(LOG_KEY, JSON.stringify(next));
};
