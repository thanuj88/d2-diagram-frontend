import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Box, IconButton, Tooltip, Paper } from '@mui/material';
import { ZoomIn, ZoomOut, RestartAlt, Download } from '@mui/icons-material';

interface DiagramViewerProps {
  svgContent: string;
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({ svgContent }) => {
  const handleDownload = () => {
    // Create a blob from the SVG content
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagram-${new Date().getTime()}.svg`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Log SVG content for debugging
  React.useEffect(() => {
    console.log('DiagramViewer - SVG Content length:', svgContent?.length);
    console.log('DiagramViewer - SVG Content preview:', svgContent?.substring(0, 200));
  }, [svgContent]);

  // Clean SVG content by removing XML declaration
  const cleanSvgContent = React.useMemo(() => {
    if (!svgContent) return '';
    // Remove XML declaration if present
    const cleaned = svgContent.replace(/<\?xml[^?]*\?>\s*/g, '');
    console.log('DiagramViewer - Cleaned SVG preview:', cleaned.substring(0, 200));
    return cleaned;
  }, [svgContent]);

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={3}
      centerOnInit
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <Box sx={{ height: '100%', position: 'relative' }}>
          {/* Zoom Controls */}
          <Paper
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 1,
            }}
            elevation={3}
          >
            <Tooltip title="Zoom In" placement="left">
              <IconButton onClick={() => zoomIn()} size="small">
                <ZoomIn />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out" placement="left">
              <IconButton onClick={() => zoomOut()} size="small">
                <ZoomOut />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset" placement="left">
              <IconButton onClick={() => resetTransform()} size="small">
                <RestartAlt />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download SVG" placement="left">
              <IconButton onClick={handleDownload} size="small" color="primary">
                <Download />
              </IconButton>
            </Tooltip>
          </Paper>

          {/* SVG Content */}
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
            }}
            contentStyle={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
              dangerouslySetInnerHTML={{ __html: cleanSvgContent }}
            />
          </TransformComponent>
        </Box>
      )}
    </TransformWrapper>
  );
};

export default DiagramViewer;
