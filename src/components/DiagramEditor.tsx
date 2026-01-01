import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { diagramService } from '../api/diagramService';
import { DiagramType } from '../api/types';
import DiagramViewer from './DiagramViewer';

const DiagramEditor: React.FC = () => {
  const [d2Text, setD2Text] = useState<string>('# Enter your D2 code here\nx -> y: Hello World');
  const [diagramType, setDiagramType] = useState<DiagramType>('architecture');
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleTypeChange = (event: SelectChangeEvent) => {
    setDiagramType(event.target.value as DiagramType);
  };

  const handleRender = async () => {
    if (!d2Text.trim()) {
      setError('Please enter D2 content');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const requestData = {
        diagramType,
        d2Text,
      };
      console.log('Sending request:', requestData);
      
      const response = await diagramService.createDiagram(requestData);

      console.log('Response received:', response);
      
      // Handle both direct SVG content and S3 URL
      if (response.svgContent) {
        setSvgContent(response.svgContent);
        setSuccess('Diagram rendered successfully!');
      } else if (response.diagramId) {
        // Fetch the full diagram by ID to get SVG content
        console.log('Fetching diagram by ID:', response.diagramId);
        const diagram = await diagramService.getDiagramById(response.diagramId);
        console.log('Diagram fetched:', diagram);
        
        if (diagram.svgContent) {
          setSvgContent(diagram.svgContent);
          setSuccess('Diagram rendered successfully!');
        } else if (diagram.s3Url) {
          // Try fetching from S3 URL as last resort
          console.log('Fetching SVG from S3:', diagram.s3Url);
          try {
            const svgResponse = await fetch(diagram.s3Url, {
              mode: 'cors',
              credentials: 'omit'
            });
            if (!svgResponse.ok) {
              throw new Error(`S3 fetch failed: ${svgResponse.status}`);
            }
            const svgText = await svgResponse.text();
            setSvgContent(svgText);
            setSuccess('Diagram rendered successfully!');
          } catch (fetchErr) {
            console.error('S3 fetch error:', fetchErr);
            throw new Error('Backend must return svgContent field. Please update your Lambda function to fetch SVG from S3 and include it in the response.');
          }
        } else {
          throw new Error('No SVG content or S3 URL in diagram response');
        }
      } else {
        throw new Error('No SVG content or diagram ID in response');
      }
    } catch (err: any) {
      console.error('Diagram creation error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to render diagram');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', gap: 2, p: 3 }}>
      {/* Left Panel - Editor */}
      <Paper sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" gutterBottom>
          Diagram Editor
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="diagram-type-label">Diagram Type</InputLabel>
          <Select
            labelId="diagram-type-label"
            value={diagramType}
            label="Diagram Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="architecture">Architecture</MenuItem>
            <MenuItem value="sequence">Sequence</MenuItem>
            <MenuItem value="flow">Flow</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="D2 Content"
          multiline
          rows={20}
          value={d2Text}
          onChange={(e) => setD2Text(e.target.value)}
          fullWidth
          sx={{
            mb: 2,
            flex: 1,
            '& .MuiInputBase-root': {
              fontFamily: '"Courier New", monospace',
              fontSize: '14px',
            },
          }}
        />

        <Button
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
          onClick={handleRender}
          disabled={loading}
        >
          {loading ? 'Rendering...' : 'Render Diagram'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Paper>

      {/* Right Panel - Viewer */}
      <Paper sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" gutterBottom>
          Diagram Preview
        </Typography>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {svgContent ? (
            <DiagramViewer svgContent={svgContent} />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography>Click "Render Diagram" to see your diagram here</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DiagramEditor;
