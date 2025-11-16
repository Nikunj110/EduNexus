import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logoutUser as logoutService } from '@/services/authService';

interface UserState {
  status: string;
  currentUser: any;
  currentRole: string | null;
  response: string | null;
  error: any;
  userDetails: any;
  tempDetails: any;
  loading: boolean;
  darkMode: boolean;
}

// Load user and role from localStorage
const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
const initialUser = storedUser ? JSON.parse(storedUser) : null;
const initialRole = initialUser ? initialUser.role : null;

const initialState: UserState = {
  status: 'idle',
  currentUser: initialUser,
  currentRole: initialRole,
  response: null,
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
      state.loading = true;
    },
    underControl: (state) => {
      state.status = 'idle';
      state.response = null;
      state.error = null;
    },
    stuffAdded: (state, action: PayloadAction<string>) => {
      state.status = 'added';
      state.response = action.payload; // FIX: Save the success message
      state.error = null;
      state.loading = false;
    },
    authSuccess: (state, action: PayloadAction<{ user: any; role: string }>) => {
      state.status = 'success';
      state.currentUser = action.payload.user;
      state.currentRole = action.payload.role;
      state.response = null;
      state.error = null;
      state.loading = false;
      
      // FIX (CRITICAL): Save user to localStorage to persist login
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    authFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.response = action.payload; // This is the error message
      state.loading = false;
      state.error = action.payload;
    },
    // FIX (CRITICAL): Added the missing authLogout reducer
    authLogout: (state) => {
      logoutService(); // Clears token from localStorage
      state.currentUser = null;
      state.currentRole = null;
      state.status = 'idle';
    },
    getSuccess: (state, action: PayloadAction<any>) => {
      state.userDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getDeleteSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = null;
      state.response = action.payload; // FIX: Save the success message
    },
    getRequest: (state) => {
      state.loading = true;
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
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    
    // FIX: Removed unused legacy actions (loginSuccess, loginFailed, loginError)
  },
});

export const {
  authRequest,
  underControl,
  stuffAdded,
  authSuccess,
  authFailed,
  authLogout,
  getSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  toggleDarkMode,
} = userSlice.actions;

export default userSlice.reducer;