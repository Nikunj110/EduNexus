// FIX: Renamed 'stuffDone' to 'doneSuccess' to match the action being dispatched in studentHandle.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types (can be expanded)
interface Student {
  _id: string;
  name: string;
  rollNum: number;
  sclassName: { _id: string, sclassName: string };
  // ... other student fields
}

interface StudentState {
  studentsList: Student[];
  loading: boolean;
  error: string | null;
  response: any | null; // Can be string or other data
  statestatus: string | null;
}

const initialState: StudentState = {
  studentsList: [],
  loading: false,
  error: null,
  response: null,
  statestatus: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Used by: getAllStudents
    getSuccess: (state, action: PayloadAction<Student[]>) => {
      state.loading = false;
      state.studentsList = action.payload;
      state.error = null;
      state.response = null;
    },
    // FIX: Renamed from stuffDone to doneSuccess
    // Used by: updateStudentFields
    doneSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.response = action.payload; // Store the success response
      state.error = null;
      state.statestatus = 'success'; // To match component logic
    },
    getFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload; // Store the error message
      state.statestatus = 'failed'; // To match component logic
    },
    getError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    underStudentControl: (state) => {
      state.statestatus = null;
      state.response = null;
      state.error = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  doneSuccess, // <-- FIX: Exporting the correctly named reducer
  getFailed,
  getError,
  underStudentControl,
} = studentSlice.actions;

export default studentSlice.reducer;