import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusTrap } from "../../../hooks/useFocusTrap";

const ModalShell = ({ titleId, onClose, returnFocusRef, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const isClosingRef = useRef(false);
  const closeTimer = useRef(null);
  const dialogRef = useRef(null);

  const requestClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
    closeTimer.current = window.setTimeout(onClose, 170);
  }, [onClose]);

  useFocusTrap({ containerRef: dialogRef, isActive: true, returnFocusRef, onEscape: requestClose });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    if (dialog) dialog.scrollTop = 0;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div
      className={`recipe-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-overlay/70 p-3 backdrop-blur-sm sm:p-6 ${isClosing ? "recipe-modal-backdrop-closing" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      role="presentation"
    >
      <dialog
        aria-labelledby={titleId}
        aria-modal="true"
        className={`recipe-modal-dialog relative m-0 max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-3xl border-0 bg-surface p-0 shadow-2xl sm:max-h-[calc(100dvh-3rem)] ${isClosing ? "recipe-modal-dialog-closing" : ""}`}
        ref={dialogRef}
        open
        tabIndex={-1}
      >
        <button
          aria-label="Close recipe details"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-2xl text-ink shadow transition hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60"
          onClick={requestClose}
          type="button"
        >
          ×
        </button>
        {children}
      </dialog>
    </div>
  );
};

export default ModalShell;
