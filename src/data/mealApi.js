import { MEALDB_API_KEY, MEALDB_BASE_URL } from "./config";

function createCache(limit) {
  const entries = new Map();

  function get(key) {
    if (!entries.has(key)) return undefined;

    const value = entries.get(key);
    entries.delete(key);
    entries.set(key, value);
    return value;
  }

  function set(key, value) {
    entries.delete(key);
    entries.set(key, value);

    while (entries.size > limit) {
      const oldestKey = entries.keys().next().value;
      entries.delete(oldestKey);
    }
  }

  function deleteEntry(key) {
    entries.delete(key);
  }

  return { get, set, delete: deleteEntry };
}

const searchCache = createCache(20);
const categoryCache = createCache(20);
const ingredientCache = createCache(20);
const detailsCache = createCache(20);
const apiBaseUrl = `${MEALDB_BASE_URL}/${MEALDB_API_KEY}`;

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Recipe request failed (${response.status}).`);
  }

  return response.json();
}

function getMeals(data) {
  return Array.isArray(data?.meals) ? data.meals : [];
}

function withSignal(promise, signal) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(new DOMException("Aborted", "AbortError"));

  return new Promise((resolve, reject) => {
    const onAbort = () => reject(new DOMException("Aborted", "AbortError"));
    const cleanup = () => signal.removeEventListener("abort", onAbort);
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(resolve, reject).then(cleanup, cleanup);
  });
}

function getCachedRequest(cache, key, load) {
  const cached = cache.get(key);
  if (cached) return cached;

  const promise = Promise.resolve()
    .then(load)
    .catch((error) => {
      cache.delete(key);
      throw error;
    });
  cache.set(key, promise);
  return promise;
}

function searchMeals(query, { signal } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return Promise.resolve([]);

  return withSignal(getCachedRequest(searchCache, normalizedQuery, async () => {
    const params = new URLSearchParams({ s: normalizedQuery });
    const data = await fetchJson(`${apiBaseUrl}/search.php?${params}`);
    return getMeals(data);
  }), signal);
}

function searchMealsByCategory(category, { signal } = {}) {
  const normalizedCategory = category.trim().toLowerCase();
  if (!normalizedCategory) return Promise.resolve([]);

  return withSignal(getCachedRequest(categoryCache, normalizedCategory, async () => {
    const params = new URLSearchParams({ c: category.trim() });
    const data = await fetchJson(`${apiBaseUrl}/filter.php?${params}`);
    return getMeals(data);
  }), signal);
}

function searchMealsByIngredient(ingredient, { signal } = {}) {
  const normalizedIngredient = ingredient.trim().toLowerCase();
  if (!normalizedIngredient) return Promise.resolve([]);

  return withSignal(getCachedRequest(ingredientCache, normalizedIngredient, async () => {
    const params = new URLSearchParams({ i: ingredient.trim() });
    const data = await fetchJson(`${apiBaseUrl}/filter.php?${params}`);
    return getMeals(data);
  }), signal);
}

function lookupMeal(id, { signal } = {}) {
  const normalizedId = String(id);

  return withSignal(getCachedRequest(detailsCache, normalizedId, async () => {
    const params = new URLSearchParams({ i: normalizedId });
    const data = await fetchJson(`${apiBaseUrl}/lookup.php?${params}`);
    const meals = getMeals(data);

    if (meals.length === 0) {
      throw new Error("Recipe details were not found.");
    }

    return meals[0];
  }), signal);
}

export {
  searchMeals,
  searchMealsByCategory,
  searchMealsByIngredient,
  lookupMeal,
  createCache,
  getCachedRequest,
  withSignal,
};
