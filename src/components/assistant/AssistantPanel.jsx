import { useState } from "react";
import { getAssistantAnswer } from "./assistantResponses";

const AssistantPanel = ({
  bookmarks,
  currentMeal,
  onNavigate,
  onSearch,
  onViewRecipe,
  onVegetarianSearch,
  questionInputRef,
  recipes,
  shoppingList,
}) => {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const questionText = question.trim();
    if (!questionText) {
      setError("Ask a recipe question to get started.");
      return;
    }

    setError("");
    setStatus("");
    const answer = await getAssistantAnswer(questionText, {
      bookmarks,
      currentMeal,
      onNavigate,
      onSearch,
      onStatus: setStatus,
      onVegetarianSearch,
      recipes,
      shoppingList,
    });
    setStatus("");
    setHistory((items) => [...items, { question: questionText, answer }].slice(-5));
  }

  return (
    <section className="p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">RULE-BASED HELPER</p>
      <h2 className="mt-2 text-xl font-semibold text-ink">What can I help you cook?</h2>
      <p className="mt-1 text-sm text-muted">Ask about recipes, ingredients, bookmarks, or your shopping list.</p>
      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="assistant-question">Ask a recipe question</label>
        <input
          className="min-w-0 flex-1 rounded-xl border border-border px-4 py-3 text-sm text-ink-soft outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:bg-surface-soft dark:text-ink"
          id="assistant-question"
          onChange={(event) => {
            setQuestion(event.target.value);
            if (error) setError("");
          }}
          placeholder="e.g. What ingredients do I need?"
          ref={questionInputRef}
          value={question}
        />
        <button className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover" type="submit">
          Ask
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
      {status && <output className="mt-2 block text-sm text-muted">{status}</output>}
      {history.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-soft dark:text-ink">Recent questions</h3>
            <button
              className="text-xs font-semibold text-brand-strong underline underline-offset-2 dark:text-accent"
              onClick={() => setHistory([])}
              type="button"
            >
              Clear
            </button>
          </div>
          <ol className="space-y-3">
            {history.map(({ question: asked, answer }, index) => (
              <li className="rounded-2xl bg-surface-alt p-4 text-sm leading-6 text-muted dark:bg-surface-soft dark:text-ink-soft" key={`${index}-${asked}`}>
                <p className="font-semibold text-ink-soft dark:text-ink">{asked}</p>
                <p className="mt-1">{answer.text}</p>
                {answer.action?.type === "open-recipe" && (
                  <button
                    className="mt-2 font-semibold text-brand-strong underline underline-offset-2"
                    onClick={() => onViewRecipe(answer.action.meal)}
                    type="button"
                  >
                    Open {answer.action.meal.strMeal}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
};

export default AssistantPanel;
