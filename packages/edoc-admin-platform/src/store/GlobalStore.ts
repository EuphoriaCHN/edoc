import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

export interface GlobalStore {
  forbidden: boolean;
  helmet: string;
}

export const globalSlice = createSlice<GlobalStore, SliceCaseReducers<GlobalStore>, 'global'>({
  name: 'global',
  initialState: {
    forbidden: false,
    helmet: ''
  },
  reducers: {
    setForbidden: (state, action) => {
      state.forbidden = !!action.payload.forbidden;
    },
    setHelmet: (state, action) => {
      state.helmet = action.payload.helmet;
    }
  }
});

export const { setForbidden, setHelmet } = globalSlice.actions;

export default globalSlice.reducer;
