const RatingStars = ({ mealId, rating, onSaveRating }) => (
  <fieldset className="mt-8 border-t border-border-subtle pt-6">
    <legend className="text-lg font-semibold text-ink">Your rating</legend>
    <div className="mt-3 flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          aria-label={`${star} ${star === 1 ? "star" : "stars"}${rating === star ? ", selected; activate again to clear" : ""}`}
          aria-pressed={rating === star}
          className={`rounded text-2xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${rating >= star ? "text-amber-500" : "text-muted"}`}
          key={star}
          onClick={() => onSaveRating(mealId, rating === star ? 0 : star)}
          type="button"
        >
          ★
        </button>
      ))}
    </div>
    <p className="mt-2 text-sm text-muted dark:text-ink-soft" aria-live="polite">
      {rating
        ? `Your rating: ${rating} out of 5 stars. Click the selected star again to clear it.`
        : "Select a star to rate this recipe."}
    </p>
  </fieldset>
);

export default RatingStars;
