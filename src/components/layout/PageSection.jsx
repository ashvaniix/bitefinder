const PageSection = ({ eyebrow, title, actions, children }) => (
  <section>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow mb-2">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink" data-page-heading tabIndex={-1}>
          {title}
        </h1>
      </div>
      {actions}
    </div>
    {children}
  </section>
);

export default PageSection;
