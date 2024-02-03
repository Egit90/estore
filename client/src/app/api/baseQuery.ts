import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/configureStore";

const baseUrl = "https://localhost:5000/api";

export enum EndPoints {
  basket = "basket",
  error = "Buggy",
  account = "account",
  orders = "orders",
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
