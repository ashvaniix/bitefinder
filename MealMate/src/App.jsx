import AppProviders from "./app/AppProviders";
import AppShell from "./app/AppShell";

// Compose global state and the active app view; feature logic lives in hooks.
const App = () => (
  <AppProviders>
    <AppShell />
  </AppProviders>
);

export default App;


