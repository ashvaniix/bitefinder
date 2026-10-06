import RecipeGrid from "../recipe/RecipeGrid";
import PageSection from "../layout/PageSection";
import { useRecipeViewContext } from "../../context/AppContext";

const RecentlyViewedSection = () => {
  const { recentlyViewed: meals, clearRecentlyViewed: onClear } = useRecipeViewContext();
  return (
    <PageSection
      actions={meals.length > 0 && (
        <button
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong dark:text-ink-soft"
          onClick={() => {
            if (window.confirm("Clear your recently viewed recipes?")) onClear();
          }}
          type="button"
        >
          Clear history
        </button>
      )}
      eyebrow="PICK UP WHERE YOU LEFT OFF"
      title="Recently viewed"
    >
      <RecipeGrid
        emptyDescription="Recipes you open will appear here."
        emptyIcon="🕘"
        emptyTitle="No recent recipes yet"
        meals={meals}
      />
    </PageSection>
  );
};

export default RecentlyViewedSection;
