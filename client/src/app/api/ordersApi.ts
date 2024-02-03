import { createApi } from "@reduxjs/toolkit/query/react";
import { EndPoints, fetchBaseQueryInstance } from "./baseQuery";
import { ShippingAddress, orderDto } from "../models/orderDto";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  tagTypes: ["orders"],
  baseQuery: fetchBaseQueryInstance(EndPoints.orders),
  endpoints: (builder) => ({
    getOrders: builder.query<orderDto[], void>({
      query: () => ``,
    }),
    createOrder: builder.mutation<number, { saveAddress: boolean; shippingAddress: ShippingAddress }>({
      query: ({ saveAddress, shippingAddress }) => ({
        url: "",
        method: "POST",
        body: { saveAddress, shippingAddress },
      }),
    }),
  }),
});

export const { useGetOrdersQuery, useCreateOrderMutation } = ordersApi;
