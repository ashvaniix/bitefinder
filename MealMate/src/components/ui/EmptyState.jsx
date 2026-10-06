const EmptyState = ({ title, description, icon = "🍽️", className = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center dark:bg-surface ${className}`}
    >
      <div className="text-4xl" aria-hidden="true">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-ink-soft dark:text-ink">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted">{description}</p>
      )}
    </div>
  );
};

export default EmptyState;
