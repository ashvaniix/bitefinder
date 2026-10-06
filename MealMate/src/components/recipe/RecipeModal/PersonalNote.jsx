import { useState } from "react";

const PersonalNote = ({ mealId, mealName, note, onSaveNote, onDeleteNote }) => {
  const [noteInput, setNoteInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  function saveNote(event) {
    event.preventDefault();
    const trimmed = noteInput.trim();
    if (!trimmed) {
      setMessage("Write a note before saving.");
      return;
    }
    onSaveNote(mealId, trimmed);
    setNoteInput("");
    setIsEditing(false);
    setMessage("");
  }

  function deleteNote() {
    if (!window.confirm(`Delete your note for ${mealName}?`)) return;
    onDeleteNote(mealId);
    setNoteInput("");
    setIsEditing(false);
  }

  return (
    <section className="mt-8 border-t border-border-subtle pt-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">Personal note</h3>
        {note && !isEditing && (
          <div className="flex gap-3">
            <button
              className="rounded text-sm font-semibold text-brand-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong dark:text-accent"
              onClick={() => {
                setNoteInput(note);
                setIsEditing(true);
              }}
              type="button"
            >
              Edit
            </button>
            <button
              className="rounded text-sm font-semibold text-red-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-300"
              onClick={deleteNote}
              type="button"
            >
              Delete note
            </button>
          </div>
        )}
      </div>
      {note && !isEditing && (
        <p className="mt-3 whitespace-pre-wrap rounded-xl bg-surface-alt p-4 text-sm leading-6 text-muted dark:bg-surface-soft dark:text-ink-soft">
          {note}
        </p>
      )}
      {(isEditing || !note) && (
        <form className="mt-3" onSubmit={saveNote}>
          <label className="sr-only" htmlFor={`recipe-note-${mealId}`}>Your note for {mealName}</label>
          <textarea
            className="min-h-24 w-full resize-y rounded-xl border border-border bg-surface p-3 text-sm text-ink-soft outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 dark:bg-surface-soft dark:text-ink"
            id={`recipe-note-${mealId}`}
            onChange={(event) => {
              setNoteInput(event.target.value);
              if (message) setMessage("");
            }}
            placeholder="Add a personal note about this recipe..."
            value={noteInput}
          />
          {message && <p className="mt-1 text-sm text-red-700 dark:text-red-300" role="alert">{message}</p>}
          <div className="mt-2 flex gap-2">
            <button
              className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50"
              type="submit"
            >
              Save note
            </button>
            {note && (
              <button
                className="rounded-lg px-4 py-2 text-xs font-semibold text-muted hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong dark:text-ink-soft"
                onClick={() => {
                  setIsEditing(false);
                  setNoteInput("");
                  setMessage("");
                }}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
};

export default PersonalNote;
