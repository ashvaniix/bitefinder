import { useEffect, useRef, useState } from "react";

function isValidValue(value, initialValue, validate) {
  if (typeof validate === "function") return validate(value);

  if (Array.isArray(initialValue)) return Array.isArray(value);
  if (initialValue && typeof initialValue === "object") {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  return typeof value === typeof initialValue;
}

function readValue(key, initialValue, validate, migrate) {
  if (typeof window === "undefined" || !window.localStorage) return initialValue;

  try {
    const savedValue = window.localStorage.getItem(key);
    if (savedValue === null) return initialValue;

    const parsedValue = JSON.parse(savedValue);
    const migratedValue = typeof migrate === "function" ? migrate(parsedValue) : parsedValue;
    return isValidValue(migratedValue, initialValue, validate)
      ? migratedValue
      : initialValue;
  } catch (error) {
    console.error(`Could not read "${key}" from localStorage.`, error);
    return initialValue;
  }
}

export function useLocalStorage(key, initialValue, validate, migrate) {
  const initialValueRef = useRef(initialValue);
  const [value, setValue] = useState(() => readValue(key, initialValue, validate, migrate));

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;

    try {
      const serializedValue = JSON.stringify(value);
      if (window.localStorage.getItem(key) !== serializedValue) {
        window.localStorage.setItem(key, serializedValue);
      }
    } catch (error) {
      console.error(`Could not save "${key}" to localStorage.`, error);
    }
  }, [key, value]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    function handleStorage(event) {
      if (event.key !== key) return;

      if (event.newValue === null) {
        setValue(initialValueRef.current);
        return;
      }

      try {
        const parsedValue = JSON.parse(event.newValue);
        const migratedValue = typeof migrate === "function" ? migrate(parsedValue) : parsedValue;
        const nextValue = isValidValue(migratedValue, initialValueRef.current, validate)
          ? migratedValue
          : initialValueRef.current;

        setValue(nextValue);
      } catch (error) {
        console.error(`Could not read "${key}" from localStorage.`, error);
        setValue(initialValueRef.current);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, validate, migrate]);

  return [value, setValue];
}
