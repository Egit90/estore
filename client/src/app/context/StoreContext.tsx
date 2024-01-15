import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue {
  basket: Basket | null;
  setBasket: (basket: Basket) => void;
  removeItem: (productId: number, quantity: number) => void;
}

export const StoreContex = createContext<StoreContextValue | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext() {
  const context = useContext(StoreContex);
  if (context === undefined) throw Error("No Provider");
  return context;
}

export function StoreProvider({ children }: PropsWithChildren<unknown>) {
  const [basket, setBasket] = useState<Basket | null>(null);

  function removeItem(productId: number, quantity: number) {
    if (!basket) return;

    const items = [...basket.items];

    const itemIndex = items.findIndex((i) => i.productId === productId);

    if (itemIndex >= 0) {
      items[itemIndex].quantity -= quantity;

      if (items[itemIndex].quantity === 0) items.splice(itemIndex, 1);

      const basketItemsTotal = items.reduce(
        (acc, curr) => curr.price * curr.quantity + acc,
        0
      );
      const basketTaxes = parseFloat((basketItemsTotal * 0.07).toFixed(2));
      const basketTotal = basketItemsTotal + basketTaxes;

      setBasket((prev) => {
        return {
          ...prev!,
          basketItemsTotal,
          basketTaxes,
          basketTotal,
          items: items,
        };
      });
    }
  }

  return (
    <StoreContex.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContex.Provider>
  );
}
