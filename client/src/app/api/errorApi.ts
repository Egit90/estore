import { createApi } from "@reduxjs/toolkit/query/react";
import { EndPoints, fetchBaseQueryInstance } from "./baseQuery";

export const errorApi = createApi({
  reducerPath: "errorApi",
  baseQuery: fetchBaseQueryInstance(EndPoints.error),
  endpoints: (builder) => ({
    get404Error: builder.query<void, void>({
      query: () => "not-found",
    }),
    get400Error: builder.query<void, void>({
      query: () => "bad-request",
    }),
    get401Error: builder.query<void, void>({
      query: () => "unauthorized",
    }),
    getValidationError: builder.query<void, void>({
      query: () => "validation-error",
    }),
    get500Error: builder.query<void, void>({
      query: () => "server-error",
    }),
  }),
});

export const { useLazyGet404ErrorQuery, useLazyGet400ErrorQuery, useLazyGet401ErrorQuery, useLazyGetValidationErrorQuery, useLazyGet500ErrorQuery } = errorApi;
