const LoadingGrid = ({ count = 3 }) => {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-3xl bg-surface-soft dark:bg-surface-alt"
        />
      ))}
    </div>
  );
};

export default LoadingGrid;
