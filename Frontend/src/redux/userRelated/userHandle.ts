import axios from 'axios';
import {
  authRequest,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
} from './userSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const loginUser = (fields: any, role: string) => async (dispatch: any) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(`${API_BASE_URL}/${role}Login`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.role) {
      dispatch(authSuccess(result.data));
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const registerUser = (fields: any, role: string) => async (dispatch: any) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(`${API_BASE_URL}/${role}Reg`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.schoolName) {
      dispatch(authSuccess(result.data));
    } else if (result.data.school) {
      dispatch(stuffAdded(result.data));
    } else {
      dispatch(authFailed(result.data.message));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

export const logoutUser = () => (dispatch: any) => {
  dispatch(authLogout());
};

export const getUserDetails = (id: string, address: string) => async (dispatch: any) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(`${API_BASE_URL}/${address}/${id}`);
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const deleteUser = (id: string, address: string) => async (dispatch: any) => {
  dispatch(getRequest());
  dispatch(getFailed("Sorry the delete function has been disabled for now."));
};

export const updateUser = (fields: any, id: string, address: string) => async (dispatch: any) => {
  dispatch(getRequest());

  try {
    const result = await axios.put(`${API_BASE_URL}/${address}/${id}`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.schoolName) {
      dispatch(authSuccess(result.data));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const addStuff = (fields: any, address: string) => async (dispatch: any) => {
  dispatch(authRequest());

  try {
    const result = await axios.post(`${API_BASE_URL}/${address}Create`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (result.data.message) {
      dispatch(authFailed(result.data.message));
    } else {
      dispatch(stuffAdded(result.data));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};
