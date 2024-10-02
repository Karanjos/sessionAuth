import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  refresh_token: null,
  loading: false,
  errorMessage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinStart: (state) => {
      state.currentUser = null;
      state.refresh_token = null;
      state.loading = true;
      state.errorMessage = "";
    },
    signinSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.refresh_token = action.payload.refresh_token;
      state.loading = false;
      state.errorMessage = "";
    },
    signinFailure: (state, action) => {
      state.currentUser = null;
      state.refresh_token = null;
      state.loading = false;
      state.errorMessage = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.refresh_token = null;
      state.loading = false;
      state.errorMessage = "";
    },
  },
});

export const { signinStart, signinSuccess, signinFailure, signoutSuccess } =
  userSlice.actions;

export default userSlice.reducer;
