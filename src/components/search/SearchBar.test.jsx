/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SearchBar from "./SearchBar";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("SearchBar", () => {
  it("keeps the focused input mounted while submitting and syncing a search request", () => {
    vi.stubGlobal("requestAnimationFrame", (callback) => {
      callback();
      return 0;
    });
    const onSearch = vi.fn();
    const props = { isLoading: false, onSearch, searchQuery: "", searchRequestId: 0 };
    const { rerender } = render(<SearchBar {...props} />);
    const input = screen.getByRole("searchbox", { name: "Search recipes" });

    input.focus();
    fireEvent.change(input, { target: { value: "pasta" } });
    fireEvent.submit(input.closest("form"));

    expect(onSearch).toHaveBeenCalledWith("pasta", { focusResults: false });

    rerender(<SearchBar {...props} searchQuery="pasta" searchRequestId={1} />);

    expect(screen.getByRole("searchbox", { name: "Search recipes" })).toBe(input);
    expect(document.activeElement).toBe(input);
  });
});
