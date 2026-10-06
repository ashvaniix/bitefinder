import RecipeGrid from "../recipe/RecipeGrid";
import PageSection from "../layout/PageSection";
import { useLibraryContext } from "../../context/AppContext";

const BookmarksSection = () => {
  const { bookmarks } = useLibraryContext();
  return (
    <PageSection eyebrow="YOUR FAVORITES" title="Bookmarked recipes">
      <RecipeGrid
        emptyDescription="Your saved recipes will show up here. Tap the heart on a recipe to bookmark it."
        emptyIcon="💛"
        emptyTitle="No bookmarks yet"
        meals={bookmarks}
      />
    </PageSection>
  );
};

export default BookmarksSection;
