/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BACKEND_API_URL: string;
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
