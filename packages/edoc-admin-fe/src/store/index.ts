import { configureStore } from '@reduxjs/toolkit';

import globalStore from './GlobalStore';
import projectStore from './ProjectStore';
import userStore from './UserStore';

export type Store = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    project: projectStore,
    user: userStore,
    global: globalStore
  }
});

export default store;
