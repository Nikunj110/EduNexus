import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  authRequest,
  authSuccess,
  authFailed,
  stuffAdded,
  getRequest,
  getSuccess,
  getFailed,
  getDeleteSuccess, // <-- FIX: Import getDeleteSuccess
} from './userSlice';
import {
  loginUser as loginService,
  registerAdmin as registerService,
} from '@/services/authService';
import {
  getData,
  postData,
  updateData,
  deleteData,
} from '@/services/dataService';

/**
 * Thunk for user login
 */
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ credentials, role }: { credentials: any; role: string }, { dispatch }) => {
    dispatch(authRequest());
    try {
      const data = await loginService(credentials, role);
      // data.user and data.token are returned from the service
      dispatch(authSuccess({ user: data.user, role: data.user.role }));
      return data.user;
    } catch (error: any) {
      dispatch(authFailed(error.message || error.response?.data?.message || 'Login Failed'));
      throw error;
    }
  }
);

/**
 * Thunk for admin registration
 */
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ fields, role }: { fields: any; role: string }, { dispatch }) => {
    dispatch(authRequest());
    try {
      if (role === 'Admin') {
        const data = await registerService(fields);
        // FIX 1: Dispatch stuffAdded for a success message, not authSuccess
        dispatch(stuffAdded(data.message || 'Admin registered successfully'));
        return data;
      }
      // You can add logic for Student/Teacher registration here if needed
    } catch (error: any) {
      dispatch(authFailed(error.message || error.response?.data?.message || 'Registration Failed'));
      throw error;
    }
  }
);

/**
 * Generic thunk to add new data (Class, Notice, Complain)
 */
export const addStuff = createAsyncThunk(
  'user/addStuff',
  async ({ fields, address }: { fields: any; address: string }, { dispatch }) => {
    dispatch(authRequest()); // Use authRequest for loading state
    try {
      const endpointMap: { [key: string]: string } = {
        Sclass: '/SclassCreate',
        Notice: '/NoticeCreate',
        Complain: '/ComplainCreate',
        // Add other create endpoints here
      };

      const endpoint = endpointMap[address];
      if (!endpoint) throw new Error('Invalid address for addStuff');

      const data = await postData(endpoint, fields);
      
      dispatch(stuffAdded(data.message || 'Item added successfully'));
      return data;
    } catch (error: any) {
      dispatch(authFailed(error.message || error.response?.data?.message || 'Failed to add item'));
      throw error;
    }
  }
);

/**
 * Thunk to get user details (Student, Teacher, Admin)
 */
export const getUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async ({ id, role }: { id: string; role: string }, { dispatch }) => {
    dispatch(getRequest());
    try {
      const endpoint = `/${role}/${id}`; // e.g., /Student/12345
      const data = await getData(endpoint);
      dispatch(getSuccess(data));
      return data;
    } catch (error: any) {
      dispatch(getFailed(error.message || error.response?.data?.message || 'Failed to get details'));
      throw error;
    }
  }
);

/**
 * Thunk to delete a user or item
 */
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async ({ id, address }: { id: string; address: string }, { dispatch }) => {
    dispatch(getRequest());
    try {
      const endpoint = `/${address}/${id}`; // e.g., /Notice/12345
      const data = await deleteData(endpoint);
      
      // FIX 2: Dispatch getDeleteSuccess with the message
      dispatch(getDeleteSuccess(data.message || 'Item deleted successfully'));
      return data;
    } catch (error: any) {
      dispatch(getFailed(error.message || error.response?.data?.message || 'Failed to delete item'));
      throw error;
    }
  }
);