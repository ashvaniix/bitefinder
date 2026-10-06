import { describe, expect, it } from "vitest";
import { normalizeItem } from "./useShoppingList";

describe("normalizeItem", () => {
  it("migrates a legacy measurement into a shopping-list source", () => {
    expect(normalizeItem({
      id: "rice",
      name: "Rice",
      measurement: "2 cups",
    })).toEqual({
      id: "rice",
      name: "Rice",
      purchased: false,
      sources: [{ recipeId: "", recipeName: "", measurement: "2 cups" }],
    });
  });

  it("migrates a legacy measurement when sources is an empty array", () => {
    expect(normalizeItem({
      id: "rice",
      name: "Rice",
      measurement: "2 cups",
      sources: [],
    }).sources).toEqual([
      { recipeId: "", recipeName: "", measurement: "2 cups" },
    ]);
  });
});
