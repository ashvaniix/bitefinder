import { useState } from "react";
import { getThumb } from "../../data/mealUtils";

const MealImage = ({
  meal,
  size = "medium",
  alt = "",
  className = "",
  prioritize = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const source = getThumb(meal, size);

  if (!source || hasError) {
    return (
      <div
        aria-hidden="true"
        className={`flex items-center justify-center bg-surface-soft text-4xl font-semibold text-muted dark:bg-surface-alt dark:text-ink-soft ${className}`}
      >
        <span aria-hidden="true">{meal.strMeal?.trim().charAt(0).toUpperCase() || "🍽️"}</span>
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={className}
      fetchPriority={prioritize ? "high" : "auto"}
      loading={prioritize ? "eager" : "lazy"}
      onError={() => setHasError(true)}
      src={source}
    />
  );
};

export default MealImage;
