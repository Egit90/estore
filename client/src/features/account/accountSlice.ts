import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LoginDto, UserInfo } from "../../app/models/loginDto";
import { RootState } from "../../app/store/configureStore";
import { authApi } from "../../app/services/auth";

export interface AccountState {
  user: UserInfo | null;
}

const initialState: AccountState = {
  user: null,
};

export const accountSlice = createSlice({
  name: "Account",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginDto>) => {
      state.user = action.payload.userInfo;
    },
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      if (payload) {
        state.user = payload.userInfo;
      }
    });
  },
});

export const { setUser, signOut } = accountSlice.actions;

export const selectCurrentUser = (state: RootState) => state.persistedReducer.user;
