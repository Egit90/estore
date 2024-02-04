import { createApi } from "@reduxjs/toolkit/query/react";
import { EndPoints, fetchBaseQueryInstance } from "./baseQuery";
import { Basket } from "../models/basket";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQueryInstance(EndPoints.payments),
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<Basket, void>({
      query: () => ({
        url: "",
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentApi;
