export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Auth API functions
export const authAPI = {
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    
    return response.json();
  },
  
  checkAuth: async () => {
    const response = await fetch(`${API_BASE_URL}/check-auth`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Auth check failed');
    }
    
    return response.json();
  }
};
