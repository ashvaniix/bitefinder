import SearchBar from "../search/SearchBar";
import { useSearchContext } from "../../context/AppContext";

const POPULAR_TERMS = ["Pasta", "Chicken", "Cake", "Rice"];

// Search state comes from context; this component only renders the hero and shortcuts.
const HomeHero = () => {
  const {
    isLoading, runSearch, runCategorySearch, clearSearchHistory, replaySearch,
    searchHistory, searchQuery, searchRequestId,
  } = useSearchContext();
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-brand px-7 py-12 text-white shadow-[0_24px_70px_-35px_rgba(24,59,45,0.65)] sm:px-12 sm:py-16 lg:px-16">
      <div className="absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute -bottom-32 right-1/4 -z-10 h-72 w-72 rounded-full bg-warm-accent/15 blur-3xl" />

      <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-accent-soft">
            <span aria-hidden="true">✦</span>
            GOOD FOOD, MADE SIMPLE
          </div>

          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl" data-page-heading tabIndex={-1}>
            Find your next
            <br />
            <span className="font-serif font-medium italic text-accent">favorite meal.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-white/70 sm:text-lg">
            A little inspiration for whatever is in your fridge. Search thousands of recipes and find something delicious.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar
              isLoading={isLoading}
              onSearch={runSearch}
              searchQuery={searchQuery}
              searchRequestId={searchRequestId}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-white/70">
            <span className="mr-1 py-2">Popular:</span>
            {POPULAR_TERMS.map((term) => (
              <button
                key={term}
                className="rounded-full border border-white/15 px-3.5 py-2 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
                onClick={() => runSearch(term)}
                type="button"
              >
                {term}
              </button>
            ))}
            <button
              className="rounded-full border border-white/15 px-3.5 py-2 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
              onClick={() => runCategorySearch("Vegetarian")}
              type="button"
            >
              Vegetarian
            </button>
          </div>

          {searchHistory.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-white/70">
              <span className="mr-1 py-2">Recent:</span>
              {searchHistory.map((entry) => (
                <button
                  className="rounded-full border border-white/15 px-3 py-2 transition hover:bg-white/10 hover:text-white"
                  key={`${entry.type}:${entry.value}`}
                  onClick={() => replaySearch(entry)}
                  type="button"
                >
                  {entry.label}
                </button>
              ))}
              <button
                className="px-2 py-2 text-white/50 underline underline-offset-2 hover:text-white"
                onClick={clearSearchHistory}
                type="button"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="relative mx-auto hidden h-72 w-full max-w-sm items-center justify-center lg:flex">
          <div className="absolute h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute h-52 w-52 rounded-full border border-white/10" />
          <div className="absolute right-7 top-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-2xl shadow-lg backdrop-blur">🥑</div>
          <div className="absolute bottom-5 left-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-2xl shadow-lg backdrop-blur">🍋</div>
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[10px] border-white/10 bg-surface-warm text-8xl shadow-2xl">
            🥗
          </div>
          <div className="absolute bottom-10 right-0 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-brand shadow-xl">
            <span className="mr-2 text-amber-400">★★★★★</span>
            Fresh ideas daily
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
