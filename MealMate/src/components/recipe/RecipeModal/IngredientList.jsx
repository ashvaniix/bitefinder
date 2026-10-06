const IngredientList = ({
  meal,
  ingredients,
  shoppingIngredientNames,
  onAddIngredient,
  onAddAllIngredients,
  isLoadingDetails,
}) => (
  <section className="mt-8">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-lg font-semibold text-ink">Ingredients</h3>
      {(ingredients.length > 0 || isLoadingDetails) && (
        <button
          className="rounded-full bg-surface-soft px-3 py-2 text-xs font-semibold text-brand-strong transition hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong dark:bg-surface-alt dark:text-brand-soft dark:hover:bg-border"
          disabled={isLoadingDetails || ingredients.length === 0}
          onClick={() => onAddAllIngredients(meal)}
          type="button"
        >
          {isLoadingDetails ? "Loading ingredients..." : "Add all to shopping list"}
        </button>
      )}
    </div>
    {ingredients.length ? (
      <ul className="mt-3 space-y-2">
        {ingredients.map(({ ingredient, measurement }, index) => {
          const isAdded = shoppingIngredientNames.has(ingredient.toLowerCase());
          return (
            <li
              className="flex items-center justify-between gap-4 border-b border-border-subtle py-2 text-sm text-muted dark:text-ink-soft"
              key={`${meal.idMeal}-${index}`}
            >
              <span className="min-w-0 flex-1">
                {ingredient}
                {measurement && <span className="ml-2 text-muted">{measurement}</span>}
              </span>
              <button
                aria-label={`${isAdded ? "Already added" : "Add"} ${ingredient} to shopping list`}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-brand-strong hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong disabled:text-muted dark:text-accent"
                disabled={isAdded}
                onClick={() => onAddIngredient(ingredient, measurement, meal)}
                type="button"
              >
                {isAdded ? "Added" : "Add"}
              </button>
            </li>
          );
        })}
      </ul>
    ) : (
      <p className="mt-2 text-sm text-muted">
        {isLoadingDetails ? "Loading ingredients..." : "No ingredient details are available."}
      </p>
    )}
  </section>
);

export default IngredientList;
