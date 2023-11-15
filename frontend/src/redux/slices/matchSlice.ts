import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SliceState =
  | { state: "loading"; isMatchButtonEnabled: boolean }
  | { state: "finished"; data: boolean; isMatchButtonEnabled: boolean };

const initialState: SliceState = {
  state: "finished",
  data: false,
  isMatchButtonEnabled: true,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    initMatch: {
      reducer(state, action: PayloadAction<boolean>) {
        state.data = action.payload;
        state.isMatchButtonEnabled = !action.payload;
      },
      prepare(isMatching: boolean) {
        return { payload: isMatching };
      },
    },
  },
});

export const { initMatch } = matchSlice.actions;
export default matchSlice.reducer;
