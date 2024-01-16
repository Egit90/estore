import axios, { AxiosError, AxiosResponse } from "axios";
import { Product } from "../models/product";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { Basket } from "../models/basket";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { removeItem, setBasket } from "../../features/basket/basketSlice";

axios.defaults.baseURL = "https://localhost:5000/api/";
axios.defaults.withCredentials = true;

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.interceptors.response.use(
  async (resp) => {
    await sleep();
    return resp;
  },
  (err: AxiosError) => {
    const { data, status } = err.response as AxiosResponse;

    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) modelStateErrors.push(data.errors[key]);
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        break;
    }

    return Promise.reject(err.response);
  }
);

const request = {
  get: async <T>(url: string) => (await axios.get<T>(url)).data,
  post: async (url: string, body: object) => (await axios.post(url, body)).data,
  put: async (url: string, body: object) => (await axios.put(url, body)).data,
  delete: async (url: string) => (await axios.delete(url)).data,
};

//Error APi
const TestErrors = {
  get404Error: async () => await request.get("Buggy/not-found"),
  get400Error: async () => await request.get("Buggy/bad-request"),
  get401Error: async () => await request.get("Buggy/unauthorized"),
  getValidationError: async () => await request.get("Buggy/validation-error"),
  get500Error: async () => await request.get("Buggy/server-error"),
};

const baseQuery = fetchBaseQuery({
  baseUrl: "https://localhost:5000/api/",
  credentials: "include",
});

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery,
  tagTypes: ["Catalog"],
  endpoints: (builder) => ({
    getCatalog: builder.query<Product[], void>({
      query: () => "products",
      providesTags: [{ type: "Catalog", id: "LIST" }],
    }),
    getProductDetail: builder.query<Product, { id: number }>({
      query: ({ id }) => `products/${id}`,
      providesTags: (result, error, { id }) => [{ type: "Catalog", id }],
    }),
  }),
});

export const basketApi = createApi({
  reducerPath: "basketApi",
  baseQuery,
  tagTypes: ["Basket"],
  endpoints: (builder) => ({
    // Get
    getBasket: builder.query<Basket, void>({
      query: () => `basket`,
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
        url: `Basket?productId=${productId}&quantity=${qty || 1}`,
        method: "POST",
      }),
    }),
    // Delete
    deleteItem: builder.mutation<void, { productId: number; qty: number }>({
      query: ({ productId, qty }) => ({
        url: `Basket?productId=${productId}&quantity=${qty}`,
        method: "DELETE",
      }),
      onQueryStarted: async (
        { productId, qty },
        { dispatch, queryFulfilled }
      ) => {
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

const agent = {
  TestErrors,
};

export default agent;

export const {
  useGetBasketQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
} = basketApi;

export const { useGetCatalogQuery, useGetProductDetailQuery } = catalogApi;
