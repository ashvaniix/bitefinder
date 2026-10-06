import { useRef, useState } from "react";

const SearchBar = ({ onSearch, isLoading, searchQuery = "", searchRequestId = 0 }) => {
  const inputRef = useRef(null);
  const [query, setQuery] = useState(searchQuery);
  const [previousQuery, setPreviousQuery] = useState(searchQuery);
  const [previousSearchRequestId, setPreviousSearchRequestId] = useState(searchRequestId);
  const [validationMessage, setValidationMessage] = useState("");

  if (searchQuery !== previousQuery || searchRequestId !== previousSearchRequestId) {
    setPreviousQuery(searchQuery);
    setPreviousSearchRequestId(searchRequestId);
    setQuery(searchQuery);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const submittedQuery = query.trim();
    if (!submittedQuery) {
      setValidationMessage("Enter a recipe name or ingredient to search.");
      return;
    }
    setValidationMessage("");
    setQuery(submittedQuery);
    onSearch(submittedQuery, { focusResults: false });
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div>
      <form className="flex rounded-2xl bg-white p-1.5 shadow-xl shadow-black/10 focus-within:ring-4 focus-within:ring-accent/30" onSubmit={handleSubmit}>
        <input
          aria-label="Search recipes"
          aria-invalid={Boolean(validationMessage)}
          aria-describedby={validationMessage ? "search-validation" : undefined}
          className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-ink-input outline-none placeholder:text-muted-input sm:px-5"
          ref={inputRef}
          type="search"
          placeholder="Try “creamy pasta” or “chicken”"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (validationMessage) setValidationMessage("");
          }}
        />
        <button
          className="shrink-0 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-brand transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:px-7"
          type="submit"
        >
          {isLoading ? "Searching..." : "Find recipes"}
        </button>
      </form>
      {validationMessage && (
        <p className="mt-2 px-2 text-sm text-white" id="search-validation" role="alert">
          {validationMessage}
        </p>
      )}
    </div>
  );
};

export default SearchBar;
