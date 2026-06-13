import { supabase } from './supabaseStub';

export async function getWorkflows() {
  const { data } = await supabase.from('automation_workflows').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getCalendar() {
  const { data } = await supabase.from('content_calendar_items').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getTickets() {
  const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getArticles() {
  const { data } = await supabase.from('knowledge_base_articles').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getFeedback() {
  const { data } = await supabase.from('feedback_items').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function addWorkflow(row: Record<string, any>) {
  const { data, error } = await supabase.from('automation_workflows').insert(row).select('*').single();
  if (error) throw error;
  return data;
}

export async function addCalendar(row: Record<string, any>) {
  const { data, error } = await supabase.from('content_calendar_items').insert(row).select('*').single();
  if (error) throw error;
  return data;
}

export async function addTicket(row: Record<string, any>) {
  const { data, error } = await supabase.from('support_tickets').insert(row).select('*').single();
  if (error) throw error;
  return data;
}
