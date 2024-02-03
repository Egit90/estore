import { createApi } from "@reduxjs/toolkit/query/react";
import { setUser, signOut } from "../../features/account/accountSlice";
import { LoginDto, RegisterDto } from "../models/loginDto";
import { FieldValues } from "react-hook-form";
import { router } from "../router/Routes";
import { setBasket } from "../../features/basket/basketSlice";
import { EndPoints, fetchBaseQueryInstance } from "../api/baseQuery";
import { ShippingAddress } from "../models/orderDto";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQueryInstance(EndPoints.account),
  endpoints: (builder) => ({
    login: builder.mutation<LoginDto, FieldValues>({
      query: (parama) => ({
        url: "login",
        method: "POST",
        body: parama,
      }),
    }),
    registerNewAccount: builder.mutation<void, RegisterDto>({
      query: (params) => ({
        url: "register",
        method: "POST",
        body: params,
      }),
    }),
    getCurrentUser: builder.query<LoginDto, LoginDto>({
      query: () => "currentUser",
      onQueryStarted: async (_, api) => {
        try {
          const { data } = await api.queryFulfilled;
          const { basket, ...user } = data;
          api.dispatch(setUser(user));
          if (basket) api.dispatch(setBasket(basket));
        } catch (error) {
          api.dispatch(signOut());
          router.navigate("/login");
        }
      },
    }),
    getAddress: builder.query<ShippingAddress, void>({
      query: () => "savedAddress",
    }),
  }),
});

export const { useGetCurrentUserQuery, useLazyGetCurrentUserQuery, useLoginMutation, useRegisterNewAccountMutation, useGetAddressQuery } = authApi;
