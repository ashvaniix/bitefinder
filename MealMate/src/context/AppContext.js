import { createContext, useContext } from "react";

const LibraryContext = createContext(null);
const SearchContext = createContext(null);
const RecipeViewContext = createContext(null);

function useRequiredContext(context, name) {
  const value = useContext(context);
  if (!value) throw new Error(`${name} must be used within AppProviders.`);
  return value;
}

export function useLibraryContext() {
  return useRequiredContext(LibraryContext, "useLibraryContext");
}

export function useSearchContext() {
  return useRequiredContext(SearchContext, "useSearchContext");
}

export function useRecipeViewContext() {
  return useRequiredContext(RecipeViewContext, "useRecipeViewContext");
}

export { LibraryContext, SearchContext, RecipeViewContext };
