import { useCallback } from "react";
import { searchMealsByCategory } from "../data/mealApi";
import { tagSearchResults } from "../data/searchResults";

const INITIAL_RECIPE_LIMIT = 9;

export function useFeaturedRecipes({ startRequest, isCurrentRequest, finishRequest, setRecipes, setError }) {
  return useCallback(async () => {
    const controller = new AbortController();
    const request = { key: "initial:chicken", controller };
    startRequest(request);
    try {
      const meals = await searchMealsByCategory("Chicken", { signal: controller.signal });
      if (!isCurrentRequest(request)) return;
      setRecipes(tagSearchResults(meals.slice(0, INITIAL_RECIPE_LIMIT), {
        type: "category", value: "Chicken",
      }));
      setError("");
    } catch (requestError) {
      if (requestError.name !== "AbortError" && isCurrentRequest(request)) {
        setError("We couldn't load featured recipes. Try searching to explore TheMealDB.");
      }
    } finally {
      finishRequest(request);
    }
  }, [finishRequest, isCurrentRequest, setError, setRecipes, startRequest]);
}
