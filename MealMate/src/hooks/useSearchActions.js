import { useCallback } from "react";
import { searchMeals, searchMealsByCategory } from "../data/mealApi";
import { normalizeHistoryEntry } from "../data/searchHistory";

export function useSearchActions(execute, setSearchQuery) {
  const runSearch = useCallback((query, options = {}) => {
    if (typeof query !== "string") return Promise.resolve({ status: "error", count: 0 });
    const { focusResults: shouldFocus = true } = options || {};
    const value = query.trim();
    return execute({
      query: value,
      type: "name",
      value,
      searchFunction: searchMeals,
      historyEntry: { label: value, type: "name", value },
      shouldFocus,
    });
  }, [execute]);

  const runCategorySearch = useCallback((category, options = {}) => {
    if (typeof category !== "string") return Promise.resolve({ status: "error", count: 0 });
    const { focusResults: shouldFocus = true } = options || {};
    const value = category.trim();
    return execute({
      query: value,
      type: "category",
      value,
      label: value,
      searchFunction: searchMealsByCategory,
      historyEntry: { label: value, type: "category", value },
      shouldFocus,
    });
  }, [execute]);

  const replaySearch = useCallback((entry) => {
    const normalized = normalizeHistoryEntry(entry);
    if (!normalized) return Promise.resolve({ status: "error", count: 0 });
    const category = normalized.type === "category";
    setSearchQuery(category ? "" : normalized.value);
    return execute({
      query: normalized.value,
      type: normalized.type,
      value: normalized.value,
      label: category ? normalized.label : "",
      searchFunction: category ? searchMealsByCategory : searchMeals,
    });
  }, [execute, setSearchQuery]);

  return { runSearch, runCategorySearch, replaySearch };
}
