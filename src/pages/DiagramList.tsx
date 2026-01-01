import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { diagramService } from '../api/diagramService';
import { Diagram } from '../api/types';
import DiagramViewer from '../components/DiagramViewer';

const DiagramList: React.FC = () => {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);

  useEffect(() => {
    fetchDiagrams();
  }, []);

  const fetchDiagrams = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await diagramService.getDiagrams();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setDiagrams(data);
      } else {
        console.error('API returned non-array data:', data);
        setDiagrams([]);
      }
    } catch (err: any) {
      console.error('Fetch diagrams error:', err);
      setError(err.response?.data?.message || 'Failed to fetch diagrams');
      setDiagrams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (diagram: Diagram) => {
    setSelectedDiagram(diagram);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (diagram: Diagram) => {
    setSelectedDiagram(diagram);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDiagram) return;

    try {
      await diagramService.deleteDiagram(selectedDiagram.diagramId);
      setDiagrams(diagrams.filter((d) => d.diagramId !== selectedDiagram.diagramId));
      setDeleteDialogOpen(false);
      setSelectedDiagram(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete diagram');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'architecture':
        return 'primary';
      case 'sequence':
        return 'secondary';
      case 'flow':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Diagrams
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Diagram Type</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diagrams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="text.secondary">No diagrams found. Create your first diagram!</Typography>
                </TableCell>
              </TableRow>
            ) : (
              diagrams.map((diagram) => (
                <TableRow key={diagram.diagramId} hover>
                  <TableCell>
                    <Chip label={diagram.diagramType} color={getTypeColor(diagram.diagramType)} size="small" />
                  </TableCell>
                  <TableCell>{formatDate(diagram.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View">
                      <IconButton onClick={() => handleViewClick(diagram)} color="primary">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteClick(diagram)} color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          View Diagram - {selectedDiagram?.diagramType}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: '600px', mt: 2 }}>
            {selectedDiagram && <DiagramViewer svgContent={selectedDiagram.svgContent} />}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this diagram? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DiagramList;
