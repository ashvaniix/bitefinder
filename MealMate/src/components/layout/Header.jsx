import { useLibraryContext } from "../../context/AppContext";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "bookmarks", label: "Bookmarks" },
  { id: "shopping", label: "Shopping List" },
  { id: "recent", label: "Recently Viewed" },
];

const Header = () => {
  const { activeSection, navigateToSection, theme, toggleTheme, bookmarks, items } = useLibraryContext();
  const isDarkMode = theme === "dark";
  const counts = { bookmarks: bookmarks.length, shopping: items.length };

  return (
    <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
      <button
        className="flex shrink-0 items-center gap-2.5 rounded-xl text-xl font-bold tracking-tight text-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 dark:text-brand-soft"
        onClick={() => navigateToSection("home")}
        type="button"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-lg" aria-hidden="true">✳</span>
        MealMate
      </button>

      <nav
        className="order-3 -mx-1 flex w-full min-w-0 max-w-full flex-none gap-1 overflow-x-auto rounded-full border border-border bg-surface/80 p-1 shadow-sm dark:bg-surface sm:order-none sm:mx-0 sm:w-auto"
        aria-label="Main navigation"
      >
        {SECTIONS.map((section) => (
          <button
            aria-current={activeSection === section.id ? "page" : undefined}
            className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 sm:px-4 sm:text-sm ${
              activeSection === section.id
                ? "bg-brand text-white"
                : "text-muted hover:bg-surface-alt dark:text-ink-soft"
            }`}
            key={section.id}
            onClick={() => navigateToSection(section.id)}
            type="button"
          >
            {section.label}
            {counts[section.id] > 0 && (
              <span className="ml-1.5 rounded-full bg-black/10 px-1.5 py-0.5 text-[10px] dark:bg-white/10">
                {counts[section.id]}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-lg text-muted transition hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 dark:text-brand-soft"
          onClick={toggleTheme}
          type="button"
        >
          <span aria-hidden="true">{isDarkMode ? "☀" : "☾"}</span>
        </button>
        <span className="hidden text-sm font-medium text-muted lg:block">Made for the love of food</span>
      </div>
    </header>
  );
};

export default Header;
