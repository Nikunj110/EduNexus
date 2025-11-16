// FIX: This file is now refactored to use createAsyncThunk and our new 'dataService'.
// The old 'complainCreate' function has been removed, as it is now handled by 'addStuff' in userHandle.ts.

import { createAsyncThunk } from '@reduxjs/toolkit';
import { getData } from '@/services/dataService';
import {
  getRequest,
  getSuccess,
  getFailed,
  getError
} from './complainSlice';

/**
 * Thunk to get all complains for the admin
 * Called by: SeeComplains.tsx
 */
export const getAllComplains = createAsyncThunk(
  'complain/getAllComplains',
  async (id: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      // Calls our new backend route: /ComplainList/school-id
      // 'getData' automatically uses our axios instance with the auth token.
      const data = await getData(`/ComplainList/${id}`);
      
      dispatch(getSuccess(data));
      return data;
    } catch (error: any) {
      const message = error.message || 'Failed to get complains';
      dispatch(getFailed(message));
      dispatch(getError(message));
      throw error;
    }
  }
);