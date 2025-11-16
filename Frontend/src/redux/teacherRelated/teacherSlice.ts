import { createSlice } from '@reduxjs/toolkit';

interface TeacherState {
  teachersList: any[];
  teacherDetails: any;
  loading: boolean;
  error: any;
  response: any;
}

const initialState: TeacherState = {
  teachersList: [],
  teacherDetails: null,
  loading: false,
  error: null,
  response: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    doneSuccess: (state, action) => {
      state.teacherDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getSuccess: (state, action) => {
      state.teachersList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    postDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    }
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  doneSuccess,
  postDone
} = teacherSlice.actions;

export default teacherSlice.reducer;
