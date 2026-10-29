import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getDeviceId = (): string => {
  const stored = window.localStorage.getItem('sakhi-device-id');
  if (stored) return stored;
  const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `sakhi-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem('sakhi-device-id', id);
  return id;
};

export const deviceId = getDeviceId();

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { 'x-sakhi-device': deviceId } },
    })
  : null;

export const hasSupabaseConfig = Boolean(supabase);
