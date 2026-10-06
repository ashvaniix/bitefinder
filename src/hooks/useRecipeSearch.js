import { useCallback, useEffect, useRef, useState } from "react";
import {
  searchMeals,
  searchMealsByCategory,
  searchMealsByIngredient,
} from "../data/mealApi";
import { tagSearchResults } from "../data/searchResults";
import { useFeaturedRecipes } from "./useFeaturedRecipes";
import { useSearchActions } from "./useSearchActions";
import { useSearchHistory } from "./useSearchHistory";

export function useRecipeSearch({ onNavigate, resultsRef }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLabel, setSearchLabel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRequestId, setSearchRequestId] = useState(0);
  const [visibleCount, setVisibleCount] = useState(12);
  const activeRequest = useRef(null);
  const lastSearch = useRef(null);
  const { searchHistory, rememberSuccess, clearSearchHistory } = useSearchHistory();
  const startRequest = useCallback((request) => {
    activeRequest.current?.controller.abort();
    activeRequest.current = request;
  }, []);
  const isCurrentRequest = useCallback((request) => activeRequest.current === request, []);
  const finishRequest = useCallback((request) => {
    if (activeRequest.current !== request) return;
    activeRequest.current = null;
    setIsLoading(false);
  }, []);
  const loadInitialRecipes = useFeaturedRecipes({
    startRequest, isCurrentRequest, finishRequest, setRecipes, setError,
  });

  const focusResults = useCallback(() => {
    onNavigate("home");
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultsRef.current?.querySelector("h2")?.focus();
    }));
  }, [onNavigate, resultsRef]);

  const execute = useCallback(async ({
    query,
    type,
    value = query,
    label = "",
    searchFunction,
    historyEntry,
    shouldFocus = true,
  }) => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return { status: "empty", count: 0 };
    const requestKey = `${type}:${normalizedQuery.toLowerCase()}`;

    setSearchRequestId((requestId) => requestId + 1);
    activeRequest.current?.controller.abort();
    const controller = new AbortController();
    const request = { key: requestKey, controller };
    activeRequest.current = request;
    setIsLoading(true);
    setError("");
    setHasSearched(true);
    setSearchLabel(label);
    setSearchQuery(normalizedQuery);
    lastSearch.current = { query: normalizedQuery, type, value, label, historyEntry };

    try {
      let resultType = type;
      let resultValue = value || normalizedQuery;
      let resultLabel = label;
      let meals = await searchFunction(normalizedQuery, { signal: controller.signal });

      if (type === "name" && meals.length === 0) {
        meals = await searchMealsByIngredient(normalizedQuery, { signal: controller.signal });
        if (meals.length) {
          resultType = "ingredient";
          resultLabel = `Recipes with ${normalizedQuery}`;
        }
      }

      if (activeRequest.current !== request) return { status: "aborted", count: 0 };
      lastSearch.current = {
        query: normalizedQuery, type: resultType, value: resultValue, label: resultLabel, historyEntry,
      };
      const results = tagSearchResults(meals, { type: resultType, value: resultValue });
      setRecipes(results);
      setVisibleCount(12);
      setSearchLabel(resultLabel);
      if (results.length) rememberSuccess(historyEntry);
      if (shouldFocus) focusResults();
      return { status: results.length ? "success" : "empty", count: results.length };
    } catch (requestError) {
      if (requestError.name === "AbortError" || activeRequest.current !== request) {
        return { status: "aborted", count: 0 };
      }
      setRecipes([]);
      setError("We couldn't load recipes right now. Please try again.");
      if (shouldFocus) focusResults();
      return { status: "error", count: 0 };
    } finally {
      if (activeRequest.current === request) {
        activeRequest.current = null;
        setIsLoading(false);
      }
    }
  }, [focusResults, rememberSuccess]);

  const { runSearch, runCategorySearch, replaySearch } = useSearchActions(execute, setSearchQuery);

  useEffect(() => {
    // Initial data loading synchronizes this hook with TheMealDB.
    // oxlint-disable-next-line react/set-state-in-effect
    loadInitialRecipes();
    return () => activeRequest.current?.controller.abort();
  }, [loadInitialRecipes]);

  const retry = useCallback(() => {
    const previous = lastSearch.current;
    if (!hasSearched || !previous) {
      setIsLoading(true);
      return loadInitialRecipes();
    }
    const category = previous.type === "category";
    return execute({
      query: previous.query,
      type: previous.type,
      value: previous.value,
      label: previous.label,
      searchFunction: category
        ? searchMealsByCategory
        : previous.type === "ingredient" ? searchMealsByIngredient : searchMeals,
      historyEntry: previous.historyEntry,
    });
  }, [execute, hasSearched, loadInitialRecipes]);

  const loadMore = useCallback(() => setVisibleCount((count) => count + 12), []);

  return {
    recipes, isLoading, error, hasSearched, searchLabel, searchQuery, searchRequestId, setSearchQuery,
    visibleCount, loadMore, searchHistory, clearSearchHistory,
    runSearch, runCategorySearch, replaySearch, retry,
  };
}
