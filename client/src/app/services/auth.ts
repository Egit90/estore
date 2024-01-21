import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, signOut } from "../../features/account/accountSlice";
import { LoginDto, RegisterDto } from "../models/loginDto";
import { FieldValues } from "react-hook-form";
import { RootState } from "../store/configureStore";
import { router } from "../router/Routes";

const authBaseQery = fetchBaseQuery({
  baseUrl: "https://localhost:5000/api/Account",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).persistedReducer.user?.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: authBaseQery,
  endpoints: (builder) => ({
    login: builder.mutation<LoginDto, FieldValues>({
      query: (parama) => ({
        url: "login",
        method: "POST",
        body: parama,
      }),
      onQueryStarted: async (_, api) => {
        try {
          const { data } = await api.queryFulfilled;
          api.dispatch(setUser(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    registerNewAccount: builder.mutation<void, RegisterDto>({
      query: (params) => ({
        url: "register",
        method: "POST",
        body: params,
      }),
    }),
    getCurrentUser: builder.query<void, LoginDto>({
      query: () => "currentUser",
      onQueryStarted: async (_, api) => {
        try {
          await api.queryFulfilled;
        } catch (error) {
          api.dispatch(signOut());
          router.navigate("/login");
        }
      },
    }),
  }),
});

export const { useGetCurrentUserQuery, useLazyGetCurrentUserQuery, useLoginMutation, useRegisterNewAccountMutation } = authApi;
