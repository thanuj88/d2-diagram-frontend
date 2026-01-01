import React from 'react';
import { Box, Paper, Typography, Alert, Link } from '@mui/material';
import { Warning } from '@mui/icons-material';

const CognitoNotConfigured: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 600,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Warning sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          AWS Cognito Not Configured
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The application requires AWS Cognito credentials to function.
        </Typography>
        
        <Alert severity="info" sx={{ textAlign: 'left', mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            <strong>Quick Setup:</strong>
          </Typography>
          <Typography variant="body2" component="div">
            1. Open <code>.env.development</code> file<br />
            2. Replace placeholder values with your AWS Cognito details:<br />
            <Box
              component="pre"
              sx={{
                mt: 1,
                p: 1,
                bgcolor: 'grey.100',
                borderRadius: 1,
                fontSize: '0.75rem',
                overflow: 'auto',
              }}
            >
{`VITE_COGNITO_USER_POOL_ID=us-east-1_XXX
VITE_COGNITO_CLIENT_ID=your-client-id
VITE_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com`}
            </Box>
            3. Restart the development server: <code>npm run dev</code>
          </Typography>
        </Alert>

        <Typography variant="body2" color="text.secondary">
          See{' '}
          <Link href="./COGNITO_QUICKREF.md" target="_blank">
            COGNITO_QUICKREF.md
          </Link>{' '}
          for detailed instructions.
        </Typography>
      </Paper>
    </Box>
  );
};

export default CognitoNotConfigured;
