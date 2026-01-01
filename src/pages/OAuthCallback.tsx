import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double processing in React StrictMode
    if (processedRef.current) {
      console.log('Already processed, skipping...');
      return;
    }

    const processCallback = async () => {
      try {
        // Debug: Log the full URL
        console.log('Full URL:', window.location.href);
        console.log('Hash:', window.location.hash);

        // Check for errors in query params first
        const urlParams = new URLSearchParams(window.location.search);
        const queryError = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (queryError) {
          throw new Error(errorDescription || queryError);
        }

        // For implicit flow, tokens are in the URL hash
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        
        const idToken = hashParams.get('id_token');
        const accessToken = hashParams.get('access_token');
        const hashError = hashParams.get('error');

        console.log('ID Token exists:', !!idToken);
        console.log('Access Token exists:', !!accessToken);

        if (hashError) {
          throw new Error(hashParams.get('error_description') || hashError);
        }

        // Check if tokens are already in localStorage (processed in previous render)
        const storedIdToken = localStorage.getItem('idToken');
        const storedAccessToken = localStorage.getItem('accessToken');

        if (!idToken && !accessToken && !storedIdToken && !storedAccessToken) {
          throw new Error('No authentication tokens received. Please try signing in again.');
        }

        // If we have tokens in URL, mark as processed and handle callback
        if (idToken || accessToken) {
          processedRef.current = true;
          
          // Handle the OAuth callback (stores tokens and sets user)
          await handleOAuthCallback();
        }

        // Redirect to the editor on success (whether tokens are in URL or localStorage)
        navigate('/editor', { replace: true });
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        processedRef.current = true;
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [navigate, handleOAuthCallback]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 400,
          width: '100%',
          mx: 2,
        }}
      >
        {error ? (
          <>
            <Typography variant="h6" color="error" gutterBottom>
              Authentication Error
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Redirecting to login...
            </Typography>
          </>
        ) : (
          <>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Signing you in...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we complete your authentication
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default OAuthCallback;
