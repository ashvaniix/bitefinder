export const SEARCH_HISTORY_LIMIT = 8;
export const EMPTY_SEARCH_HISTORY = [];

export function normalizeHistoryEntry(entry) {
  if (typeof entry === "string") {
    const value = entry.trim();
    if (!value) return null;
    const isVegetarian = value.toLowerCase() === "vegetarian";
    return {
      label: value,
      type: isVegetarian ? "category" : "name",
      value: isVegetarian ? "Vegetarian" : value,
    };
  }

  if (
    entry &&
    typeof entry.label === "string" &&
    (entry.type === "name" || entry.type === "category") &&
    typeof entry.value === "string"
  ) {
    return entry;
  }

  return null;
}

export function migrateSearchHistory(value) {
  if (!Array.isArray(value)) return value;
  return value.map(normalizeHistoryEntry).filter(Boolean);
}

export function isSearchHistory(value) {
  return Array.isArray(value) && value.every((entry) =>
    entry &&
    typeof entry.label === "string" &&
    (entry.type === "name" || entry.type === "category") &&
    typeof entry.value === "string"
  );
}
