import { createSlice } from '@reduxjs/toolkit';

interface NoticeState {
  noticesList: any[];
  loading: boolean;
  error: any;
  response: any;
}

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
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.noticesList = action.payload;
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
    }
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError
} = noticeSlice.actions;

export default noticeSlice.reducer;
