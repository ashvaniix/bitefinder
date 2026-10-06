import { useCallback, useEffect, useRef, useState } from "react";
import { lookupMeal } from "../data/mealApi";
import { stripSyntheticSearchFields } from "../data/mealUtils";
import { useLocalStorage } from "./useLocalStorage";

function toRecentlyViewed(meal) {
  const cleanMeal = stripSyntheticSearchFields(meal);
  return {
    idMeal: cleanMeal.idMeal,
    strMeal: cleanMeal.strMeal,
    strMealThumb: cleanMeal.strMealThumb,
    strCategory: cleanMeal.strCategory || "",
    strArea: cleanMeal.strArea || "",
  };
}

function migrateRecentlyViewed(value) {
  if (!Array.isArray(value)) return value;
  return value
    .filter((meal) => meal && typeof meal.idMeal === "string")
    .map((meal) => toRecentlyViewed(stripSyntheticSearchFields(meal)));
}

function isRecentlyViewed(value) {
  return Array.isArray(value) && value.every((meal) =>
    meal &&
    typeof meal.idMeal === "string" &&
    typeof meal.strMeal === "string" &&
    typeof meal.strMealThumb === "string"
  );
}

const EMPTY_RECENTLY_VIEWED = [];

export function useRecipeDetails() {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage(
    "mealmate-recently-viewed",
    EMPTY_RECENTLY_VIEWED,
    isRecentlyViewed,
    migrateRecentlyViewed
  );
  const activeDetails = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => () => activeDetails.current?.controller.abort(), []);

  const openRecipe = useCallback(async (meal, opener) => {
    activeDetails.current?.controller.abort();
    activeDetails.current = null;
    setIsLoadingDetails(false);
    setDetailsError("");
    setSelectedMeal(meal);
    returnFocusRef.current = opener || document.activeElement;
    setRecentlyViewed((meals) => [
      toRecentlyViewed(meal),
      ...meals.filter((item) => item.idMeal !== meal.idMeal),
    ].slice(0, 10));

    if (meal.strInstructions) return;

    const controller = new AbortController();
    const request = { id: meal.idMeal, controller };
    activeDetails.current = request;
    setIsLoadingDetails(true);

    try {
      const fullMeal = await lookupMeal(meal.idMeal, { signal: controller.signal });
      if (activeDetails.current !== request) return;
      setSelectedMeal((current) => current?.idMeal === fullMeal.idMeal ? fullMeal : current);
      setRecentlyViewed((meals) => [
        toRecentlyViewed(fullMeal),
        ...meals.filter((item) => item.idMeal !== fullMeal.idMeal),
      ].slice(0, 10));
    } catch (error) {
      if (error.name !== "AbortError" && activeDetails.current === request) {
        setDetailsError("We couldn't load the full recipe details. Please close and try again.");
      }
    } finally {
      if (activeDetails.current === request) {
        activeDetails.current = null;
        setIsLoadingDetails(false);
      }
    }
  }, [setRecentlyViewed]);

  const closeRecipe = useCallback(() => {
    activeDetails.current?.controller.abort();
    activeDetails.current = null;
    setIsLoadingDetails(false);
    setDetailsError("");
    setSelectedMeal(null);
  }, []);

  const clearRecentlyViewed = useCallback(() => setRecentlyViewed([]), [setRecentlyViewed]);

  return {
    selectedMeal,
    openRecipe,
    closeRecipe,
    isLoadingDetails,
    detailsError,
    recentlyViewed,
    clearRecentlyViewed,
    returnFocusRef,
  };
}
