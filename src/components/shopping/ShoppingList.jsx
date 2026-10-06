import { useState } from "react";
import Toast from "../ui/Toast";
import { useToast } from "../../hooks/useToast";

const ShoppingList = ({ items, onTogglePurchased, onRemove, onRestoreItem, onClearPurchased, onClearAll }) => {
  const purchasedCount = items.filter((item) => item.purchased).length;
  const [copyMessage, setCopyMessage] = useState("");
  const { toast, showToast, dismissToast } = useToast();

  async function copyList() {
    const text = items.map((item) => {
      const sources = (item.sources || [])
        .map((source) => [source.measurement, source.recipeName].filter(Boolean).join(" · "))
        .filter(Boolean);
      const details = sources.length ? ` — ${sources.join("; ")}` : "";
      return `${item.purchased ? "[x]" : "[ ]"} ${item.name}${details}`;
    }).join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Shopping list copied.");
    } catch (error) {
      console.error("Could not copy the shopping list.", error);
      setCopyMessage("Clipboard access is unavailable in this browser.");
    }
  }

  return (
    <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">YOUR PREP LIST</p>
          <h2 className="mt-2 text-xl font-semibold text-ink">
            {items.length ? `${items.length} ${items.length === 1 ? "item" : "items"}` : "Your list is empty"}
          </h2>
        </div>
        {toast && (
          <Toast
            actionLabel={toast.action ? "Undo" : ""}
            message={toast.message}
            onAction={() => {
              toast.action();
              dismissToast();
            }}
            onDismiss={dismissToast}
          />
        )}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-xl bg-surface-alt px-3 py-2 text-xs font-semibold text-muted hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong dark:text-ink-soft dark:hover:bg-border"
              onClick={copyList}
              type="button"
            >
              Copy list
            </button>
            {purchasedCount > 0 && (
              <button
                className="rounded-xl bg-surface-alt px-3 py-2 text-xs font-semibold text-muted hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong dark:text-ink-soft dark:hover:bg-border"
                onClick={() => {
                  if (window.confirm(`Clear ${purchasedCount} purchased item${purchasedCount === 1 ? "" : "s"}?`)) onClearPurchased();
                }}
                type="button"
              >
                Clear purchased
              </button>
            )}
            <button
              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-800 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-900 dark:text-red-200 dark:hover:bg-red-950/50"
              onClick={() => {
                if (window.confirm("Clear your entire shopping list?")) onClearAll();
              }}
              type="button"
            >
              Clear list
            </button>
          </div>
        )}
      </div>
      {copyMessage && (
        <output className="mt-3 block text-sm text-muted dark:text-ink-soft">{copyMessage}</output>
      )}

      {items.length > 0 ? (
        <ul className="mt-5 divide-y divide-border-subtle">
          {items.map((item) => (
            <li className="flex items-center gap-3 py-3" key={item.id}>
              <input
                aria-label={`Mark ${item.name} as purchased`}
                checked={item.purchased}
                className="h-4 w-4 accent-brand-strong"
                onChange={() => onTogglePurchased(item.id)}
                type="checkbox"
              />
              <span className={`min-w-0 flex-1 text-sm ${item.purchased ? "text-muted line-through" : "text-ink-soft"}`}>
                {item.name}
                {(item.sources || []).length > 0 && (
                  <span className="mt-1 block text-xs not-italic text-muted">
                    {item.sources.map((source) => [
                      source.measurement,
                      source.recipeName ? `from ${source.recipeName}` : "",
                    ].filter(Boolean).join(" ")).filter(Boolean).join(" · ")}
                  </span>
                )}
              </span>
              <button
                aria-label={`Remove ${item.name}`}
                className="rounded-lg px-2 py-1 text-lg leading-none text-muted hover:bg-red-50 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-950/50 dark:hover:text-red-200"
                onClick={() => {
                  onRemove(item.id);
                  showToast(`Removed ${item.name}`, () => onRestoreItem(item));
                }}
                type="button"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted">
          Open a recipe and add ingredients here. You can check items off as you shop.
        </p>
      )}
    </section>
  );
};

export default ShoppingList;
