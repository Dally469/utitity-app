// stores/auth.js
import { defineStore } from 'pinia';
import { httpRequest } from '~/services';
import type { User } from '~/types/auth.types';



export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref('');
  const refreshToken = ref(null);
  const isLoggedIn = ref(false);
  const tokenType = ref('Bearer');
  const loading = ref(false);
  const error = ref(null);

  // Alert store
  const alert = useAlertStore();

  // Setters
  const setUser = (data: any) => (user.value = data);
  const setToken = (data: string) => (token.value = data);
  const setRefreshToken = (data: any) => (refreshToken.value = data);
  const setIsLoggedIn = (value: boolean) => (isLoggedIn.value = value);
  const setTokenType = (data: string) => (tokenType.value = data);
  const setLoading = (value: boolean) => (loading.value = value);
  const setError = (message: any) => (error.value = message);

  // Getters
  const isAuthenticated = computed(() => isLoggedIn.value && token.value !== '' && token.value !== undefined);
  const userFullName = computed(() => user.value?.fullName || '');
  const userPhoneNumber = computed(() => user.value?.phoneNumber || '');
  const userEmail = computed(() => user.value?.email || '');
  const userRole = computed(() => user.value?.role || 'USER');
  const authHeader = computed(() => token.value ? `Bearer ${token.value}` : null);
  const isLoading = computed(() => loading.value);
  const getError = computed(() => error.value);

  /**
   * Login with phone number
   */
  const login = async (phoneNumber: any) => {
    setLoading(true);
    setError(null);

    try {
      // Validate phone number
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('Invalid phone number');
      }

      // Make API call to login endpoint
      const response = await httpRequest.post('/auth/phone-login', {
        phoneNumber: phoneNumber
      });

      // Check if login was successful
      if (response.success && response.data) {
        // Store tokens
        setToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setTokenType(response.data.tokenType || 'Bearer');

        // Store user data
        setUser(response.data.user);
        setIsLoggedIn(true);

        // Persist to cookies and localStorage
        persistAuth();

        // Show success message
        alert.success('Login successful');

        console.log('Login successful:', user.value?.fullName);
        return true;
      } else {
        throw new Error(response.message || 'Login failed');
      }

    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(message);
      alert.error(message);
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (phoneNumber: any, fullName: any, email: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpRequest.post('/auth/register', {
        phoneNumber,
        fullName,
        email
      });

      if (response.success) {
        alert.success('Registration successful! Please login.');
        return true;
      }

      throw new Error(response.message || 'Registration failed');

    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(message);
      alert.error(message);
      console.error('Registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setLoading(true);

    try {
      // Optionally call logout endpoint
      // await httpRequest.post('/auth/logout');

      // Clear state
      setUser(null);
      setToken('');
      setRefreshToken(null);
      setIsLoggedIn(false);

      // Clear cookies
      const tokenCookie = useCookie('token');
      const refreshTokenCookie = useCookie('refreshToken');
      const userCookie = useCookie('user');

      tokenCookie.value = null;
      refreshTokenCookie.value = null;
      userCookie.value = null;

      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }

      console.log('User logged out');

      // Show logout message
      alert.success('Logged out successfully');

      // Redirect to login
      const router = useRouter();
      router.push('/login');

    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh access token
   */
  const refreshAccessToken = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available');
      }

      const response = await httpRequest.post('/auth/refresh', {
        refreshToken: refreshToken.value
      });

      if (response.success && response.data) {
        setToken(response.data.accessToken);

        // Update cookies and localStorage
        const tokenCookie = useCookie('token');
        tokenCookie.value = token.value;

        if (process.client) {
          localStorage.setItem('auth_token', token.value);
        }

        console.log('Token refreshed successfully');
        return true;
      }

      throw new Error('Token refresh failed');

    } catch (err) {
      const message = err.response?.data?.message || 'Token refresh failed';
      setError(message);
      console.error('Token refresh error:', err);

      // If refresh fails, logout user
      await logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Persist authentication data to cookies and localStorage
   */
  const persistAuth = () => {
    try {
      // Store in cookies (for SSR)
      const tokenCookie = useCookie('token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });

      const refreshTokenCookie = useCookie('refreshToken', {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });

      const userCookie = useCookie('user', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });

      tokenCookie.value = token.value;
      refreshTokenCookie.value = refreshToken.value;
      userCookie.value = JSON.stringify(user.value);

      // Also store in localStorage (for client-side persistence)
      if (process.client) {
        localStorage.setItem('auth_token', token.value);
        localStorage.setItem('refresh_token', refreshToken.value);
        localStorage.setItem('user_data', JSON.stringify(user.value));
      }
    } catch (err) {
      console.error('Error persisting auth data:', err);
    }
  };

  /**
   * Restore authentication from cookies or localStorage
   */
  const restoreAuth = () => {
    try {
      // First try to restore from cookies (SSR compatible)
      const tokenCookie = useCookie('token');
      const refreshTokenCookie = useCookie('refreshToken');
      const userCookie = useCookie('user');

      if (tokenCookie.value && userCookie.value) {
        setToken(tokenCookie.value);
        setRefreshToken(refreshTokenCookie.value);
        setUser(typeof userCookie.value === 'string'
          ? JSON.parse(userCookie.value)
          : userCookie.value);
        setIsLoggedIn(true);

        console.log('Auth restored from cookies');
        return true;
      }

      // Fallback to localStorage (client-side only)
      if (process.client) {
        const localToken = localStorage.getItem('auth_token');
        const localRefreshToken = localStorage.getItem('refresh_token');
        const userData = localStorage.getItem('user_data');

        if (localToken && userData) {
          setToken(localToken);
          setRefreshToken(localRefreshToken);
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);

          console.log('Auth restored from localStorage');
          return true;
        }
      }
    } catch (err) {
      console.error('Error restoring auth data:', err);
      logout();
    }

    return false;
  };

  /**
   * Check if token is expired
   */
  const isTokenExpired = () => {
    if (!token.value || token.value === '') return true;

    try {
      // Decode JWT token (basic decode without verification)
      const payload = JSON.parse(atob(token.value.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      // Add 5 minute buffer before actual expiration
      const bufferTime = 5 * 60 * 1000;

      return currentTime >= (expirationTime - bufferTime);
    } catch (err) {
      console.error('Error checking token expiration:', err);
      return true;
    }
  };

  /**
   * Update user profile
   */
  const updateUserProfile = async (userData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpRequest.put('/users/profile', userData);

      if (response.success && response.data) {
        setUser({ ...user.value, ...response.data });

        // Update cookies and localStorage
        const userCookie = useCookie('user');
        userCookie.value = JSON.stringify(user.value);

        if (process.client) {
          localStorage.setItem('user_data', JSON.stringify(user.value));
        }

        alert.success('Profile updated successfully');
        return true;
      }

      throw new Error(response.message || 'Failed to update profile');

    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(message);
      alert.error(message);
      console.error('Profile update error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change password
   */
  const changePassword = async (currentPassword: any, newPassword: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpRequest.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      if (response.success) {
        alert.success('Password changed successfully');
        return true;
      }

      throw new Error(response.message || 'Failed to change password');

    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to change password';
      setError(message);
      alert.error(message);
      console.error('Change password error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request password reset
   */
  const requestPasswordReset = async (phoneNumber: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpRequest.post('/auth/forgot-password', {
        phoneNumber
      });

      if (response.success) {
        alert.success('Password reset link sent to your phone');
        return true;
      }

      throw new Error(response.message || 'Failed to request password reset');

    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to request password reset';
      setError(message);
      alert.error(message);
      console.error('Password reset request error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify user account
   */
  const verifyAccount = async (code: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await httpRequest.post('/auth/verify', {
        code
      });

      if (response.success) {
        alert.success('Account verified successfully');
        return true;
      }

      throw new Error(response.message || 'Verification failed');

    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Verification failed';
      setError(message);
      alert.error(message);
      console.error('Verification error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    user,
    token,
    refreshToken,
    isLoggedIn,
    tokenType,
    loading,
    error,

    // Setters
    setUser,
    setToken,
    setRefreshToken,
    setIsLoggedIn,
    setTokenType,
    setLoading,
    setError,

    // Getters
    isAuthenticated,
    userFullName,
    userPhoneNumber,
    userEmail,
    userRole,
    authHeader,
    isLoading,
    getError,

    // Actions
    login,
    register,
    logout,
    refreshAccessToken,
    persistAuth,
    restoreAuth,
    isTokenExpired,
    updateUserProfile,
    changePassword,
    requestPasswordReset,
    verifyAccount
  };
});

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}