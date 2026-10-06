import RecipeCard from "./RecipeCard";
import EmptyState from "../ui/EmptyState";

const RecipeGrid = ({
  meals,
  emptyTitle,
  emptyDescription,
  emptyIcon = "🍽️",
}) => {
  if (!meals.length) {
    return <EmptyState description={emptyDescription} icon={emptyIcon} title={emptyTitle} />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {meals.map((meal, index) => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
          prioritizeImage={index < 3}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
