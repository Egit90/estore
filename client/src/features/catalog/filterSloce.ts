import { createSlice } from "@reduxjs/toolkit";
import { MetaData } from "../../app/models/pagination";

export interface FilterState {
  searchTerm: string;
  sort: "Price" | "PriceDesc" | "";
  brands: string[];
  types: string[];
  status: string;
  metaData: MetaData;
}

const initialState: FilterState = {
  searchTerm: "",
  sort: "Price",
  brands: [],
  types: [],
  status: "idle",
  metaData: {
    currentPage: 1,
    pageSize: 6,
    totalCount: 0,
    totalPages: 0,
  },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setOrRemoveBrands: (state, action) => {
      const index = state.brands.indexOf(action.payload);
      if (index !== -1) {
        state.brands = [...state.brands.slice(0, index), ...state.brands.slice(index + 1)];
      } else {
        state.brands = [...state.brands, action.payload];
      }
    },
    setOrRemoveTypes: (state, action) => {
      const index = state.types.indexOf(action.payload);
      if (index !== -1) {
        state.types = [...state.types.slice(0, index), ...state.types.slice(index + 1)];
      } else {
        state.types = [...state.types, action.payload];
      }
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    resetPageNumber: (state) => {
      state.metaData.currentPage = 1;
    },
    setPageNumber: (state, action) => {
      state.metaData = { ...state.metaData, currentPage: action.payload };
    },
  },
});

export const { setSearchTerm, setSort, setOrRemoveBrands, setOrRemoveTypes, setMetaData, resetPageNumber, setPageNumber } = filterSlice.actions;
