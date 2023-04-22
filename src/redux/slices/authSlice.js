import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
    },
    logout: (state) => {
      state.data = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
