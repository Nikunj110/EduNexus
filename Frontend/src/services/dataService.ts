
import api from '@/lib/axios'; // Our new central API client with auth

/**
 * A generic function to fetch data from any 'GET' endpoint
 * @param {string} endpoint - The API endpoint (e.g., /Students/some-id)
 */
export const getData = async (endpoint: string) => {
  try {
    const { data } = await api.get(endpoint);
    return data.data; // Our new backend wraps data in a 'data' property
  } catch (error: any) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * A generic function to send data to any 'POST' endpoint
 * @param {string} endpoint - The API endpoint (e.g., /SclassCreate)
 * @param {object} details - The data to send in the request body
 */
export const postData = async (endpoint: string, details: any) => {
  try {
    const { data } = await api.post(endpoint, details);
    return data; // Return the full response (includes success message)
  } catch (error: any) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * A generic function to update data using a 'PUT' endpoint
 * @param {string} endpoint - The API endpoint (e.g., /StudentAttendance/some-id)
 * @param {object} details - The data to send in the request body
 */
export const updateData = async (endpoint: string, details: any) => {
  try {
    const { data } = await api.put(endpoint, details);
    return data;
  } catch (error: any) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * A generic function to delete data from any 'DELETE' endpoint
 * @param {string} endpoint - The API endpoint (e.g., /Notice/some-id)
 */
export const deleteData = async (endpoint: string) => {
  try {
    const { data } = await api.delete(endpoint);
    return data;
  } catch (error: any) {
    console.error(`Error deleting data from ${endpoint}:`, error);
    throw error.response?.data || error;
  }
};