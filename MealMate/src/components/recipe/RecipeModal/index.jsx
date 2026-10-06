import { useMemo } from "react";
import { getMealIngredients } from "../../../data/mealUtils";
import IngredientList from "./IngredientList";
import InstructionSteps from "./InstructionSteps";
import ModalShell from "./ModalShell";
import PersonalNote from "./PersonalNote";
import RatingStars from "./RatingStars";
import { useLibraryContext, useRecipeViewContext } from "../../../context/AppContext";
import MealImage from "../../ui/MealImage";

const RecipeModal = () => {
  const {
    selectedMeal: meal,
    closeRecipe: onClose,
    isLoadingDetails,
    detailsError,
    returnFocusRef,
  } = useRecipeViewContext();
  const {
    items: shoppingList,
    addIngredient: onAddIngredient,
    addAllIngredients: onAddAllIngredients,
    getRating,
    setRating: onSaveRating,
    getNote,
    setNote: onSaveNote,
    deleteNote: onDeleteNote,
  } = useLibraryContext();
  const ingredients = useMemo(() => getMealIngredients(meal), [meal]);
  const shoppingIngredientNames = useMemo(
    () => new Set(shoppingList.map((item) => item.name.toLowerCase())),
    [shoppingList]
  );

  return (
    <ModalShell onClose={onClose} returnFocusRef={returnFocusRef} titleId="recipe-modal-title">
      <div className="grid min-w-0 md:grid-cols-[0.9fr_1.1fr]">
        <div className="min-h-56 min-w-0 bg-surface-soft md:self-start">
          <MealImage
            alt={meal.strMeal}
            className="h-64 w-full max-w-full object-cover md:h-[min(70vh,34rem)]"
            meal={meal}
            size="large"
          />
        </div>
        <div className="min-w-0 p-5 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
            {meal.strCategory || "Recipe"}{meal.strArea ? ` · ${meal.strArea}` : ""}
          </p>
          <h2 className="mt-3 pr-8 text-3xl font-semibold leading-tight tracking-tight text-ink" id="recipe-modal-title">
            {meal.strMeal}
          </h2>
          <IngredientList
            ingredients={ingredients}
            isLoadingDetails={isLoadingDetails}
            meal={meal}
            onAddAllIngredients={onAddAllIngredients}
            onAddIngredient={onAddIngredient}
            shoppingIngredientNames={shoppingIngredientNames}
          />
          <section className="mt-8">
            <h3 className="text-lg font-semibold text-ink">Instructions</h3>
            <InstructionSteps instructions={meal.strInstructions} isLoadingDetails={isLoadingDetails} />
          </section>
          {detailsError && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200" role="alert">
              {detailsError}
            </p>
          )}
          {meal.strYoutube && (
            <a
              className="mt-7 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50"
              href={meal.strYoutube}
              rel="noreferrer"
              target="_blank"
            >
              Watch the tutorial
            </a>
          )}
          <RatingStars mealId={meal.idMeal} onSaveRating={onSaveRating} rating={getRating(meal.idMeal)} />
          <PersonalNote
            mealId={meal.idMeal}
            mealName={meal.strMeal}
            note={getNote(meal.idMeal)}
            onDeleteNote={onDeleteNote}
            onSaveNote={onSaveNote}
          />
        </div>
      </div>
    </ModalShell>
  );
};

export default RecipeModal;
