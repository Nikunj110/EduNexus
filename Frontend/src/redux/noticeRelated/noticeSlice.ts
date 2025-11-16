import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for your notice objects
interface Notice {
  _id: string;
  title: string;
  details: string;
  date: string;
  school: string;
}

// Define a type for the slice's state
interface NoticeState {
  noticesList: Notice[];
  loading: boolean;
  error: string | null;
  response: string | null;
}

// Define the initial state using that type
const initialState: NoticeState = {
  noticesList: [],
  loading: false,
  error: null,
  response: null,
};

const noticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    // Action for when a request starts
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action for when fetching notices succeeds
    getSuccess: (state, action: PayloadAction<Notice[]>) => {
      state.loading = false;
      state.noticesList = action.payload;
      state.error = null;
    },
    // Action for when any request fails
    getFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Action for other successes (like delete, if you add it)
    doneSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.response = action.payload;
      state.error = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  doneSuccess
} = noticeSlice.actions;

export default noticeSlice.reducer;