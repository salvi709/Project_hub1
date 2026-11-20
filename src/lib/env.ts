export interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isSupabaseConfigured: boolean;
  validationIssues: string[];
}

const PLACEHOLDER_URLS = [
  'https://your-project-ref.supabase.co',
  'MY_SUPABASE_URL',
  'your-supabase-url',
];

const PLACEHOLDER_KEYS = [
  'your-supabase-anon-key',
  'MY_SUPABASE_ANON_KEY',
];

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function getEnvConfig(): EnvConfig {
  const rawUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
  const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

  const issues: string[] = [];

  if (!rawUrl || PLACEHOLDER_URLS.includes(rawUrl)) {
    issues.push('VITE_SUPABASE_URL is not configured.');
  } else if (!isValidHttpUrl(rawUrl)) {
    issues.push('VITE_SUPABASE_URL must be a valid http(s) URL.');
  }

  if (!rawKey || PLACEHOLDER_KEYS.includes(rawKey)) {
    issues.push('VITE_SUPABASE_ANON_KEY is not configured.');
  }

  return {
    supabaseUrl: rawUrl,
    supabaseAnonKey: rawKey,
    isSupabaseConfigured: issues.length === 0,
    validationIssues: issues,
  };
}

export const env = getEnvConfig();
