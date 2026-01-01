// AWS Cognito Configuration
export const cognitoConfig = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  domain: import.meta.env.VITE_COGNITO_DOMAIN,
  region: import.meta.env.VITE_COGNITO_REGION || 'us-east-1',
  redirectSignIn: import.meta.env.VITE_COGNITO_REDIRECT_SIGNIN || 'http://localhost:5173',
  redirectSignOut: import.meta.env.VITE_COGNITO_REDIRECT_SIGNOUT || 'http://localhost:5173',
};

// Get OAuth URL
export const getOAuthUrl = (type: 'signin' | 'signup' = 'signin'): string => {
  const { domain, clientId, redirectSignIn } = cognitoConfig;
  const responseType = 'token'; // Use implicit flow for simpler implementation
  const scope = 'email openid profile';
  
  let url = `https://${domain}/oauth2/authorize?`;
  url += `client_id=${clientId}`;
  url += `&response_type=${responseType}`;
  url += `&scope=${encodeURIComponent(scope)}`;
  url += `&redirect_uri=${encodeURIComponent(redirectSignIn)}`;
  url += `&identity_provider=Google`; // Always use Google
  
  if (type === 'signup') {
    url += '&prompt=consent'; // Force account selection for signup
  }
  
  return url;
};

// Validate configuration
export const validateCognitoConfig = (): boolean => {
  const required = [
    cognitoConfig.userPoolId,
    cognitoConfig.clientId,
    cognitoConfig.domain,
  ];
  
  return required.every((value) => value && !value.includes('your-'));
};
