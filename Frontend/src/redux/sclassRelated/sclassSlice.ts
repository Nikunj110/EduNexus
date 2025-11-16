import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for your data (based on your schemas)
interface Sclass {
  _id: string;
  sclassName: string;
  school: string;
  // Add other fields if they exist
}

interface Subject {
  _id: string;
  subName: string;
  subCode: string;
  sessions: number;
  sclassName: { _id: string; sclassName: string };
  teacher: string;
  // Add other fields if they exist
}

interface Student {
  _id: string;
  name: string;
  rollNum: number;
  // Add other fields if they exist
}

// Define the state type
interface SclassState {
  sclassesList: Sclass[];
  subjectsList: Subject[];
  sclassStudents: Student[];
  sclassDetails: Sclass | null;
  subjectDetails: Subject | null;
  loading: boolean;
  subloading: boolean;
  error: string | null;
  response: string | null;
  getresponse: any; // You can type this better if you know its shape
}

// Define the initial state
const initialState: SclassState = {
  sclassesList: [],
  subjectsList: [],
  sclassStudents: [],
  sclassDetails: null,
  subjectDetails: null,
  loading: false,
  subloading: false,
  error: null,
  response: null,
  getresponse: null,
};

const sclassSlice = createSlice({
  name: 'sclass',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSubRequest: (state) => {
      state.subloading = true;
      state.error = null;
    },
    // Used by: getAllSclasses
    getSuccess: (state, action: PayloadAction<Sclass[]>) => {
      state.loading = false;
      state.sclassesList = action.payload;
      state.error = null;
    },
    // Used by: getClassStudents
    getStudentsSuccess: (state, action: PayloadAction<Student[]>) => {
      state.loading = false;
      state.sclassStudents = action.payload;
      state.error = null;
    },
    // Used by: getSubjectList
    getSubjectsSuccess: (state, action: PayloadAction<Subject[]>) => {
      state.loading = false;
      state.subjectsList = action.payload;
      state.error = null;
    },
    // Used by: getClassDetails
    getClassDetailsSuccess: (state, action: PayloadAction<Sclass>) => {
      state.loading = false;
      state.sclassDetails = action.payload;
      state.error = null;
    },
    // Used by: getSubjectDetails
    getSubjectDetailsSuccess: (state, action: PayloadAction<Subject>) => {
      state.subloading = false;
      state.subjectDetails = action.payload;
      state.error = null;
    },
    getFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.subloading = false;
      state.error = action.payload;
    },
    getFailedTwo: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.subloading = false;
      state.error = action.payload;
      state.getresponse = null;
    },
  },
});

export const {
  getRequest,
  getSubRequest,
  getSuccess,
  getStudentsSuccess,
  getSubjectsSuccess,
  getClassDetailsSuccess,
  getSubjectDetailsSuccess,
  getFailed,
  getFailedTwo,
} = sclassSlice.actions;

export default sclassSlice.reducer;