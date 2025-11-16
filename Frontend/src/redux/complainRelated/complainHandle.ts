import axios from 'axios';
import {
  getRequest,
  getSuccess,
  getFailed,
  getError
} from './complainSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getAllComplains = (id: string, address: string) => async (dispatch: any) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${API_BASE_URL}/${address}List/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const complainCreate = (fields: any, address: string) => async (dispatch: any) => {
  dispatch(getRequest());

  try {
    const result = await axios.post(`${API_BASE_URL}/${address}Create`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
