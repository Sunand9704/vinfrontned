import apiInstance from '../api/apiService';

const authService = {
  register: async (userData) => {
    try {
      const response = await apiInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed';
    }
  },

  login: async (credentials) => {
    try {
      const response = await apiInstance.post('/auth/login', credentials,{
        withCredentials: true
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  updateProfile: async (userData) => {
    try {
      const response = await apiInstance.put('/users/profile', userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'Profile update failed';
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to send reset link';
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiInstance.post('/auth/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'Password reset failed';
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const response = await apiInstance.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error.response?.data?.message || error.response?.data?.error || error.message || 'OTP verification failed';
    }
  }
};

export default authService;
