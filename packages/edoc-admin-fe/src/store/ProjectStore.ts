import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

export interface ProjectStore {
  project: {
    projectName: string;
    id: number;
    projectDesc?: string;
    creator: string;
    feature: null | {
      logoSrc?: string;
    };
  };
  pageLibrary: {
    pageName: string;
    id: number;
    pageDesc?: string;
  };
}

export const projectSlice = createSlice<ProjectStore, SliceCaseReducers<ProjectStore>, 'project'>({
  name: 'project',
  initialState: {
    project: {
      projectName: '',
      id: 0,
      projectDesc: '',
      creator: '',
      feature: null
    },
    pageLibrary: {
      pageName: '',
      id: 0,
      pageDesc: ''
    }
  },
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload.project;
    },
    updateProjectInfo: (state, action) => {
      Object.assign(state.project, action.payload.project);
    },
    setPageLibrary: (state, action) => {
      state.pageLibrary = action.payload.pageLibrary;
    },
  }
});

export const { setProject, setPageLibrary, updateProjectInfo } = projectSlice.actions;

export default projectSlice.reducer;
