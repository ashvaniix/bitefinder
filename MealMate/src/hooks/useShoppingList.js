import { useCallback, useMemo } from "react";
import { getMealIngredients } from "../data/mealUtils";
import { useLocalStorage } from "./useLocalStorage";

const EMPTY_SHOPPING_LIST = [];

function isShoppingList(value) {
  return Array.isArray(value) && value.every((item) => item && typeof item.name === "string");
}

export function normalizeItem(item) {
  if (!item || typeof item.name !== "string") return null;
  const source = item.source || (item.recipeName || item.measurement
    ? { recipeId: item.recipeId || "", recipeName: item.recipeName || "", measurement: item.measurement || "" }
    : null);

  return {
    id: item.id || item.name.toLowerCase(),
    name: item.name,
    purchased: Boolean(item.purchased),
    sources: Array.isArray(item.sources) && item.sources.length > 0
      ? item.sources
      : source ? [source] : [],
  };
}

export function useShoppingList() {
  const [storedItems, setItems] = useLocalStorage(
    "mealmate-shopping-list",
    EMPTY_SHOPPING_LIST,
    isShoppingList
  );
  const items = useMemo(
    () => storedItems.map(normalizeItem).filter(Boolean),
    [storedItems]
  );

  const addIngredient = useCallback((ingredient, measurement = "", meal = null) => {
    const key = ingredient.trim().toLowerCase();
    if (!key) return;
    const source = meal
      ? { recipeId: meal.idMeal, recipeName: meal.strMeal, measurement: measurement || "" }
      : measurement ? { recipeId: "", recipeName: "", measurement } : null;

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.name.toLowerCase() === key);
      if (!existing) {
        return [...currentItems, {
          id: key,
          name: ingredient.trim(),
          purchased: false,
          sources: source ? [source] : [],
        }];
      }

      if (!source) return currentItems;
      const normalized = normalizeItem(existing);
      const sourceAlreadyAdded = normalized.sources.some(
        (item) => item.recipeId === source.recipeId && item.recipeName === source.recipeName
      );
      if (sourceAlreadyAdded) return currentItems;

      return currentItems.map((item) => item.id === existing.id
        ? { ...normalized, sources: [...normalized.sources, source] }
        : item);
    });
  }, [setItems]);

  const addAllIngredients = useCallback((meal) => {
    getMealIngredients(meal).forEach(({ ingredient, measurement }) => {
      addIngredient(ingredient, measurement, meal);
    });
  }, [addIngredient]);

  const togglePurchased = useCallback((id) => {
    setItems((currentItems) => currentItems.map((item) =>
      item.id === id ? { ...normalizeItem(item), purchased: !item.purchased } : item
    ));
  }, [setItems]);

  const remove = useCallback((id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, [setItems]);

  const restoreItem = useCallback((item) => {
    setItems((currentItems) => currentItems.some((current) => current.id === item.id)
      ? currentItems
      : [...currentItems, item]);
  }, [setItems]);

  const clearPurchased = useCallback(() => {
    setItems((currentItems) => currentItems.filter((item) => !item.purchased));
  }, [setItems]);

  const clearAll = useCallback(() => setItems([]), [setItems]);

  return { items, addIngredient, addAllIngredients, togglePurchased, remove, restoreItem, clearPurchased, clearAll };
}
