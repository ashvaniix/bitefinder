function getSteps(instructions) {
  const cleaned = instructions?.trim();
  if (!cleaned) return [];
  const lines = cleaned
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:step\s*)?\d+[\s.): -]+/i, "").trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;
  const sentences = cleaned.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).filter(Boolean);
  return sentences.length > 1 ? sentences : [cleaned];
}

const InstructionSteps = ({ instructions, isLoadingDetails }) => {
  const steps = getSteps(instructions);
  if (!steps.length) {
    return (
      <p className="mt-3 text-sm leading-7 text-muted dark:text-ink-soft">
        {isLoadingDetails ? "Loading cooking instructions..." : "No cooking instructions are available."}
      </p>
    );
  }

  return (
    <ol className="mt-3 space-y-3">
      {steps.map((step, index) => (
        <li className="flex gap-3 text-sm leading-7 text-muted dark:text-ink-soft" key={`${index}-${step.slice(0, 24)}`}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-soft text-xs font-bold text-brand-strong dark:bg-surface-alt dark:text-brand-soft">
            {index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
};

export default InstructionSteps;
