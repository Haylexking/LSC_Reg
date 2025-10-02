import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables check:', {
    supabaseUrl,
    supabaseAnonKey: supabaseAnonKey ? 'exists' : 'missing',
    allEnv: import.meta.env
  });
  throw new Error('Missing Supabase environment variables - Please restart the dev server');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BootcampRegistration {
  id?: string;
  full_name: string;
  email: string;
  phone_number: string;
  skill: string;
  membership_status: 'Member' | 'Visitor';
  payment_status?: 'pending' | 'completed' | 'failed';
  payment_reference?: string;
  created_at?: string;
  updated_at?: string;
}
