import { describe, expect, it } from "vitest";
import { tagSearchResults } from "./searchResults";

describe("tagSearchResults", () => {
  it("keeps ingredient search terms out of recipe fields", () => {
    const meal = { idMeal: "1", strMeal: "Salmon dish" };
    expect(tagSearchResults([meal], { type: "ingredient", value: "salmon" })).toEqual([meal]);
  });

  it("adds the actual category only to category results", () => {
    expect(tagSearchResults([{ idMeal: "1", strMeal: "Meal" }], {
      type: "category",
      value: "Vegetarian",
    })).toEqual([{ idMeal: "1", strMeal: "Meal", strCategory: "Vegetarian" }]);
  });
});
