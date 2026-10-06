function getSearchQuery(text) {
  return text
    .replace(/\b(?:a |an |the )?(?:recipes?|dishes?) for\b/gi, " ")
    .replace(/\bhow (?:do|can|should) i search for\b/gi, " ")
    .replace(/\b(?:please|could you|can you|would you|i want|i need|i'd like|find me|find|search for|search|look up|show me|show|tell me about|give me)\b/gi, " ")
    .replace(/\b(?:vegetarian|veggie|recipes?|dishes?)\b/gi, " ")
    .replace(/\b(?:for me|to cook|to make)\b/gi, " ")
    .replace(/[?!.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectIntent(text) {
  const normalizedText = String(text || "").toLowerCase().trim();
  const addDish = (type, match) => {
    if (!match) return { type };
    const dish = match[1]
      .replace(/[?.!,]+$/, "")
      .replace(/(?:\s+(?:please|thanks|thank you|for (?:dinner|lunch|breakfast)|now|again|recipe))+$/i, "")
      .replace(/^(?:(?:a|an|the|my|this|that|some)\s+)+/i, "")
      .trim();
    if (!dish || /^(?:it|this|that|current)$/.test(dish)) {
      return { type };
    }
    return { type, dish };
  };

  if (/\b(?:bookmarks?|saved recipes?)\b/.test(normalizedText)) {
    return { type: "bookmarks" };
  }

  if (
    /\bshopping list\b/.test(normalizedText)
    || /\bwhat (?:can i buy|should i buy|to buy)\b/.test(normalizedText)
  ) {
    return { type: "shopping-list" };
  }

  if (
    /\bingredients?\b/.test(normalizedText)
    || /\bwhat(?:'s| is) in\b(?!\s+(?:my\b|the\s+(?:shopping list|bookmarks?)\b))/.test(normalizedText)
  ) {
    const dish = normalizedText.match(/\bingredients?\s+(?:for|in|of)\s+(.+?)[?.!,]*$/)
      || normalizedText.match(/\bwhat(?:'s| is)\s+in\s+(.+?)[?.!,]*$/);
    return addDish("ingredients", dish);
  }

  if (
    /\b(?:steps?|instructions?|directions?)\b/.test(normalizedText)
    || /\bhow (?:do|to|long|should|can)(?: (?:should|do|can))? ?(?:i|you|we)? ?(?:cook|make|prepare|bake|fry|boil)\b/.test(normalizedText)
  ) {
    const dish = normalizedText.match(/\b(?:steps?|instructions?|directions?)\s+(?:for|to)\s+(.+?)[?.!,]*$/)
      || normalizedText.match(/\bhow(?:\s+long)?\s+(?:(?:do|can|should)\s+(?:i|you|we)\s+|to\s+)?(?:cook|make|prepare|bake|fry|boil)\s+(.+?)[?.!,]*$/);
    return addDish("steps", dish);
  }

  if (/\b(?:cuisine|area|origin)\b/.test(normalizedText)) {
    return { type: "cuisine" };
  }

  const withIngredient = normalizedText.match(/\bwhat can i cook with\s+(.+?)[?.!]*$/);
  if (withIngredient) {
    return { type: "search", query: withIngredient[1].trim(), vegetarian: false };
  }

  if (
    /\bwhat (?:can|should) i (?:cook|make)\b/.test(normalizedText)
    || /\bwhat can i make\b/.test(normalizedText)
  ) {
    return { type: "what-can-i-cook" };
  }

  const vegetarian = /\b(?:vegetarian|veggie)\b/.test(normalizedText);
  const query = getSearchQuery(normalizedText);
  return { type: "search", query, vegetarian };
}

export { detectIntent };
