import { detectIntent } from "../../data/assistantIntents";
import { lookupMeal, searchMeals } from "../../data/mealApi";
import { getMealIngredients } from "../../data/mealUtils";

function createAnswer(text, action = null) {
  return { text, action };
}

function hasRequestedDetails(meal, intentType) {
  if (intentType === "ingredients") return getMealIngredients(meal).length > 0;
  if (intentType === "steps") return Boolean(meal.strInstructions?.trim());
  return Boolean(meal.strArea?.trim());
}

async function getMealWithDetails(meal, intentType) {
  if (!meal || !meal.idMeal || hasRequestedDetails(meal, intentType)) return meal;
  return { ...meal, ...await lookupMeal(meal.idMeal) };
}

function getSearchAnswer(result, searchTerm) {
  const topic = searchTerm ? `"${searchTerm}"` : "vegetarian";
  if (result.status === "aborted") {
    return createAnswer("That search was cancelled before it finished. You can ask me to search again.");
  }
  if (result.status === "error") {
    return createAnswer(`I couldn't search for ${topic} recipes right now. Please try again.`);
  }
  if (result.status === "empty") {
    return createAnswer(`I couldn't find any ${topic} recipes. Try another search.`);
  }
  return createAnswer(`I found ${result.count} ${topic} recipe${result.count === 1 ? "" : "s"}. Open a result card to see the full recipe.`);
}

async function getAssistantAnswer(questionText, options) {
  const {
    bookmarks,
    currentMeal,
    onNavigate,
    onSearch,
    onStatus,
    onVegetarianSearch,
    recipes,
    shoppingList,
  } = options;
  const intent = detectIntent(questionText);

  if (intent.type === "bookmarks") {
    onNavigate("bookmarks");
    return createAnswer(bookmarks.length
      ? `You have ${bookmarks.length} saved recipe${bookmarks.length === 1 ? "" : "s"}: ${bookmarks.map((item) => item.strMeal).join(", ")}.`
      : "You haven't bookmarked any recipes yet. Tap the heart on a recipe to save it.");
  }

  if (intent.type === "shopping-list") {
    onNavigate("shopping");
    const remaining = shoppingList.filter((item) => !item.purchased);
    return createAnswer(remaining.length
      ? `Still on your list: ${remaining.map((item) => {
        const measurements = (item.sources || []).map((source) => source.measurement).filter(Boolean);
        return `${item.name}${measurements.length ? ` (${measurements.join(", ")})` : ""}`;
      }).join(", ")}.`
      : "Your shopping list is clear. Open a recipe and add ingredients whenever you’re ready.");
  }

  if (intent.type === "what-can-i-cook") {
    if (!recipes.length) {
      return createAnswer("Tell me an ingredient or dish to search for, like chicken or pasta, and I’ll find ideas.");
    }
    const suggestions = recipes.slice(0, 3).map((item) => item.strMeal);
    return createAnswer(`From your current results, you could make ${suggestions.join(", ")}. Pick a card to see a full recipe.`);
  }

  if (intent.type === "search") {
    if (!intent.vegetarian && !intent.query) {
      return createAnswer("Tell me the ingredient or dish you want to search for, or ask me to find vegetarian recipes.");
    }
    onNavigate("home");
    onStatus(intent.vegetarian ? "Looking up vegetarian recipes..." : `Searching for ${intent.query} recipes...`);
    try {
      const result = intent.vegetarian
        ? await onVegetarianSearch({ focusResults: false })
        : await onSearch(intent.query, { focusResults: false });
      return getSearchAnswer(result, intent.vegetarian ? "" : intent.query);
    } catch (error) {
      const detail = error.message ? ` ${error.message}` : "";
      return createAnswer(`I couldn't complete the search. Please try again.${detail}`);
    }
  }

  if (!currentMeal && !intent.dish) {
    const prompt = intent.type === "ingredients"
      ? "Search for a recipe or open one first, and I can list its ingredients."
      : intent.type === "steps"
        ? "Search for a recipe or open one first, and I can walk you through the cooking steps."
        : "Open a recipe first, and I can tell you its cuisine or area.";
    return createAnswer(prompt);
  }

  try {
    let targetMeal = currentMeal;
    if (intent.dish) {
      const matchingMeals = await searchMeals(intent.dish);
      if (!matchingMeals.length) {
        return createAnswer(`I couldn't find a recipe for ${intent.dish}.`);
      }
      targetMeal = matchingMeals[0];
    }
    const meal = await getMealWithDetails(targetMeal, intent.type);
    const action = meal?.idMeal ? { type: "open-recipe", meal } : null;
    const mealName = meal?.strMeal || targetMeal.strMeal;
    const replyMealName = intent.dish
      && intent.dish.toLowerCase() !== mealName.toLowerCase()
      ? `Closest match: ${mealName}`
      : mealName;

    if (intent.type === "ingredients") {
      const ingredients = meal ? getMealIngredients(meal) : [];
      const text = ingredients.length
        ? `${replyMealName} needs: ${ingredients.map(({ ingredient, measurement }) => `${ingredient}${measurement ? ` (${measurement})` : ""}`).join(", ")}.`
        : `I couldn't find ingredient details for ${mealName}.`;
      return createAnswer(text, action);
    }

    if (intent.type === "steps") {
      const instructions = meal?.strInstructions?.trim();
      const text = instructions
        ? `${replyMealName}: ${instructions.slice(0, 650)}${instructions.length > 650 ? "…" : ""}`
        : `I couldn't find cooking steps for ${mealName}.`;
      return createAnswer(text, action);
    }

    return createAnswer(meal?.strArea
      ? `${replyMealName} is a ${meal.strArea} recipe.`
      : `I couldn't find cuisine details for ${mealName}.`, action);
  } catch (error) {
    const mealName = intent.dish || currentMeal?.strMeal || "the selected recipe";
    if (error.name === "AbortError") {
      return createAnswer(`Loading details for ${mealName} was cancelled. Please try again.`);
    }
    const detail = error.message ? ` ${error.message}` : "";
    return createAnswer(`I couldn't load details for ${mealName}.${detail}`);
  }
}

export { createAnswer, getAssistantAnswer };
