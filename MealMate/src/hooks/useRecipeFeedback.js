import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const EMPTY_RECORD = {};

function isRatingMap(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.values(value).every((rating) => Number.isInteger(rating) && rating >= 1 && rating <= 5);
}

function isNoteMap(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    Object.values(value).every((note) => typeof note === "string");
}

export function useRecipeFeedback() {
  const [ratings, setRatings] = useLocalStorage("mealmate-ratings", EMPTY_RECORD, isRatingMap);
  const [notes, setNotes] = useLocalStorage("mealmate-notes", EMPTY_RECORD, isNoteMap);

  const getRating = useCallback((mealId) => ratings[mealId] || 0, [ratings]);
  const setRating = useCallback((mealId, rating) => {
    setRatings((current) => {
      if (!rating) {
        const next = { ...current };
        delete next[mealId];
        return next;
      }
      return { ...current, [mealId]: rating };
    });
  }, [setRatings]);

  const getNote = useCallback((mealId) => notes[mealId] || "", [notes]);
  const setNote = useCallback((mealId, note) => {
    setNotes((current) => ({ ...current, [mealId]: note }));
  }, [setNotes]);
  const deleteNote = useCallback((mealId) => {
    setNotes((current) => {
      const next = { ...current };
      delete next[mealId];
      return next;
    });
  }, [setNotes]);

  return { getRating, setRating, getNote, setNote, deleteNote };
}
