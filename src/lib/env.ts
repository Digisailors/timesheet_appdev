// Environment configuration
export const env = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Helper function to get the correct base URL for API calls
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use window.location.origin
    return window.location.origin;
  }
  
  // Server-side: use environment variable or default
  return env.NEXTAUTH_URL;
};
