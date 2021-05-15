import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

export interface GlobalStore {
  forbidden: boolean;
}

export const globalSlice = createSlice<GlobalStore, SliceCaseReducers<GlobalStore>, 'global'>({
  name: 'global',
  initialState: {
    forbidden: false
  },
  reducers: {
    setForbidden: (state, action) => {
      state.forbidden = !!action.payload.forbidden;
    },
  }
});

export const { setForbidden } = globalSlice.actions;

export default globalSlice.reducer;
