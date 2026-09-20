import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Supabase client for Expo. Auth session is persisted via SecureStore.
 * Never bundle the service-role key — privileged work lives in Edge Functions.
 */
export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          storage: {
            getItem: (key) => SecureStore.getItemAsync(key),
            setItem: (key, value) => SecureStore.setItemAsync(key, value),
            removeItem: (key) => SecureStore.deleteItemAsync(key),
          },
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL/ANON_KEY.');
  return supabase;
}
