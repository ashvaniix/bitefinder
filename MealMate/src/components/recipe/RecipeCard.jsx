import { memo } from "react";
import { preloadRecipeModal } from "./recipeModalLoader";
import { useLibraryContext, useRecipeViewContext } from "../../context/AppContext";
import MealImage from "../ui/MealImage";

const RecipeCard = memo(function RecipeCard({ meal, prioritizeImage = false }) {
  const { isBookmarked, toggleBookmark } = useLibraryContext();
  const { openRecipe } = useRecipeViewContext();
  const bookmarked = isBookmarked(meal.idMeal);

  function openFromButton(event) {
    openRecipe(meal, event.currentTarget);
  }

  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-soft">
        <button
          aria-label={`View ${meal.strMeal}`}
          className="absolute inset-0 z-0 block h-full w-full cursor-pointer"
          onFocus={preloadRecipeModal}
          onMouseEnter={preloadRecipeModal}
          onClick={openFromButton}
          type="button"
        >
          <MealImage
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            meal={meal}
            prioritize={prioritizeImage}
          />
        </button>
        <button
          aria-label={bookmarked ? `Remove ${meal.strMeal} from bookmarks` : `Bookmark ${meal.strMeal}`}
          aria-pressed={bookmarked}
          className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 ${
            bookmarked
              ? "bg-accent text-brand"
              : "bg-surface/90 text-muted hover:bg-surface dark:hover:bg-surface-alt"
          }`}
          onClick={() => toggleBookmark(meal)}
          type="button"
        >
          <span aria-hidden="true" className="text-lg">{bookmarked ? "♥" : "♡"}</span>
        </button>
        {meal.strCategory && (
          <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-semibold text-brand-strong shadow-sm backdrop-blur dark:text-brand-soft">
            {meal.strCategory}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted">
          <span aria-hidden="true">📍</span>
          {meal.strArea || "From TheMealDB"}
        </div>
        <h3 className="line-clamp-2 min-h-14 text-lg font-semibold leading-7 text-ink">
          {meal.strMeal}
        </h3>
        <button
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-strong transition group-hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong dark:text-accent"
          onFocus={preloadRecipeModal}
          onMouseEnter={preloadRecipeModal}
          onClick={openFromButton}
          type="button"
        >
          View recipe <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
});

export default RecipeCard;
