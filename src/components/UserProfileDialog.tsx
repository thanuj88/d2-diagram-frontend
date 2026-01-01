import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { AuthUser } from '../services/authService';

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: AuthUser | null;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  const fullName = user.attributes?.given_name && user.attributes?.family_name
    ? `${user.attributes.given_name} ${user.attributes.family_name}`
    : user.attributes?.name || user.username;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>User Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
          <Avatar
            src={user.attributes?.picture}
            sx={{ width: 100, height: 100, mb: 2 }}
          >
            {user.attributes?.given_name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h5" fontWeight="600" gutterBottom>
            {fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {user.email}
          </Typography>
          <Chip label="Free Plan" color="primary" sx={{ mt: 1 }} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <List>
          <ListItem>
            <ListItemText
              primary="Username"
              secondary={user.username}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Email"
              secondary={user.email}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Email Verified"
              secondary={user.attributes?.email_verified ? 'Yes' : 'No'}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Current Plan"
              secondary="Free Plan"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Diagram Count"
              secondary="Loading..."
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileDialog;
