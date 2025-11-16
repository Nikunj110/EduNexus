import { createAsyncThunk } from '@reduxjs/toolkit';
import { getData } from '@/services/dataService';
import {
  getRequest,
  getSuccess,
  getFailed,
  getTeacherDetailsSuccess,
} from './teacherSlice'; // This import is now correct

/**
 * Thunk to get all teachers for the admin
 * Called by: ShowTeachers.tsx
 */
export const getAllTeachers = createAsyncThunk(
  'teacher/getAllTeachers',
  async (id: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      // Calls new backend route: /Teachers/school-id
      const data = await getData(`/Teachers/${id}`);
      dispatch(getSuccess(data));
      return data;
    } catch (error: any) {
      const message = error.message || 'Failed to get teachers';
      dispatch(getFailed(message));
      throw error;
    }
  }
);

/**
 * Thunk to get details for a single teacher
 * Called by: TeacherDetails.tsx
 */
export const getTeacherDetails = createAsyncThunk(
  'teacher/getTeacherDetails',
  async (id: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      // Calls new backend route: /Teacher/teacher-id
      const data = await getData(`/Teacher/${id}`);
      dispatch(getTeacherDetailsSuccess(data)); // This now correctly calls the reducer
      return data;
    } catch (error: any) {
      const message = error.message || 'Failed to get teacher details';
      dispatch(getFailed(message));
      throw error;
    }
  }
);