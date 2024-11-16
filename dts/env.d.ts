/// <reference types="vite/client" />

/* UPDATE DEPENDING ON YOUR PROJRCT NEEDS */

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_KEY: string
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}