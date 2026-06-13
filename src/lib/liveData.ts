import { supabase } from './supabaseStub';

export async function getPlatformMetrics() {
  const { data, error } = await supabase.from('platform_metrics').select('*');
  if (error) return [];
  return data || [];
}
