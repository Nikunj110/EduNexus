// FIX: Renamed 'doneSuccess' to 'getTeacherDetailsSuccess' to match the action being dispatched in teacherHandle.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types (can be expanded)
interface Teacher {
  _id: string;
  name: string;
  email: string;
  teachSubject?: { _id: string, subName: string };
  teachSclass?: { _id: string, sclassName: string };
  // ... other fields
}

interface TeacherState {
  teachersList: Teacher[];
  teacherDetails: Teacher | null;
  loading: boolean;
  error: string | null;
  response: string | null;
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
      state.error = null;
    },
    // FIX: Renamed from 'doneSuccess'
    // Used by: getTeacherDetails
    getTeacherDetailsSuccess: (state, action: PayloadAction<Teacher>) => {
      state.teacherDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    // Used by: getAllTeachers
    getSuccess: (state, action: PayloadAction<Teacher[]>) => {
      state.teachersList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action: PayloadAction<string>) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    postDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
  },
});

export const {
  getRequest,
  getTeacherDetailsSuccess, // <-- FIX: Exporting the correctly named reducer
  getSuccess,
  getFailed,
  getError,
  postDone,
} = teacherSlice.actions;

export default teacherSlice.reducer;