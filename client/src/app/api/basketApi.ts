import { createApi } from "@reduxjs/toolkit/query/react";
import { Basket } from "../models/basket";
import { removeItem, setBasket } from "../../features/basket/basketSlice";
import { EndPoints, fetchBaseQueryInstance } from "./baseQuery";

export const basketApi = createApi({
  reducerPath: "basketApi",
  baseQuery: fetchBaseQueryInstance(EndPoints.basket),
  tagTypes: ["Basket"],
  endpoints: (builder) => ({
    // Get
    getBasket: builder.query<Basket, void>({
      query: () => "",
      providesTags: [{ type: "Basket", id: "LIST" }],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setBasket(data));
        } catch {
          console.log("error");
        }
      },
    }),
    // Create
    createItem: builder.mutation<Basket, { productId: number; qty?: number }>({
      query: ({ productId, qty }) => ({
        url: `?productId=${productId}&quantity=${qty || 1}`,
        method: "POST",
      }),
    }),
    // Delete
    deleteItem: builder.mutation<void, { productId: number; qty: number }>({
      query: ({ productId, qty }) => ({
        url: `?productId=${productId}&quantity=${qty}`,
        method: "DELETE",
      }),
      onQueryStarted: async ({ productId, qty }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(removeItem({ productId, quantity: qty }));
        } catch {
          console.log("error");
        }
      },
    }),
  }),
});

export const { useGetBasketQuery, useCreateItemMutation, useDeleteItemMutation } = basketApi;
