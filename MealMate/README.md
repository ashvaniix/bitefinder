# MealMate

MealMate is a React and Vite recipe browser powered by [TheMealDB](https://www.themealdb.com/). Browse featured recipes, search by name or ingredient, save favorites, and organize recipes and ingredients.

## Run locally

```sh
npm install
npm run dev
```

Build, lint, and test with:

```sh
npm run build
npm run lint
npm test
```

## TheMealDB configuration

The app uses TheMealDB's public development key (`1`) by default. To use a different key, copy `.env.example` to `.env.local` and set `VITE_MEALDB_KEY`. Restart the Vite server after changing environment variables.

## Features

- Featured real recipes loaded from TheMealDB
- Name search with ingredient-match fallback
- Recipe details, ratings, personal notes, bookmarks, and recently viewed recipes
- Shopping list with purchased-item tracking and undo for individual removals
- Search history and a rule-based recipe assistant
- Light/dark theme, keyboard-accessible dialogs, and responsive layouts
- Local browser storage for personal data; no account or backend is required

## Project structure

- `src/app/` composes the providers, active page, and error boundary
- `src/components/` contains UI components grouped by feature
- `src/hooks/` contains application state, persistence, and request logic
- `src/data/` contains TheMealDB requests and pure recipe/search helpers
- `LibraryContext` exposes bookmarks, shopping, ratings, notes, theme, and navigation
- `SearchContext` exposes current results, search actions, and search history
- `RecipeViewContext` exposes the active recipe modal and recently viewed recipes

Personal data is saved in the browser's `localStorage`; clearing browser site data removes it.

## Share a source archive

Run `npm run package:source` to create `MealMate-source.zip`. The packaging script explicitly excludes `node_modules`, `dist`, `.git`, `.env.local`, and the archive itself.
