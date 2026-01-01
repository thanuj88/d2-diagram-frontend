// Environment configuration type definitions
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_COGNITO_DOMAIN: string;
  readonly VITE_COGNITO_REGION: string;
  readonly VITE_MOCK_AUTH?: string;
  readonly VITE_ENABLE_DIAGRAM_EXPORT?: string;
  readonly VITE_ENABLE_DIAGRAM_SHARE?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_MAX_DIAGRAM_SIZE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
