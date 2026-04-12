const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    // Ensure fetch includes credentials (cookies) for all requests
    this.defaultOptions = {
      credentials: 'include', // Important: sends cookies with requests
    };
  }

  async signup(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Signup failed');
      }
      
      // Store user data (no token needed as it's in HTTP-only cookie)
      if (result.data?.user) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }
      
      // Store user data (token is automatically handled by HTTP-only cookie)
      if (result.data?.user) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Clear local storage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
      
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server request fails, clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      return { success: false, error: error.message, data: null };
    }
  }

  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - clear local storage
          this.logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch profile');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Update user data in local storage
        localStorage.setItem('user', JSON.stringify(result.data));
      }
      
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  async getAllProfiles() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/allprofile`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required');
        }
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch profiles');
      }
      const result = await response.json();
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return { success: false, error: error.message, data: [] };
    }
  }
  async deleteAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/allusers`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete users');
      }
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      console.error('Error deleting users:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  async getLogs() {
    try {
      const response = await fetch(`${API_BASE_URL}/logs`, {
        credentials: 'include', // Include cookies if logs require auth
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      
      const result = await response.json();
      return { success: result.success, data: Array.isArray(result.data) ? result.data : [], error: result.error };
    } catch (error) {
      console.error('Error fetching logs:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async getLogsByType(type, limit = 100) {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/type/${type}?limit=${limit}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch logs by type');
      }
      
      const result = await response.json();
      return { success: result.success, data: Array.isArray(result.data) ? result.data : [], error: result.error };
    } catch (error) {
      console.error('Error fetching logs by type:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async searchLogs(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/logs/search?${queryString}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to search logs');
      }
      
      const result = await response.json();
      return { success: result.success, data: Array.isArray(result.data) ? result.data : [], error: result.error };
    } catch (error) {
      console.error('Error searching logs:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async getLogStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/stats`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch log stats');
      }
      
      const result = await response.json();
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      console.error('Error fetching log stats:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  async getLogsPaginated(page = 1, limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/paginated?page=${page}&limit=${limit}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch paginated logs');
      }
      
      const result = await response.json();
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      console.error('Error fetching paginated logs:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  // Clear all logs (with confirmation)
  async clearAllLogs(confirm = false) {
    try {
      if (!confirm) {
        return { 
          success: false, 
          error: 'Confirmation required. Set confirm=true to clear all logs',
          data: null 
        };
      }

      const response = await fetch(`${API_BASE_URL}/logs/clear?confirm=true`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for auth
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to clear logs');
      }
      
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      console.error('Error clearing logs:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  // Clear logs older than specified days
  async clearOldLogs(days = 30) {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/clear/old?days=${days}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to clear old logs');
      }
      
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      console.error('Error clearing old logs:', error);
      return { success: false, error: error.message, data: null };
    }
  }

  // Check authentication status
  isAuthenticated() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
  }

  // Get current user
  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Check if current user has admin privileges
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  // Verify session with server
  async verifySession() {
    try {
      const profile = await this.getProfile();
      if (profile.success && profile.data) {
        return { valid: true, user: profile.data };
      }
      return { valid: false, error: profile.error };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

const api = new ApiService();
export default api;