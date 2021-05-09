import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

export interface ProjectStore {
  project: {
    projectName: string;
    id: number;
    projectDesc?: string;
  };
  pageLibrary: {
    name: string;
    ID: number;
    description?: string;
  };
}

export const projectSlice = createSlice<ProjectStore, SliceCaseReducers<ProjectStore>, 'project'>({
  name: 'project',
  initialState: {
    project: {
      projectName: '',
      id: 0,
      projectDesc: ''
    },
    pageLibrary: {
      name: '',
      ID: 0,
      description: ''
    }
  },
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload.project;
    },
    setPageLibrary: (state, action) => {
      state.pageLibrary = action.payload.pageLibrary;
    }
  }
});

export const { setProject, setPageLibrary } = projectSlice.actions;

export default projectSlice.reducer;
