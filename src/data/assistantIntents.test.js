import { describe, expect, it } from "vitest";
import { detectIntent } from "./assistantIntents";

describe("detectIntent", () => {
  it.each([
    ["what's in my shopping list", { type: "shopping-list" }],
    ["how many bookmarks do I have", { type: "bookmarks" }],
    ["ingredients for this recipe", { type: "ingredients" }],
    ["ingredients for chicken curry", { type: "ingredients", dish: "chicken curry" }],
    ["ingredients for chicken curry please", { type: "ingredients", dish: "chicken curry" }],
    ["ingredients for the chicken curry recipe", { type: "ingredients", dish: "chicken curry" }],
    ["what is in chicken curry", { type: "ingredients", dish: "chicken curry" }],
    ["what's in the pasta", { type: "ingredients", dish: "pasta" }],
    ["what's in this", { type: "ingredients" }],
    ["how to cook rice", { type: "steps", dish: "rice" }],
    ["how do I make pancakes", { type: "steps", dish: "pancakes" }],
    ["how do I make this pasta", { type: "steps", dish: "pasta" }],
    ["how do I make it", { type: "steps" }],
    ["what can I cook with chicken", { type: "search", query: "chicken", vegetarian: false }],
    ["clam chowder recipe", { type: "search", query: "clam chowder", vegetarian: false }],
  ])("classifies %s", (phrase, expected) => {
    expect(detectIntent(phrase)).toEqual(expected);
  });

  it("does not treat a recipe search question as cooking steps", () => {
    expect(detectIntent("how do I search for pasta")).toEqual({
      type: "search",
      query: "pasta",
      vegetarian: false,
    });
  });

  it("recognizes common cooking-time questions as steps", () => {
    expect(detectIntent("how long should I cook salmon").type).toBe("steps");
  });
});
