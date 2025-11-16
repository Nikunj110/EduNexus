import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess
} from './teacherSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getAllTeachers = (id: string) => async (dispatch: any) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${API_BASE_URL}/Teachers/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getTeacherDetails = (id: string) => async (dispatch: any) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${API_BASE_URL}/Teacher/${id}`);
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateTeachSubject = (teacherId: string, teachSubject: string) => async (dispatch: any) => {
  dispatch(getRequest());

  try {
    await axios.put(`${API_BASE_URL}/TeacherSubject`, { teacherId, teachSubject }, {
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch(postDone());
  } catch (error) {
    dispatch(getError(error));
  }
};
