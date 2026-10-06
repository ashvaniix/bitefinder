import { useCallback, useMemo } from "react";
import { stripSyntheticSearchFields } from "../data/mealUtils";
import { useLocalStorage } from "./useLocalStorage";

const EMPTY_BOOKMARKS = [];

function isBookmarkList(value) {
  return Array.isArray(value) && value.every((meal) =>
    meal &&
    typeof meal.idMeal === "string" &&
    typeof meal.strMeal === "string" &&
    typeof meal.strMealThumb === "string"
  );
}

function migrateBookmarks(value) {
  return Array.isArray(value) ? value.map(stripSyntheticSearchFields) : value;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage(
    "mealmate-bookmarks",
    EMPTY_BOOKMARKS,
    isBookmarkList,
    migrateBookmarks
  );
  const bookmarkIds = useMemo(
    () => new Set(bookmarks.map((meal) => meal.idMeal)),
    [bookmarks]
  );

  const toggleBookmark = useCallback((meal) => {
    const cleanMeal = stripSyntheticSearchFields(meal);
    setBookmarks((savedMeals) => savedMeals.some((item) => item.idMeal === meal.idMeal)
      ? savedMeals.filter((item) => item.idMeal !== meal.idMeal)
      : [cleanMeal, ...savedMeals]);
  }, [setBookmarks]);

  const isBookmarked = useCallback((idMeal) => bookmarkIds.has(idMeal), [bookmarkIds]);

  return { bookmarks, toggleBookmark, isBookmarked };
}
