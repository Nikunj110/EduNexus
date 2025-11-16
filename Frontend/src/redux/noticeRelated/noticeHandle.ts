// FIX: Changed the import from './noticeSlice.js' to './noticeSlice' to point to your new TypeScript file.
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getData } from '@/services/dataService';
import { getRequest, getSuccess, getFailed } from './noticeSlice';

/**
 * Thunk to get all notices
 * Called by: ShowNotices.tsx, AdminHomePage.tsx
 */
export const getAllNotices = createAsyncThunk(
  'notice/getAllNotices',
  async (id: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      // Calls new backend route: /NoticeList/school-id
      const data = await getData(`/NoticeList/${id}`);
      dispatch(getSuccess(data));
      return data;
    } catch (error: any) {
      dispatch(getFailed(error.message || 'Failed to get notices'));
      throw error;
    }
  }
);