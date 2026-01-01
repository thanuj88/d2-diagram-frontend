import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { cognitoConfig, validateCognitoConfig, getOAuthUrl } from '../config/cognito';

// Only create user pool if configuration is valid
let userPool: CognitoUserPool | null = null;

if (validateCognitoConfig()) {
  const poolData = {
    UserPoolId: cognitoConfig.userPoolId,
    ClientId: cognitoConfig.clientId,
  };
  userPool = new CognitoUserPool(poolData);
}

export interface AuthUser {
  username: string;
  email?: string;
  attributes?: Record<string, string>;
}

class AuthService {
  /**
   * Sign in with username and password
   */
  async signIn(username: string, password: string): Promise<CognitoUserSession> {
    if (!userPool) {
      throw new Error('Cognito is not configured. Please update your .env.development file.');
    }

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          resolve(session);
        },
        onFailure: (err) => {
          reject(err);
        },
        newPasswordRequired: () => {
          reject(new Error('New password required'));
        },
      });
    });
  }

  /**
   * Sign out current user
   */
  signOut(): void {
    if (!userPool) {
      return;
    }
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    localStorage.removeItem('authToken');
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!userPool) {
      return null;
    }
    
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      return null;
    }

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session) {
          reject(err);
          return;
        }

        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err);
            return;
          }

          const userAttributes: Record<string, string> = {};
          attributes?.forEach((attr) => {
            userAttributes[attr.getName()] = attr.getValue();
          });

          resolve({
            username: cognitoUser.getUsername(),
            email: userAttributes['email'],
            attributes: userAttributes,
          });
        });
      });
    });
  }

  /**
   * Get current session
   */
  async getSession(): Promise<CognitoUserSession | null> {
    if (!userPool) {
      return null;
    }
    
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      return null;
    }

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(session);
      });
    });
  }

  /**
   * Get ID token for API calls
   */
  async getIdToken(): Promise<string | null> {
    try {
      const session = await this.getSession();
      return session?.getIdToken().getJwtToken() || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Sign in with Google SSO
   */
  signInWithGoogle(): void {
    if (!validateCognitoConfig()) {
      throw new Error('Cognito is not configured. Please update your .env.development file.');
    }
    const oauthUrl = getOAuthUrl('signin');
    window.location.href = oauthUrl;
  }

  /**
   * Sign up with Google SSO
   */
  signUpWithGoogle(): void {
    if (!validateCognitoConfig()) {
      throw new Error('Cognito is not configured. Please update your .env.development file.');
    }
    const oauthUrl = getOAuthUrl('signup');
    window.location.href = oauthUrl;
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleOAuthCallback(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      // Check if there's an error
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      if (error) {
        throw new Error(errorDescription || error);
      }
      return;
    }

    try {
      // Exchange code for tokens
      const tokenEndpoint = `https://${cognitoConfig.domain}/oauth2/token`;
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: cognitoConfig.clientId,
        code: code,
        redirect_uri: cognitoConfig.redirectSignIn,
      });

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Failed to exchange code for tokens');
      }

      const tokens = await response.json();
      
      // Store tokens
      localStorage.setItem('idToken', tokens.id_token);
      localStorage.setItem('accessToken', tokens.access_token);
      localStorage.setItem('refreshToken', tokens.refresh_token);

      // Clear the code from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete OAuth flow');
    }
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<CognitoUserSession> {
    if (!userPool) {
      throw new Error('Cognito is not configured');
    }
    
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      throw new Error('No user found');
    }

    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err || !session) {
          reject(err);
          return;
        }

        const refreshToken = session.getRefreshToken();
        cognitoUser.refreshSession(refreshToken, (err, newSession) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(newSession);
        });
      });
    });
  }
}

export default new AuthService();

