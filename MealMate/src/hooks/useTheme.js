import { useCallback, useEffect, useState } from "react";

export const THEME_STORAGE_KEY = "mealmate-theme";

function readStoredTheme() {
  if (typeof window === "undefined") return { theme: "light", isUserChoice: false };
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark" || savedTheme === "light") return { theme: savedTheme, isUserChoice: true };
  } catch (error) {
    console.error("Could not read the saved theme.", error);
  }
  return { theme: window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light", isUserChoice: false };
}

export function useTheme() {
  const [{ theme, isUserChoice }, setPreference] = useState(readStoredTheme);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);
  useEffect(() => {
    if (isUserChoice || !window.matchMedia) return undefined;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = ({ matches }) => setPreference((current) => current.isUserChoice
      ? current
      : { ...current, theme: matches ? "dark" : "light" });
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [isUserChoice]);
  useEffect(() => {
    const sync = ({ key, newValue }) => {
      if (key !== THEME_STORAGE_KEY) return;
      if (newValue === "dark" || newValue === "light") {
        setPreference({ theme: newValue, isUserChoice: true });
      } else if (newValue === null) setPreference(readStoredTheme());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setPreference({ theme: nextTheme, isUserChoice: true });
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.error("Could not save the theme preference.", error);
    }
  }, [theme]);
  return { theme, toggleTheme };
}
