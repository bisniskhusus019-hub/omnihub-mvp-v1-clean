import { supabase } from './supabaseStub';

export async function getClients() {
  const { data } = await supabase.from('business_clients').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getFinance() {
  const { data } = await supabase.from('finance_entries').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getSops() {
  const { data } = await supabase.from('sop_documents').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function addClient(row: Record<string, any>) {
  const { data, error } = await supabase.from('business_clients').insert(row).select('*').single();
  if (error) throw error;
  return data;
}

export async function addFinance(row: Record<string, any>) {
  const { data, error } = await supabase.from('finance_entries').insert(row).select('*').single();
  if (error) throw error;
  return data;
}

export async function addSop(row: Record<string, any>) {
  const { data, error } = await supabase.from('sop_documents').insert(row).select('*').single();
  if (error) throw error;
  return data;
}
