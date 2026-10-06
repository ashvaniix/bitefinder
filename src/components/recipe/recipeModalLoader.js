let modalImport;

export function loadRecipeModal() {
  if (!modalImport) {
    modalImport = import("./RecipeModal/index.jsx");
  }
  return modalImport;
}

export function preloadRecipeModal() {
  loadRecipeModal().catch((error) => {
    console.error("Could not preload the recipe details dialog.", error);
  });
}
