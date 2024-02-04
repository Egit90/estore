import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/contact/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../../features/basket/basketSlice";
import { filterSlice } from "../../features/catalog/filterSloce";
import { rtkQueryErrorLogger } from "./errorMiddleware";
import { accountSlice } from "../../features/account/accountSlice";
import { authApi } from "../services/auth";
import storage from "redux-persist/lib/storage";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import { basketApi } from "../api/basketApi";
import { catalogApi } from "../api/catalogApi";
import { errorApi } from "../api/errorApi";
import { themeSlice } from "../layout/themeSlice";
import { ordersApi } from "../api/ordersApi";
import { paymentApi } from "../api/paymentApi";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, accountSlice.reducer);

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    basket: basketSlice.reducer,
    filter: filterSlice.reducer,
    theme: themeSlice.reducer,
    persistedReducer,
    [basketApi.reducerPath]: basketApi.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [errorApi.reducerPath]: errorApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(basketApi.middleware, ordersApi.middleware, paymentApi.middleware, catalogApi.middleware, authApi.middleware, errorApi.middleware, rtkQueryErrorLogger),
});

const persistor = persistStore(store);

export { persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
