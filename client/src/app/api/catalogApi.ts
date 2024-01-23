import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQueryInstance } from "./baseQuery";
import { MetaData, PaginatedResponse } from "../models/pagination";
import { Product, ProductParam } from "../models/product";
import { setMetaData } from "../../features/catalog/filterSloce";

type Filters = {
  brands: string[];
  types: string[];
};

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: fetchBaseQueryInstance(),
  tagTypes: ["Catalog"],
  endpoints: (builder) => ({
    // getCatalog
    getCatalog: builder.query<PaginatedResponse<Product[]>, string>({
      query: (URLSearchParams) => {
        return "products" + "?" + URLSearchParams;
      },
      transformResponse: (res: Product[], meta) => {
        const header = meta?.response?.headers.get("Pagination");
        if (!header) throw new Error("Pagination headers are missing");
        const metaDataJson: MetaData = JSON.parse(header);
        return {
          items: res,
          metaData: {
            currentPage: metaDataJson.currentPage,
            totalPages: metaDataJson.totalPages,
            pageSize: metaDataJson.pageSize,
            totalCount: metaDataJson.totalCount,
          },
        };
      },
      onQueryStarted: async (_, api) => {
        try {
          const { data } = await api.queryFulfilled;
          api.dispatch(setMetaData(data.metaData));
        } catch (error) {
          console.log(error);
        }
      },
      providesTags: [{ type: "Catalog", id: "LIST" }],
    }),
    // productDetails
    getProductDetail: builder.query<Product, { id: number }>({
      query: ({ id }) => `products/${id}`,
      providesTags: (_, __, { id }) => [{ type: "Catalog", id }],
    }),
    // filters
    getProductFilters: builder.query<Filters, void>({
      query: () => "products/filters",
    }),
  }),
});

export const { useGetCatalogQuery, useGetProductDetailQuery, useGetProductFiltersQuery, useLazyGetCatalogQuery } = catalogApi;

export const generateCatalogParams = ({ pageNumber, pageSize, orderBy, searchTerm, brands, types }: ProductParam) => {
  const params: string[] = [];

  params.push("PageNumber" + "=" + pageNumber.toString());
  params.push("PageSize" + "=" + pageSize.toString());
  params.push("OrderBy" + "=" + orderBy ?? "Price");

  if (searchTerm) params.push("SearchTerm" + "=" + searchTerm);

  if (brands) params.push("Brands" + "=" + brands.join(","));

  if (types) params.push("Types" + "=" + types.join(","));

  return params.join("&");
};
