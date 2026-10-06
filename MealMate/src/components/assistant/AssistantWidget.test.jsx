/** @vitest-environment jsdom */
import { StrictMode } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AssistantWidget from "./AssistantWidget";
import {
  LibraryContext,
  RecipeViewContext,
  SearchContext,
} from "../../context/AppContext";

afterEach(cleanup);

describe("AssistantWidget", () => {
  it("routes vegetarian questions to the Vegetarian category search", async () => {
    const runCategorySearch = vi.fn().mockResolvedValue({ status: "success", count: 2 });
    const providerValues = {
      library: { bookmarks: [], items: [], navigateToSection: vi.fn() },
      search: { recipes: [], runSearch: vi.fn(), runCategorySearch },
      recipeView: { selectedMeal: null, recentlyViewed: [], openRecipe: vi.fn() },
    };

    render(
      <StrictMode>
        <LibraryContext.Provider value={providerValues.library}>
          <SearchContext.Provider value={providerValues.search}>
            <RecipeViewContext.Provider value={providerValues.recipeView}>
              <AssistantWidget />
            </RecipeViewContext.Provider>
          </SearchContext.Provider>
        </LibraryContext.Provider>
      </StrictMode>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open MealMate assistant" }));
    fireEvent.change(screen.getByLabelText("Ask a recipe question"), {
      target: { value: "show me vegetarian recipes" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Ask", exact: true }));

    await waitFor(() => {
      expect(runCategorySearch).toHaveBeenCalledWith("Vegetarian", { focusResults: false });
      expect(screen.getByText(/I found 2 vegetarian recipes/)).toBeTruthy();
    });
    expect(screen.queryByText(/trim/i)).toBeNull();
  });
});
