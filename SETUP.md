# Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Your UMLEditor backend API running (default: http://localhost:5000)

## Installation

1. Install dependencies:
```bash
npm install
```

## Configuration

### API Connection

The frontend is configured to connect to your UMLEditor API via proxy in `vite.config.ts`.

By default, it connects to `http://localhost:5000`. If your API runs on a different port, update the proxy configuration:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:YOUR_PORT', // Change this
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

### Authentication

The app expects an auth token in localStorage. For development, you can set it manually in the browser console:

```javascript
localStorage.setItem('authToken', 'your-test-token');
```

Or modify `src/api/client.ts` to use a different auth mechanism.

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## API Endpoints

The frontend expects the following endpoints from your UMLEditor API:

- `POST /diagrams` - Create a new diagram
  - Request: `{ diagramType: string, d2Text: string }`
  - Response: `{ diagramId, userId, diagramType, d2Text, svgContent, createdAt }`

- `GET /diagrams` - Get all user diagrams
  - Response: Array of diagram objects

- `GET /diagrams/{diagramId}` - Get a specific diagram
  - Response: Diagram object

- `DELETE /diagrams/{diagramId}` - Delete a diagram
  - Response: 204 No Content

## Features

### Diagram Editor
- Navigate to `/editor` or click "Editor" in the sidebar
- Enter D2 code in the text area
- Select diagram type (architecture, sequence, or flow)
- Click "Render Diagram" to generate SVG
- View the rendered diagram in the preview panel

### Diagram List
- Navigate to `/diagrams` or click "My Diagrams" in the sidebar
- View all your created diagrams
- Click the eye icon to view a diagram
- Click the delete icon to remove a diagram

### Theme Toggle
- Click the sun/moon icon in the app bar to switch between light and dark themes

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend API has CORS enabled for `http://localhost:3000`.

### 401 Unauthorized
Make sure you have a valid auth token set in localStorage.

### API Connection Failed
Verify that your UMLEditor backend is running and accessible at the configured URL.

## Project Structure

```
src/
├── api/
│   ├── client.ts           # Axios client with auth interceptor
│   ├── diagramService.ts   # Diagram API methods
│   └── types.ts            # TypeScript interfaces
├── components/
│   ├── DiagramEditor.tsx   # Main editor component
│   ├── DiagramViewer.tsx   # SVG viewer with zoom/pan
│   └── Layout.tsx          # App layout with sidebar
├── pages/
│   └── DiagramList.tsx     # Diagram list page
├── theme/
│   ├── theme.ts            # MUI theme configuration
│   └── ThemeProvider.tsx   # Theme context provider
├── App.tsx                 # Main app with routing
└── main.tsx                # Entry point
```
