const Toast = ({ message, actionLabel, onAction, onDismiss }) => (
  <output aria-live="polite" className="fixed bottom-24 left-1/2 z-[70] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-4 rounded-2xl bg-toast px-4 py-3 text-sm text-toast-ink shadow-xl sm:bottom-5">
    <span>{message}</span>
    {actionLabel && (
      <button className="shrink-0 font-bold text-accent underline underline-offset-2" onClick={onAction} type="button">
        {actionLabel}
      </button>
    )}
    <button aria-label="Dismiss notification" className="rounded-full px-1 text-lg leading-none text-white/80 hover:text-white" onClick={onDismiss} type="button">×</button>
  </output>
);

export default Toast;
