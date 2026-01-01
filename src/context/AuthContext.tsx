import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { AuthUser } from '../services/authService';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  checkAuth: () => Promise<void>;
  handleOAuthCallback: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: () => {},
  checkAuth: async () => {},
  handleOAuthCallback: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // First check if we have tokens from OAuth flow
      const idToken = localStorage.getItem('idToken');
      const accessToken = localStorage.getItem('accessToken');
      
      if (idToken && accessToken) {
        // Parse JWT to get user info
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        setUser({
          username: payload['cognito:username'] || payload.email,
          email: payload.email,
          attributes: payload,
        });
        // Use access token for API calls (API Gateway expects this)
        localStorage.setItem('authToken', accessToken);
      } else {
        // Fallback to traditional Cognito check
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Store token in localStorage for API calls
          const token = await authService.getIdToken();
          if (token) {
            localStorage.setItem('authToken', token);
          }
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    const session: CognitoUserSession = await authService.signIn(username, password);
    const token = session.getIdToken().getJwtToken();
    localStorage.setItem('authToken', token);
    await checkUser();
  };

  const signOut = () => {
    authService.signOut();
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const handleOAuthCallback = async () => {
    try {
      // Extract tokens from URL hash
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      const idToken = params.get('id_token');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      
      console.log('OAuth Callback - ID Token present:', !!idToken);
      console.log('OAuth Callback - Access Token present:', !!accessToken);
      
      if (!idToken || !accessToken) {
        throw new Error('Missing tokens in callback');
      }

      // Store tokens
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      // Use access token for API calls (API Gateway expects this)
      localStorage.setItem('authToken', accessToken);
      
      console.log('Tokens stored in localStorage');
      console.log('authToken (first 50 chars):', accessToken.substring(0, 50));

      // Parse user info from ID token
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      console.log('Token payload:', payload);
      setUser({
        username: payload['cognito:username'] || payload.email,
        email: payload.email,
        attributes: payload,
      });

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        checkAuth: checkUser,
        handleOAuthCallback,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
