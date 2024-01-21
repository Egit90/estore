import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LoginDto } from "../../app/models/loginDto";
import { RootState } from "../../app/store/configureStore";

export interface AccountState {
  user: LoginDto | null;
}

const initialState: AccountState = {
  user: null,
};

export const accountSlice = createSlice({
  name: "Account",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginDto>) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, signOut } = accountSlice.actions;

export const selectCurrentUser = (state: RootState) => state.persistedReducer.user;
