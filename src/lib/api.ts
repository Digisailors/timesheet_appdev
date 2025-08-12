import { getBaseUrl } from './env';

// Utility function for making API calls
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Specific function for session API
export const getSession = async () => {
  return apiCall('/api/auth/session');
};
