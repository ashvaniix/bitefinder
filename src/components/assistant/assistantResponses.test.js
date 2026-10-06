import { describe, expect, it, vi } from "vitest";
import { searchMeals } from "../../data/mealApi";
import { getAssistantAnswer } from "./assistantResponses";

vi.mock("../../data/mealApi", () => ({
  lookupMeal: vi.fn(),
  searchMeals: vi.fn(),
}));

describe("getAssistantAnswer", () => {
  it("labels a recipe when the closest match differs from the requested dish", async () => {
    searchMeals.mockResolvedValue([{
      idMeal: "1",
      strMeal: "Chicken Handi",
      strIngredient1: "Chicken",
      strMeasure1: "500g",
    }]);

    const answer = await getAssistantAnswer("ingredients for chicken curry please", {
      bookmarks: [],
      currentMeal: null,
      onNavigate: vi.fn(),
      onSearch: vi.fn(),
      onStatus: vi.fn(),
      onVegetarianSearch: vi.fn(),
      recipes: [],
      shoppingList: [],
    });

    expect(answer.text).toBe("Closest match: Chicken Handi needs: Chicken (500g).");
  });
});
