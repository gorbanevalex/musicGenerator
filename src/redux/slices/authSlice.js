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
  },
});

export const { login } = authSlice.actions;

export default authSlice.reducer;
