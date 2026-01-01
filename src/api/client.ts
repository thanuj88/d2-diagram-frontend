import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Use environment variable for API base URL
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        // Get token from localStorage or your auth provider
        const token = localStorage.getItem('authToken');
        console.log('API Request - Token present:', !!token);
        console.log('API Request - Token (first 50 chars):', token?.substring(0, 50));
        console.log('API Request - URL:', config.url);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn('No auth token found in localStorage');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          console.error('Unauthorized access - token may be invalid');
          console.error('Response:', error.response?.data);
          console.error('Headers sent:', error.config?.headers);
        }
        return Promise.reject(error);
      }
    );
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export default new ApiClient().getClient();
