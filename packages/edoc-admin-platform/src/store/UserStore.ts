import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import I18n from 'i18next';
import { ManOutlined, WomanOutlined, QuestionOutlined } from '@ant-design/icons';

import React from 'react';

export enum GENDER {
  MALE = 'M',
  FEMALE = 'F',
  UNKNOWN = 'U'
}

export const GENDER_DICT: { [k in GENDER]: { text: string; Component: React.ComponentType<any>; }} = {
  [GENDER.MALE]: { text: '男', Component: ManOutlined },
  [GENDER.FEMALE]: { text: '女', Component: WomanOutlined },
  [GENDER.UNKNOWN]: { text: '保密', Component: QuestionOutlined },
};

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
      action.payload.user.gender = (action.payload.user.gender || GENDER.UNKNOWN).toUpperCase();
      state.user = action.payload.user;
    },
    setAvatar: (state, action) => {
      state.user.avatarLink = action.payload.avatar;
    },
    setGender: (state, action) => {
      state.user.gender = action.payload.gender;
    },
    setNickName: (state, action) => {
      state.user.userName = action.payload.nickName;
    }
  }
});

export const { setUser, setAvatar, setGender, setNickName } = projectSlice.actions;

export default projectSlice.reducer;
