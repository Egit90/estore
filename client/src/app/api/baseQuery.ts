import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/configureStore";

const baseUrl = import.meta.env.VITE_API_URL;

export enum EndPoints {
  basket = "basket",
  error = "Buggy",
  account = "account",
  orders = "orders",
  payments = "Payments",
}

export const fetchBaseQueryInstance = (endPoint?: EndPoints) =>
  fetchBaseQuery({
    baseUrl: endPoint ? baseUrl + "/" + endPoint : baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).persistedReducer.user?.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });
