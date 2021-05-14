import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

export enum GENDER {
  MALE = 'M',
  FEMALE = 'F'
}

export interface UserStore {
  user: {
    account: string | null;
    avatarLink: string | null;
    mobile: string | null;
    gender: GENDER | null;
    userId: number | null;
    userName: string | null;

    alipayId: number | null;
    alipayNickName: string | null;
  }
}

export const projectSlice = createSlice<UserStore, SliceCaseReducers<UserStore>, 'project'>({
  name: 'project',
  initialState: {
    user: {
      account: null,
      avatarLink: null,
      mobile: null,
      gender: null,
      userId: null,
      userName: null,
      alipayId: null,
      alipayNickName: null
    }
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setAvatar: (state, action) => {
      state.user.avatarLink = action.payload.avatar;
    }
  }
});

export const { setUser, setAvatar } = projectSlice.actions;

export default projectSlice.reducer;
