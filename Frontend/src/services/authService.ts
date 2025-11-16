import api from '@/lib/axios'; // Our new central API client
import { toast } from 'sonner';

// This interface defines the shape of the data we get back from our
// new backend /auth/login endpoint.
interface AuthResponse {
  user: any; // You can create a proper 'User' type later
  token: string;
}

/**
 * Logs in a user (Admin, Student, or Teacher)
 * @param {object} credentials - The login credentials
 * @param {string} role - The user's role
 */
export const loginUser = async (credentials: any, role: string) => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      ...credentials,
      role: role, // Add the role to the request body
    });

    // 1. Check if we got a token back
    if (data.token && data.user) {
      // 2. Save the token and user data to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success('Login Successful', {
        description: `Welcome back, ${data.user.name}!`,
      });

      // 3. Return the response data so Redux can use it
      return data;
    } else {
      // This case should not happen if the backend is correct
      throw new Error('Invalid response from server');
    }
  } catch (error: any) {
    // The 'api' instance's interceptor will handle 401s (like bad password)
    // This will catch other errors (like 500 server error)
    console.error('Login error:', error);
    toast.error('Login Failed', {
      description: error.response?.data?.message || 'An unknown error occurred.',
    });
    throw error; // Re-throw the error for Redux to catch
  }
};

/**
 * Registers a new Admin
 * @param {object} details - The admin registration details
 */
export const registerAdmin = async (details: any) => {
  try {
    // We call our new /auth/register-admin endpoint
    const { data } = await api.post('/auth/register-admin', details);
    
    toast.success('Registration Successful', {
      description: 'You can now log in with your new account.',
    });
    return data;
  } catch (error: any) {
    console.error('Registration error:', error);
    toast.error('Registration Failed', {
      description: error.response?.data?.message || 'An unknown error occurred.',
    });
    throw error;
  }
};

/**
 * Logs out the current user
 * This function is simple: it just clears localStorage
 */
export const logoutUser = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Logged Out', {
      description: 'You have been successfully logged out.',
    });
    // The axios interceptor will handle redirecting if needed,
    // but we can also do it here.
    // window.location.href = '/'; // Optional: force redirect
  } catch (error) {
    console.error('Logout error:', error);
  }
};