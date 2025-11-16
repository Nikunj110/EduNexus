import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  status: string;
  currentUser: any;
  currentRole: string;
  response: string;
  error: any;
  userDetails: any;
  tempDetails: any;
  loading: boolean;
  darkMode: boolean;
}

const initialState: UserState = {
  status: 'idle',
  currentUser: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  currentRole: typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('user') || '{}').role || '') : '',
  response: '',
  error: null,
  userDetails: null,
  tempDetails: null,
  loading: false,
  darkMode: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authRequest: (state) => {
      state.status = 'loading';
    },
    underControl: (state) => {
      state.status = 'idle';
      state.response = '';
    },
    stuffAdded: (state, action) => {
      state.status = 'added';
      state.response = '';
      state.error = null;
      state.tempDetails = action.payload;
    },
    authSuccess: (state, action) => {
      state.status = 'success';
      state.currentUser = action.payload;
      state.currentRole = action.payload.role;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
      state.response = '';
      state.error = null;
    },
    authFailed: (state, action) => {
      state.status = 'failed';
      state.response = action.payload;
    },
    authError: (state, action) => {
      state.status = 'error';
      state.error = action.payload;
    },
    authLogout: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      state.currentUser = null;
      state.status = 'idle';
      state.error = null;
      state.currentRole = '';
    },
    doneSuccess: (state, action) => {
      state.userDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = '';
    },
    getDeleteSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.response = '';
    },
    getRequest: (state) => {
      state.loading = true;
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
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    // Legacy actions for compatibility
    loginSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.currentRole = action.payload.role;
      state.status = 'success';
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    loginFailed: (state, action) => {
      state.status = 'failed';
      state.response = action.payload;
    },
    loginError: (state) => {
      state.status = 'error';
    },
  },
});

export const {
  authRequest,
  underControl,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  toggleDarkMode,
  loginSuccess,
  loginFailed,
  loginError,
} = userSlice.actions;

export default userSlice.reducer;
