export function getMealIngredients(meal) {
  return Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    const ingredient = meal[`strIngredient${number}`]?.trim();
    const measurement = meal[`strMeasure${number}`]?.trim();
    return ingredient ? { ingredient, measurement } : null;
  }).filter(Boolean);
}

export function getThumb(meal, size = "medium") {
  const thumbnail = meal?.strMealThumb?.trim().replace(/\/+$/, "");
  if (!thumbnail) return "";
  const resolution = size === "large" ? "large" : "medium";
  return thumbnail.replace(/\/(?:medium|large)$/, "") + `/${resolution}`;
}

export function stripSyntheticSearchFields(meal) {
  if (!meal || typeof meal !== "object") return meal;
  const fields = { ...meal };
  const hasSyntheticFields = Boolean(fields.searchLabel) || fields.strCategory === "Ingredient match";
  delete fields.searchLabel;
  if (hasSyntheticFields) delete fields.strIngredient1;
  if (fields.strCategory === "Ingredient match") delete fields.strCategory;
  return fields;
}
