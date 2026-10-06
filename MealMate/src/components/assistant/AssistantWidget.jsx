import { useCallback, useEffect, useRef, useState } from "react";
import AssistantPanel from "./AssistantPanel";
import { useLibraryContext, useRecipeViewContext, useSearchContext } from "../../context/AppContext";

const AssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const questionInputRef = useRef(null);
  const { bookmarks, items, navigateToSection } = useLibraryContext();
  const { recipes, runSearch, runCategorySearch } = useSearchContext();
  const { selectedMeal, recentlyViewed, openRecipe } = useRecipeViewContext();
  const searchVegetarian = useCallback(
    (options) => runCategorySearch("Vegetarian", options),
    [runCategorySearch]
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    questionInputRef.current?.focus();

    function handleKeyDown(event) {
      if (
        event.key !== "Escape" ||
        document.querySelector('dialog[aria-modal="true"], [role="dialog"][aria-modal="true"]')
      ) return;
      setIsOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function closeWidget() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="fixed bottom-5 right-4 z-[60] sm:right-8">
      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close MealMate assistant" : "Open MealMate assistant"}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-brand px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50"
        onClick={() => {
          if (isOpen) closeWidget();
          else setIsOpen(true);
        }}
        ref={triggerRef}
        type="button"
      >
        <span aria-hidden="true" className="text-lg">✦</span>
        <span className="hidden sm:inline">Ask MealMate</span>
      </button>
      <div
        aria-hidden={!isOpen}
        className={`absolute bottom-16 right-0 w-[min(22rem,calc(100vw-2rem))] origin-bottom-right transition duration-200 ease-out ${
          isOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
        inert={!isOpen}
      >
        <div className="max-h-[min(72vh,38rem)] overflow-y-auto overscroll-contain rounded-3xl border border-border bg-surface shadow-2xl shadow-brand/20">
          <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">RECIPE HELPER</p>
              <h2 className="mt-1 text-lg font-semibold text-ink">Ask MealMate</h2>
            </div>
            <button
              aria-label="Close assistant"
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-muted transition hover:bg-surface-alt dark:text-ink-soft"
              onClick={closeWidget}
              type="button"
            >
              ×
            </button>
          </div>
          <AssistantPanel
            bookmarks={bookmarks}
            currentMeal={selectedMeal || recentlyViewed[0] || recipes[0] || bookmarks[0]}
            onNavigate={navigateToSection}
            onSearch={runSearch}
            onVegetarianSearch={searchVegetarian}
            onViewRecipe={openRecipe}
            questionInputRef={questionInputRef}
            recipes={recipes}
            shoppingList={items}
          />
        </div>
      </div>
    </div>
  );
};

export default AssistantWidget;
