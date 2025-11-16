import { createAsyncThunk } from '@reduxjs/toolkit';
import { getData, updateData } from '@/services/dataService';
import {
  getRequest,
  getSuccess,
  getFailed,
  doneSuccess,
} from './studentSlice'; // This import is now correct

/**
 * Thunk to get all students for the admin
 * Called by: ShowStudents.tsx
 */
export const getAllStudents = createAsyncThunk(
  'student/getAllStudents',
  async (id: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      // Calls new backend route: /Students/school-id
      const data = await getData(`/Students/${id}`);
      dispatch(getSuccess(data));
      return data;
    } catch (error: any) {
      const message = error.message || 'Failed to get students';
      dispatch(getFailed(message));
      throw error;
    }
  }
);

/**
 * Thunk to update student fields (like attendance or marks)
 * Called by: StudentAttendance.tsx, StudentExamMarks.tsx
 */
export const updateStudentFields = createAsyncThunk(
  'student/updateStudentFields',
  async (
    { id, fields, address }: { id: string; fields: any; address: string },
    { dispatch }
  ) => {
    dispatch(getRequest());
    try {
      let endpoint = '';
      if (address === 'StudentAttendance') {
        endpoint = `/StudentAttendance/${id}`;
      } else if (address === 'StudentExamMarks') {
        endpoint = `/StudentExamMarks/${id}`;
      }

      const data = await updateData(endpoint, fields);
      dispatch(doneSuccess(data)); // This now correctly calls the reducer
      return data;
    } catch (error: any) {
      const message = error.message || 'Failed to update student';
      dispatch(getFailed(message));
      throw error;
    }
  }
);