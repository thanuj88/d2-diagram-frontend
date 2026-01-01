import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import { validateCognitoConfig } from './config/cognito';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CognitoNotConfigured from './components/CognitoNotConfigured';
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import DiagramEditor from './components/DiagramEditor';
import DiagramList from './pages/DiagramList';

const App: React.FC = () => {
  // Check if Cognito is configured
  const isCognitoConfigured = validateCognitoConfig();

  if (!isCognitoConfigured) {
    return (
      <ThemeProvider>
        <CognitoNotConfigured />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<OAuthCallback />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Box sx={{ display: 'flex', height: '100vh' }}>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/editor" replace />} />
                        <Route path="/editor" element={<DiagramEditor />} />
                        <Route path="/diagrams" element={<DiagramList />} />
                      </Routes>
                    </Layout>
                  </Box>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
