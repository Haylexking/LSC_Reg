import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Dev-time no-op client: chainable builder that returns resolved promises.
  console.warn('NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Supabase client will be a no-op.');
  const noopError = new Error('Supabase env missing');

  const makeNoopBuilder = () => {
    const builder: any = {
      _ops: [] as string[],
      insert(..._args: unknown[]) { builder._ops.push('insert'); return builder; },
      select(..._args: unknown[]) { builder._ops.push('select'); return builder; },
      maybeSingle() { builder._ops.push('maybeSingle'); return builder; },
      update(..._args: unknown[]) { builder._ops.push('update'); return builder; },
      order(..._args: unknown[]) { builder._ops.push('order'); return builder; },
      eq(..._args: unknown[]) { builder._ops.push('eq'); return builder; },
      then(_onfulfilled?: any, _onrejected?: any) { return Promise.resolve({ data: null, error: noopError }); },
      catch(_onRejected?: any) { return builder; }
    };

    return builder;
  };

  supabaseClient = ({ from: () => makeNoopBuilder() } as unknown) as any;
}

export const supabase = supabaseClient as any;

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
