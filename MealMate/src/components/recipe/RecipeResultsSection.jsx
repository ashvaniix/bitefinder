import LoadingGrid from "../ui/LoadingGrid";
import EmptyState from "../ui/EmptyState";
import RecipeGrid from "./RecipeGrid";
import { useSearchContext } from "../../context/AppContext";

// Renders search state and recipe cards; request logic stays in useRecipeSearch.
const RecipeResultsSection = () => {
  const {
    error, hasSearched, isLoading, recipes, retry, searchLabel,
    resultsRef, visibleCount, loadMore,
  } = useSearchContext();

  return (
    <section className="pt-14" id="recipes" ref={resultsRef}>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">
            {hasSearched ? "YOUR SEARCH" : "FRESH FROM THE KITCHEN"}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-ink focus:outline-none sm:text-3xl" tabIndex={-1}>
            {isLoading
              ? hasSearched ? "Finding something delicious..." : "Discovering delicious recipes..."
              : hasSearched ? searchLabel || "Recipe results" : "Discover delicious recipes"}
          </h2>
        </div>
        {recipes.length > 0 && (
          <span aria-live="polite" className="rounded-full bg-surface-soft px-3.5 py-2 text-sm font-medium text-muted dark:bg-surface-alt dark:text-ink-soft">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200" role="alert">
          <p>{error}</p>
          <button
            className="mt-3 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900/50"
            onClick={retry}
            type="button"
          >
            Try again
          </button>
        </div>
      )}

      {!error && hasSearched && !isLoading && recipes.length === 0 && (
        <EmptyState
          description="Try another ingredient or dish name and we’ll keep looking."
          icon="🍽️"
          title="No recipes found just yet"
        />
      )}
      {isLoading && recipes.length === 0 && <LoadingGrid count={3} />}
      {!hasSearched && !isLoading && !error && recipes.length === 0 && (
        <EmptyState
          description="Try a search to explore more recipes from TheMealDB."
          title="No featured recipes are available right now"
        />
      )}
      {recipes.length > 0 && (
        <RecipeGrid meals={recipes.slice(0, visibleCount)} />
      )}
      {!isLoading && recipes.length > visibleCount && (
        <div className="mt-8 text-center">
          <button
            className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-brand transition hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50 dark:text-brand-soft"
            onClick={loadMore}
            type="button"
          >
            Load more recipes
          </button>
        </div>
      )}
    </section>
  );
};

export default RecipeResultsSection;
