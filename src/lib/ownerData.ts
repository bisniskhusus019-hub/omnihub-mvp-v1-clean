import { supabase } from './supabaseStub';

export async function getOwnerMetrics() {
  const { data } = await supabase.from('platform_metrics').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getOwnerAlerts() {
  const { data } = await supabase.from('admin_alerts').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getOwnerLogs() {
  const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getOwnerPlans() {
  const { data } = await supabase.from('subscription_plans').select('*').order('price_monthly', { ascending: true });
  return data || [];
}
