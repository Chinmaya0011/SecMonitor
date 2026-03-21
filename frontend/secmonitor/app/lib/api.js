const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  async signup(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Signup failed');
      }
      
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
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
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }
      
      localStorage.setItem('user', JSON.stringify(result.data));
      localStorage.setItem('isAuthenticated', 'true');
      
      return { success: result.success, data: result.data, error: result.error };
    } catch (error) {
      return { success: false, error: error.message, data: null };
    }
  }

  async getLogs() {
    try {
      const response = await fetch(`${API_BASE_URL}/logs`);
      
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
      const response = await fetch(`${API_BASE_URL}/logs/type/${type}?limit=${limit}`);
      
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
      const response = await fetch(`${API_BASE_URL}/logs/search?${queryString}`);
      
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
      const response = await fetch(`${API_BASE_URL}/logs/stats`);
      
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
      const response = await fetch(`${API_BASE_URL}/logs/paginated?page=${page}&limit=${limit}`);
      
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

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }

  isAuthenticated() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}

const api = new ApiService();
export default api;