import { useEffect } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

// Keep keyboard focus inside an open dialog and return it to the opener on close.
export function useFocusTrap({ containerRef, isActive, returnFocusRef, onEscape }) {
  useEffect(() => {
    if (!isActive) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const previousFocus = document.activeElement;
    const returnFocusElement = returnFocusRef?.current;
    container.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = [...container.querySelectorAll(FOCUSABLE_SELECTOR)]
        .filter((element) => element.getClientRects().length > 0);

      if (!focusableElements.length) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && (document.activeElement === first || document.activeElement === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const focusTarget = returnFocusElement || previousFocus;
      if (focusTarget instanceof HTMLElement && focusTarget.isConnected) focusTarget.focus();
    };
  }, [containerRef, isActive, onEscape, returnFocusRef]);
}
