# d2-diagram-frontend
Frontend application for the D2 Diagram Editor project. Built with React, it provides a web-based interface for editing, visualizing, and managing D2 diagrams. Features include real-time diagram rendering, user authentication, and seamless integration with the backend D2 diagram API.

## 🏗️ Architecture

A modern, serverless web application for creating and managing UML diagrams using D2 (Declarative Diagramming) syntax. The application features a React-based frontend integrated with AWS cloud services for authentication, storage, and diagram rendering.

### System Architecture

#### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           React SPA (TypeScript + Vite)                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │  │
│  │  │  Material  │  │   React    │  │  Axios HTTP     │   │  │
│  │  │     UI     │  │   Router   │  │     Client      │   │  │
│  │  └────────────┘  └────────────┘  └─────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS Cloud Services                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               AWS API Gateway (REST)                     │  │
│  │         https://ipq2q6g9pd.execute-api.us-east-1...     │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┴─────────────────────────────────┐  │
│  │            AWS Lambda Functions (Node.js/Python)         │  │
│  │  • Create Diagram  • Get Diagrams  • Delete Diagram     │  │
│  └────┬────────────────────────────────────────┬────────────┘  │
│       │                                         │                │
│  ┌────▼──────────────┐                    ┌────▼────────────┐  │
│  │  Amazon S3        │                    │   DynamoDB      │  │
│  │  (SVG Storage)    │                    │   (Metadata)    │  │
│  │  diagrams-bucket  │                    │  diagrams-table │  │
│  └───────────────────┘                    └─────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               AWS Cognito User Pool                      │  │
│  │  • User Authentication  • Google SSO  • JWT Tokens       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

---

### Frontend Architecture

#### Technology Stack

- **React 18.2** - Component-based UI library (functional components with hooks)
- **TypeScript 5.3** - Static typing and enhanced developer experience
- **Vite 5.1** - Fast build tool and development server with HMR

#### UI Components & Styling
- **Material UI v5.15** - Comprehensive React component library
  - `@mui/material` - Core components
  - `@mui/icons-material` - Icon set
  - `@emotion/react` & `@emotion/styled` - CSS-in-JS styling
- **Custom Theme System** - Light/Dark mode with persistent user preference

#### Routing & Navigation
- **React Router v6.22** - Client-side routing with protected routes
  - Hash-based routing for OAuth callbacks
  - Nested routes for app layout

#### HTTP Communication
- **Axios 1.6.7** - Promise-based HTTP client
  - Request/response interceptors
  - Automatic JWT token injection
  - Error handling middleware

#### State Management
- **React Context API** - Authentication state management
- **Local Component State** - UI state (useState, useEffect)
- **LocalStorage** - Token persistence

#### Diagram Viewing
- **react-zoom-pan-pinch 3.4.4** - Interactive SVG viewer
  - Zoom controls (in/out/reset)
  - Pan functionality
  - Touch-friendly

---

### Project Structure

```
UMLEditorWeb/
├── public/                          # Static assets
├── src/
│   ├── api/                         # API Layer
│   │   ├── client.ts               # Axios instance with interceptors
│   │   ├── diagramService.ts       # Diagram CRUD operations
│   │   └── types.ts                # API TypeScript interfaces
│   │
│   ├── components/                  # Reusable UI Components
│   │   ├── CognitoNotConfigured.tsx # Setup wizard
│   │   ├── DiagramEditor.tsx        # D2 code editor + render
│   │   ├── DiagramViewer.tsx        # SVG display with zoom/pan
│   │   ├── Layout.tsx               # App shell (sidebar, header)
│   │   ├── ProtectedRoute.tsx       # Auth route guard
│   │   └── UserProfileDialog.tsx    # User info modal
│   │
│   ├── config/                      # Configuration
│   │   └── cognito.ts              # Cognito settings & validation
│   │
│   ├── context/                     # React Context Providers
│   │   └── AuthContext.tsx         # Authentication state & actions
│   │
│   ├── pages/                       # Page Components (Routes)
│   │   ├── DiagramList.tsx         # Diagram management page
│   │   ├── Login.tsx               # Login page with SSO
│   │   └── OAuthCallback.tsx       # OAuth redirect handler
│   │
│   ├── services/                    # Business Logic Services
│   │   └── authService.ts          # Cognito authentication logic
│   │
│   ├── theme/                       # Material UI Theming
│   │   ├── theme.ts                # Theme definitions
│   │   └── ThemeProvider.tsx       # Theme context provider
│   │
│   ├── App.tsx                      # Main app component + routing
│   ├── main.tsx                     # Application entry point
│   ├── env.d.ts                     # TypeScript env variable types
│   └── vite-env.d.ts               # Vite type definitions
│
├── .env.development                 # Development environment vars
├── .env.production                  # Production environment vars
├── .env.local.example              # Local override template
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
```