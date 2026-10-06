import ShoppingList from "./ShoppingList";
import PageSection from "../layout/PageSection";
import { useLibraryContext } from "../../context/AppContext";

const ShoppingSection = () => {
  const { items, togglePurchased, remove, restoreItem, clearPurchased, clearAll } = useLibraryContext();
  return (
    <PageSection eyebrow="PLAN AHEAD" title="Shopping list">
      <ShoppingList
        items={items}
        onClearAll={clearAll}
        onClearPurchased={clearPurchased}
        onRemove={remove}
        onRestoreItem={restoreItem}
        onTogglePurchased={togglePurchased}
      />
    </PageSection>
  );
};

export default ShoppingSection;
