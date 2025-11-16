import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  stuffDone
} from './studentSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getAllStudents = (id: string) => async (dispatch: any) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${API_BASE_URL}/Students/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateStudentFields = (id: string, fields: any, address: string) => async (dispatch: any) => {
  dispatch(getRequest());

  try {
    const result = await axios.put(`${API_BASE_URL}/${address}/${id}`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const removeStuff = (id: string, address: string) => async (dispatch: any) => {
  dispatch(getRequest());

  try {
    const result = await axios.put(`${API_BASE_URL}/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
