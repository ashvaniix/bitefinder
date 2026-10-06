export function tagSearchResults(meals, { type, value }) {
  if (type !== "category") return meals;

  return meals.map((meal) => ({
    ...meal,
    strCategory: value,
  }));
}
