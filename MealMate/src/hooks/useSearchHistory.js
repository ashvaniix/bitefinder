import { useCallback, useMemo } from "react";
import {
  EMPTY_SEARCH_HISTORY,
  isSearchHistory,
  migrateSearchHistory,
  normalizeHistoryEntry,
  SEARCH_HISTORY_LIMIT,
} from "../data/searchHistory";
import { useLocalStorage } from "./useLocalStorage";

export function useSearchHistory() {
  const [storedHistory, setStoredHistory] = useLocalStorage(
    "mealmate-search-history", EMPTY_SEARCH_HISTORY, isSearchHistory, migrateSearchHistory
  );
  const searchHistory = useMemo(
    () => storedHistory.map(normalizeHistoryEntry).filter(Boolean),
    [storedHistory]
  );
  const rememberSuccess = useCallback((entry) => {
    if (!entry) return;
    setStoredHistory((entries) => {
      const normalized = entries.map(normalizeHistoryEntry).filter(Boolean);
      const key = `${entry.type}:${entry.value.toLowerCase()}`;
      return [entry, ...normalized.filter((item) =>
        `${item.type}:${item.value.toLowerCase()}` !== key
      )].slice(0, SEARCH_HISTORY_LIMIT);
    });
  }, [setStoredHistory]);
  const clearSearchHistory = useCallback(() => {
    if (window.confirm("Clear your recent search history?")) setStoredHistory([]);
  }, [setStoredHistory]);

  return { searchHistory, rememberSuccess, clearSearchHistory };
}
