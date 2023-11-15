import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SliceState = { token: string | null };

const initialState: SliceState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: {
      reducer(state, action: PayloadAction<string | null>) {
        state.token = action.payload;
      },
      prepare(user: string | null) {
        return { payload: user };
      },
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
