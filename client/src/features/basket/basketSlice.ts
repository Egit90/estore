import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";
import { basketApi } from "../../app/api/basketApi";

export interface BasketState {
  basket: Basket | null;
  status: string;
}

const initialState: BasketState = {
  basket: null,
  status: "idle",
};

interface RemoveItemPayload {
  productId: number;
  quantity: number;
}

export const basketSlice = createSlice({
  name: "basket",
  initialState: initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
    clearBasket: (state) => {
      state.basket = null;
    },
    removeItem: (state, action: PayloadAction<RemoveItemPayload>) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.basket?.items.findIndex((i) => i.productId === productId);

      if (itemIndex === -1 || itemIndex === undefined) return;
      if (!state.basket) return;

      state.basket.items[itemIndex].quantity -= quantity;

      if (state.basket?.items[itemIndex].quantity === 0) {
        state.basket.items.splice(itemIndex, 1);
      }

      const basketItemsTotal = state.basket.items.reduce((acc, curr) => curr.price * curr.quantity + acc, 0);

      const basketTaxes = parseFloat((basketItemsTotal * 0.07).toFixed(2));
      const basketTotal = basketItemsTotal + basketTaxes;

      state.basket.basketItemsTotal = basketItemsTotal;
      state.basket.basketTaxes = basketTaxes;
      state.basket.basketTotal = basketTotal;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(basketApi.endpoints.createItem.matchFulfilled, (state, action) => {
      state.basket = action.payload;
    });
  },
});

export const { setBasket, removeItem, clearBasket } = basketSlice.actions;
