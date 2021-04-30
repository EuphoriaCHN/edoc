import { configureStore } from '@reduxjs/toolkit';

import projectStore from './ProjectStore';

export type Store = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    project: projectStore
  }
});

export default store;
