import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://bbgcvexhjvcvbowhxabc.supabase.co';

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_e5YSuryYTC47WsEeXfUAfg_iKO9uMRx';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
