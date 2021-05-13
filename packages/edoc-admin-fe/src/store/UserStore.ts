import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

export interface UserStore {
  user: {
    account: string | null;
    avatarLink: string | null;
    mobile: string | null;
  }
}

export const projectSlice = createSlice<UserStore, SliceCaseReducers<UserStore>, 'project'>({
  name: 'project',
  initialState: {
    user: {
      account: null,
      avatarLink: null,
      mobile: null,
    }
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
  }
});

export const { setUser } = projectSlice.actions;

export default projectSlice.reducer;
