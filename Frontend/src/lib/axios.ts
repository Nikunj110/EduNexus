import axios from 'axios';
import { toast } from 'sonner';

// 1. Get the base URL from the .env file.
// VITE_API_BASE_URL is 'http://localhost:5000' in your .env.example
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  console.error('VITE_API_BASE_URL is not defined in your .env file');
  toast.error('Application Error', {
    description: 'API base URL is not configured. Please contact support.',
  });
}

// 2. Create the central axios instance
const api = axios.create({
  baseURL: apiBaseUrl,
});

// 3. Use an "interceptor" to add the auth token to every request.
// This is the "industrial-level" way to handle authentication.
api.interceptors.request.use(
  (config) => {
    // 4. Get the token from localStorage
    // We will save the token here after a successful login
    const token = localStorage.getItem('token');

    if (token) {
      // 5. If the token exists, add it to the 'Authorization' header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// 6. Use an "interceptor" to handle responses globally
// This helps us catch errors like '401 Unauthorized' (e.g., expired token)
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response?.status === 401) {
      // If we get a 401, the token is invalid or expired
      toast.error('Session Expired', {
        description: 'Your session has expired. Please log in again.',
      });

      // Remove the bad token
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Also clear the user data

      // Redirect to login page
      // We use window.location to force a full reload, clearing all app state
      window.location.href = '/choose';
    }

    // Return the error so it can be caught by react-query or our Redux thunks
    return Promise.reject(error);
  }
);

export default api;