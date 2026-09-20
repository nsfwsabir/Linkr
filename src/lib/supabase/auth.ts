import { requireSupabase } from './client';
import type { LinkMetadata } from '../../types';

/** Google OAuth via Supabase Auth (native flow handled by expo-web-browser). */
export async function signInWithGoogle() {
  const sb = requireSupabase();
  return sb.auth.signInWithOAuth({ provider: 'google', options: { skipBrowserRedirect: true } });
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const sb = requireSupabase();
  return sb.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
}

export async function signInWithEmail(email: string, password: string) {
  const sb = requireSupabase();
  return sb.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const sb = requireSupabase();
  return sb.auth.signOut();
}

/** Server-side metadata preview via Edge Function (SSRF-safe, see supabase/functions). */
export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  const sb = requireSupabase();
  const { data, error } = await sb.functions.invoke('fetch-link-metadata', { body: { url } });
  if (error) throw error;
  return data as LinkMetadata;
}
