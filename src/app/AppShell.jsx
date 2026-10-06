import { lazy, Suspense, useEffect, useRef } from "react";
import Header from "../components/layout/Header";
import HomeHero from "../components/home/HomeHero";
import RecipeResultsSection from "../components/recipe/RecipeResultsSection";
import BookmarksSection from "../components/bookmarks/BookmarksSection";
import ShoppingSection from "../components/shopping/ShoppingSection";
import RecentlyViewedSection from "../components/recent/RecentlyViewedSection";
import { useLibraryContext, useRecipeViewContext } from "../context/AppContext";
import { loadRecipeModal, preloadRecipeModal } from "../components/recipe/recipeModalLoader";

const RecipeModal = lazy(loadRecipeModal);
const AssistantWidget = lazy(() => import("../components/assistant/AssistantWidget"));

const AppShell = () => {
  const { activeSection } = useLibraryContext();
  const { selectedMeal } = useRecipeViewContext();
  const previousSection = useRef(activeSection);

  useEffect(() => {
    if (previousSection.current === activeSection) return;
    previousSection.current = activeSection;
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => {
      document.querySelector("[data-page-heading]")?.focus();
    });
  }, [activeSection]);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preloadRecipeModal);
      return () => {
        if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      };
    }
    const timer = window.setTimeout(preloadRecipeModal, 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-surface-base text-ink">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:px-12" id="main-content">
        {activeSection === "home" && (
          <>
            <HomeHero />
            <RecipeResultsSection />
          </>
        )}
        {activeSection === "bookmarks" && <BookmarksSection />}
        {activeSection === "shopping" && <ShoppingSection />}
        {activeSection === "recent" && <RecentlyViewedSection />}
      </main>

      <div inert={Boolean(selectedMeal)}>
        <Suspense fallback={null}>
          <AssistantWidget />
        </Suspense>
      </div>
      {selectedMeal && (
        <Suspense
          fallback={(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation">
              <dialog aria-label="Loading recipe details" aria-modal="true" className="m-0 rounded-2xl border-0 bg-surface px-6 py-5 text-sm font-semibold text-ink shadow-xl" open>
                Loading recipe details…
              </dialog>
            </div>
          )}
        >
          <RecipeModal key={selectedMeal.idMeal} />
        </Suspense>
      )}
    </div>
  );
};

export default AppShell;
