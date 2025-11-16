import { createAsyncThunk } from '@reduxjs/toolkit';
import { getData } from '@/services/dataService';
import {
  getRequest,
  getSuccess,
  getFailed,
  getStudentsSuccess,
  getSubjectsSuccess,
  getSubjectDetailsSuccess,
  getSubRequest, // <-- FIX: Import getSubRequest
  getClassDetailsSuccess, // <-- FIX: Import getClassDetailsSuccess
} from './sclassSlice';

/**
 * Thunk to get all classes
 * Called by: ShowClasses.tsx
 */
export const getAllSclasses = createAsyncThunk(
  'sclass/getAllSclasses',
  async (id: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      // Calls new backend route: /SclassList/school-id
      const data = await getData(`/SclassList/${id}`);
      dispatch(getSuccess(data));
      return data;
    } catch (error: any) {
      dispatch(getFailed(error.message || 'Failed to get classes'));
      throw error;
    }
  }
);

/**
 * Thunk to get details for a single class
 * Called by: ClassDetails.tsx
 */
export const getClassDetails = createAsyncThunk(
  'sclass/getClassDetails',
  async (id: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      // Calls new backend route: /Sclass/class-id
      const data = await getData(`/Sclass/${id}`);
      // FIX 1: Use 'getClassDetailsSuccess' for a single class object
      dispatch(getClassDetailsSuccess(data)); 
      return data;
    } catch (error: any) {
      dispatch(getFailed(error.message || 'Failed to get class details'));
      throw error;
    }
  }
);

/**
 * Thunk to get all students in a class
 * Called by: ClassDetails.tsx, TeacherClassDetails.tsx
 */
export const getClassStudents = createAsyncThunk(
  'sclass/getClassStudents',
  async (id: string, { dispatch }) => {
    dispatch(getRequest());
    try {
      // Calls new backend route: /Sclass/Students/class-id
      const data = await getData(`/Sclass/Students/${id}`);
      dispatch(getStudentsSuccess(data));
      return data;
    } catch (error: any) {
      dispatch(getFailed(error.message || 'Failed to get students'));
      throw error;
    }
  }
);

/**
 * Thunk to get subjects (either for a class or all subjects)
 * Called by: ClassDetails.tsx, StudentHomePage.tsx, ShowSubjects.tsx
 */
export const getSubjectList = createAsyncThunk(
  'sclass/getSubjectList',
  async (
    { id, address }: { id: string; address: string },
    { dispatch }
  ) => {
    dispatch(getRequest());
    try {
      let endpoint = '';
      if (address === 'ClassSubjects') {
        endpoint = `/ClassSubjects/${id}`; // Gets subjects for a specific class
      } else if (address === 'AllSubjects') {
        endpoint = `/AllSubjects/${id}`; // Gets all subjects for the school
      }
      
      const data = await getData(endpoint);
      dispatch(getSubjectsSuccess(data));
      return data;
    } catch (error: any) {
      dispatch(getFailed(error.message || 'Failed to get subjects'));
      throw error;
    }
  }
);

/**
 * Thunk to get details for a single subject
 * Called by: ViewSubject.tsx, AddTeacher.tsx
 */
export const getSubjectDetails = createAsyncThunk(
  'sclass/getSubjectDetails',
  async (id: string, { dispatch }) => {
    // FIX 2: Use 'getSubRequest' for the separate subloading state
    dispatch(getSubRequest()); 
    try {
      // Calls new backend route: /Subject/subject-id
      const data = await getData(`/Subject/${id}`);
      dispatch(getSubjectDetailsSuccess(data));
      return data;
    } catch (error: any) {
      dispatch(getFailed(error.message || 'Failed to get subject details'));
      throw error;
    }
  }
);