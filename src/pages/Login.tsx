import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import authService from '../services/authService';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoogleSignIn = () => {
    setError('');
    setLoading(true);
    try {
      authService.signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google sign in.');
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setError('');
    setLoading(true);
    try {
      authService.signUpWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to initiate Google sign up.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      }}
    >
      {/* Animated UML Diagram Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='2'%3E%3Crect x='50' y='50' width='150' height='100' rx='5'/%3E%3Ctext x='125' y='105' fill='%23ffffff' font-size='16' text-anchor='middle'%3EUser%3C/text%3E%3Crect x='50' y='250' width='150' height='100' rx='5'/%3E%3Ctext x='125' y='305' fill='%23ffffff' font-size='16' text-anchor='middle'%3EController%3C/text%3E%3Crect x='325' y='250' width='150' height='100' rx='5'/%3E%3Ctext x='400' y='305' fill='%23ffffff' font-size='16' text-anchor='middle'%3EService%3C/text%3E%3Crect x='600' y='250' width='150' height='100' rx='5'/%3E%3Ctext x='675' y='305' fill='%23ffffff' font-size='16' text-anchor='middle'%3EDatabase%3C/text%3E%3Cline x1='125' y1='150' x2='125' y2='250' marker-end='url(%23arrowhead)'/%3E%3Cline x1='200' y1='300' x2='325' y2='300' marker-end='url(%23arrowhead)'/%3E%3Cline x1='475' y1='300' x2='600' y2='300' marker-end='url(%23arrowhead)'/%3E%3Cdefs%3E%3Cmarker id='arrowhead' markerWidth='10' markerHeight='10' refX='9' refY='3' orient='auto'%3E%3Cpolygon points='0 0, 10 3, 0 6' fill='%23ffffff'/%3E%3C/marker%3E%3C/defs%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '50%': { transform: 'translate(-20px, -20px) scale(1.05)' },
          },
        }}
      />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: `${Math.random() * 60 + 20}px`,
            height: `${Math.random() * 60 + 20}px`,
            borderRadius: '50%',
            background: alpha(theme.palette.primary.main, 0.1),
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float-particle ${Math.random() * 10 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            '@keyframes float-particle': {
              '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateY(-30px) rotate(180deg)' },
            },
          }}
        />
      ))}

      {/* Login Card */}
      <Card
        sx={{
          maxWidth: 450,
          width: '90%',
          mx: 2,
          position: 'relative',
          backdropFilter: 'blur(20px)',
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha('#ffffff', 0.9),
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
            : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo/Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto 16px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
            >
              <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
                <rect x="10" y="10" width="35" height="25" stroke="white" strokeWidth="3" rx="2" />
                <rect x="55" y="10" width="35" height="25" stroke="white" strokeWidth="3" rx="2" />
                <rect x="10" y="65" width="35" height="25" stroke="white" strokeWidth="3" rx="2" />
                <rect x="55" y="65" width="35" height="25" stroke="white" strokeWidth="3" rx="2" />
                <line x1="27" y1="35" x2="27" y2="65" stroke="white" strokeWidth="2" />
                <line x1="45" y1="22" x2="55" y2="22" stroke="white" strokeWidth="2" />
                <line x1="45" y1="77" x2="55" y2="77" stroke="white" strokeWidth="2" />
              </svg>
            </Box>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              UML Editor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to create and manage your diagrams
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* SSO Buttons */}
          <Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: '#4285F4',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#357ae8',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(66, 133, 244, 0.4)',
                },
                '&:disabled': {
                  backgroundColor: alpha('#4285F4', 0.5),
                  color: 'white',
                },
                transition: 'all 0.3s ease',
                mb: 2,
              }}
            >
              {loading ? 'Redirecting...' : 'Sign In with Google'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              disabled={loading}
              onClick={handleGoogleSignUp}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: '#4285F4',
                color: '#4285F4',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#357ae8',
                  backgroundColor: alpha('#4285F4', 0.08),
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(66, 133, 244, 0.2)',
                },
                '&:disabled': {
                  borderColor: alpha('#4285F4', 0.5),
                  color: alpha('#4285F4', 0.5),
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Redirecting...' : 'Sign Up with Google'}
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Single Sign-On via AWS Cognito
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
