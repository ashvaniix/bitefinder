/** @vitest-environment jsdom */
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { searchMealsByCategory } from "../data/mealApi";
import { useRecipeSearch } from "./useRecipeSearch";

vi.mock("../data/mealApi", () => ({
  searchMeals: vi.fn(),
  searchMealsByCategory: vi.fn(),
  searchMealsByIngredient: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (callback) => {
    callback();
    return 0;
  });
});

describe("useRecipeSearch", () => {
  it("increments the search request ID for repeated identical searches", async () => {
    searchMealsByCategory.mockResolvedValue([{
      idMeal: "1",
      strMeal: "Vegetarian Curry",
      strMealThumb: "",
    }]);
    const { result } = renderHook(() => useRecipeSearch({
      onNavigate: vi.fn(),
      resultsRef: { current: null },
    }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const initialRequestId = result.current.searchRequestId;

    await act(async () => {
      await result.current.runCategorySearch("Vegetarian", { focusResults: false });
      await result.current.runCategorySearch("Vegetarian", { focusResults: false });
    });

    expect(result.current.searchRequestId).toBe(initialRequestId + 2);
    expect(result.current.searchQuery).toBe("Vegetarian");
  });

  it("preserves a category history entry when retry succeeds", async () => {
    let vegetarianAttempts = 0;
    searchMealsByCategory.mockImplementation((category) => {
      if (category === "Chicken") return Promise.resolve([]);
      vegetarianAttempts += 1;
      return vegetarianAttempts === 1
        ? Promise.reject(new Error("Network unavailable"))
        : Promise.resolve([{
          idMeal: "1",
          strMeal: "Vegetarian Curry",
          strMealThumb: "",
        }]);
    });
    const { result } = renderHook(() => useRecipeSearch({
      onNavigate: vi.fn(),
      resultsRef: { current: null },
    }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.runCategorySearch("Vegetarian", { focusResults: false });
    });
    expect(result.current.error).toContain("try again");

    await act(async () => {
      await result.current.retry();
    });
    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem("mealmate-search-history"))).toEqual([
        { label: "Vegetarian", type: "category", value: "Vegetarian" },
      ]);
    });
  });
});
