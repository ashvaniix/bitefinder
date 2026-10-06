import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LibraryContext,
  RecipeViewContext,
  SearchContext,
} from "../context/AppContext";
import { useBookmarks } from "../hooks/useBookmarks";
import { useRecipeDetails } from "../hooks/useRecipeDetails";
import { useRecipeFeedback } from "../hooks/useRecipeFeedback";
import { useRecipeSearch } from "../hooks/useRecipeSearch";
import { useShoppingList } from "../hooks/useShoppingList";
import { useTheme } from "../hooks/useTheme";

function sectionFromHash() {
  if (typeof window === "undefined") return "home";
  const section = window.location.hash.replace(/^#\/?/, "");
  return ["bookmarks", "shopping", "recent"].includes(section) ? section : "home";
}

const AppProviders = ({ children }) => {
  const [activeSection, setActiveSection] = useState(sectionFromHash);
  const resultsRef = useRef(null);
  const navigateToSection = useCallback((section) => {
    setActiveSection(section);
    if (typeof window === "undefined") return;
    const hash = section === "home" ? "#/" : `#/${section}`;
    if (window.location.hash !== hash) window.location.hash = hash;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    function syncSectionFromHash() {
      setActiveSection(sectionFromHash());
    }
    window.addEventListener("hashchange", syncSectionFromHash);
    return () => window.removeEventListener("hashchange", syncSectionFromHash);
  }, []);

  const theme = useTheme();
  const bookmarks = useBookmarks();
  const shopping = useShoppingList();
  const feedback = useRecipeFeedback();
  const details = useRecipeDetails();
  const search = useRecipeSearch({ onNavigate: navigateToSection, resultsRef });

  const libraryValue = useMemo(() => ({
    activeSection,
    navigateToSection,
    theme: theme.theme,
    toggleTheme: theme.toggleTheme,
    bookmarks: bookmarks.bookmarks,
    toggleBookmark: bookmarks.toggleBookmark,
    isBookmarked: bookmarks.isBookmarked,
    items: shopping.items,
    addIngredient: shopping.addIngredient,
    addAllIngredients: shopping.addAllIngredients,
    togglePurchased: shopping.togglePurchased,
    remove: shopping.remove,
    restoreItem: shopping.restoreItem,
    clearPurchased: shopping.clearPurchased,
    clearAll: shopping.clearAll,
    getRating: feedback.getRating,
    setRating: feedback.setRating,
    getNote: feedback.getNote,
    setNote: feedback.setNote,
    deleteNote: feedback.deleteNote,
  }), [
    activeSection, navigateToSection, theme.theme, theme.toggleTheme,
    bookmarks.bookmarks, bookmarks.toggleBookmark, bookmarks.isBookmarked,
    shopping.items, shopping.addIngredient, shopping.addAllIngredients,
    shopping.togglePurchased, shopping.remove, shopping.restoreItem,
    shopping.clearPurchased, shopping.clearAll, feedback.getRating,
    feedback.setRating, feedback.getNote, feedback.setNote, feedback.deleteNote,
  ]);

  const searchValue = useMemo(() => ({
    resultsRef,
    recipes: search.recipes,
    isLoading: search.isLoading,
    error: search.error,
    hasSearched: search.hasSearched,
    searchLabel: search.searchLabel,
    searchQuery: search.searchQuery,
    searchRequestId: search.searchRequestId,
    setSearchQuery: search.setSearchQuery,
    visibleCount: search.visibleCount,
    loadMore: search.loadMore,
    searchHistory: search.searchHistory,
    clearSearchHistory: search.clearSearchHistory,
    runSearch: search.runSearch,
    runCategorySearch: search.runCategorySearch,
    replaySearch: search.replaySearch,
    retry: search.retry,
  }), [
    search.recipes, search.isLoading, search.error, search.hasSearched,
    search.searchLabel, search.searchQuery, search.searchRequestId, search.setSearchQuery,
    search.visibleCount, search.loadMore, search.searchHistory,
    search.clearSearchHistory, search.runSearch, search.runCategorySearch,
    search.replaySearch, search.retry,
  ]);

  const recipeViewValue = useMemo(() => ({
    selectedMeal: details.selectedMeal,
    openRecipe: details.openRecipe,
    closeRecipe: details.closeRecipe,
    isLoadingDetails: details.isLoadingDetails,
    detailsError: details.detailsError,
    recentlyViewed: details.recentlyViewed,
    clearRecentlyViewed: details.clearRecentlyViewed,
    returnFocusRef: details.returnFocusRef,
  }), [
    details.selectedMeal, details.openRecipe, details.closeRecipe,
    details.isLoadingDetails, details.detailsError, details.recentlyViewed,
    details.clearRecentlyViewed, details.returnFocusRef,
  ]);

  return (
    <LibraryContext.Provider value={libraryValue}>
      <SearchContext.Provider value={searchValue}>
        <RecipeViewContext.Provider value={recipeViewValue}>
          {children}
        </RecipeViewContext.Provider>
      </SearchContext.Provider>
    </LibraryContext.Provider>
  );
};

export default AppProviders;
